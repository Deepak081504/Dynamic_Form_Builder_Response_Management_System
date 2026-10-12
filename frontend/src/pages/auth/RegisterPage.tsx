import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
  MenuItem
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register({
        full_name: fullName,
        email,
        password,
        role
      });
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 460 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            mb: 2,
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
          }}
        >
          <PersonAddOutlinedIcon fontSize="medium" />
        </Box>
        <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800 }}>
          Create account
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
          Join FormCraft to start designing interactive dynamic forms
        </Typography>
      </Box>

      <Card sx={{ p: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: 0 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Deepak"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="deepak@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                Account Role
              </Typography>
              <TextField
                select
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.2, fontSize: '0.95rem' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" sx={{ fontWeight: 700, color: '#4F46E5', textDecoration: 'none' }}>
            Sign in
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};