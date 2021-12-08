import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_CLIENTE,
  UPDATE_CLIENTE,
  LIST_CLIENTES,
  PAGINATE_CLIENTES,
  REMOVE_CLIENTE,
  INIT_CREATE_CLIENTE,
  INIT_UPDATE_CLIENTE,
  FETCH_CLIENTE
} from '../constants/clienteConstants';
import * as actions from '../actions/clienteActions';

export function* createClienteSaga(action) {
  try {
    yield put(startSubmit('cliente'))
    yield baseURL.post('/cliente', action.payload)
    yield put(actions.createdClienteSuccess())
    yield history.push(`/app/pages/clientes/`)
    yield put(stopSubmit('cliente'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('cliente', error.data.message))
    }
  }

}

export function* listClientesSaga() {
  try {
    const response = yield baseURL.get('/clientes');
    yield put(actions.setClientes(response.data));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

export function* paginateClientesSaga(action) {
  try {
    const response = yield baseURL.get(`/cliente/search?filter[nome_fantasia]=${action.payload.url}`);
    yield put(actions.setClientes(response.data.clientes));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}


export function* removeClienteSaga(action) {
  try {
    const response = yield baseURL.delete(`/cliente/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/clientes/`)
    }
    yield put(actions.removeClienteSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

export function* updateClienteSaga(action) {
  try {
    yield put(startSubmit('cliente'))
    const response = yield baseURL.post(`/cliente/${action.id}`, action.payload, {
      'content-type': 'multipart/form-data'
    });
    yield put(actions.updateClienteSuccess(response.data));
    yield history.push(`/app/pages/clientes/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('cliente', error.data.message))
    }
  }
}

export function* fetchClienteSaga(action) {
  try {
    const response = yield baseURL.get(`/cliente/${action.id}`)
    yield put(actions.setCliente(response.data))
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function fetchCliente(id) {
  try {
    return baseURL.get(`/cliente/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateClienteSaga() {
  try {
    yield history.push(`/app/pages/clientes/cliente/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateClienteSaga(action) {
  try {
    yield call(fetchCliente, action.id)
    yield history.push(`/app/pages/clientes/cliente/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


function* ClienteRootSaga() {
  yield all([
    takeEvery(CREATE_CLIENTE, createClienteSaga),
    takeLatest(LIST_CLIENTES, listClientesSaga),
    takeLatest(PAGINATE_CLIENTES, paginateClientesSaga),
    takeLatest(REMOVE_CLIENTE, removeClienteSaga),
    takeLatest(UPDATE_CLIENTE, updateClienteSaga),
    takeLatest(FETCH_CLIENTE, fetchClienteSaga),
    takeLatest(INIT_CREATE_CLIENTE, handleCreateClienteSaga),
    takeLatest(INIT_UPDATE_CLIENTE, handleUpdateClienteSaga),
  ]);
}


const clienteSagas = [
  fork(ClienteRootSaga),
];

export default clienteSagas;
