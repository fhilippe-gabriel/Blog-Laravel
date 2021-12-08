import * as types from '../constants/jornadaConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createJornada = values => ({
    type: types.CREATE_JORNADA,
    payload: values
});

export const initCreateJornada = () => ({
    type: types.INIT_CREATE_JORNADA,
});

export const initUpdateJornada = id => ({
    type: types.INIT_UPDATE_JORNADA,
    id: id
});

export const updateJornada = values => ({
    type: types.UPDATE_JORNADA,
    payload: values
});

export const fetchJornada = id => ({
    type: types.FETCH_JORNADA,
    id: id
});

/* Load */
export const createdJornadaSuccess = payload => ({
    type: types.CREATE_JORNADA_SUCCESS,
    payload,
});

export const listJornadas = () => ({
    type: types.LIST_JORNADAS
});

export const setJornadas = data => ({
    type: types.SET_JORNADAS,
    payload: data
});

export const setJornada = data => ({
    type: types.SET_JORNADA,
    payload: data
});

export const removeJornada = (id, redirect = false) => ({
    type: types.REMOVE_JORNADA,
    id: id,
    redirect: redirect
});

export const removeJornadaSuccess = id => ({
    type: types.REMOVE_JORNADA_SUCCESS,
    id: id
});

export const updateJornadaSuccess = data => ({
    type: types.UPDATE_JORNADA_SUCCESS,
    payload: data
});