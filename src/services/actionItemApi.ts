import { apiService, ActionItem } from './api';
import { isDemoMode, simulateAsync } from '@/config/demo';
import { MOCK_ACTION_ITEMS, MOCK_ACTION_ITEMS_STATS } from '@/constants/mockData';

// Re-export ActionItem type for convenience
export type { ActionItem };

export interface ActionItemsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    action_items?: ActionItem[];
    summary?: any;
    user_info?: any;
  };
}

export interface ActionItemsQueryParams {
  page?: number;
  page_size?: number;
  status?: string;
  user_id?: string;
}

export class ActionItemApiService {
  // Get all action items with pagination
  async getActionItems(params?: ActionItemsQueryParams): Promise<ActionItemsPaginatedResponse> {
    if (isDemoMode()) {
      const page = params?.page || 1;
      const pageSize = params?.page_size || 20;
      const status = params?.status;
      const userId = params?.user_id;
      
      let filteredItems = MOCK_ACTION_ITEMS;
      if (status) {
        filteredItems = filteredItems.filter(item => item.status === status);
      }
      if (userId) {
        filteredItems = filteredItems.filter(item => item.assigned_to.id.toString() === userId);
      }
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      return simulateAsync({
        count: filteredItems.length,
        next: endIndex < filteredItems.length ? 'next' : null,
        previous: page > 1 ? 'prev' : null,
        results: {
          action_items: paginatedItems,
          summary: MOCK_ACTION_ITEMS_STATS,
        },
      });
    }
    
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.user_id) {
      queryParams.append('user_id', params.user_id);
    }
    
    const url = `/action-items/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get<ActionItemsPaginatedResponse>(url);
  }

  // Legacy method for backward compatibility
  async getAllActionItems(): Promise<ActionItem[]> {
    const response = await this.getActionItems();
    return response.results.action_items || [];
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
