import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_TARIFA_PRECO,
  UPDATE_TARIFA_PRECO,
  LIST_TARIFA_PRECOS,
  REMOVE_TARIFA_PRECO,
  INIT_CREATE_TARIFA_PRECO,
  INIT_UPDATE_TARIFA_PRECO,
  FETCH_TARIFA_PRECO
} from '../constants/tarifaPrecoConstants';
import * as actions from '../actions/tarifaPrecoActions';

export function* createTarifaPrecoSaga(action) {
  try {
    yield put(startSubmit('tarifaPreco'))
    yield baseURL.post('/tarifa-preco', action.payload)
    yield put(actions.createdTarifaPrecoSuccess())
    yield history.push(`/app/pages/tarifasPrecos/`)
    yield put(stopSubmit('tarifaPreco'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tarifaPreco', error.data.message))
    }
  }

}

export function* listTarifaPrecosSaga(action) {
  try {
    const url = action.payload ? `/tarifas-precos?${action.payload.url}` : '/tarifas-precos'
    const response = yield baseURL.get(url);
    yield put(actions.setTarifaPrecos(response.data));
  } catch (error) {
    // yield put(actions.fetchTarifaPrecosFailed());
    console.log(error);
  }
}

export function* removeTarifaPrecoSaga(action) {
  try {
    const response = yield baseURL.delete(`/tarifa-preco/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/tarifasPrecos/`)
    }
    yield put(actions.removeTarifaPrecoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchTarifaPrecosFailed());
    console.log(error);
  }
}

export function* updateTarifaPrecoSaga(action) {
  try {
    yield put(startSubmit('tarifaPreco'))
    const response = yield baseURL.put(`/tarifa-preco/${action.payload.id}`, action.payload);
    yield put(actions.updateTarifaPrecoSuccess(response.data));
    yield history.push(`/app/pages/tarifasPrecos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tarifaPreco', error.data.message))
    }
  }
}

export function* fetchTarifaPrecoSaga(action) {
  try {
    const response = yield baseURL.get(`/tarifa-preco/${action.id}`)
    yield put(actions.setTarifaPreco(response.data))
  } catch (error) {
    // yield put(actions.fetchTarifaPrecosFailed());
    console.log(error);
  }
}

function fetchTarifaPreco(id) {
  try {
    return baseURL.get(`/tarifa-preco/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateTarifaPrecoSaga() {
  try {
    yield history.push(`/app/pages/tarifasPrecos/tarifaPreco/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateTarifaPrecoSaga(action) {
  try {
    yield call(fetchTarifaPreco, action.id)
    yield history.push(`/app/pages/tarifasPrecos/tarifaPreco/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


function* TarifaPrecoRootSaga() {
  yield all([
    takeEvery(CREATE_TARIFA_PRECO, createTarifaPrecoSaga),
    takeLatest(LIST_TARIFA_PRECOS, listTarifaPrecosSaga),
    takeLatest(REMOVE_TARIFA_PRECO, removeTarifaPrecoSaga),
    takeLatest(UPDATE_TARIFA_PRECO, updateTarifaPrecoSaga),
    takeLatest(FETCH_TARIFA_PRECO, fetchTarifaPrecoSaga),
    takeLatest(INIT_CREATE_TARIFA_PRECO, handleCreateTarifaPrecoSaga),
    takeLatest(INIT_UPDATE_TARIFA_PRECO, handleUpdateTarifaPrecoSaga),
  ]);
}


const tarifaPrecoSagas = [
  fork(TarifaPrecoRootSaga),
];

export default tarifaPrecoSagas;
