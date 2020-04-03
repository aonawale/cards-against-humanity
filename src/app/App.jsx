import React, { useEffect, useState } from 'react';
import Navbar from 'components/Navbar/Navbar';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  main: {
    position: 'relative',
    minHeight: 'calc(100vh - 66px)',
  },
});

const App = ({ children }) => {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const subscription = currentUserSubject.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />
      <main className={classes.main}>{children}</main>
    </>
  );
};

export default App;
