import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const UnauthenticatedRoute = ({ children, isAuthenticated, ...rest }) => (
  <Route
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
    render={({ location }) => (isAuthenticated ? (
      <Redirect
        to={{
          pathname: '/',
          state: { from: location },
        }}
      />
    ) : (
      children
    ))}
  />
);

UnauthenticatedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default UnauthenticatedRoute;
