import { RAGApiResponse, AsyncComponent, AsyncLayout } from '@/types/ragApi';
import { MOCK_EMPLOYEES } from './team';
import { MOCK_PROJECTS } from './projects';
import { PERFORMANCE_CHAT_PROMPTS } from './chatPerformance';
import { COST_OPTIMIZATION_PROMPTS } from './chatCostOptimization';

/**
 * Mock Chat/RAG Data - Pre-defined prompts and AI responses
 * Includes realistic RAG responses with layouts, components, datasets, and insights
 */

export interface MockChatPrompt {
  id: string;
  prompt: string;
  category: 'employee' | 'project' | 'mental_health' | 'attrition' | 'performance';
  response: RAGApiResponse;
}

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

export const MOCK_CHAT_PROMPTS: MockChatPrompt[] = [
  // Employee Analysis Prompts
  {
    id: 'emp_001',
    prompt: 'Show me all high-risk employees',
    category: 'employee',
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
          title: 'High Risk Employees',
          description: 'Total number of employees at high attrition risk',
          properties: { value: 5, trend: 'up', trendValue: '+1 from last month' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Risk Percentage',
          description: 'Percentage of team at high risk',
          properties: { value: '33%', trend: 'up', trendValue: '+6.7%' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'High Risk Employees',
          description: 'Detailed list of employees requiring immediate attention',
          properties: {
            columns: [
              { field: 'name', label: 'Employee Name' },
              { field: 'mental_health', label: 'Mental Health' },
              { field: 'motivation_factor', label: 'Motivation' },
              { field: 'primary_trigger', label: 'Primary Trigger' },
              { field: 'total_allocation', label: 'Allocation %' },
            ],
            sortable: true,
            searchable: true,
          },
        },
      ],
      {
        high_risk_employees: {
          description: 'Employees with high attrition risk',
          columns: ['name', 'mental_health', 'motivation_factor', 'primary_trigger', 'total_allocation'],
          data: MOCK_EMPLOYEES.filter(e => e.suggested_risk === 'High').map(e => ({
            name: e.name,
            mental_health: e.mental_health,
            motivation_factor: e.motivation_factor,
            primary_trigger: e.primary_trigger || 'None',
            total_allocation: `${e.total_allocation}%`,
          })),
          row_count: 5,
        },
      },
      {
        key_findings: [
          '5 employees (33% of team) are at high attrition risk',
          'Mental health is the primary trigger for 3 out of 5 high-risk employees',
          '2 employees are overallocated (>100%) which increases burnout risk',
          'All high-risk employees are on critical projects',
        ],
        recommendations: [
          'Schedule immediate 1-on-1s with Sarah Johnson, Emily Rodriguez, and James Anderson',
          'Reduce allocation for Emily Rodriguez (110%) and Michelle Davis (105%)',
          'Provide mental health support resources to employees with MH triggers',
          'Consider redistributing critical project assignments',
        ],
        alerts: [
          'Emily Rodriguez shows multiple risk factors: Low mental health, High personal reasons, 110% allocation',
          'James Anderson has all three triggers active: MH, MT, PR',
        ],
        next_steps: [
          'Create action items for manager 1-on-1s',
          'Review project allocations in next planning meeting',
          'Share mental health resources with affected team members',
        ],
      }
    ),
  },
  {
    id: 'emp_002',
    prompt: 'Who are my top performers?',
    category: 'employee',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 1,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'chart_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'chart_1',
          type: 'bar_chart',
          title: 'Top Performers by Risk Score',
          description: 'Employees with low attrition risk and high performance',
          properties: {
            x_axis: 'name',
            y_axis: 'performance_score',
            colors: { low_risk: '#10B981' },
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Top Performing Team Members',
          description: 'Low-risk employees with strong performance',
          properties: {
            columns: [
              { field: 'name', label: 'Employee Name' },
              { field: 'age', label: 'Age' },
              { field: 'mental_health', label: 'Mental Health' },
              { field: 'motivation_factor', label: 'Motivation' },
              { field: 'total_allocation', label: 'Allocation %' },
            ],
          },
        },
      ],
      {
        top_performers: {
          description: 'Low-risk employees with strong performance indicators',
          columns: ['name', 'age', 'mental_health', 'motivation_factor', 'total_allocation'],
          data: MOCK_EMPLOYEES.filter(e => e.suggested_risk === 'Low').map(e => ({
            name: e.name,
            age: e.age,
            mental_health: e.mental_health,
            motivation_factor: e.motivation_factor,
            total_allocation: `${e.total_allocation}%`,
          })),
          row_count: 5,
        },
      },
      {
        key_findings: [
          '5 employees (33% of team) are classified as top performers with low attrition risk',
          'All top performers have High mental health scores',
          'Average allocation for top performers is 73%, well below burnout threshold',
          'Top performers are evenly distributed across age groups (26-44)',
        ],
        recommendations: [
          'Recognize and reward top performers to maintain engagement',
          'Consider these employees for leadership development opportunities',
          'Use top performers as mentors for struggling team members',
          'Ensure competitive compensation to retain top talent',
        ],
        next_steps: [
          'Schedule recognition meetings with top performers',
          'Discuss career development opportunities',
          'Create mentorship pairings with high-risk employees',
        ],
      }
    ),
  },
  {
    id: 'emp_003',
    prompt: 'List employees with mental health concerns',
    category: 'mental_health',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 2,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'pie_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'metric_1', position: { row: 0, col: 1, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'pie_1',
          type: 'pie_chart',
          title: 'Mental Health Distribution',
          description: 'Team mental health score breakdown',
          properties: {
            data_field: 'mental_health_distribution',
            colors: { High: '#10B981', Medium: '#F59E0B', Low: '#EF4444' },
          },
        },
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'Low Mental Health',
          description: 'Employees requiring support',
          properties: { value: 4, trend: 'neutral' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Employees with Mental Health Concerns',
          description: 'Team members with Low mental health scores',
          properties: {
            columns: [
              { field: 'name', label: 'Employee Name' },
              { field: 'mental_health', label: 'Mental Health' },
              { field: 'all_triggers', label: 'Active Triggers' },
              { field: 'total_allocation', label: 'Allocation %' },
              { field: 'project_criticality', label: 'Project Criticality' },
            ],
          },
        },
      ],
      {
        mental_health_concerns: {
          description: 'Employees with low mental health scores',
          columns: ['name', 'mental_health', 'all_triggers', 'total_allocation', 'project_criticality'],
          data: MOCK_EMPLOYEES.filter(e => e.mental_health === 'Low').map(e => ({
            name: e.name,
            mental_health: e.mental_health,
            all_triggers: e.all_triggers || 'None',
            total_allocation: `${e.total_allocation}%`,
            project_criticality: e.project_criticality,
          })),
          row_count: 4,
        },
        mental_health_distribution: {
          description: 'Distribution of mental health scores',
          columns: ['level', 'count', 'percentage'],
          data: [
            { level: 'High', count: 7, percentage: 47 },
            { level: 'Medium', count: 4, percentage: 27 },
            { level: 'Low', count: 4, percentage: 27 },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '4 employees (27% of team) have Low mental health scores - double the industry average',
          'Emily Rodriguez: Low MH + 110% overallocation = critical burnout risk',
          'Christopher Lee: Low MH + 95% allocation on E-Commerce Platform (high-pressure)',
          'Michelle Davis: Low MH + 105% allocation + personal reasons trigger',
          '100% of Low MH employees are on High criticality projects - correlation identified',
        ],
        recommendations: [
          'IMMEDIATE: Reduce Emily Rodriguez to 85% allocation within 48 hours',
          'Provide confidential EAP access and mental health resources to all 4 employees',
          'Redistribute high-pressure project work to employees with High mental health scores',
          'Implement mandatory wellness days - no meetings, focus on recovery',
          'Consider temporary project timeline extensions to reduce pressure',
        ],
        alerts: [
          'CRITICAL: Emily Rodriguez at severe burnout risk - 110% allocation unsustainable',
          'HIGH: Christopher Lee showing declining performance due to mental health',
          'MEDIUM: Michelle Davis balancing work stress with personal challenges',
        ],
        next_steps: [
          'Emergency allocation adjustment for Emily Rodriguez today',
          'Schedule confidential wellness check-ins with all 4 employees this week',
          'Share EAP contact information and mental health resources',
          'Implement weekly pulse checks for mental health monitoring',
          'Plan team-wide stress management workshop within 2 weeks',
        ],
      }
    ),
  },
  // Project Analysis Prompts
  {
    id: 'proj_001',
    prompt: 'Which projects are at risk?',
    category: 'project',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 2,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'pie_1', position: { row: 0, col: 1, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'High Risk Projects',
          description: 'Projects with high criticality',
          properties: { value: 8, trend: 'up', trendValue: '+2 from last quarter' },
        },
        {
          id: 'pie_1',
          type: 'pie_chart',
          title: 'Project Risk Distribution',
          description: 'Breakdown by criticality level',
          properties: {
            data_field: 'risk_distribution',
            colors: { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' },
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'High Risk Projects',
          description: 'Projects requiring immediate attention',
          properties: {
            columns: [
              { field: 'title', label: 'Project Name' },
              { field: 'business_unit', label: 'Business Unit' },
              { field: 'criticality', label: 'Risk Level' },
              { field: 'go_live_date', label: 'Go Live Date' },
              { field: 'team_size', label: 'Team Size' },
            ],
          },
        },
      ],
      {
        high_risk_projects: {
          description: 'Projects with high criticality',
          columns: ['title', 'business_unit', 'criticality', 'go_live_date', 'team_size'],
          data: MOCK_PROJECTS.filter(p => p.criticality === 'High').map(p => ({
            title: p.title,
            business_unit: p.business_unit,
            criticality: p.criticality,
            go_live_date: p.go_live_date,
            team_size: p.assigned_to.length,
          })),
          row_count: 8,
        },
        risk_distribution: {
          description: 'Project risk level distribution',
          columns: ['level', 'count', 'percentage'],
          data: [
            { level: 'High', count: 8, percentage: 40 },
            { level: 'Medium', count: 7, percentage: 35 },
            { level: 'Low', count: 5, percentage: 25 },
          ],
          row_count: 3,
        },
      },
      {
        key_findings: [
          '8 out of 20 projects (40%) are classified as High criticality',
          'E-Commerce Platform Redesign has 3 team members at high attrition risk',
          'Mobile App Development is understaffed with only 3 members for Q2 2025 deadline',
          'Digital Transformation Initiative has tight Q1 2025 timeline with 4 members',
          'Cloud Migration Project shows resource constraints with 2 members only',
        ],
        recommendations: [
          'Immediately staff up Mobile App Development - add 2 senior developers',
          'Conduct retention conversations with E-Commerce Platform team members',
          'Extend Digital Transformation timeline by 1 quarter or add resources',
          'Prioritize Cloud Migration - critical infrastructure dependency',
          'Implement weekly status reviews for all high-risk projects',
        ],
        alerts: [
          'CRITICAL: E-Commerce Platform - 3 of 3 team members at high attrition risk',
          'URGENT: Mobile App Development - 50% understaffed for aggressive timeline',
          'WARNING: 5 high-risk projects have overlapping resource dependencies',
        ],
        next_steps: [
          'Emergency staffing review for Mobile App Development this week',
          'Schedule retention meetings with E-Commerce Platform team',
          'Conduct project timeline feasibility analysis',
          'Create resource reallocation plan for Q1 2025',
          'Set up bi-weekly executive project risk reviews',
        ],
      }
    ),
  },
  {
    id: 'proj_002',
    prompt: 'Show project allocation by team',
    category: 'project',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 1,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'bar_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'bar_1',
          type: 'bar_chart',
          title: 'Team Allocation by Employee',
          description: 'Current project allocation percentages',
          properties: {
            x_axis: 'employee_name',
            y_axis: 'allocation_percentage',
            colors: { overallocated: '#EF4444', normal: '#10B981' },
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Detailed Allocation Breakdown',
          description: 'Employee allocation across all projects',
          properties: {
            columns: [
              { field: 'employee_name', label: 'Employee' },
              { field: 'total_allocation', label: 'Total %' },
              { field: 'project_count', label: 'Projects' },
              { field: 'status', label: 'Status' },
            ],
          },
        },
      ],
      {
        allocation_data: {
          description: 'Team member allocation percentages',
          columns: ['employee_name', 'total_allocation', 'project_count', 'status'],
          data: MOCK_EMPLOYEES.map(e => ({
            employee_name: e.name,
            total_allocation: `${e.total_allocation}%`,
            project_count: MOCK_PROJECTS.filter(p => p.assigned_to.some(u => u.id === e.user_info.id)).length,
            status: e.total_allocation > 100 ? 'Overallocated' : e.total_allocation > 90 ? 'Near Capacity' : 'Normal',
          })),
          row_count: 15,
        },
      },
      {
        key_findings: [
          'Average team allocation is 86.3%',
          '2 employees are overallocated (>100%)',
          '5 employees are near capacity (90-100%)',
          '8 employees have healthy allocation levels (<90%)',
        ],
        recommendations: [
          'Immediately reduce allocation for Emily Rodriguez (110%) and Michelle Davis (105%)',
          'Monitor employees near capacity to prevent burnout',
          'Consider hiring or redistributing work for overallocated team members',
          'Implement allocation caps to prevent future overallocation',
        ],
        alerts: [
          'Emily Rodriguez: 110% allocation across 2 high-criticality projects',
          'Michelle Davis: 105% allocation with Low mental health score',
        ],
        next_steps: [
          'Review and adjust project assignments',
          'Create action items for allocation rebalancing',
          'Discuss resource needs with leadership',
        ],
      }
    ),
  },
  // Attrition Analysis Prompts
  {
    id: 'attr_001',
    prompt: 'Attrition risk analysis',
    category: 'attrition',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 2,
        rows: 3,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'small' },
          { component_id: 'metric_2', position: { row: 0, col: 1, span_col: 1, span_row: 1 }, size: 'small' },
          { component_id: 'line_1', position: { row: 1, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
          { component_id: 'pie_1', position: { row: 2, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_1', position: { row: 2, col: 1, span_col: 1, span_row: 1 }, size: 'medium' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'Team Attrition Risk',
          description: 'Overall team risk score',
          properties: { value: '42.5%', trend: 'up', trendValue: '+5% from last month' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'High Risk Count',
          description: 'Employees at high risk',
          properties: { value: 5, trend: 'up', trendValue: '+1' },
        },
        {
          id: 'line_1',
          type: 'line_chart',
          title: 'Attrition Risk Trend (6 Months)',
          description: 'Historical trend of attrition risk levels',
          properties: {
            x_axis: 'month',
            y_axis: 'count',
            groupBy: 'risk_level',
          },
        },
        {
          id: 'pie_1',
          type: 'pie_chart',
          title: 'Risk Distribution',
          description: 'Current risk level breakdown',
          properties: {
            data_field: 'risk_distribution',
            colors: { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' },
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Primary Triggers',
          description: 'Top attrition risk factors',
          properties: {
            columns: [
              { field: 'trigger', label: 'Trigger' },
              { field: 'count', label: 'Employees' },
              { field: 'percentage', label: '%' },
            ],
          },
        },
      ],
      {
        risk_distribution: {
          description: 'Attrition risk level distribution',
          columns: ['level', 'count', 'percentage'],
          data: [
            { level: 'High', count: 5, percentage: 33 },
            { level: 'Medium', count: 5, percentage: 33 },
            { level: 'Low', count: 5, percentage: 33 },
          ],
          row_count: 3,
        },
        trigger_analysis: {
          description: 'Primary attrition triggers',
          columns: ['trigger', 'count', 'percentage'],
          data: [
            { trigger: 'Mental Health (MH)', count: 5, percentage: 33 },
            { trigger: 'Motivation (MT)', count: 3, percentage: 20 },
            { trigger: 'Career Opportunities (CO)', count: 2, percentage: 13 },
            { trigger: 'Personal Reasons (PR)', count: 5, percentage: 33 },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          '5 employees (33% of team) are at high attrition risk - immediate action required',
          'Alice Brown has 3 simultaneous triggers: Mental Health, Motivation, Career Opportunities',
          'Emily Rodriguez is critically overallocated at 110% with Low mental health',
          'David Martinez shows declining engagement despite High project criticality',
          '60% of high-risk employees cite lack of career growth as primary concern',
        ],
        recommendations: [
          'URGENT: Reduce Emily Rodriguez workload to 85% immediately',
          'Create personalized career development plan for Alice Brown within 2 weeks',
          'Implement mental health support program with EAP access',
          'Offer flexible work arrangements to address work-life balance concerns',
          'Conduct skip-level meetings to understand root causes',
        ],
        alerts: [
          'CRITICAL: Alice Brown - 3 active triggers, flight risk within 30 days',
          'URGENT: Emily Rodriguez - burnout risk due to 110% allocation',
          'WARNING: Losing any of these 5 employees would impact 8 critical projects',
        ],
        next_steps: [
          'Emergency workload rebalancing for Emily Rodriguez by end of week',
          'Schedule retention conversations with all 5 employees within 5 days',
          'Present career advancement opportunities to Alice and David',
          'Launch team-wide engagement survey to identify broader issues',
          'Create 90-day retention action plans with measurable milestones',
        ],
      }
    ),
  },
  {
    id: 'attr_002',
    prompt: 'Top reasons for employee attrition',
    category: 'attrition',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 2,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'bar_1', position: { row: 0, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'medium' },
          { component_id: 'table_2', position: { row: 1, col: 1, span_col: 1, span_row: 1 }, size: 'medium' },
        ],
      },
      [
        {
          id: 'bar_1',
          type: 'bar_chart',
          title: 'Attrition Factors by Severity',
          description: 'Count of employees affected by each factor',
          properties: {
            x_axis: 'factor',
            y_axis: 'count',
            colors: { high: '#EF4444', medium: '#F59E0B', low: '#10B981' },
          },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Factor Analysis',
          description: 'Detailed breakdown of attrition factors',
          properties: {
            columns: [
              { field: 'factor', label: 'Factor' },
              { field: 'high', label: 'High' },
              { field: 'medium', label: 'Medium' },
              { field: 'low', label: 'Low' },
            ],
          },
        },
        {
          id: 'table_2',
          type: 'data_table',
          title: 'Recommended Actions',
          description: 'Prioritized interventions',
          properties: {
            columns: [
              { field: 'action', label: 'Action' },
              { field: 'priority', label: 'Priority' },
              { field: 'impact', label: 'Impact' },
            ],
          },
        },
      ],
      {
        factor_breakdown: {
          description: 'Attrition factors by severity level',
          columns: ['factor', 'high', 'medium', 'low'],
          data: [
            { factor: 'Mental Health', high: 4, medium: 4, low: 7 },
            { factor: 'Motivation', high: 4, medium: 5, low: 6 },
            { factor: 'Career Opportunities', high: 5, medium: 6, low: 4 },
            { factor: 'Personal Reasons', high: 4, medium: 5, low: 6 },
          ],
          row_count: 4,
        },
        recommended_actions: {
          description: 'Prioritized retention actions',
          columns: ['action', 'priority', 'impact'],
          data: [
            { action: 'Mental health support program', priority: 'High', impact: 'Addresses 4 high-risk employees' },
            { action: 'Career development workshops', priority: 'High', impact: 'Addresses 5 employees with low CO' },
            { action: 'Flexible work arrangements', priority: 'Medium', impact: 'Helps with personal reasons' },
            { action: 'Recognition and rewards program', priority: 'Medium', impact: 'Improves motivation' },
          ],
          row_count: 4,
        },
      },
      {
        key_findings: [
          'Mental Health is #1 trigger: 5 employees (33%) affected, 4 at High severity',
          'Career Opportunities crisis: 5 employees see no clear growth path in current roles',
          'Personal Reasons affecting 5 employees - work-life balance concerns dominate',
          'Motivation declining in 3 employees - lack of challenging work cited',
          'Systemic issue: 60% of high-risk employees have 2+ simultaneous triggers',
        ],
        recommendations: [
          'URGENT: Launch EAP program and mental health support within 2 weeks',
          'Create transparent career ladder with promotion criteria by end of quarter',
          'Implement flexible work policy (hybrid/remote options) immediately',
          'Assign stretch projects to unmotivated employees to increase engagement',
          'Conduct quarterly skip-level meetings to identify issues early',
        ],
        alerts: [
          'CRITICAL: Mental health crisis - 4 employees at High severity need immediate intervention',
          'WARNING: Career stagnation affecting 33% of team - promotion pipeline broken',
          'CONCERN: Work-life balance issues may trigger mass exodus if unaddressed',
        ],
        next_steps: [
          'Partner with EAP provider and launch mental health program this month',
          'HR to design career progression framework with clear milestones',
          'Survey team on flexible work preferences and implement policy',
          'Create rotation program for employees seeking new challenges',
          'Schedule monthly 1-on-1s focused on career development and wellbeing',
        ],
      }
    ),
  },
  {
    id: 'perf_001',
    prompt: 'Team utilization report',
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
          { component_id: 'bar_1', position: { row: 1, col: 0, span_col: 2, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'Average Utilization',
          description: 'Team average allocation',
          properties: { value: '86.3%', trend: 'up', trendValue: '+3.2%' },
        },
        {
          id: 'metric_2',
          type: 'metric_card',
          title: 'Overallocated',
          description: 'Employees over 100%',
          properties: { value: 2, trend: 'neutral' },
        },
        {
          id: 'bar_1',
          type: 'bar_chart',
          title: 'Utilization by Employee',
          description: 'Individual allocation percentages',
          properties: {
            x_axis: 'employee',
            y_axis: 'allocation',
            colors: { overallocated: '#EF4444', optimal: '#10B981', underutilized: '#F59E0B' },
          },
        },
      ],
      {
        utilization_data: {
          description: 'Employee utilization breakdown',
          columns: ['employee', 'allocation', 'status', 'projects'],
          data: MOCK_EMPLOYEES.map(e => ({
            employee: e.name,
            allocation: `${e.total_allocation}%`,
            status: e.total_allocation > 100 ? 'Overallocated' : e.total_allocation > 90 ? 'Optimal' : 'Underutilized',
            projects: MOCK_PROJECTS.filter(p => p.assigned_to.some(u => u.id === e.user_info.id)).length,
          })),
          row_count: 15,
        },
      },
      {
        key_findings: [
          'Team average utilization is 86.3%, up 3.2% from last month',
          '2 employees are overallocated (>100%)',
          '5 employees are optimally allocated (90-100%)',
          '8 employees are underutilized (<90%) with capacity for more work',
        ],
        recommendations: [
          'Reduce allocation for overallocated employees immediately',
          'Redistribute work from overallocated to underutilized team members',
          'Target 85-95% utilization for optimal productivity and wellbeing',
          'Monitor utilization weekly to prevent burnout',
        ],
        alerts: [
          'Emily Rodriguez at 110% - immediate rebalancing needed',
          'Michelle Davis at 105% with mental health concerns',
        ],
        next_steps: [
          'Rebalance project assignments',
          'Assign new work to underutilized employees',
          'Implement utilization monitoring dashboard',
        ],
      }
    ),
  },
  {
    id: 'perf_002',
    prompt: 'Show overallocated employees',
    category: 'performance',
    response: createRAGResponse(
      {
        type: 'grid',
        columns: 1,
        rows: 2,
        responsive: true,
        spacing: 'md',
        component_arrangement: [
          { component_id: 'metric_1', position: { row: 0, col: 0, span_col: 1, span_row: 1 }, size: 'small' },
          { component_id: 'table_1', position: { row: 1, col: 0, span_col: 1, span_row: 1 }, size: 'large' },
        ],
      },
      [
        {
          id: 'metric_1',
          type: 'metric_card',
          title: 'Overallocated Employees',
          description: 'Team members over 100% allocation',
          properties: { value: 2, trend: 'down', trendValue: '-1 from last month' },
        },
        {
          id: 'table_1',
          type: 'data_table',
          title: 'Overallocated Team Members',
          description: 'Employees requiring immediate workload adjustment',
          properties: {
            columns: [
              { field: 'name', label: 'Employee' },
              { field: 'allocation', label: 'Allocation %' },
              { field: 'projects', label: 'Active Projects' },
              { field: 'mental_health', label: 'Mental Health' },
              { field: 'suggested_risk', label: 'Attrition Risk' },
            ],
          },
        },
      ],
      {
        overallocated_employees: {
          description: 'Employees with >100% allocation',
          columns: ['name', 'allocation', 'projects', 'mental_health', 'suggested_risk'],
          data: MOCK_EMPLOYEES.filter(e => e.total_allocation > 100).map(e => ({
            name: e.name,
            allocation: `${e.total_allocation}%`,
            projects: MOCK_PROJECTS.filter(p => p.assigned_to.some(u => u.id === e.user_info.id)).length,
            mental_health: e.mental_health,
            suggested_risk: e.suggested_risk,
          })),
          row_count: 2,
        },
      },
      {
        key_findings: [
          '2 employees critically overallocated: Emily (110%) and Michelle (105%)',
          'Both are on E-Commerce Platform Redesign - project is overstaffed on paper but understaffed in reality',
          'Emily Rodriguez: 110% + Low MH + High attrition risk = imminent burnout/resignation',
          'Michelle Davis: 105% + Low MH + Personal reasons trigger = unsustainable situation',
          '4 employees underutilized (<70%) - Ian Mitchell at only 45% allocation',
        ],
        recommendations: [
          'IMMEDIATE: Reduce Emily to 85% by reassigning 25% to Ian Mitchell (currently 45%)',
          'IMMEDIATE: Reduce Michelle to 85% by reassigning 20% to Bob Johnson (currently 55%)',
          'Conduct project scope review for E-Commerce Platform - may be overcommitted',
          'Implement allocation caps: no employee >90% to prevent future overallocation',
          'Weekly allocation monitoring to catch issues before they become critical',
        ],
        alerts: [
          'CRITICAL: Emily Rodriguez - 110% allocation is illegal in some jurisdictions, immediate action required',
          'URGENT: Michelle Davis - 105% with personal challenges, high resignation risk',
          'OPPORTUNITY: 4 underutilized employees available to absorb redistributed work',
        ],
        next_steps: [
          'TODAY: Meet with Emily and Michelle to discuss immediate workload reduction',
          'THIS WEEK: Reassign specific tasks to Ian Mitchell and Bob Johnson',
          'THIS WEEK: Review E-Commerce Platform scope and timeline feasibility',
          'NEXT WEEK: Implement 90% allocation cap policy across all projects',
          'ONGOING: Weekly allocation reviews in project status meetings',
        ],
      }
    ),
  },
  ...PERFORMANCE_CHAT_PROMPTS,
  ...COST_OPTIMIZATION_PROMPTS,
];

// Helper to find response by prompt using keyword matching
export const findChatResponse = (prompt: string): RAGApiResponse | null => {
  const normalizedPrompt = prompt.toLowerCase().trim();
  
  // First try exact match
  let match = MOCK_CHAT_PROMPTS.find(p => 
    p.prompt.toLowerCase() === normalizedPrompt ||
    p.prompt.toLowerCase().includes(normalizedPrompt) || 
    normalizedPrompt.includes(p.prompt.toLowerCase())
  );
  
  if (match) return match.response;
  
  // Try keyword-based fuzzy matching
  const userKeywords = normalizedPrompt.split(/\s+/).filter(w => w.length > 3);
  
  match = MOCK_CHAT_PROMPTS.find(p => {
    const promptKeywords = p.prompt.toLowerCase().split(/\s+/);
    const matchCount = userKeywords.filter(uk => 
      promptKeywords.some(pk => pk.includes(uk) || uk.includes(pk))
    ).length;
    
    // Match if at least 50% of user keywords match prompt keywords
    return matchCount >= Math.ceil(userKeywords.length * 0.5);
  });
  
  if (match) return match.response;
  
  // Try category-based matching
  if (normalizedPrompt.includes('mental health') || normalizedPrompt.includes('wellness')) {
    match = MOCK_CHAT_PROMPTS.find(p => p.category === 'mental_health');
  } else if (normalizedPrompt.includes('attrition') || normalizedPrompt.includes('turnover') || normalizedPrompt.includes('leaving')) {
    match = MOCK_CHAT_PROMPTS.find(p => p.category === 'attrition');
  } else if (normalizedPrompt.includes('project') || normalizedPrompt.includes('risk')) {
    match = MOCK_CHAT_PROMPTS.find(p => p.category === 'project');
  } else if (normalizedPrompt.includes('employee') || normalizedPrompt.includes('team member') || normalizedPrompt.includes('high-risk')) {
    match = MOCK_CHAT_PROMPTS.find(p => p.category === 'employee');
  } else if (normalizedPrompt.includes('performance') || normalizedPrompt.includes('utilization') || normalizedPrompt.includes('allocation')) {
    match = MOCK_CHAT_PROMPTS.find(p => p.category === 'performance');
  }
  
  return match?.response || null;
};

// Get all prompts by category
export const getPromptsByCategory = (category: string): MockChatPrompt[] => {
  return MOCK_CHAT_PROMPTS.filter(p => p.category === category);
};
