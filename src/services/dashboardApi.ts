import { apiService, DashboardQuickData, AttritionGraphData, DistributionGraphData } from './api';
import { isDemoMode, simulateAsync } from '@/config/demo';
import { MOCK_DASHBOARD_QUICK_DATA } from '@/constants/mockData';

// Re-export types for external use
export type { DashboardQuickData, AttritionGraphData, DistributionGraphData };

export class DashboardApiService {
  // Get dashboard quick data widgets
  async getDashboardQuickData(): Promise<DashboardQuickData> {
    if (isDemoMode()) {
      return simulateAsync(MOCK_DASHBOARD_QUICK_DATA, 400);
    }
    return await apiService.get<DashboardQuickData>('/dashboard/quick-data/');
  }

  // Get team attrition risk data
  async getTeamAttritionRisk(): Promise<{ percentage: number }> {
    if (isDemoMode()) {
      return simulateAsync({ percentage: MOCK_DASHBOARD_QUICK_DATA.team_attrition_risk }, 300);
    }
    return await apiService.get<{ percentage: number }>('/dashboard/attrition-risk/');
  }

  // Get team mental health data
  async getTeamMentalHealth(): Promise<{ percentage: number }> {
    if (isDemoMode()) {
      return simulateAsync({ percentage: MOCK_DASHBOARD_QUICK_DATA.team_mental_health }, 300);
    }
    return await apiService.get<{ percentage: number }>('/dashboard/mental-health/');
  }

  // Get team utilization data
  async getTeamUtilization(): Promise<{ percentage: number }> {
    if (isDemoMode()) {
      return simulateAsync({ percentage: MOCK_DASHBOARD_QUICK_DATA.avg_utilization }, 300);
    }
    return await apiService.get<{ percentage: number }>('/dashboard/utilization/');
  }
}

export const dashboardApi = new DashboardApiService();
