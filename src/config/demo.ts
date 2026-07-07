/**
 * Demo Mode Configuration
 * Controls whether the application uses mock data instead of real API calls
 */

export const DEMO_CONFIG = {
  // Enable/disable demo mode globally
  enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true, // Default to true for demo
  
  // Simulate API delays for realistic loading states
  delays: {
    short: 200,   // Quick operations (get single item)
    medium: 500,  // List operations
    long: 1000,   // Complex operations (analytics, reports)
  },
  
  // Feature flags for different mock data modules
  features: {
    mockTeam: true,
    mockProjects: true,
    mockSurveys: true,
    mockDashboard: true,
    mockActionItems: true,
    mockCourses: true,
    mockChat: true,
    mockUsers: true,
    mockNotifications: true,
  },
  
  // Error simulation (for testing error states)
  simulateErrors: false,
  errorRate: 0.1, // 10% of requests fail when simulateErrors is true
};

/**
 * Check if demo mode is enabled
 */
export const isDemoMode = (): boolean => {
  return DEMO_CONFIG.enabled;
};

/**
 * Get delay for operation type
 */
export const getDelay = (type: 'short' | 'medium' | 'long' = 'medium'): number => {
  return DEMO_CONFIG.delays[type];
};

/**
 * Simulate async operation with delay
 */
export const simulateAsync = <T>(data: T, delay?: number): Promise<T> => {
  const actualDelay = delay ?? getDelay('medium');
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), actualDelay);
  });
};

/**
 * Simulate potential error
 */
export const maybeSimulateError = (): void => {
  if (DEMO_CONFIG.simulateErrors && Math.random() < DEMO_CONFIG.errorRate) {
    throw new Error('Simulated API error for testing');
  }
};
