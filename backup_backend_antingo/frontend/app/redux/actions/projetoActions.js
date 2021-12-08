import * as types from '../constants/projetoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createProjeto = values => ({
    type: types.CREATE_PROJETO,
    payload: values
});

export const initCreateProjeto = () => ({
    type: types.INIT_CREATE_PROJETO,
});
export const initUpdateProjeto = id => ({
    type: types.INIT_UPDATE_PROJETO,
    id: id
});

export const updateProjeto = values => ({
    type: types.UPDATE_PROJETO,
    payload: values
});

export const fetchProjeto = id => ({
    type: types.FETCH_PROJETO,
    id: id
});

/* Load */
export const createdProjetoSuccess = () => ({
    type: types.CREATE_PROJETO_SUCCESS
});

export const listProjetos = () => ({
    type: types.LIST_PROJETOS
});

export const paginateProjetos = (payload) => ({
    type: types.PAGINATE_PROJETOS,
    payload: payload
});

export const setProjetos = data => ({
    type: types.SET_PROJETOS,
    payload: data
});

export const setProjeto = data => ({
    type: types.SET_PROJETO,
    payload: data
});

export const removeProjeto = (id, redirect = false) => ({
    type: types.REMOVE_PROJETO,
    id: id,
    redirect: redirect
});

export const removeProjetoSuccess = id => ({
    type: types.REMOVE_PROJETO_SUCCESS,
    id: id
});

export const updateProjetoSuccess = data => ({
    type: types.UPDATE_PROJETO_SUCCESS,
    payload: data
});