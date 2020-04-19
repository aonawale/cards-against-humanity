import React, { memo, useCallback } from 'react';
import firebase from 'firebase/app';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from 'store/auth/auth.actions';
import { selectIsAuthenticating, selectError } from 'store/auth/auth.selectors';

import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import OverlayLoader from 'components/OverlayLoader/OverlayLoader';

const GoogleIcon = () => (
  /* eslint-disable max-len */
  <SvgIcon viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </SvgIcon>
  /* eslint-enable max-len */
);

const SocialButton = withStyles((theme) => ({
  root: {
    maxWidth: '220px',
    minHeight: '40px',
    width: '100%',
    backgroundColor: '#ffffff',
    textTransform: 'none',
    margin: theme.spacing(1),
    '& .MuiButton-iconSizeMedium > *:first-child': {
      fontSize: '24px',
    },
  },
  label: {
    justifyContent: 'start',
  },
  startIcon: {
    marginRight: theme.spacing(2),
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  facebook: {
    backgroundColor: '#3b5998',
    color: '#ffffff',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  textField: {
    maxWidth: '220px',
    width: '100%',
    margin: theme.spacing(1),
  },
}));

const Login = memo(() => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authError = useSelector(selectError);
  const isAuthenticating = useSelector(selectIsAuthenticating);

  const handleSignin = useCallback((provider) => {
    dispatch(signIn(provider));
  }, [dispatch]);

  return (
    <div className={classes.buttons}>
      {isAuthenticating && <OverlayLoader />}
      {!!authError && <p>An error occured. Please try again.</p>}

      <SocialButton
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={() => handleSignin(new firebase.auth.GoogleAuthProvider())}
      >
        Sign in with Google
      </SocialButton>

      <SocialButton
        variant="contained"
        startIcon={<FacebookIcon />}
        className={classes.facebook}
        onClick={() => handleSignin(new firebase.auth.FacebookAuthProvider())}
      >
        Sign in with Facebook
      </SocialButton>

      <SocialButton
        variant="contained"
        startIcon={<AccountCircleIcon />}
        onClick={() => handleSignin()}
      >
        Continue as guest
      </SocialButton>
    </div>
  );
});

export default Login;
