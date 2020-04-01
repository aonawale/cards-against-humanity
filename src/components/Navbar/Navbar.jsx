import React, { useState, useCallback } from 'react';
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

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState();

  const handleMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const logOut = useCallback(() => {
    dispatch(signOutStart());
    handleClose();
  }, [dispatch, handleClose]);

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
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar alt={currentUser?.displayName} src={currentUser?.photoURL} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={!!anchorEl}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>{currentUser?.displayName}</MenuItem>
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </Menu>
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
