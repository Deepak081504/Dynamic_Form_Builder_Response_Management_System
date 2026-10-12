import React from 'react';
import { Card, CardContent, Typography, Box, ButtonBase } from '@mui/material';
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded';
import PinRoundedIcon from '@mui/icons-material/PinRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ArrowDropDownCircleRoundedIcon from '@mui/icons-material/ArrowDropDownCircleRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';

export interface FieldToolItem {
  type: string;
  label: string;
  icon: React.ReactNode;
}

export const FIELD_TOOLS: FieldToolItem[] = [
  { type: 'text', label: 'Text Field', icon: <TextFieldsRoundedIcon fontSize="small" /> },
  { type: 'number', label: 'Number Field', icon: <PinRoundedIcon fontSize="small" /> },
  { type: 'email', label: 'Email Address', icon: <AlternateEmailRoundedIcon fontSize="small" /> },
  { type: 'date', label: 'Date Picker', icon: <CalendarMonthRoundedIcon fontSize="small" /> },
  { type: 'dropdown', label: 'Dropdown Select', icon: <ArrowDropDownCircleRoundedIcon fontSize="small" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckBoxRoundedIcon fontSize="small" /> },
  { type: 'radio', label: 'Radio Button', icon: <RadioButtonCheckedRoundedIcon fontSize="small" /> },
  { type: 'file', label: 'File Upload', icon: <CloudUploadRoundedIcon fontSize="small" /> },
  { type: 'rating', label: 'Star Rating', icon: <StarRateRoundedIcon fontSize="small" /> }
];

interface ToolboxProps {
  onAddField: (type: string, label: string) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ onAddField }) => {
  return (
    <Card sx={{ height: '100%', border: '1px solid #E2E8F0' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Form Elements
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
          Click an element to add it to your form canvas
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {FIELD_TOOLS.map((tool) => (
            <ButtonBase
              key={tool.type}
              onClick={() => onAddField(tool.type, tool.label)}
              sx={{
                width: '100%',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: '#FFFFFF',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  borderColor: '#4F46E5',
                  backgroundColor: '#EEF2FF',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box
                sx={{
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {tool.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                {tool.label}
              </Typography>
            </ButtonBase>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};