import { apiService, EmployeeProfile, AttritionGraphData, DistributionGraphData } from './api';

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
    const response = await this.getTeamMembers();
    return response.results.team_members;
  }

  // Get team member by ID
  async getTeamMember(id: number): Promise<EmployeeProfile> {
    return await apiService.get<EmployeeProfile>(`/my-team/${id}/`);
  }

  // Update team member
  async updateTeamMember(id: number, data: Partial<EmployeeProfile>): Promise<EmployeeProfile> {
    return await apiService.put<EmployeeProfile>(`/my-team/${id}/`, data);
  }

  // Get team analytics (includes attrition and distribution data)
  async getTeamAnalytics(): Promise<any> {
    return await apiService.get<any>('/team-analytics/');
  }

  // Get attrition graph data
  async getAttritionGraphData(): Promise<AttritionGraphData> {
    return await apiService.get<AttritionGraphData>('/team-analytics/');
  }

  // Get distribution graph data
  async getDistributionGraphData(): Promise<DistributionGraphData> {
    return await apiService.get<DistributionGraphData>('/team-analytics/');
  }

  // Get team statistics for Profile component
  async getTeamStats(): Promise<TeamStats> {
    return await apiService.get<TeamStats>('/team-stats/');
  }
}

export const teamApi = new TeamApiService();
