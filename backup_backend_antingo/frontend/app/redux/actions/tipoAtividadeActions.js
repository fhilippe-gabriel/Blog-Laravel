import * as types from '../constants/tipoAtividadeConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createTipoAtividade = values => ({
    type: types.CREATE_TIPOATIVIDADE,
    payload: values
});

export const initCreateTipoAtividade = () => ({
    type: types.INIT_CREATE_TIPOATIVIDADE,
});

export const initUpdateTipoAtividade = id => ({
    type: types.INIT_UPDATE_TIPOATIVIDADE,
    id: id
});

export const updateTipoAtividade = values => ({
    type: types.UPDATE_TIPOATIVIDADE,
    payload: values
});

export const fetchTipoAtividade = id => ({
    type: types.FETCH_TIPOATIVIDADE,
    id: id
});

/* Load */
export const createdTipoAtividadeSuccess = payload => ({
    type: types.CREATE_TIPOATIVIDADE_SUCCESS,
    payload,
});

export const listTipoAtividades = () => ({
    type: types.LIST_TIPOATIVIDADES
});

export const paginate = (payload) => ({
    type: types.PAGINATE_TIPOATIVIDADES,
    payload: payload
});

export const setTipoAtividades = data => ({
    type: types.SET_TIPOATIVIDADES,
    payload: data
});

export const setTipoAtividade = data => ({
    type: types.SET_TIPOATIVIDADE,
    payload: data
});

export const removeTipoAtividade = (id, redirect = false) => ({
    type: types.REMOVE_TIPOATIVIDADE,
    id: id,
    redirect: redirect
});

export const removeTipoAtividadeSuccess = id => ({
    type: types.REMOVE_TIPOATIVIDADE_SUCCESS,
    id: id
});

export const updateTipoAtividadeSuccess = data => ({
    type: types.UPDATE_TIPOATIVIDADE_SUCCESS,
    payload: data
});