// import { Box, Typography, Button, useTheme, Card, CardContent, CardActions, IconButton, Tooltip } from "@mui/material";
// import { BookmarkBorder, Bookmark, LocationOn, Business } from "@mui/icons-material";

// function JobCard({ job, onSave, isSaved }) {
//   const theme = useTheme();

//   return (
//     <Card 
//       sx={{ 
//         width: '100%',
//         bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
//         '&:hover': {
//           boxShadow: theme.shadows[4],
//           transition: 'box-shadow 0.3s ease-in-out'
//         }
//       }}
//     >
//       <CardContent>
//         <Typography 
//           variant="h6" 
//           component="h3" 
//           gutterBottom
//           sx={{ 
//             color: 'text.primary',
//             fontWeight: 600,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start'
//           }}
//         >
//           {job.job_position}
//           <Tooltip title={isSaved ? "Remove from saved" : "Save job"}>
//             <IconButton 
//               onClick={() => onSave(job)}
//               sx={{ 
//                 color: isSaved ? 'primary.main' : 'text.secondary',
//                 '&:hover': {
//                   color: 'primary.main'
//                 }
//               }}
//             >
//               {isSaved ? <Bookmark /> : <BookmarkBorder />}
//             </IconButton>
//           </Tooltip>
//         </Typography>

//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
//           <Business sx={{ mr: 1, fontSize: 20 }} />
//           <Typography variant="body2">{job.company_name}</Typography>
//         </Box>

//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
//           <LocationOn sx={{ mr: 1, fontSize: 20 }} />
//           <Typography variant="body2">{job.job_location}</Typography>
//         </Box>

//         <Typography 
//           variant="body2" 
//           color="text.secondary" 
//           sx={{ 
//             mb: 2,
//             display: '-webkit-box',
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: 'vertical',
//             overflow: 'hidden'
//           }}
//         >
//           {job.job_description}
//         </Typography>
//       </CardContent>

//       <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
//         <Button 
//           variant="contained" 
//           color="primary"
//           href={job.job_link}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           View Job
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }

// export default JobCard;
  
import { Box, Typography, Button, useTheme, Card, CardContent, CardActions, IconButton, Tooltip, Avatar } from "@mui/material";
import { BookmarkBorder, Bookmark, LocationOn, Business } from "@mui/icons-material";

function JobCard({ job, onSave, isSaved }) {
  const theme = useTheme();

  // Function to get company logo URL
  const getCompanyLogo = (companyName) => {
    // You can implement your own logo fetching logic here
    // For now, we'll use a placeholder service
    return `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transition: 'box-shadow 0.3s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            src={getCompanyLogo(job.company_name)}
            alt={job.company_name}
            sx={{ 
              width: 56, 
              height: 56,
              bgcolor: theme.palette.primary.main,
              '& .MuiAvatar-img': {
                objectFit: 'contain',
                p: 1
              }
            }}
          >
            <Business sx={{ fontSize: 32 }} />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              {job.job_position}
              <Tooltip title={isSaved ? "Remove from saved" : "Save job"}>
                <IconButton 
                  onClick={() => onSave(job)}
                  sx={{ 
                    color: isSaved ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {isSaved ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
              <Business sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{job.company_name}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{job.job_location}</Typography>
            </Box>
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {job.job_description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary"
          href={job.job_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Job
        </Button>
      </CardActions>
    </Card>
  );
}

export default JobCard;
  