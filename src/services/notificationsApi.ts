import { apiService } from './api';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info';
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export class NotificationsApiService {
  // Get notifications for Profile component
  async getNotifications(): Promise<NotificationsResponse> {
    return await apiService.get<NotificationsResponse>('/notifications/');
  }
}

export const notificationsApi = new NotificationsApiService();
