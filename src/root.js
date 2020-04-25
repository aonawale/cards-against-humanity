import React from 'react';
import App from 'app/App';
import LoginPage from 'components/LoginPage/LoginPage';
import HomePage from 'components/HomePage/HomePage';
import GamePage from 'components/GamePage/GamePage';
import { Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from 'components/UnauthenticatedRoute/UnauthenticatedRoute';
import { isAuthenticatedSubject, authStateDeterminedSubject } from 'stream/currentUser/currentUser';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import useObservable from 'hooks/observable';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Root = () => {
  const classes = useStyles();
  const isAuthenticated = useObservable(isAuthenticatedSubject);
  const authStateDetermined = useObservable(authStateDeterminedSubject);

  return (
    <App>
      {authStateDetermined && (
        <Switch>
          <UnauthenticatedRoute exact path="/login" isAuthenticated={isAuthenticated}>
            <LoginPage />
          </UnauthenticatedRoute>

          <AuthenticatedRoute exact path="/" isAuthenticated={isAuthenticated}>
            <HomePage />
          </AuthenticatedRoute>

          <Route exact path="/games/:gameID">
            <GamePage />
          </Route>
        </Switch>
      )}

      <Backdrop className={classes.backdrop} open={!authStateDetermined}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </App>
  );
};

export default Root;
