/**
 * Constants for Attrition Analysis - Tab 2 (Recommendations)
 */

import { 
  MessageSquare, 
  HeartPulse, 
  GraduationCap, 
  CalendarClock, 
  Users2, 
  BarChart3,
  LucideIcon
} from 'lucide-react';

export interface ActionItem {
  title: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  borderColor: string;
  items: string[];
}

export const ACTION_ITEMS: ActionItem[] = [
  {
    title: 'Survey Sentiment',
    icon: MessageSquare,
    color: '#3b82f6',
    bg: 'blue.50',
    borderColor: 'blue.100',
    items: [
      'Conduct immediate 1-on-1 meetings with high-stress employees',
      'Review and redistribute workload across team members',
    ],
  },
  {
    title: 'Mental Health',
    icon: HeartPulse,
    color: '#10b981',
    bg: 'green.50',
    borderColor: 'green.100',
    items: [
      'Schedule wellness check-ins with at-risk team members',
      'Enroll team in mental health support programs',
    ],
  },
  {
    title: 'Skill Development',
    icon: GraduationCap,
    color: '#8b5cf6',
    bg: 'purple.50',
    borderColor: 'purple.100',
    items: [
      'Create personalized learning paths for each team member',
      'Allocate budget for technical training and certifications',
    ],
  },
];

export const STRATEGIC_RECOMMENDATIONS: ActionItem[] = [
  {
    title: 'Project Management',
    icon: CalendarClock,
    color: '#f97316',
    bg: 'orange.50',
    borderColor: 'orange.100',
    items: [
      'Reassess project timelines and reduce unrealistic deadlines',
      'Implement agile methodologies for better sprint planning',
    ],
  },
  {
    title: 'Resource Allocation',
    icon: Users2,
    color: '#14b8a6',
    bg: 'teal.50',
    borderColor: 'teal.100',
    items: [
      'Balance workload distribution based on skill levels',
      'Hire additional resources for high-priority initiatives',
    ],
  },
  {
    title: 'Impact Management',
    icon: BarChart3,
    color: '#6366f1',
    bg: 'indigo.50',
    borderColor: 'indigo.100',
    items: [
      'Monitor team morale through regular pulse surveys',
      'Establish clear communication channels for feedback',
    ],
  },
];
