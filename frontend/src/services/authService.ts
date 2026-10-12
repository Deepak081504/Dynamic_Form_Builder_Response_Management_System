import { api } from './api';
import { LoginPayload, RegisterPayload, AuthResponse, User } from '../types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const res = await api.post<User>('/api/auth/register', payload);
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await api.get<User>('/api/auth/me');
    return res.data;
  }
};