import actionTypes from './current-user.types';

export const currentUserFetch = () => ({
  type: actionTypes.CURRENT_USER_FETCH_START,
});

export const currentUserFetchSuccess = (payload) => ({
  type: actionTypes.CURRENT_USER_FETCH_SUCCESS,
  payload,
});

export const currentUserFetchFailure = (error) => ({
  type: actionTypes.CURRENT_USER_FETCH_FAILURE,
  payload: error,
});
