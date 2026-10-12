import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ResponseHistoryItem } from '../../types/response';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  historyItems: ResponseHistoryItem[];
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  open,
  onClose,
  historyItems
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 320, sm: 400 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Response Edit History
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ p: 0 }}>
        {historyItems.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#94A3B8', mt: 3, textAlign: 'center' }}>
            No edit history found for this submission.
          </Typography>
        ) : (
          historyItems.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                px: 2,
                py: 1.5,
                mb: 1.5,
                borderRadius: 2,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'block'
              }}
            >
              <ListItemText
                primary={item.changes}
                secondary={`User #${item.changed_by} • ${new Date(item.created_at).toLocaleString()}`}
                primaryTypographyProps={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}
                secondaryTypographyProps={{ fontSize: '0.75rem', color: '#64748B' }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Drawer>
  );
};