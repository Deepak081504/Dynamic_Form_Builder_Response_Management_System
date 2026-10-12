import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
    { label: 'Forms', path: '/forms', icon: <AssignmentRoundedIcon /> },
    { label: 'Responses', path: '/responses', icon: <QuestionAnswerRoundedIcon /> },
    ...(isAdmin
      ? [
          { label: 'Analytics', path: '/analytics', icon: <InsightsRoundedIcon /> },
          { label: 'Activity Logs', path: '/logs', icon: <HistoryRoundedIcon /> }
        ]
      : [])
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          position: 'relative',
          height: '100%'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const isSelected =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <ListItemButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: 2,
                  color: isSelected ? '#4F46E5' : '#64748B',
                  backgroundColor: isSelected ? '#EEF2FF' : 'transparent',
                  fontWeight: isSelected ? 700 : 500,
                  '&:hover': {
                    backgroundColor: isSelected ? '#EEF2FF' : '#F8FAFC',
                    color: isSelected ? '#4F46E5' : '#0F172A'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: isSelected ? '#4F46E5' : '#94A3B8'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 700 : 600
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};