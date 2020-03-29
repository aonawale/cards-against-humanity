import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AlertDialog from 'components/AlertDialog/AlertDialog';

const GameSettings = memo(({ onLeaveGame }) => {
  const [leaveDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const handleLeave = useCallback(() => {
    setDeleteDialogIsOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogIsOpen(false);
  }, []);

  const handleConfirmDeleteDialog = useCallback(() => {
    setDeleteDialogIsOpen(false);
    if (onLeaveGame)
      onLeaveGame();
  }, [onLeaveGame]);

  return (
    <>
      <List component="nav">
        <ListItem button onClick={handleLeave}>
          <ListItemIcon>
            <PowerSettingsNewIcon />
          </ListItemIcon>
          <ListItemText primary="Leave game" />
        </ListItem>
      </List>

      <AlertDialog
        open={leaveDialogIsOpen}
        title="Leave this game?"
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteDialog}
      >
        Your current game data will be lost. You can still join the game again.
      </AlertDialog>
    </>
  );
});

GameSettings.propTypes = {
  onLeaveGame: PropTypes.func,
};

export default GameSettings;
