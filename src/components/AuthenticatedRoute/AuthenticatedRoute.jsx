import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = ({ children, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) => (isAuthenticated ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    ))}
  />
);

export default AuthenticatedRoute;
