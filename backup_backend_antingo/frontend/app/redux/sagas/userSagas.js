import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_USER,
  UPDATE_USER,
  LIST_USERS,
  REMOVE_USER,
  INIT_CREATE_USER,
  INIT_UPDATE_USER,
  FETCH_USER
} from '../constants/userConstants';
import * as actions from '../actions/userActions';

export function* createUserSaga(action) {
  try {
    yield put(startSubmit('user'))
    yield baseURL.post('/usuario', action.payload)
    yield put(actions.createdUserSuccess())
    yield history.push(`/app/pages/users/`)
    yield put(stopSubmit('user'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('user', error.data.message))
    }
  }

}

export function* listUsersSaga() {
  try {
    const response = yield baseURL.get('usuarios');
    yield put(actions.setUsers(response.data.users));
  } catch (error) {
    // yield put(actions.fetchUsersFailed());
    console.log(error);
  }
}

export function* removeUserSaga(action) {
  try {
    const response = yield baseURL.delete(`/usuario/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/users/`)
    }
    yield put(actions.removeUserSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchUsersFailed());
    console.log(error);
  }
}

export function* updateUserSaga(action) {
  try {
    yield put(startSubmit('user'))
    const response = yield baseURL.put(`/usuario/${action.payload.id}`, action.payload);
    yield put(actions.updateUserSuccess(response.data));
    yield history.push(`/app/pages/users/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('user', error.data.message))
    }
  }
}

export function* fetchUserSaga(action) {
  try {
    const response = yield baseURL.get(`/usuario/${action.id}`)
    yield put(actions.setUser(response.data))
  } catch (error) {
    // yield put(actions.fetchUsersFailed());
    console.log(error);
  }
}

function fetchUser(id) {
  try {
    return baseURL.get(`/usuario/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateUserSaga() {
  try {
    yield history.push(`/app/pages/users/user/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateUserSaga(action) {
  try {
    yield call(fetchUser, action.id)
    yield history.push(`/app/pages/users/user/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


function* UserRootSaga() {
  yield all([
    takeEvery(CREATE_USER, createUserSaga),
    takeLatest(LIST_USERS, listUsersSaga),
    takeLatest(REMOVE_USER, removeUserSaga),
    takeLatest(UPDATE_USER, updateUserSaga),
    takeLatest(FETCH_USER, fetchUserSaga),
    takeLatest(INIT_CREATE_USER, handleCreateUserSaga),
    takeLatest(INIT_UPDATE_USER, handleUpdateUserSaga),
  ]);
}


const userSagas = [
  fork(UserRootSaga),
];

export default userSagas;
