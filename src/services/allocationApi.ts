import { apiService, ProjectAllocation } from './api';

// Re-export types for external use
export type { ProjectAllocation };

export class AllocationApiService {
  // Get all project allocations
  async getAllocations(): Promise<ProjectAllocation[]> {
    return await apiService.get<ProjectAllocation[]>('/allocations/');
  }

  // Get allocation by ID
  async getAllocation(id: number): Promise<ProjectAllocation> {
    return await apiService.get<ProjectAllocation>(`/allocations/${id}/`);
  }

  // Create new allocation
  async createAllocation(allocationData: Omit<ProjectAllocation, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectAllocation> {
    return await apiService.post<ProjectAllocation>('/allocations/', allocationData);
  }

  // Update allocation
  async updateAllocation(id: number, allocationData: Partial<ProjectAllocation>): Promise<ProjectAllocation> {
    return await apiService.put<ProjectAllocation>(`/allocations/${id}/`, allocationData);
  }

  // Delete allocation
  async deleteAllocation(id: number): Promise<void> {
    return await apiService.delete<void>(`/allocations/${id}/`);
  }

  // Get employee allocation summary
  async getEmployeeAllocations(): Promise<ProjectAllocation[]> {
    return await apiService.get<ProjectAllocation[]>('/employee-allocation-summary/');
  }
}

export const allocationApi = new AllocationApiService();
