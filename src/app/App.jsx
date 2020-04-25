import React from 'react';
import Navbar from 'components/Navbar/Navbar';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { makeStyles } from '@material-ui/core/styles';
import useObservable from 'hooks/observable';

const useStyles = makeStyles({
  main: {
    position: 'relative',
    minHeight: 'calc(100vh - 66px)',
  },
});

const App = ({ children }) => {
  const classes = useStyles();
  const currentUser = useObservable(currentUserSubject);

  return (
    <>
      <Navbar currentUser={currentUser} />
      <main className={classes.main}>{children}</main>
    </>
  );
};

export default App;
