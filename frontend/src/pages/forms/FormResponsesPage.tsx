import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { formService } from '../../services/formService';
import { responseService } from '../../services/responseService';
import { FormItem } from '../../types/form';

interface FormFieldMeta {
  id: number;
  label: string;
  field_type: string;
}

export const FormResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const [selectedFormId, setSelectedFormId] = useState<string>(formId || '1');
  const [formsList, setFormsList] = useState<FormItem[]>([]);
  const [formFields, setFormFields] = useState<FormFieldMeta[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeModalData, setActiveModalData] = useState<any | null>(null);

  // Forms dropdown list fetch
  useEffect(() => {
    const loadForms = async () => {
      try {
        const forms = await formService.getForms();
        setFormsList(forms);
      } catch (err) {
        console.error('Forms list load error:', err);
      }
    };
    loadForms();
  }, []);

  useEffect(() => {
    if (formId) {
      setSelectedFormId(formId);
    }
  }, [formId]);

  // Selected form-oda fields schema & responses fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch form fields from /api/forms/{form_id}/fields
        let fieldsData: FormFieldMeta[] = [];
        try {
          const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
          const res = await fetch(`http://127.0.0.1:8000/api/forms/${selectedFormId}/fields`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              Accept: 'application/json'
            }
          });
          if (res.ok) {
            fieldsData = await res.json();
          }
        } catch (e) {
          console.error('Failed to fetch fields schema:', e);
        }

        // Fallback mapping if API call fails
        if (!fieldsData || fieldsData.length === 0) {
          if (Number(selectedFormId) === 1) {
            fieldsData = [
              { id: 1, label: 'Employee Name', field_type: 'text' },
              { id: 2, label: 'Age', field_type: 'number' },
              { id: 3, label: 'Email Address', field_type: 'email' },
              { id: 4, label: 'Department', field_type: 'dropdown' },
              { id: 5, label: 'Overall Experience Rating', field_type: 'rating' }
            ];
          }
        }
        setFormFields(fieldsData);

        // 2. Fetch responses list
        const data: any = await responseService.getFormResponses(Number(selectedFormId));
        let resList: any[] = [];
        if (Array.isArray(data)) {
          resList = data;
        } else if (data && Array.isArray(data.data)) {
          resList = data.data;
        } else if (data && typeof data === 'object') {
          resList = [data];
        }
        setResponses(resList);
      } catch (err) {
        console.error('Responses fetch error:', err);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFormId) {
      fetchData();
    }
  }, [selectedFormId]);

  const handleFormChange = (newId: string) => {
    setSelectedFormId(newId);
    navigate(`/forms/${newId}/responses`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getFieldMeta = (fieldId: number): FormFieldMeta => {
    const found = formFields.find((f) => Number(f.id) === Number(fieldId));
    if (found) return found;
    return { id: fieldId, label: `Field ${fieldId}`, field_type: 'text' };
  };

  // Unique columns order list
  const activeFieldIds: number[] = formFields.length > 0
    ? formFields.map((f) => f.id)
    : Array.from(
        new Set(
          responses.flatMap((r: any) =>
            Array.isArray(r.details) ? r.details.map((d: any) => d.field_id) : []
          )
        )
      ).sort((a: any, b: any) => a - b) as number[];

  // Filter responses by search term
  const filteredResponses = responses.filter((res: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const details = res.details || [];
    return details.some((d: any) => String(d.answer).toLowerCase().includes(term));
  });

  // Export to CSV Function (Pure JS - No package needed)
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    const headers = ['Record ID', 'Submitted Date', ...activeFieldIds.map((id) => `"${getFieldMeta(id).label}"`)];
    const rows = filteredResponses.map((res: any) => {
      const rowId = res.id;
      const dateVal = formatDate(res.submitted_at ?? res.created_at);
      const answers = activeFieldIds.map((id) => {
        const item = res.details?.find((d: any) => d.field_id === id);
        return `"${item ? String(item.answer).replace(/"/g, '""') : ''}"`;
      });
      return [rowId, `"${dateVal}"`, ...answers].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `form_${selectedFormId}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/responses')}
            sx={{
              borderRadius: 2.5,
              borderColor: '#E2E8F0',
              color: '#334155',
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#FFFFFF',
              px: 2,
              '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }
            }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 800 }}>
              Form Submissions
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
              Audited dynamic submissions with real field headers
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 260, backgroundColor: '#FFFFFF', borderRadius: 2 }}>
            <InputLabel id="form-select-label" sx={{ fontWeight: 600 }}>Select Form</InputLabel>
            <Select
              labelId="form-select-label"
              value={selectedFormId}
              label="Select Form"
              onChange={(e) => handleFormChange(e.target.value)}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              {formsList.map((f: any) => {
                const fId = String(f.id ?? f.form_id);
                return (
                  <MenuItem key={fId} value={fId} sx={{ fontWeight: 600 }}>
                    {f.title || `Form ${fId}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={handleExportCSV}
            sx={{
              borderRadius: 2.5,
              borderColor: '#E2E8F0',
              color: '#059669',
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#FFFFFF',
              py: 0.9,
              px: 2,
              '&:hover': { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </Box>

      {/* Main Submissions Table Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Search & Counter Strip */}
        <Box
          sx={{
            p: 2.5,
            px: 3.5,
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <TextField
            size="small"
            placeholder="Search answers, names, emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{
              width: { xs: '100%', sm: 340 },
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
          <Chip
            label={`Total Records: ${filteredResponses.length}`}
            sx={{ fontWeight: 700, backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: 2 }}
          />
        </Box>

        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#4F46E5' }} size={38} />
            </Box>
          ) : filteredResponses.length === 0 ? (
            <Typography align="center" sx={{ color: '#94A3B8', py: 8, fontWeight: 600 }}>
              No responses recorded yet for this form.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F1F5F9' }}>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', width: 70, pl: 3.5 }}>#ID</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', minWidth: 160 }}>Submission Date</TableCell>
                    {activeFieldIds.map((fId) => (
                      <TableCell key={fId} sx={{ fontWeight: 800, color: '#334155', minWidth: 160 }}>
                        {getFieldMeta(fId).label}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#334155', minWidth: 100, pr: 3.5 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResponses.map((res: any, idx: number) => {
                    const rowId = res.id ?? idx + 1;
                    const dateVal = res.submitted_at ?? res.created_at;
                    const details = res.details || [];

                    return (
                      <TableRow
                        key={rowId}
                        hover
                        sx={{
                          transition: 'background-color 0.15s ease',
                          '&:hover': { backgroundColor: '#F8FAFC' },
                          '&:last-child td': { borderBottom: 0 }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: '#0F172A', pl: 3.5 }}>
                          #{rowId}
                        </TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                          {formatDate(dateVal)}
                        </TableCell>

                        {/* Each dynamic answer according to field type */}
                        {activeFieldIds.map((fId) => {
                          const meta = getFieldMeta(fId);
                          const item = details.find((d: any) => d.field_id === fId);
                          const answerText = item ? String(item.answer) : '-';

                          return (
                            <TableCell key={fId} sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.88rem' }}>
                              {meta.field_type === 'dropdown' ? (
                                <Chip
                                  label={answerText.toUpperCase()}
                                  size="small"
                                  sx={{
                                    fontWeight: 700,
                                    borderRadius: 1.5,
                                    backgroundColor: '#F1F5F9',
                                    color: '#334155'
                                  }}
                                />
                              ) : meta.field_type === 'rating' ? (
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.3, backgroundColor: '#FEF3C7', borderRadius: 1.5 }}>
                                  <StarRoundedIcon sx={{ fontSize: 16, color: '#D97706' }} />
                                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#B45309' }}>
                                    {answerText} / 5
                                  </Typography>
                                </Box>
                              ) : (
                                answerText
                              )}
                            </TableCell>
                          );
                        })}

                        {/* View Action Modal */}
                        <TableCell align="right" sx={{ pr: 3.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityRoundedIcon fontSize="small" />}
                            onClick={() => setActiveModalData(res)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 700,
                              borderColor: '#CBD5E1',
                              color: '#334155',
                              '&:hover': { backgroundColor: '#F8FAFC' }
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Modal */}
      <Dialog
        open={Boolean(activeModalData)}
        onClose={() => setActiveModalData(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Submission #{activeModalData?.id} Overview
          </Typography>
          <IconButton onClick={() => setActiveModalData(null)} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
            Submitted At: {formatDate(activeModalData?.submitted_at ?? activeModalData?.created_at)}
          </Typography>

          <Stack spacing={2} sx={{ mt: 2.5 }}>
            {activeModalData?.details?.map((item: any, i: number) => {
              const meta = getFieldMeta(item.field_id);
              return (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 2.5,
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                    {meta.label}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 700, mt: 0.5 }}>
                    {String(item.answer)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setActiveModalData(null)}
            variant="contained"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, backgroundColor: '#4F46E5' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormResponsesPage;