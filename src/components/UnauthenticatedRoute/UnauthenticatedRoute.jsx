import React from "react";
import { Route, Redirect } from "react-router-dom";

const UnauthenticatedRoute = ({ children, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) =>
      isAuthenticated ? (
        <Redirect
          to={{
            pathname: "/",
            state: { from: location }
          }}
        />
      ) : (
        children
      )
    }
  />
);

export default UnauthenticatedRoute;
