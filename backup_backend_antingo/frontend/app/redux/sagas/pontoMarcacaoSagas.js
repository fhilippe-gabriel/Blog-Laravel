import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import * as uiActions from '../actions/uiActions'
import {
  CREATE_PONTO_MARCACAO,
  UPLOAD_PONTO_MARCACAO,
  UPDATE_PONTO_MARCACAO,
  CREATE_PONTO_MARCACAO_MODAL,
  LIST_PONTOS_MARCACOES,
  PAGINATE_PONTOS_MARCACOES,
  REMOVE_PONTO_MARCACAO,
  INIT_CREATE_PONTO_MARCACAO,
  INIT_UPDATE_PONTO_MARCACAO,
  FETCH_PONTO_MARCACAO,
} from '../constants/pontoMarcacaoConstants';
import * as actions from '../actions/pontoMarcacaoActions';

export function* createPontoMarcacaoSaga(action) {
  try {
    yield* submitPontoMarcacao(action);
    yield history.push(`/app/pages/pontosMarcacoes/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('pontoMarcacao', error.data.message))
    }
  }
}

export function* uploadPontoMarcacaoSaga(action) {
  try {
    console.log(action.payload, 'payload')
    const response = yield baseURL.post(`/ponto-marcacao/importaCsv`, action.payload);
    yield put(actions.updatePontoMarcacaoSuccess(response.data));
    yield put(uiActions.toggleModal());
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('pontoMarcacao', error.data.message))
    }
  }
}

export function* createPontoMarcacaoSagaModal(action) {
  try {
    yield* submitPontoMarcacao(action);
    yield* listPontosMarcacoesSaga({'all' : true})
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('pontoMarcacao', error.data.message))
    }
  }
}

function* submitPontoMarcacao(action) {
  yield put(startSubmit('pontoMarcacao'));
  yield baseURL.post('/ponto-marcacao', action.payload);
  yield put(actions.createdPontoMarcacaoSuccess());
  yield put(uiActions.toggleModal())
  yield put(stopSubmit('pontoMarcacao'));
}

export function* listPontosMarcacoesSaga(action) {
  try {
    const url = action.all ? '/pontos-marcacoes?per_page=all' : '/pontos-marcacoes'
    const response = yield baseURL.get(url);
    const retorno = action.all ? response : response.data;
    yield put(actions.setPontosMarcacoes(retorno));
  } catch (error) {
    // yield put(actions.fetchPontosMarcacoesFailed());
    console.log(error);
  }
}

export function* removePontoMarcacaoSaga(action) {
  try {
    const response = yield baseURL.delete(`/ponto-marcacao/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/pontosMarcacoes/`)
    }
    yield put(actions.removePontoMarcacaoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchPontosMarcacoesFailed());
    console.log(error);
  }
}

export function* updatePontoMarcacaoSaga(action) {
  try {
    yield put(startSubmit('pontoMarcacao'))
    const response = yield baseURL.put(`/ponto-marcacao/${action.payload.id}`, action.payload);
    yield put(actions.updatePontoMarcacaoSuccess(response.data));
    yield history.push(`/app/pages/pontosMarcacoes/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('pontoMarcacao', error.data.message))
    }
  }
}

export function* fetchPontoMarcacaoSaga(action) {
  try {
    const response = yield baseURL.get(`/ponto-marcacao/${action.id}`)
    yield put(actions.setPontoMarcacao(response.data))
  } catch (error) {
    // yield put(actions.fetchPontosMarcacoesFailed());
    console.log(error);
  }
}

function fetchPontoMarcacao(id) {
  try {
    return baseURL.get(`/ponto-marcacao/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreatePontoMarcacaoSaga() {
  try {
    yield history.push(`/app/pages/pontosMarcacoes/pontoMarcacao/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdatePontoMarcacaoSaga(action) {
  try {
    yield call(fetchPontoMarcacao, action.id)
    yield history.push(`/app/pages/pontosMarcacoes/pontoMarcacao/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginatePontosMarcacoesSaga(action) {
  try {
    const response = yield baseURL.get(`/ponto-marcacao/search?filter[nome_pontoMarcacao]=${action.payload.url}`);
    yield put(actions.setPontosMarcacoes(response.data.pontos - marcacoes));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* PontoMarcacaoRootSaga() {
  yield all([
    takeEvery(CREATE_PONTO_MARCACAO, createPontoMarcacaoSaga),
    takeEvery(UPLOAD_PONTO_MARCACAO, uploadPontoMarcacaoSaga),
    takeEvery(CREATE_PONTO_MARCACAO_MODAL, createPontoMarcacaoSagaModal),
    takeLatest(LIST_PONTOS_MARCACOES, listPontosMarcacoesSaga),
    takeLatest(PAGINATE_PONTOS_MARCACOES, paginatePontosMarcacoesSaga),
    takeLatest(REMOVE_PONTO_MARCACAO, removePontoMarcacaoSaga),
    takeLatest(UPDATE_PONTO_MARCACAO, updatePontoMarcacaoSaga),
    takeLatest(FETCH_PONTO_MARCACAO, fetchPontoMarcacaoSaga),
    takeLatest(INIT_CREATE_PONTO_MARCACAO, handleCreatePontoMarcacaoSaga),
    takeLatest(INIT_UPDATE_PONTO_MARCACAO, handleUpdatePontoMarcacaoSaga),
  ]);
}


const pontoMarcacaoSagas = [
  fork(PontoMarcacaoRootSaga),
];

export default pontoMarcacaoSagas;
