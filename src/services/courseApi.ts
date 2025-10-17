import { apiService, Course, CourseCategory } from './api';

// Re-export types for external use
export type { Course, CourseCategory };

export class CourseApiService {
  // Get all courses
  async getCourses(): Promise<{ courses: Course[]; total_count: number; message: string }> {
    return await apiService.get<{ courses: Course[]; total_count: number; message: string }>('/courses/');
  }

  // Get course by ID
  async getCourse(id: number): Promise<Course> {
    return await apiService.get<Course>(`/courses/${id}/`);
  }

  // Create new course
  async createCourse(courseData: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    return await apiService.post<Course>('/courses/', courseData);
  }

  // Update course
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    return await apiService.put<Course>(`/courses/${id}/`, courseData);
  }

  // Delete course
  async deleteCourse(id: number): Promise<void> {
    return await apiService.delete<void>(`/courses/${id}/`);
  }

  // Get all course categories (mock data since no backend endpoint)
  async getCourseCategories(): Promise<CourseCategory[]> {
    // Return mock categories since backend doesn't have category endpoint
    return await Promise.resolve([
      { id: 1, name: 'Technical Skills', description: 'Programming and technical courses' },
      { id: 2, name: 'Soft Skills', description: 'Communication and leadership courses' },
      { id: 3, name: 'Management', description: 'Management and strategy courses' },
      { id: 4, name: 'Personal Development', description: 'Self-improvement courses' }
    ]);
  }

  // Create new course category (mock since no backend endpoint)
  async createCourseCategory(categoryData: Omit<CourseCategory, 'id'>): Promise<CourseCategory> {
    return await Promise.resolve({
      id: Date.now(),
      ...categoryData
    });
  }
}

export const courseApi = new CourseApiService();
