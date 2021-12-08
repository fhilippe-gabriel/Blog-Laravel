export const endpoint = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development'
  ? process.env.VIRTUAL_HOST
  : 'https://api.dev.sgo.tecnoplace.com.br';

export const CLIENT_ID = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development'
  ? process.env.CLIENT_ID
  : 1;

export const CLIENT_SECRET = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development'
  ? process.env.CLIENT_SECRET
  : 'b89f58iIL45t8ftsaqGQUXm3LLFP4xO75FbSc9Dc';
