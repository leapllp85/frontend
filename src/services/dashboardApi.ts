import { apiService, DashboardQuickData, AttritionGraphData, DistributionGraphData } from './api';

export class DashboardApiService {
  // Get dashboard quick data widgets
  async getDashboardQuickData(): Promise<DashboardQuickData> {
    return await apiService.get<DashboardQuickData>('/dashboard/quick-data/');
  }

  // Get team attrition risk data
  async getTeamAttritionRisk(): Promise<{ percentage: number }> {
    return await apiService.get<{ percentage: number }>('/dashboard/attrition-risk/');
  }

  // Get team mental health data
  async getTeamMentalHealth(): Promise<{ percentage: number }> {
    return await apiService.get<{ percentage: number }>('/dashboard/mental-health/');
  }

  // Get team utilization data
  async getTeamUtilization(): Promise<{ percentage: number }> {
    return await apiService.get<{ percentage: number }>('/dashboard/utilization/');
  }
}

export const dashboardApi = new DashboardApiService();
