import { api } from './api';
import { ActivityLogItem } from '../types/analytics';

export const logService = {
  getActivityLogs: async (): Promise<ActivityLogItem[]> => {
    const res = await api.get<ActivityLogItem[]>('/api/activity-logs');
    return res.data;
  }
};