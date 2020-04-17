import React, {
  memo, useState, useCallback, useEffect,
} from 'react';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const formSteps = {
  name: Symbol('name'),
  deck: Symbol('deck'),
};

const initialFormState = {
  name: '',
  deck: '',
  errors: {},
};

const GameStartDialog = memo(({
  isOpen, decks, defaultDeck, onClose, onStart,
}) => {
  const [formStep, setFormStep] = useState(formSteps.name);
  const [formState, setFormState] = useState({ ...initialFormState });

  useEffect(() => {
    if (!formState.deck && defaultDeck)
      setFormState((state) => ({ ...state, deck: defaultDeck?.id }));
  }, [defaultDeck, formState.deck]);

  const handleClose = useCallback(() => {
    setFormState({ ...initialFormState });
    if (onClose)
      onClose();
  }, [onClose]);

  const handleCancel = useCallback(() => {
    if (formStep === formSteps.name)
      handleClose();
    else {
      setFormStep(formSteps.name);
      setFormState((state) => ({ ...state, errors: { ...state.errors, deck: '' } }));
    }
  }, [formStep, handleClose]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormState((state) => ({ ...state, [name]: value }));
  }, []);

  const handleConfirm = useCallback(() => {
    const errors = {};

    if (formStep === formSteps.name && !formState.name)
      errors.name = 'Name is required';
    if (formStep === formSteps.deck && !formState.deck)
      errors.deck = 'Deck is required';

    setFormState((state) => ({ ...state, errors }));

    if (formStep === formSteps.name && !errors.name)
      setFormStep(formSteps.deck);
    if (formStep === formSteps.deck && !errors.deck && onStart)
      onStart({ name: formState.name, deck: formState.deck });
  }, [formState, formStep, onStart]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      onBackdropClick={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="game-start-dialog-title"
    >
      <DialogTitle id="game-start-dialog-title">
        {formStep === formSteps.name ? 'Enter Game Name' : 'Choose Deck'}
      </DialogTitle>
      {formStep === formSteps.name
        ? (
          <DialogContent>
            <DialogContentText>
              Please enter a game name to start.
            </DialogContentText>
            <FormControl required fullWidth error={!!formState.errors.name}>
              <InputLabel htmlFor="game-name">Name</InputLabel>
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
        )
        : (
          <DialogContent dividers>
            <FormControl fullWidth error={!!formState.errors.deck}>
              {formState.errors.deck && (
                <FormHelperText id="game-deck-helper-text">{formState.errors.deck}</FormHelperText>
              )}
              <RadioGroup
                aria-label="deck"
                name="deck"
                value={formState.deck}
                onChange={handleChange}
              >
                {decks.map((deck) => (
                  <FormControlLabel value={deck.id} key={deck.id} control={<Radio />} label={deck.name} />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogContent>
        )}
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {formStep === formSteps.name ? 'Cancel' : 'Back'}
        </Button>
        <Button onClick={handleConfirm} color="primary">
          {formStep === formSteps.name ? 'Next' : 'Start'}
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
  decks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  defaultDeck: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func,
  onStart: PropTypes.func,
};

export default GameStartDialog;
