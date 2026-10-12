import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 }
      }}
    >
      <Outlet />
    </Box>
  );
};