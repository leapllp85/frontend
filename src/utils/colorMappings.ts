import { BadgeColorScheme } from '@/components/ui/badge';

/**
 * Get status color for surveys and action items
 * @param status - Status string
 * @returns Color scheme
 */
export const getStatusColor = (status: string): BadgeColorScheme => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'active':
    case 'pending':
    case 'pending_review':
      return 'orange';
    case 'closed':
    case 'completed':
    case 'reviewed':
      return 'green';
    case 'action_taken':
      return 'blue';
    case 'draft':
      return 'gray';
    default:
      return 'gray';
  }
};

/**
 * Get status label for display
 * @param status - Status string
 * @returns Formatted label
 */
export const getStatusLabel = (status: string): string => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'active':
    case 'pending':
      return 'Active';
    case 'closed':
    case 'completed':
      return 'Completed';
    case 'draft':
      return 'Draft';
    case 'reviewed':
      return 'Reviewed';
    case 'action_taken':
      return 'Action Taken';
    case 'pending_review':
      return 'Pending Review';
    default:
      return status;
  }
};

/**
 * Get category color for surveys
 * @param category - Category string
 * @returns Color scheme
 */
export const getCategoryColor = (category: string): BadgeColorScheme => {
  const categoryLower = category.toLowerCase();
  switch (categoryLower) {
    case 'wellness':
      return 'teal';
    case 'feedback':
      return 'purple';
    case 'satisfaction':
      return 'blue';
    case 'skills':
      return 'indigo';
    case 'engagement':
      return 'pink';
    default:
      return 'gray';
  }
};

/**
 * Get priority color
 * @param priority - Priority string
 * @returns Color scheme
 */
export const getPriorityColor = (priority: string): BadgeColorScheme => {
  const priorityLower = priority.toLowerCase();
  switch (priorityLower) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

/**
 * Get survey type icon emoji
 * @param type - Survey type
 * @returns Emoji string
 */
export const getSurveyTypeIcon = (type: string): string => {
  const typeLower = type.toLowerCase();
  switch (typeLower) {
    case 'wellness':
      return '🧘';
    case 'feedback':
      return '💬';
    case 'satisfaction':
      return '😊';
    case 'skills':
      return '🎯';
    case 'goals':
      return '🚀';
    case 'engagement':
      return '🤝';
    case 'leadership':
      return '👑';
    case 'project_feedback':
      return '📋';
    default:
      return '📊';
  }
};
