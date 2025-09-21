import { apiService, Project } from './api';

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
  async createProject(projectData: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
    return await apiService.post<Project>('/projects/', projectData);
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
}

export const projectApi = new ProjectApiService();
