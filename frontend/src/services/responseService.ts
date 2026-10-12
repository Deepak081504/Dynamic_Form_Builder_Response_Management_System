import { api } from './api';
import {
  ResponseSubmissionPayload,
  FormResponseItem,
  ResponseHistoryItem
} from '../types/response';

export const responseService = {
  submitAuthenticatedResponse: async (formId: number, payload: ResponseSubmissionPayload): Promise<void> => {
    await api.post(`/api/forms/${formId}/responses`, payload);
  },

  submitPublicResponse: async (formId: number, payload: ResponseSubmissionPayload): Promise<void> => {
    await api.post(`/api/forms/${formId}/responses/public`, payload);
  },

  getFormResponses: async (formId: number): Promise<FormResponseItem[]> => {
    const res = await api.get<FormResponseItem[]>(`/api/forms/${formId}/responses`);
    return res.data;
  },

  getSingleResponse: async (formId: number, responseId: number): Promise<FormResponseItem> => {
    const res = await api.get<FormResponseItem>(`/api/forms/${formId}/responses/${responseId}`);
    return res.data;
  },

  updateFormResponse: async (formId: number, responseId: number, payload: ResponseSubmissionPayload): Promise<void> => {
    await api.put(`/api/forms/${formId}/responses/${responseId}`, payload);
  },

  getResponseHistory: async (formId: number, responseId: number): Promise<ResponseHistoryItem[]> => {
    const res = await api.get<ResponseHistoryItem[]>(`/api/forms/${formId}/responses/${responseId}/history`);
    return res.data;
  },

  exportExcel: async (formId: number): Promise<Blob> => {
    const res = await api.get(`/api/forms/${formId}/responses/export/excel`, {
      responseType: 'blob'
    });
    return res.data;
  },

  exportPdf: async (formId: number): Promise<Blob> => {
    const res = await api.get(`/api/forms/${formId}/responses/export/pdf`, {
      responseType: 'blob'
    });
    return res.data;
  }
};