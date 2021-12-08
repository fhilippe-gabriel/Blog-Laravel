import * as types from '../constants/exameConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createExame = values => ({
    type: types.CREATE_EXAME,
    payload: values
});

export const createExameModal = values => ({
    type: types.CREATE_EXAME_MODAL,
    payload: values
});

export const initCreateExame = () => ({
    type: types.INIT_CREATE_EXAME,
});

export const initUpdateExame = id => ({
    type: types.INIT_UPDATE_EXAME,
    id: id
});

export const updateExame = values => ({
    type: types.UPDATE_EXAME,
    payload: values
});

export const fetchExame = id => ({
    type: types.FETCH_EXAME,
    id: id
});

/* Load */
export const createdExameSuccess = payload => ({
    type: types.CREATE_EXAME_SUCCESS,
    payload,
});

export const listExames = (all) => ({
    type: types.LIST_EXAMES,
    all: all
});

export const paginate = (payload) => ({
    type: types.PAGINATE_EXAMES,
    payload: payload
});

export const setExames = data => ({
    type: types.SET_EXAMES,
    payload: data
});

export const setExame = data => ({
    type: types.SET_EXAME,
    payload: data
});

export const removeExame = (id, redirect = false) => ({
    type: types.REMOVE_EXAME,
    id: id,
    redirect: redirect
});

export const removeExameSuccess = id => ({
    type: types.REMOVE_EXAME_SUCCESS,
    id: id
});

export const updateExameSuccess = data => ({
    type: types.UPDATE_EXAME_SUCCESS,
    payload: data
});