import { baseURL } from '@/services/api';
import {
  call,
  fork,
  put,
  takeEvery,
  all,
  takeLatest
} from 'redux-saga/effects';
import history from '../../utils/history';
import {
  LOGIN_WITH_EMAIL_REQUEST,
  LOGOUT_REQUEST,
  PASSWORD_FORGET_REQUEST,
  SYNC_USER
} from '../constants/authConstants';
import {
  loginWithEmailSuccess,
  loginWithEmailFailure,
  logoutFailure,
  logoutSuccess,
  syncUser,
  passwordForgetSuccess,
  passwordForgetFailure,
} from '../actions/authActions';

import { makeLogin } from '@/services/auth';

function getUrlVars() {
  const vars = {};
  const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { // eslint-disable-line
    vars[key] = value;
  });
  return vars;
}

function* loginWithEmailSaga(payload) {
  try {
    const data = yield call(makeLogin, payload.email, payload.password);

    localStorage.setItem('userToken', data.data.access_token);
    localStorage.setItem('email', payload.email);

    const userData = yield baseURL.get('/user');
    yield put(loginWithEmailSuccess(userData.data));

    if (getUrlVars().next) {
      yield history.push('/app/' + getUrlVars().next);
    } else {
      yield history.push('/app');
    }
  } catch (error) {
    yield put(loginWithEmailFailure(error));
  }
}

function* logoutSaga() {
  try {
    localStorage.clear();
    yield put(logoutSuccess());
    // Redirect to home
    yield history.replace('/login');
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

function* syncUserSaga() {
  try {
    const token = localStorage.getItem('userToken');
    if (token) {
      console.log(token);
      const userData = yield baseURL.get('/user');
      console.log(userData.status);
      if (userData) {
        yield put(syncUser(userData.data));
        // yield put(syncUser(null));
      }
    }
  } catch (error) {
    console.log(error);
    if (error.status === '401') {
      yield call(logoutSaga);
    }
  }
}

function* passwordForgetSaga({ email }) {
  // TODO
  //   try {
  //     yield call(firebaseAuth.sendPasswordResetEmail, email);
  //     yield put(passwordForgetSuccess());
  //   } catch (error) {
  //     yield put(passwordForgetFailure(error));
  //   }
}


//= ====================================
//  WATCHERS
//-------------------------------------

function* loginRootSaga() {
  yield all([
    takeLatest(LOGIN_WITH_EMAIL_REQUEST, loginWithEmailSaga),
    takeLatest(SYNC_USER, syncUserSaga),
    takeEvery(LOGOUT_REQUEST, logoutSaga),
    takeEvery(PASSWORD_FORGET_REQUEST, passwordForgetSaga)
  ]);
}

const authSagas = [
  fork(loginRootSaga),
];

export default authSagas;
