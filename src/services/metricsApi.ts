import { apiService } from './api';

export interface ProjectMetrics {
  data: {
    mental_health: number;
    attrition_risk: number;
    project_health: number;
  }
}

export class MetricsApiService {
  // Get project metrics for Profile component
  async getProjectMetrics(): Promise<ProjectMetrics> {
    return await apiService.get<ProjectMetrics>('/criticality/metrics/');
  }
}

export const metricsApi = new MetricsApiService();
