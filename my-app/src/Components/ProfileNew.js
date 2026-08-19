"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Edit as EditIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material"
import { useAuth } from "../context/auth/AuthContext"

const ProfileNew = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    bio: "",
    profile_picture: "",
  })
  const [stats, setStats] = useState({
    uploads: 0,
    comments: 0,
    placements_added: 0,
    placements_searches: 0,
    interview_experiences_added: 0,
    interview_experience_searches: 0,
    dsa_searches: 0,
    classrooms_created: [],
    classrooms_joined: [],
    recent_activity: [],
  })

  // Fetch profile data on component mount
  const fetchProfileData = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch profile (${response.status})`)
      }

      const data = await response.json()
      setProfileData({
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        profile_picture: data.profile_picture || "",
      })
    } catch (err) {
      console.error("Error fetching profile data:", err)
      setError(err.message || "An unknown error occurred while fetching profile data.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch("http://localhost:5000/user-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }
        throw new Error(`Failed to fetch user stats (${response.status})`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching user stats:", err)
    }
  }

  // Fetch both profile and stats data when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchData = async () => {
      await Promise.all([fetchProfileData(), fetchUserStats()])
    }
    fetchData()
  }, [navigate]) // Add navigate to dependencies

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setHasUnsavedChanges(true)
  }

  // Handle save changes
  const handleSave = async () => {
    try {
      setSaving(true)
      setError("")
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update profile (${response.status})`)
      }

      setSuccess("Profile updated successfully")
      setHasUnsavedChanges(false)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Handle back button
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setOpenDialog(true)
    } else {
      navigate("/")
    }
  }

  // Handle image selection and upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    setSuccess("")

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:5000/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to upload picture (${response.status})`)
      }

      const data = await response.json()
      setProfileData((prev) => ({
        ...prev,
        profile_picture: data.profile_picture || prev.profile_picture,
      }))
      setSuccess("Profile picture updated successfully!")
    } catch (err) {
      console.error("Error uploading profile picture:", err)
      setError(err.message || "An unknown error occurred during upload.")
    } finally {
      setUploading(false)
      e.target.value = null
    }
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?"
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
          <Box>
            <Button variant="outlined" onClick={handleBack} sx={{ mr: 2 }}>
              Back
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave} 
              disabled={saving || !hasUnsavedChanges}
            >
              {saving ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "300px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {/* Profile Picture Section */}
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <Tooltip title="Change profile picture">
                        <IconButton
                          component="label"
                          htmlFor="profile-picture-upload-input"
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                          disabled={uploading}
                        >
                          {uploading ? <CircularProgress size={20} color="inherit" /> : <EditIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <Avatar
                      src={profileData.profile_picture || ""}
                      alt={profileData.username || "User"}
                      sx={{
                        width: 150,
                        height: 150,
                        fontSize: "4rem",
                        border: "3px solid #e0e0e0",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {!profileData.profile_picture && getInitials(profileData.username)}
                    </Avatar>
                  </Badge>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-picture-upload-input"
                    type="file"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </Box>
              </Grid>

              {/* Profile Details Section */}
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Statistics Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">{stats.uploads}</Typography>
                    <Typography color="textSecondary">Total Uploads</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">{stats.comments}</Typography>
                    <Typography color="textSecondary">Total Comments</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">{stats.placements_added}</Typography>
                    <Typography color="textSecondary">Placements Added</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">{stats.placements_searches}</Typography>
                    <Typography color="textSecondary">Placement Searches</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">{stats.interview_experiences_added}</Typography>
                    <Typography color="textSecondary">Interview Experiences Added</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">{stats.dsa_searches}</Typography>
                    <Typography color="textSecondary">DSA Searches</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Classrooms Section */}
            {(stats.classrooms_created?.length > 0 || stats.classrooms_joined?.length > 0) && (
              <Box sx={{ mt: 4 }}>
                {stats.classrooms_created?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Classrooms Created
                    </Typography>
                    <List>
                      {stats.classrooms_created.map((classroom) => (
                        <ListItem key={classroom.id} divider>
                          <ListItemText primary={classroom.name} secondary={`Classroom ID: ${classroom.id}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {stats.classrooms_joined?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Classrooms Joined
                    </Typography>
                    <List>
                      {stats.classrooms_joined.map((classroom) => (
                        <ListItem key={classroom.id} divider>
                          <ListItemText primary={classroom.name} secondary={`Classroom ID: ${classroom.id}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}

            {/* Recent Activity Section */}
            {stats.recent_activity?.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {stats.recent_activity.map((activity) => (
                    <ListItem key={activity.id} divider>
                      <ListItemText
                        primary={activity.course_code}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {activity.description}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="textSecondary">
                              {new Date(activity.created_at).toLocaleDateString()} • {activity.upvotes} upvotes •{" "}
                              {activity.downvotes} downvotes
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Unsaved Changes Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>You have unsaved changes. Are you sure you want to leave without saving?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setOpenDialog(false)
              navigate("/")
            }}
            color="error"
            variant="contained"
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProfileNew 