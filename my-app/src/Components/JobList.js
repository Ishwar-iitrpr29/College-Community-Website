// import JobCard from "./JobCard"

// function JobList({ jobs }) {
//   if (!jobs || jobs.length === 0) {
//     return (
//       <div className="no-results">
//         <p>No jobs found. Try adjusting your search criteria.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="job-list">
//       <h2>Search Results</h2>
//       <div className="job-grid">
//         {jobs.map((job, index) => (
//           <JobCard key={index} job={job} />
//         ))}
//       </div>
//     </div>
//   )
// }

// export default JobList


import { Box, Typography, List, ListItem, useTheme, alpha } from "@mui/material"
import JobCard from "./JobCard"
import { useState } from "react"

function JobList({ jobs }) {
  const theme = useTheme();
  const [savedJobs, setSavedJobs] = useState([]);

  const handleSaveJob = async (job) => {
    try {
      const response = await fetch('http://localhost:5000/api/save-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.job_position,
          company: job.company_name,
          location: job.job_location,
          jobLink: job.job_link
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save job');
      }

      setSavedJobs(prev => {
        if (prev.includes(job.id)) {
          return prev.filter(id => id !== job.id);
        }
        return [...prev, job.id];
      });
    } catch (error) {
      console.error('Error saving job:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 6,
          textAlign: 'center',
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'common.white',
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' 
            ? `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`
            : `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: theme.palette.text.primary,
            fontWeight: 500
          }}
        >
          No jobs found
        </Typography>
        <Typography 
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Try adjusting your search criteria or check back later for new opportunities.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          px: 2
        }}
      >
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Search Results
        </Typography>
        <Typography 
          variant="body1"
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 500
          }}
        >
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'common.white',
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' 
            ? `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`
            : `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
          overflow: 'hidden'
        }}
      >
        <List sx={{ p: 0 }}>
          {jobs.map((job, index) => (
            <ListItem 
              key={job.id || index}
              sx={{
                p: 2,
                display: 'block',
                borderBottom: index < jobs.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.primary.light, 0.1),
                }
              }}
            >
              <JobCard 
                job={job} 
                onSave={() => handleSaveJob(job)}
                isSaved={savedJobs.includes(job.id)}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default JobList
