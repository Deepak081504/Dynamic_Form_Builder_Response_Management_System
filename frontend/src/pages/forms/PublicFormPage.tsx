import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Stack,
  Alert
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useParams } from 'react-router-dom';

interface FieldOption {
  id: number;
  option_label: string;
  option_value: string;
}

interface FormField {
  id: number;
  label: string;
  field_type: string;
  placeholder?: string;
  description?: string;
  is_required: boolean;
  options?: FieldOption[];
  condition_field_id?: number | null;
  condition_operator?: string | null;
  condition_value?: string | null;
}

export const PublicFormPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [formMeta, setFormMeta] = useState<any>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const loadPublicForm = async () => {
      try {
        setLoading(true);
        // 1. Fetch Form Meta
        const formRes = await fetch(`http://127.0.0.1:8000/api/forms/${formId}`);
        if (formRes.ok) {
          const fData = await formRes.json();
          setFormMeta(fData);
        }

        // 2. Fetch Form Questions/Fields
        const fieldsRes = await fetch(`http://127.0.0.1:8000/api/forms/${formId}/fields`);
        if (fieldsRes.ok) {
          const fList = await fieldsRes.json();
          setFields(Array.isArray(fList) ? fList : []);
        }
      } catch (err) {
        console.error('Failed to load public form:', err);
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      loadPublicForm();
    }
  }, [formId]);

  const handleInputChange = (fieldId: number, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Conditional Logic Check
  const isFieldVisible = (field: FormField) => {
    if (!field.condition_field_id) return true;
    const parentAnswer = formData[field.condition_field_id];
    if (!parentAnswer) return false;

    if (field.condition_operator === 'equals') {
      return String(parentAnswer).toLowerCase() === String(field.condition_value).toLowerCase();
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check mandatory fields
    for (const f of fields) {
      if (isFieldVisible(f) && f.is_required && !formData[f.id]) {
        setErrorMessage(`Please fill out required field: "${f.label}"`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const payloadDetails = Object.entries(formData).map(([fieldId, answer]) => ({
        field_id: Number(fieldId),
        answer: String(answer)
      }));

      const res = await fetch(`http://127.0.0.1:8000/api/forms/${formId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          form_id: Number(formId),
          details: payloadDetails
        })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json().catch(() => null);
        setErrorMessage(errData?.detail || 'Failed to submit response. Please try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage('Network error while submitting. Please verify backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <CircularProgress sx={{ color: '#4F46E5' }} size={42} />
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9', p: 3 }}>
        <Card elevation={0} sx={{ maxWidth: 520, width: '100%', p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 68, color: '#059669', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Thank You!
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
            Your response for <strong>{formMeta?.title || 'this form'}</strong> has been recorded successfully.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setFormData({});
              setSubmitted(false);
            }}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1', color: '#334155' }}
          >
            Submit Another Response
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F1F5F9', py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 680, mx: 'auto' }}>
        {/* Form Header Card */}
        <Card elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3.5, border: '1px solid #E2E8F0', borderTop: '6px solid #4F46E5', backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <DescriptionRoundedIcon sx={{ color: '#4F46E5', fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {formMeta?.title || 'Public Dynamic Form'}
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#64748B', mt: 1 }}>
            {formMeta?.description || 'Please provide accurate responses for the questions below.'}
          </Typography>
        </Card>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontWeight: 600 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Form Body Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {fields.map((field) => {
              if (!isFieldVisible(field)) return null;

              return (
                <Card
                  key={field.id}
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3.5,
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                    {field.label} {field.is_required && <span style={{ color: '#EF4444' }}>*</span>}
                  </Typography>

                  {field.description && (
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                      {field.description}
                    </Typography>
                  )}

                  {/* Field Input Components */}
                  {field.field_type === 'text' && (
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={field.placeholder || 'Your answer'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}

                  {field.field_type === 'number' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder={field.placeholder || 'Enter number'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}

                  {field.field_type === 'email' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      placeholder={field.placeholder || 'name@example.com'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}

                  {field.field_type === 'dropdown' && (
                    <FormControl fullWidth size="small">
                      <InputLabel id={`select-label-${field.id}`}>Choose option</InputLabel>
                      <Select
                        labelId={`select-label-${field.id}`}
                        label="Choose option"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        {field.options?.map((opt) => (
                          <MenuItem key={opt.id} value={opt.option_value}>
                            {opt.option_label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {field.field_type === 'rating' && (
                    <Box sx={{ mt: 1 }}>
                      <Rating
                        name={`rating-${field.id}`}
                        size="large"
                        value={Number(formData[field.id]) || 0}
                        onChange={(_, val) => handleInputChange(field.id, val)}
                      />
                    </Box>
                  )}
                </Card>
              );
            })}

            {/* Submit Action */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
                sx={{
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  px: 4,
                  py: 1.2,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  '&:hover': { backgroundColor: '#4338CA' }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default PublicFormPage;