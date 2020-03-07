import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

// eslint-disable-next-line react/jsx-props-no-spreading
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GameDeleteDialog = memo(({ isOpen, onClose, onDelete }) => (
  <Dialog
    open={isOpen}
    TransitionComponent={Transition}
    keepMounted
    onClose={onClose}
    aria-labelledby="game-delete-dialog-title"
    aria-describedby="game-delete-dialog-description"
  >
    <DialogTitle id="game-delete-dialog-title">Delete this game?</DialogTitle>
    <DialogContent>
      <DialogContentText id="game-delete-dialog-description">
        All game data will be permanently deleted.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onDelete} color="primary" autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
));

GameDeleteDialog.defaultProps = {
  isOpen: false,
};

GameDeleteDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default GameDeleteDialog;
