export interface AnswerItem {
  field_id: number;
  answer: string;
}

export interface ResponseSubmissionPayload {
  answers: AnswerItem[];
}

export interface FormResponseItem {
  id: number;
  form_id: number;
  submitted_by?: number | null;
  created_at: string;
  answers: AnswerItem[];
}

export interface ResponseHistoryItem {
  id: number;
  response_id: number;
  changed_by: number;
  changes: string;
  created_at: string;
}