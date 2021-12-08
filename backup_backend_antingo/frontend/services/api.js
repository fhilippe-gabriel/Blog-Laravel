/* eslint-disable no-param-reassign */
import axios from 'axios';
import { endpoint } from '@/app/config/client';

/* Desenvolvido por Luiz Jr (lj@luizjr.dev)
** Desenvolvido em:         29/12/2019
** Genymotion:              http://10.0.3.2:3333/
** Emulador Android Studio: http://10.0.2.2:3333/
** Simulador IOS:           http://localhost:3333/
*/

const baseURL = axios.create({
  baseURL: `${endpoint}/v1`, // Ambiente Produção
});

const shortURL = axios.create({
  baseURL: endpoint, // Ambiente Produção
});

baseURL.interceptors.request.use(async config => {
  // Envia o token em todas as requisições
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseURL.interceptors.response.use(async response => response, error => {
  if (error.response.status === 401) {
    // place your reentry code
    console.log('Token inválido, favor se autentique novamente.');
    window.location.href = '/login';
  }
  return Promise.reject(error.response);
});

export {
  baseURL,
  shortURL
};
export default baseURL;
