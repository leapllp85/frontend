/**
 * Mock Data Index
 * Central export point for all mock data used in demo mode
 */

// Team & Employee Data
export * from './team';

// Project Data
export * from './projects';

// Survey Data
export * from './surveys';

// Action Items Data
export * from './actionItems';

// Courses Data
export * from './courses';

// Chat/RAG Data
export * from './chat';

// Users & Auth Data
export * from './users';

// Dashboard Data (re-export from team for convenience)
export { MOCK_DASHBOARD_QUICK_DATA } from './team';
