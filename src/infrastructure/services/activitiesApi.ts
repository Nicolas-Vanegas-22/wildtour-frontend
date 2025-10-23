import { api } from '../http/apiClient';
import {
  ApiResponse,
  BackendActivity,
  PaginatedResponse,
  PaginationParams,
  handleApiError
} from '../http/apiTypes';
import { Activity } from '../../domain/models/Destination';

/**
 * Service for Activities API
 * Connects to .NET backend endpoints
 *
 * TODO: Backend .NET needs to implement these endpoints:
 * - GET /api/activities
 * - GET /api/activities/:id
 * - POST /api/activities (Admin/Provider only)
 * - PUT /api/activities/:id (Admin/Provider only)
 * - DELETE /api/activities/:id (Admin only)
 */

interface ActivityFilters {
  category?: string[];
  difficulty?: string[];
  priceMin?: number;
  priceMax?: number;
  destinationId?: string;
}

class ActivitiesApi {
  /**
   * Get all activities with optional filters and pagination
   */
  async getActivities(
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<{ activities: Activity[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();

      // Pagination
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.pageSize) params.append('pageSize', pagination.pageSize.toString());
      if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);

      // Filters
      if (filters?.category) params.append('category', filters.category.join(','));
      if (filters?.difficulty) params.append('difficulty', filters.difficulty.join(','));
      if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
      if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
      if (filters?.destinationId) params.append('destinationId', filters.destinationId);

      const response = await api.get<ApiResponse<PaginatedResponse<BackendActivity>>>(
        `/activities?${params.toString()}`
      );

      const data = response.data as any as PaginatedResponse<BackendActivity>;

      // Transform backend activities to frontend format
      const activities = data.items.map(this.transformActivity);

      return {
        activities,
        total: data.totalCount,
        hasMore: data.hasNextPage,
      };
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a single activity by ID
   */
  async getActivity(id: string): Promise<Activity> {
    try {
      const response = await api.get<ApiResponse<BackendActivity>>(
        `/activities/${id}`
      );

      const backendActivity = response.data as any as BackendActivity;
      return this.transformActivity(backendActivity);
    } catch (error: any) {
      console.error('Error fetching activity:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new activity (Provider/Admin only)
   */
  async createActivity(data: Partial<Activity>): Promise<Activity> {
    try {
      const response = await api.post<ApiResponse<BackendActivity>>(
        '/activities',
        this.transformToBackend(data)
      );

      const backendActivity = response.data as any as BackendActivity;
      return this.transformActivity(backendActivity);
    } catch (error: any) {
      console.error('Error creating activity:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update an existing activity (Provider/Admin only)
   */
  async updateActivity(id: string, data: Partial<Activity>): Promise<Activity> {
    try {
      const response = await api.put<ApiResponse<BackendActivity>>(
        `/activities/${id}`,
        this.transformToBackend(data)
      );

      const backendActivity = response.data as any as BackendActivity;
      return this.transformActivity(backendActivity);
    } catch (error: any) {
      console.error('Error updating activity:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete an activity (Admin only)
   */
  async deleteActivity(id: string): Promise<void> {
    try {
      await api.delete(`/activities/${id}`);
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Transform backend activity to frontend format
   */
  private transformActivity(backendActivity: BackendActivity): Activity {
    // Parse duration from TimeSpan format "HH:mm:ss" to hours string
    const durationHours = this.parseDuration(backendActivity.durationHours);

    return {
      id: backendActivity.id.toString(),
      name: backendActivity.name || '',
      description: backendActivity.description || '',
      duration: durationHours,
      price: backendActivity.price,
      difficulty: 'Moderado' as const, // Default, backend doesn't have this field
      category: backendActivity.category || 'General',
      included: [],
      requirements: [],
    };
  }

  /**
   * Transform frontend activity to backend format
   */
  private transformToBackend(activity: Partial<Activity>): Partial<BackendActivity> {
    return {
      name: activity.name,
      description: activity.description,
      category: activity.category,
      price: activity.price,
      durationHours: this.formatDuration(activity.duration),
    };
  }

  /**
   * Parse TimeSpan "HH:mm:ss" to human-readable string
   */
  private parseDuration(timeSpan: string): string {
    try {
      const parts = timeSpan.split(':');
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);

      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
      } else if (hours > 0) {
        return `${hours} horas`;
      } else if (minutes > 0) {
        return `${minutes} minutos`;
      }
      return '1 hora';
    } catch {
      return '1 hora';
    }
  }

  /**
   * Format duration string to TimeSpan "HH:mm:ss"
   */
  private formatDuration(duration?: string): string {
    if (!duration) return '01:00:00';

    // Try to parse "X horas", "X hours", "Xh"
    const hoursMatch = duration.match(/(\d+)\s*(h|hora|horas|hour|hours)/i);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      return `${hours.toString().padStart(2, '0')}:00:00`;
    }

    // Try to parse "X minutos", "Xmin"
    const minutesMatch = duration.match(/(\d+)\s*(min|minuto|minutos|minute|minutes)/i);
    if (minutesMatch) {
      const minutes = parseInt(minutesMatch[1]);
      return `00:${minutes.toString().padStart(2, '0')}:00`;
    }

    // Default: 1 hour
    return '01:00:00';
  }
}

export const activitiesApi = new ActivitiesApi();
