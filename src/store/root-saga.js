import { all, call } from 'redux-saga/effects';
import { authSagas } from 'store/auth/auth.sagas';
import { currentUserSagas } from 'store/current-user/current-user.sagas';

export default function* rootSaga() {
  yield all([call(authSagas), call(currentUserSagas)]);
}
