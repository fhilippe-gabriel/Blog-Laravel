import * as types from '../constants/pontoMarcacaoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createPontoMarcacao = values => ({
    type: types.CREATE_PONTO_MARCACAO,
    payload: values
});

export const createPontoMarcacaoModal = values => ({
    type: types.CREATE_PONTO_MARCACAO_MODAL,
    payload: values
});

export const initCreatePontoMarcacao = () => ({
    type: types.INIT_CREATE_PONTO_MARCACAO,
});

export const initUpdatePontoMarcacao = id => ({
    type: types.INIT_UPDATE_PONTO_MARCACAO,
    id: id
});

export const updatePontoMarcacao = values => ({
    type: types.UPDATE_PONTO_MARCACAO,
    payload: values
});

export const fetchPontoMarcacao = id => ({
    type: types.FETCH_PONTO_MARCACAO,
    id: id
});

/* Load */
export const createdPontoMarcacaoSuccess = payload => ({
    type: types.CREATE_PONTO_MARCACAO_SUCCESS,
    payload,
});

export const uploadPontoMarcacao = values => ({
    type: types.UPLOAD_PONTO_MARCACAO,
    payload: values,
});

export const listPontosMarcacoes = (all) => ({
    type: types.LIST_PONTOS_MARCACOES,
    all: all
});

export const paginate = (payload) => ({
    type: types.PAGINATE_PONTOS_MARCACOES,
    payload: payload
});

export const listPontoMarcacaoSituacoes = () => ({
    type: types.LIST_PONTO_MARCACAO_SITUACOES,
});

export const setPontoMarcacaoSituacoes = payload => ({
    type: types.SET_PONTO_MARCACAO_SITUACOES,
    payload
});

export const setPontosMarcacoes = data => ({
    type: types.SET_PONTOS_MARCACOES,
    payload: data
});

export const setPontoMarcacao = data => ({
    type: types.SET_PONTO_MARCACAO,
    payload: data
});

export const removePontoMarcacao = (id, redirect = false) => ({
    type: types.REMOVE_PONTO_MARCACAO,
    id: id,
    redirect: redirect
});

export const removePontoMarcacaoSuccess = id => ({
    type: types.REMOVE_PONTO_MARCACAO_SUCCESS,
    id: id
});

export const updatePontoMarcacaoSuccess = data => ({
    type: types.UPDATE_PONTO_MARCACAO_SUCCESS,
    payload: data
});