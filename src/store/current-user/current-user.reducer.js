import userActionTypes from './current-user.types';

const INITIAL_STATE = {
  user: null,
  isUserLoading: false,
  error: null,
};

const userReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case userActionTypes.CURRENT_USER_FETCH_START:
      return {
        ...state,
        isUserLoading: true,
      };
    case userActionTypes.CURRENT_USER_FETCH_FAILURE:
      return {
        ...state,
        error: payload,
        isUserLoading: false,
      };
    case userActionTypes.CURRENT_USER_FETCH_SUCCESS:
      return {
        ...state,
        error: null,
        user: payload.user,
        isUserLoading: false,
      };
    default:
      return state;
  }
};

export default userReducer;
