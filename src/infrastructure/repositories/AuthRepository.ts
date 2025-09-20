import httpClient, { ApiResponse } from '../http/httpClient';
import { User } from '../../application/state/useAuthStore';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  person: {
    firstName: string;
    lastName: string;
    document: number;
    phoneNumber: number;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: File;
}

class AuthRepository {
  // Iniciar sesión
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', credentials);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al iniciar sesión');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Registrar usuario
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await httpClient.post<RegisterResponse>('/User', userData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al registrar usuario');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // No lanzar error aquí, permitir logout local
    }
  }

  // Verificar token
  async verifyToken(): Promise<User> {
    try {
      const response = await httpClient.get<User>('/auth/me');

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Token inválido');
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  // Refrescar token
  async refreshToken(): Promise<{ token: string; user: User }> {
    try {
      const response = await httpClient.post<{ token: string; user: User }>('/auth/refresh');

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Error al refrescar token');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Solicitar recuperación de contraseña
  async forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>('/auth/forgot-password', request);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al solicitar recuperación de contraseña');
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Restablecer contraseña
  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>('/auth/reset-password', request);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al restablecer contraseña');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(request: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await httpClient.put<{ message: string }>('/auth/change-password', request);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al cambiar contraseña');
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Actualizar perfil
  async updateProfile(request: UpdateProfileRequest): Promise<User> {
    try {
      let response: ApiResponse<User>;

      if (request.avatar) {
        // Si hay archivo, usar FormData
        const formData = new FormData();
        formData.append('firstName', request.firstName || '');
        formData.append('lastName', request.lastName || '');
        formData.append('phone', request.phone || '');
        formData.append('avatar', request.avatar);

        response = await httpClient.upload<User>('/auth/profile', formData);
      } else {
        // Solo datos JSON
        const { avatar, ...profileData } = request;
        response = await httpClient.put<User>('/auth/profile', profileData);
      }

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al actualizar perfil');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Verificar email
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>(`/auth/verify-email/${token}`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al verificar email');
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Reenviar verificación de email
  async resendVerificationEmail(): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>('/auth/resend-verification');

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al reenviar verificación');
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Obtener perfil actual
  async getProfile(): Promise<User> {
    try {
      const response = await httpClient.get<User>('/auth/profile');

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Error al obtener perfil');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Eliminar cuenta
  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await httpClient.delete<{ message: string }>('/auth/account', {
        data: { password }
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al eliminar cuenta');
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

// Instancia singleton
export const authRepository = new AuthRepository();
export default authRepository;