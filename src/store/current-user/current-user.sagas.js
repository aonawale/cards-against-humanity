import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import userActionTypes from './current-user.types';
import { currentUserFetchSuccess, currentUserFetchFailure } from './current-user.actions';

export function* currentUserFetch() {
  try {
    // const { data } = yield request.get('/users/me');
    yield put(currentUserFetchSuccess());
  } catch (error) {
    yield put(currentUserFetchFailure(error));
  }
}

export function* onCurrentUserFetchStart() {
  yield takeLatest(userActionTypes.CURRENT_USER_FETCH_START, currentUserFetch);
}

export function* currentUserSagas() {
  yield all([call(onCurrentUserFetchStart)]);
}
