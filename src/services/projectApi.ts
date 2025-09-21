import { apiService, Project } from './api';

export interface ProjectStats {
  total_projects: number;
  high_risk_projects: number;
  active_projects: number;
}

export interface ProjectRisk {
  id: string;
  name: string;
  progress: number;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  tasks: number;
  members: number;
  dueDate: string;
}

export interface ProjectRisksResponse {
  projects: ProjectRisk[];
  total_projects: number;
  high_risk_count: number;
}

export class ProjectApiService {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    return await apiService.get<Project[]>('/projects/');
  }

  // Get my projects
  async getMyProjects(): Promise<Project[]> {
    return await apiService.get<Project[]>('/my-projects/');
  }

  // Get team projects (for managers)
  async getTeamProjects(): Promise<Project[]> {
    return await apiService.get<Project[]>('/team-projects/');
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
