// "use client"
// import { useNavigate } from "react-router-dom"
// import { Container, Box, Typography, Grid, Card, CardContent, Button, useTheme, useMediaQuery } from "@mui/material"
// import {
//   School as SchoolIcon,
//   Book as BookIcon,
//   Group as GroupIcon,
//   Work as WorkIcon,
//   ContactMail as ContactIcon,
//   EmojiEvents,
//   Notifications as NotificationsIcon,
//   Search as SearchIcon,
// } from "@mui/icons-material"
// import PageHeader from "./PageHeader"

// const sections = [
//   {
//     title: "Resources",
//     description:
//       "Access a vast collection of study materials, notes, and educational resources shared by students and educators.",
//     icon: <BookIcon sx={{ fontSize: 40 }} />,
//     path: "/resources",
//     image: "https://source.unsplash.com/random/800x600?education",
//     color: "#1976d2",
//   },
//   {
//     title: "About Us",
//     description: "Learn about our mission, values, and the team behind the Academic Resource Portal.",
//     icon: <SchoolIcon sx={{ fontSize: 40 }} />,
//     path: "/about",
//     image: "https://source.unsplash.com/random/800x600?university",
//     color: "#2e7d32",
//   },
//   {
//     title: "Community",
//     description: "Join our growing community of students and educators. Share knowledge and learn together.",
//     icon: <GroupIcon sx={{ fontSize: 40 }} />,
//     path: "/community",
//     image: "https://source.unsplash.com/random/800x600?students",
//     color: "#ed6c02",
//   },
//   {
//     title: "Contact",
//     description: "Get in touch with us. We're here to help and answer any questions you may have.",
//     icon: <ContactIcon sx={{ fontSize: 40 }} />,
//     path: "/contact",
//     image: "https://source.unsplash.com/random/800x600?contact",
//     color: "#9c27b0",
//   },
// ]

// const Home = () => {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const navigate = useNavigate()

//   const features = [
//     {
//       icon: <BookIcon sx={{ fontSize: 40 }} />,
//       title: "Material Sharing",
//       description: "Share and access study materials, notes, and resources with your peers.",
//       onClick: () => navigate("/resources")
//     },
//     {
//       icon: <WorkIcon sx={{ fontSize: 40 }} />,
//       title: "Placement & Interview",
//       description: "Get interview tips, a pool of DSA resources and know about placement drives. ",
//       onClick: () => navigate("/internships-placements"),
//     },
//     {
//       icon: <SearchIcon sx={{ fontSize: 40 }} />,
//       title: "Job Search",
//       description: "Find and apply for job opportunities and internships that match your skills and interests.",
//       onClick: () => navigate("/jobs"),
//     },
//     {
//       icon: <GroupIcon sx={{ fontSize: 40 }} />,
//       title: "Group Collaboration",
//       description: "Create and join study groups for collaborative learning and project work.",
//       onClick: () => navigate("/discussion"),
//     },
//     {
//       icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
//       title: "Smart Notifications",
//       description: "Get personalized updates and important announcements through our AI-powered system.",
//       onClick: () => navigate("/notices"),
//     },
//   ]

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//       <PageHeader title="Welcome to Academic Platform" />

//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Box sx={{ textAlign: "center", mb: 8 }}>
//           <Typography
//             variant="h2"
//             component="h1"
//             gutterBottom
//             sx={{
//               fontWeight: 700,
//               mb: 3,
//             }}
//           >
//             Your Gateway to Academic Excellence
//           </Typography>
//           <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}>
//             Join our community of learners to share knowledge, collaborate, and grow together.
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => navigate("/about")}
//             sx={{
//               px: 4,
//               py: 1.5,
//               borderRadius: 2,
//             }}
//           >
//             Get Started
//           </Button>
//         </Box>

//         <Grid container spacing={4}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} sm={6} md={index === 4 ? 12 : 3} key={index}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     transform: "translateY(-8px)",
//                     boxShadow: 3,
//                   },
//                   cursor: feature.onClick ? "pointer" : "default",
//                   ...(index === 4 && {
//                     borderColor: "primary.main",
//                     borderWidth: 2,
//                     borderStyle: "solid",
//                   }),
//                 }}
//                 onClick={feature.onClick}
//               >
//                 <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
//                   <Box
//                     sx={{
//                       color: index === 4 ? "primary.main" : "primary.main",
//                       mb: 2,
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {feature.icon}
//                   </Box>
//                   <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     {feature.description}
//                   </Typography>
//                   {feature.onClick && (
//                     <Button variant={index === 4 ? "contained" : "outlined"} size="small" onClick={feature.onClick}>
//                       {index === 4 ? "View Updates" : "Explore"}
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   )
// }

// export default Home

"use client"
import { useNavigate } from "react-router-dom"
import { Container, Box, Typography, Grid, Card, CardContent, Button, useTheme, useMediaQuery } from "@mui/material"
import {
  School as SchoolIcon,
  Book as BookIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  ContactMail as ContactIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import PageHeader from "./PageHeader"

const sections = [
  {
    title: "Resources",
    description:
      "Access a vast collection of study materials, notes, and educational resources shared by students and educators.",
    icon: <BookIcon sx={{ fontSize: 40 }} />,
    path: "/resources",
    image: "https://source.unsplash.com/random/800x600?education",
    color: "#1976d2",
  },
  {
    title: "About Us",
    description: "Learn about our mission, values, and the team behind the Academic Resource Portal.",
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    path: "/about",
    image: "https://source.unsplash.com/random/800x600?university",
    color: "#2e7d32",
  },
  {
    title: "Community",
    description: "Join our growing community of students and educators. Share knowledge and learn together.",
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    path: "/community",
    image: "https://source.unsplash.com/random/800x600?students",
    color: "#ed6c02",
  },
  {
    title: "Contact",
    description: "Get in touch with us. We're here to help and answer any questions you may have.",
    icon: <ContactIcon sx={{ fontSize: 40 }} />,
    path: "/contact",
    image: "https://source.unsplash.com/random/800x600?contact",
    color: "#9c27b0",
  },
]

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  const features = [
    {
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      title: "Material Sharing",
      description: "Share and access study materials, notes, and resources with your peers.",
      onClick: () => navigate("/resources"),
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      title: "Placement & Interview",
      description: "Get interview tips, a pool of DSA resources and know about placement drives. ",
      onClick: () => navigate("/internships-placements"),
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: "Job Search",
      description: "Find and apply for job opportunities and internships that match your skills and interests.",
      onClick: () => navigate("/jobs"),
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: "Group Collaboration",
      description: "Create and join study groups for collaborative learning and project work.",
      onClick: () => navigate("/discussion"),
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      title: "Smart Notifications",
      description: "Get personalized updates and important announcements through our AI-powered system.",
      onClick: () => navigate("/notices"),
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PageHeader title="Welcome to Academic Platform" />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero section with blurred image background */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            padding: 6,
          }}
        >
          {/* Background image with blur effect */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${require("./iitrpr_image.jpeg")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(8px)",
              transform: "scale(1.1)", // Prevent blur edges from showing
              zIndex: 0,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for better text readability
                zIndex: 1,
              },
            }}
          />

          {/* Content over the blurred image */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              color: "white", // Text color for better contrast
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)", // Text shadow for better readability
              }}
            >
              Your Gateway to Academic Excellence
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                maxWidth: "800px",
                mx: "auto",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)", // Text shadow for better readability
              }}
            >
              Join our community of learners to share knowledge, collaborate, and grow together.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/about")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={index === 4 ? 12 : 3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 3,
                  },
                  cursor: feature.onClick ? "pointer" : "default",
                  ...(index === 4 && {
                    borderColor: "primary.main",
                    borderWidth: 2,
                    borderStyle: "solid",
                  }),
                }}
                onClick={feature.onClick}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box
                    sx={{
                      color: index === 4 ? "primary.main" : "primary.main",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                  {feature.onClick && (
                    <Button variant={index === 4 ? "contained" : "outlined"} size="small" onClick={feature.onClick}>
                      {index === 4 ? "View Updates" : "Explore"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
