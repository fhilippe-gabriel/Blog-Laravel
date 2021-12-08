import * as types from '../constants/authConstants';

//= ====================================
//  EMAIL AUTH
//-------------------------------------

export const loginWithEmail = (email, password) => ({
  type: types.LOGIN_WITH_EMAIL_REQUEST,
  email,
  password
});

export const loginWithEmailSuccess = user => ({
  type: types.LOGIN_WITH_EMAIL_SUCCESS,
  user
});

export const loginWithEmailFailure = error => ({
  type: types.LOGIN_WITH_EMAIL_FAILURE,
  error
});

export const passwordForget = (email) => ({
  type: types.PASSWORD_FORGET_REQUEST,
  email
});

export const passwordForgetSuccess = credential => ({ // eslint-disable-line
  type: types.PASSWORD_FORGET_SUCCESS
});

export const passwordForgetFailure = error => ({
  type: types.PASSWORD_FORGET_FAILURE,
  error
});

export const createUserSuccess = key => ({
  type: types.CREATE_USER_SUCCESS,
  key
});

export const createUserFailure = error => ({
  type: types.CREATE_USER_FAILURE,
  error
});

export const logout = () => ({
  type: types.LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
  type: types.LOGOUT_SUCCESS
});

export const logoutFailure = error => ({
  type: types.LOGOUT_FAILURE,
  error
});

export const syncUser = () => ({
  type: types.SYNC_USER
});

export const closeMsgAction = () => ({
  type: types.HIDE_MSG
});
