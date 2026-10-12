import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { FormResponseItem } from '../../types/response';
import { FormField } from '../../types/form';

interface ResponseTableProps {
  responses: FormResponseItem[];
  fields: FormField[];
  onViewHistory: (responseId: number) => void;
}

export const ResponseTable: React.FC<ResponseTableProps> = ({
  responses,
  fields,
  onViewHistory
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Submitted At</TableCell>
            {fields.map((field) => (
              <TableCell key={field.id} sx={{ fontWeight: 700, color: '#64748B' }}>
                {field.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {responses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={fields.length + 3} align="center" sx={{ py: 6, color: '#94A3B8' }}>
                No responses found.
              </TableCell>
            </TableRow>
          ) : (
            responses.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>#{row.id}</TableCell>
                <TableCell sx={{ color: '#64748B' }}>
                  {new Date(row.created_at).toLocaleDateString()}
                </TableCell>
                {fields.map((field) => {
                  const answerObj = row.answers.find((a) => a.field_id === field.id);
                  return (
                    <TableCell key={field.id} sx={{ color: '#0F172A' }}>
                      {answerObj ? answerObj.answer : '-'}
                    </TableCell>
                  );
                })}
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="View Edit History">
                      <IconButton size="small" onClick={() => onViewHistory(row.id)}>
                        <HistoryRoundedIcon fontSize="small" sx={{ color: '#4F46E5' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};