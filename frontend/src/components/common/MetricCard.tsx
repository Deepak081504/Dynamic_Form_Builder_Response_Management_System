import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        backgroundColor: '#FFFFFF !important',
        borderRadius: '16px !important',
        border: '1.5px solid #E2E8F0 !important',
        boxShadow: '0 4px 15px -1px rgba(15, 23, 42, 0.05) !important',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.08) !important',
          borderColor: '#CBD5E1 !important'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
              {value}
            </Typography>
            {trend && (
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                {trend}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};