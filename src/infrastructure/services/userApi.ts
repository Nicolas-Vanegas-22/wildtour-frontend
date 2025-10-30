import { api } from '../http/apiClient';
import { ApiResponse, handleApiError } from '../http/apiTypes';
import { User } from '../../application/state/useAuthStore';

/**
 * User Profile API Service
 * Handles user profile operations including personal information (Person entity)
 */

export interface UpdatePersonRequest {
  firstName: string;
  lastName: string;
  document: number;
  phoneNumber: number;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  person?: UpdatePersonRequest;
}

export interface UpdateProfileResponse extends User {}

class UserApi {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/users/me');
      return response.data as any as User;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>('/users/me', data);
      return response.data as any as User;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update person information (personal data)
   */
  async updatePerson(data: UpdatePersonRequest): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>('/users/me/person', data);
      return response.data as any as User;
    } catch (error: any) {
      console.error('Error updating person info:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload profile avatar
   * Max file size: 5MB
   * Allowed formats: jpg, jpeg, png, webp
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      // Validar tamaño del archivo (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB.');
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Formato de archivo no permitido. Usa JPG, PNG o WEBP.');
      }

      const formData = new FormData();
      formData.append('file', file); // Backend espera 'file' no 'avatar'

      const response = await api.post<ApiResponse<{ avatarUrl: string }>>(
        '/users/me/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data as any as { avatarUrl: string };
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    try {
      await api.delete('/users/me');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      throw new Error(handleApiError(error));
    }
  }
}

export const userApi = new UserApi();
