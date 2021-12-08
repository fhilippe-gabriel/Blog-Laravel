import * as types from '../constants/equipamentoConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createEquipamento = values => ({
    type: types.CREATE_EQUIPAMENTO,
    payload: values
});

export const initCreateEquipamento = () => ({
    type: types.INIT_CREATE_EQUIPAMENTO,
});

export const initUpdateEquipamento = id => ({
    type: types.INIT_UPDATE_EQUIPAMENTO,
    id: id
});

export const updateEquipamento = values => ({
    type: types.UPDATE_EQUIPAMENTO,
    payload: values
});

export const fetchEquipamento = id => ({
    type: types.FETCH_EQUIPAMENTO,
    id: id
});

/* Load */
export const createdEquipamentoSuccess = payload => ({
    type: types.CREATE_EQUIPAMENTO_SUCCESS,
    payload,
});

export const listEquipamentos = (all) => ({
    type: types.LIST_EQUIPAMENTOS,
    all: all
});

export const paginateEquipamentos = (payload) => ({
    type: types.PAGINATE_EQUIPAMENTOS,
    payload: payload
});

export const setEquipamentos = data => ({
    type: types.SET_EQUIPAMENTOS,
    payload: data
});

export const setEquipamento = data => ({
    type: types.SET_EQUIPAMENTO,
    payload: data
});

export const removeEquipamento = (id, redirect = false) => ({
    type: types.REMOVE_EQUIPAMENTO,
    id: id,
    redirect: redirect
});

export const removeEquipamentoSuccess = id => ({
    type: types.REMOVE_EQUIPAMENTO_SUCCESS,
    id: id
});

export const updateEquipamentoSuccess = data => ({
    type: types.UPDATE_EQUIPAMENTO_SUCCESS,
    payload: data
});