import * as types from '../constants/funcionarioConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createFuncionario = values => ({
    type: types.CREATE_FUNCIONARIO,
    payload: values
});

export const initCreateFuncionario = () => ({
    type: types.INIT_CREATE_FUNCIONARIO,
});

export const initUpdateFuncionario = id => ({
    type: types.INIT_UPDATE_FUNCIONARIO,
    id: id
});

export const updateFuncionario = values => ({
    type: types.UPDATE_FUNCIONARIO,
    payload: values
});

export const fetchFuncionario = id => ({
    type: types.FETCH_FUNCIONARIO,
    id: id
});

/* Load */
export const createdFuncionarioSuccess = payload => ({
    type: types.CREATE_FUNCIONARIO_SUCCESS,
    payload,
});

export const listFuncionarios = (all) => ({
    type: types.LIST_FUNCIONARIOS,
    all: all
});

export const paginateFuncionarios = (payload) => ({
    type: types.PAGINATE_FUNCIONARIOS,
    payload: payload
});

export const setFuncionarios = data => ({
    type: types.SET_FUNCIONARIOS,
    payload: data
});

export const setFuncionario = data => ({
    type: types.SET_FUNCIONARIO,
    payload: data
});

export const removeFuncionario = (id, redirect = false) => ({
    type: types.REMOVE_FUNCIONARIO,
    id: id,
    redirect: redirect
});

export const removeFuncionarioSuccess = id => ({
    type: types.REMOVE_FUNCIONARIO_SUCCESS,
    id: id
});

export const updateFuncionarioSuccess = data => ({
    type: types.UPDATE_FUNCIONARIO_SUCCESS,
    payload: data
});