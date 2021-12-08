import { baseURL } from '@/services/api';
import history from '../../utils/history';
import {
  call, fork, put, take, takeLatest, takeEvery, all
} from 'redux-saga/effects';

import { startSubmit, stopSubmit } from 'redux-form';
import * as uiActions from '../actions/uiActions'
import {
  CREATE_CARGO,
  CREATE_CARGO_MODAL,
  UPDATE_CARGO,
  LIST_CARGOS,
  PAGINATE_CARGOS,
  REMOVE_CARGO,
  INIT_CREATE_CARGO,
  INIT_UPDATE_CARGO,
  FETCH_CARGO
} from '../constants/cargoConstants';
import * as actions from '../actions/cargoActions';

export function* createCargoSaga(action) {
  try {
    yield* submitCargo(action);
    yield history.push(`/app/pages/cargos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('cargo', error.data.message))
    }
  }

}

export function* createCargoSagaModal(action) {
  try {
    yield* submitCargo(action);
    yield put(uiActions.toggleModal())
    yield* listCargosSaga({'all' : true})
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('cargo', error.data.message))
    }
  }

}

function* submitCargo(action) {
  yield put(startSubmit('cargo'));
  yield baseURL.post('/cargo', action.payload);
  yield put(actions.createdCargoSuccess());
  yield put(stopSubmit('cargo'));
}

export function* listCargosSaga(action) {
  try {
    const url = action.all ? '/cargos?per_page=all' : '/cargos'
    const response = yield baseURL.get(url);
    const retorno = action.all ? response : response.data;
    yield put(actions.setCargos(retorno));
  } catch (error) {
    // yield put(actions.fetchCargosFailed());
    console.log(error);
  }
}

export function* removeCargoSaga(action) {
  try {
    const response = yield baseURL.delete(`/cargo/${action.id}`,);
    if (action.redirect) {
      yield history.push(`/app/pages/cargos/`)
    }
    yield put(actions.removeCargoSuccess(action.id));
  } catch (error) {
    // yield put(actions.fetchCargosFailed());
    console.log(error);
  }
}

export function* updateCargoSaga(action) {
  try {
    yield put(startSubmit('cargo'))
    const response = yield baseURL.put(`/cargo/${action.payload.id}`, action.payload);
    yield put(actions.updateCargoSuccess(response.data));
    yield history.push(`/app/pages/cargos/`)
  } catch (error) {
    if (error.data) {
      yield put(stopSubmit('cargo', error.data.message))
    }
  }
}

export function* fetchCargoSaga(action) {
  try {
    const response = yield baseURL.get(`/cargo/${action.id}`)
    yield put(actions.setCargo(response.data))
  } catch (error) {
    // yield put(actions.fetchCargosFailed());
    console.log(error);
  }
}

function fetchCargo(id) {
  try {
    return baseURL.get(`/cargo/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export function* handleCreateCargoSaga() {
  try {
    yield history.push(`/app/pages/cargos/cargo/`);
  } catch (error) {
    console.log(error);
  }
}

export function* paginateCargosSaga(action) {
  try {
    const response = yield baseURL.get(`/cargo/search?filter[cargo]=${action.payload.url}`);
    yield put(actions.setCargos(response.data.cargos));
  } catch (error) {
    // yield put(actions.fetchClientesFailed());
    console.log(error);
  }
}


export function* handleUpdateCargoSaga(action) {
  try {
    yield call(fetchCargo, action.id)
    yield history.push(`/app/pages/cargos/cargo/${action.id}`);
  } catch (error) {
    console.log(error);
  }
}


function* CargoRootSaga() {
  yield all([
    takeEvery(CREATE_CARGO, createCargoSaga),
    takeEvery(CREATE_CARGO_MODAL, createCargoSagaModal),
    takeLatest(LIST_CARGOS, listCargosSaga),
    takeLatest(PAGINATE_CARGOS, paginateCargosSaga),
    takeLatest(REMOVE_CARGO, removeCargoSaga),
    takeLatest(UPDATE_CARGO, updateCargoSaga),
    takeLatest(FETCH_CARGO, fetchCargoSaga),
    takeLatest(INIT_CREATE_CARGO, handleCreateCargoSaga),
    takeLatest(INIT_UPDATE_CARGO, handleUpdateCargoSaga),
  ]);
}


const cargoSagas = [
  fork(CargoRootSaga),
];

export default cargoSagas;
