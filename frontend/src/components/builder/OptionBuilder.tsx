import React from 'react';
import { Button, IconButton, Stack, TextField, Typography, Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export interface FieldOption {
  label: string;
  value: string;
}

interface OptionBuilderProps {
  options: FieldOption[];
  onChange: (options: FieldOption[]) => void;
}

export default function OptionBuilder({ options = [], onChange }: OptionBuilderProps) {
  const handleAddOption = () => {
    const nextIndex = options.length + 1;
    onChange([
      ...options,
      { label: `Option ${nextIndex}`, value: `option_${nextIndex}` }
    ]);
  };

  const handleUpdateOption = (index: number, key: 'label' | 'value', val: string) => {
    const updated = options.map((opt, idx) => {
      if (idx === index) {
        return {
          ...opt,
          [key]: val,
          ...(key === 'label' && (!opt.value || opt.value === opt.label.toLowerCase().replace(/\s+/g, '_'))
            ? { value: val.toLowerCase().replace(/\s+/g, '_') }
            : {})
        };
      }
      return opt;
    });
    onChange(updated);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    onChange(options.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
          Options
        </Typography>
        <Button
          size="small"
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={handleAddOption}
          sx={{ fontSize: '0.75rem', py: 0.2 }}
        >
          Add Option
        </Button>
      </Box>

      {options.length === 0 ? (
        <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
          No options added. Click &quot;Add Option&quot; above.
        </Typography>
      ) : (
        options.map((option, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={`Option ${index + 1}`}
              value={option.label}
              onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
            />
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRemoveOption(index)}
              aria-label="delete option"
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        ))
      )}
    </Stack>
  );
}