import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_EQUIPAMENTO,
  UPDATE_EQUIPAMENTO,
  LIST_EQUIPAMENTOS,
  PAGINATE_EQUIPAMENTOS,
  REMOVE_EQUIPAMENTO,
  INIT_CREATE_EQUIPAMENTO,
  INIT_UPDATE_EQUIPAMENTO,
  FETCH_EQUIPAMENTO
} from '../constants/equipamentoConstants';
import * as actions from '../actions/equipamentoActions';

export function* createEquipamentoSaga(action) {
  try {
    yield put(startSubmit('equipamento'))
    yield baseURL.post('/equipamento', action.payload)
    yield put(actions.createdEquipamentoSuccess())
    yield history.push(`/app/pages/equipamentos/`)
    yield put(stopSubmit('equipamento'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('equipamento', error.data.message))
    }
  }

}

export function* listEquipamentosSaga(action) {
  try {
    const url = action.all ? '/equipamentos' : '/equipamentos'
    const response = yield baseURL.get(url);
    yield put(actions.setEquipamentos(response.data));
  } catch (error) {
    // yield put(actions.fetchEquipamentosFailed());
    console.log(error);
  }
}

export function* removeEquipamentoSaga(action) {
  try {
    const response = yield baseURL.delete(`/equipamento/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/equipamentos/`)
    }
    yield put(actions.removeEquipamentoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchEquipamentosFailed());
    console.log(error);
  }
}

export function* updateEquipamentoSaga(action) {
  try {
    yield put(startSubmit('equipamento'))
    const response = yield baseURL.put(`/equipamento/${action.payload.id}`, action.payload);
    yield put(actions.updateEquipamentoSuccess(response.data));
    yield history.push(`/app/pages/equipamentos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('equipamento', error.data.message))
    }
  }
}

export function* fetchEquipamentoSaga(action) {
  try {
    const response = yield baseURL.get(`/equipamento/${action.id}`)
    yield put(actions.setEquipamento(response.data))
  } catch (error) {
    // yield put(actions.fetchEquipamentosFailed());
    console.log(error);
  }
}

function fetchEquipamento(id) {
  try {
    return baseURL.get(`/equipamento/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateEquipamentoSaga() {
  try {
    yield history.push(`/app/pages/equipamentos/equipamento/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateEquipamentoSaga(action) {
  try {
    yield call(fetchEquipamento, action.id)
    yield history.push(`/app/pages/equipamentos/equipamento/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateEquipamentosSaga(action) {
  try {
    const response = yield baseURL.get(`/equipamento/search?filter[nome_recurso]=${action.payload.url}`);
    yield put(actions.setEquipamentos(response.data.equipamentos));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* EquipamentoRootSaga() {
  yield all([
    takeEvery(CREATE_EQUIPAMENTO, createEquipamentoSaga),
    takeLatest(LIST_EQUIPAMENTOS, listEquipamentosSaga),
    takeLatest(PAGINATE_EQUIPAMENTOS, paginateEquipamentosSaga),
    takeLatest(REMOVE_EQUIPAMENTO, removeEquipamentoSaga),
    takeLatest(UPDATE_EQUIPAMENTO, updateEquipamentoSaga),
    takeLatest(FETCH_EQUIPAMENTO, fetchEquipamentoSaga),
    takeLatest(INIT_CREATE_EQUIPAMENTO, handleCreateEquipamentoSaga),
    takeLatest(INIT_UPDATE_EQUIPAMENTO, handleUpdateEquipamentoSaga),
  ]);
}


const equipamentoSagas = [
  fork(EquipamentoRootSaga),
];

export default equipamentoSagas;
