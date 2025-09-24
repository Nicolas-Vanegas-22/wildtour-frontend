import { User } from '../../application/state/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  person: {
    firstName: string;
    lastName: string;
    document: number;
    phoneNumber: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt?: string;
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresAt: string;
    user: {
      id: number;
      email: string;
      username: string | null;
      firstName: string | null;
      lastName: string | null;
      roles: string[];
      permissions: string[];
    };
  };
  errors: any[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

class AuthApi {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const backendResponse: BackendAuthResponse = await response.json();

      if (!backendResponse.success) {
        throw new Error(backendResponse.message || 'Error en el inicio de sesión');
      }

      // Transformar la respuesta del backend al formato esperado por el frontend
      return {
        token: backendResponse.data.token,
        expiresAt: backendResponse.data.expiresAt,
        user: {
          id: backendResponse.data.user.id.toString(),
          email: backendResponse.data.user.email,
          username: backendResponse.data.user.username || '',
          firstName: backendResponse.data.user.firstName || '',
          lastName: backendResponse.data.user.lastName || '',
          role: backendResponse.data.user.roles.includes('Admin') ? 'admin' :
                backendResponse.data.user.roles.includes('Provider') ? 'provider' : 'user',
          avatar: '',
          person: {
            firstName: backendResponse.data.user.firstName || '',
            lastName: backendResponse.data.user.lastName || '',
            document: 0,
            phoneNumber: 0
          }
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const backendResponse: BackendAuthResponse = await response.json();

      if (!backendResponse.success) {
        throw new Error(backendResponse.message || 'Error en el registro');
      }

      // Transformar la respuesta del backend al formato esperado por el frontend
      return {
        token: backendResponse.data.token,
        expiresAt: backendResponse.data.expiresAt,
        user: {
          id: backendResponse.data.user.id.toString(),
          email: backendResponse.data.user.email,
          username: backendResponse.data.user.username || '',
          firstName: backendResponse.data.user.firstName || '',
          lastName: backendResponse.data.user.lastName || '',
          role: backendResponse.data.user.roles.includes('Admin') ? 'admin' :
                backendResponse.data.user.roles.includes('Provider') ? 'provider' : 'user',
          avatar: '',
          person: {
            firstName: backendResponse.data.user.firstName || '',
            lastName: backendResponse.data.user.lastName || '',
            document: 0,
            phoneNumber: 0
          }
        }
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async getProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error obteniendo perfil de usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error enviando email de recuperación');
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error restableciendo contraseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error renovando token');
      }

      return await response.json();
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      // No lanzamos error aquí porque el logout debería funcionar incluso si falla la petición
    }
  }

  async updateProfile(token: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error actualizando perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error verificando email');
      }

      return await response.json();
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error reenviando email de verificación');
      }

      return await response.json();
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }
}

export const authApi = new AuthApi();