import { createSelector } from 'reselect';

const selectAuth = (state) => state.auth;

export const selectCredential = createSelector(
  [selectAuth],
  (auth) => auth.credential,
);

export const selectIsAuthenticating = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticating,
);

export const selectIsAuthenticated = createSelector(
  [selectCredential],
  (credential) => !!credential,
);
