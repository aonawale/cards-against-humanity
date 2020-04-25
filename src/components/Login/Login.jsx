import React, { memo, useCallback } from 'react';
import firebase from 'firebase/app';
import PropTypes from 'prop-types';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FacebookIcon from '@material-ui/icons/Facebook';
import { makeStyles } from '@material-ui/core/styles';
import OverlayLoader from 'components/OverlayLoader/OverlayLoader';
import SocialButton from 'components/Styled/SocialButton';
import FacebookButton from 'components/Styled/FacebookButton';
import GoogleIcon from 'components/Icons/Google';

const useStyles = makeStyles((theme) => ({
  error: {
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main,
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
}));

const Login = memo(({
  loading, error, showGuestButton, onAuth,
}) => {
  const classes = useStyles();

  const handleSignin = useCallback((provider) => {
    onAuth(provider);
  }, [onAuth]);

  return (
    <div className={classes.buttons}>
      {loading && <OverlayLoader />}
      {error && <div className={classes.error}>{error?.message || 'An error occured. Please try again.'}</div>}

      <SocialButton
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={() => handleSignin(new firebase.auth.GoogleAuthProvider())}
      >
        Sign in with Google
      </SocialButton>

      <FacebookButton
        variant="contained"
        startIcon={<FacebookIcon />}
        onClick={() => handleSignin(new firebase.auth.FacebookAuthProvider())}
      >
        Sign in with Facebook
      </FacebookButton>

      {showGuestButton && (
        <SocialButton
          variant="contained"
          startIcon={<AccountCircleIcon />}
          onClick={() => handleSignin()}
        >
        Continue as guest
        </SocialButton>
      )}
    </div>
  );
});

Login.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  showGuestButton: PropTypes.bool,
  onAuth: PropTypes.func,
};

export default Login;
