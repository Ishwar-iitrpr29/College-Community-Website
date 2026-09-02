import os
import io
import requests
import PyPDF2
from dotenv import load_dotenv
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec
import logging

logger = logging.getLogger(__name__)

# Load env variables
load_dotenv()

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')
else:
    logger.warning("Gemini API key not configured properly!")

# Initialize Pinecone
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "college-platform-rag")

pc = None
index = None

def init_pinecone():
    global pc, index, PINECONE_API_KEY
    if not PINECONE_API_KEY:
        PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
        
    if not PINECONE_API_KEY or PINECONE_API_KEY == "your_pinecone_api_key_here":
        logger.warning("Pinecone API key not configured properly!")
        return False
        
    try:
        if not pc:
            pc = Pinecone(api_key=PINECONE_API_KEY)
            
        # Check if index exists, create if not
        existing_indexes = [idx.name for idx in pc.list_indexes()]
        if PINECONE_INDEX_NAME not in existing_indexes:
            logger.info(f"Creating Pinecone index: {PINECONE_INDEX_NAME}")
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=768, # Gemini embedding dimension
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        
        if not index:
            index = pc.Index(PINECONE_INDEX_NAME)
        return True
    except Exception as e:
        logger.error(f"Error initializing Pinecone: {e}")
        return False

# Try to initialize immediately, but we can also retry later
init_pinecone()


def get_embedding(text):
    """Generate an embedding for the given text using Gemini."""
    global GEMINI_API_KEY
    if not GEMINI_API_KEY:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None
    try:
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document",
            output_dimensionality=768
        )
        return result['embedding']
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        return None

def extract_text_from_pdf(url):
    """Download a PDF from a URL and extract its text."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        pdf_file = io.BytesIO(response.content)
        reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n\n"
            
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def chunk_text(text, chunk_size=1000, overlap=100):
    """Split text into smaller chunks."""
    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def ingest_to_pinecone(text, metadata, doc_id_prefix):
    """Chunk text, generate embeddings, and upsert to Pinecone."""
    global index
    if not index:
        init_pinecone()
        
    if not index:
        logger.error("Pinecone index not initialized.")
        return False
        
    chunks = chunk_text(text)
    if not chunks:
        return False
        
    vectors_to_upsert = []
    
    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        if embedding:
            chunk_id = f"{doc_id_prefix}_chunk_{i}"
            chunk_metadata = metadata.copy()
            chunk_metadata["text"] = chunk
            chunk_metadata["source_id"] = doc_id_prefix
            
            vectors_to_upsert.append((chunk_id, embedding, chunk_metadata))
            
    if vectors_to_upsert:
        try:
            # Upsert in batches of 100
            batch_size = 100
            for i in range(0, len(vectors_to_upsert), batch_size):
                index.upsert(vectors=vectors_to_upsert[i:i+batch_size])
            return True
        except Exception as e:
            logger.error(f"Error upserting to Pinecone: {e}")
            return False
    return False

def query_rag(user_message, context_id=None):
    """Process a user query, retrieve context, and generate a response."""
    # Lazy init in case env vars were loaded late
    global GEMINI_API_KEY
    if not GEMINI_API_KEY:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            
    if not GEMINI_API_KEY:
        return "I'm currently offline because my Gemini API key is missing."
        
    global PINECONE_API_KEY
    if not PINECONE_API_KEY:
        PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
        
    if not index:
        init_pinecone()
        
    if not index:
        return "I'm currently offline because my Pinecone index failed to initialize."
        
    try:
        # 1. Embed the user's query
        query_embedding = get_embedding(user_message)
        if not query_embedding:
            return "Sorry, I had trouble processing your question."
            
        # 2. Retrieve top context from Pinecone
        query_params = {
            "vector": query_embedding,
            "top_k": 4,
            "include_metadata": True
        }
        
        if context_id:
            query_params["filter"] = {"source_id": {"$eq": context_id}}
            
        search_results = index.query(**query_params)
        
        context_texts = []
        for match in search_results.get("matches", []):
            if "text" in match.get("metadata", {}):
                context_texts.append(match["metadata"]["text"])
                
        # 3. Construct prompt with context
        context_str = "\n\n---\n\n".join(context_texts)
        
        prompt = f"""
You are the Platform AI, an intelligent assistant for this college community platform. Your primary job is to answer questions based on the uploaded documents, interview experiences, and study materials provided in the CONTEXT below.

CONTEXT FROM UPLOADED MATERIALS:
{context_str}

USER QUESTION:
{user_message}

INSTRUCTIONS:
1. Always prioritize answering the user's question using the CONTEXT provided above.
2. If the user is just greeting you (e.g., "hi", "hello"), respond naturally and politely.
3. If the user asks for a summary or details and the CONTEXT is empty or lacks the information, try your best to provide a helpful answer based on general knowledge, but clearly state that the specific details couldn't be found in the current document. Do not be overly repetitive.
4. Be helpful, concise, and conversational.
        """
        
        # 4. Generate response using Gemini
        response = gemini_model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        logger.error(f"Error in query_chatbot: {e}")
        return f"Sorry, I encountered an error: {str(e)}"

def review_resume(resume_text, job_role="Software Engineering"):
    """Analyze a resume and provide structured feedback using Gemini."""
    if not GEMINI_API_KEY:
        return "Gemini API key is missing. Cannot review resume."
        
    try:
        prompt = f"""
You are an expert Tech Recruiter and Career Coach. 
Please review the following extracted resume text and provide constructive, detailed feedback. 
The candidate is applying for the following position: **{job_role}**

Note on format: The resume is likely using a standard, highly structured LaTeX format (common in Indian engineering colleges like IITs/NITs) containing sections like Education, Projects, Technical Skills, Key Courses, Positions of Responsibility, and Achievements.

Format your response clearly using Markdown with the following headings:
1. **Role Alignment ({job_role})**: How well does this resume fit the target role? What should be emphasized more?
2. **Overall Strengths**: What looks good (impact metrics, strong projects, etc.)?
3. **Areas for Improvement**: What is missing, weak, or poorly phrased?
4. **Missing Keywords/Skills**: Based on the {job_role} role, what keywords or skills should they consider adding if they have experience with them?
5. **Actionable Formatting & Content Tips**: Are there any structural suggestions? (e.g., bullet point structure, ATS readability, quantifying achievements).

RESUME TEXT:
{resume_text}
        """
        
        response = gemini_model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        logger.error(f"Error in review_resume: {e}")
        return f"Sorry, I encountered an error while reviewing the resume: {str(e)}"
