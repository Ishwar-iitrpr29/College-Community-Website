"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Refresh, Notifications } from "@mui/icons-material"
import NoticeCard from "./NoticeCard"
import PageHeader from "../PageHeader"
import { trackUserAction } from "../user-state-tracker"
import { useNavigate } from "react-router-dom"

const NoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  const tabs = [
    { label: "All Updates", value: "all" },
    { label: "Group Messages", value: "group_message" },
    { label: "Materials", value: "material" },
    { label: "Placements", value: "placement" },
    { label: "Interviews", value: "interview" },
  ]

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/latest-updates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch updates');
      }

      const data = await response.json();
      setNotices(data.updates);
      setLoading(false);

      // Track this view action
      const userId = localStorage.getItem("username")
      if (userId) {
        await trackUserAction(userId, "view_notices")
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleViewNotice = async (notice) => {
    // Track the view action
    const userId = localStorage.getItem("username")
    if (userId) {
      await trackUserAction(userId, `view_${notice.type}`, { noticeId: notice.id })
    }

    // Navigate to the appropriate page based on notice type
    switch (notice.type) {
      case "group_message":
        // For discussion groups, just navigate to the discussion page
        navigate("/discussion")
        break
      case "material":
        navigate(`/resources?materialId=${notice.sourceId}`)
        break
      case "placement":
        navigate(`/internships-placements?placementId=${notice.sourceId}`)
        break
      case "interview":
        navigate(`/internships-placements?interviewId=${notice.sourceId}`)
        break
      default:
        console.log("Unknown notice type:", notice.type)
    }
  }

  const filteredNotices = activeTab === 0 ? notices : notices.filter((notice) => notice.type === tabs[activeTab].value)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PageHeader title="Latest Updates" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Notifications sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Latest Updates
            </Typography>
          </Box>
          <Button startIcon={<Refresh />} onClick={fetchNotices} variant="outlined" disabled={loading}>
            Refresh
          </Button>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Stay updated with the latest activities, materials, and opportunities personalized for you.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : filteredNotices.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No updates available in this category.
          </Alert>
        ) : (
          <Box>
            {filteredNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onView={handleViewNotice} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default NoticesPage

