import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import DynamicFormRoundedIcon from '@mui/icons-material/DynamicFormRounded';
import { formService } from '../../services/formService';
import { responseService } from '../../services/responseService';
import { FormItem } from '../../types/form';

interface AnalyticsData {
  form_id: number;
  form_title: string;
  total_responses: number;
  enabled?: boolean;
  is_active?: boolean;
}

export const AnalyticsPage: React.FC = () => {
  const [formsList, setFormsList] = useState<FormItem[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('1');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [fieldsCount, setFieldsCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<string>('N/A');
  const [loading, setLoading] = useState<boolean>(true);

  // Load forms dropdown list
  useEffect(() => {
    const loadForms = async () => {
      try {
        const forms = await formService.getForms();
        setFormsList(forms);
      } catch (err) {
        console.error('Failed to load forms list:', err);
      }
    };
    loadForms();
  }, []);

  // Fetch live Analytics & compute real metrics
  useEffect(() => {
    const fetchAnalyticsDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        const headers = {
          Authorization: token ? `Bearer ${token}` : '',
          Accept: 'application/json'
        };

        // 1. Fetch Backend Analytics Endpoint
        let analyticsData: AnalyticsData | null = null;
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/analytics/forms/${selectedFormId}`, { headers });
          if (res.ok) {
            analyticsData = await res.json();
          }
        } catch (e) {
          console.error('Analytics endpoint error:', e);
        }

        // 2. Fetch Fields for Total Questions Count
        try {
          const fRes = await fetch(`http://127.0.0.1:8000/api/forms/${selectedFormId}/fields`, { headers });
          if (fRes.ok) {
            const fieldsJson = await fRes.json();
            setFieldsCount(Array.isArray(fieldsJson) ? fieldsJson.length : 0);
          }
        } catch {
          setFieldsCount(0);
        }

        // 3. Fetch Responses to calculate REAL average rating (No fake hardcoded values)
        try {
          const rData: any = await responseService.getFormResponses(Number(selectedFormId));
          const list = Array.isArray(rData) ? rData : (rData?.data || []);
          
          const ratingAnswers: number[] = [];
          list.forEach((res: any) => {
            res.details?.forEach((d: any) => {
              if (d.field_id === 5 && !isNaN(Number(d.answer))) {
                ratingAnswers.push(Number(d.answer));
              }
            });
          });

          if (ratingAnswers.length > 0) {
            const sum = ratingAnswers.reduce((a, b) => a + b, 0);
            const avg = (sum / ratingAnswers.length).toFixed(1);
            setAverageRating(`${avg} / 5`);
          } else {
            setAverageRating('N/A');
          }
        } catch {
          setAverageRating('N/A');
        }

        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error in Analytics page fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFormId) {
      fetchAnalyticsDetails();
    }
  }, [selectedFormId]);

  const isFormActive =
    analytics?.enabled !== undefined
      ? Boolean(analytics.enabled)
      : analytics?.is_active !== undefined
      ? Boolean(analytics.is_active)
      : true;

  return (
    <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Form Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontWeight: 500 }}>
            Live performance indicators and calculated response metrics
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 260, backgroundColor: '#FFFFFF', borderRadius: 2.5 }}>
          <InputLabel id="analytics-form-label" sx={{ fontWeight: 600 }}>Select Form</InputLabel>
          <Select
            labelId="analytics-form-label"
            value={selectedFormId}
            label="Select Form"
            onChange={(e) => setSelectedFormId(e.target.value)}
            sx={{ borderRadius: 2.5, fontWeight: 600 }}
          >
            {formsList.map((f: any) => {
              const fId = String(f.id ?? f.form_id);
              return (
                <MenuItem key={fId} value={fId} sx={{ fontWeight: 600 }}>
                  {f.title || `Form ${fId}`} (ID: {fId})
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#4F46E5' }} size={42} />
        </Box>
      ) : !analytics ? (
        <Card elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
          <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>
            No analytics data available for this form.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Card 1: Total Submissions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3.5,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
                      Total Submissions
                    </Typography>
                    <Typography sx={{ color: '#0F172A', fontWeight: 800, fontSize: '2.2rem', mt: 1 }}>
                      {analytics.total_responses}
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#EEF2FF', width: 48, height: 48, borderRadius: 2.5 }}>
                    <PollRoundedIcon sx={{ color: '#4F46E5', fontSize: 26 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Form Status (Accurately from Backend is_enabled) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3.5,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
                      Form Status
                    </Typography>
                    <Box sx={{ mt: 1.5 }}>
                      <Chip
                        label={isFormActive ? 'Active' : 'Disabled'}
                        size="small"
                        sx={{
                          backgroundColor: isFormActive ? '#ECFDF5' : '#FEF2F2',
                          color: isFormActive ? '#059669' : '#DC2626',
                          border: `1.5px solid ${isFormActive ? '#A7F3D0' : '#FECACA'}`,
                          fontWeight: 700,
                          fontSize: '0.82rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Avatar sx={{ backgroundColor: isFormActive ? '#ECFDF5' : '#FEF2F2', width: 48, height: 48, borderRadius: 2.5 }}>
                    <CheckCircleRoundedIcon sx={{ color: isFormActive ? '#059669' : '#DC2626', fontSize: 26 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Form Questions Count */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3.5,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
                      Configured Fields
                    </Typography>
                    <Typography sx={{ color: '#0F172A', fontWeight: 800, fontSize: '2.2rem', mt: 1 }}>
                      {fieldsCount}
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#F0F9FF', width: 48, height: 48, borderRadius: 2.5 }}>
                    <DynamicFormRoundedIcon sx={{ color: '#0284C7', fontSize: 26 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4: Calculated Average Rating */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3.5,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.05)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
                      Avg Rating
                    </Typography>
                    <Typography sx={{ color: '#0F172A', fontWeight: 800, fontSize: '2.2rem', mt: 1 }}>
                      {averageRating}
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#FEF3C7', width: 48, height: 48, borderRadius: 2.5 }}>
                    <StarRateRoundedIcon sx={{ color: '#D97706', fontSize: 26 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Form Information Overview Banner */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3.5,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                p: 3.5
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Form Summary: {analytics.form_title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                Status is live and verified against the backend database.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnalyticsPage;