import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const GameStartDialog = memo(({ isOpen, onClose, onStart }) => {
  const [formState, setFormState] = useState({
    name: '',
    errors: {},
  });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormState((state) => ({ ...state, [name]: value }));
  }, []);

  const handleStart = useCallback(() => {
    let errors;

    if (!formState.name)
      errors = { name: 'Game name is required' };

    setFormState((state) => ({ ...state, errors }));

    if (!errors && onStart)
      onStart({ name: formState.name });
  }, [formState.name, onStart]);

  return (
    <Dialog open={isOpen} onClose={onClose} onBackdropClick={onClose} aria-labelledby="game-start-dialog-title">
      <DialogTitle id="game-start-dialog-title">Enter Game Name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a game name to start game.
        </DialogContentText>
        <FormControl required fullWidth error={!!formState.errors.name}>
          <InputLabel htmlFor="game-name">Game Name</InputLabel>
          <Input
            autoFocus
            id="game-name"
            name="name"
            aria-describedby="game-name-helper-text"
            value={formState.name}
            onChange={handleChange}
          />
          {formState.errors.name && (
            <FormHelperText id="game-name-helper-text">{formState.errors.name}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
        Cancel
        </Button>
        <Button onClick={handleStart} color="primary">
        Start
        </Button>
      </DialogActions>
    </Dialog>
  );
});

GameStartDialog.defaultProps = {
  isOpen: false,
};

GameStartDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onStart: PropTypes.func,
};

export default GameStartDialog;
