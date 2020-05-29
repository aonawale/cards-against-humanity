import React, { memo } from 'react';
import Login from 'components/Login/Login';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';

const LoginPage = memo(() => (
  <Container maxWidth="xs">
    <Box py={2}>
      <Login
        showGuestButton
      />
    </Box>
  </Container>
));

export default LoginPage;
