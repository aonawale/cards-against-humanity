import { createSelector } from "reselect";

const selectAuth = state => state.auth;

export const selectAccessToken = createSelector(
  [selectAuth],
  auth => auth.accessToken
);

export const selectIsAuthenticating = createSelector(
  [selectAuth],
  auth => auth.isAuthenticating
);

export const selectIsAuthenticated = createSelector(
  [selectAccessToken],
  accessToken => !!accessToken
);
