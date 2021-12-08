import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import {
  CREATE_TIPOATIVIDADE,
  UPDATE_TIPOATIVIDADE,
  LIST_TIPOATIVIDADES,
  PAGINATE_TIPOATIVIDADES,
  REMOVE_TIPOATIVIDADE,
  INIT_CREATE_TIPOATIVIDADE,
  INIT_UPDATE_TIPOATIVIDADE,
  FETCH_TIPOATIVIDADE
} from '../constants/tipoAtividadeConstants';
import * as actions from '../actions/tipoAtividadeActions';

export function* createTipoAtividadeSaga(action) {
  try {
    yield put(startSubmit('tipoAtividade'))
    yield baseURL.post('/tipo-atividade', action.payload)
    yield put(actions.createdTipoAtividadeSuccess())
    yield history.push(`/app/pages/tiposAtividades/`)
    yield put(stopSubmit('tipoAtividade'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoAtividade', error.data.message))
    }
  }

}

export function* listTipoAtividadesSaga() {
  try {
    const response = yield baseURL.get('/tipos-atividades');
    console.log(response)
    yield put(actions.setTipoAtividades(response.data));
  } catch (error) {
    // yield put(actions.fetchTipoAtividadesFailed());
    console.log(error);
  }
}

export function* removeTipoAtividadeSaga(action) {
  try {
    const response = yield baseURL.delete(`/tipo-atividade/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/tiposAtividades/`)
    }
    yield put(actions.removeTipoAtividadeSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchTipoAtividadesFailed());
    console.log(error);
  }
}

export function* updateTipoAtividadeSaga(action) {
  try {
    yield put(startSubmit('tipoAtividade'))
    const response = yield baseURL.put(`/tipo-atividade/${action.payload.id}`, action.payload);
    yield put(actions.updateTipoAtividadeSuccess(response.data));
    yield history.push(`/app/pages/tiposAtividades/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoAtividade', error.data.message))
    }
  }
}

export function* fetchTipoAtividadeSaga(action) {
  try {
    const response = yield baseURL.get(`/tipo-atividade/${action.id}`)
    yield put(actions.setTipoAtividade(response.data))
  } catch (error) {
    // yield put(actions.fetchTipoAtividadesFailed());
    console.log(error);
  }
}

function fetchTipoAtividade(id) {
  try {
    return baseURL.get(`/tipo-atividade/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateTipoAtividadeSaga() {
  try {
    yield history.push(`/app/pages/tiposAtividades/tipoAtividade/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateTipoAtividadeSaga(action) {
  try {
    yield call(fetchTipoAtividade, action.id)
    yield history.push(`/app/pages/tiposAtividades/tipoAtividade/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateTiposAtividadesSaga(action) {
  try {
    const response = yield baseURL.get(`/tipo-atividade/search?filter[descricao]=${action.payload.url}`);
    yield put(actions.setTipoAtividades(response.data.tiposAtividades));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}


function* TipoAtividadeRootSaga() {
  yield all([
    takeEvery(CREATE_TIPOATIVIDADE, createTipoAtividadeSaga),
    takeLatest(LIST_TIPOATIVIDADES, listTipoAtividadesSaga),
    takeLatest(PAGINATE_TIPOATIVIDADES, paginateTiposAtividadesSaga),
    takeLatest(REMOVE_TIPOATIVIDADE, removeTipoAtividadeSaga),
    takeLatest(UPDATE_TIPOATIVIDADE, updateTipoAtividadeSaga),
    takeLatest(FETCH_TIPOATIVIDADE, fetchTipoAtividadeSaga),
    takeLatest(INIT_CREATE_TIPOATIVIDADE, handleCreateTipoAtividadeSaga),
    takeLatest(INIT_UPDATE_TIPOATIVIDADE, handleUpdateTipoAtividadeSaga),
  ]);
}


const tipoAtividadeSagas = [
  fork(TipoAtividadeRootSaga),
];

export default tipoAtividadeSagas;
