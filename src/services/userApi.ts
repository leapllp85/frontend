import { fetchWithAuth } from '@/lib/apis/auth';

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
      const response = await fetchWithAuth('http://34.93.168.19:8000/api/user/profile/');
      
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
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await fetchWithAuth(`http://34.93.168.19:8000/api/user/profile/?username=${username}`);
    return response;
  }

  // Update current user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetchWithAuth(
      'http://34.93.168.19:8000/api/user/profile/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      }
    );
    return response;
  }
}

export const userApi = new UserApiService();
