import * as types from '../constants/tarifaPrecoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createTarifaPreco = values => ({
    type: types.CREATE_TARIFA_PRECO,
    payload: values
});

export const initCreateTarifaPreco = () => ({
    type: types.INIT_CREATE_TARIFA_PRECO,
});

export const initUpdateTarifaPreco = id => ({
    type: types.INIT_UPDATE_TARIFA_PRECO,
    id: id
});

export const updateTarifaPreco = values => ({
    type: types.UPDATE_TARIFA_PRECO,
    payload: values
});

export const fetchTarifaPreco = id => ({
    type: types.FETCH_TARIFA_PRECO,
    id: id
});

/* Load */
export const createdTarifaPrecoSuccess = payload => ({
    type: types.CREATE_TARIFA_PRECO_SUCCESS,
    payload,
});

export const listTarifaPrecos = (url) => ({
    type: types.LIST_TARIFA_PRECOS,
    payload: url
});

export const setTarifaPrecos = data => ({
    type: types.SET_TARIFA_PRECOS,
    payload: data
});

export const setTarifaPreco = data => ({
    type: types.SET_TARIFA_PRECO,
    payload: data
});

export const removeTarifaPreco = (id, redirect = false) => ({
    type: types.REMOVE_TARIFA_PRECO,
    id: id,
    redirect: redirect
});

export const removeTarifaPrecoSuccess = id => ({
    type: types.REMOVE_TARIFA_PRECO_SUCCESS,
    id: id
});

export const updateTarifaPrecoSuccess = data => ({
    type: types.UPDATE_TARIFA_PRECO_SUCCESS,
    payload: data
});