import { apiService } from './api';

// Criticality Metrics Types
export interface CriticalityMetrics {
  mental_health_risk: RiskLevel;
  attrition_risk: RiskLevel;
  projects_at_risk: number;
  avg_utilization: number;
  overall_score: number;
  last_updated: string;
}

export interface EmployeeCriticalityVsRiskData {
  criticality: RiskLevel;
  risk: RiskLevel;
  employee_name: string;
}

export interface CriticalityVsRiskData {
  scatter_data: EmployeeCriticalityVsRiskData[];
  work_wellness: RiskLevel;
  career_growth: RiskLevel;
}

export interface CriticalityCategory {
  name: string;
  risk_level: RiskLevel;
  score: number;
  color: string;
  description: string;
}

export interface RiskDistribution {
  mental_health: { high: number; medium: number; low: number };
  motivation: { high: number; medium: number; low: number };
  career_opportunities: { high: number; medium: number; low: number };
  personal_factors: { high: number; medium: number; low: number };
}

export interface CriticalityTrend {
  date: string;
  overall_score: number;
  mental_health: number;
  attrition_risk: number;
  utilization: number;
}

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface CriticalityResponse {
  success: boolean;
  data: CriticalityMetrics;
  message?: string;
}

export interface CriticalityVsRiskResponse {
  success: boolean;
  data: CriticalityVsRiskData;
  message?: string;
}

export interface RiskDistributionResponse {
  success: boolean;
  data: RiskDistribution;
  message?: string;
}

export interface CriticalityTrendResponse {
  success: boolean;
  data: CriticalityTrend[];
  message?: string;
}

class CriticalityApiService {
  // Get current user's criticality metrics
  async getCriticalityMetrics(): Promise<CriticalityMetrics> {
    try {
      const response = await apiService.get<CriticalityResponse>('/criticality/metrics');
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch criticality metrics');
    } catch (error) {
      console.error('Error fetching criticality metrics:', error);
      throw error;
    }
  }

  // Get criticality vs risk analysis data
  async getCriticalityVsRisk(): Promise<CriticalityVsRiskData> {
    try {
      const response = await apiService.get<CriticalityVsRiskResponse>('/criticality/vs-risk');
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch criticality vs risk data');
    } catch (error) {
      console.error('Error fetching criticality vs risk data:', error);
      throw error;
    }
  }

  // Get risk distribution across different factors
  async getRiskDistribution(): Promise<RiskDistribution> {
    try {
      const response = await apiService.get<RiskDistributionResponse>('/criticality/risk-distribution');
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch risk distribution');
    } catch (error) {
      console.error('Error fetching risk distribution:', error);
      throw error;
    }
  }

  // Get criticality trends over time
  async getCriticalityTrends(days: number = 30): Promise<CriticalityTrend[]> {
    try {
      const response = await apiService.get<CriticalityTrendResponse>(`/criticality/trends?days=${days}`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch criticality trends');
    } catch (error) {
      console.error('Error fetching criticality trends:', error);
      throw error;
    }
  }

  // Update criticality assessment
  async updateCriticalityAssessment(data: Partial<CriticalityMetrics>): Promise<CriticalityMetrics> {
    try {
      const response = await apiService.put<CriticalityResponse>('/criticality/update', data);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update criticality assessment');
    } catch (error) {
      console.error('Error updating criticality assessment:', error);
      throw error;
    }
  }
}

export const criticalityApi = new CriticalityApiService();
