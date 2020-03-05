import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Navbar from 'components/Navbar/Navbar';
import { currentUserSubject } from 'stream/currentUser/firebaseCurrentUser';

const App = ({ isAuthenticated, children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const subscription = currentUserSubject.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Box height="100%">
      <Navbar
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
      />
      <main>{children}</main>
    </Box>
  );
};

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default App;
