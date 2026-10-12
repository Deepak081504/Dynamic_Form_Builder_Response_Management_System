export interface FormField {
  id?: number;
  form_id?: number;
  label: string;
  field_type: string;
  is_required: boolean;
  field_order: number;
  placeholder: string;
  description: string;
  condition_field_id: number;
  condition_operator: string;
  condition_value: string;
  options: string[];
  created_at?: string;
  updated_at?: string;
}

export interface FormItem {
  id: number;
  title: string;
  description: string;
  is_active?: boolean;
  enabled?: boolean;
  fields?: FormField[];
  created_at?: string;
  updated_at?: string;
}

export interface FormCreatePayload {
  title: string;
  description: string;
}