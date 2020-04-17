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

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();

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
                    <Avatar alt={currentUser?.displayName} src={currentUser?.photoURL} />
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
                    <MenuItem onClick={popupState.close}>{currentUser?.displayName}</MenuItem>
                    <MenuItem onClick={logOut}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </PopupState>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Navbar;
