import { apiService, EmployeeProfile, AttritionGraphData, DistributionGraphData } from './api';

export class TeamApiService {
  // Get all team members
  async getTeamMembers(): Promise<EmployeeProfile[]> {
    return await apiService.get<EmployeeProfile[]>('/my-team/');
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
}

export const teamApi = new TeamApiService();
