import { FormField } from '../../types/form';

export const isFieldVisible = (
  field: FormField,
  allAnswers: Record<number, string>
): boolean => {
  if (!field.condition_field_id || field.condition_field_id === 0) {
    return true;
  }

  const parentAnswer = (allAnswers[field.condition_field_id] || '').trim().toLowerCase();
  const targetValue = (field.condition_value || '').trim().toLowerCase();
  const operator = (field.condition_operator || 'equals').toLowerCase();

  switch (operator) {
    case 'equals':
      return parentAnswer === targetValue;
    case 'not_equals':
      return parentAnswer !== targetValue;
    case 'contains':
      return parentAnswer.includes(targetValue);
    default:
      return true;
  }
};