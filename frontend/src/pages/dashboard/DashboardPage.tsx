import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Stack
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useNavigate } from 'react-router-dom';
import { formService } from '../../services/formService';
import { FormItem } from '../../types/form';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await formService.getForms();
        setForms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load dashboard forms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalForms = forms.length;
  const activeForms = forms.filter((f: any) =>
    f.enabled !== undefined ? Boolean(f.enabled) : (f.is_active !== undefined ? Boolean(f.is_active) : true)
  ).length;
  const disabledForms = totalForms - activeForms;

  // Colorful Vibrant KPI Cards Config
  const statCards = [
    {
      title: 'Total Forms',
      value: totalForms,
      icon: <DescriptionRoundedIcon sx={{ fontSize: 28, color: '#4F46E5' }} />,
      bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      borderColor: '#C7D2FE',
      textColor: '#3730A3',
      badgeBg: '#FFFFFF',
      shadow: '0 10px 25px -5px rgba(79, 70, 229, 0.12)'
    },
    {
      title: 'Active Forms',
      value: activeForms,
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 28, color: '#059669' }} />,
      bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      borderColor: '#A7F3D0',
      textColor: '#065F46',
      badgeBg: '#FFFFFF',
      shadow: '0 10px 25px -5px rgba(5, 150, 105, 0.12)'
    },
    {
      title: 'Disabled Forms',
      value: disabledForms,
      icon: <BlockRoundedIcon sx={{ fontSize: 28, color: '#E11D48' }} />,
      bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
      borderColor: '#FECDD3',
      textColor: '#9F1239',
      badgeBg: '#FFFFFF',
      shadow: '0 10px 25px -5px rgba(225, 29, 72, 0.12)'
    },
    {
      title: 'Total Responses',
      value: 2,
      icon: <ForumRoundedIcon sx={{ fontSize: 28, color: '#0284C7' }} />,
      bgGradient: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      borderColor: '#BAE6FD',
      textColor: '#075985',
      badgeBg: '#FFFFFF',
      shadow: '0 10px 25px -5px rgba(2, 132, 199, 0.12)'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#4F46E5' }} thickness={4.5} size={42} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1440px',
        mx: 'auto',
        p: { xs: 1, md: 2 },
        borderRadius: 4,
        background:
          'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 15%, rgba(236, 72, 153, 0.07) 0%, transparent 45%), radial-gradient(circle at 50% 90%, rgba(14, 165, 233, 0.08) 0%, transparent 50%), transparent'
      }}
    >
      {/* Colorful Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.7rem', md: '2.2rem' },
                background: 'linear-gradient(135deg, #0F172A 0%, #312E81 50%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em'
              }}
            >
              Dashboard Overview
            </Typography>
            <AutoAwesomeRoundedIcon sx={{ color: '#8B5CF6', fontSize: 24 }} />
          </Stack>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontWeight: 600 }}>
            Real-time analytics and form performance tracking
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate('/forms/new')}
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            px: 3,
            py: 1.2,
            borderRadius: 3,
            fontWeight: 800,
            textTransform: 'none',
            boxShadow: '0 10px 20px -3px rgba(124, 58, 237, 0.35)',
            transition: 'all 0.25s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
              boxShadow: '0 14px 26px -3px rgba(124, 58, 237, 0.45)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Create New Form
        </Button>
      </Box>

      {/* Colorful 4-KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                background: card.bgGradient,
                border: `1.5px solid ${card.borderColor}`,
                boxShadow: card.shadow,
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 30px -4px rgba(15, 23, 42, 0.12)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ color: card.textColor, fontWeight: 700, fontSize: '0.88rem', opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: card.textColor,
                        fontWeight: 900,
                        mt: 1,
                        fontSize: '2.4rem',
                        letterSpacing: '-0.03em'
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: card.badgeBg,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      width: 56,
                      height: 56,
                      borderRadius: 3.5
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Forms Table Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 10px 30px -4px rgba(15, 23, 42, 0.06)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3.5,
            py: 2.8,
            background: 'linear-gradient(180deg, #FAFCFF 0%, #FFFFFF 100%)',
            borderBottom: '1px solid #F1F5F9'
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 900, fontSize: '1.25rem' }}>
              Recent Forms
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
              Summary of all dynamic forms configured in your workspace
            </Typography>
          </Box>
          <Button
            size="small"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/forms')}
            sx={{
              fontWeight: 800,
              color: '#4F46E5',
              textTransform: 'none',
              borderRadius: 2.5,
              px: 2,
              '&:hover': { backgroundColor: '#EEF2FF' }
            }}
          >
            View All
          </Button>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.84rem', py: 2, pl: 3.5 }}>
                    Form Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.84rem' }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.84rem' }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.84rem', pr: 3.5 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forms.map((row: any) => {
                  const isActive =
                    row.enabled !== undefined
                      ? Boolean(row.enabled)
                      : row.is_active !== undefined
                      ? Boolean(row.is_active)
                      : true;

                  const formRowId = row.id ?? row.form_id;

                  return (
                    <TableRow
                      key={formRowId}
                      hover
                      sx={{
                        transition: 'background-color 0.15s ease',
                        '&:hover': { backgroundColor: '#F8FAFC' },
                        '&:last-child td': { borderBottom: 0 }
                      }}
                    >
                      <TableCell sx={{ py: 2.4, pl: 3.5 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.94rem' }}>
                          {row.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.4, maxWidth: 380 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748B',
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {row.description || 'No description provided'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.4 }}>
                        <Chip
                          label={isActive ? 'Active' : 'Disabled'}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            borderRadius: '8px',
                            px: 1,
                            backgroundColor: isActive ? '#ECFDF5' : '#FFF1F2',
                            color: isActive ? '#059669' : '#E11D48',
                            border: `1.5px solid ${isActive ? '#A7F3D0' : '#FECDD3'}`
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2.4, pr: 3.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityRoundedIcon fontSize="small" />}
                            onClick={() => navigate(`/forms/${formRowId}/responses`)}
                            sx={{
                              borderColor: '#C7D2FE',
                              backgroundColor: '#EEF2FF',
                              color: '#4338CA',
                              fontWeight: 800,
                              textTransform: 'none',
                              borderRadius: 2.5,
                              px: 1.8,
                              '&:hover': {
                                backgroundColor: '#E0E7FF',
                                borderColor: '#A5B4FC'
                              }
                            }}
                          >
                            Responses
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditRoundedIcon fontSize="small" />}
                            onClick={() => navigate(`/forms/${formRowId}/edit`)}
                            sx={{
                              borderColor: '#E2E8F0',
                              color: '#475569',
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: 2.5,
                              px: 1.8,
                              backgroundColor: '#FFFFFF',
                              '&:hover': {
                                backgroundColor: '#F8FAFC',
                                borderColor: '#CBD5E1'
                              }
                            }}
                          >
                            Edit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;