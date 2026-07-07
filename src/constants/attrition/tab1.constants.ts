/**
 * Constants for Attrition Analysis - Tab 1 (Your Attention)
 */

export const QUICK_STATS = [
  { value: '5/12', label: 'High Critical + Risk', color: '#ef4444' },
  { value: '2/12', label: 'Mental Health', color: '#ec4899' },
  { value: '2/12', label: 'Career Concerns', color: '#8b5cf6' },
  { value: '3/12', label: 'Personal Reasons', color: '#14b8a6' },
] as const;

export const SURVEY_SENTIMENT_METRICS = [
  { label: 'Workload Stress', value: 68, color: '#ef4444' },
  { label: 'Work-Life Balance', value: 45, color: '#f97316' },
] as const;

export const CONTENT_CONSUMPTION_METRICS = [
  { label: 'Articles', value: 78, color: '#3b82f6' },
  { label: 'Videos', value: 65, color: '#10b981' },
  { label: 'Chat', value: 82, color: '#8b5cf6' },
] as const;

export const SKILL_GAP_DATA = {
  stats: [
    { label: 'Need development', value: '3', color: '#ef4444' },
    { label: 'Gap', value: '35%', color: '#f97316' },
  ],
  focusAreas: ['React', 'System Design', 'Cloud'],
} as const;

export const MENTAL_HEALTH_DATA = {
  stats: [
    { label: 'High-risk', value: '2', color: '#ef4444' },
    { label: 'Avg duration', value: '4 days', color: '#f97316' },
  ],
  recommendedActions: [
    'Schedule 1:1 check-ins',
    'Redistribute workload',
    'Enroll in wellness program',
  ],
} as const;
