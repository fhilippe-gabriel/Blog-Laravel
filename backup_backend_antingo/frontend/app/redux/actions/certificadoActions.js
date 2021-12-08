import * as types from '../constants/certificadoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createCertificado = values => ({
    type: types.CREATE_CERTIFICADO,
    payload: values
});

export const createCertificadoModal = values => ({
    type: types.CREATE_CERTIFICADO_MODAL,
    payload: values
});

export const initCreateCertificado = () => ({
    type: types.INIT_CREATE_CERTIFICADO,
});

export const initUpdateCertificado = id => ({
    type: types.INIT_UPDATE_CERTIFICADO,
    id: id
});

export const updateCertificado = values => ({
    type: types.UPDATE_CERTIFICADO,
    payload: values
});

export const fetchCertificado = id => ({
    type: types.FETCH_CERTIFICADO,
    id: id
});

/* Load */
export const createdCertificadoSuccess = payload => ({
    type: types.CREATE_CERTIFICADO_SUCCESS,
    payload,
});

export const listCertificados = (all) => ({
    type: types.LIST_CERTIFICADOS,
    all: all
});

export const paginate = (payload) => ({
    type: types.PAGINATE_CERTIFICADOS,
    payload: payload
});

export const listCertificadoSituacoes = () => ({
    type: types.LIST_CERTIFICADO_SITUACOES,
});

export const setCertificadoSituacoes = payload => ({
    type: types.SET_CERTIFICADO_SITUACOES,
    payload
});

export const setCertificados = data => ({
    type: types.SET_CERTIFICADOS,
    payload: data
});

export const setCertificado = data => ({
    type: types.SET_CERTIFICADO,
    payload: data
});

export const removeCertificado = (id, redirect = false) => ({
    type: types.REMOVE_CERTIFICADO,
    id: id,
    redirect: redirect
});

export const removeCertificadoSuccess = id => ({
    type: types.REMOVE_CERTIFICADO_SUCCESS,
    id: id
});

export const updateCertificadoSuccess = data => ({
    type: types.UPDATE_CERTIFICADO_SUCCESS,
    payload: data
});