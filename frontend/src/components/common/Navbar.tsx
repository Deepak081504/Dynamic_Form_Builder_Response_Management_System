import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DynamicFormRoundedIcon from '@mui/icons-material/DynamicFormRounded';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: 70, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <DynamicFormRoundedIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            FormCraft
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.role && (
            <Chip
              label={user.role.toUpperCase()}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.7rem',
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                borderRadius: 1.5
              }}
            />
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#4F46E5', fontSize: '0.875rem', fontWeight: 700 }}>
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {user?.full_name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                {user?.email || ''}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Sign Out">
            <IconButton onClick={handleLogout} size="small" sx={{ color: '#64748B', ml: 0.5 }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};