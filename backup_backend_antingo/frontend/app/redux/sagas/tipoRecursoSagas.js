import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import * as uiActions from '../actions/uiActions'
import {
  CREATE_TIPORECURSO,
  UPDATE_TIPORECURSO,
  CREATE_TIPORECURSO_MODAL,
  LIST_TIPORECURSOS,
  PAGINATE_TIPORECURSOS,
  REMOVE_TIPORECURSO,
  INIT_CREATE_TIPORECURSO,
  INIT_UPDATE_TIPORECURSO,
  FETCH_TIPORECURSO
} from '../constants/tipoRecursoConstants';
import * as actions from '../actions/tipoRecursoActions';

export function* createTipoRecursoSaga(action) {
  try {
    yield* submitTipoRecuso(action);
    yield history.push(`/app/pages/tiposRecursos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoRecurso', error.data.message))
    }
  }
}

export function* createTipoRecursoSagaModal(action) {
  try {
    yield* submitTipoRecuso(action);
    yield put(uiActions.toggleModal())
    yield* listTipoRecursosSaga({ 'all': true })
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoRecurso', error.data.message))
    }
  }
}

function* submitTipoRecuso(action) {
  yield put(startSubmit('tipoRecurso'));
  yield baseURL.post('/tipo-recurso', action.payload);
  yield put(actions.createdTipoRecursoSuccess());
  yield put(stopSubmit('tipoRecurso'));
}

export function* listTipoRecursosSaga(action) {
  try {
    const url = action.all ? '/tipos-recursos' : '/tipos-recursos'
    const response = yield baseURL.get(url);
    yield put(actions.setTipoRecursos(response.data));
  } catch (error) {
    // yield put(actions.fetchTipoRecursosFailed());
    console.log(error);
  }
}

export function* removeTipoRecursoSaga(action) {
  try {
    const response = yield baseURL.delete(`/tipo-recurso/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/tiposRecursos/`)
    }
    yield put(actions.removeTipoRecursoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchTipoRecursosFailed());
    console.log(error);
  }
}

export function* updateTipoRecursoSaga(action) {
  try {
    yield put(startSubmit('tipoRecurso'))
    const response = yield baseURL.put(`/tipo-recurso/${action.payload.id}`, action.payload);
    yield put(actions.updateTipoRecursoSuccess(response.data));
    yield history.push(`/app/pages/tiposRecursos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tipoRecurso', error.data.message))
    }
  }
}

export function* fetchTipoRecursoSaga(action) {
  try {
    const response = yield baseURL.get(`/tipo-recurso/${action.id}`)
    yield put(actions.setTipoRecurso(response.data))
  } catch (error) {
    // yield put(actions.fetchTipoRecursosFailed());
    console.log(error);
  }
}

function fetchTipoRecurso(id) {
  try {
    return baseURL.get(`/tipo-recurso/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateTipoRecursoSaga() {
  try {
    yield history.push(`/app/pages/tiposRecursos/tipoRecurso/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateTipoRecursoSaga(action) {
  try {
    yield call(fetchTipoRecurso, action.id)
    yield history.push(`/app/pages/tiposRecursos/tipoRecurso/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


export function* paginateTiposRecursosSaga(action) {
  try {
    const response = yield baseURL.get(`/tipo-recurso/search?filter[descricao]=${action.payload.url}`);
    yield put(actions.setTipoRecursos(response.data.tiposRecursos));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}


function* TipoRecursoRootSaga() {
  yield all([
    takeEvery(CREATE_TIPORECURSO, createTipoRecursoSaga),
    takeEvery(CREATE_TIPORECURSO_MODAL, createTipoRecursoSagaModal),
    takeLatest(LIST_TIPORECURSOS, listTipoRecursosSaga),
    takeLatest(PAGINATE_TIPORECURSOS, paginateTiposRecursosSaga),
    takeLatest(REMOVE_TIPORECURSO, removeTipoRecursoSaga),
    takeLatest(UPDATE_TIPORECURSO, updateTipoRecursoSaga),
    takeLatest(FETCH_TIPORECURSO, fetchTipoRecursoSaga),
    takeLatest(INIT_CREATE_TIPORECURSO, handleCreateTipoRecursoSaga),
    takeLatest(INIT_UPDATE_TIPORECURSO, handleUpdateTipoRecursoSaga),
  ]);
}


const tipoRecursoSagas = [
  fork(TipoRecursoRootSaga),
];

export default tipoRecursoSagas;
