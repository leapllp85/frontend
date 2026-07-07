import { apiService, EmployeeProfile, AttritionGraphData, DistributionGraphData } from './api';
import { isDemoMode, simulateAsync } from '@/config/demo';
import { 
  MOCK_EMPLOYEES, 
  MOCK_TEAM_STATS, 
  MOCK_ATTRITION_GRAPH_DATA, 
  MOCK_DISTRIBUTION_GRAPH_DATA,
  MOCK_CURRENT_USER 
} from '@/constants/mockData';

// Re-export types for external use
export type { EmployeeProfile, AttritionGraphData, DistributionGraphData };

export interface TeamStats {
  team_members_count: number;
  average_utilization: number;
  utilization_percentage: string;
  active_members: number;
  inactive_members: number;
}

export interface TeamMembersPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    team_members: EmployeeProfile[];
    manager_info: {
      id: number;
      name: string;
      team_size: number;
    };
    search_query?: string;
    filtered_count: number;
  };
}

export interface TeamMembersQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export class TeamApiService {
  // Get all team members with pagination and search
  async getTeamMembers(params?: TeamMembersQueryParams): Promise<TeamMembersPaginatedResponse> {
    if (isDemoMode()) {
      // Mock implementation
      const page = params?.page || 1;
      const pageSize = params?.page_size || 20;
      const search = params?.search?.toLowerCase() || '';
      
      let filteredMembers = MOCK_EMPLOYEES;
      if (search) {
        filteredMembers = MOCK_EMPLOYEES.filter(e => 
          e.name?.toLowerCase().includes(search) ||
          e.email?.toLowerCase().includes(search) ||
          e.first_name?.toLowerCase().includes(search) ||
          e.last_name?.toLowerCase().includes(search)
        );
      }
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
      
      return simulateAsync({
        count: filteredMembers.length,
        next: endIndex < filteredMembers.length ? 'next' : null,
        previous: page > 1 ? 'prev' : null,
        results: {
          team_members: paginatedMembers,
          manager_info: {
            id: MOCK_CURRENT_USER.id,
            name: MOCK_CURRENT_USER.name || 'Demo Manager',
            team_size: MOCK_EMPLOYEES.length,
          },
          search_query: search,
          filtered_count: filteredMembers.length,
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
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    const url = `/my-team/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get<TeamMembersPaginatedResponse>(url);
  }

  // Get all team members (legacy method for backward compatibility)
  async getAllTeamMembers(): Promise<EmployeeProfile[]> {
    if (isDemoMode()) {
      return simulateAsync(MOCK_EMPLOYEES, 300);
    }
    const response = await this.getTeamMembers();
    return response.results.team_members;
  }

  // Get team member by ID
  async getTeamMember(id: number): Promise<EmployeeProfile> {
    if (isDemoMode()) {
      const member = MOCK_EMPLOYEES.find(e => e.id === id);
      if (!member) {
        throw new Error(`Team member with ID ${id} not found`);
      }
      return simulateAsync(member, 200);
    }
    return await apiService.get<EmployeeProfile>(`/my-team/${id}/`);
  }

  // Update team member
  async updateTeamMember(id: number, data: Partial<EmployeeProfile>): Promise<EmployeeProfile> {
    if (isDemoMode()) {
      const member = MOCK_EMPLOYEES.find(e => e.id === id);
      if (!member) {
        throw new Error(`Team member with ID ${id} not found`);
      }
      // In demo mode, just return the updated member (no actual persistence)
      return simulateAsync({ ...member, ...data }, 300);
    }
    return await apiService.put<EmployeeProfile>(`/my-team/${id}/`, data);
  }

  // Get team analytics (includes attrition and distribution data)
  async getTeamAnalytics(): Promise<any> {
    if (isDemoMode()) {
      return simulateAsync({
        attrition_data: MOCK_ATTRITION_GRAPH_DATA,
        distribution_data: MOCK_DISTRIBUTION_GRAPH_DATA,
      }, 500);
    }
    return await apiService.get<any>('/team-analytics/');
  }

  // Get attrition graph data
  async getAttritionGraphData(): Promise<AttritionGraphData> {
    if (isDemoMode()) {
      return simulateAsync(MOCK_ATTRITION_GRAPH_DATA as any, 400);
    }
    return await apiService.get<AttritionGraphData>('/team-analytics/');
  }

  // Get distribution graph data
  async getDistributionGraphData(): Promise<DistributionGraphData> {
    if (isDemoMode()) {
      return simulateAsync(MOCK_DISTRIBUTION_GRAPH_DATA as any, 400);
    }
    return await apiService.get<DistributionGraphData>('/team-analytics/');
  }

  // Get team statistics for Profile component
  async getTeamStats(): Promise<TeamStats> {
    if (isDemoMode()) {
      return simulateAsync(MOCK_TEAM_STATS, 300);
    }
    return await apiService.get<TeamStats>('/team-stats/');
  }
}

export const teamApi = new TeamApiService();
