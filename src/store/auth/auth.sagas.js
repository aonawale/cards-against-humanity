import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import {
  signOutSuccess, signOutFailure, signinSuccess, signinFailure,
} from 'store/auth/auth.actions';
import { firebaseApp } from 'lib/firebase';
import actionTypes from './auth.types';

export function* signOut() {
  try {
    yield firebaseApp.auth().signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* onSignOutStart() {
  yield takeLatest(actionTypes.SIGNOUT_START, signOut);
}

export function* signin() {
  try {
    // Hopefully will manually call firebase signin here at some point
    yield put(signinSuccess());
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
