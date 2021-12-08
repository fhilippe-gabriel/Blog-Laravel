import * as types from '../constants/tipoRecursoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createTipoRecurso = values => ({
    type: types.CREATE_TIPORECURSO,
    payload: values
});

export const createTipoRecursoModal = values => ({
    type: types.CREATE_TIPORECURSO_MODAL,
    payload: values
});

export const initCreateTipoRecurso = () => ({
    type: types.INIT_CREATE_TIPORECURSO,
});

export const initUpdateTipoRecurso = id => ({
    type: types.INIT_UPDATE_TIPORECURSO,
    id: id
});

export const updateTipoRecurso = values => ({
    type: types.UPDATE_TIPORECURSO,
    payload: values
});

export const fetchTipoRecurso = id => ({
    type: types.FETCH_TIPORECURSO,
    id: id
});

/* Load */
export const createdTipoRecursoSuccess = payload => ({
    type: types.CREATE_TIPORECURSO_SUCCESS,
    payload,
});

export const listTipoRecursos = (all) => ({
    type: types.LIST_TIPORECURSOS,
    all: all
});

export const paginate = (payload) => ({
    type: types.PAGINATE_TIPORECURSOS,
    payload: payload
});

export const setTipoRecursos = data => ({
    type: types.SET_TIPORECURSOS,
    payload: data
});

export const setTipoRecurso = data => ({
    type: types.SET_TIPORECURSO,
    payload: data
});

export const removeTipoRecurso = (id, redirect = false) => ({
    type: types.REMOVE_TIPORECURSO,
    id: id,
    redirect: redirect
});

export const removeTipoRecursoSuccess = id => ({
    type: types.REMOVE_TIPORECURSO_SUCCESS,
    id: id
});

export const updateTipoRecursoSuccess = data => ({
    type: types.UPDATE_TIPORECURSO_SUCCESS,
    payload: data
});