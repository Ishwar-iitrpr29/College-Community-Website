// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Box,
//   Button,
//   Menu,
//   MenuItem,
//   useTheme,
//   useMediaQuery,
//   Tooltip,
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Brightness4,
//   Brightness7,
//   Person,
//   Logout,
//   Home,
//   School,
//   Info,
//   ContactMail,
// } from '@mui/icons-material';
// import { useTheme as useCustomTheme } from '../theme/ThemeContext';
// import { useAuth } from '../context/auth/AuthContext';

// const PageHeader = ({ title }) => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const { darkMode, toggleDarkMode } = useCustomTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [anchorEl, setAnchorEl] = useState(null);
//   const { user, logout } = useAuth();

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     handleClose();
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//     handleClose();
//   };

//   const menuItems = [
//     { text: 'Home', icon: <Home />, path: '/' },
//     { text: 'Resources', icon: <School />, path: '/resources' },
//     { text: 'About Us', icon: <Info />, path: '/about' },
//     { text: 'Contact', icon: <ContactMail />, path: '/contact' },
//   ];

//   return (
//     <AppBar 
//       position="static" 
//       elevation={0}
//       sx={{
//         background: 'transparent',
//         borderBottom: '1px solid',
//         borderColor: 'divider',
//         backdropFilter: 'blur(8px)',
//       }}
//     >
//       <Toolbar>
//         {isMobile && (
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             onClick={handleMenu}
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//         )}

//         <Typography
//           variant="h6"
//           component="div"
//           sx={{
//             flexGrow: 1,
//             fontWeight: 600,
//             background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             cursor: 'pointer',
//           }}
//           onClick={() => navigate('/')}
//         >
//           {title}
//         </Typography>

//         {!isMobile && (
//           <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
//             {menuItems.map((item) => (
//               <Tooltip key={item.text} title={item.text}>
//                 <IconButton
//                   color="inherit"
//                   onClick={() => handleNavigation(item.path)}
//                   sx={{
//                     '&:hover': {
//                       backgroundColor: 'rgba(92, 107, 192, 0.1)',
//                     },
//                   }}
//                 >
//                   {item.icon}
//                 </IconButton>
//               </Tooltip>
//             ))}
//           </Box>
//         )}

//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
//             <IconButton
//               color="inherit"
//               onClick={toggleDarkMode}
//               sx={{
//                 '&:hover': {
//                   backgroundColor: 'rgba(92, 107, 192, 0.1)',
//                 },
//               }}
//             >
//               {darkMode ? <Brightness7 /> : <Brightness4 />}
//             </IconButton>
//           </Tooltip>

//           {user ? (
//             <>
//               <Tooltip title="Profile">
//                 <IconButton
//                   color="inherit"
//                   onClick={() => handleNavigation('/profile')}
//                   sx={{
//                     '&:hover': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                     },
//                   }}
//                 >
//                   <Person />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Logout">
//                 <IconButton
//                   color="inherit"
//                   onClick={handleLogout}
//                   sx={{
//                     '&:hover': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                     },
//                   }}
//                 >
//                   <Logout />
//                 </IconButton>
//               </Tooltip>
//             </>
//           ) : (
//             <>
//               <Button color="inherit" onClick={() => navigate('/login')}>
//                 Login
//               </Button>
//               <Button color="inherit" onClick={() => navigate('/signup')}>
//                 Sign Up
//               </Button>
//             </>
//           )}
//         </Box>

//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//           PaperProps={{
//             sx: {
//               mt: 1.5,
//               borderRadius: 2,
//               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//             },
//           }}
//         >
//           {menuItems.map((item) => (
//             <MenuItem
//               key={item.text}
//               onClick={() => handleNavigation(item.path)}
//               sx={{
//                 gap: 1,
//                 '&:hover': {
//                   backgroundColor: 'rgba(92, 107, 192, 0.1)',
//                 },
//               }}
//             >
//               {item.icon}
//               {item.text}
//             </MenuItem>
//           ))}
//           {user && (
//             <MenuItem
//               onClick={handleLogout}
//               sx={{
//                 gap: 1,
//                 color: 'error.main',
//                 '&:hover': {
//                   backgroundColor: 'rgba(211, 47, 47, 0.1)',
//                 },
//               }}
//             >
//               <Logout />
//               Logout
//             </MenuItem>
//           )}
//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default PageHeader; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Person,
  Logout,
  Home,
  School,
  Info,
  ContactMail,
  Work, // Added Work icon for Jobs
  WorkOutline, // Added WorkOutline icon for Internships and Placements
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/auth/AuthContext';

const PageHeader = ({ title }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Resources', icon: <School />, path: '/resources' },
    { text: 'Jobs', icon: <Work />, path: '/jobs' }, // Added Jobs menu item
    { text: "Internships & Placements", icon: <WorkOutline />, path: "/internships-placements" }, // Add this new menu item
    { text: 'About Us', icon: <Info />, path: '/about' },
    { text: 'Contact', icon: <ContactMail />, path: '/contact' },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          {title}
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            {menuItems.map((item) => (
              <Tooltip key={item.text} title={item.text}>
                <IconButton
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(92, 107, 192, 0.1)',
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(92, 107, 192, 0.1)',
                },
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Profile">
                <IconButton
                  color="inherit"
                  onClick={() => handleNavigation('/profile')}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Person />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Logout />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                gap: 1,
                '&:hover': {
                  backgroundColor: 'rgba(92, 107, 192, 0.1)',
                },
              }}
            >
              {item.icon}
              {item.text}
            </MenuItem>
          ))}
          {user && (
            <MenuItem
              onClick={handleLogout}
              sx={{
                gap: 1,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                },
              }}
            >
              <Logout />
              Logout
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;