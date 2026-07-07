import { RAGApiResponse, AsyncComponent, AsyncLayout } from '@/types/ragApi';

/**
 * Cost Optimization and Workforce Planning Mock Chat Prompts
 */

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

export const COST_OPTIMIZATION_PROMPTS: MockChatPrompt[] = [
  {
    id: 'cost_perf_001',
    prompt: 'List employees with performance below team average',
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
          title: 'Team Average',
          description: 'Average performance rating',
          properties: { value: '3.8/5', trend: 'neutral', trendValue: 'Baseline' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Below Average',
          description: 'Employees below team average',
          properties: { value: 6, trend: 'up', trendValue: '40% of team' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Below Average Performers',
          description: 'Team members performing below 3.8/5 average',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'rating', label: 'Rating' },
              { field: 'gap', label: 'Gap from Average' },
              { field: 'trend', label: 'Trend' },
              { field: 'action', label: 'Action' },
            ],
          },
        },
      ],
      {
        below_average: {
          description: 'Employees below team average performance',
          columns: ['name', 'rating', 'gap', 'trend', 'action'],
          data: [
            { name: 'James Rodriguez', rating: '2.1/5', gap: '-1.7', trend: 'Declining', action: 'PIP' },
            { name: 'Kevin White', rating: '2.2/5', gap: '-1.6', trend: 'Declining', action: 'Coaching' },
            { name: 'Nina Williams', rating: '2.3/5', gap: '-1.5', trend: 'Declining', action: 'Support' },
            { name: 'Michelle Davis', rating: '3.0/5', gap: '-0.8', trend: 'Declining', action: 'Workload Review' },
            { name: 'Emily Rodriguez', rating: '3.1/5', gap: '-0.7', trend: 'Declining', action: 'Workload Review' },
            { name: 'Bob Johnson', rating: '3.5/5', gap: '-0.3', trend: 'Stable', action: 'Monitor' },
          ],
          row_count: 6,
        },
      },
      {
        key_findings: [
          '6 employees (40%) performing below team average of 3.8/5',
          '5 of 6 show declining performance trend',
          'Largest gap: James Rodriguez at -1.7 points',
          'Overallocation correlates with below-average performance',
        ],
        recommendations: [
          'Prioritize support for bottom 3 performers (gap > 1.5)',
          'Review and rebalance workload for Michelle and Emily',
          'Implement tiered intervention based on performance gap',
          'Set team-wide performance improvement initiatives',
        ],
        alerts: [
          '3 employees have critical performance gaps (>1.5 points)',
          'Declining trend in 83% of below-average performers',
        ],
        next_steps: [
          'Create intervention plans based on performance gap severity',
          'Address workload issues for overallocated employees',
          'Monthly team performance reviews',
          'Track improvement metrics for next quarter',
        ],
      }
    ),
  },
  {
    id: 'cost_perf_002',
    prompt: 'Show employees with no measurable contributions',
    category: 'performance',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 1,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'No Measurable Contributions',
          description: 'Employees with zero tracked deliverables',
          properties: { value: 1, trend: 'neutral', trendValue: 'Requires investigation' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Zero Contribution Employees',
          description: 'Team members with no tracked work output',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'allocation', label: 'Allocation' },
              { field: 'last_contribution', label: 'Last Contribution' },
              { field: 'status', label: 'Status' },
              { field: 'reason', label: 'Likely Reason' },
            ],
          },
        },
      ],
      {
        no_contributions: {
          description: 'Employees with no measurable output',
          columns: ['name', 'allocation', 'last_contribution', 'status', 'reason'],
          data: [
            { name: 'Ian Mitchell', allocation: '45%', last_contribution: '60+ days ago', status: 'Inactive', reason: 'On bench / Between projects' },
          ],
          row_count: 1,
        },
      },
      {
        key_findings: [
          '1 employee with no measurable contributions in last 60 days',
          'Ian Mitchell: 45% allocated but no tracked deliverables',
          'Last contribution was over 2 months ago',
          'Employee appears to be on bench between projects',
        ],
        recommendations: [
          'Investigate Ian Mitchell\'s current assignment status',
          'Assign to active project or training program immediately',
          'Review allocation accuracy - may need adjustment',
          'Implement better tracking for bench time and utilization',
        ],
        alerts: [
          'Ian Mitchell: 60+ days with no contributions - urgent action needed',
        ],
        next_steps: [
          'Meet with Ian Mitchell to understand current status',
          'Assign to active project within next 2 weeks',
          'Review project pipeline for assignment opportunities',
          'Implement weekly check-ins until actively contributing',
        ],
      }
    ),
  },
  {
    id: 'cost_high_001',
    prompt: 'Show top 20% performers for bonus allocation',
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
          title: 'Top 20% Performers',
          description: 'Eligible for premium bonus tier',
          properties: { value: 3, trend: 'up', trendValue: 'High performers' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Avg Performance',
          description: 'Average rating of top performers',
          properties: { value: '4.7/5', trend: 'up', trendValue: 'Exceptional' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Top Performers - Bonus Eligible',
          description: 'Highest performing team members',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'rating', label: 'Performance' },
              { field: 'percentile', label: 'Percentile' },
              { field: 'achievements', label: 'Key Achievements' },
              { field: 'bonus_tier', label: 'Bonus Tier' },
            ],
          },
        },
      ],
      {
        top_performers: {
          description: 'Top 20% performers eligible for bonuses',
          columns: ['name', 'rating', 'percentile', 'achievements', 'bonus_tier'],
          data: [
            { name: 'Alice Brown', rating: '4.8/5', percentile: '95th', achievements: 'Led 2 critical projects, 15% above target', bonus_tier: 'Premium (25%)' },
            { name: 'Sarah Davis', rating: '4.7/5', percentile: '90th', achievements: 'Delivered 3 major features ahead of schedule', bonus_tier: 'Premium (25%)' },
            { name: 'David Martinez', rating: '4.6/5', percentile: '85th', achievements: 'Mentored 3 juniors, exceeded KPIs', bonus_tier: 'Standard (15%)' },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '3 employees (20% of team) qualify for top performer bonuses',
          'Average performance rating: 4.7/5 (well above 3.8 team avg)',
          'Alice Brown leads at 95th percentile with 4.8/5 rating',
          'All three consistently exceed targets and show leadership',
        ],
        recommendations: [
          'Award premium bonus tier (25%) to Alice and Sarah',
          'Award standard bonus tier (15%) to David',
          'Consider these employees for promotion opportunities',
          'Use as mentors for below-average performers',
        ],
        alerts: [
          'High retention risk if top performers not properly rewarded',
          'Alice and Sarah are critical to team success',
        ],
        next_steps: [
          'Process bonus allocations within next pay cycle',
          'Schedule recognition meetings with each top performer',
          'Discuss career growth and promotion paths',
          'Assign mentorship roles to support team development',
        ],
      }
    ),
  },
  {
    id: 'cost_high_002',
    prompt: 'Who exceeded their targets significantly?',
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
          type: 'bar_chart',
          title: 'Target Achievement Rate',
          description: 'Performance vs targets for high achievers',
          properties: {
            x_axis: 'employee',
            y_axis: 'achievement_percentage',
            threshold: 100,
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Exceptional Achievers',
          description: 'Employees who significantly exceeded targets',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'target', label: 'Target' },
              { field: 'actual', label: 'Actual' },
              { field: 'achievement', label: 'Achievement %' },
              { field: 'impact', label: 'Business Impact' },
            ],
          },
        },
      ],
      {
        high_achievers: {
          description: 'Employees exceeding targets by >20%',
          columns: ['name', 'target', 'actual', 'achievement', 'impact'],
          data: [
            { name: 'Alice Brown', target: '100 story points', actual: '135 points', achievement: '135%', impact: 'Delivered critical features early' },
            { name: 'Sarah Davis', target: '8 features', actual: '11 features', achievement: '138%', impact: 'Accelerated product roadmap' },
            { name: 'David Martinez', target: '90% quality', actual: '98% quality', achievement: '109%', impact: 'Reduced bugs by 40%' },
            { name: 'Olivia Taylor', target: '5 projects', actual: '7 projects', achievement: '140%', impact: 'Enabled 2 early launches' },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          '4 employees exceeded targets by more than 20%',
          'Olivia Taylor leads with 140% achievement rate',
          'Sarah Davis delivered 138% of planned features',
          'All high achievers also show high engagement scores',
        ],
        recommendations: [
          'Recognize achievements publicly in team meeting',
          'Award spot bonuses for exceptional performance',
          'Fast-track for promotion consideration',
          'Leverage as mentors for struggling team members',
        ],
        alerts: [
          'Risk of burnout - ensure sustainable workload',
          'High performers may attract external opportunities',
        ],
        next_steps: [
          'Schedule recognition meetings with each employee',
          'Process spot bonuses within 2 weeks',
          'Discuss career advancement opportunities',
          'Ensure workload remains sustainable',
        ],
      }
    ),
  },
  {
    id: 'cost_high_003',
    prompt: 'Show employees with consistent high performance',
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
          title: 'Consistent High Performers',
          description: 'Employees with 4+ rating for 3+ cycles',
          properties: { value: 5, trend: 'up', trendValue: '33% of team' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Sustained Excellence',
          description: 'Team members with consistent high performance',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'avg_rating', label: 'Avg Rating' },
              { field: 'consistency', label: 'Consistency' },
              { field: 'tenure', label: 'Tenure' },
              { field: 'recognition', label: 'Recognition' },
            ],
          },
        },
      ],
      {
        consistent_performers: {
          description: 'Employees with sustained high performance',
          columns: ['name', 'avg_rating', 'consistency', 'tenure', 'recognition'],
          data: [
            { name: 'Alice Brown', avg_rating: '4.7/5', consistency: '6 cycles', tenure: '3 years', recognition: 'Promotion Ready' },
            { name: 'Sarah Davis', avg_rating: '4.6/5', consistency: '5 cycles', tenure: '2.5 years', recognition: 'Leadership Track' },
            { name: 'David Martinez', avg_rating: '4.5/5', consistency: '4 cycles', tenure: '2 years', recognition: 'High Potential' },
            { name: 'Olivia Taylor', avg_rating: '4.4/5', consistency: '4 cycles', tenure: '1.5 years', recognition: 'Fast Track' },
            { name: 'Lisa Chen', avg_rating: '4.3/5', consistency: '3 cycles', tenure: '1 year', recognition: 'Rising Star' },
          ],
          row_count: 5,
        },
      },
      {
        key_findings: [
          '5 employees maintain consistent high performance (4+ rating)',
          'Alice Brown: 6 consecutive cycles at 4.7+ average',
          'All five show strong tenure and engagement',
          'This group represents core team strength',
        ],
        recommendations: [
          'Prioritize retention of these critical employees',
          'Create clear promotion paths for Alice and Sarah',
          'Assign leadership opportunities to develop skills',
          'Ensure competitive compensation to prevent attrition',
        ],
        alerts: [
          'High risk if any of these employees leave',
          'Alice and Sarah overdue for promotion consideration',
        ],
        next_steps: [
          'Initiate promotion reviews for top 2 performers',
          'Conduct retention conversations with all 5',
          'Review compensation against market rates',
          'Assign stretch projects to maintain engagement',
        ],
      }
    ),
  },
  {
    id: 'bonus_001',
    prompt: 'Identify employees eligible for spot bonuses',
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
          title: 'Spot Bonus Eligible',
          description: 'Employees qualifying for immediate recognition',
          properties: { value: 4, trend: 'neutral', trendValue: 'Based on recent achievements' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Estimated Cost',
          description: 'Total spot bonus allocation',
          properties: { value: '$18K', trend: 'neutral', trendValue: 'Within budget' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Spot Bonus Recommendations',
          description: 'Employees deserving immediate recognition',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'achievement', label: 'Achievement' },
              { field: 'impact', label: 'Impact' },
              { field: 'amount', label: 'Recommended Amount' },
              { field: 'urgency', label: 'Urgency' },
            ],
          },
        },
      ],
      {
        spot_bonus_eligible: {
          description: 'Employees qualifying for spot bonuses',
          columns: ['name', 'achievement', 'impact', 'amount', 'urgency'],
          data: [
            { name: 'Alice Brown', achievement: 'Led critical project to early completion', impact: 'Saved $200K in costs', amount: '$5,000', urgency: 'High' },
            { name: 'Sarah Davis', achievement: 'Delivered 3 features ahead of schedule', impact: 'Accelerated revenue by 2 months', amount: '$5,000', urgency: 'High' },
            { name: 'David Martinez', achievement: 'Reduced production bugs by 40%', impact: 'Improved customer satisfaction', amount: '$4,000', urgency: 'Medium' },
            { name: 'Olivia Taylor', achievement: 'Enabled 2 early product launches', impact: 'Generated $150K additional revenue', amount: '$4,000', urgency: 'Medium' },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          '4 employees eligible for spot bonuses based on exceptional achievements',
          'Total estimated cost: $18,000 (within quarterly budget)',
          'Alice and Sarah have high urgency - immediate recognition needed',
          'All achievements have measurable business impact',
        ],
        recommendations: [
          'Approve spot bonuses for all 4 employees',
          'Process Alice and Sarah bonuses within 1 week',
          'Announce publicly to boost team morale',
          'Document achievements for annual review reference',
        ],
        alerts: [
          'Alice and Sarah at risk if recognition delayed',
          'Spot bonuses critical for retention of top performers',
        ],
        next_steps: [
          'Get approval for $18K spot bonus allocation',
          'Process payments within next 2 weeks',
          'Schedule recognition meetings with each employee',
          'Announce achievements in team all-hands',
        ],
      }
    ),
  },
  {
    id: 'bonus_002',
    prompt: 'List employees who should not receive bonus',
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
          title: 'Bonus Ineligible',
          description: 'Employees not qualifying for bonuses',
          properties: { value: 3, trend: 'neutral', trendValue: '20% of team' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Bonus Exclusion List',
          description: 'Employees not meeting bonus criteria',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'rating', label: 'Performance' },
              { field: 'reason', label: 'Exclusion Reason' },
              { field: 'status', label: 'Status' },
              { field: 'action', label: 'Recommended Action' },
            ],
          },
        },
      ],
      {
        bonus_ineligible: {
          description: 'Employees not qualifying for bonuses',
          columns: ['name', 'rating', 'reason', 'status', 'action'],
          data: [
            { name: 'James Rodriguez', rating: '2.1/5', reason: 'Below minimum threshold (3.0)', status: 'On PIP', action: 'Performance improvement required' },
            { name: 'Kevin White', rating: '2.2/5', reason: 'Below minimum threshold (3.0)', status: 'Underperforming', action: 'Coaching program' },
            { name: 'Nina Williams', rating: '2.3/5', reason: 'Below minimum threshold (3.0)', status: 'Declining performance', action: 'Development plan' },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '3 employees (20%) do not qualify for bonuses',
          'All three below minimum threshold of 3.0/5 rating',
          'James Rodriguez on formal Performance Improvement Plan',
          'Bonus exclusion aligned with performance management',
        ],
        recommendations: [
          'Communicate bonus exclusion with clear performance expectations',
          'Provide path to bonus eligibility for next cycle',
          'Focus on performance improvement over compensation',
          'Document exclusion reasons for HR compliance',
        ],
        alerts: [
          'Handle communications sensitively to avoid demotivation',
          'Ensure legal compliance in bonus exclusion process',
        ],
        next_steps: [
          'Schedule private meetings to discuss bonus exclusion',
          'Present clear improvement plans and bonus eligibility criteria',
          'Set measurable goals for next bonus cycle',
          'Provide additional support and resources',
        ],
      }
    ),
  },
  {
    id: 'value_001',
    prompt: 'Who are the most valuable contributors this cycle?',
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
          type: 'bar_chart',
          title: 'Value Contribution Score',
          description: 'Composite score: performance + impact + delivery',
          properties: {
            x_axis: 'employee',
            y_axis: 'value_score',
            colors: { high: '#10B981', medium: '#F59E0B' },
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Most Valuable Contributors',
          description: 'Top contributors by overall value this cycle',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'value_score', label: 'Value Score' },
              { field: 'key_contributions', label: 'Key Contributions' },
              { field: 'business_impact', label: 'Business Impact' },
              { field: 'recognition', label: 'Recognition' },
            ],
          },
        },
      ],
      {
        top_contributors: {
          description: 'Most valuable contributors this cycle',
          columns: ['name', 'value_score', 'key_contributions', 'business_impact', 'recognition'],
          data: [
            { name: 'Alice Brown', value_score: '95/100', key_contributions: 'Led 2 critical projects, mentored 3 juniors', business_impact: '$200K cost savings', recognition: 'MVP' },
            { name: 'Sarah Davis', value_score: '92/100', key_contributions: 'Delivered 3 major features, improved processes', business_impact: '$150K revenue acceleration', recognition: 'Star Performer' },
            { name: 'Olivia Taylor', value_score: '88/100', key_contributions: 'Enabled 2 early launches, quality champion', business_impact: '$150K additional revenue', recognition: 'High Impact' },
            { name: 'David Martinez', value_score: '85/100', key_contributions: 'Reduced bugs 40%, mentored team', business_impact: 'Improved customer satisfaction 25%', recognition: 'Quality Leader' },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          '4 employees identified as most valuable contributors',
          'Alice Brown leads with 95/100 value score',
          'Combined business impact: $500K+ in value creation',
          'All four also serve as mentors and team leaders',
        ],
        recommendations: [
          'Recognize publicly as cycle MVPs',
          'Award premium bonuses (20-25% of base)',
          'Fast-track for promotion consideration',
          'Ensure retention through competitive compensation',
        ],
        alerts: [
          'Critical retention risk if these employees leave',
          'External recruiters likely targeting these profiles',
        ],
        next_steps: [
          'Schedule executive recognition meetings',
          'Process premium bonus allocations',
          'Discuss promotion and career growth paths',
          'Conduct market compensation analysis',
        ],
      }
    ),
  },
  {
    id: 'cost_001',
    prompt: 'List employees with low performance and high salary cost',
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
          title: 'High Cost Low Performers',
          description: 'Employees with unfavorable cost/performance ratio',
          properties: { value: 2, trend: 'down', trendValue: 'Optimization needed' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Potential Savings',
          description: 'Annual cost if optimized',
          properties: { value: '$180K', trend: 'neutral', trendValue: 'Through reallocation' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Cost-Performance Analysis',
          description: 'Employees with high salary but low performance',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'salary_band', label: 'Salary Band' },
              { field: 'performance', label: 'Performance' },
              { field: 'cost_ratio', label: 'Cost/Value Ratio' },
              { field: 'action', label: 'Recommended Action' },
            ],
          },
        },
      ],
      {
        high_cost_low_performance: {
          description: 'Employees with unfavorable cost-performance ratio',
          columns: ['name', 'salary_band', 'performance', 'cost_ratio', 'action'],
          data: [
            { name: 'James Rodriguez', salary_band: '$95K-$105K', performance: '2.1/5', cost_ratio: '3.2x (Poor)', action: 'PIP or role change' },
            { name: 'Kevin White', salary_band: '$85K-$95K', performance: '2.2/5', cost_ratio: '2.8x (Poor)', action: 'Performance review' },
          ],
          row_count: 2,
        },
      },
      {
        key_findings: [
          '2 employees have significantly unfavorable cost-performance ratios',
          'James Rodriguez: $100K+ salary with 2.1/5 performance',
          'Kevin White: $90K salary with 2.2/5 performance',
          'Combined annual cost: $190K for bottom-tier performance',
        ],
        recommendations: [
          'Immediate Performance Improvement Plans for both',
          'Consider role reassignment or level adjustment',
          'If no improvement in 90 days, evaluate separation',
          'Reallocate budget to high performers or new hires',
        ],
        alerts: [
          'CRITICAL: Cost-performance mismatch requires urgent action',
          'Potential $180K annual savings through optimization',
        ],
        next_steps: [
          'Initiate formal PIP process within 1 week',
          'Set clear 90-day improvement milestones',
          'Prepare contingency plans for potential separation',
          'Review compensation structure for team alignment',
        ],
      }
    ),
  },
  {
    id: 'util_001',
    prompt: 'Identify roles with low utilization',
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
          title: 'Low Utilization Roles',
          description: 'Employees with <60% allocation',
          properties: { value: 4, trend: 'neutral', trendValue: '27% of team' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Underutilized Resources',
          description: 'Team members with low project allocation',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'role', label: 'Role' },
              { field: 'allocation', label: 'Allocation %' },
              { field: 'status', label: 'Status' },
              { field: 'action', label: 'Recommended Action' },
            ],
          },
        },
      ],
      {
        low_utilization: {
          description: 'Employees with allocation below 60%',
          columns: ['name', 'role', 'allocation', 'status', 'action'],
          data: [
            { name: 'Ian Mitchell', role: 'Senior Developer', allocation: '45%', status: 'On bench', action: 'Assign to active project' },
            { name: 'Bob Johnson', role: 'QA Engineer', allocation: '55%', status: 'Partial allocation', action: 'Increase project involvement' },
            { name: 'Ryan Adams', role: 'Developer', allocation: '50%', status: 'Between projects', action: 'Assign to new initiative' },
            { name: 'Tyler Brooks', role: 'Developer', allocation: '58%', status: 'Underutilized', action: 'Add to high-priority project' },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          '4 employees (27%) have utilization below 60%',
          'Ian Mitchell most underutilized at 45% allocation',
          'Combined unutilized capacity: ~160% (1.6 FTE equivalent)',
          'Opportunity to take on additional projects without new hires',
        ],
        recommendations: [
          'Assign Ian Mitchell to critical project immediately',
          'Increase allocations for all four to 80-90% range',
          'Review project pipeline for assignment opportunities',
          'Consider training/upskilling during low utilization periods',
        ],
        alerts: [
          'Wasting ~$120K annually in underutilized capacity',
          'Low utilization can lead to disengagement and attrition',
        ],
        next_steps: [
          'Meet with each employee to discuss availability',
          'Assign to active projects within 2 weeks',
          'Monitor utilization weekly until optimized',
          'Implement better resource planning processes',
        ],
      }
    ),
  },
  {
    id: 'util_002',
    prompt: 'List employees with no critical project involvement',
    category: 'performance',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 1,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'No Critical Projects',
          description: 'Employees not on high-priority initiatives',
          properties: { value: 5, trend: 'neutral', trendValue: '33% of team' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Non-Critical Assignments',
          description: 'Employees working only on low-priority projects',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'current_projects', label: 'Current Projects' },
              { field: 'priority_level', label: 'Priority Level' },
              { field: 'skills', label: 'Key Skills' },
              { field: 'action', label: 'Action' },
            ],
          },
        },
      ],
      {
        non_critical_assignments: {
          description: 'Employees not involved in critical projects',
          columns: ['name', 'current_projects', 'priority_level', 'skills', 'action'],
          data: [
            { name: 'Ian Mitchell', current_projects: 'None active', priority_level: 'N/A', skills: 'Backend, Python', action: 'Assign to Project Alpha' },
            { name: 'Bob Johnson', current_projects: 'Maintenance tasks', priority_level: 'Low', skills: 'QA, Testing', action: 'Move to Project Beta' },
            { name: 'Ryan Adams', current_projects: 'Internal tools', priority_level: 'Low', skills: 'Frontend, React', action: 'Assign to Project Gamma' },
            { name: 'Tyler Brooks', current_projects: 'Documentation', priority_level: 'Low', skills: 'Full-stack', action: 'Add to Project Delta' },
            { name: 'Nina Williams', current_projects: 'Support tickets', priority_level: 'Low', skills: 'Support, Testing', action: 'Transition to development' },
          ],
          row_count: 5,
        },
      },
      {
        key_findings: [
          '5 employees (33%) not involved in any critical projects',
          'Ian Mitchell has no active project assignments',
          'Most are working on low-priority maintenance or support',
          'Skills available: Backend, Frontend, QA, Full-stack',
        ],
        recommendations: [
          'Reassign all five to high-priority projects',
          'Prioritize Ian Mitchell - completely unassigned',
          'Match skills to critical project needs',
          'Reduce dependency on external contractors',
        ],
        alerts: [
          'Critical projects may be understaffed while resources idle',
          'Low-priority work can be deferred or automated',
        ],
        next_steps: [
          'Review critical project staffing needs',
          'Assign employees to projects within 1 week',
          'Transition low-priority work to automation or defer',
          'Implement better resource allocation planning',
        ],
      }
    ),
  },
  {
    id: 'util_003',
    prompt: 'Identify employees with skills mismatch vs current needs',
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
          title: 'Skills Mismatch',
          description: 'Employees with outdated or misaligned skills',
          properties: { value: 3, trend: 'down', trendValue: 'Requires upskilling' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Skills Gap Analysis',
          description: 'Employees whose skills don\'t match current needs',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'current_skills', label: 'Current Skills' },
              { field: 'needed_skills', label: 'Needed Skills' },
              { field: 'gap', label: 'Gap Severity' },
              { field: 'action', label: 'Action' },
            ],
          },
        },
      ],
      {
        skills_mismatch: {
          description: 'Employees with skills not aligned to current needs',
          columns: ['name', 'current_skills', 'needed_skills', 'gap', 'action'],
          data: [
            { name: 'Kevin White', current_skills: 'Legacy Java, XML', needed_skills: 'React, Node.js, Cloud', gap: 'High', action: 'Upskill or reassign' },
            { name: 'Nina Williams', current_skills: 'Manual Testing', needed_skills: 'Test Automation, CI/CD', gap: 'Medium', action: 'Training program' },
            { name: 'Ian Mitchell', current_skills: 'Monolith architecture', needed_skills: 'Microservices, K8s', gap: 'Medium', action: 'Mentorship + training' },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '3 employees have significant skills mismatch with current needs',
          'Kevin White has highest gap - legacy skills vs modern stack',
          'Team moving to cloud-native, microservices architecture',
          'Skills gaps correlate with low performance ratings',
        ],
        recommendations: [
          'Enroll in intensive upskilling programs (3-6 months)',
          'Pair with senior engineers for mentorship',
          'Consider role reassignment if upskilling not feasible',
          'Invest in training budget: ~$15K for all three',
        ],
        alerts: [
          'Kevin White may not be salvageable - consider replacement',
          'Skills gaps will worsen as tech stack evolves',
        ],
        next_steps: [
          'Assess willingness and ability to upskill',
          'Enroll in training programs within 2 weeks',
          'Set 90-day skill acquisition milestones',
          'Evaluate progress monthly - pivot if needed',
        ],
      }
    ),
  },
  {
    id: 'util_004',
    prompt: 'Show employees with long bench time / idle time',
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
          title: 'On Bench',
          description: 'Employees with extended idle time',
          properties: { value: 2, trend: 'down', trendValue: 'Needs assignment' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Avg Bench Time',
          description: 'Average days without active project',
          properties: { value: '45 days', trend: 'up', trendValue: 'Above threshold' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Extended Bench Time',
          description: 'Employees idle for >30 days',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'bench_days', label: 'Days on Bench' },
              { field: 'last_project', label: 'Last Project' },
              { field: 'cost_impact', label: 'Cost Impact' },
              { field: 'action', label: 'Action' },
            ],
          },
        },
      ],
      {
        bench_time: {
          description: 'Employees with extended idle periods',
          columns: ['name', 'bench_days', 'last_project', 'cost_impact', 'action'],
          data: [
            { name: 'Ian Mitchell', bench_days: '62 days', last_project: 'Project Sunset (completed)', cost_impact: '$15K wasted', action: 'Assign immediately or exit' },
            { name: 'Ryan Adams', bench_days: '28 days', last_project: 'Internal tools (low priority)', cost_impact: '$7K wasted', action: 'Assign to active project' },
          ],
          row_count: 2,
        },
      },
      {
        key_findings: [
          '2 employees on bench for extended periods (>28 days)',
          'Ian Mitchell: 62 days idle - critical cost waste',
          'Combined cost impact: $22K in unproductive salary',
          'No upcoming projects identified for either employee',
        ],
        recommendations: [
          'URGENT: Assign Ian Mitchell within 1 week or consider separation',
          'Assign Ryan Adams to active project immediately',
          'If no suitable projects, evaluate role necessity',
          'Implement better resource planning to prevent bench time',
        ],
        alerts: [
          'CRITICAL: Ian Mitchell - 62 days idle is unacceptable',
          '$22K wasted in last 2 months on idle resources',
        ],
        next_steps: [
          'Emergency meeting to find assignment for Ian Mitchell',
          'If no project available in 1 week, initiate separation',
          'Assign Ryan Adams to Project Beta',
          'Implement weekly resource utilization reviews',
        ],
      }
    ),
  },
  {
    id: 'util_005',
    prompt: 'Identify employees with lowest business impact',
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
          type: 'bar_chart',
          title: 'Business Impact Score',
          description: 'Composite score: deliverables + quality + value',
          properties: {
            x_axis: 'employee',
            y_axis: 'impact_score',
            threshold: 40,
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Lowest Business Impact',
          description: 'Employees with minimal contribution to business outcomes',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'impact_score', label: 'Impact Score' },
              { field: 'deliverables', label: 'Deliverables' },
              { field: 'value_add', label: 'Value Add' },
              { field: 'recommendation', label: 'Recommendation' },
            ],
          },
        },
      ],
      {
        low_impact: {
          description: 'Employees with lowest business impact scores',
          columns: ['name', 'impact_score', 'deliverables', 'value_add', 'recommendation'],
          data: [
            { name: 'Ian Mitchell', impact_score: '15/100', deliverables: 'None in 60 days', value_add: 'Minimal', recommendation: 'Reassign or exit' },
            { name: 'James Rodriguez', impact_score: '25/100', deliverables: 'Low quality, delayed', value_add: 'Below expectations', recommendation: 'PIP required' },
            { name: 'Kevin White', impact_score: '28/100', deliverables: 'Minimal output', value_add: 'Limited', recommendation: 'Upskill or reassign' },
            { name: 'Nina Williams', impact_score: '32/100', deliverables: 'Support tasks only', value_add: 'Low priority work', recommendation: 'Role transition' },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          '4 employees (27%) have business impact scores below threshold (40)',
          'Ian Mitchell: Lowest at 15/100 - no deliverables in 60 days',
          'Combined salary cost: ~$360K for minimal business value',
          'All four also show low performance ratings',
        ],
        recommendations: [
          'Immediate action required for Ian Mitchell - consider separation',
          'Formal PIPs for James Rodriguez and Kevin White',
          'Transition Nina Williams to development role or exit',
          'Reallocate budget to high-impact employees',
        ],
        alerts: [
          'CRITICAL: $360K annual cost for minimal business impact',
          'Ian Mitchell requires immediate decision - assign or exit',
        ],
        next_steps: [
          'Executive review of Ian Mitchell status within 3 days',
          'Initiate PIP process for bottom 3 performers',
          'Evaluate cost-benefit of retention vs replacement',
          'Plan workforce optimization strategy',
        ],
      }
    ),
  },
  {
    id: 'layoff_001',
    prompt: 'Suggest potential layoff candidates',
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
          title: 'Optimization Candidates',
          description: 'Employees for potential workforce optimization',
          properties: { value: 3, trend: 'neutral', trendValue: 'Based on multiple factors' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Potential Annual Savings',
          description: 'Cost reduction through optimization',
          properties: { value: '$280K', trend: 'neutral', trendValue: 'If implemented' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Workforce Optimization Analysis',
          description: 'Data-driven candidates for potential separation',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'performance', label: 'Performance' },
              { field: 'impact_score', label: 'Impact Score' },
              { field: 'cost', label: 'Annual Cost' },
              { field: 'risk_factors', label: 'Risk Factors' },
              { field: 'priority', label: 'Priority' },
            ],
          },
        },
      ],
      {
        optimization_candidates: {
          description: 'Employees identified for potential workforce optimization',
          columns: ['name', 'performance', 'impact_score', 'cost', 'risk_factors', 'priority'],
          data: [
            { name: 'Ian Mitchell', performance: 'N/A (No output)', impact_score: '15/100', cost: '$95K', risk_factors: '62 days bench, no contributions, low utilization', priority: 'High' },
            { name: 'James Rodriguez', performance: '2.1/5', impact_score: '25/100', cost: '$100K', risk_factors: 'Declining performance, high cost/value ratio, PIP', priority: 'High' },
            { name: 'Kevin White', performance: '2.2/5', impact_score: '28/100', cost: '$90K', risk_factors: 'Skills mismatch, low performance, limited impact', priority: 'Medium' },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '3 employees identified as optimization candidates based on data',
          'Combined annual cost: $285K for minimal business value',
          'Ian Mitchell: 62 days idle with no measurable output',
          'James Rodriguez: Lowest performer with high salary cost',
          'All three show multiple risk factors and low business impact',
        ],
        recommendations: [
          'URGENT: Make decision on Ian Mitchell within 1 week',
          'Complete PIP process for James Rodriguez (90 days max)',
          'Evaluate Kevin White for upskilling vs replacement',
          'Ensure legal compliance and documentation for any separations',
          'Plan knowledge transfer and transition periods',
        ],
        alerts: [
          'CRITICAL: Ian Mitchell decision cannot be delayed further',
          'Legal review required before any separation actions',
          'Ensure compliance with employment laws and company policies',
        ],
        next_steps: [
          'Executive review and decision on workforce optimization',
          'Consult with HR and legal on separation process',
          'Prepare separation packages and documentation',
          'Plan communication strategy for team impact',
          'Identify critical knowledge transfer requirements',
        ],
      }
    ),
  },
];
