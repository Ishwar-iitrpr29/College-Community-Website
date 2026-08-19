import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#5C6BC0', // Indigo
        light: '#7986CB',
        dark: '#3949AB',
      },
      secondary: {
        main: '#7C4DFF', // Deep Purple
        light: '#9575FF',
        dark: '#651FFF',
      },
      background: {
        default: darkMode ? '#121212' : '#F5F5F5',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#212121',
        secondary: darkMode ? '#B0B0B0' : '#757575',
      },
    },
    typography: {
      fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-4px',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
          transform: 'scaleX(0)',
          transformOrigin: 'right',
          transition: 'transform 0.3s ease',
        },
        '&:hover::after': {
          transform: 'scaleX(1)',
          transformOrigin: 'left',
        },
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-4px',
          left: 0,
          width: '60%',
          height: '2px',
          background: '#5C6BC0',
          transform: 'scaleX(0)',
          transformOrigin: 'right',
          transition: 'transform 0.3s ease',
        },
        '&:hover::after': {
          transform: 'scaleX(1)',
          transformOrigin: 'left',
        },
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '0',
              height: '0',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.6s ease, height 0.6s ease',
            },
            '&:active::after': {
              width: '300px',
              height: '300px',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease',
            },
            '&:hover::before': {
              transform: 'translateX(100%)',
            },
          },
          contained: {
            background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
            boxShadow: 'none',
            '&:hover': {
              background: 'linear-gradient(45deg, #3949AB 30%, #651FFF 90%)',
              boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(92, 107, 192, 0.15)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
              borderRadius: '16px 16px 0 0',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
              background: 'linear-gradient(45deg, rgba(92, 107, 192, 0.1) 0%, rgba(124, 77, 255, 0.1) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            },
            '&:hover::after': {
              opacity: 1,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            background: darkMode ? '#1E1E1E' : '#FFFFFF',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(92, 107, 192, 0.1)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode ? '#1E1E1E' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#212121',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(92, 107, 192, 0.1)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(92, 107, 192, 0.1)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              backgroundColor: 'rgba(92, 107, 192, 0.1)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '0',
              height: '0',
              backgroundColor: 'rgba(92, 107, 192, 0.1)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.3s ease, height 0.3s ease',
            },
            '&:active::after': {
              width: '100%',
              height: '100%',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s ease',
              '&:hover fieldset': {
                borderColor: '#5C6BC0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#5C6BC0',
                boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.1)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '0',
                height: '2px',
                background: 'linear-gradient(45deg, #5C6BC0 30%, #7C4DFF 90%)',
                transform: 'translateX(-50%)',
                transition: 'width 0.3s ease',
              },
              '&:focus-within::after': {
                width: '100%',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(92, 107, 192, 0.2)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(45deg, rgba(92, 107, 192, 0.1) 0%, rgba(124, 77, 255, 0.1) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::after': {
              opacity: 1,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(45deg, rgba(92, 107, 192, 0.2) 0%, rgba(124, 77, 255, 0.2) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::after': {
              opacity: 1,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            background: darkMode ? '#1E1E1E' : '#FFFFFF',
            boxShadow: '0 8px 32px rgba(92, 107, 192, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 48px rgba(92, 107, 192, 0.3)',
            },
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiSnackbarContent-root': {
              borderRadius: 12,
              background: darkMode ? '#1E1E1E' : '#FFFFFF',
              boxShadow: '0 4px 16px rgba(92, 107, 192, 0.2)',
              border: '1px solid rgba(92, 107, 192, 0.1)',
            },
          },
        },
      },
    },
  });

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 
