import { createSelector } from 'reselect';

const selectCurrentUserState = (state) => state.currentUser;

export const selectCurrentUser = createSelector(
  [selectCurrentUserState],
  (currentUser) => currentUser.user,
);

export const selectIsUserLoading = createSelector(
  [selectCurrentUserState],
  (currentUser) => currentUser.isUserLoading,
);

export const selectCurrentUserError = createSelector(
  [selectCurrentUserState],
  (currentUser) => currentUser.error,
);
