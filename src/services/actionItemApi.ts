import { apiService, ActionItem } from './api';

export class ActionItemApiService {
  // Get all action items
  async getActionItems(): Promise<ActionItem[]> {
    return await apiService.get<ActionItem[]>('/action-items/');
  }

  // Get action item by ID
  async getActionItem(id: number): Promise<ActionItem> {
    return await apiService.get<ActionItem>(`/action-items/${id}/`);
  }

  // Create new action item
  async createActionItem(actionItemData: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>): Promise<ActionItem> {
    return await apiService.post<ActionItem>('/action-items/', actionItemData);
  }

  // Update action item
  async updateActionItem(id: number, actionItemData: Partial<ActionItem>): Promise<ActionItem> {
    return await apiService.put<ActionItem>(`/action-items/${id}/`, actionItemData);
  }

  // Delete action item
  async deleteActionItem(id: number): Promise<void> {
    return await apiService.delete<void>(`/action-items/${id}/`);
  }
}

export const actionItemApi = new ActionItemApiService();
