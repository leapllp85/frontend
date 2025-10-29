import { apiService, Project } from './api';

// Re-export types for external use
export type { Project };

export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  high_risk_projects: number;
  completed_projects: number;
  completion_rate: number;
}

export interface ProjectRisksResponse {
  summary: {
    total_projects: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    risk_percentage: number;
  };
  projects?: any[]; // Optional - only needed for detailed views, not Profile
}

export interface ProjectSummary {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  high_priority_projects: number;
  completion_rate: number;
}

export interface UserInfo {
  name: string;
  role: string;
  manager: string | null;
}

export interface ProjectsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    projects: Project[];
    summary?: ProjectSummary;
    user_info?: UserInfo;
    total_results?: number;
    search_query?: string;
  };
}

export interface ProjectsQueryParams {
  page?: number;
  page_size?: number;
  project_id?: number;
  search?: string;
}

export class ProjectApiService {
  // Get all projects with pagination
  async getProjects(params?: ProjectsQueryParams): Promise<ProjectsPaginatedResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }
    if (params?.project_id) {
      queryParams.append('project_id', params.project_id.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    const url = `/projects/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get<ProjectsPaginatedResponse>(url);
  }

  // Get my projects with pagination
  async getMyProjects(params?: ProjectsQueryParams): Promise<ProjectsPaginatedResponse> {
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
    
    const url = `/my-projects/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get<ProjectsPaginatedResponse>(url);
  }

  // Get team projects (for managers) with pagination
  async getTeamProjects(params?: ProjectsQueryParams): Promise<ProjectsPaginatedResponse> {
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
    
    const url = `/team-projects/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get<ProjectsPaginatedResponse>(url);
  }

  // Legacy methods for backward compatibility
  async getAllProjects(): Promise<Project[]> {
    const response = await this.getProjects();
    return response.results.projects;
  }

  async getAllMyProjects(): Promise<Project[]> {
    const response = await this.getMyProjects();
    return response.results.projects;
  }

  async getAllTeamProjects(): Promise<Project[]> {
    const response = await this.getTeamProjects();
    return response.results.projects;
  }

  // Get project by ID
  async getProject(id: number): Promise<Project> {
    return await apiService.get<Project>(`/project-team/${id}/`);
  }

  // Create new project
  async createProject(projectData: {
    title: string;
    description: string;
    start_date: string;
    go_live_date: string;
    status: 'Active' | 'Inactive';
    criticality: 'High' | 'Medium' | 'Low';
    source: string;
  }): Promise<{
    message: string;
    data: Project;
    created_by: {
      id: number;
      name: string;
      role: string;
    };
  }> {
    return await apiService.post('/projects/', projectData);
  }

  // Update project
  async updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
    return await apiService.put<Project>(`/project-team/${id}/`, projectData);
  }

  // Delete project
  async deleteProject(id: number): Promise<void> {
    return await apiService.delete<void>(`/project-team/${id}/`);
  }

  // Get project team members
  async getProjectTeam(projectId: number): Promise<any[]> {
    return await apiService.get<any[]>(`/project-team/${projectId}/`);
  }

  // Get project statistics for Profile component
  async getProjectStats(): Promise<ProjectStats> {
    return await apiService.get<ProjectStats>('/project-stats/');
  }

  // Get project risks for Profile component
  async getProjectRisks(): Promise<ProjectRisksResponse> {
    return await apiService.get<ProjectRisksResponse>('/project-risks/');
  }
}

export const projectApi = new ProjectApiService();
