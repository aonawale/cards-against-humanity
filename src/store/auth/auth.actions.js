import actionTypes from './auth.types';

export const signIn = (payload) => ({
  type: actionTypes.SIGNIN_START,
  payload,
});

export const signinSuccess = (auth) => ({
  type: actionTypes.SIGNIN_SUCCESS,
  payload: auth,
});

export const signinFailure = (error) => ({
  type: actionTypes.SIGNIN_FAILURE,
  payload: error,
});

export const signOutStart = () => ({
  type: actionTypes.SIGNOUT_START,
});

export const signOutSuccess = () => ({
  type: actionTypes.SIGNOUT_SUCCESS,
});

export const signOutFailure = (error) => ({
  type: actionTypes.SIGNOUT_FAILURE,
  payload: error,
});
