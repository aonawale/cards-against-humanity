import React, { memo, useCallback } from 'react';
import Login from 'components/Login/Login';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from 'store/auth/auth.actions';
import { selectIsAuthenticating, selectError } from 'store/auth/auth.selectors';
import { Box } from '@material-ui/core';

const LoginPage = memo(() => {
  const dispatch = useDispatch();
  const authError = useSelector(selectError);
  const isAuthenticating = useSelector(selectIsAuthenticating);

  const handleSignin = useCallback((provider) => {
    dispatch(signIn(provider));
  }, [dispatch]);

  return (
    <Container maxWidth="xs">
      <Box py={2}>
        <Login
          loading={isAuthenticating}
          error={authError}
          showGuestButton
          onAuth={handleSignin}
        />
      </Box>
    </Container>
  );
});

export default LoginPage;
