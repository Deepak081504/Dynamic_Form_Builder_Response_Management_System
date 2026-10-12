import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { FormField } from '../../types/form';

interface CanvasItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const CanvasItem: React.FC<CanvasItemProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete
}) => {
  return (
    <Card
      onClick={onSelect}
      sx={{
        mb: 2,
        cursor: 'pointer',
        border: isSelected ? '2px solid #4F46E5' : '1px solid #E2E8F0',
        backgroundColor: isSelected ? '#F5F7FF' : '#FFFFFF',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: isSelected ? '#4F46E5' : '#CBD5E1'
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DragIndicatorRoundedIcon sx={{ color: '#94A3B8', cursor: 'grab' }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {field.label}
                </Typography>
                {field.is_required && (
                  <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 800 }}>
                    *
                  </Typography>
                )}
                <Chip
                  label={field.field_type.toUpperCase()}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    height: 20,
                    backgroundColor: '#E2E8F0',
                    color: '#475569'
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {field.description || field.placeholder || 'No placeholder configured'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {field.condition_field_id > 0 && (
              <Chip
                label="Conditional"
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  height: 20,
                  backgroundColor: '#FEF3C7',
                  color: '#B45309'
                }}
              />
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <SettingsRoundedIcon fontSize="small" sx={{ color: '#64748B' }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: '#EF4444' }} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};