import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const GameJoinDialog = memo(({
  gameName, isOpen, onClose, onConfirm,
}) => (
  <Dialog
    open={isOpen}
    keepMounted
    aria-labelledby="game-join-dialog-title"
    aria-describedby="game-join-dialog-description"
  >
    <DialogTitle id="game-join-dialog-title">Join this game?</DialogTitle>
    <DialogContent>
      <DialogContentText id="game-join-dialog-description">
        Join to play {gameName} Game
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        No, I want my mummy
      </Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Bring it on!
      </Button>
    </DialogActions>
  </Dialog>
));

GameJoinDialog.defaultProps = {
  isOpen: false,
};

GameJoinDialog.propTypes = {
  gameName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default GameJoinDialog;
