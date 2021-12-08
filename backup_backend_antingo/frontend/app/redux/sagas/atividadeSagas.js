import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_ATIVIDADE,
  UPDATE_ATIVIDADE,
  LIST_ATIVIDADES,
  PAGINATE_ATIVIDADES,
  REMOVE_ATIVIDADE,
  INIT_CREATE_ATIVIDADE,
  INIT_UPDATE_ATIVIDADE,
  FETCH_ATIVIDADE
} from '../constants/atividadeConstants';
import * as actions from '../actions/atividadeActions';

export function* createAtividadeSaga(action) {
  try {
    yield put(startSubmit('atividade'))
    yield baseURL.post('/atividade', action.payload)
    yield put(actions.createdAtividadeSuccess())
    yield history.push(`/app/pages/atividades/`)
    yield put(stopSubmit('atividade'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('atividade', error.data.message))
    }
  }

}

export function* listAtividadesSaga(action) {
  try {
    const url = action.all ? '/atividades' : '/atividades'
    const response = yield baseURL.get(url);
    yield put(actions.setAtividades(response.data));
  } catch (error) {
    // yield put(actions.fetchAtividadesFailed());
    console.log(error);
  }
}

export function* removeAtividadeSaga(action) {
  try {
    const response = yield baseURL.delete(`/atividade/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/atividades/`)
    }
    yield put(actions.removeAtividadeSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchAtividadesFailed());
    console.log(error);
  }
}

export function* updateAtividadeSaga(action) {
  try {
    yield put(startSubmit('atividade'))
    const response = yield baseURL.put(`/atividade/${action.payload.id}`, action.payload);
    yield put(actions.updateAtividadeSuccess(response.data));
    yield history.push(`/app/pages/atividades/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('atividade', error.data.message))
    }
  }
}

export function* fetchAtividadeSaga(action) {
  try {
    const response = yield baseURL.get(`/atividade/${action.id}`)
    yield put(actions.setAtividade(response.data))
  } catch (error) {
    // yield put(actions.fetchAtividadesFailed());
    console.log(error);
  }
}

function fetchAtividade(id) {
  try {
    return baseURL.get(`/atividade/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateAtividadeSaga() {
  try {
    yield history.push(`/app/pages/atividades/atividade/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateAtividadeSaga(action) {
  try {
    yield call(fetchAtividade, action.id)
    yield history.push(`/app/pages/atividades/atividade/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateAtividadesSaga(action) {
  try {
    const response = yield baseURL.get(`/atividade/search?filter[descricao]=${action.payload.url}`);
    yield put(actions.setAtividades(response.data.atividades));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}


function* AtividadeRootSaga() {
  yield all([
    takeEvery(CREATE_ATIVIDADE, createAtividadeSaga),
    takeLatest(LIST_ATIVIDADES, listAtividadesSaga),
    takeLatest(PAGINATE_ATIVIDADES, paginateAtividadesSaga),
    takeLatest(REMOVE_ATIVIDADE, removeAtividadeSaga),
    takeLatest(UPDATE_ATIVIDADE, updateAtividadeSaga),
    takeLatest(FETCH_ATIVIDADE, fetchAtividadeSaga),
    takeLatest(INIT_CREATE_ATIVIDADE, handleCreateAtividadeSaga),
    takeLatest(INIT_UPDATE_ATIVIDADE, handleUpdateAtividadeSaga),
  ]);
}


const atividadeSagas = [
  fork(AtividadeRootSaga),
];

export default atividadeSagas;
