export interface DashboardMetrics {
  total_forms: number;
  enabled_forms: number;
  disabled_forms: number;
  total_responses: number;
}

export interface FormAnalytics {
  form_id: number;
  form_title: string;
  total_responses: number;
  enabled: boolean;
}

export interface ActivityLogItem {
  id: number;
  user_id: number;
  action: string;
  details: string;
  created_at: string;
}