// // Contact.js - Team Members Profile & Contributions

// import React, { useState } from 'react';
// import {
//   Container,
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   useTheme,
//   useMediaQuery,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import {
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationIcon,
//   Send as SendIcon,
// } from '@mui/icons-material';
// import PageHeader from './PageHeader';

// const teamMembers = [
//   {
//     name: "Jatin",
//     rollNumber: "2022MCB1266",
//     role: "Frontend Developer",
//     contributions: "Designed user interfaces and improved user experience. Worked on making the website fully responsive and interactive.",
//     avatar: require("./Jatin.jpeg"),
//   },
//   {
//     name: "Jitender",
//     rollNumber: "2022MCB1318",
//     role: "Backend Developer",
//     contributions: "Developed core functionalities and backend API. Implemented authentication and RESTful services.",
//     avatar: require("./Jitender.jpeg"),
//   },
//   {
//     name: "Sarthak",
//     rollNumber: "2022MCB1278",
//     role: "Database Manager",
//     contributions: "Handled database management and cloud storage integration. Optimized queries and ensured data security.",
//     avatar: require("./Sarthak.jpeg"),
//   },
// ];

// const contactInfo = [
//   {
//     icon: <EmailIcon sx={{ fontSize: 40 }} />,
//     title: 'Email',
//     content: 'support@academicportal.com',
//     link: 'mailto:support@academicportal.com',
//   },
//   {
//     icon: <PhoneIcon sx={{ fontSize: 40 }} />,
//     title: 'Phone',
//     content: '+1 (555) 123-4567',
//     link: 'tel:+15551234567',
//   },
//   {
//     icon: <LocationIcon sx={{ fontSize: 40 }} />,
//     title: 'Address',
//     content: '123 Education Street, Learning City, 12345',
//     link: 'https://maps.google.com',
//   },
// ];

// export default function Contact() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Here you would typically send the form data to your backend
//     // For now, we'll just show a success message
//     setSnackbar({
//       open: true,
//       message: 'Message sent successfully! We will get back to you soon.',
//       severity: 'success',
//     });
//     setFormData({
//       name: '',
//       email: '',
//       subject: '',
//       message: '',
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <Box>
//       <PageHeader title="Contact Us" />
//       <Box sx={{ py: 8 }}>
//         {/* Hero Section */}
//         <Box
//           sx={{
//             bgcolor: 'primary.main',
//             color: 'white',
//             py: 8,
//             mb: 8,
//           }}
//         >
//           <Container maxWidth="lg">
//             <Typography
//               variant="h2"
//               component="h1"
//               gutterBottom
//               align="center"
//               sx={{ fontWeight: 'bold' }}
//             >
//               Contact Us
//             </Typography>
//             <Typography
//               variant="h5"
//               align="center"
//               sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}
//             >
//               Have questions? We'd love to hear from you. Send us a message and we'll
//               respond as soon as possible.
//             </Typography>
//           </Container>
//         </Box>

//         <Container maxWidth="lg">
//           {/* Team Section */}
//           <Box sx={{ mb: 8 }}>
//             <Typography
//               variant="h4"
//               component="h2"
//               gutterBottom
//               align="center"
//               sx={{ mb: 4 }}
//             >
//               Our Team
//             </Typography>
//             <Grid container spacing={4}>
//               {teamMembers.map((member, index) => (
//                 <Grid item xs={12} sm={4} key={index}>
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                       textAlign: 'center',
//                       transition: 'transform 0.2s',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                       },
//                     }}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="300"
//                       image={member.avatar}
//                       alt={member.name}
//                       sx={{
//                         objectFit: 'contain',
//                         width: '100%',
//                         bgcolor: '#f5f5f5',
//                         transition: 'transform 0.3s ease-in-out',
//                         p: 1,
//                         '&:hover': {
//                           transform: 'scale(1.05)'
//                         }
//                       }}
//                     />
//                     <CardContent>
//                       <Typography
//                         variant="h6"
//                         component="h3"
//                         gutterBottom
//                         sx={{ fontWeight: 'bold' }}
//                       >
//                         {member.name}
//                       </Typography>
//                       <Typography variant="subtitle1" color="primary">
//                         {member.rollNumber}
//                       </Typography>
//                       <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                         {member.role}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {member.contributions}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>

//           <Grid container spacing={4}>
//             {/* Contact Information */}
//             <Grid item xs={12} md={4}>
//               <Box sx={{ mb: { xs: 4, md: 0 } }}>
//                 <Typography
//                   variant="h4"
//                   component="h2"
//                   gutterBottom
//                   sx={{ mb: 4 }}
//                 >
//                   Get in Touch
//                 </Typography>
//                 {contactInfo.map((info, index) => (
//                   <Card
//                     key={index}
//                     sx={{
//                       mb: 2,
//                       transition: 'transform 0.2s',
//                       '&:hover': {
//                         transform: 'translateY(-4px)',
//                       },
//                     }}
//                   >
//                     <CardContent>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           mb: 1,
//                           color: 'primary.main',
//                         }}
//                       >
//                         {info.icon}
//                         <Typography
//                           variant="h6"
//                           component="h3"
//                           sx={{ ml: 1 }}
//                         >
//                           {info.title}
//                         </Typography>
//                       </Box>
//                       <Button
//                         href={info.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         sx={{
//                           textTransform: 'none',
//                           p: 0,
//                           '&:hover': {
//                             bgcolor: 'transparent',
//                           },
//                         }}
//                       >
//                         <Typography variant="body1" color="text.secondary">
//                           {info.content}
//                         </Typography>
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </Box>
//             </Grid>

//             {/* Contact Form */}
//             <Grid item xs={12} md={8}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   p: 4,
//                   bgcolor: 'background.paper',
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography
//                   variant="h4"
//                   component="h2"
//                   gutterBottom
//                   sx={{ mb: 4 }}
//                 >
//                   Send us a Message
//                 </Typography>
//                 <Box
//                   component="form"
//                   onSubmit={handleSubmit}
//                   sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: 2,
//                   }}
//                 >
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Grid>
//                   </Grid>
//                   <TextField
//                     fullWidth
//                     label="Subject"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                   />
//                   <TextField
//                     fullWidth
//                     label="Message"
//                     name="message"
//                     multiline
//                     rows={4}
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                   />
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     startIcon={<SendIcon />}
//                     sx={{ mt: 2 }}
//                   >
//                     Send Message
//                   </Button>
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Container>

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity={snackbar.severity}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Box>
//   );
// }
// Contact.js - Team Members Profile & Contributions

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import emailjs from '@emailjs/browser';
import PageHeader from './PageHeader';

// Initialize EmailJS with public key from environment variables
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

// Constants for EmailJS configuration
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

const teamMembers = [
  {
    name: "Jatin",
    rollNumber: "2022MCB1266",
    role: "Frontend Developer",
    contributions: "Designed user interfaces and improved user experience. Worked on making the website fully responsive and interactive.",
    avatar: require("./Jatin.jpeg"),
    social: {
      linkedin: "https://linkedin.com/in/jatin",
      twitter: "https://twitter.com/jatin",
      github: "https://github.com/jatin"
    }
  },
  {
    name: "Jitender",
    rollNumber: "2022MCB1318",
    role: "Backend Developer",
    contributions: "Developed core functionalities and backend API. Implemented authentication and RESTful services.",
    avatar: require("./Jitender.jpeg"),
    social: {
      linkedin: "https://linkedin.com/in/jitender",
      twitter: "https://twitter.com/jitender",
      github: "https://github.com/jitender"
    }
  },
  {
    name: "Sarthak",
    rollNumber: "2022MCB1278",
    role: "Database Manager",
    contributions: "Handled database management and cloud storage integration. Optimized queries and ensured data security.",
    avatar: require("./Sarthak.jpeg"),
    social: {
      linkedin: "https://linkedin.com/in/sarthak",
      twitter: "https://twitter.com/sarthak",
      github: "https://github.com/sarthak"
    }
  },
];

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);

  useEffect(() => {
    // Check if EmailJS is properly configured
    if (!process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 
        !process.env.REACT_APP_EMAILJS_SERVICE_ID || 
        !process.env.REACT_APP_EMAILJS_TEMPLATE_ID) {
      setSnackbar({
        open: true,
        message: 'Email service not configured. Please contact the administrator.',
        severity: 'error',
      });
    } else {
      setEmailConfigured(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailConfigured) {
      setSnackbar({
        open: true,
        message: 'Email service not configured. Please contact the administrator.',
        severity: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'depplatfrom@gmail.com',
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Message sent successfully! We will get back to you soon.',
          severity: 'success',
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again later or contact us directly at depplatfrom@gmail.com',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email',
      details: ['depplatfrom@gmail.com'],
      color: '#5C6BC0',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Phone',
      details: ['+91 1234567890', 'Mon-Fri: 9:00 AM - 6:00 PM'],
      color: '#7C4DFF',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: 'Location',
      details: ['IIT Ropar', 'Nangal Road, Rupnagar, Punjab 140001'],
      color: '#FF9800',
    },
  ];

  const socialLinks = [
    {
      icon: <LinkedInIcon />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/college-community',
      color: '#0077B5',
    },
    {
      icon: <TwitterIcon />,
      label: 'Twitter',
      url: 'https://twitter.com/collegecommunity',
      color: '#1DA1F2',
    },
    {
      icon: <GitHubIcon />,
      label: 'GitHub',
      url: 'https://github.com/college-community',
      color: theme.palette.mode === 'dark' ? '#fff' : '#333',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, #121212 0%, #1E1E1E 100%)'
        : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    }}>
      <PageHeader />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: 12,
          mb: 8,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, rgba(92, 107, 192, 0.1) 0%, rgba(124, 77, 255, 0.1) 100%)'
              : 'linear-gradient(45deg, rgba(92, 107, 192, 0.05) 0%, rgba(124, 77, 255, 0.05) 100%)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.03) 100%)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
              background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              opacity: 0.9,
              fontWeight: 400,
              letterSpacing: '0.5px',
            }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll
            respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 800,
              background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            Our Team
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.05)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 8px 30px rgba(0, 0, 0, 0.4)'
                          : '0 8px 30px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={member.avatar}
                      alt={member.name}
                      sx={{
                        objectFit: 'contain',
                        width: '100%',
                        bgcolor: '#f5f5f5',
                        transition: 'transform 0.3s ease-in-out',
                        p: 1,
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                      >
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {member.rollNumber}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {member.contributions}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#0077B5',
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                        <IconButton
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#1DA1F2',
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <TwitterIcon />
                        </IconButton>
                        <IconButton
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: theme.palette.mode === 'dark' ? '#fff' : '#333',
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <GitHubIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Information Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(0, 0, 0, 0.4)'
                        : '0 8px 30px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        color: info.color,
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {info.title}
                    </Typography>
                    {info.details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 1,
                          lineHeight: 1.6,
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form */}
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              mb: 8,
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.05)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ 
                fontWeight: 800, 
                mb: 4,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Get in Touch
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={isSubmitting}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7C4DFF 30%, #5C6BC0 90%)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(92, 107, 192, 0.3)',
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Contact;
