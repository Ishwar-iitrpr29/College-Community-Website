"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material"
import {
  Add as AddIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Message as MessageIcon,
} from "@mui/icons-material"
import PageHeader from "./PageHeader"

const DiscussionPage = () => {
  const navigate = useNavigate()
  const [classrooms, setClassrooms] = useState([])
  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [newClassroomName, setNewClassroomName] = useState("")
  const [newClassroomDescription, setNewClassroomDescription] = useState("")
  const [classroomToJoin, setClassroomToJoin] = useState("")

  // Fetch user's classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classrooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setClassrooms(data.classrooms)
        } else {
          console.error("Failed to fetch classrooms")
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClassrooms()
  }, [])

  // Fetch messages for selected classroom
  useEffect(() => {
    if (selectedClassroom) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classroom/${selectedClassroom.id}/messages`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setMessages(data.messages)
          } else {
            console.error("Failed to fetch messages")
          }
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      }

      fetchMessages()

      // Set up polling for new messages
      const intervalId = setInterval(fetchMessages, 5000)

      return () => clearInterval(intervalId)
    }
  }, [selectedClassroom])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSelectClassroom = (classroom) => {
    setSelectedClassroom(classroom)
    setTabValue(1) // Switch to messages tab
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClassroom) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classroom/${selectedClassroom.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        // Add the new message to the list
        const data = await response.json()
        setMessages([...messages, data.message])
        setNewMessage("")
      } else {
        console.error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classroom/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newClassroomName,
          description: newClassroomDescription,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setClassrooms([...classrooms, data.classroom])
        setCreateDialogOpen(false)
        setNewClassroomName("")
        setNewClassroomDescription("")
      } else {
        console.error("Failed to create classroom")
      }
    } catch (error) {
      console.error("Error creating classroom:", error)
    }
  }

  const handleJoinClassroom = async () => {
    if (!classroomToJoin.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classroom/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classroom_id: classroomToJoin }),
      })

      if (response.ok) {
        const data = await response.json()
        setClassrooms([...classrooms, data.classroom])
        setJoinDialogOpen(false)
        setClassroomToJoin("")
      } else {
        console.error("Failed to join classroom")
      }
    } catch (error) {
      console.error("Error joining classroom:", error)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PageHeader title="Discussion Groups" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="discussion tabs">
            <Tab label="My Groups" icon={<GroupIcon />} iconPosition="start" />
            {selectedClassroom && <Tab label="Messages" icon={<MessageIcon />} iconPosition="start" />}
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                My Discussion Groups
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Create Group
                </Button>
                <Button variant="outlined" onClick={() => setJoinDialogOpen(true)}>
                  Join Group
                </Button>
              </Box>
            </Box>

            {classrooms.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't joined any discussion groups yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Create Your First Group
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {classrooms.map((classroom) => (
                  <Grid item xs={12} sm={6} md={4} key={classroom.id}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleSelectClassroom(classroom)}
                    >
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {classroom.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {classroom.description}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                          Created by: {classroom.created_by} | Group ID: {classroom.id}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {tabValue === 1 && selectedClassroom && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton onClick={() => setTabValue(0)} sx={{ mr: 1 }}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h5" component="h2">
                {selectedClassroom.name}
              </Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {selectedClassroom.description}
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ height: "400px", overflowY: "auto", mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
              {messages.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    No messages yet. Be the first to start the conversation!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {messages.map((message, index) => (
                    <React.Fragment key={message.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>{message.user_id.charAt(0).toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.user_id}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {message.content}
                              </Typography>
                              <Typography component="span" variant="caption" display="block" sx={{ mt: 1 }}>
                                {new Date(message.timestamp).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < messages.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Container>

      {/* Create Classroom Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Discussion Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newClassroomDescription}
            onChange={(e) => setNewClassroomDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateClassroom} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Classroom Dialog */}
      <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)}>
        <DialogTitle>Join Discussion Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group ID"
            fullWidth
            variant="outlined"
            value={classroomToJoin}
            onChange={(e) => setClassroomToJoin(e.target.value)}
            helperText="Enter the Group ID provided by the group creator"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleJoinClassroom} variant="contained">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DiscussionPage

