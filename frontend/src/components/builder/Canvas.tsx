import { Paper, Stack, Typography } from '@mui/material'
import type { FormField } from '../../types/form'
import CanvasItem from './CanvasItem'

export default function Canvas({ fields, selectedId, onSelect, onDelete }: { fields: FormField[]; selectedId?: number; onSelect: (field: FormField) => void; onDelete: (field: FormField) => void }) {
  return <Paper variant="outlined" sx={{ p: 2, minHeight: 420, borderStyle: 'dashed' }}><Typography variant="h6" mb={2}>Form canvas</Typography><Stack spacing={1.5}>{fields.length === 0 ? <Typography color="text.secondary">Add fields from the toolbox to start building.</Typography> : fields.map(field => <CanvasItem key={field.id ?? `${field.label}-${field.field_order}`} field={field} selected={selectedId === field.id} onClick={() => onSelect(field)} onDelete={() => onDelete(field)} />)}</Stack></Paper>
}
