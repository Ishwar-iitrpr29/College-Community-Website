"use client"
import { Card, CardContent, Typography, Box, Avatar, Chip, Button } from "@mui/material"
import { AccessTime, School, Group, Work, Description } from "@mui/icons-material"
import { formatDistanceToNow } from "date-fns"

const getIconByType = (type) => {
  switch (type) {
    case "group_message":
      return <Group color="primary" />
    case "material":
      return <School color="secondary" />
    case "placement":
      return <Work color="success" />
    case "interview":
      return <Description color="warning" />
    default:
      return <Description />
  }
}

const NoticeCard = ({ notice, onView }) => {
  const handleView = () => {
    if (onView) {
      onView(notice)
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: notice.color || "#1976d2", mr: 2 }}>{getIconByType(notice.type)}</Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {notice.title}
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <AccessTime fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(notice.timestamp), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {notice.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Chip size="small" label={notice.type.replace("_", " ")} sx={{ mr: 1, textTransform: "capitalize" }} />
            {notice.tags &&
              notice.tags.map((tag, index) => (
                <Chip key={index} size="small" label={tag} variant="outlined" sx={{ mr: 1 }} />
              ))}
          </Box>
          <Button size="small" variant="outlined" onClick={handleView}>
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default NoticeCard

