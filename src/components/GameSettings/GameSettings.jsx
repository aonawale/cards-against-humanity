import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDialog from 'components/AlertDialog/AlertDialog';

const GameSettings = memo(({
  canLeaveGame, canDeleteGame, onLeaveGame, onDeleteGame,
}) => {
  const [leaveDialogIsOpen, setLeaveDialogIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const handleLeave = useCallback(() => {
    setLeaveDialogIsOpen(true);
  }, []);

  const handleCloseLeaveDialog = useCallback(() => {
    setLeaveDialogIsOpen(false);
  }, []);

  const handleConfirmLeaveDialog = useCallback(() => {
    setLeaveDialogIsOpen(false);
    onLeaveGame();
  }, [onLeaveGame]);

  const handleDelete = useCallback(() => {
    setDeleteDialogIsOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogIsOpen(false);
  }, []);

  const handleConfirmDeleteDialog = useCallback(() => {
    setDeleteDialogIsOpen(false);
    onDeleteGame();
  }, [onDeleteGame]);

  return (
    <Container maxWidth="sm">
      <List component="nav">
        {canLeaveGame && (
          <ListItem button onClick={handleLeave}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary="Leave game" />
          </ListItem>
        )}
        {canDeleteGame && (
          <ListItem button onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete game" />
          </ListItem>
        )}
      </List>

      <AlertDialog
        open={leaveDialogIsOpen}
        title="Leave this game?"
        onCancel={handleCloseLeaveDialog}
        onConfirm={handleConfirmLeaveDialog}
        onBackdropClick={handleCloseLeaveDialog}
      >
        Your current game data will be lost. You can still join the game again.
      </AlertDialog>

      <AlertDialog
        open={deleteDialogIsOpen}
        title="Delete this game?"
        confirmText="Delete"
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteDialog}
        onBackdropClick={handleCloseDeleteDialog}
      >
        All game data will be permanently deleted.
      </AlertDialog>
    </Container>
  );
});

GameSettings.propTypes = {
  canLeaveGame: PropTypes.bool.isRequired,
  canDeleteGame: PropTypes.bool.isRequired,
  onLeaveGame: PropTypes.func.isRequired,
  onDeleteGame: PropTypes.func.isRequired,
};

export default GameSettings;
