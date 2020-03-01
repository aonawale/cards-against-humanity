import React from 'react';
import App from 'app/App';
import LoginPage from 'components/LoginPage/LoginPage';
import HomePage from 'components/HomePage/HomePage';
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from 'components/UnauthenticatedRoute/UnauthenticatedRoute';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'store/auth/auth.selectors';

const Routes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <App>
      <Switch>
        <UnauthenticatedRoute exact path="/login" isAuthenticated={isAuthenticated}>
          <LoginPage />
        </UnauthenticatedRoute>

        <AuthenticatedRoute exact path="/" isAuthenticated={isAuthenticated}>
          <HomePage />
        </AuthenticatedRoute>
      </Switch>
    </App>
  );
};

export default Routes;
