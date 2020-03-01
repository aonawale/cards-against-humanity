import { all, call, put, takeLatest } from "redux-saga/effects";
import userActionTypes from "./current-user.types";
import { currentUserFetchSuccess, currentUserFetchFailure } from "./current-user.actions";
import request from "redux/request";

export function* currentUserFetch() {
  try {
    const { data } = yield request.get("/users/me");
    yield put(currentUserFetchSuccess(data));
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
