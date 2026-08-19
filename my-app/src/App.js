import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./theme/ThemeContext"
import { AuthProvider } from "./context/auth/AuthContext"
import { CssBaseline, Box } from "@mui/material"
import Home from "./Components/Home"
import Resource from "./Components/Resource"
import Login from "./Components/Login"
import Signup from "./Components/Signup"
import AboutUs from "./Components/AboutUs"
import Contact from "./Components/Contact"
import Profile from "./Components/Profile"
import ProtectedRoute from "./Components/ProtectedRoute"
import Jobs from "./Components/Jobs"
import InternshipPlacement from "./Components/InternshipPlacement"
import SeniorsData from "./Components/SeniorsData"
import InterviewExperiences from "./Components/InterviewExperiences"
import DSAResources from "./Components/DSAResource"
import DiscussionPage from "./Components/DiscussionPage"
import NoticesPage from "./Components/notices/NoticePage"
import ProfileNew from "./Components/ProfileNew"
import ResetPassword from './Components/ResetPassword'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            {/* <Header /> */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resource />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <AboutUs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileNew />
                  </ProtectedRoute>
                }
              />
              {/* New Jobs Route */}
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                }
              />
              {/* New Internship & Placement Routes */}
              <Route
                path="/internships-placements"
                element={
                  <ProtectedRoute>
                    <InternshipPlacement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internships-placements/seniors-data"
                element={
                  <ProtectedRoute>
                    <SeniorsData />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internships-placements/dsa-resources"
                element={
                  <ProtectedRoute>
                    <DSAResources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internships-placements/interview-experiences"
                element={
                  <ProtectedRoute>
                    <InterviewExperiences />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discussion"
                element={
                  <ProtectedRoute>
                    <DiscussionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notices"
                element={
                  <ProtectedRoute>
                    <NoticesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {/* <Footer /> */}
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

