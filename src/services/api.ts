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
  business_unit?: string;
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

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Base API class
class ApiService {
  private baseURL: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes default

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Clear cache entry
  private clearCache(key: string) {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAllCache() {
    this.cache.clear();
  }

  // Get from cache if valid
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  // Set cache
  private setCache<T>(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
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

  // GET request with caching and deduplication
  async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = `GET:${endpoint}`;
    
    // Check cache first
    if (useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }
    
    // Check if request is already pending (deduplication)
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) {
      return pending as Promise<T>;
    }
    
    // Make new request
    const requestPromise = this.request<T>(endpoint, { method: 'GET' })
      .then(data => {
        if (useCache) {
          this.setCache(cacheKey, data);
        }
        this.pendingRequests.delete(cacheKey);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(cacheKey);
        throw error;
      });
    
    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // POST request (clears related cache)
  async post<T>(endpoint: string, data: any): Promise<T> {
    // Clear cache for this endpoint on POST
    const cacheKey = `GET:${endpoint}`;
    this.clearCache(cacheKey);
    
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

  // PUT request (clears related cache)
  async put<T>(endpoint: string, data: any): Promise<T> {
    // Clear cache for this endpoint on PUT
    const cacheKey = `GET:${endpoint}`;
    this.clearCache(cacheKey);
    
    return await this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request (clears related cache)
  async delete<T>(endpoint: string, data?: any): Promise<T> {
    // Clear cache for this endpoint on DELETE
    const cacheKey = `GET:${endpoint}`;
    this.clearCache(cacheKey);
    
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
