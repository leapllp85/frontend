import { RAGApiResponse, AsyncComponent, AsyncLayout } from '@/types/ragApi';
import { MOCK_EMPLOYEES } from './team';

/**
 * Performance and Cost-related Mock Chat Prompts
 * Additional questions for performance analysis, cost optimization, and workforce planning
 */

// Helper to create mock RAG response
const createRAGResponse = (
  layout: AsyncLayout,
  components: AsyncComponent[],
  dataset: any,
  insights: any
): RAGApiResponse => ({
  success: true,
  layout,
  components,
  dataset,
  insights,
  status: 'completed',
});

export interface MockChatPrompt {
  id: string;
  prompt: string;
  category: 'employee' | 'project' | 'mental_health' | 'attrition' | 'performance';
  response: RAGApiResponse;
}

export const PERFORMANCE_CHAT_PROMPTS: MockChatPrompt[] = [
  // Low Performance Questions
  {
    id: 'perf_low_001',
    prompt: 'Employees with low performance ratings in the last 2 cycles',
    category: 'performance',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 2,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'metric_2', position: { row: 0, col: 1, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'Low Performers',
          description: 'Employees with low ratings in last 2 cycles',
          properties: { value: 3, trend: 'up', trendValue: '+1 from previous period' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Performance Decline',
          description: 'Percentage showing declining trend',
          properties: { value: '20%', trend: 'down', trendValue: 'Needs intervention' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Low Performance Employees',
          description: 'Team members requiring performance improvement plans',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'current_rating', label: 'Current Rating' },
              { field: 'previous_rating', label: 'Previous Rating' },
              { field: 'trend', label: 'Trend' },
              { field: 'action', label: 'Recommended Action' },
            ],
            sortable: true,
          },
        },
      ],
      {
        low_performers: {
          description: 'Employees with consecutive low performance',
          columns: ['name', 'current_rating', 'previous_rating', 'trend', 'action'],
          data: [
            { name: 'James Rodriguez', current_rating: '2.1/5', previous_rating: '2.3/5', trend: 'Declining', action: 'Performance Improvement Plan' },
            { name: 'Kevin White', current_rating: '2.2/5', previous_rating: '2.4/5', trend: 'Declining', action: 'Coaching & Mentoring' },
            { name: 'Nina Williams', current_rating: '2.3/5', previous_rating: '2.5/5', trend: 'Declining', action: 'Skill Development' },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '3 employees (20% of team) have low performance in last 2 cycles',
          'All three show declining trend, not stable low performance',
          'James Rodriguez has steepest decline: 2.3 → 2.1',
          'Common pattern: Low motivation and mental health scores',
        ],
        recommendations: [
          'Initiate Performance Improvement Plans for all three employees',
          'Assign mentors to provide guidance and support',
          'Identify root causes: workload, skills gap, or personal issues',
          'Set clear 90-day improvement milestones with weekly check-ins',
        ],
        alerts: [
          'James Rodriguez requires immediate PIP - consecutive decline',
          'All three employees also show high attrition risk',
        ],
        next_steps: [
          'Schedule 1-on-1 meetings to discuss performance concerns',
          'Create individualized improvement plans',
          'Assign mentors and set up weekly coaching sessions',
          'Review progress in 30 days',
        ],
      }
    ),
  },
  {
    id: 'perf_low_002',
    prompt: 'List employees whose performance has declined year-over-year',
    category: 'performance',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 1,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'chart_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'chart_1',
          type: 'line_chart',
          title: 'Performance Trend (YoY)',
          description: 'Year-over-year performance comparison',
          properties: {
            x_axis: 'period',
            y_axis: 'rating',
            lines: ['2024', '2025'],
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Declining Performance',
          description: 'Employees with YoY performance decline',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'last_year', label: '2024 Rating' },
              { field: 'this_year', label: '2025 Rating' },
              { field: 'decline', label: 'Decline %' },
              { field: 'reason', label: 'Likely Cause' },
            ],
          },
        },
      ],
      {
        declining_performers: {
          description: 'YoY performance decline analysis',
          columns: ['name', 'last_year', 'this_year', 'decline', 'reason'],
          data: [
            { name: 'Emily Rodriguez', last_year: '4.2/5', this_year: '3.1/5', decline: '-26%', reason: 'Overallocation (110%)' },
            { name: 'James Rodriguez', last_year: '3.5/5', this_year: '2.1/5', decline: '-40%', reason: 'Low motivation & mental health' },
            { name: 'Michelle Davis', last_year: '4.0/5', this_year: '3.0/5', decline: '-25%', reason: 'Overallocation (105%)' },
            { name: 'Kevin White', last_year: '3.2/5', this_year: '2.2/5', decline: '-31%', reason: 'Skills mismatch' },
            { name: 'Nina Williams', last_year: '3.3/5', this_year: '2.3/5', decline: '-30%', reason: 'Personal reasons' },
          ],
          row_count: 5,
        },
      },
      {
        key_findings: [
          '5 employees (33% of team) show YoY performance decline',
          'Average decline: 30% across affected employees',
          'James Rodriguez has largest decline: 40% (3.5 → 2.1)',
          '2 employees declining due to overallocation',
        ],
        recommendations: [
          'Immediately reduce workload for Emily and Michelle',
          'Address root causes: workload, skills, motivation',
          'Implement performance recovery plans for all 5',
          'Consider role adjustments for Kevin (skills mismatch)',
        ],
        alerts: [
          'CRITICAL: James Rodriguez - 40% decline requires urgent intervention',
          'Overallocation causing performance drops in 2 employees',
        ],
        next_steps: [
          'Conduct root cause analysis for each employee',
          'Rebalance workload for overallocated team members',
          'Create tailored recovery plans with 60-day milestones',
          'Monthly performance reviews to track improvement',
        ],
      }
    ),
  },
  {
    id: 'perf_low_003',
    prompt: 'Who are the bottom 10% performers in my team?',
    category: 'performance',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 2,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'Bottom 10% Performers',
          description: 'Lowest performing team members',
          properties: { value: 2, trend: 'neutral', trendValue: 'Out of 15 team members' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Bottom Performers',
          description: 'Employees in bottom 10% performance bracket',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'rating', label: 'Performance Rating' },
              { field: 'percentile', label: 'Percentile' },
              { field: 'key_issues', label: 'Key Issues' },
              { field: 'status', label: 'Status' },
            ],
          },
        },
      ],
      {
        bottom_performers: {
          description: 'Bottom 10% of team by performance',
          columns: ['name', 'rating', 'percentile', 'key_issues', 'status'],
          data: [
            { name: 'James Rodriguez', rating: '2.1/5', percentile: '5th', key_issues: 'Low motivation, declining performance', status: 'PIP Required' },
            { name: 'Kevin White', rating: '2.2/5', percentile: '10th', key_issues: 'Skills gap, low engagement', status: 'At Risk' },
          ],
          row_count: 2,
        },
      },
      {
        key_findings: [
          '2 employees (13% of team) in bottom 10% performance bracket',
          'Both employees also at high attrition risk',
          'James Rodriguez: 5th percentile with 2.1/5 rating',
          'Kevin White: 10th percentile with 2.2/5 rating',
        ],
        recommendations: [
          'Implement formal Performance Improvement Plans',
          'Provide intensive coaching and skill development',
          'Set clear performance expectations and milestones',
          'Consider role reassignment if improvement not seen in 90 days',
        ],
        alerts: [
          'James Rodriguez requires immediate intervention - lowest performer',
          'Both employees show multiple risk factors beyond performance',
        ],
        next_steps: [
          'Initiate formal PIP process for James Rodriguez',
          'Assign dedicated mentors to both employees',
          'Weekly performance check-ins for next 12 weeks',
          'Evaluate progress at 30, 60, and 90 day marks',
        ],
      }
    ),
  },
];
