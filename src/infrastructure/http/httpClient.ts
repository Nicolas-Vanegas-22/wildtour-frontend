import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuración del cliente HTTP
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para agregar token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('wildtour-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para manejar errores
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('wildtour-token');
          localStorage.removeItem('wildtour-user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos HTTP
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload de archivos
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Error del servidor
      const message = error.response.data?.message || 'Error del servidor';
      const errorObj = new Error(message);
      (errorObj as any).status = error.response.status;
      (errorObj as any).data = error.response.data;
      return errorObj;
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error de configuración
      return new Error(error.message || 'Error desconocido');
    }
  }

  // Método para configurar el token manualmente
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Método para remover el token
  removeAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Instancia singleton
export const httpClient = new HttpClient();
export default httpClient;