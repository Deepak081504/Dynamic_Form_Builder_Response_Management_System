import React from 'react';
import { Box, AppBar, Toolbar, Typography, Avatar, IconButton, Chip, Stack, GlobalStyles } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon fontSize="small" /> },
    { label: 'Forms', path: '/forms', icon: <DescriptionRoundedIcon fontSize="small" /> },
    { label: 'Responses', path: '/responses', icon: <ForumRoundedIcon fontSize="small" /> },
    { label: 'Analytics', path: '/analytics', icon: <InsightsRoundedIcon fontSize="small" /> },
    { label: 'Activity Logs', path: '/logs', icon: <HistoryRoundedIcon fontSize="small" /> }
  ];

  return (
    <>
      <GlobalStyles
        styles={{
          'html, body, #root': {
            margin: 0,
            padding: 0,
            width: '100%',
            overflowX: 'hidden',
            minHeight: '100vh',
            backgroundColor: '#E8EDF5 !important',
            backgroundImage: 'radial-gradient(at 15% 15%, #DCE6FD 0px, transparent 55%), radial-gradient(at 85% 15%, #EDE4FF 0px, transparent 50%), radial-gradient(at 50% 85%, #D7F0FD 0px, transparent 60%) !important',
            backgroundAttachment: 'fixed !important'
          }
        }}
      />

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
          backgroundColor: '#E8EDF5',
          backgroundImage: 'radial-gradient(at 15% 15%, #DCE6FD 0px, transparent 55%), radial-gradient(at 85% 15%, #EDE4FF 0px, transparent 50%), radial-gradient(at 50% 85%, #D7F0FD 0px, transparent 60%)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            background: 'linear-gradient(185deg, #0F172A 0%, #111827 50%, #1E1B4B 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 1200,
            boxShadow: '8px 0 24px rgba(15, 23, 42, 0.2)'
          }}
        >
          {/* Brand Logo Header */}
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.5)'
              }}
            >
              <DescriptionRoundedIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                fontSize: '1.25rem'
              }}
            >
              FormCraft
            </Typography>
          </Box>

          {/* Nav Items */}
          <Stack spacing={1.2} sx={{ px: 2, mt: 3, flex: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Box
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.8,
                    px: 2.2,
                    py: 1.3,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    boxShadow: isActive ? '0 8px 20px -2px rgba(79, 70, 229, 0.5)' : 'none',
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                        : 'rgba(255, 255, 255, 0.06)',
                      color: '#FFFFFF',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Box sx={{ color: isActive ? '#FFFFFF' : '#818CF8', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontWeight: isActive ? 800 : 600, fontSize: '0.92rem' }}>
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          {/* Footer Info */}
          <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)', opacity: 0.6 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem' }}>
              FormCraft SaaS v1.0
            </Typography>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, ml: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh', width: 'calc(100% - 260px)' }}>
          {/* Top Navbar */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1.5px solid rgba(203, 213, 225, 0.8)',
              color: '#0F172A'
            }}
          >
            <Toolbar sx={{ justifyContent: 'flex-end', px: 4, minHeight: '70px' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label="ADMIN"
                  size="small"
                  sx={{
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    borderRadius: 1.5,
                    border: '1px solid #C7D2FE'
                  }}
                />
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  D
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A', lineHeight: 1.2 }}>
                    Deepak
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                    deepak@gmail.com
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    ml: 1,
                    color: '#64748B',
                    backgroundColor: 'rgba(241, 245, 249, 0.8)',
                    borderRadius: 2,
                    '&:hover': { color: '#DC2626', backgroundColor: '#FEF2F2' }
                  }}
                >
                  <LogoutRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box sx={{ p: { xs: 2.5, md: 4 }, flex: 1, width: '100%', boxSizing: 'border-box' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;