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
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  description: string;
  created_at: string;
}

export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        const res = await fetch('http://127.0.0.1:8000/api/activity-logs', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            Accept: 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setLogs(Array.isArray(data) ? data : []);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

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

  const getActionChip = (action: string) => {
    const act = (action || '').toUpperCase();
    if (act.includes('CREATE')) {
      return (
        <Chip
          label={action}
          size="small"
          sx={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: 700 }}
        />
      );
    }
    if (act.includes('UPDATE')) {
      return (
        <Chip
          label={action}
          size="small"
          sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 700 }}
        />
      );
    }
    if (act.includes('DELETE')) {
      return (
        <Chip
          label={action}
          size="small"
          sx={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: 700 }}
        />
      );
    }
    return (
      <Chip
        label={action}
        size="small"
        sx={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', fontWeight: 700 }}
      />
    );
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.description?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.entity_type?.toLowerCase().includes(term)
    );
  });

  return (
    <Box sx={{ width: '100%', maxWidth: '1440px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Activity & Audit Logs
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontWeight: 500 }}>
          Trace all user operations, form updates, and submission events
        </Typography>
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
        {/* Search Bar Strip */}
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
            placeholder="Search by action, description..."
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
            icon={<HistoryRoundedIcon sx={{ fontSize: 16 }} />}
            label={`Total Events: ${filteredLogs.length}`}
            sx={{ fontWeight: 700, backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: 2 }}
          />
        </Box>

        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#4F46E5' }} size={38} />
            </Box>
          ) : filteredLogs.length === 0 ? (
            <Typography align="center" sx={{ color: '#94A3B8', py: 8, fontWeight: 600 }}>
              No activity logs recorded yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F1F5F9' }}>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', width: 80, pl: 3.5 }}>#ID</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', minWidth: 170 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', minWidth: 160 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', minWidth: 140 }}>Target Entity</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#334155', pr: 3.5 }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      hover
                      sx={{
                        transition: 'background-color 0.15s ease',
                        '&:hover': { backgroundColor: '#F8FAFC' },
                        '&:last-child td': { borderBottom: 0 }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, color: '#0F172A', pl: 3.5 }}>
                        #{log.id}
                      </TableCell>
                      <TableCell sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarTodayRoundedIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                          <span>{formatDate(log.created_at)}</span>
                        </Stack>
                      </TableCell>
                      <TableCell>{getActionChip(log.action)}</TableCell>
                      <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.88rem' }}>
                        {log.entity_type} (#{log.entity_id})
                      </TableCell>
                      <TableCell sx={{ color: '#0F172A', fontWeight: 500, fontSize: '0.9rem', pr: 3.5 }}>
                        {log.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityLogsPage;