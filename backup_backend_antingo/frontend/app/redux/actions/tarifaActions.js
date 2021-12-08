import * as types from '../constants/tarifaConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createTarifa = values => ({
    type: types.CREATE_TARIFA,
    payload: values
});

export const createTarifaModal = values => ({
    type: types.CREATE_TARIFA_MODAL,
    payload: values
});

export const initCreateTarifa = () => ({
    type: types.INIT_CREATE_TARIFA,
});

export const initUpdateTarifa = id => ({
    type: types.INIT_UPDATE_TARIFA,
    id: id
});

export const updateTarifa = values => ({
    type: types.UPDATE_TARIFA,
    payload: values
});

export const fetchTarifa = id => ({
    type: types.FETCH_TARIFA,
    id: id
});

/* Load */
export const createdTarifaSuccess = payload => ({
    type: types.CREATE_TARIFA_SUCCESS,
    payload,
});

export const listTarifas = (all) => ({
    type: types.LIST_TARIFAS,
    all: all
});

export const paginateTarifas = (payload) => ({
    type: types.PAGINATE_TARIFAS,
    payload: payload
});

export const setTarifas = data => ({
    type: types.SET_TARIFAS,
    payload: data
});

export const setTarifa = data => ({
    type: types.SET_TARIFA,
    payload: data
});

export const removeTarifa = (id, redirect = false) => ({
    type: types.REMOVE_TARIFA,
    id: id,
    redirect: redirect
});

export const removeTarifaSuccess = id => ({
    type: types.REMOVE_TARIFA_SUCCESS,
    id: id
});

export const updateTarifaSuccess = data => ({
    type: types.UPDATE_TARIFA_SUCCESS,
    payload: data
});