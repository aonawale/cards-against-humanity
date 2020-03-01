import actionTypes from "./auth.types";

const INITIAL_STATE = {
  accessToken: null,
  isAuthenticating: false,
  error: null
};

const authReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case actionTypes.SIGNIN_START:
      return {
        ...state,
        isAuthenticating: true
      };
    case actionTypes.SIGNIN_FAILURE:
      return {
        accessToken: null,
        error: payload,
        isAuthenticating: false
      };
    case actionTypes.SIGNIN_SUCCESS:
      return {
        error: null,
        accessToken: payload.access_token,
        isAuthenticating: false
      };
    case actionTypes.SIGNOUT_FAILURE:
      return {
        ...state,
        error: payload
      };
    case actionTypes.SIGNOUT_SUCCESS:
      return {
        error: null,
        accessToken: null,
        isAuthenticating: false
      };
    default:
      return state;
  }
};

export default authReducer;
