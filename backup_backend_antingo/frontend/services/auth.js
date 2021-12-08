import { shortURL } from './api';
import { CLIENT_ID, CLIENT_SECRET } from '@/app/config/client';

export const MakeLogout = () => localStorage.removeItem('userToken');

export const makeLogin = (email, password) => shortURL.post('/oauth/token', {
  grant_type: 'password',
  username: email,
  password,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET
})
  .then(response => response)
  .catch(error => {
    if (error) {
      console.log(error);
      console.log('Sua solicitação não foi aceita, verifique as informações e tente novamente.');
    }
  });
