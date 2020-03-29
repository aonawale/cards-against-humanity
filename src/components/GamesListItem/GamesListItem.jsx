import React, {
  memo, useState, useCallback, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import Slide from '@material-ui/core/Slide';

// eslint-disable-next-line react/jsx-props-no-spreading
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GamesListItem = memo(({
  game, canDelete, onClick, onDelete,
}) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (onClick)
      onClick(game);
  }, [game, onClick]);

  const handleDelete = useCallback(() => {
    setDeleteDialogIsOpen(true);
  }, []);

  const handleConfirmDeleteDialog = useCallback(() => {
    setDeleteDialogIsOpen(false);
    if (onDelete)
      onDelete(game);
  }, [game, onDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogIsOpen(false);
  }, []);

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={game.name} />
        {canDelete && (
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>

      <AlertDialog
        open={deleteDialogIsOpen}
        title="Delete this game?"
        confirmText="Delete"
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteDialog}
        TransitionComponent={Transition}
      >
        All game data will be permanently deleted.
      </AlertDialog>
    </>
  );
});

GamesListItem.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  canDelete: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default GamesListItem;
