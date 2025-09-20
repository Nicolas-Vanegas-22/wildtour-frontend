import axios from 'axios';
import { useAuthStore } from '../../application/state/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5199';

export const api = axios.create({ baseURL: BASE_URL + '/api' });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);
