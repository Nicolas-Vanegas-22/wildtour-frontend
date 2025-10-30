import { api } from '../http/apiClient';
import { ApiResponse, handleApiError } from '../http/apiTypes';

export interface Notification {
  id: number;
  userId: number;
  type: 'booking' | 'favorite' | 'review' | 'system' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  bookingNotifications: boolean;
  promotionNotifications: boolean;
  reviewNotifications: boolean;
}

class NotificationsApi {
  /**
   * Get all notifications for current user
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<ApiResponse<Notification[]>>('/notifications');
      return response.data as any as Notification[];
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread/count');
      return (response.data as any).count;
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await api.put('/notifications/read-all');
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<void> {
    try {
      await api.delete('/notifications');
    } catch (error: any) {
      console.error('Error deleting all notifications:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await api.get<ApiResponse<NotificationPreferences>>('/notifications/preferences');
      return response.data as any as NotificationPreferences;
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await api.put<ApiResponse<NotificationPreferences>>(
        '/notifications/preferences',
        preferences
      );
      return response.data as any as NotificationPreferences;
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      throw new Error(handleApiError(error));
    }
  }
}

export const notificationsApi = new NotificationsApi();
