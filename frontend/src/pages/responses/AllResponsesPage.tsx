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
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { useNavigate } from 'react-router-dom';
import { formService } from '../../services/formService';
import { FormItem } from '../../types/form';

export const AllResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadAllForms = async () => {
      try {
        setLoading(true);
        const data = await formService.getForms();
        const rawList = Array.isArray(data) ? data : [];

        // Duplicate IDs-a filter panni unique forms mattum edukrom
        const uniqueForms = Array.from(
          new Map(rawList.map((item: any) => [item.id ?? item.form_id, item])).values()
        );

        setForms(uniqueForms);
      } catch (err) {
        console.error('Failed to load forms list:', err);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllForms();
  }, []);

  const filteredForms = forms.filter((f: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      f.title?.toLowerCase().includes(term) ||
      f.description?.toLowerCase().includes(term)
    );
  });

  return (
    <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Form Responses
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontWeight: 500 }}>
          Select a form to view submitted responses, summary statistics, and exports
        </Typography>
      </Box>

      {/* Main Table Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3.5,
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Search Strip */}
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
            placeholder="Search forms by title..."
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
            icon={<ForumRoundedIcon sx={{ fontSize: 16 }} />}
            label={`Total Available Forms: ${filteredForms.length}`}
            sx={{ fontWeight: 700, backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: 2 }}
          />
        </Box>

        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#4F46E5' }} size={38} />
            </Box>
          ) : filteredForms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>No forms found.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', py: 2, pl: 3.5, width: 260 }}>
                      Form Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', width: 140 }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 3.5, width: 180 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredForms.map((row: any) => {
                    const rowId = row.id ?? row.form_id;
                    const isActive =
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
                        <TableCell sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.94rem', pl: 3.5 }}>
                          {row.title}
                        </TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                          {row.description || 'No description provided'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isActive ? 'Active' : 'Disabled'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              px: 0.8,
                              backgroundColor: isActive ? '#ECFDF5' : '#FEF2F2',
                              color: isActive ? '#059669' : '#DC2626',
                              border: `1.5px solid ${isActive ? '#A7F3D0' : '#FECACA'}`
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3.5 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<VisibilityRoundedIcon fontSize="small" />}
                            onClick={() => navigate(`/forms/${rowId}/responses`)}
                            sx={{
                              backgroundColor: '#4F46E5',
                              color: '#FFFFFF',
                              textTransform: 'none',
                              fontWeight: 700,
                              borderRadius: 2.5,
                              px: 2,
                              py: 0.8,
                              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                              '&:hover': { backgroundColor: '#4338CA' }
                            }}
                          >
                            View Responses
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
    </Box>
  );
};

export default AllResponsesPage;