import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from 'components/Navbar/Navbar';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  main: {
    height: 'calc(100vh - 66px)',
  },
});

const App = ({ isAuthenticated, children }) => {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const subscription = currentUserSubject.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <CssBaseline />
      <Navbar
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
      />
      <main className={classes.main}>{children}</main>
    </>
  );
};

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default App;
