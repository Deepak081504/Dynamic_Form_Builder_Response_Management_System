import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF2F6',
        p: 2
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthLayout;