import { api } from './api';
import { DashboardMetrics, FormAnalytics } from '../types/analytics';

export const analyticsService = {
  getDashboardAnalytics: async (): Promise<DashboardMetrics> => {
    const res = await api.get<DashboardMetrics>('/api/analytics/dashboard');
    return res.data;
  },

  getFormAnalytics: async (formId: number): Promise<FormAnalytics> => {
    const res = await api.get<FormAnalytics>(`/api/analytics/forms/${formId}`);
    return res.data;
  }
};