import React from 'react';
import { Box, Button } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

interface ExportActionsProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
  disabled?: boolean;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  onExportExcel,
  onExportPdf,
  disabled = false
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Button
        variant="outlined"
        startIcon={<FileDownloadRoundedIcon />}
        onClick={onExportExcel}
        disabled={disabled}
        sx={{
          color: '#10B981',
          borderColor: '#A7F3D0',
          '&:hover': {
            borderColor: '#10B981',
            backgroundColor: '#ECFDF5'
          }
        }}
      >
        Export Excel
      </Button>
      <Button
        variant="outlined"
        startIcon={<PictureAsPdfRoundedIcon />}
        onClick={onExportPdf}
        disabled={disabled}
        sx={{
          color: '#EF4444',
          borderColor: '#FECACA',
          '&:hover': {
            borderColor: '#EF4444',
            backgroundColor: '#FEF2F2'
          }
        }}
      >
        Export PDF
      </Button>
    </Box>
  );
};