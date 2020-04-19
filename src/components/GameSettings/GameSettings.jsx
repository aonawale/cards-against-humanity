import React, {
  memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import ShareMenu from 'components/ShareMenu/ShareMenu';
import useDialog from 'hooks/dialog';

const GameSettings = memo(({
  canLeaveGame, canDeleteGame, onLeaveGame, onDeleteGame,
}) => {
  const [leaveDialogIsOpen, openLeaveDialog, closeLeaveDialog] = useDialog();
  const [deleteDialogIsOpen, openDeleteDialog, closeDeleteDialog] = useDialog();
  const [shareDialogIsOpen, openShareDialog, closeShareDialog] = useDialog();

  const handleConfirmLeaveDialog = useCallback(() => {
    closeLeaveDialog(false);
    onLeaveGame();
  }, [closeLeaveDialog, onLeaveGame]);

  const handleConfirmDeleteDialog = useCallback(() => {
    closeDeleteDialog(false);
    onDeleteGame();
  }, [closeDeleteDialog, onDeleteGame]);

  return (
    <Container maxWidth="sm">
      <List>
        <ListItem button onClick={openShareDialog}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </ListItem>
        {canLeaveGame && (
          <ListItem button onClick={openLeaveDialog}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Leave game" />
          </ListItem>
        )}
        {canDeleteGame && (
          <ListItem button onClick={openDeleteDialog}>
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
        onCancel={closeLeaveDialog}
        onConfirm={handleConfirmLeaveDialog}
        onBackdropClick={closeLeaveDialog}
        textContent="Your current game data will be lost. You can still join the game again."
      />

      <AlertDialog
        open={deleteDialogIsOpen}
        title="Delete this game?"
        confirmText="Delete"
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDeleteDialog}
        onBackdropClick={closeDeleteDialog}
        textContent="All game data will be permanently deleted."
      />

      <AlertDialog
        title="Share Game"
        open={shareDialogIsOpen}
        onBackdropClick={closeShareDialog}
      >
        <ShareMenu
          Component={List}
          itemComponent={ListItem}
          onClickItem={closeShareDialog}
        />
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
