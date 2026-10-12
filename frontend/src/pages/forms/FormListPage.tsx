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
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useNavigate } from 'react-router-dom';
import { formService } from '../../services/formService';
import { FormItem } from '../../types/form';

export const FormListPage: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const [shareModal, setShareModal] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: '',
    title: ''
  });
  const [copied, setCopied] = useState<boolean>(false);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; formId: number | null; title: string }>({
    open: false,
    formId: null,
    title: ''
  });

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await formService.getForms();
      setForms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load forms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  // Form Status Toggle - Database Persistent
  const handleToggleStatus = async (form: any) => {
    const fId = Number(form.id ?? form.form_id);
    const currentStatus =
      form.enabled !== undefined
        ? Boolean(form.enabled)
        : form.is_active !== undefined
        ? Boolean(form.is_active)
        : true;
    const nextStatus = !currentStatus;

    // 1. Instant UI update
    setForms((prevForms) =>
      prevForms.map((item: any) => {
        const itemId = Number(item.id ?? item.form_id);
        if (itemId === fId) {
          return {
            ...item,
            enabled: nextStatus,
            is_active: nextStatus
          };
        }
        return item;
      })
    );

    // 2. FastAPI payload - Pydantic validation pass aaga title & description sethu anupuroom
    const updatePayload = {
      title: form.title,
      description: form.description || '',
      enabled: nextStatus,
      is_active: nextStatus
    };

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json'
      };

      // PUT attempt (standard FastAPI CRUD)
      let res = await fetch(`http://127.0.0.1:8000/api/forms/${fId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatePayload)
      });

      // If PUT is 405 (Method Not Allowed), try PATCH
      if (!res.ok && res.status === 405) {
        res = await fetch(`http://127.0.0.1:8000/api/forms/${fId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updatePayload)
        });
      }

      if (res.ok) {
        setToast({
          open: true,
          message: `Form "${form.title}" successfully ${nextStatus ? 'enabled' : 'disabled'} in database`,
          severity: nextStatus ? 'success' : 'info'
        });
      } else {
        console.warn('Backend update returned status:', res.status);
      }
    } catch (err) {
      console.error('Failed to persist status in database:', err);
    }
  };

  const handleOpenShare = (form: any) => {
    const fId = form.id ?? form.form_id;
    const publicUrl = `${window.location.origin}/public/forms/${fId}`;
    setShareModal({
      open: true,
      url: publicUrl,
      title: form.title
    });
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareModal.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.formId) return;
    const targetId = deleteDialog.formId;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
      await fetch(`http://127.0.0.1:8000/api/forms/${targetId}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      setForms((prev) => prev.filter((f: any) => Number(f.id ?? f.form_id) !== targetId));
      setToast({
        open: true,
        message: `Form "${deleteDialog.title}" deleted`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Delete form error:', err);
      setToast({
        open: true,
        message: 'Failed to delete form',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, formId: null, title: '' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Form Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontWeight: 500 }}>
            Create dynamic forms, configure conditional logic, and review submissions
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate('/forms/new')}
          sx={{
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            px: 2.5,
            py: 1.1,
            borderRadius: 2.5,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 8px 16px -2px rgba(79, 70, 229, 0.3)',
            '&:hover': { backgroundColor: '#4338CA' }
          }}
        >
          Create Form
        </Button>
      </Box>

      {/* Main Table Card */}
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
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#4F46E5' }} size={38} />
            </Box>
          ) : forms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No forms available.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', py: 2, pl: 3.5, width: 100 }}>
                      Form ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', width: 240 }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', width: 120 }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 3.5, width: 220 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forms.map((row: any) => {
                    const rowId = row.id ?? row.form_id;
                    const isEnabled =
                      row.enabled !== undefined
                        ? Boolean(row.enabled)
                        : row.is_active !== undefined
                        ? Boolean(row.is_active)
                        : true;

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
                        <TableCell sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                          {row.title}
                        </TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                          {row.description || 'No description provided'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isEnabled ? 'Enabled' : 'Disabled'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              px: 0.5,
                              backgroundColor: isEnabled ? '#ECFDF5' : '#FEF2F2',
                              color: isEnabled ? '#059669' : '#DC2626',
                              border: `1px solid ${isEnabled ? '#A7F3D0' : '#FECACA'}`
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
                            {/* Share Link */}
                            <Tooltip title="Share Public Form">
                              <IconButton size="small" onClick={() => handleOpenShare(row)} sx={{ color: '#0284C7' }}>
                                <ShareRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* View Responses */}
                            <Tooltip title="View Responses">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/forms/${rowId}/responses`)}
                                sx={{ color: '#4F46E5' }}
                              >
                                <ForumRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Enable/Disable Toggle */}
                            <Tooltip title={isEnabled ? 'Disable Form' : 'Enable Form'}>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleStatus(row)}
                                sx={{ color: isEnabled ? '#059669' : '#DC2626' }}
                              >
                                <PowerSettingsNewRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Edit Form */}
                            <Tooltip title="Edit Form">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/forms/${rowId}/edit`)}
                                sx={{ color: '#475569' }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Delete Form */}
                            <Tooltip title="Delete Form">
                              <IconButton
                                size="small"
                                onClick={() => setDeleteDialog({ open: true, formId: Number(rowId), title: row.title })}
                                sx={{ color: '#DC2626' }}
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
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

      {/* Share Dialog */}
      <Dialog
        open={shareModal.open}
        onClose={() => setShareModal({ ...shareModal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Share Form: {shareModal.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
            Anyone with this link can view and submit responses to this form.
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={shareModal.url}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleCopyLink}
                    startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                    sx={{
                      backgroundColor: copied ? '#059669' : '#4F46E5',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2
                    }}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShareModal({ ...shareModal, open: false })} sx={{ fontWeight: 700 }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, formId: null, title: '' })}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>Delete Form</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Are you sure you want to delete <strong>"{deleteDialog.title}"</strong>? This will permanently remove the form and all its responses.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, formId: null, title: '' })} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 700 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ borderRadius: 2.5, fontWeight: 600, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormListPage;