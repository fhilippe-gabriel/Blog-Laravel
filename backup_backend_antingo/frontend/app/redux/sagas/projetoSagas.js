import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_PROJETO,
  UPDATE_PROJETO,
  LIST_PROJETOS,
  PAGINATE_PROJETOS,
  REMOVE_PROJETO,
  INIT_CREATE_PROJETO,
  INIT_UPDATE_PROJETO,
  FETCH_PROJETO
} from '../constants/projetoConstants';
import * as actions from '../actions/projetoActions';

export function* createProjetoSaga(action) {
  try {
    yield put(startSubmit('projeto'))
    yield baseURL.post('/projeto', action.payload);
    yield put(actions.createdProjetoSuccess())
    yield history.push(`/app/pages/projetos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('projeto', error.data.message))
    }
  }

}

export function* listProjetosSaga() {
  try {
    const response = yield baseURL.get('/projetos');
    yield put(actions.setProjetos(response.data));
  } catch (error) {
    // yield put(actions.fetchProjetosFailed());
    console.log(error);
  }
}

export function* removeProjetoSaga(action) {
  try {
    const response = yield baseURL.delete(`/projeto/${action.id}`,);
    if (action.redirect){
      yield history.push(`/app/pages/projetos/`)
    }
    yield put(actions.removeProjetoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchProjetosFailed());
    console.log(error);
  }
}

export function* updateProjetoSaga(action) {
  try {
    yield put(startSubmit('projeto'))
    const response = yield baseURL.put(`/projeto/${action.payload.id}`, action.payload);
    yield put(actions.updateProjetoSuccess(response.data));
    yield history.push(`/app/pages/projetos/`)
  } catch (error) {
    if (error) {
      yield put(stopSubmit('projeto', error.data.message))
    }
  }

}

export function* fetchProjetoSaga(action) {
  try {
    const response = yield call(fetchProjeto, action.id)
    yield put(actions.setProjeto(response.data))
  } catch (error) {
    // yield put(actions.fetchProjetosFailed());
    console.log(error);
  }
}

function fetchProjeto(id) {
  return baseURL.get(`/projeto/${id}`)
}

export function* handleCreateProjetoSaga() {
  try {
    yield history.push(`/app/pages/projetos/projeto/`);
  } catch (error) {
    console.log(error)
  }
}

export function* handleUpdateProjetoSaga(action) {
  try {
    const response = yield call(fetchProjeto, action.id)
    yield put(actions.setProjeto(response.data))
    yield history.push(`/app/pages/projetos/projeto/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateProjetosSaga(action) {
  try {
    const response = yield baseURL.get(`/projeto/search?filter[descricao]=${action.payload.url}`);
    yield put(actions.setProjetos(response.data.projetos));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* ProjetoRootSaga() {
  yield all([
    takeEvery(CREATE_PROJETO, createProjetoSaga),
    takeLatest(LIST_PROJETOS, listProjetosSaga),
    takeLatest(PAGINATE_PROJETOS, paginateProjetosSaga),
    takeLatest(REMOVE_PROJETO, removeProjetoSaga),
    takeLatest(UPDATE_PROJETO, updateProjetoSaga),
    takeLatest(FETCH_PROJETO, fetchProjetoSaga),
    takeLatest(INIT_CREATE_PROJETO, handleCreateProjetoSaga),
    takeLatest(INIT_UPDATE_PROJETO, handleUpdateProjetoSaga),
  ]);
}


const projetoSagas = [
  fork(ProjetoRootSaga),
];

export default projetoSagas;
