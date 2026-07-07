/**
 * Constants for Attrition Analysis Component
 * Barrel export for all attrition-related constants
 */

// Tab labels
export const ATTRITION_TAB_LABELS = [
  'Attrition Analysis',
  'Your Attention',
  'Recommendations',
] as const;

// Chart data and configuration
export const RISK_DISTRIBUTION_DATA = [
  { name: 'High', value: 35, color: '#ef4444' },
  { name: 'Medium', value: 40, color: '#f97316' },
  { name: 'Low', value: 25, color: '#10b981' },
] as const;

export const ATTRITION_DRIVERS_DATA = [
  { name: 'Mental Health', value: 30, color: '#ec4899' },
  { name: 'Career Gap', value: 25, color: '#8b5cf6' },
  { name: 'Workload', value: 20, color: '#ef4444' },
  { name: 'Personal', value: 15, color: '#14b8a6' },
  { name: 'Other', value: 10, color: '#9ca3af' },
] as const;

// Re-export tab-specific constants
export * from './tab1.constants';
export * from './tab2.constants';
