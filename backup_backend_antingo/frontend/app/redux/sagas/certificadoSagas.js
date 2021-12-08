import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import * as uiActions from '../actions/uiActions'
import {
  CREATE_CERTIFICADO,
  UPDATE_CERTIFICADO,
  CREATE_CERTIFICADO_MODAL,
  LIST_CERTIFICADOS,
  PAGINATE_CERTIFICADOS,
  REMOVE_CERTIFICADO,
  INIT_CREATE_CERTIFICADO,
  INIT_UPDATE_CERTIFICADO,
  FETCH_CERTIFICADO,
  LIST_CERTIFICADO_SITUACOES
} from '../constants/certificadoConstants';
import * as actions from '../actions/certificadoActions';

export function* createCertificadoSaga(action) {
  try {
    yield* submitCertificado(action);
    yield history.push(`/app/pages/certificados/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('certificado', error.data.message))
    }
  }
}

export function* createCertificadoSagaModal(action) {
  try {
    yield* submitCertificado(action);
    yield* listCertificadosSaga({'all' : true})
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('certificado', error.data.message))
    }
  }
}

function* submitCertificado(action) {
  yield put(startSubmit('certificado'));
  yield baseURL.post('/certificado', action.payload);
  yield put(actions.createdCertificadoSuccess());
  yield put(uiActions.toggleModal())
  yield put(stopSubmit('certificado'));
}

export function* listCertificadosSaga(action) {
  try {
    const url = action.all ? '/certificados?per_page=all' : '/certificados'
    const response = yield baseURL.get(url);
    const retorno = action.all ? response : response.data; 
    yield put(actions.setCertificados(retorno));
  } catch (error) {
    // yield put(actions.fetchCertificadosFailed());
    console.log(error);
  }
}

export function* listCertificadoSituacoesSaga() {
  try {
    const response = yield baseURL.get('/certificado/situacoes');
    yield put(actions.setCertificadoSituacoes(response.data));
  } catch (error) {
    // yield put(actions.fetchCertificadosFailed());
    console.log(error);
  }
}

export function* removeCertificadoSaga(action) {
  try {
    const response = yield baseURL.delete(`/certificado/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/certificados/`)
    }
    yield put(actions.removeCertificadoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchCertificadosFailed());
    console.log(error);
  }
}

export function* updateCertificadoSaga(action) {
  try {
    yield put(startSubmit('certificado'))
    const response = yield baseURL.put(`/certificado/${action.payload.id}`, action.payload);
    yield put(actions.updateCertificadoSuccess(response.data));
    yield history.push(`/app/pages/certificados/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('certificado', error.data.message))
    }
  }
}

export function* fetchCertificadoSaga(action) {
  try {
    const response = yield baseURL.get(`/certificado/${action.id}`)
    yield put(actions.setCertificado(response.data))
  } catch (error) {
    // yield put(actions.fetchCertificadosFailed());
    console.log(error);
  }
}

function fetchCertificado(id) {
  try {
    return baseURL.get(`/certificado/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateCertificadoSaga() {
  try {
    yield history.push(`/app/pages/certificados/certificado/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateCertificadoSaga(action) {
  try {
    yield call(fetchCertificado, action.id)
    yield history.push(`/app/pages/certificados/certificado/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateCertificadosSaga(action) {
  try {
    const response = yield baseURL.get(`/certificado/search?filter[nome_certificado]=${action.payload.url}`);
    yield put(actions.setCertificados(response.data.certificados));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* CertificadoRootSaga() {
  yield all([
    takeEvery(CREATE_CERTIFICADO, createCertificadoSaga),
    takeEvery(CREATE_CERTIFICADO_MODAL, createCertificadoSagaModal),
    takeLatest(LIST_CERTIFICADOS, listCertificadosSaga),
    takeLatest(PAGINATE_CERTIFICADOS, paginateCertificadosSaga),
    takeLatest(LIST_CERTIFICADO_SITUACOES, listCertificadoSituacoesSaga),
    takeLatest(REMOVE_CERTIFICADO, removeCertificadoSaga),
    takeLatest(UPDATE_CERTIFICADO, updateCertificadoSaga),
    takeLatest(FETCH_CERTIFICADO, fetchCertificadoSaga),
    takeLatest(INIT_CREATE_CERTIFICADO, handleCreateCertificadoSaga),
    takeLatest(INIT_UPDATE_CERTIFICADO, handleUpdateCertificadoSaga),
  ]);
}


const certificadoSagas = [
  fork(CertificadoRootSaga),
];

export default certificadoSagas;
