/**
 * Application-wide Constants
 * Centralized location for all constant values used across the application
 */

import { Users, Target, Heart, Lightbulb, TrendingUp, MessageSquare, BarChart3, BookOpen, Zap, Star } from 'lucide-react';

// ============================================================================
// PROFILE COMPONENT CONSTANTS
// ============================================================================

export const MOCK_AT_RISK_PROJECTS = [
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
] as const;

// ============================================================================
// MY SPACE / DASHBOARD CONSTANTS
// ============================================================================

export const DASHBOARD_METRICS = [
  { label: 'Engagement', value: 87, icon: Users, color: '#3b82f6', trend: '+5%' },
  { label: 'Goals', value: 92, icon: Target, color: '#10b981', trend: '+8%' },
  { label: 'Satisfaction', value: 85, icon: Heart, color: '#ec4899', trend: '+3%' },
  { label: 'Innovation', value: 78, icon: Lightbulb, color: '#f59e0b', trend: '+12%' }
] as const;

export const TECHNICAL_RECOMMENDATIONS = [
  {
    skill: 'React & TypeScript',
    level: 'Advanced',
    projects: ['EWS Frontend', 'Dashboard'],
    priority: 'High',
    reason: 'Core technology in 2 active projects',
    color: 'blue'
  },
  {
    skill: 'Node.js & Express',
    level: 'Intermediate',
    projects: ['API Gateway', 'Microservices'],
    priority: 'High',
    reason: 'Backend infrastructure scaling needed',
    color: 'green'
  },
  {
    skill: 'PostgreSQL Optimization',
    level: 'Intermediate',
    projects: ['EWS Backend', 'Analytics'],
    priority: 'Medium',
    reason: 'Performance bottlenecks identified',
    color: 'purple'
  },
  {
    skill: 'Docker & Kubernetes',
    level: 'Beginner',
    projects: ['All Projects'],
    priority: 'High',
    reason: 'DevOps modernization initiative',
    color: 'orange'
  },
  {
    skill: 'AWS Cloud Services',
    level: 'Intermediate',
    projects: ['Infrastructure'],
    priority: 'Medium',
    reason: 'Cloud migration in progress',
    color: 'cyan'
  }
] as const;

export const LEADERSHIP_ARTICLES = [
  { 
    title: 'High-Performing Teams', 
    category: 'Team', 
    time: '8 min', 
    stats: '94% Success', 
    color: 'blue', 
    icon: Users,
    description: 'Transform your team with proven strategies for exceptional results.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80'
  },
  { 
    title: 'Effective Delegation', 
    category: 'Skills', 
    time: '6 min', 
    stats: '3x Productivity', 
    color: 'purple', 
    icon: TrendingUp,
    description: 'Empower your team and multiply your leadership impact.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80'
  },
  { 
    title: 'Innovation & Creativity', 
    category: 'Innovation', 
    time: '10 min', 
    stats: '+45% Ideas', 
    color: 'orange', 
    icon: Lightbulb,
    description: 'Create environments where breakthrough ideas emerge.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80'
  },
  { 
    title: 'Emotional Intelligence', 
    category: 'Growth', 
    time: '7 min', 
    stats: '89% Engagement', 
    color: 'pink', 
    icon: Heart,
    description: 'Build stronger relationships through empathy.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
  },
  { 
    title: 'Strategic Communication', 
    category: 'Leadership', 
    time: '9 min', 
    stats: '2x Impact', 
    color: 'green', 
    icon: MessageSquare,
    description: 'Master the art of clear, influential communication.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80'
  },
  { 
    title: 'Data-Driven Decisions', 
    category: 'Analytics', 
    time: '11 min', 
    stats: '76% Accuracy', 
    color: 'indigo', 
    icon: BarChart3,
    description: 'Leverage analytics for smarter business choices.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
  }
] as const;

// ============================================================================
// STATUS & PRIORITY CONSTANTS
// ============================================================================

export const ACTION_ITEM_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked'
} as const;

export const ACTION_ITEM_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const SURVEY_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  ARCHIVED: 'archived'
} as const;

export const RISK_LEVELS = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  CRITICAL: 'Critical Risk'
} as const;

export const ATTRITION_RISK_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
} as const;

// ============================================================================
// COLOR SCHEMES
// ============================================================================

export const STATUS_COLORS = {
  pending: 'yellow',
  in_progress: 'blue',
  completed: 'green',
  blocked: 'red',
  active: 'green',
  on_hold: 'orange',
  cancelled: 'gray',
  draft: 'gray',
  closed: 'red',
  archived: 'gray'
} as const;

export const PRIORITY_COLORS = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red'
} as const;

export const RISK_COLORS = {
  'Low Risk': 'green',
  'Medium Risk': 'orange',
  'High Risk': 'red',
  'Critical Risk': 'red'
} as const;

export const ATTRITION_COLORS = {
  Low: 'green',
  Medium: 'orange',
  High: 'red'
} as const;

// ============================================================================
// METRIC CARD CONFIGURATIONS
// ============================================================================

export const METRIC_CARD_GRADIENTS = {
  teal: {
    from: '#ccfbf1',
    to: '#f0fdfa',
    iconColor: '#14b8a6',
    iconBg: 'teal.100',
    valueColor: 'gray.800',
    shadow: 'rgba(20, 184, 166, 0.15)'
  },
  indigo: {
    from: '#e0e7ff',
    to: '#eef2ff',
    iconColor: '#6366f1',
    iconBg: 'indigo.100',
    valueColor: 'gray.800',
    shadow: 'rgba(99, 102, 241, 0.15)'
  },
  amber: {
    from: '#fef3c7',
    to: '#fefce8',
    iconColor: '#f59e0b',
    iconBg: 'amber.100',
    valueColor: 'orange.600',
    shadow: 'rgba(245, 158, 11, 0.15)'
  },
  rose: {
    from: '#ffe4e6',
    to: '#fff1f2',
    iconColor: '#f43f5e',
    iconBg: 'rose.100',
    valueColor: 'red.600',
    shadow: 'rgba(244, 63, 94, 0.15)'
  },
  blue: {
    from: '#dbeafe',
    to: '#eff6ff',
    iconColor: '#3b82f6',
    iconBg: 'blue.100',
    valueColor: 'blue.600',
    shadow: 'rgba(59, 130, 246, 0.15)'
  },
  green: {
    from: '#d1fae5',
    to: '#f0fdf4',
    iconColor: '#10b981',
    iconBg: 'green.100',
    valueColor: 'green.600',
    shadow: 'rgba(16, 185, 129, 0.15)'
  }
} as const;

// ============================================================================
// PAGINATION & LIMITS
// ============================================================================

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
} as const;

export const TABLE_LIMITS = {
  ROWS_PER_PAGE: [10, 25, 50, 100],
  DEFAULT_ROWS: 10
} as const;

// ============================================================================
// DATE & TIME FORMATS
// ============================================================================

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY',
  SHORT: 'MM/DD/YY',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'MMM DD, YYYY HH:mm'
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
} as const;

// ============================================================================
// API ENDPOINTS (for reference)
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/refresh/',
    REGISTER: '/auth/register/'
  },
  USERS: {
    PROFILE: '/users/profile/',
    LIST: '/users/',
    DETAIL: '/users/:id/'
  },
  PROJECTS: {
    LIST: '/projects/',
    DETAIL: '/projects/:id/',
    STATS: '/project-stats/',
    RISKS: '/project-risks/'
  },
  ACTION_ITEMS: {
    LIST: '/action-items/',
    DETAIL: '/action-items/:id/',
    CREATE: '/action-items/',
    UPDATE: '/action-items/:id/',
    DELETE: '/action-items/:id/'
  },
  SURVEYS: {
    LIST: '/surveys/',
    DETAIL: '/surveys/:id/',
    SUBMIT: '/surveys/:id/submit/',
    RESPONSES: '/survey-responses/'
  },
  TEAM: {
    STATS: '/team-stats/',
    MEMBERS: '/team-members/',
    CRITICAL: '/critical-members/'
  },
  METRICS: {
    DASHBOARD: '/metrics/',
    ATTRITION: '/attrition-analysis/',
    HEALTH: '/health-metrics/'
  }
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
} as const;

export const ANIMATION_DURATIONS = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms'
} as const;

// ============================================================================
// SURVEY TYPES
// ============================================================================

export const SURVEY_TYPES = {
  WELLNESS: 'wellness',
  SATISFACTION: 'satisfaction',
  FEEDBACK: 'feedback',
  ENGAGEMENT: 'engagement',
  PULSE: 'pulse',
  EXIT: 'exit'
} as const;

export const QUESTION_TYPES = {
  TEXT: 'text',
  MULTIPLE_CHOICE: 'multiple_choice',
  RATING: 'rating',
  YES_NO: 'yes_no',
  SCALE: 'scale'
} as const;

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type ActionItemStatus = typeof ACTION_ITEM_STATUSES[keyof typeof ACTION_ITEM_STATUSES];
export type ActionItemPriority = typeof ACTION_ITEM_PRIORITIES[keyof typeof ACTION_ITEM_PRIORITIES];
export type ProjectStatus = typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES];
export type SurveyStatus = typeof SURVEY_STATUSES[keyof typeof SURVEY_STATUSES];
export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS];
export type AttritionRiskLevel = typeof ATTRITION_RISK_LEVELS[keyof typeof ATTRITION_RISK_LEVELS];
export type SurveyType = typeof SURVEY_TYPES[keyof typeof SURVEY_TYPES];
export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// ============================================================================
// ATTRITION ANALYSIS CONSTANTS
// ============================================================================

export * from './attrition';
