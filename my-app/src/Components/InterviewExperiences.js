// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import {
//   Container,
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Paper,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material"
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   QuestionAnswer as QuestionIcon,
//   Lightbulb as TipIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Work as WorkIcon,
//   ArrowBack as ArrowBackIcon,
// } from "@mui/icons-material"
// import PageHeader from "./PageHeader"

// // Mock data for demonstration
// const MOCK_INTERVIEWS = [
//   {
//     id: 1,
//     company: "Google",
//     candidateName: "John Doe",
//     interviewerName: "Jane Smith",
//     year: "2023",
//     type: "Internship",
//     questions: [
//       {
//         question: "Explain the difference between let, const, and var in JavaScript.",
//         answer:
//           "var is function-scoped, while let and const are block-scoped. const creates a variable that cannot be reassigned, while let allows reassignment. var variables are hoisted to the top of their scope.",
//       },
//       {
//         question: "How would you implement a binary search tree?",
//         answer:
//           "A binary search tree is a data structure where each node has at most two children, with all nodes in the left subtree having values less than the node, and all nodes in the right subtree having values greater than the node. Implementation involves creating node objects with value, left, and right properties, and methods for insertion, deletion, and traversal.",
//       },
//     ],
//     tips: "Prepare for algorithm questions and system design. They focus a lot on JavaScript fundamentals.",
//     tags: ["Google", "Internship", "2023", "Frontend"],
//   },
//   {
//     id: 2,
//     company: "Microsoft",
//     candidateName: "Sarah Williams",
//     interviewerName: "Robert Johnson",
//     year: "2023",
//     type: "Placement",
//     questions: [
//       {
//         question: "Explain the concept of virtual DOM in React.",
//         answer:
//           "Virtual DOM is a lightweight copy of the actual DOM in memory. React uses it to improve performance by minimizing direct manipulation of the DOM. When state changes, React creates a new virtual DOM, compares it with the previous one (diffing), and then only updates the real DOM with the necessary changes.",
//       },
//     ],
//     tips: "Focus on React concepts and be prepared to write code on a whiteboard.",
//     tags: ["Microsoft", "Placement", "2023", "React"],
//   },
// ]

// const InterviewExperiences = () => {
//   const navigate = useNavigate()
//   const [interviews, setInterviews] = useState(MOCK_INTERVIEWS)
//   const [openDialog, setOpenDialog] = useState(false)
//   const [viewDialog, setViewDialog] = useState(false)
//   const [selectedInterview, setSelectedInterview] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterYear, setFilterYear] = useState("")
//   const [filterType, setFilterType] = useState("")
//   const [formData, setFormData] = useState({
//     company: "",
//     candidateName: "",
//     interviewerName: "",
//     year: new Date().getFullYear().toString(),
//     type: "Internship",
//     questions: [{ question: "", answer: "" }],
//     tips: "",
//     tags: [],
//   })

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })

//     // Automatically add company, type, and year as tags
//     if (name === "company" || name === "type" || name === "year") {
//       const updatedTags = [
//         ...formData.tags.filter((tag) => !(tag === formData.company || tag === formData.type || tag === formData.year)),
//       ]

//       if (value) {
//         updatedTags.push(value)
//       }

//       setFormData((prev) => ({
//         ...prev,
//         tags: updatedTags,
//       }))
//     }
//   }

//   // Handle question changes
//   const handleQuestionChange = (index, field, value) => {
//     const updatedQuestions = [...formData.questions]
//     updatedQuestions[index][field] = value
//     setFormData({
//       ...formData,
//       questions: updatedQuestions,
//     })
//   }

//   // Add another question field
//   const addQuestionField = () => {
//     setFormData({
//       ...formData,
//       questions: [...formData.questions, { question: "", answer: "" }],
//     })
//   }

//   // Remove question field
//   const removeQuestionField = (index) => {
//     const updatedQuestions = [...formData.questions]
//     updatedQuestions.splice(index, 1)
//     setFormData({
//       ...formData,
//       questions: updatedQuestions,
//     })
//   }

//   // Handle tag input
//   const handleTagInput = (e) => {
//     if (e.key === "Enter" && e.target.value) {
//       const newTag = e.target.value.trim()
//       if (newTag && !formData.tags.includes(newTag)) {
//         setFormData({
//           ...formData,
//           tags: [...formData.tags, newTag],
//         })
//       }
//       e.target.value = ""
//     }
//   }

//   // Remove tag
//   const removeTag = (tagToRemove) => {
//     setFormData({
//       ...formData,
//       tags: formData.tags.filter((tag) => tag !== tagToRemove),
//     })
//   }

//   // Handle form submission
//   const handleSubmit = () => {
//     // In a real app, you would send this data to your Flask backend
//     // For now, we'll just add it to our local state
//     const newInterview = {
//       id: interviews.length + 1,
//       ...formData,
//     }

//     setInterviews([...interviews, newInterview])
//     setOpenDialog(false)

//     // Reset form
//     setFormData({
//       company: "",
//       candidateName: "",
//       interviewerName: "",
//       year: new Date().getFullYear().toString(),
//       type: "Internship",
//       questions: [{ question: "", answer: "" }],
//       tips: "",
//       tags: [],
//     })
//   }

//   // View interview details
//   const handleViewInterview = (interview) => {
//     setSelectedInterview(interview)
//     setViewDialog(true)
//   }

//   // Filter interviews based on search and filters
//   const filteredInterviews = interviews.filter((interview) => {
//     const matchesSearch =
//       interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       interview.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

//     const matchesYear = filterYear ? interview.year === filterYear : true
//     const matchesType = filterType ? interview.type === filterType : true

//     return matchesSearch && matchesYear && matchesType
//   })

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//       <PageHeader title="Interview Experiences" />

//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
//           <IconButton onClick={() => navigate("/internships-placements")}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h4" component="h1" fontWeight="bold">
//             Interview Experiences
//           </Typography>
//         </Box>

//         {/* Search and Filter Section */}
//         <Paper sx={{ p: 2, mb: 4 }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Search by Company or Candidate"
//                 variant="outlined"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel>Filter by Year</InputLabel>
//                 <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} label="Filter by Year">
//                   <MenuItem value="">All Years</MenuItem>
//                   <MenuItem value="2023">2023</MenuItem>
//                   <MenuItem value="2022">2022</MenuItem>
//                   <MenuItem value="2021">2021</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel>Filter by Type</InputLabel>
//                 <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter by Type">
//                   <MenuItem value="">All Types</MenuItem>
//                   <MenuItem value="Internship">Internship</MenuItem>
//                   <MenuItem value="Placement">Placement</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
//                 Add New
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Results Section */}
//         <Grid container spacing={3}>
//           {filteredInterviews.length > 0 ? (
//             filteredInterviews.map((interview) => (
//               <Grid item xs={12} md={6} key={interview.id}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     cursor: "pointer",
//                     transition: "transform 0.2s",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow: 4,
//                     },
//                   }}
//                   onClick={() => handleViewInterview(interview)}
//                 >
//                   <CardContent>
//                     <Typography variant="h5" component="h2" gutterBottom>
//                       {interview.company}
//                     </Typography>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
//                       <Typography variant="body2" color="text.secondary">
//                         {interview.candidateName}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
//                       <Chip
//                         label={interview.type}
//                         color={interview.type === "Internship" ? "primary" : "secondary"}
//                         size="small"
//                       />
//                       <Chip label={`Year: ${interview.year}`} size="small" />
//                       {interview.tags.slice(0, 3).map((tag, index) => (
//                         <Chip key={index} label={tag} size="small" variant="outlined" />
//                       ))}
//                       {interview.tags.length > 3 && (
//                         <Chip label={`+${interview.tags.length - 3} more`} size="small" variant="outlined" />
//                       )}
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       {interview.questions.length} question{interview.questions.length !== 1 ? "s" : ""} • Click to view
//                       details
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))
//           ) : (
//             <Grid item xs={12}>
//               <Paper sx={{ p: 3, textAlign: "center" }}>
//                 <Typography variant="h6">No results found</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Try adjusting your search or filters, or add new interview experiences.
//                 </Typography>
//               </Paper>
//             </Grid>
//           )}
//         </Grid>

//         {/* Add New Interview Dialog */}
//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
//           <DialogTitle>Add New Interview Experience</DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Company Name"
//                   name="company"
//                   value={formData.company}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Candidate Name"
//                   name="candidateName"
//                   value={formData.candidateName}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Interviewer Name (if remembered)"
//                   name="interviewerName"
//                   value={formData.interviewerName}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Type</InputLabel>
//                   <Select name="type" value={formData.type} onChange={handleInputChange} label="Type">
//                     <MenuItem value="Internship">Internship</MenuItem>
//                     <MenuItem value="Placement">Placement</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Year"
//                   name="year"
//                   value={formData.year}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </Grid>
//             </Grid>

//             <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
//               Interview Questions & Answers
//             </Typography>

//             {formData.questions.map((q, index) => (
//               <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label={`Question ${index + 1}`}
//                       value={q.question}
//                       onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Answer"
//                       value={q.answer}
//                       onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
//                       multiline
//                       rows={3}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
//                     {formData.questions.length > 1 && (
//                       <IconButton color="error" onClick={() => removeQuestionField(index)} aria-label="remove question">
//                         <DeleteIcon />
//                       </IconButton>
//                     )}
//                   </Grid>
//                 </Grid>
//               </Box>
//             ))}

//             <Button variant="outlined" startIcon={<AddIcon />} onClick={addQuestionField} sx={{ mb: 3 }}>
//               Add Another Question
//             </Button>

//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Tips for Interview
//             </Typography>
//             <TextField
//               fullWidth
//               label="Interview Tips"
//               name="tips"
//               value={formData.tips}
//               onChange={handleInputChange}
//               multiline
//               rows={3}
//               sx={{ mb: 3 }}
//             />

//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Tags
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
//               {formData.tags.map((tag, index) => (
//                 <Chip key={index} label={tag} onDelete={() => removeTag(tag)} size="small" />
//               ))}
//               <TextField
//                 label="Add tag (press Enter)"
//                 variant="outlined"
//                 size="small"
//                 onKeyDown={handleTagInput}
//                 sx={{ minWidth: 200 }}
//               />
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={
//                 !formData.company || !formData.candidateName || formData.questions.some((q) => !q.question || !q.answer)
//               }
//             >
//               Submit
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* View Interview Dialog */}
//         <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
//           {selectedInterview && (
//             <>
//               <DialogTitle>
//                 <Typography variant="h5">{selectedInterview.company} Interview Experience</Typography>
//               </DialogTitle>
//               <DialogContent>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
//                       <Typography variant="body1">
//                         <strong>Candidate:</strong> {selectedInterview.candidateName}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   {selectedInterview.interviewerName && (
//                     <Grid item xs={12} md={6}>
//                       <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                         <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
//                         <Typography variant="body1">
//                           <strong>Interviewer:</strong> {selectedInterview.interviewerName}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   )}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
//                       <Typography variant="body1">
//                         <strong>Year:</strong> {selectedInterview.year}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <WorkIcon sx={{ mr: 1, color: "text.secondary" }} />
//                       <Typography variant="body1">
//                         <strong>Type:</strong> {selectedInterview.type}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>

//                 <Divider sx={{ my: 2 }} />

//                 <Typography variant="h6" gutterBottom>
//                   Questions & Answers
//                 </Typography>
//                 <List>
//                   {selectedInterview.questions.map((q, index) => (
//                     <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: "column", mb: 2 }}>
//                       <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
//                         <QuestionIcon sx={{ mr: 1, mt: 0.5, color: "primary.main" }} />
//                         <ListItemText
//                           primary={
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               {q.question}
//                             </Typography>
//                           }
//                         />
//                       </Box>
//                       <Box sx={{ pl: 4, mt: 1, width: "100%" }}>
//                         <Typography variant="body1">{q.answer}</Typography>
//                       </Box>
//                     </ListItem>
//                   ))}
//                 </List>

//                 {selectedInterview.tips && (
//                   <>
//                     <Divider sx={{ my: 2 }} />
//                     <Typography variant="h6" gutterBottom>
//                       Tips for Interview
//                     </Typography>
//                     <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
//                       <TipIcon sx={{ mr: 1, mt: 0.5, color: "warning.main" }} />
//                       <Typography variant="body1">{selectedInterview.tips}</Typography>
//                     </Box>
//                   </>
//                 )}

//                 <Divider sx={{ my: 2 }} />
//                 <Typography variant="subtitle1" gutterBottom>
//                   Tags
//                 </Typography>
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                   {selectedInterview.tags.map((tag, index) => (
//                     <Chip key={index} label={tag} size="small" />
//                   ))}
//                 </Box>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setViewDialog(false)}>Close</Button>
//               </DialogActions>
//             </>
//           )}
//         </Dialog>
//       </Container>
//     </Box>
//   )
// }

// export default InterviewExperiences

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  QuestionAnswer as QuestionIcon,
  Lightbulb as TipIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"
import PageHeader from "./PageHeader"

const InterviewExperiences = () => {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [viewDialog, setViewDialog] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [filterType, setFilterType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [formData, setFormData] = useState({
    company: "",
    candidateName: "",
    interviewerName: "",
    year: new Date().getFullYear().toString(),
    type: "Internship",
    questions: [{ question: "", answer: "" }],
    tips: "",
    tags: [],
  })

  // Fetch interview experiences from backend
  useEffect(() => {
    fetchInterviews()
  }, [])

  const fetchInterviews = async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      // Build query string from params
      const queryParams = new URLSearchParams()
      if (params.company) queryParams.append("company", params.company)
      if (params.year) queryParams.append("year", params.year)
      if (params.type) queryParams.append("type", params.type)

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:5000/interview-experiences${queryString}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setInterviews(data.interviews || [])
    } catch (err) {
      console.error("Failed to fetch interviews:", err)
      setError(err.message)
      setSnackbar({
        open: true,
        message: `Failed to load interview experiences: ${err.message}`,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle search and filter
  const handleSearch = () => {
    const params = {}
    if (searchTerm) params.company = searchTerm
    if (filterYear) params.year = filterYear
    if (filterType) params.type = filterType

    fetchInterviews(params)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Automatically add company, type, and year as tags
    if (name === "company" || name === "type" || name === "year") {
      const updatedTags = [
        ...formData.tags.filter((tag) => !(tag === formData.company || tag === formData.type || tag === formData.year)),
      ]

      if (value) {
        updatedTags.push(value)
      }

      setFormData((prev) => ({
        ...prev,
        tags: updatedTags,
      }))
    }
  }

  // Handle question changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[index][field] = value
    setFormData({
      ...formData,
      questions: updatedQuestions,
    })
  }

  // Add another question field
  const addQuestionField = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: "", answer: "" }],
    })
  }

  // Remove question field
  const removeQuestionField = (index) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions.splice(index, 1)
    setFormData({
      ...formData,
      questions: updatedQuestions,
    })
  }

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newTag = e.target.value.trim()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
        })
      }
      e.target.value = ""
    }
  }

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:5000/interview-experiences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: formData.company,
          candidateName: formData.candidateName,
          interviewerName: formData.interviewerName,
          year: formData.year,
          type: formData.type,
          questions: formData.questions,
          tips: formData.tips,
          tags: formData.tags,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Add the new interview to the state
      setInterviews([data.interview, ...interviews])
      setOpenDialog(false)

      // Show success message
      setSnackbar({
        open: true,
        message: "Interview experience added successfully!",
        severity: "success",
      })

      // Reset form
      setFormData({
        company: "",
        candidateName: "",
        interviewerName: "",
        year: new Date().getFullYear().toString(),
        type: "Internship",
        questions: [{ question: "", answer: "" }],
        tips: "",
        tags: [],
      })
    } catch (err) {
      console.error("Failed to submit interview experience:", err)
      setSnackbar({
        open: true,
        message: `Failed to add interview experience: ${err.message}`,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // View interview details
  const handleViewInterview = async (interviewId) => {
    setLoading(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:5000/interview-experiences/${interviewId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setSelectedInterview(data.interview)
      setViewDialog(true)
    } catch (err) {
      console.error("Failed to fetch interview details:", err)
      setSnackbar({
        open: true,
        message: `Failed to load interview details: ${err.message}`,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter interviews based on search term (client-side filtering for already loaded data)
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (interview.tags && interview.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))

    return matchesSearch
  })

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PageHeader title="Interview Experiences" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton onClick={() => navigate("http://localhost:5000/internships-placements")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Interview Experiences
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by Company or Candidate"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Year</InputLabel>
                <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} label="Filter by Year">
                  <MenuItem value="">All Years</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Type</InputLabel>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter by Type">
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                  <MenuItem value="Placement">Placement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                Add New
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />}>
              Search
            </Button>
          </Box>
        </Paper>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error message */}
        {error && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: "error.light" }}>
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          </Paper>
        )}

        {/* Results Section */}
        <Grid container spacing={3}>
          {!loading && filteredInterviews.length > 0
            ? filteredInterviews.map((interview) => (
                <Grid item xs={12} md={6} key={interview.id}>
                  <Card
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleViewInterview(interview.id)}
                  >
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {interview.company}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {interview.candidateName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        <Chip
                          label={interview.type}
                          color={interview.type === "Internship" ? "primary" : "secondary"}
                          size="small"
                        />
                        <Chip label={`Year: ${interview.year}`} size="small" />
                        {interview.tags &&
                          interview.tags
                            .slice(0, 3)
                            .map((tag, index) => <Chip key={index} label={tag} size="small" variant="outlined" />)}
                        {interview.tags && interview.tags.length > 3 && (
                          <Chip label={`+${interview.tags.length - 3} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {interview.questions ? interview.questions.length : 0} question
                        {interview.questions && interview.questions.length !== 1 ? "s" : ""} • Click to view details
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : !loading && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6">No results found</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filters, or add new interview experiences.
                    </Typography>
                  </Paper>
                </Grid>
              )}
        </Grid>

        {/* Add New Interview Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Interview Experience</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Candidate Name"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Interviewer Name (if remembered)"
                  name="interviewerName"
                  value={formData.interviewerName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select name="type" value={formData.type} onChange={handleInputChange} label="Type">
                    <MenuItem value="Internship">Internship</MenuItem>
                    <MenuItem value="Placement">Placement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Interview Questions & Answers
            </Typography>

            {formData.questions.map((q, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={`Question ${index + 1}`}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Answer"
                      value={q.answer}
                      onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {formData.questions.length > 1 && (
                      <IconButton color="error" onClick={() => removeQuestionField(index)} aria-label="remove question">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button variant="outlined" startIcon={<AddIcon />} onClick={addQuestionField} sx={{ mb: 3 }}>
              Add Another Question
            </Button>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Tips for Interview
            </Typography>
            <TextField
              fullWidth
              label="Interview Tips"
              name="tips"
              value={formData.tips}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {formData.tags.map((tag, index) => (
                <Chip key={index} label={tag} onDelete={() => removeTag(tag)} size="small" />
              ))}
              <TextField
                label="Add tag (press Enter)"
                variant="outlined"
                size="small"
                onKeyDown={handleTagInput}
                sx={{ minWidth: 200 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.company ||
                !formData.candidateName ||
                formData.questions.some((q) => !q.question || !q.answer)
              }
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Interview Dialog */}
        <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
          {selectedInterview && (
            <>
              <DialogTitle>
                <Typography variant="h5">{selectedInterview.company} Interview Experience</Typography>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body1">
                        <strong>Candidate:</strong> {selectedInterview.candidateName}
                      </Typography>
                    </Box>
                  </Grid>
                  {selectedInterview.interviewerName && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body1">
                          <strong>Interviewer:</strong> {selectedInterview.interviewerName}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body1">
                        <strong>Year:</strong> {selectedInterview.year}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <WorkIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body1">
                        <strong>Type:</strong> {selectedInterview.type}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Questions & Answers
                </Typography>
                <List>
                  {selectedInterview.questions &&
                    selectedInterview.questions.map((q, index) => (
                      <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: "column", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                          <QuestionIcon sx={{ mr: 1, mt: 0.5, color: "primary.main" }} />
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="bold">
                                {q.question}
                              </Typography>
                            }
                          />
                        </Box>
                        <Box sx={{ pl: 4, mt: 1, width: "100%" }}>
                          <Typography variant="body1">{q.answer}</Typography>
                        </Box>
                      </ListItem>
                    ))}
                </List>

                {selectedInterview.tips && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Tips for Interview
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <TipIcon sx={{ mr: 1, mt: 0.5, color: "warning.main" }} />
                      <Typography variant="body1">{selectedInterview.tips}</Typography>
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedInterview.tags &&
                    selectedInterview.tags.map((tag, index) => <Chip key={index} label={tag} size="small" />)}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewDialog(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}

export default InterviewExperiences

