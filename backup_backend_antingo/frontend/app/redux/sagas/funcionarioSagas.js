import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_FUNCIONARIO,
  UPDATE_FUNCIONARIO,
  LIST_FUNCIONARIOS,
  PAGINATE_FUNCIONARIOS,
  REMOVE_FUNCIONARIO,
  INIT_CREATE_FUNCIONARIO,
  INIT_UPDATE_FUNCIONARIO,
  FETCH_FUNCIONARIO
} from '../constants/funcionarioConstants';
import * as actions from '../actions/funcionarioActions';

export function* createFuncionarioSaga(action) {
  try {
    yield put(startSubmit('funcionario'))
    yield baseURL.post('/funcionario', action.payload)
    yield put(actions.createdFuncionarioSuccess())
    yield history.push(`/app/pages/funcionarios/`)
    yield put(stopSubmit('funcionario'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('funcionario', error.data.message))
    }
  }

}

export function* listFuncionariosSaga(action) {
  try {
    const url = action.all ? '/funcionarios?per_page=all' : '/funcionarios'
    const response = yield baseURL.get(url);
    const retorno = action.all ? response : response.data;
    yield put(actions.setFuncionarios(retorno));
  } catch (error) {
    // yield put(actions.fetchFuncionariosFailed());
    console.log(error);
  }
}

export function* removeFuncionarioSaga(action) {
  try {
    const response = yield baseURL.delete(`/funcionario/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/funcionarios/`)
    }
    yield put(actions.removeFuncionarioSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchFuncionariosFailed());
    console.log(error);
  }
}

export function* updateFuncionarioSaga(action) {
  try {
    yield put(startSubmit('funcionario'))
    const response = yield baseURL.put(`/funcionario/${action.payload.id}`, action.payload);
    yield put(actions.updateFuncionarioSuccess(response.data));
    yield history.push(`/app/pages/funcionarios/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('funcionario', error.data.message))
    }
  }
}

export function* fetchFuncionarioSaga(action) {
  try {
    const response = yield baseURL.get(`/funcionario/${action.id}`)
    yield put(actions.setFuncionario(response.data))
  } catch (error) {
    // yield put(actions.fetchFuncionariosFailed());
    console.log(error);
  }
}

function fetchFuncionario(id) {
  try {
    return baseURL.get(`/funcionario/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateFuncionarioSaga() {
  try {
    yield history.push(`/app/pages/funcionarios/funcionario/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateFuncionarioSaga(action) {
  try {
    yield call(fetchFuncionario, action.id)
    yield history.push(`/app/pages/funcionarios/funcionario/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateFuncionariosSaga(action) {
  try {
    const response = yield baseURL.get(`/funcionario/search?filter[nome]=${action.payload.url}`);
    yield put(actions.setFuncionarios(response.data.funcionarios));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* FuncionarioRootSaga() {
  yield all([
    takeEvery(CREATE_FUNCIONARIO, createFuncionarioSaga),
    takeLatest(LIST_FUNCIONARIOS, listFuncionariosSaga),
    takeLatest(PAGINATE_FUNCIONARIOS, paginateFuncionariosSaga),
    takeLatest(REMOVE_FUNCIONARIO, removeFuncionarioSaga),
    takeLatest(UPDATE_FUNCIONARIO, updateFuncionarioSaga),
    takeLatest(FETCH_FUNCIONARIO, fetchFuncionarioSaga),
    takeLatest(INIT_CREATE_FUNCIONARIO, handleCreateFuncionarioSaga),
    takeLatest(INIT_UPDATE_FUNCIONARIO, handleUpdateFuncionarioSaga),
  ]);
}


const funcionarioSagas = [
  fork(FuncionarioRootSaga),
];

export default funcionarioSagas;
