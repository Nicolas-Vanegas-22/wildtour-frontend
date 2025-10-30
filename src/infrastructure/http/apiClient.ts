import axios from 'axios';
import { useAuthStore } from '../../application/state/useAuthStore';

// Backend .NET API URL (already includes /api in env variable)
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5116/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle .NET API response format and errors
api.interceptors.response.use(
  (response) => {
    // .NET API returns { success, message, data, errors }
    // Extract the data field for easier consumption
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return {
        ...response,
        data: response.data.data ?? response.data,
        _meta: {
          success: response.data.success,
          message: response.data.message,
          errors: response.data.errors,
        }
      };
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    // Enhanced error handling for .NET API format
    if (error.response?.data) {
      const errorData = error.response.data;

      // .NET API error format: { success: false, message, errors }
      if (!errorData.success && errorData.errors) {
        // errors puede ser un array o un objeto
        if (Array.isArray(errorData.errors)) {
          error.message = errorData.message || errorData.errors.join(', ');
        } else if (typeof errorData.errors === 'object') {
          // Si es un objeto, extraer todos los mensajes de error
          const errorMessages = Object.values(errorData.errors).flat().join(', ');
          error.message = errorData.message || errorMessages;
        } else {
          error.message = errorData.message || String(errorData.errors);
        }
      } else if (errorData.message) {
        error.message = errorData.message;
      }
    }

    return Promise.reject(error);
  }
);
