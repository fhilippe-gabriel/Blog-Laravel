import * as types from '../constants/cargoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createCargo = values => ({
    type: types.CREATE_CARGO,
    payload: values
});

export const createCargoModal = values => ({
    type: types.CREATE_CARGO_MODAL,
    payload: values
});

export const initCreateCargo = () => ({
    type: types.INIT_CREATE_CARGO,
});

export const initUpdateCargo = id => ({
    type: types.INIT_UPDATE_CARGO,
    id: id
});

export const updateCargo = values => ({
    type: types.UPDATE_CARGO,
    payload: values
});

export const fetchCargo = id => ({
    type: types.FETCH_CARGO,
    id: id
});

/* Load */
export const createdCargoSuccess = payload => ({
    type: types.CREATE_CARGO_SUCCESS,
    payload,
});

export const listCargos = (all) => ({
    type: types.LIST_CARGOS,
    all: all
});

export const paginate = (payload) => ({
    type: types.PAGINATE_CARGOS,
    payload: payload
});

export const setCargos = data => ({
    type: types.SET_CARGOS,
    payload: data
});

export const setCargo = data => ({
    type: types.SET_CARGO,
    payload: data
});

export const removeCargo = (id, redirect = false) => ({
    type: types.REMOVE_CARGO,
    id: id,
    redirect: redirect
});

export const removeCargoSuccess = id => ({
    type: types.REMOVE_CARGO_SUCCESS,
    id: id
});

export const updateCargoSuccess = data => ({
    type: types.UPDATE_CARGO_SUCCESS,
    payload: data
});