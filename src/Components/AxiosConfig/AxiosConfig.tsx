import axios from 'axios';
//@ts-ignore
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://localhost:7100/api', 
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
