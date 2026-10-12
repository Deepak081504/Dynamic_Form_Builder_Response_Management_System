import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { FormField } from '../../types/form';

interface PropertyInspectorProps {
  field: FormField | null;
  availableFields: FormField[];
  onUpdateField: (updated: FormField) => void;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  field,
  availableFields,
  onUpdateField
}) => {
  const [newOption, setNewOption] = useState('');

  if (!field) {
    return (
      <Card sx={{ height: '100%', border: '1px solid #E2E8F0', p: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 4 }}>
          Select a field on the canvas to configure its properties and validations.
        </Typography>
      </Card>
    );
  }

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const currentOptions = field.options || [];
    onUpdateField({
      ...field,
      options: [...currentOptions, newOption.trim()]
    });
    setNewOption('');
  };

  const handleRemoveOption = (indexToRemove: number) => {
    const currentOptions = field.options || [];
    onUpdateField({
      ...field,
      options: currentOptions.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(field.field_type.toLowerCase());

  return (
    <Card sx={{ height: '100%', border: '1px solid #E2E8F0', overflowY: 'auto' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Field Properties
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
          Editing configuration for {field.label}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
              Label
            </Typography>
            <TextField
              fullWidth
              value={field.label}
              onChange={(e) => onUpdateField({ ...field, label: e.target.value })}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
              Placeholder
            </Typography>
            <TextField
              fullWidth
              value={field.placeholder || ''}
              onChange={(e) => onUpdateField({ ...field, placeholder: e.target.value })}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
              Helper / Description
            </Typography>
            <TextField
              fullWidth
              value={field.description || ''}
              onChange={(e) => onUpdateField({ ...field, description: e.target.value })}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={field.is_required}
                onChange={(e) => onUpdateField({ ...field, is_required: e.target.checked })}
                color="primary"
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Required Field</Typography>}
          />

          {hasOptions && (
            <Box sx={{ borderTop: '1px solid #E2E8F0', pt: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, display: 'block' }}>
                Options List
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="New option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                />
                <Button variant="outlined" size="small" onClick={handleAddOption} startIcon={<AddRoundedIcon />}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {(field.options || []).map((opt, idx) => (
                  <Chip
                    key={idx}
                    label={opt}
                    size="small"
                    onDelete={() => handleRemoveOption(idx)}
                    sx={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ borderTop: '1px solid #E2E8F0', pt: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, display: 'block' }}>
              Conditional Visibility
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                  Depends on Field
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={field.condition_field_id || 0}
                  onChange={(e) =>
                    onUpdateField({ ...field, condition_field_id: Number(e.target.value) })
                  }
                >
                  <MenuItem value={0}>None (Always Visible)</MenuItem>
                  {availableFields
                    .filter((f) => f.id !== field.id)
                    .map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.label} (#{f.id})
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              {field.condition_field_id > 0 && (
                <>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                      Operator
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={field.condition_operator || 'equals'}
                      onChange={(e) =>
                        onUpdateField({ ...field, condition_operator: e.target.value })
                      }
                    >
                      <MenuItem value="equals">Equals</MenuItem>
                      <MenuItem value="not_equals">Does Not Equal</MenuItem>
                      <MenuItem value="contains">Contains</MenuItem>
                    </TextField>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                      Trigger Value
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. Yes"
                      value={field.condition_value || ''}
                      onChange={(e) =>
                        onUpdateField({ ...field, condition_value: e.target.value })
                      }
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};