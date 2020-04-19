import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = memo(({
  title, cancelText, confirmText, onCancel, onConfirm, children, confirmDisabled, textContent, ...rest
}) => (
  <Dialog
    fullWidth
    maxWidth="xs"
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      {textContent && (
        <DialogContentText id="alert-dialog-description">
          {textContent}
        </DialogContentText>
      )}
      {children}
    </DialogContent>
    {(onCancel || onConfirm) && (
      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} color="primary">
            {cancelText}
          </Button>
        )}
        {onConfirm && (
          <Button onClick={onConfirm} disabled={confirmDisabled} color="primary">
            {confirmText}
          </Button>
        )}
      </DialogActions>
    )}
  </Dialog>
));

AlertDialog.defaultProps = {
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  confirmDisabled: false,
};

AlertDialog.propTypes = {
  title: PropTypes.string.isRequired,
  textContent: PropTypes.node,
  confirmDisabled: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AlertDialog;
