import { all, call, put, takeLatest } from "redux-saga/effects";
import request from "redux/request";
import actionTypes from "./auth.types";
import { signOutSuccess, signOutFailure, signinSuccess, signinFailure } from "redux/auth/auth.actions";

export function* signOut() {
  try {
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* onSignOutStart() {
  yield takeLatest(actionTypes.SIGNOUT_START, signOut);
}

export function* signin({ payload }) {
  try {
    const { data } = yield request.post("/oauth/token", payload);
    yield put(signinSuccess(data));
  } catch (error) {
    yield put(signinFailure(error));
  }
}

export function* onSigninStart() {
  yield takeLatest(actionTypes.SIGNIN_START, signin);
}

export function* authSagas() {
  yield all([call(onSigninStart), call(onSignOutStart)]);
}
