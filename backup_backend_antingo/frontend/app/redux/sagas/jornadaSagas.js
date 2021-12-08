import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_JORNADA,
  UPDATE_JORNADA,
  LIST_JORNADAS,
  REMOVE_JORNADA,
  INIT_CREATE_JORNADA,
  INIT_UPDATE_JORNADA,
  FETCH_JORNADA
} from '../constants/jornadaConstants';
import * as actions from '../actions/jornadaActions';

export function* createJornadaSaga(action) {
  try {
    yield put(startSubmit('jornada'))
    yield baseURL.post('/jornada', action.payload)
    yield put(actions.createdJornadaSuccess())
    yield history.push(`/app/pages/jornadas/`)
    yield put(stopSubmit('jornada'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('jornada', error.data.message))
    }
  }

}

export function* listJornadasSaga() {
  try {
    const response = yield baseURL.get('/jornadas');
    yield put(actions.setJornadas(response.data.jornadas));
  } catch (error) {
    // yield put(actions.fetchJornadasFailed());
    console.log(error);
  }
}

export function* removeJornadaSaga(action) {
  try {
    const response = yield baseURL.delete(`/jornada/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/jornadas/`)
    }
    yield put(actions.removeJornadaSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchJornadasFailed());
    console.log(error);
  }
}

export function* updateJornadaSaga(action) {
  try {
    yield put(startSubmit('jornada'))
    const response = yield baseURL.put(`/jornada/${action.payload.id}`, action.payload);
    yield put(actions.updateJornadaSuccess(response.data));
    yield history.push(`/app/pages/jornadas/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('jornada', error.data.message))
    }
  }
}

export function* fetchJornadaSaga(action) {
  try {
    const response = yield baseURL.get(`/jornada/${action.id}`)
    yield put(actions.setJornada(response.data))
  } catch (error) {
    // yield put(actions.fetchJornadasFailed());
    console.log(error);
  }
}

function fetchJornada(id) {
  try {
    return baseURL.get(`/jornada/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateJornadaSaga() {
  try {
    yield history.push(`/app/pages/jornadas/jornada/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateJornadaSaga(action) {
  try {
    yield call(fetchJornada, action.id)
    yield history.push(`/app/pages/jornadas/jornada/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


function* JornadaRootSaga() {
  yield all([
    takeEvery(CREATE_JORNADA, createJornadaSaga),
    takeLatest(LIST_JORNADAS, listJornadasSaga),
    takeLatest(REMOVE_JORNADA, removeJornadaSaga),
    takeLatest(UPDATE_JORNADA, updateJornadaSaga),
    takeLatest(FETCH_JORNADA, fetchJornadaSaga),
    takeLatest(INIT_CREATE_JORNADA, handleCreateJornadaSaga),
    takeLatest(INIT_UPDATE_JORNADA, handleUpdateJornadaSaga),
  ]);
}


const jornadaSagas = [
  fork(JornadaRootSaga),
];

export default jornadaSagas;
