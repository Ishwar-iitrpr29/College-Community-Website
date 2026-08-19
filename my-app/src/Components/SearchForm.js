"use client"

import { useState } from "react"
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';

function SearchForm({ onSearch }) {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useState({
    field: "",
    geoid: "",
    page: 0,
    sortBy: "",
    jobType: "",
    expLevel: "",
    workType: "",
    filterByCompany: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : 'white',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`
          : `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        sx={{ 
          mb: 3,
          color: 'text.primary',
          fontWeight: 600
        }}
      >
        Search Jobs
      </Typography>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-row" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div className="form-group">
            <label htmlFor="field" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Keywords</label>
            <input
              type="text"
              id="field"
              name="field"
              value={searchParams.field}
              onChange={handleChange}
              placeholder="Job title, skills, or company"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="geoid" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Location</label>
            <input
              type="text"
              id="geoid"
              name="geoid"
              value={searchParams.geoid}
              onChange={handleChange}
              placeholder="City, state, or country"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            />
          </div>
        </div>

        <div className="form-row" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div className="form-group">
            <label htmlFor="jobType" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={searchParams.jobType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            >
              <option value="">All Job Types</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temoporary">Temporary</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expLevel" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Experience Level</label>
            <select
              id="expLevel"
              name="expLevel"
              value={searchParams.expLevel}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            >
              <option value="">All Experience Levels</option>
              <option value="internship">Internship</option>
              <option value="entry_level">Entry level</option>
              <option value="associate">Associate</option>
              <option value="mid_senior_level">Mid-Senior level</option>
              <option value="director">Director</option>
            </select>
          </div>
        </div>

        <div className="form-row" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div className="form-group">
            <label htmlFor="workType" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Work Type</label>
            <select
              id="workType"
              name="workType"
              value={searchParams.workType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            >
              <option value="">All Work Types</option>
              <option value="at_work">At Work</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sortBy" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Sort By</label>
            <select
              id="sortBy"
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            >
              <option value="">All</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        <div className="form-row" style={{ 
          marginBottom: '20px'
        }}>
          <div className="form-group">
            <label htmlFor="filterByCompany" style={{ 
              display: 'block',
              marginBottom: '8px',
              color: theme.palette.text.primary,
              fontWeight: 500
            }}>Company</label>
            <input
              type="text"
              id="filterByCompany"
              name="filterByCompany"
              value={searchParams.filterByCompany}
              onChange={handleChange}
              placeholder="Filter by company"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
                color: theme.palette.text.primary,
                '&:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '14px 24px',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`
            }
          }}
        >
          Search Jobs
        </button>
      </form>
    </Paper>
  )
}

export default SearchForm

