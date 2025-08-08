import { fetchWithAuth } from '@/lib/apis/auth';

// User Profile Types based on backend API
export interface UserProfile {
  fullname?: string;
  is_verified?: boolean;
  employee_designation?: string;
  username?: string;
  email?: string;
  phone_number?: string;
}

export class UserApiService {
  // Get current user profile using the correct backend endpoint
  async getCurrentUserProfile(): Promise<UserProfile> {
    const response = await fetchWithAuth('http://localhost:8000/api/user/profile/');
    return response;
  }

  // Get user profile by username - use the legacy profile endpoint
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await fetchWithAuth(`http://localhost:8000/api/user/profile/?username=${username}`);
    return response;
  }

  // Update current user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetchWithAuth(
      'http://localhost:8000/api/user/profile/',
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
