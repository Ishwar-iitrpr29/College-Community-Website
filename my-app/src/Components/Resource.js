import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Pagination,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Chat as ChatIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import PageHeader from './PageHeader';
import { motion } from 'framer-motion';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const availableTags = [
  'Lecture Notes',
  'Assignment',
  'Solution',
  'Exam',
  'Quiz',
  'Project',
  'Book',
  'Article',
  'Tutorial',
  'Reference',
];

const years = ['2020', '2021', '2022', '2023', '2024'];
const semesters = ['Spring', 'Summer', 'Fall', 'Winter'];

// ResourceSearch Component
const ResourceSearch = ({ onUploadClick, onAdvancedSearch }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      gap: 2, 
      mb: 4 
    }}>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={onUploadClick}
        sx={{ 
          px: 4,
          py: 1,
          fontSize: '1rem'
        }}
      >
        UPLOAD MATERIAL
      </Button>
      <Button
        variant="outlined"
        startIcon={<SearchIcon />}
        onClick={onAdvancedSearch}
        sx={{ 
          px: 4,
          py: 1,
          fontSize: '1rem'
        }}
      >
        SEARCH MATERIALS
      </Button>
    </Box>
  );
};

// ResourcePagination Component
const ResourcePagination = ({ page, count, onChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
        mb: 4,
        '& .MuiPagination-ul': {
          '& .MuiPaginationItem-root': {
            color: 'text.primary',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
      }}
    >
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        shape="rounded"
      />
    </Box>
  );
};

const Resource = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for upload form
  const [openUpload, setOpenUpload] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [year, setYear] = useState('');
  const [uploadSemester, setUploadSemester] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [fileTags, setFileTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // State for search and filters
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchCourseCode, setSearchCourseCode] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchSemester, setSearchSemester] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // State for materials
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for comments
  const [openComments, setOpenComments] = useState(false);
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Add new state for animations
  const [votingAnimation, setVotingAnimation] = useState({});
  const [commentAnimation, setCommentAnimation] = useState({});

  // Add new state for snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch materials
  const fetchMaterials = async (page = 1) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/recent-uploads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data.materials);
      setTotalPages(Math.ceil(response.data.materials.length / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error('Error fetching materials:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch materials. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials(currentPage);
  }, [currentPage]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle upload dialog
  const handleUploadClick = () => {
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
    setSelectedFile(null);
    setFileTitle('');
    setFileDescription('');
    setFileTags([]);
    setCourseCode('');
    setYear('');
    setUploadSemester('');
    setSelectedTags([]);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag) // Remove tag if already selected
        : [...prev, tag] // Add tag if not selected
    );
  };

  // Handle upload submission
  const handleUpload = async () => {
    try {
      if (!courseCode || !description || selectedTags.length === 0) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields (Course Code, Description, and Tags)',
          severity: 'error'
        });
        return;
      }

      if (!selectedFile && !link) {
        setSnackbar({
          open: true,
          message: 'Please either select a file or provide a link',
          severity: 'error'
        });
        return;
      }

      setIsUploading(true);
      const token = localStorage.getItem('token');

      // Create FormData
      const formData = new FormData();
      formData.append("course_code", courseCode);
      formData.append("description", description);
      formData.append("tags", selectedTags.join(','));
      
      if (year) formData.append("year", year);
      if (uploadSemester) formData.append("semester", uploadSemester);

      // Add either file or link
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (link) {
        formData.append("link", link);
      }

      const response = await axios.post(
        'http://localhost:5000/uploads',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: selectedFile ? 'File uploaded successfully!' : 'Link uploaded successfully!',
          severity: 'success'
        });
        handleCloseUpload();
        fetchMaterials();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to upload',
        severity: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Update the handleVote function to properly handle vote switching
  const handleVote = async (materialId, voteType) => {
    try {
      const material = materials.find(m => m.id === materialId);
      const currentVote = material?.userVote;
      const token = localStorage.getItem('token');
      
      // If clicking the same vote type, remove the vote
      if (currentVote === voteType) {
        const response = await axios.post(
          `http://localhost:5000/uploads/${materialId}/vote`,
          { type: 'remove' },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.status === 200) {
          setMaterials(prevMaterials => 
            prevMaterials.map(m => {
              if (m.id === materialId) {
                return {
                  ...m,
                  userVote: null,
                  upvotes: response.data.upvotes,
                  downvotes: response.data.downvotes
                };
              }
              return m;
            })
          );
        }
      } else {
        // If changing vote or voting for the first time
        const response = await axios.post(
          `http://localhost:5000/uploads/${materialId}/vote`,
          { 
            type: voteType,
            previous_vote: currentVote // Send the previous vote to backend
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.status === 200) {
          setMaterials(prevMaterials => 
            prevMaterials.map(m => {
              if (m.id === materialId) {
                // Calculate new vote counts based on the switch
                let newUpvotes = m.upvotes;
                let newDownvotes = m.downvotes;

                // Remove previous vote if exists
                if (currentVote === 'upvote') {
                  newUpvotes--;
                } else if (currentVote === 'downvote') {
                  newDownvotes--;
                }

                // Add new vote
                if (voteType === 'upvote') {
                  newUpvotes++;
                } else if (voteType === 'downvote') {
                  newDownvotes++;
                }

                return {
                  ...m,
                  userVote: voteType,
                  upvotes: response.data.upvotes || newUpvotes,
                  downvotes: response.data.downvotes || newDownvotes
                };
              }
              return m;
            })
          );
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to vote',
        severity: 'error'
      });
    }
  };

  // Handle comment dialog
  const handleCommentsClick = async (materialId) => {
    setCurrentMaterialId(materialId);
    setOpenComments(true);
    await fetchComments(materialId);
  };

  const handleCloseComments = () => {
    setOpenComments(false);
    setCurrentMaterialId(null);
    setCommentText('');
    setComments([]);
  };

  // Fetch comments
  const fetchComments = async (materialId) => {
    setIsLoadingComments(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/uploads/${materialId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Enhanced comment submission with animation
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:5000/uploads/${currentMaterialId}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        // Add animation for new comment
        setCommentAnimation((prev) => ({
          ...prev,
          [response.data.comment.id]: true,
        }));

        setComments((prevComments) => [...prevComments, response.data.comment]);
        setCommentText('');

        // Reset animation after 500ms
        setTimeout(() => {
          setCommentAnimation((prev) => ({
            ...prev,
            [response.data.comment.id]: false,
          }));
        }, 500);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to post comment. Please try again.',
        severity: 'error'
      });
    }
  };

  // Add handleDelete function
  const handleDelete = async (materialId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/uploads/${materialId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Material deleted successfully',
          severity: 'success'
        });
        // Update the materials list by filtering out the deleted item
        setMaterials(prevMaterials => prevMaterials.filter(m => m.id !== materialId));
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete material',
        severity: 'error'
      });
    }
  };

  // Enhanced material card render with animations
  const renderMaterialCard = (material) => {
    const tags = Array.isArray(material.tags) ? material.tags : material.tags?.split(',') || [];
    const isImageFile = material.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    return (
      <motion.div
        key={material.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3,
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          {material.file_url ? (
            isImageFile ? (
              <CardMedia
                component="img"
                height="140"
                image={material.file_url}
                alt={material.title}
                sx={{ 
                  objectFit: 'cover',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'action.hover',
                  color: 'text.secondary'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <DescriptionIcon sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="body2" component="div">
                    {material.file_url.split('/').pop()?.split('.').pop()?.toUpperCase() || 'FILE'}
                  </Typography>
                </Box>
              </Box>
            )
          ) : null}
          <CardContent sx={{ flexGrow: 1, pb: 1 }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mb: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {material.course_code} • {material.year} • {material.semester}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.trim()}
                  size="small"
                  sx={{ 
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.main'
                    }
                  }}
                />
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {material.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ 
            py: 1,
            px: 2,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Upvote">
                  <IconButton 
                    size="small"
                    onClick={() => handleVote(material.id, 'upvote')}
                    color={material.userVote === 'upvote' ? 'primary' : 'default'}
                  >
                    <ThumbUpIcon fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {material.upvotes || 0}
                    </Typography>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Downvote">
                  <IconButton
                    size="small"
                    onClick={() => handleVote(material.id, 'downvote')}
                    color={material.userVote === 'downvote' ? 'error' : 'default'}
                  >
                    <ThumbDownIcon fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {material.downvotes || 0}
                    </Typography>
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Comments">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleCommentsClick(material.id)}
                  >
                    <ChatIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {material.file_url && (
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      color="primary"
                      href={material.file_url}
                      target="_blank"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this material?')) {
                        handleDelete(material.id);
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardActions>
        </Card>
      </motion.div>
    );
  };

  const handleAddTag = () => {
    if (newTag && !fileTags.includes(newTag)) {
      setFileTags([...fileTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFileTags(fileTags.filter(tag => tag !== tagToRemove));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add these handler functions before the return statement
  const handleOpenSearchDialog = () => {
    setSearchDialogOpen(true);
  };

  const handleCloseSearchDialog = () => {
    setSearchDialogOpen(false);
    // Reset search form
    setSearchCourseCode('');
    setSearchYear('');
    setSearchSemester('');
    setSearchTags([]);
  };

  const handleSearchTagToggle = (tag) => {
    if (searchTags.includes(tag)) {
      setSearchTags(searchTags.filter((t) => t !== tag));
    } else {
      setSearchTags([...searchTags, tag]);
    }
  };

  const handleSearch = async () => {
    if (!searchCourseCode && !searchYear && !searchSemester && searchTags.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please specify at least one search criteria',
        severity: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchCourseCode) params.append('course_code', searchCourseCode);
      if (searchYear) params.append('year', searchYear);
      if (searchSemester) params.append('semester', searchSemester);
      searchTags.forEach(tag => params.append('tags', tag));

      const response = await axios.get(`http://localhost:5000/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMaterials(response.data.materials);
      setSearchPerformed(true);
      handleCloseSearchDialog();
    } catch (error) {
      console.error('Error searching materials:', error);
      setSnackbar({
        open: true,
        message: 'Failed to search materials. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader title="Educational Resources" />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 6,
            position: 'relative',
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: '8px',
            background: theme => theme.palette.mode === 'dark' 
              ? 'linear-gradient(to bottom, #1E1E1E, #2D2D2D)'
              : 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
            boxShadow: theme => theme.palette.mode === 'dark'
              ? '0 4px 6px rgba(0, 0, 0, 0.3)'
              : '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 8px 15px rgba(0, 0, 0, 0.4)'
                : '0 8px 15px rgba(0, 0, 0, 0.1)'
              
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '3px',
              bgcolor: 'primary.main',
              borderRadius: '2px',
              opacity: 0.7
            }
          }}
        >
          <Typography 
            className="heading-text"
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme => `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover::before': {
                opacity: 1
              }
            }}
          >
            Share and Discover Course Materials
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              textAlign: 'center',
              mb: 2,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              opacity: 0.9,
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 1,
                color: 'text.primary'
              }
            }}
          >
            Upload your study materials, find resources shared by others, and collaborate with your peers. 
            Browse through lecture notes, assignments, solutions, and more to enhance your learning experience.
          </Typography>
        </Box>

        <ResourceSearch 
          onUploadClick={handleUploadClick}
          onAdvancedSearch={handleOpenSearchDialog}
        />

        <Grid container spacing={3} sx={{ ml: 0 }}>
          {isLoading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          ) : materials.length === 0 ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No resources found. Be the first to upload!
              </Typography>
            </Grid>
          ) : (
            materials.map((material) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={6} 
                lg={3} 
                key={material.id} 
                sx={{ 
                  maxWidth: { xs: '100%', sm: '50%', md: '50%', lg: '25%' },
                  px: 1.5,
                  mb: 2
                }}
              >
                {renderMaterialCard(material)}
              </Grid>
            ))
          )}
        </Grid>

        {!isLoading && materials.length > 0 && (
          <ResourcePagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        )}
      </Container>

      {/* Upload Dialog */}
      <Dialog
        open={openUpload}
        onClose={handleCloseUpload}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload Resource
          <IconButton
            aria-label="close"
            onClick={handleCloseUpload}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                label="Year"
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Semester</InputLabel>
              <Select
                value={uploadSemester}
                onChange={(e) => setUploadSemester(e.target.value)}
                label="Semester"
              >
                {semesters.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Link (Optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <InputLabel>Tags (Required)</InputLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {availableTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagSelect(tag)}
                    color={selectedTags.includes(tag) ? "primary" : "default"}
                    variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: selectedTags.includes(tag)
                          ? 'primary.dark'
                          : 'action.hover'
                      }
                    }}
                  />
                ))}
              </Box>
              {selectedTags.length === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Please select at least one tag
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Select File
              <input
                type="file"
                hidden
                onChange={handleFileSelect}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpload}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading || !courseCode || (!link && !selectedFile) || selectedTags.length === 0}
          >
            {isUploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={openComments}
        onClose={handleCloseComments}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Comments
          <IconButton
            aria-label="close"
            onClick={handleCloseComments}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <List>
              {isLoadingComments ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress />
                </Box>
              ) : comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{comment.author[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={comment.author}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {comment.text}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              {new Date(comment.created_at).toLocaleString()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Add a comment..."
                multiline
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button 
                variant="contained" 
                fullWidth
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Search Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={handleCloseSearchDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Search Materials
          <IconButton
            aria-label="close"
            onClick={handleCloseSearchDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Course Code"
                  fullWidth
                  value={searchCourseCode}
                  onChange={(e) => setSearchCourseCode(e.target.value)}
                  placeholder="Enter course code..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={searchYear}
                    label="Year"
                    onChange={(e) => setSearchYear(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={searchSemester}
                    label="Semester"
                    onChange={(e) => setSearchSemester(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {semesters.map((sem) => (
                      <MenuItem key={sem} value={sem}>
                        {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleSearchTagToggle(tag)}
                      color={searchTags.includes(tag) ? "primary" : "default"}
                      variant={searchTags.includes(tag) ? "filled" : "outlined"}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: searchTags.includes(tag)
                            ? 'primary.dark'
                            : 'action.hover'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearchDialog}>Cancel</Button>
          <Button 
            onClick={handleSearch}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Resource; 

