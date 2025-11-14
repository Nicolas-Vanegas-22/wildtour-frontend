import { User } from '../../application/state/useAuthStore';
import { auditApi } from '../../compliance/services/auditApi';
import { sessionManager } from '../../compliance/utils/sessionManager';
import { api } from '../http/apiClient';
import {
  ApiResponse,
  BackendAuthResponse,
  BackendRegisterResponse,
  handleApiError
} from '../http/apiTypes';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roleId: number; // 1 = Usuario, 2 = Prestador de Servicio (según backend .NET)
  firstName?: string;
  lastName?: string;
  document?: string;
  phoneNumber?: string;
  businessName?: string; // For providers
  rnt?: string; // For providers - Registro Nacional de Turismo
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt?: string;
}

// Removed - now using types from apiTypes.ts

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ValidateDocumentRequest {
  document: string;
}

export interface ValidateDocumentResponse {
  isValid: boolean;
  message: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

class AuthApi {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const startTime = Date.now();
    let success = false;
    let userId: string | undefined;

    try {
      // Call .NET API using axios client
      const response = await api.post<ApiResponse<BackendAuthResponse>>(
        '/Auth/login',
        credentials
      );

      const backendData = response.data as any as BackendAuthResponse;

      if (!backendData || !backendData.token) {
        await this.logLoginAttempt(false, credentials.email, 'Invalid response from server');
        throw new Error('Respuesta inválida del servidor');
      }

      success = true;
      userId = backendData.user.id.toString();

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
        token: backendData.token,
        expiresAt: backendData.expiresAt,
        user: {
          id: backendData.user.id,
          email: backendData.user.email,
          username: backendData.user.username || '',
          registrationDate: new Date().toISOString(),
          lastLoginDate: new Date().toISOString(),
          isEmailConfirmed: false,
          isActive: true,
          personId: 0,
          role: backendData.user.roles.includes('Admin') ? 'admin' :
                backendData.user.roles.includes('Prestador de Servicio') ? 'provider' : 'tourist',
          avatar: '',
          person: {
            id: 0,
            firstName: backendData.user.firstName || '',
            lastName: backendData.user.lastName || '',
            document: 0,
            phoneNumber: 0
          }
        }
      };
    } catch (error: any) {
      console.error('Login error:', error);

      if (!success) {
        const errorMessage = handleApiError(error);
        await this.logLoginAttempt(false, credentials.email, errorMessage);
      }

      throw new Error(handleApiError(error));
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    let success = false;

    try {
      // Call .NET API - Note: Backend returns registered user info, not auth token
      const response = await api.post<ApiResponse<BackendRegisterResponse>>(
        '/Auth/register',
        userData
      );

      const registerData = response.data as any as BackendRegisterResponse;

      if (!registerData || !registerData.id) {
        await this.logRegistrationAttempt(false, userData, 'Invalid response from server');
        throw new Error('Respuesta inválida del servidor');
      }

      success = true;

      // Log del registro exitoso
      await this.logRegistrationAttempt(true, userData);

      // Note: .NET backend returns user info, not token. User needs to login after registration.
      // We'll auto-login by calling the login endpoint
      const loginResponse = await this.login({
        email: userData.email,
        password: userData.password,
      });

      return loginResponse;
    } catch (error: any) {
      console.error('Register error:', error);

      if (!success) {
        const errorMessage = handleApiError(error);
        await this.logRegistrationAttempt(false, userData, errorMessage);
      }

      throw new Error(handleApiError(error));
    }
  }

  async getProfile(_token: string): Promise<User> {
    try {
      const response = await api.get<ApiResponse<BackendAuthResponse['user']>>(
        '/Auth/me'
      );

      const backendUser = response.data as any as BackendAuthResponse['user'];

      // Transform to frontend User format
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        username: backendUser.username || '',
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
        isEmailConfirmed: false,
        isActive: true,
        personId: 0,
        role: backendUser.roles.includes('Admin') ? 'admin' :
              backendUser.roles.includes('Prestador de Servicio') ? 'provider' : 'tourist',
        avatar: '',
        person: {
          id: 0,
          firstName: backendUser.firstName || '',
          lastName: backendUser.lastName || '',
          document: 0,
          phoneNumber: 0
        }
      };

      // Log del acceso al perfil
      await this.logProfileAccess(user.id.toString(), 'accessed');

      return user;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(handleApiError(error));
    }
  }

  // TODO: Implement these endpoints in .NET backend
  async forgotPassword(_data: ForgotPasswordRequest): Promise<{ message: string }> {
    throw new Error('Endpoint /Auth/forgot-password no implementado en el backend .NET');
  }

  async resetPassword(_data: ResetPasswordRequest): Promise<{ message: string }> {
    throw new Error('Endpoint /Auth/reset-password no implementado en el backend .NET');
  }

  async refreshToken(_token: string): Promise<AuthResponse> {
    throw new Error('Endpoint /Auth/refresh no implementado en el backend .NET');
  }

  async logout(_token: string): Promise<void> {
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
        endpoint: '/Auth/logout',
        method: 'POST',
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '7 years',
        shouldAutoDelete: true,
        consentRequired: false,
      });

      // TODO: Implement /Auth/logout in .NET backend
      // For now, just end the session locally
      sessionManager.endSession();
    } catch (error) {
      console.error('Logout error:', error);
      // Finalizar sesión incluso si hay error
      sessionManager.endSession();
    }
  }

  async updateProfile(_token: string, _userData: Partial<User>): Promise<User> {
    throw new Error('Endpoint /Auth/profile PUT no implementado en el backend .NET');
  }

  async verifyEmail(_token: string): Promise<{ message: string }> {
    throw new Error('Endpoint /Auth/verify-email no implementado en el backend .NET');
  }

  async resendVerificationEmail(_email: string): Promise<{ message: string }> {
    throw new Error('Endpoint /Auth/resend-verification no implementado en el backend .NET');
  }

  async validateDocument(document: string): Promise<ValidateDocumentResponse> {
    try {
      const response = await api.post<ApiResponse<ValidateDocumentResponse>>(
        '/Auth/validate-document',
        { document }
      );

      return response.data as any as ValidateDocumentResponse;
    } catch (error: any) {
      console.error('Validate document error:', error);
      throw new Error(handleApiError(error));
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await api.get<ApiResponse<Role[]>>('/Auth/roles');
      return response.data as any as Role[];
    } catch (error: any) {
      console.error('Get roles error:', error);
      throw new Error(handleApiError(error));
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
        endpoint: '/Auth/login',
        method: 'POST',
        source: 'wildtour-frontend',
        environment: import.meta.env.MODE as 'production' | 'staging' | 'development',
        retentionPeriod: '7 years',
        shouldAutoDelete: true,
        consentRequired: false,
      });
    } catch (error) {
      // Silenciar errores de auditoría en desarrollo
      // console.debug('Failed to log login attempt:', error);
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
          roleId: userData.roleId,
          reason,
        },
        userEmail: userData.email,
        ipAddress: '',
        userAgent: navigator.userAgent,
        endpoint: '/Auth/register',
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
      // Silenciar errores de auditoría en desarrollo
      // console.debug('Failed to log registration attempt:', error);
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
        endpoint: '/Auth/profile',
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