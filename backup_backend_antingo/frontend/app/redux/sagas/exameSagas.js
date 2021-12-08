import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import * as uiActions from '../actions/uiActions'
import {
  CREATE_EXAME,
  UPDATE_EXAME,
  LIST_EXAMES,
  CREATE_EXAME_MODAL,
  PAGINATE_EXAMES,
  REMOVE_EXAME,
  INIT_CREATE_EXAME,
  INIT_UPDATE_EXAME,
  FETCH_EXAME
} from '../constants/exameConstants';
import * as actions from '../actions/exameActions';

export function* createExameSaga(action) {
  try {
    yield put(startSubmit('exame'))
    yield baseURL.post('/exame', action.payload)
    yield put(actions.createdExameSuccess())
    yield history.push(`/app/pages/exames/`)
    yield put(stopSubmit('exame'))
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('exame', error.data.message))
    }
  }
}
export function* createExameSagaModal(action) {
  try {
    yield put(startSubmit('exame'))
    yield baseURL.post('/exame', action.payload)
    yield put(actions.createdExameSuccess())
    yield put(uiActions.toggleModal())
    yield put(stopSubmit('exame'))
    yield* listExamesSaga({'all' : true});
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('exame', error.data.message))
    }
  }
}

export function* listExamesSaga(action) {
  try {
    const url = action.all ? '/exames?per_page=all' : '/exames'
    const response = yield baseURL.get(url);
    const retorno = action.all ? response : response.data; 
    yield put(actions.setExames(retorno));
  } catch (error) {
    // yield put(actions.fetchExamesFailed());
    console.log(error);
  }
}

export function* removeExameSaga(action) {
  try {
    const response = yield baseURL.delete(`/exame/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/exames/`)
    }
    yield put(actions.removeExameSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchExamesFailed());
    console.log(error);
  }
}

export function* updateExameSaga(action) {
  try {
    yield put(startSubmit('exame'))
    const response = yield baseURL.put(`/exame/${action.payload.id}`, action.payload);
    yield put(actions.updateExameSuccess(response.data));
    yield history.push(`/app/pages/exames/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('exame', error.data.message))
    }
  }
}

export function* fetchExameSaga(action) {
  try {
    const response = yield baseURL.get(`/exame/${action.id}`)
    yield put(actions.setExame(response.data))
  } catch (error) {
    // yield put(actions.fetchExamesFailed());
    console.log(error);
  }
}

function fetchExame(id) {
  try {
    return baseURL.get(`/exame/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateExameSaga() {
  try {
    yield history.push(`/app/pages/exames/exame/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateExameSaga(action) {
  try {
    yield call(fetchExame, action.id)
    yield history.push(`/app/pages/exames/exame/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateExamesSaga(action) {
  try {
    const response = yield baseURL.get(`/exame/search?filter[nome_exame]=${action.payload.url}`);
    yield put(actions.setExames(response.data.exames));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* ExameRootSaga() {
  yield all([
    takeEvery(CREATE_EXAME, createExameSaga),
    takeEvery(CREATE_EXAME_MODAL, createExameSagaModal),
    takeLatest(LIST_EXAMES, listExamesSaga),
    takeLatest(PAGINATE_EXAMES, paginateExamesSaga),
    takeLatest(REMOVE_EXAME, removeExameSaga),
    takeLatest(UPDATE_EXAME, updateExameSaga),
    takeLatest(FETCH_EXAME, fetchExameSaga),
    takeLatest(INIT_CREATE_EXAME, handleCreateExameSaga),
    takeLatest(INIT_UPDATE_EXAME, handleUpdateExameSaga),
  ]);
}


const exameSagas = [
  fork(ExameRootSaga),
];

export default exameSagas;
