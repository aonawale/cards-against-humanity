import React, {
  memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
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
      <List component="nav">
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
      >
        Your current game data will be lost. You can still join the game again.
      </AlertDialog>

      <AlertDialog
        open={deleteDialogIsOpen}
        title="Delete this game?"
        confirmText="Delete"
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDeleteDialog}
        onBackdropClick={closeDeleteDialog}
      >
        All game data will be permanently deleted.
      </AlertDialog>

      <Dialog
        aria-labelledby="share-dialog-title"
        fullWidth
        maxWidth="xs"
        open={shareDialogIsOpen}
        onClose={closeShareDialog}
      >
        <DialogTitle id="share-dialog-title">Share Game</DialogTitle>
        <ShareMenu
          Component={List}
          itemComponent={ListItem}
          onClickItem={closeShareDialog}
        />
      </Dialog>
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
