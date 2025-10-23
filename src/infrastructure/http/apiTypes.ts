// Tipos para las respuestas del backend .NET

/**
 * Formato estándar de respuesta de la API .NET
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors: string[];
}

/**
 * Códigos de error del backend .NET
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Mapeo de códigos de error a mensajes en español
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'Error de validación en los datos proporcionados',
  [ErrorCode.INVALID_CREDENTIALS]: 'Credenciales inválidas',
  [ErrorCode.INVALID_TOKEN]: 'Token de autenticación inválido o expirado',
  [ErrorCode.ACCOUNT_DISABLED]: 'Cuenta deshabilitada',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Recurso no encontrado',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'El email ya está registrado',
  [ErrorCode.DUPLICATE_RESOURCE]: 'El recurso ya existe',
  [ErrorCode.INTERNAL_ERROR]: 'Error interno del servidor',
};

/**
 * Usuario devuelto por el backend .NET
 */
export interface BackendUser {
  id: number;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
  permissions: string[];
}

/**
 * Respuesta de autenticación del backend .NET
 */
export interface BackendAuthResponse {
  token: string;
  expiresAt: string;
  user: BackendUser;
}

/**
 * Respuesta de registro del backend .NET
 */
export interface BackendRegisterResponse {
  id: number;
  username: string;
  email: string;
  registrationDate: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
}

/**
 * Destino devuelto por el backend .NET
 */
export interface BackendDestination {
  id: number;
  name: string | null;
  description: string | null;
  country: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  isActive: boolean;
}

/**
 * Actividad devuelta por el backend .NET
 */
export interface BackendActivity {
  id: number;
  name: string | null;
  description: string | null;
  category: string | null;
  price: number;
  durationHours: string; // TimeSpan como string "HH:mm:ss"
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  isActive: boolean;
}

/**
 * Opciones de paginación para peticiones
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Respuesta paginada del backend .NET
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Helper para extraer datos de ApiResponse
 */
export function extractData<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    const errorMessage = response.message || formatErrors(response.errors) || 'Error desconocido';
    throw new Error(errorMessage);
  }
  if (response.data === undefined) {
    throw new Error('No data in response');
  }
  return response.data;
}

/**
 * Helper para formatear errores que pueden venir como array u objeto
 */
function formatErrors(errors: any): string {
  if (!errors) return '';

  // Si es un array
  if (Array.isArray(errors)) {
    return errors.join(', ');
  }

  // Si es un objeto (ej: { email: ["error1", "error2"], password: ["error3"] })
  if (typeof errors === 'object') {
    const errorMessages: string[] = [];
    for (const key in errors) {
      const value = errors[key];
      if (Array.isArray(value)) {
        errorMessages.push(...value);
      } else if (typeof value === 'string') {
        errorMessages.push(value);
      }
    }
    return errorMessages.join(', ');
  }

  // Si es un string
  if (typeof errors === 'string') {
    return errors;
  }

  return '';
}

/**
 * Helper para manejar errores de la API
 */
export function handleApiError(error: any): string {
  if (error.response?.data) {
    const apiResponse = error.response.data as ApiResponse;
    if (!apiResponse.success) {
      return apiResponse.message || formatErrors(apiResponse.errors) || 'Error desconocido';
    }
  }
  return error.message || 'Error de conexión con el servidor';
}
