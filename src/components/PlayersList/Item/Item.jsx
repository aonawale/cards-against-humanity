import React, {
  memo, useCallback, useState, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Avatar from '@material-ui/core/Avatar';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import Slide from '@material-ui/core/Slide';

// eslint-disable-next-line react/jsx-props-no-spreading
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Item = memo(({ player, canRemove, onRemove }) => {
  const [removeDialogIsOpen, setRemoveDialogIsOpen] = useState(false);

  const handleRemove = useCallback(() => {
    setRemoveDialogIsOpen(true);
  }, []);

  const handleConfirmRemoveDialog = useCallback(() => {
    setRemoveDialogIsOpen(false);
    if (onRemove)
      onRemove(player);
  }, [onRemove, player]);

  const handleCloseRemoveDialog = useCallback(() => {
    setRemoveDialogIsOpen(false);
  }, []);

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={player.name} src={player.photoURL} />
        </ListItemAvatar>
        <ListItemText
          primary={player.name}
          secondary={`${player.points} Points`}
        />
        {canRemove && (
        <ListItemSecondaryAction>
          <Tooltip title="Remove Player" aria-label="Remove Player">
            <IconButton edge="end" aria-label="remove" onClick={handleRemove}>
              <RemoveCircleIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
        )}
      </ListItem>

      <AlertDialog
        open={removeDialogIsOpen}
        title="Remove this player?"
        confirmText="Remove"
        onBackdropClick={handleCloseRemoveDialog}
        onCancel={handleCloseRemoveDialog}
        onConfirm={handleConfirmRemoveDialog}
        TransitionComponent={Transition}
        textContent="The player game data will be permanently deleted."
      />
    </>
  );
});

Item.propsStructure = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    photoURL: PropTypes.string,
  }),
};

Item.propTypes = {
  ...Item.playerPropsTypes,
  canRemove: PropTypes.bool,
  onRemove: PropTypes.func,
};

export default Item;
