import { apiService } from './api';

// User Profile Types based on backend API
export interface UserProfile {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_manager: boolean;
    manager: number | null;
    profile_pic: string;
    permissions: string[];
  };
  profile: {
    id: number;
    suggested_risk: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
    age: number;
    mental_health: string;
    motivation_factor: string;
    career_opportunities: string;
    personal_reason: string;
    manager_assessment_risk: string;
    all_triggers: string;
    primary_trigger: string;
    created_at: string;
    updated_at: string;
    user: number;
    manager: number | null;
  };
}

export class UserApiService {
  // Get current user profile using the correct backend endpoint
  async getCurrentUserProfile(): Promise<UserProfile> {
    // First try to get data from localStorage
    const userData = localStorage.getItem('userData');
    const profileData = localStorage.getItem('profileData');

    if (userData && profileData) {
      return {
        user: JSON.parse(userData),
        profile: JSON.parse(profileData)
      };
    }

    // If not in localStorage, fetch from API
    try {
      const response = await apiService.get('/user/profile/') as UserProfile;
      
      // Store the response data in localStorage for future use
      if (response.user && response.profile) {
        localStorage.setItem('userData', JSON.stringify(response.user));
        localStorage.setItem('profileData', JSON.stringify(response.profile));
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Get user profile by username - use the legacy profile endpoint
  async getUserProfileByUsername(username: string): Promise<UserProfile> {
    return await apiService.get(`/user/profile/?username=${username}`);
  }

  // Get user profile
  async getUserProfile(): Promise<any> {
    return await apiService.get('/user/profile/');
  }

  // Update current user profile
  async updateUserProfile(profileData: any): Promise<any> {
    return await apiService.put('/user/profile/', profileData);
  }

  // Search users across organization
  async searchUsers(query: string, limit: number = 10): Promise<any[]> {
    const response = await apiService.get(`/users/search/?q=${encodeURIComponent(query)}&limit=${limit}`) as { users: any[], count: number };
    // API returns {users: [...], count: number}, but we need just the users array
    return response.users || [];
  }

  // Get all users (now returns team members)
  async getAllUsers(): Promise<any[]> {
    return await apiService.get('/my-team/');
  }

  // Get team members with all profile data - Manager only
  async getMyTeam(): Promise<any[]> {
    return await apiService.get('/my-team/');
  }

  // Add user to project
  async addUserToProject(
    projectId: number, 
    userId: number, 
    allocationPercentage: number = 0,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    return await apiService.post(`/project-team/${projectId}/`, {
      employee_id: userId,
      allocation_percentage: allocationPercentage,
      start_date: startDate,
      end_date: endDate
    });
  }

  // Remove user from project
  async removeUserFromProject(projectId: number, userId: number): Promise<void> {
    await apiService.delete(`/project-team/${projectId}/`, {
      employee_id: userId
    });
  }
}

export const userApi = new UserApiService();
