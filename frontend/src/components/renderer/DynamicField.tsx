import React from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Rating,
  Button
} from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { FormField } from '../../types/form';

interface DynamicFieldProps {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const type = field.field_type.toLowerCase();

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <TextField
            fullWidth
            type={type === 'email' ? 'email' : 'text'}
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={Boolean(error)}
            helperText={error || field.description}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={Boolean(error)}
            helperText={error || field.description}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={Boolean(error)}
            helperText={error || field.description}
          />
        );

      case 'dropdown':
        return (
          <TextField
            select
            fullWidth
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={Boolean(error)}
            helperText={error || field.description}
          >
            {(field.options || []).map((opt, i) => (
              <MenuItem key={i} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        );

      case 'radio':
        return (
          <RadioGroup value={value || ''} onChange={(e) => onChange(e.target.value)}>
            {(field.options || []).map((opt, i) => (
              <FormControlLabel
                key={i}
                value={opt}
                control={<Radio size="small" color="primary" />}
                label={<Typography variant="body2">{opt}</Typography>}
              />
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const checkedList = value ? value.split(',') : [];
        const handleToggle = (opt: string) => {
          let updated: string[];
          if (checkedList.includes(opt)) {
            updated = checkedList.filter((item) => item !== opt);
          } else {
            updated = [...checkedList, opt];
          }
          onChange(updated.join(','));
        };

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {(field.options || []).map((opt, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    size="small"
                    checked={checkedList.includes(opt)}
                    onChange={() => handleToggle(opt)}
                  />
                }
                label={<Typography variant="body2">{opt}</Typography>}
              />
            ))}
          </Box>
        );

      case 'rating':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={Number(value) || 0}
              onChange={(_, newVal) => onChange(String(newVal || 0))}
              size="large"
            />
          </Box>
        );

      case 'file':
        return (
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadRoundedIcon />}
              size="small"
            >
              Upload Attachment
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file.name);
                }}
              />
            </Button>
            {value && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#4F46E5' }}>
                Selected: {value}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <TextField
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>
          {field.label}
        </Typography>
        {field.is_required && (
          <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 800 }}>
            *
          </Typography>
        )}
      </Box>
      {renderInput()}
    </Box>
  );
};