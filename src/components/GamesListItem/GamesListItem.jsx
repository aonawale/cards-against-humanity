import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import GameDeleteDialog from 'components/GameDeleteDialog/GameDeleteDialog';

const GamesListItem = memo(({ game, onClick, onDelete }) => {
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
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <GameDeleteDialog
        isOpen={deleteDialogIsOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDeleteDialog}
      />
    </>
  );
});

GamesListItem.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default GamesListItem;
