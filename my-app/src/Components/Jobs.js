// import React, { useState } from 'react';
// import { Box, Container, Typography } from '@mui/material';
// import PageHeader from './PageHeader';
// import SearchForm from './SearchForm';
// import JobList from './JobList';

// // Original code commented out for reference
// /*
// function Jobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const searchJobs = async (searchParams) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const queryParams = new URLSearchParams();
//       Object.entries(searchParams).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value);
//       });

//       const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setJobs(data);
//     } catch (err) {
//       setError(err.message);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <PageHeader title="Job Search Portal" />
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
//         <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
//           Find Your Dream Job
//         </Typography>
        
//         <SearchForm onSearch={searchJobs} />
        
//         {error && (
//           <Box sx={{ 
//             p: 2, 
//             mt: 2, 
//             bgcolor: 'error.light', 
//             color: 'error.contrastText',
//             borderRadius: 1
//           }}>
//             Error: {error}
//           </Box>
//         )}
        
//         {loading ? (
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center', 
//             mt: 4 
//           }}>
//             <div className="spinner" style={{ 
//               width: '40px', 
//               height: '40px', 
//               border: '4px solid rgba(0, 0, 0, 0.1)', 
//               borderRadius: '50%', 
//               borderTop: '4px solid #3f51b5', 
//               animation: 'spin 1s linear infinite' 
//             }}></div>
//             <Typography sx={{ mt: 2 }}>Searching for jobs...</Typography>
//             <style jsx>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//           </Box>
//         ) : (
//           <JobList jobs={jobs} />
//         )}
//       </Container>
//     </Box>
//   );
// }
// */

// // Enhanced version with improved styling
// function Jobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const searchJobs = async (searchParams) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const queryParams = new URLSearchParams();
//       Object.entries(searchParams).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value);
//       });

//       const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setJobs(data);
//     } catch (err) {
//       setError(err.message);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         minHeight: '100vh',
//         background: 'linear-gradient(180deg, #f5f7fa 0%, #e4e8eb 100%)'
//       }}
//     >
//       <PageHeader title="Job Search Portal" />
//       <Container 
//         maxWidth="lg" 
//         sx={{ 
//           mt: 4, 
//           mb: 4, 
//           flexGrow: 1,
//           px: { xs: 2, sm: 3, md: 4 }
//         }}
//       >
//         <Box 
//           sx={{ 
//             textAlign: 'center',
//             mb: 6,
//             background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
//             color: 'white',
//             p: 4,
//             borderRadius: 2,
//             boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//           }}
//         >
//           <Typography 
//             variant="h3" 
//             component="h1" 
//             gutterBottom 
//             sx={{ 
//               fontWeight: 600,
//               mb: 2
//             }}
//           >
//             Find Your Dream Job
//           </Typography>
//           <Typography 
//             variant="h6" 
//             sx={{ 
//               opacity: 0.9,
//               maxWidth: '600px',
//               mx: 'auto'
//             }}
//           >
//             Search through thousands of job opportunities and find the perfect match for your skills
//           </Typography>
//         </Box>
        
//         <Box 
//           sx={{ 
//             mb: 4,
//             p: 3,
//             borderRadius: 2,
//             backgroundColor: 'white',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
//           }}
//         >
//           <SearchForm onSearch={searchJobs} />
//         </Box>
        
//         {error && (
//           <Box 
//             sx={{ 
//               p: 3, 
//               mt: 2, 
//               mb: 3,
//               bgcolor: 'error.light', 
//               color: 'error.contrastText',
//               borderRadius: 2,
//               boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Typography variant="body1">
//               Error: {error}
//             </Typography>
//           </Box>
//         )}
        
//         {loading ? (
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               flexDirection: 'column', 
//               alignItems: 'center', 
//               justifyContent: 'center',
//               minHeight: '300px',
//               background: 'white',
//               borderRadius: 2,
//               boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
//             }}
//           >
//             <Box
//               sx={{
//                 width: '50px',
//                 height: '50px',
//                 border: '4px solid rgba(0, 0, 0, 0.1)',
//                 borderTop: '4px solid #1976d2',
//                 borderRadius: '50%',
//                 animation: 'spin 1s linear infinite',
//                 mb: 2
//               }}
//             />
//             <Typography 
//               variant="h6" 
//               sx={{ 
//                 color: 'text.secondary',
//                 fontWeight: 500
//               }}
//             >
//               Searching for jobs...
//             </Typography>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               background: 'white',
//               borderRadius: 2,
//               boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
//               p: 3
//             }}
//           >
//             <JobList jobs={jobs} />
//           </Box>
//         )}
//       </Container>
//     </Box>
//   );
// }

// export default Jobs;

import React, { useState } from 'react';
import { Box, Container, Typography, useTheme, alpha } from '@mui/material';
import PageHeader from './PageHeader';
import SearchForm from './SearchForm';
import JobList from './JobList';

// Original code commented out for reference
/*
function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobs = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PageHeader title="Job Search Portal" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Find Your Dream Job
        </Typography>
        
        <SearchForm onSearch={searchJobs} />
        
        {error && (
          <Box sx={{ 
            p: 2, 
            mt: 2, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            borderRadius: 1
          }}>
            Error: {error}
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mt: 4 
          }}>
            <div className="spinner" style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid rgba(0, 0, 0, 0.1)', 
              borderRadius: '50%', 
              borderTop: '4px solid #3f51b5', 
              animation: 'spin 1s linear infinite' 
            }}></div>
            <Typography sx={{ mt: 2 }}>Searching for jobs...</Typography>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </Box>
        ) : (
          <JobList jobs={jobs} />
        )}
      </Container>
    </Box>
  );
}
*/

// Enhanced version with improved styling
function Jobs() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobs = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
        pb: 8
      }}
    >
      <PageHeader title="Job Search Portal" />
      
      <Box
        sx={{
          width: '100%',
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(to bottom, ${alpha(theme.palette.primary.dark, 0.4)}, ${alpha(theme.palette.background.default, 0.8)})`
            : `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.4)})`,
          pt: 4,
          pb: 6,
          mt: -2
        }}
      >
        <Container maxWidth="lg">
          
          <Box sx={{ px: { xs: 2, sm: 4, md: 0 } }}>
            <SearchForm onSearch={searchJobs} />
          </Box>
        </Container>
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: -4,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {error && (
          <Box 
            sx={{ 
              p: 3, 
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.error.dark, 0.2) : alpha(theme.palette.error.light, 0.2),
              color: theme.palette.error.main,
              borderRadius: 2,
              border: `1px solid ${theme.palette.error.main}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body1" color="inherit">
              {error}
            </Typography>
          </Box>
        )}
        
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'common.white',
              borderRadius: 2,
              boxShadow: theme.palette.mode === 'dark' 
                ? `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`
                : `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <Box
              sx={{
                width: '50px',
                height: '50px',
                border: '3px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? `${alpha(theme.palette.primary.main, 0.2)} ${alpha(theme.palette.primary.main, 0.2)} ${alpha(theme.palette.primary.main, 0.2)} ${theme.palette.primary.main}`
                  : `${alpha(theme.palette.primary.main, 0.1)} ${alpha(theme.palette.primary.main, 0.1)} ${alpha(theme.palette.primary.main, 0.1)} ${theme.palette.primary.main}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                mb: 2
              }}
            />
            <Typography 
              variant="h6"
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              Searching for jobs...
            </Typography>
            <style jsx global>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </Box>
        ) : (
          <JobList jobs={jobs} />
        )}
      </Container>
    </Box>
  );
}

export default Jobs;