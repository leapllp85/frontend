/**
 * Mock Data API
 * Centralized location for all mock/dummy data used across the application
 * This makes it easy to replace with real API calls later
 */

export interface AtRiskProject {
  projectName: string;
  riskLevel: string;
  progress: number;
  dueDate: string;
  criticalMembers: {
    name: string;
    criticality: string;
    attritionRisk: string;
  }[];
}

export interface WellnessStats {
  articlesRead: number;
  videosWatched: number;
  messagesExchanged: number;
  activePercentage: number;
}

export interface MemberMetrics {
  utilization: number;
  projectCriticality: string;
  wellnessEngagement: WellnessStats;
}

export interface ManagerDashboardData {
  totalSurveys: number;
  activeSurveys: number;
  completedResponses: number;
  pendingActions: number;
}

/**
 * Mock Data API
 * All functions return Promises to simulate async API calls
 */
export const mockDataApi = {
  /**
   * Get at-risk projects data
   */
  getAtRiskProjects: async (): Promise<AtRiskProject[]> => {
    return Promise.resolve([
      {
        projectName: 'Website Redesign',
        riskLevel: 'High Risk',
        progress: 11,
        dueDate: 'Dec 25, 2024',
        criticalMembers: [
          { name: 'Alice Brown', criticality: 'High', attritionRisk: 'High' },
          { name: 'Maya Patel', criticality: 'High', attritionRisk: 'High' }
        ]
      },
      {
        projectName: '6-month design retainer',
        riskLevel: 'High Risk',
        progress: 100,
        dueDate: 'Nov 25, 2024',
        criticalMembers: [
          { name: 'David Martinez', criticality: 'High', attritionRisk: 'High' }
        ]
      },
      {
        projectName: 'Email Marketing Services',
        riskLevel: 'Medium Risk',
        progress: 33,
        dueDate: 'Nov 25, 2024',
        criticalMembers: [
          { name: 'Alice Brown', criticality: 'High', attritionRisk: 'High' },
          { name: 'Jane Smith', criticality: 'High', attritionRisk: 'Medium' }
        ]
      },
      {
        projectName: 'Strategy Workshop',
        riskLevel: 'Medium Risk',
        progress: 25,
        dueDate: 'Nov 25, 2024',
        criticalMembers: [
          { name: 'Maya Patel', criticality: 'High', attritionRisk: 'High' },
          { name: 'Marcus Thompson', criticality: 'High', attritionRisk: 'High' }
        ]
      }
    ]);
  },

  /**
   * Get project business units
   */
  getProjectBusinessUnits: async (): Promise<string[]> => {
    return Promise.resolve([
      'Supply Chain',
      'Merchandising',
      'Digital',
      'Operations',
      'Finance'
    ]);
  },

  /**
   * Get wellness engagement stats for a user
   */
  getWellnessEngagementStats: async (userId: string): Promise<WellnessStats> => {
    // Simulate random data - replace with real API call
    return Promise.resolve({
      articlesRead: Math.floor(Math.random() * 15) + 5,
      videosWatched: Math.floor(Math.random() * 10) + 3,
      messagesExchanged: Math.floor(Math.random() * 5) + 1,
      activePercentage: Math.floor(Math.random() * 30) + 60
    });
  },

  /**
   * Get team member metrics
   */
  getTeamMemberMetrics: async (userId: string): Promise<MemberMetrics> => {
    return Promise.resolve({
      utilization: Math.floor(Math.random() * 30) + 60,
      projectCriticality: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      wellnessEngagement: await mockDataApi.getWellnessEngagementStats(userId)
    });
  },

  /**
   * Get manager dashboard mock data
   */
  getManagerDashboardMockData: async (): Promise<ManagerDashboardData> => {
    return Promise.resolve({
      totalSurveys: 24,
      activeSurveys: 8,
      completedResponses: 156,
      pendingActions: 12
    });
  },

  /**
   * Get survey placeholder data
   */
  getSurveyPlaceholderData: async () => {
    return Promise.resolve({
      totalResponses: Math.floor(Math.random() * 100) + 50,
      completionRate: Math.floor(Math.random() * 30) + 60,
      averageScore: (Math.random() * 2 + 3).toFixed(1)
    });
  },

  /**
   * Get action item placeholder data
   */
  getActionItemPlaceholderData: async () => {
    return Promise.resolve({
      totalItems: Math.floor(Math.random() * 50) + 20,
      completedItems: Math.floor(Math.random() * 30) + 10,
      highPriorityItems: Math.floor(Math.random() * 10) + 5
    });
  }
};
