import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import * as uiActions from '../actions/uiActions'
import {
  CREATE_TARIFA,
  UPDATE_TARIFA,
  CREATE_TARIFA_MODAL,
  LIST_TARIFAS,
  PAGINATE_TARIFAS,
  REMOVE_TARIFA,
  INIT_CREATE_TARIFA,
  INIT_UPDATE_TARIFA,
  FETCH_TARIFA
} from '../constants/tarifaConstants';
import * as actions from '../actions/tarifaActions';

export function* createTarifaSaga(action) {
  try {
    yield* submitTarifa(action);
    yield history.push(`/app/pages/tarifas/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tarifa', error.data.message))
    }
  }
}

function* submitTarifa(action) {
  yield put(startSubmit('tarifa'));
  yield baseURL.post('/tarifa', action.payload);
  yield put(actions.createdTarifaSuccess());
  yield put(stopSubmit('tarifa'));
}

export function* createTarifaSagaModal(action) {
  try {
    yield* submitTarifa(action);
    yield put(uiActions.toggleModal())
    yield* listTarifasSaga({'all' : true})
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tarifa', error.data.message))
    }
  }

}

export function* listTarifasSaga(action) {
  try {
    const url = action.all ? '/tarifas' : '/tarifas'
    const response = yield baseURL.get(url);
    yield put(actions.setTarifas(response.data));
  } catch (error) {
    // yield put(actions.fetchTarifasFailed());
    console.log(error);
  }
}

export function* removeTarifaSaga(action) {
  try {
    const response = yield baseURL.delete(`/tarifa/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/tarifas/`)
    }
    yield put(actions.removeTarifaSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchTarifasFailed());
    console.log(error);
  }
}

export function* updateTarifaSaga(action) {
  try {
    yield put(startSubmit('tarifa'))
    const response = yield baseURL.put(`/tarifa/${action.payload.id}`, action.payload);
    yield put(actions.updateTarifaSuccess(response.data));
    yield history.push(`/app/pages/tarifas/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('tarifa', error.data.message))
    }
  }
}

export function* fetchTarifaSaga(action) {
  try {
    const response = yield baseURL.get(`/tarifa/${action.id}`)
    yield put(actions.setTarifa(response.data))
  } catch (error) {
    // yield put(actions.fetchTarifasFailed());
    console.log(error);
  }
}

function fetchTarifa(id) {
  try {
    return baseURL.get(`/tarifa/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateTarifaSaga() {
  try {
    yield history.push(`/app/pages/tarifas/tarifa/`);
  } catch (error) {
    console.log(error);
  }
}


export function* handleUpdateTarifaSaga(action) {
  try {
    yield call(fetchTarifa, action.id)
    yield history.push(`/app/pages/tarifas/tarifa/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateTarifasSaga(action) {
  try {
    const response = yield baseURL.get(`/tarifa/search?filter[descricao]=${action.payload.url}`);
    yield put(actions.setTarifas(response.data.tarifas));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}

function* TarifaRootSaga() {
  yield all([
    takeEvery(CREATE_TARIFA, createTarifaSaga),
    takeEvery(CREATE_TARIFA_MODAL, createTarifaSagaModal),
    takeLatest(LIST_TARIFAS, listTarifasSaga),
    takeLatest(PAGINATE_TARIFAS, paginateTarifasSaga),
    takeLatest(REMOVE_TARIFA, removeTarifaSaga),
    takeLatest(UPDATE_TARIFA, updateTarifaSaga),
    takeLatest(FETCH_TARIFA, fetchTarifaSaga),
    takeLatest(INIT_CREATE_TARIFA, handleCreateTarifaSaga),
    takeLatest(INIT_UPDATE_TARIFA, handleUpdateTarifaSaga),
  ]);
}


const tarifaSagas = [
  fork(TarifaRootSaga),
];

export default tarifaSagas;
