import client from './client.js';

export const fetchMembers = (params) => client.get('/api/members', { params }).then(r => r.data);
export const fetchMember = (id) => client.get(`/api/members/${id}`).then(r => r.data);
export const createMember = (data) => client.post('/api/members', data).then(r => r.data);
export const updateMember = (id, data) => client.put(`/api/members/${id}`, data).then(r => r.data);
export const deleteMember = (id) => client.delete(`/api/members/${id}`).then(r => r.data);

export const fetchTracks = () => client.get('/api/tracks').then(r => r.data);
export const fetchRoles = () => client.get('/api/roles').then(r => r.data);
