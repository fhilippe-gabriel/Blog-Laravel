import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_TIPO_FATURAMENTO,
  UPDATE_TIPO_FATURAMENTO,
  LIST_TIPO_FATURAMENTOS,
  REMOVE_TIPO_FATURAMENTO,
  INIT_CREATE_TIPO_FATURAMENTO,
  INIT_UPDATE_TIPO_FATURAMENTO,
  FETCH_TIPO_FATURAMENTO
} from '../constants/tipoFaturamentoConstants';
import * as actions from '../actions/tipoFaturamentoActions';

export function* createTipoFaturamentoSaga(action) {
  try {
    yield put(startSubmit('tipoFaturamento'))
    yield baseURL.post('/tipo-faturamento', action.payload)
    yield put(actions.createdTipoFaturamentoSuccess())
    yield history.push(`/app/pages/tiposFaturamentos/`)
    yield put(stopSubmit('tipoFaturamento'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoFaturamento', error.data.message))
    }
  }

}

export function* listTipoFaturamentosSaga(action) {
  try {
    const url = action.all ? '/tipos-faturamentos' : '/tipos-faturamentos'
    const response = yield baseURL.get(url);
    yield put(actions.setTipoFaturamentos(response.data));
  } catch (error) {
    // yield put(actions.fetchTipoFaturamentosFailed());
    console.log(error);
  }
}

export function* removeTipoFaturamentoSaga(action) {
  try {
    const response = yield baseURL.delete(`/tipo-faturamento/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/tiposFaturamentos/`)
    }
    yield put(actions.removeTipoFaturamentoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchTipoFaturamentosFailed());
    console.log(error);
  }
}

export function* updateTipoFaturamentoSaga(action) {
  try {
    yield put(startSubmit('tipoFaturamento'))
    const response = yield baseURL.put(`/tipo-faturamento/${action.payload.id}`, action.payload);
    yield put(actions.updateTipoFaturamentoSuccess(response.data));
    yield history.push(`/app/pages/tiposFaturamentos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoFaturamento', error.data.message))
    }
  }
}

export function* fetchTipoFaturamentoSaga(action) {
  try {
    const response = yield baseURL.get(`/tipo-faturamento/${action.id}`)
    yield put(actions.setTipoFaturamento(response.data))
  } catch (error) {
    // yield put(actions.fetchTipoFaturamentosFailed());
    console.log(error);
  }
}

function fetchTipoFaturamento(id) {
  try {
    return baseURL.get(`/tipo-faturamento/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateTipoFaturamentoSaga() {
  try {
    yield history.push(`/app/pages/tiposFaturamentos/tipoFaturamento/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateTipoFaturamentoSaga(action) {
  try {
    yield call(fetchTipoFaturamento, action.id)
    yield history.push(`/app/pages/tiposFaturamentos/tipoFaturamento/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


function* TipoFaturamentoRootSaga() {
  yield all([
    takeEvery(CREATE_TIPO_FATURAMENTO, createTipoFaturamentoSaga),
    takeLatest(LIST_TIPO_FATURAMENTOS, listTipoFaturamentosSaga),
    takeLatest(REMOVE_TIPO_FATURAMENTO, removeTipoFaturamentoSaga),
    takeLatest(UPDATE_TIPO_FATURAMENTO, updateTipoFaturamentoSaga),
    takeLatest(FETCH_TIPO_FATURAMENTO, fetchTipoFaturamentoSaga),
    takeLatest(INIT_CREATE_TIPO_FATURAMENTO, handleCreateTipoFaturamentoSaga),
    takeLatest(INIT_UPDATE_TIPO_FATURAMENTO, handleUpdateTipoFaturamentoSaga),
  ]);
}


const tipoFaturamentoSagas = [
  fork(TipoFaturamentoRootSaga),
];

export default tipoFaturamentoSagas;
