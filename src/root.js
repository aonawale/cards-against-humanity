import React, { useState, useEffect } from 'react';
import App from 'app/App';
import LoginPage from 'components/LoginPage/LoginPage';
import HomePage from 'components/HomePage/HomePage';
import GamePage from 'components/GamePage/GamePage';
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from 'components/UnauthenticatedRoute/UnauthenticatedRoute';
import { Switch, Route } from 'react-router-dom';
import { currentUserIsAuthenticatedSubject } from 'stream/currentUser/currentUser';

const Routes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const subscription = currentUserIsAuthenticatedSubject.subscribe(setIsAuthenticated);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <App isAuthenticated={isAuthenticated}>
      <Switch>
        <UnauthenticatedRoute exact path="/login" isAuthenticated={isAuthenticated}>
          <LoginPage />
        </UnauthenticatedRoute>

        <Route exact path="/games/:gameID" isAuthenticated={isAuthenticated}>
          <GamePage />
        </Route>

        <AuthenticatedRoute exact path="/" isAuthenticated={isAuthenticated}>
          <HomePage />
        </AuthenticatedRoute>
      </Switch>
    </App>
  );
};

export default Routes;
