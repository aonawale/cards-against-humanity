import React, {
  memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import Tooltip from '@material-ui/core/Tooltip';
import useDialog from 'hooks/dialog';

const Item = memo(({
  game, canDelete, onClick, onDelete,
}) => {
  const [deleteDialogIsOpen, openDeleteDialog, closeDeleteDialog] = useDialog();

  const handleClick = useCallback(() => {
    if (onClick)
      onClick(game);
  }, [game, onClick]);

  const handleConfirmDeleteDialog = useCallback(() => {
    closeDeleteDialog();
    if (onDelete)
      onDelete(game);
  }, [closeDeleteDialog, game, onDelete]);

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={game.name} />
        {canDelete && (
          <ListItemSecondaryAction>
            <Tooltip title="Delete Game" aria-label="Delete Game">
              <IconButton edge="end" aria-label="delete" onClick={openDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        )}
      </ListItem>

      {deleteDialogIsOpen && (
        <AlertDialog
          open={deleteDialogIsOpen}
          title="Delete this game?"
          confirmText="Delete"
          onBackdropClick={closeDeleteDialog}
          onCancel={closeDeleteDialog}
          onConfirm={handleConfirmDeleteDialog}
          textContent="All game data will be permanently deleted."
        />
      )}
    </>
  );
});

Item.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  canDelete: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Item;
