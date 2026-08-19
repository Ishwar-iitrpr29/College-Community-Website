
// // // Main landing page for internships and placements
// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Container, Box, Typography, Tabs, Tab, Card, CardContent, Button, Grid } from "@mui/material"
// import PageHeader from "./PageHeader"

// // Main component for the Internship & Placement page
// const InternshipPlacement = () => {
//   const [activeTab, setActiveTab] = useState(0)
//   const navigate = useNavigate()

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue)
//   }

//   const handleSeniorsDataClick = () => {
//     navigate("/internships-placements/seniors-data")
//   }

//   const handleOpportunitiesClick = () => {
//     navigate("/internships-placements/interview-experiences")
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//       <PageHeader title="Internships & Placements" />

//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
//           Internships & Placements
//         </Typography>

//         <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
//           <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
//             <Tab label="Overview" />
//             <Tab label="Opportunities" onClick={handleOpportunitiesClick} />
//             <Tab label="Seniors Data" onClick={handleSeniorsDataClick} />
//             <Tab label="Resources" />
//           </Tabs>
//         </Box>

//         {activeTab === 0 && (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Welcome to the Internships & Placements Portal
//             </Typography>
//             <Typography paragraph>
//               This section provides resources, opportunities, and insights from seniors to help you navigate your
//               internship and placement journey. Explore the different tabs to find relevant information.
//             </Typography>
//             <Grid container spacing={3} sx={{ mt: 2 }}>
//               <Grid item xs={12} md={6}>
//                 <Card sx={{ height: "100%" }}>
//                   <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                       Recent Placements
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Check out the latest placement statistics and success stories from your peers.
//                     </Typography>
//                     <Button variant="outlined" sx={{ mt: 2 }} onClick={handleSeniorsDataClick}>
//                       View Seniors Data
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Card sx={{ height: "100%" }}>
//                   <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                       Interview Experiences
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Learn from the interview experiences shared by your seniors.
//                     </Typography>
//                     <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpportunitiesClick}>
//                       View Experiences
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//           </Box>
//         )}

//         {activeTab === 1 && (
//           <Box>
//             <Typography variant="body1">Redirecting to Interview Experiences page...</Typography>
//           </Box>
//         )}

//         {activeTab === 2 && (
//           <Box>
//             <Typography variant="body1">Redirecting to Seniors Data page...</Typography>
//           </Box>
//         )}

//         {activeTab === 3 && (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Helpful Resources
//             </Typography>
//             <Typography paragraph>
//               Access resources to help you prepare for interviews, improve your resume, and more.
//             </Typography>
//             {/* Resources content would go here */}
//           </Box>
//         )}
//       </Container>
//     </Box>
//   )
// }

// export default InternshipPlacement

// Modified version of InternshipPlacement.js to handle the Resources tab click

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Typography, Tabs, Tab, Card, CardContent, Button, Grid } from "@mui/material"
import PageHeader from "./PageHeader"

// Main component for the Internship & Placement page
const InternshipPlacement = () => {
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleSeniorsDataClick = () => {
    navigate("/internships-placements/seniors-data")
  }

  const handleOpportunitiesClick = () => {
    navigate("/internships-placements/interview-experiences")
  }

  const handleResourcesClick = () => {
    navigate("/internships-placements/dsa-resources")
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PageHeader title="Internships & Placements" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Internships & Placements
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Overview" />
            <Tab label="Opportunities" onClick={handleOpportunitiesClick} />
            <Tab label="Seniors Data" onClick={handleSeniorsDataClick} />
            <Tab label="Resources" onClick={handleResourcesClick} />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Welcome to the Internships & Placements Portal
            </Typography>
            <Typography paragraph>
              This section provides resources, opportunities, and insights from seniors to help you navigate your
              internship and placement journey. Explore the different tabs to find relevant information.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Placements
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check out the latest placement statistics and success stories from your peers.
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleSeniorsDataClick}>
                      View Seniors Data
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Interview Experiences
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Learn from the interview experiences shared by your seniors.
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpportunitiesClick}>
                      View Experiences
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      DSA Resources
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access DSA preparation materials and search for questions across platforms.
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleResourcesClick}>
                      View Resources
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="body1">Redirecting to Interview Experiences page...</Typography>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="body1">Redirecting to Seniors Data page...</Typography>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="body1">Redirecting to Resources page...</Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default InternshipPlacement

