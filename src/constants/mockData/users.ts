import { User } from '@/services/api';

/**
 * Mock Users Data - Current user and authentication
 */

export const MOCK_CURRENT_USER: User = {
  id: 100,
  username: 'manager.demo',
  email: 'manager@company.com',
  first_name: 'Demo',
  last_name: 'Manager',
  name: 'Demo Manager',
};

export const MOCK_AUTH_TOKEN = 'mock-jwt-token-for-demo-mode';

export const MOCK_USER_PERMISSIONS = {
  canViewTeam: true,
  canEditTeam: true,
  canViewProjects: true,
  canEditProjects: true,
  canCreateProjects: true,
  canViewSurveys: true,
  canCreateSurveys: true,
  canViewReports: true,
  canManageTeam: true,
};
