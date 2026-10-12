import { Alert, Button, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import type { FormField } from '../../types/form'
import { isFieldVisible } from './evaluateConditions'
import DynamicField from './DynamicField'

export default function FormRenderer({ title, description, fields, onSubmit, submitLabel = 'Submit response' }: { title: string; description?: string | null; fields: FormField[]; onSubmit: (answers: { field_id: number; answer: string | null }[]) => Promise<void>; submitLabel?: string }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const visibleFields = useMemo(() => fields.filter(field => isFieldVisible(field, answers)), [fields, answers])
  async function submit() {
    const missing = visibleFields.find(field => field.is_required && !(answers[field.id ?? -1] ?? '').trim())
    if (missing) { setError(`${missing.label} is required.`); return }
    setError('')
    setBusy(true)
    try { await onSubmit(visibleFields.filter(f => f.id !== undefined).map(f => ({ field_id: f.id!, answer: answers[f.id!] ?? null }))) }
    catch { setError('Could not submit the form. Please try again.') }
    finally { setBusy(false) }
  }
  return <Paper sx={{ p: { xs: 2, md: 4 }, border: '1px solid #e9eaf4' }}><Stack spacing={3}><div><Typography variant="h5">{title}</Typography>{description && <Typography color="text.secondary" mt={1}>{description}</Typography>}</div>{error && <Alert severity="error">{error}</Alert>}{visibleFields.map(field => <DynamicField key={field.id ?? field.field_order} field={field} value={answers[field.id ?? -1] ?? ''} onChange={value => setAnswers(prev => ({ ...prev, [field.id ?? -1]: value }))} />)}<Button variant="contained" size="large" disabled={busy} onClick={() => void submit()}>{busy ? 'Submitting…' : submitLabel}</Button></Stack></Paper>
}
