import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#4338CA',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7'
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B'
    },
    divider: '#E2E8F0',
    success: {
      main: '#10B981'
    },
    error: {
      main: '#EF4444'
    },
    warning: {
      main: '#F59E0B'
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.025em'
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    subtitle1: {
      fontWeight: 600
    },
    body1: {
      fontSize: '0.95rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          padding: '8px 18px',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 15px -5px rgba(0, 0, 0, 0.04)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small'
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94A3B8'
          }
        }
      }
    }
  }
});