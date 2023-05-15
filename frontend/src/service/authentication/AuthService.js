import axios from 'axios';
import { apiConfig } from '../../config';

const login = (payload) => axios.post(`${apiConfig.baseUrl}/api/users/login`, payload);
const register = (payload) => axios.post(`${apiConfig.baseUrl}/api/users/register`, payload);
const addUser = (payload) => axios.post(`${apiConfig.baseUrl}/api/admin/add-user`, payload);
const bulkAddUser = (payload) => axios.post(`${apiConfig.baseUrl}/api/admin/bulk-add-user`, payload);
const uploadDataset = (payload) => axios.post(`${apiConfig.baseUrl}/api/admin/upload-dataset`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
const clearDataset = (payload) => axios.post(`${apiConfig.baseUrl}/api/admin/clear-dataset`, payload);

export const authService = {
  login,
  register,
  addUser,
  bulkAddUser,
  uploadDataset,
  clearDataset
};
