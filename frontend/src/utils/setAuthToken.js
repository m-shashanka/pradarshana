import axios from 'axios';

const setAuthToken = () => {
  axios.interceptors.request.use((request) => {
    const token = localStorage.getItem('accessToken');
    if (token && !request.url.includes('login') && !request.url.includes('register')) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });
};

export default setAuthToken;
