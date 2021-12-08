import * as types from '../constants/atividadeConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createAtividade = values => ({
    type: types.CREATE_ATIVIDADE,
    payload: values
});

export const initCreateAtividade = () => ({
    type: types.INIT_CREATE_ATIVIDADE,
});

export const initUpdateAtividade = id => ({
    type: types.INIT_UPDATE_ATIVIDADE,
    id: id
});

export const updateAtividade = values => ({
    type: types.UPDATE_ATIVIDADE,
    payload: values
});

export const fetchAtividade = id => ({
    type: types.FETCH_ATIVIDADE,
    id: id
});

/* Load */
export const createdAtividadeSuccess = payload => ({
    type: types.CREATE_ATIVIDADE_SUCCESS,
    payload,
});

export const listAtividades = (all) => ({
    type: types.LIST_ATIVIDADES,
    all: all
});

export const setAtividades = data => ({
    type: types.SET_ATIVIDADES,
    payload: data
});

export const setAtividade = data => ({
    type: types.SET_ATIVIDADE,
    payload: data
});

export const paginateAtividades = (payload) => ({
    type: types.PAGINATE_ATIVIDADES,
    payload: payload
});

export const removeAtividade = (id, redirect = false) => ({
    type: types.REMOVE_ATIVIDADE,
    id: id,
    redirect: redirect
});

export const removeAtividadeSuccess = id => ({
    type: types.REMOVE_ATIVIDADE_SUCCESS,
    id: id
});

export const updateAtividadeSuccess = data => ({
    type: types.UPDATE_ATIVIDADE_SUCCESS,
    payload: data
});