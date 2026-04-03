import client from './client.js';

export const fetchCurrentUser = () => client.get('/auth/me').then(r => r.data);
export const logout = () => client.post('/auth/logout');
