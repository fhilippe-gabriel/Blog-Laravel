import * as types from '../constants/clienteConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createCliente = values => ({
    type: types.CREATE_CLIENTE,
    payload: values
});

export const initCreateCliente = () => ({
    type: types.INIT_CREATE_CLIENTE,
});

export const initUpdateCliente = id => ({
    type: types.INIT_UPDATE_CLIENTE,
    id: id
});

export const updateCliente = (values, id) => ({
    type: types.UPDATE_CLIENTE,
    payload: values,
    id: id
});

export const fetchCliente = id => ({
    type: types.FETCH_CLIENTE,
    id: id
});

/* Load */
export const createdClienteSuccess = payload => ({
    type: types.CREATE_CLIENTE_SUCCESS,
    payload,
});

export const listClientes = () => ({
    type: types.LIST_CLIENTES
});

export const paginateClientes = (payload) => ({
    type: types.PAGINATE_CLIENTES,
    payload: payload
});

export const setClientes = data => ({
    type: types.SET_CLIENTES,
    payload: data
});

export const setCliente = data => ({
    type: types.SET_CLIENTE,
    payload: data
});

export const removeCliente = (id, redirect = false) => ({
    type: types.REMOVE_CLIENTE,
    id: id,
    redirect: redirect
});

export const removeClienteSuccess = id => ({
    type: types.REMOVE_CLIENTE_SUCCESS,
    id: id
});

export const updateClienteSuccess = data => ({
    type: types.UPDATE_CLIENTE_SUCCESS,
    payload: data
});