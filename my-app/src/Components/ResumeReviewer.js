import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress,
  Divider,
  Alert,
  AlertTitle,
  TextField
} from '@mui/material';
import UploadFileIcon from '@mui/material/Icon';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ResumeReviewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
      setFeedback(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job_role', jobRole);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/resume-review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred while analyzing the resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
          AI Resume Reviewer
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload your resume and get instant, actionable feedback from our expert Platform AI to help you land your dream tech role.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Box sx={{ mb: 3 }}>
          <DescriptionIcon sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {selectedFile ? selectedFile.name : 'Upload your Resume (PDF)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Max file size: 5MB
          </Typography>

          <TextField
            fullWidth
            label="Target Job Role"
            variant="outlined"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            sx={{ mb: 3, maxWidth: 400 }}
            placeholder="e.g., Data Scientist, Product Manager"
          />
        </Box>

        <Button
          component="label"
          variant="contained"
          size="large"
          startIcon={<DescriptionIcon />}
          sx={{ mr: 2, borderRadius: 2 }}
        >
          {selectedFile ? 'Change File' : 'Select PDF'}
          <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
        </Button>

        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 3, textAlign: 'left' }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Paper>

      {feedback && (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', borderBottom: '2px solid #e0e0e0', pb: 1, mb: 3 }}>
            AI Feedback Report
          </Typography>
          
          <Box sx={{ 
            '& h1, & h2, & h3': { color: '#1565c0', mt: 3 },
            '& p': { lineHeight: 1.7, fontSize: '1.05rem', color: '#333' },
            '& ul': { paddingLeft: '1.5rem', mb: 2 },
            '& li': { mb: 1, color: '#333' },
            '& strong': { color: '#0d47a1' }
          }}>
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ResumeReviewer;
