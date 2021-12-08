import * as types from '../constants/tipoFaturamentoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createTipoFaturamento = values => ({
    type: types.CREATE_TIPO_FATURAMENTO,
    payload: values
});

export const initCreateTipoFaturamento = () => ({
    type: types.INIT_CREATE_TIPO_FATURAMENTO,
});

export const initUpdateTipoFaturamento = id => ({
    type: types.INIT_UPDATE_TIPO_FATURAMENTO,
    id: id
});

export const updateTipoFaturamento = values => ({
    type: types.UPDATE_TIPO_FATURAMENTO,
    payload: values
});

export const fetchTipoFaturamento = id => ({
    type: types.FETCH_TIPO_FATURAMENTO,
    id: id
});

/* Load */
export const createdTipoFaturamentoSuccess = payload => ({
    type: types.CREATE_TIPO_FATURAMENTO_SUCCESS,
    payload,
});

export const listTipoFaturamentos = (all) => ({
    type: types.LIST_TIPO_FATURAMENTOS,
    all: all
});

export const setTipoFaturamentos = data => ({
    type: types.SET_TIPO_FATURAMENTOS,
    payload: data
});

export const setTipoFaturamento = data => ({
    type: types.SET_TIPO_FATURAMENTO,
    payload: data
});

export const removeTipoFaturamento = (id, redirect = false) => ({
    type: types.REMOVE_TIPO_FATURAMENTO,
    id: id,
    redirect: redirect
});

export const removeTipoFaturamentoSuccess = id => ({
    type: types.REMOVE_TIPO_FATURAMENTO_SUCCESS,
    id: id
});

export const updateTipoFaturamentoSuccess = data => ({
    type: types.UPDATE_TIPO_FATURAMENTO_SUCCESS,
    payload: data
});