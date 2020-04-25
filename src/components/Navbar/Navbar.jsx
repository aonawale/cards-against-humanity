import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch } from 'react-redux';
import { signOutStart } from 'store/auth/auth.actions';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import useDialog from 'hooks/dialog';

const Navbar = ({ currentUser, onDeleteAccount }) => {
  const dispatch = useDispatch();
  const [deleteDialogIsOpen, openDeleteDialog, closeDeleteDialog] = useDialog();

  const logOut = useCallback(() => {
    dispatch(signOutStart());
  }, [dispatch]);

  return (
    <AppBar position="static" color="transparent" variant="outlined">
      <Toolbar>
        <Typography variant="h6">
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Cards Against Humanity
          </Link>
        </Typography>
        {currentUser && (
          <Box marginLeft="auto">
            <PopupState variant="popover" popupId="share-menu">
              {(popupState) => (
                <>
                  <IconButton
                    color="inherit"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...bindTrigger(popupState)}
                  >
                    <Avatar alt={currentUser?.displayName} src={currentUser?.photoURL}>
                      {currentUser?.displayName?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...bindMenu(popupState)}
                  >
                    {currentUser?.displayName && (
                      <MenuItem onClick={popupState.close}>{currentUser?.displayName}</MenuItem>
                    )}
                    {onDeleteAccount && (
                      <MenuItem onClick={openDeleteDialog}>Delete account</MenuItem>
                    )}
                    <MenuItem onClick={logOut}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </PopupState>
          </Box>
        )}
      </Toolbar>

      {deleteDialogIsOpen && (
        <AlertDialog
          open={deleteDialogIsOpen}
          title="Delete account?"
          confirmText="Delete"
          onBackdropClick={closeDeleteDialog}
          onCancel={closeDeleteDialog}
          onConfirm={onDeleteAccount}
          textContent="All account and games data will be permanently deleted."
        />
      )}
    </AppBar>
  );
};

Navbar.propTypes = {
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  onDeleteAccount: PropTypes.func,
};

export default Navbar;
