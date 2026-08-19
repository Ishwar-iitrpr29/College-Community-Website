// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   Divider,
//   Button,
//   IconButton,
//   Tooltip,
//   Fade,
//   Zoom,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import {
//   School as SchoolIcon,
//   Group as GroupIcon,
//   EmojiEvents as EmojiEventsIcon,
//   Lightbulb as LightbulbIcon,
//   LinkedIn as LinkedInIcon,
//   Twitter as TwitterIcon,
//   GitHub as GitHubIcon,
//   ArrowForward as ArrowForwardIcon,
// } from '@mui/icons-material';
// import PageHeader from './PageHeader';

// const AboutUs = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [hoveredFeature, setHoveredFeature] = useState(null);
//   const [hoveredTeam, setHoveredTeam] = useState(null);

//   const features = [
//     {
//       icon: <SchoolIcon sx={{ fontSize: 40 }} />,
//       title: 'Quality Education',
//       description: 'We strive to provide high-quality educational resources and materials to help students excel in their academic journey.',
//       color: '#5C6BC0',
//     },
//     {
//       icon: <GroupIcon sx={{ fontSize: 40 }} />,
//       title: 'Community Driven',
//       description: 'Our platform is built on the power of community, where students and educators come together to share knowledge and experiences.',
//       color: '#7C4DFF',
//     },
//     {
//       icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
//       title: 'Achievement Focused',
//       description: 'We believe in celebrating academic achievements and encouraging continuous learning through our reward system.',
//       color: '#FF6B6B',
//     },
//     {
//       icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
//       title: 'Innovation',
//       description: 'We constantly innovate to provide the best learning experience with cutting-edge features and technologies.',
//       color: '#4CAF50',
//     },
//   ];

//   const team = [
//     {
//       name: 'John Doe',
//       role: 'Founder & CEO',
//       avatar: 'JD',
//       bio: 'Passionate about education technology and making quality education accessible to all.',
//       social: {
//         linkedin: 'https://linkedin.com',
//         twitter: 'https://twitter.com',
//         github: 'https://github.com',
//       },
//     },
//     {
//       name: 'Jane Smith',
//       role: 'Head of Education',
//       avatar: 'JS',
//       bio: 'Experienced educator with a vision for transforming traditional learning methods.',
//       social: {
//         linkedin: 'https://linkedin.com',
//         twitter: 'https://twitter.com',
//         github: 'https://github.com',
//       },
//     },
//     {
//       name: 'Mike Johnson',
//       role: 'Technical Lead',
//       avatar: 'MJ',
//       bio: 'Tech innovator focused on creating seamless learning experiences through cutting-edge solutions.',
//       social: {
//         linkedin: 'https://linkedin.com',
//         twitter: 'https://twitter.com',
//         github: 'https://github.com',
//       },
//     },
//   ];

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
//       <PageHeader title="About Us" />
      
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         {/* Mission Statement */}
//         <Fade in timeout={1000}>
//           <Box sx={{ textAlign: 'center', mb: 8 }}>
//             <Typography
//               variant="h2"
//               component="h1"
//               gutterBottom
//               sx={{
//                 fontWeight: 700,
//                 mb: 3,
//                 background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//               }}
//             >
//               Our Mission
//             </Typography>
//             <Typography
//               variant="h5"
//               color="text.secondary"
//               sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
//             >
//               To create an inclusive and collaborative learning environment where students can access quality educational resources and connect with peers to achieve academic excellence.
//             </Typography>
//             <Button
//               variant="contained"
//               endIcon={<ArrowForwardIcon />}
//               sx={{
//                 mt: 2,
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
//                 '&:hover': {
//                   background: 'linear-gradient(45deg, #7C4DFF 30%, #5C6BC0 90%)',
//                 },
//               }}
//             >
//               Join Our Community
//             </Button>
//           </Box>
//         </Fade>

//         {/* Features Grid */}
//         <Grid container spacing={4} sx={{ mb: 8 }}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
//                 <Card
//                   sx={{
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     transition: 'all 0.3s ease',
//                     position: 'relative',
//                     overflow: 'hidden',
//                     '&:hover': {
//                       transform: 'translateY(-8px)',
//                       boxShadow: 6,
//                     },
//                     '&::before': {
//                       content: '""',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       background: `linear-gradient(45deg, ${feature.color}20, ${feature.color}40)`,
//                       opacity: 0,
//                       transition: 'opacity 0.3s ease',
//                     },
//                     '&:hover::before': {
//                       opacity: 1,
//                     },
//                   }}
//                   onMouseEnter={() => setHoveredFeature(index)}
//                   onMouseLeave={() => setHoveredFeature(null)}
//                 >
//                   <CardContent sx={{ flexGrow: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
//                     <Box
//                       sx={{
//                         color: feature.color,
//                         mb: 2,
//                         display: 'flex',
//                         justifyContent: 'center',
//                         transform: hoveredFeature === index ? 'scale(1.1)' : 'scale(1)',
//                         transition: 'transform 0.3s ease',
//                       }}
//                     >
//                       {feature.icon}
//                     </Box>
//                     <Typography
//                       variant="h6"
//                       component="h3"
//                       gutterBottom
//                       sx={{ fontWeight: 600 }}
//                     >
//                       {feature.title}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{ mb: 2 }}
//                     >
//                       {feature.description}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Team Section */}
//         <Box sx={{ textAlign: 'center', mb: 6 }}>
//           <Typography
//             variant="h3"
//             component="h2"
//             gutterBottom
//             sx={{ 
//               fontWeight: 700, 
//               mb: 4,
//               background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}
//           >
//             Our Team
//           </Typography>
//           <Grid container spacing={4}>
//             {team.map((member, index) => (
//               <Grid item xs={12} md={4} key={index}>
//                 <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       transition: 'all 0.3s ease',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: 6,
//                       },
//                     }}
//                     onMouseEnter={() => setHoveredTeam(index)}
//                     onMouseLeave={() => setHoveredTeam(null)}
//                   >
//                     <CardContent sx={{ flexGrow: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
//                       <Avatar
//                         sx={{
//                           width: 120,
//                           height: 120,
//                           mx: 'auto',
//                           mb: 2,
//                           bgcolor: 'primary.main',
//                           fontSize: '2.5rem',
//                           transform: hoveredTeam === index ? 'scale(1.1)' : 'scale(1)',
//                           transition: 'transform 0.3s ease',
//                           boxShadow: hoveredTeam === index ? 3 : 1,
//                         }}
//                       >
//                         {member.avatar}
//                       </Avatar>
//                       <Typography
//                         variant="h6"
//                         component="h3"
//                         gutterBottom
//                         sx={{ fontWeight: 600 }}
//                       >
//                         {member.name}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ mb: 2 }}
//                       >
//                         {member.role}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ mb: 2, minHeight: '60px' }}
//                       >
//                         {member.bio}
//                       </Typography>
//                       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
//                         {Object.entries(member.social).map(([platform, url]) => (
//                           <Tooltip key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
//                             <IconButton
//                               href={url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               sx={{
//                                 color: 'primary.main',
//                                 '&:hover': {
//                                   backgroundColor: 'primary.light',
//                                   color: 'white',
//                                 },
//                               }}
//                             >
//                               {platform === 'linkedin' && <LinkedInIcon />}
//                               {platform === 'twitter' && <TwitterIcon />}
//                               {platform === 'github' && <GitHubIcon />}
//                             </IconButton>
//                           </Tooltip>
//                         ))}
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Zoom>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Values Section */}
//         <Box sx={{ textAlign: 'center' }}>
//           <Typography
//             variant="h3"
//             component="h2"
//             gutterBottom
//             sx={{ 
//               fontWeight: 700, 
//               mb: 4,
//               background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}
//           >
//             Our Values
//           </Typography>
//           <Grid container spacing={4}>
//             {['Excellence', 'Innovation', 'Community'].map((value, index) => (
//               <Grid item xs={12} md={4} key={value}>
//                 <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       transition: 'all 0.3s ease',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: 6,
//                       },
//                       '&::before': {
//                         content: '""',
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         background: 'linear-gradient(45deg, #5C6BC020, #7C4DFF40)',
//                         opacity: 0,
//                         transition: 'opacity 0.3s ease',
//                       },
//                       '&:hover::before': {
//                         opacity: 1,
//                       },
//                     }}
//                   >
//                     <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
//                       <Typography
//                         variant="h5"
//                         component="h3"
//                         gutterBottom
//                         sx={{ 
//                           fontWeight: 600,
//                           background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
//                           WebkitBackgroundClip: 'text',
//                           WebkitTextFillColor: 'transparent',
//                         }}
//                       >
//                         {value}
//                       </Typography>
//                       <Typography
//                         variant="body1"
//                         color="text.secondary"
//                         sx={{ mb: 2 }}
//                       >
//                         {value === 'Excellence' && 'We strive for excellence in everything we do, from the quality of our resources to the support we provide to our community.'}
//                         {value === 'Innovation' && 'We embrace innovation and continuously improve our platform to provide the best learning experience possible.'}
//                         {value === 'Community' && 'We believe in the power of community and foster an environment where everyone can learn and grow together.'}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Zoom>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default AboutUs;
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  Lightbulb as LightbulbIcon,
  Notifications as NotificationsIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Material Sharing',
      description: 'A comprehensive platform for sharing and accessing academic materials, study resources, and course-related content. Features include:',
      details: [
        'Upload and download course materials, lecture notes, and study guides',
        'Organize resources by subject, semester, and course',
        'Search and filter content with advanced tagging system',
        'Rate and review materials to help others find quality resources'
      ],
      color: '#5C6BC0',
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      title: 'Placement & Interview',
      description: 'Dedicated sections for placement experiences, interview preparation, and job search integration. Features include:',
      details: [
        'Company-specific interview experiences and preparation guides',
        'Resume building and review tools',
        'Job search integration with major platforms',
        'Mock interview scheduling and feedback system'
      ],
      color: '#7C4DFF',
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Job Search',
      description: 'Advanced job search and application tracking system. Features include:',
      details: [
        'AI-powered job matching based on skills and preferences',
        'Real-time job alerts and notifications',
        'Application tracking and status updates',
        'Company insights and salary information',
        'Skill gap analysis and learning recommendations'
      ],
      color: '#FF9800',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Group Collaboration',
      description: 'Classroom-style discussion groups and collaborative spaces. Features include:',
      details: [
        'Create and join subject-specific study groups',
        'Real-time collaborative document editing',
        'Discussion forums and Q&A sections',
        'Group project management tools'
      ],
      color: '#FF6B6B',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Notifications',
      description: 'Intelligent notification system using reinforcement learning. Features include:',
      details: [
        'Personalized content recommendations',
        'Deadline and event reminders',
        'Activity updates from your groups',
        'Adaptive learning based on user preferences'
      ],
      color: '#4CAF50',
    },
  ];

  const platformOverview = {
    title: 'Platform Overview',
    description: 'Our college community platform is designed to enhance the academic and professional journey of students through a comprehensive suite of features:',
    points: [
      'Two-step authentication system for secure access',
      'User-friendly interface with responsive design',
      'Real-time updates and notifications',
      'Comprehensive search functionality',
      'Mobile-responsive design for on-the-go access',
      'Data analytics for tracking academic progress',
      'Integration with popular educational tools',
      'Regular updates and feature enhancements',
      'Cross-platform compatibility',
      'Secure data storage and privacy protection',
      'Customizable user preferences',
      'Multi-language support'
    ]
  };

  const team = [
    {
      name: 'IIT Ropar',
      role: 'Institution',
      avatar: 'IITR',
      bio: 'Indian Institute of Technology Ropar, a premier technical institution committed to excellence in education and research.',
      social: {
        linkedin: 'https://www.linkedin.com/school/iit-ropar/',
        twitter: 'https://twitter.com/IITRopar',
        github: 'https://github.com/IITRopar',
      },
    },
    {
      name: 'DEP Platform',
      role: 'Development Team',
      avatar: 'DEP',
      bio: 'A dedicated team of developers and educators working to create an innovative learning platform for the college community.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
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
      <PageHeader title="About Us" />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Mission Statement */}
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
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ 
                  mb: 4, 
                  maxWidth: '800px', 
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                To create a comprehensive college community platform that facilitates academic excellence, career development, and collaborative learning through innovative features and intelligent systems.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/')}
                sx={{
                  mt: 2,
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
                Join Our Community
              </Button>
            </Box>
          </Paper>
        </Fade>

        {/* Platform Overview */}
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
            {platformOverview.title}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              mb: 6, 
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {platformOverview.description}
          </Typography>
          <Grid container spacing={3}>
            {platformOverview.points.map((point, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
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
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(0, 0, 0, 0.4)'
                        : '0 8px 30px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Typography 
                    variant="body1" 
                    color="text.primary"
                    sx={{ 
                      fontWeight: 500,
                      lineHeight: 1.6,
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '"•"',
                        mr: 1.5,
                        color: theme.palette.primary.main,
                        fontSize: '1.2rem',
                      }
                    }}
                  >
                    {point}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* First Row: Material Sharing, Interview & Placement */}
          <Grid item xs={12} sm={6} md={6}>
            <Zoom in timeout={1000} style={{ transitionDelay: '100ms' }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
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
                {/* Material Sharing Card Content */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: features[0].color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: hoveredFeature === 0 ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {features[0].icon}
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
                    {features[0].title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {features[0].description}
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    {features[0].details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: 1.6,
                          '&::before': {
                            content: '"•"',
                            mr: 1.5,
                            color: features[0].color,
                            fontSize: '1.2rem',
                          }
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Zoom in timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
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
                {/* Interview & Placement Card Content */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: features[1].color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: hoveredFeature === 1 ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {features[1].icon}
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
                    {features[1].title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {features[1].description}
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    {features[1].details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: 1.6,
                          '&::before': {
                            content: '"•"',
                            mr: 1.5,
                            color: features[1].color,
                            fontSize: '1.2rem',
                          }
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          {/* Second Row: Job Search, Group Collaboration */}
          <Grid item xs={12} sm={6} md={6}>
            <Zoom in timeout={1000} style={{ transitionDelay: '300ms' }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
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
                {/* Job Search Card Content */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: features[2].color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: hoveredFeature === 2 ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {features[2].icon}
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
                    {features[2].title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {features[2].description}
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    {features[2].details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: 1.6,
                          '&::before': {
                            content: '"•"',
                            mr: 1.5,
                            color: features[2].color,
                            fontSize: '1.2rem',
                          }
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Zoom in timeout={1000} style={{ transitionDelay: '400ms' }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
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
                {/* Group Collaboration Card Content */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: features[3].color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: hoveredFeature === 3 ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {features[3].icon}
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
                    {features[3].title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {features[3].description}
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    {features[3].details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: 1.6,
                          '&::before': {
                            content: '"•"',
                            mr: 1.5,
                            color: features[3].color,
                            fontSize: '1.2rem',
                          }
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          {/* Third Row: Smart Notifications (Full Width) */}
          <Grid item xs={12}>
            <Zoom in timeout={1000} style={{ transitionDelay: '500ms' }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
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
                {/* Smart Notifications Card Content */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: features[4].color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: hoveredFeature === 4 ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {features[4].icon}
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
                    {features[4].title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {features[4].description}
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    {features[4].details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: 1.6,
                          '&::before': {
                            content: '"•"',
                            mr: 1.5,
                            color: features[4].color,
                            fontSize: '1.2rem',
                          }
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
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
            Our Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
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
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 3,
                          fontSize: '2.5rem',
                          bgcolor: member.social.linkedin ? '#0077B5' : '#5C6BC0',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {member.avatar}
                      </Avatar>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                        sx={{ 
                          mb: 2,
                          fontWeight: 500,
                        }}
                      >
                        {member.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {member.bio}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {member.social.linkedin && (
                          <IconButton
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#0077B5',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? 'rgba(0, 119, 181, 0.2)'
                                  : 'rgba(0, 119, 181, 0.1)',
                              },
                            }}
                          >
                            <LinkedInIcon />
                          </IconButton>
                        )}
                        {member.social.twitter && (
                          <IconButton
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#1DA1F2',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? 'rgba(29, 161, 242, 0.2)'
                                  : 'rgba(29, 161, 242, 0.1)',
                              },
                            }}
                          >
                            <TwitterIcon />
                          </IconButton>
                        )}
                        {member.social.github && (
                          <IconButton
                            href={member.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? '#fff' : '#333',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.1)'
                                  : 'rgba(51, 51, 51, 0.1)',
                              },
                            }}
                          >
                            <GitHubIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutUs;
