import { User } from '../../application/state/useAuthStore';
import { auditApi } from '../../compliance/services/auditApi';
import { sessionManager } from '../../compliance/utils/sessionManager';

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
  role: 'user' | 'provider';
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
    const startTime = Date.now();
    let success = false;
    let userId: string | undefined;

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
        await this.logLoginAttempt(false, credentials.email, errorData.message);
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const backendResponse: BackendAuthResponse = await response.json();

      if (!backendResponse.success) {
        await this.logLoginAttempt(false, credentials.email, backendResponse.message);
        throw new Error(backendResponse.message || 'Error en el inicio de sesión');
      }

      success = true;
      userId = backendResponse.data.user.id.toString();

      // Crear nueva sesión
      sessionManager.renewSession();

      // Log del login exitoso
      await this.logLoginAttempt(true, credentials.email, undefined, {
        userId,
        sessionId: sessionManager.getSessionId(),
        loginDuration: Date.now() - startTime,
      });

      // Transformar la respuesta del backend al formato esperado por el frontend
      return {
        token: backendResponse.data.token,
        expiresAt: backendResponse.data.expiresAt,
        user: {
          id: userId,
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

      if (!success) {
        await this.logLoginAttempt(false, credentials.email, error instanceof Error ? error.message : 'Unknown error');
      }

      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    let success = false;

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
        await this.logRegistrationAttempt(false, userData, errorData.message);
        throw new Error(errorData.message || 'Error en el registro');
      }

      const backendResponse: BackendAuthResponse = await response.json();

      if (!backendResponse.success) {
        await this.logRegistrationAttempt(false, userData, backendResponse.message);
        throw new Error(backendResponse.message || 'Error en el registro');
      }

      success = true;

      // Log del registro exitoso
      await this.logRegistrationAttempt(true, userData);

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

      if (!success) {
        await this.logRegistrationAttempt(false, userData, error instanceof Error ? error.message : 'Unknown error');
      }

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

      const user = await response.json();

      // Log del acceso al perfil
      await this.logProfileAccess(user.id, 'accessed');

      return user;
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
      // Log de la sesión antes del logout
      const sessionInfo = sessionManager.getSessionInfo();

      await auditApi.logEvent({
        eventType: 'login_attempt',
        category: 'security',
        severity: 'low',
        description: 'User logout - session ended',
        details: {
          action: 'logout',
          sessionDuration: sessionInfo.duration,
          sessionId: sessionInfo.sessionId,
        },
        sessionId: sessionInfo.sessionId,
        ipAddress: '',
        userAgent: navigator.userAgent,
        endpoint: '/auth/logout',
        method: 'POST',
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '7 years',
        shouldAutoDelete: true,
        consentRequired: false,
      });

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Finalizar sesión
      sessionManager.endSession();
    } catch (error) {
      console.error('Logout error:', error);
      // Finalizar sesión incluso si hay error
      sessionManager.endSession();
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

      const updatedUser = await response.json();

      // Log de la actualización del perfil
      await this.logProfileAccess(updatedUser.id, 'updated');

      return updatedUser;
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

  private async logLoginAttempt(
    success: boolean,
    email?: string,
    reason?: string,
    details?: Record<string, any>
  ): Promise<void> {
    try {
      await auditApi.logEvent({
        eventType: 'login_attempt',
        category: 'security',
        severity: success ? 'low' : 'medium',
        description: `Login attempt ${success ? 'successful' : 'failed'}${email ? ` for ${email}` : ''}`,
        details: {
          success,
          email,
          reason,
          ...details,
        },
        userEmail: email,
        ipAddress: '',
        userAgent: navigator.userAgent,
        endpoint: '/auth/login',
        method: 'POST',
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '7 years',
        shouldAutoDelete: true,
        consentRequired: false,
      });
    } catch (error) {
      console.error('Failed to log login attempt:', error);
    }
  }

  private async logRegistrationAttempt(
    success: boolean,
    userData: RegisterRequest,
    reason?: string
  ): Promise<void> {
    try {
      await auditApi.logEvent({
        eventType: 'data_modification',
        category: 'privacy',
        severity: 'medium',
        description: `User registration ${success ? 'successful' : 'failed'}`,
        details: {
          success,
          email: userData.email,
          role: userData.role,
          reason,
        },
        userEmail: userData.email,
        ipAddress: '',
        userAgent: navigator.userAgent,
        endpoint: '/auth/register',
        method: 'POST',
        dataCategories: ['personal_data', 'contact_data'],
        dataFields: ['email', 'firstName', 'lastName', 'document', 'phoneNumber'],
        legalBasis: 'Article 6 Law 1581/2012 - Consent',
        consentRequired: true,
        consentStatus: success ? 'granted' : 'missing',
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '5 years',
        shouldAutoDelete: true,
      });
    } catch (error) {
      console.error('Failed to log registration attempt:', error);
    }
  }

  private async logProfileAccess(userId: string, action: string): Promise<void> {
    try {
      await auditApi.logEvent({
        eventType: 'data_access',
        category: 'privacy',
        severity: 'low',
        description: `Profile ${action}`,
        details: { action },
        userId,
        ipAddress: '',
        userAgent: navigator.userAgent,
        endpoint: '/auth/profile',
        method: action === 'update' ? 'PUT' : 'GET',
        dataCategories: ['personal_data'],
        dataFields: ['email', 'firstName', 'lastName', 'avatar'],
        legalBasis: 'Legitimate interest - Service provision',
        consentRequired: true,
        consentStatus: 'granted',
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '5 years',
        shouldAutoDelete: true,
      });
    } catch (error) {
      console.error('Failed to log profile access:', error);
    }
  }
}

export const authApi = new AuthApi();