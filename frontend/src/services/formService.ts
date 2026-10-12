import { api } from './api';
import { FormItem, FormCreatePayload, FormField } from '../types/form';

export const formService = {
  getForms: async (): Promise<FormItem[]> => {
    const res = await api.get<FormItem[]>('/api/forms');
    return res.data;
  },

  getFormById: async (formId: number): Promise<FormItem> => {
    const res = await api.get<FormItem>(`/api/forms/${formId}`);
    return res.data;
  },

  createForm: async (payload: FormCreatePayload): Promise<FormItem> => {
    const res = await api.post<FormItem>('/api/forms', payload);
    return res.data;
  },

  updateForm: async (formId: number, payload: FormCreatePayload): Promise<FormItem> => {
    const res = await api.put<FormItem>(`/api/forms/${formId}`, payload);
    return res.data;
  },

  deleteForm: async (formId: number): Promise<void> => {
    await api.delete(`/api/forms/${formId}`);
  },

  enableForm: async (formId: number): Promise<void> => {
    await api.patch(`/api/forms/${formId}/enable`);
  },

  disableForm: async (formId: number): Promise<void> => {
    await api.patch(`/api/forms/${formId}/disable`);
  },

  getFormFields: async (formId: number): Promise<FormField[]> => {
    const res = await api.get<FormField[]>(`/api/forms/${formId}/fields`);
    return res.data;
  },

  createFormField: async (formId: number, field: FormField): Promise<FormField> => {
    const res = await api.post<FormField>(`/api/forms/${formId}/fields`, field);
    return res.data;
  },

  updateFormField: async (formId: number, fieldId: number, field: FormField): Promise<FormField> => {
    const res = await api.put<FormField>(`/api/forms/${formId}/fields/${fieldId}`, field);
    return res.data;
  },

  deleteFormField: async (formId: number, fieldId: number): Promise<void> => {
    await api.delete(`/api/forms/${formId}/fields/${fieldId}`);
  }
};