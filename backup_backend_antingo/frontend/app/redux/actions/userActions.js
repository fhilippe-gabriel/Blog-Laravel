import * as types from '../constants/userConstants';

//= ====================================
//  CRUD
//-------------------------------------

export const createUser = values => ({
    type: types.CREATE_USER,
    payload: values
});

export const initCreateUser = () => ({
    type: types.INIT_CREATE_USER,
});

export const initUpdateUser = id => ({
    type: types.INIT_UPDATE_USER,
    id: id
});

export const updateUser = values => ({
    type: types.UPDATE_USER,
    payload: values
});

export const fetchUser = id => ({
    type: types.FETCH_USER,
    id: id
});

/* Load */
export const createdUserSuccess = payload => ({
    type: types.CREATE_USER_SUCCESS,
    payload,
});

export const listUsers = () => ({
    type: types.LIST_USERS
});

export const setUsers = data => ({
    type: types.SET_USERS,
    payload: data
});

export const setUser = data => ({
    type: types.SET_USER,
    payload: data
});

export const removeUser = (id, redirect = false) => ({
    type: types.REMOVE_USER,
    id: id,
    redirect: redirect
});

export const removeUserSuccess = id => ({
    type: types.REMOVE_USER_SUCCESS,
    id: id
});

export const updateUserSuccess = data => ({
    type: types.UPDATE_USER_SUCCESS,
    payload: data
});