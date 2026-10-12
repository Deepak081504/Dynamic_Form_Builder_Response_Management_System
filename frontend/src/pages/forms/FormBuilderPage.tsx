import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { formService } from '../../services/formService';
import { FormField } from '../../types/form';
import { Toolbox } from '../../components/builder/Toolbox';
import { CanvasItem } from '../../components/builder/CanvasItem';
import { PropertyInspector } from '../../components/builder/PropertyInspector';

export const FormBuilderPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(formId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && formId) {
      loadFormData(Number(formId));
    }
  }, [formId]);

  const loadFormData = async (id: number) => {
    try {
      setLoading(true);
      const formData = await formService.getFormById(id);
      setTitle(formData.title);
      setDescription(formData.description || '');

      const fieldData = await formService.getFormFields(id);
      setFields(fieldData);
      if (fieldData.length > 0) {
        setSelectedFieldIndex(0);
      }
    } catch {
      setToastMessage('Failed to load form details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (type: string, defaultLabel: string) => {
    const newField: FormField = {
      label: defaultLabel,
      field_type: type,
      is_required: false,
      field_order: fields.length + 1,
      placeholder: '',
      description: '',
      condition_field_id: 0,
      condition_operator: 'equals',
      condition_value: '',
      options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : []
    };

    const updated = [...fields, newField];
    setFields(updated);
    setSelectedFieldIndex(updated.length - 1);
  };

  const handleUpdateField = (updated: FormField) => {
    if (selectedFieldIndex === null) return;
    const nextFields = [...fields];
    nextFields[selectedFieldIndex] = updated;
    setFields(nextFields);
  };

  const handleDeleteField = (indexToRemove: number) => {
    const nextFields = fields.filter((_, idx) => idx !== indexToRemove);
    setFields(nextFields);
    if (selectedFieldIndex === indexToRemove) {
      setSelectedFieldIndex(nextFields.length > 0 ? 0 : null);
    } else if (selectedFieldIndex !== null && selectedFieldIndex > indexToRemove) {
      setSelectedFieldIndex(selectedFieldIndex - 1);
    }
  };

  const handleSaveForm = async () => {
    if (!title.trim()) {
      setToastMessage('Form title is required');
      return;
    }

    try {
      setSaving(true);
      let targetFormId = formId ? Number(formId) : null;

      if (!targetFormId) {
        const createdForm = await formService.createForm({ title, description });
        targetFormId = createdForm.id;
      } else {
        await formService.updateForm(targetFormId, { title, description });
      }

      for (let i = 0; i < fields.length; i++) {
        const fieldItem = { ...fields[i], field_order: i + 1 };
        if (fieldItem.id) {
          await formService.updateFormField(targetFormId, fieldItem.id, fieldItem);
        } else {
          await formService.createFormField(targetFormId, fieldItem);
        }
      }

      setToastMessage('Form saved successfully!');
      setTimeout(() => navigate('/forms'), 1000);
    } catch {
      setToastMessage('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const selectedField = selectedFieldIndex !== null ? fields[selectedFieldIndex] : null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/forms')}
          >
            Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            {isEditMode ? 'Edit Dynamic Form' : 'Create New Form'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={handleSaveForm}
          disabled={saving}
          sx={{ px: 3, py: 1 }}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : 'Save Form'}
        </Button>
      </Box>

      <Box sx={{ backgroundColor: '#FFFFFF', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
              Form Title
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Employee Feedback Survey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
              Description
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Collect responses for team performance"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 280px)' }}>
        <Grid item xs={12} md={3} sx={{ height: '100%' }}>
          <Toolbox onAddField={handleAddField} />
        </Grid>

        <Grid item xs={12} md={5} sx={{ height: '100%', overflowY: 'auto' }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              border: '2px dashed #CBD5E1',
              backgroundColor: '#FAFAFA',
              minHeight: '100%'
            }}
          >
            {fields.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: '#94A3B8' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Canvas is empty
                </Typography>
                <Typography variant="caption">
                  Click elements from the left panel to add fields.
                </Typography>
              </Box>
            ) : (
              fields.map((f, idx) => (
                <CanvasItem
                  key={f.id || idx}
                  field={f}
                  isSelected={selectedFieldIndex === idx}
                  onSelect={() => setSelectedFieldIndex(idx)}
                  onDelete={() => handleDeleteField(idx)}
                />
              ))
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <PropertyInspector
            field={selectedField}
            availableFields={fields}
            onUpdateField={handleUpdateField}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setToastMessage(null)} sx={{ borderRadius: 2 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};