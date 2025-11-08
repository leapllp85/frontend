// API Configuration and Base Service
import { fetchWithAuth } from '@/lib/apis/auth';

const API_BASE_URL = process.env.BASE_URL + "/api/v1";

// Types based on backend models
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  go_live_date: string;
  status: 'Active' | 'Inactive';
  criticality: 'High' | 'Medium' | 'Low';
  source: string;
  created_at: string;
  assigned_to: User[];
}

export interface EmployeeProfile {
  id: number;
  user_info: User;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_pic?: string;
  age: number;
  mental_health: 'High' | 'Medium' | 'Low';
  motivation_factor: 'High' | 'Medium' | 'Low';
  career_opportunities: 'High' | 'Medium' | 'Low';
  personal_reason: 'High' | 'Medium' | 'Low';
  manager_assessment_risk: 'High' | 'Medium' | 'Low';
  all_triggers: string;
  primary_trigger?: 'MH' | 'MT' | 'CO' | 'PR';
  suggested_risk: 'High' | 'Medium' | 'Low';
  created_at: string;
  updated_at: string;
  total_allocation: number;
  project_criticality: 'High' | 'Medium' | 'Low';
}

export interface ProjectAllocation {
  id: number;
  employee: User;
  project: Project;
  allocation_percentage: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: number;
  assigned_to: User;
  title: string;
  status: 'Pending' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
  action: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: CourseCategory;
  category_names: string[];
  source: string;
  created_at: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  description: string;
}

// Dashboard Analytics Types
export interface DashboardQuickData {
  team_attrition_risk: number;
  team_mental_health: number;
  avg_utilization: number;
  top_talent: EmployeeProfile[];
  average_age: number;
}

export interface AttritionGraphData {
  high: number;
  medium: number;
  low: number;
}

export interface DistributionGraphData {
  mental_health: { high: number; medium: number; low: number };
  motivation_factor: { high: number; medium: number; low: number };
  career_opportunities: { high: number; medium: number; low: number };
  personal_reason: { high: number; medium: number; low: number };
  primary_triggers: { MH: number; MT: number; CO: number; PR: number };
}

// Base API class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetchWithAuth(url, config);
    return response;
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return await this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return await this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // POST request that returns text/HTML instead of JSON
  async postText(endpoint: string, data: any): Promise<string> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    let token = localStorage.getItem("accessToken");
    
    try {
      let response = await fetch(url, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Try to refresh token
        const { refreshAccessToken } = await import('@/lib/apis/auth');
        try {
          token = await refreshAccessToken();
          response = await fetch(url, {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (refreshError) {
          throw new Error(`Authentication failed: ${refreshError}`);
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('API postText error:', error);
      throw error;
    }
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return await this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, data?: any): Promise<T> {
    return await this.request<T>(endpoint, { method: 'DELETE', body: JSON.stringify(data) });
  }

  // Helper methods for AsyncChatApiService
  getBaseUrl(): string {
    return this.baseURL;
  }

  getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || '';
    }
    return '';
  }
}

export const apiService = new ApiService();
