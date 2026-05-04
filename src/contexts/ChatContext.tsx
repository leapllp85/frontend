'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatConversation, RAGApiResponse } from '../types/ragApi';
// import { asyncChatApi, AsyncChatOptions } from '../services/asyncChatApi';

interface ChatContextType {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  isLoading: boolean;
  isTyping: boolean;
  progress: number | null;
  progressMessage: string | null;
  activeTasks: string[];
  addMessage: (content: string, type: 'user' | 'assistant', response?: RAGApiResponse) => void;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  sendMessageAsync: (content: string, attachments?: File[]) => Promise<void>;
  sendMessageStreaming: (content: string, attachments?: File[]) => Promise<void>;
  cancelActiveTask: (taskId?: string) => Promise<void>;
  cancelAllTasks: () => Promise<void>;
  startNewConversation: () => void;
  loadConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  renameConversation: (conversationId: string, title: string) => void;
  archiveConversation: (conversationId: string) => void;
  clearHistory: () => void;
  setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }): React.ReactElement => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [activeTasks, setActiveTasks] = useState<string[]>([]);

  const generateId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Initialize with fresh conversation on mount (no persistence)
  useEffect(() => {
    setIsHydrated(true);
    
    // Start with an empty fresh conversation so the welcome screen shows by default
    const initialConversation = {
      id: generateId(),
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    setCurrentConversation(initialConversation);
    setConversations([initialConversation]);
  }, []);

  // No persistence - conversations are session-only

  const startNewConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: generateId(),
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    // Add to conversations instead of replacing
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  }, []);

  const addMessage = useCallback((content: string, type: 'user' | 'assistant', response?: RAGApiResponse) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      type,
      content,
      timestamp: new Date(),
      response,
    };

    let updatedConv: ChatConversation | null = null;

    setCurrentConversation(prev => {
      if (!prev) {
        console.warn('No current conversation when adding message, creating new one');
        updatedConv = {
          id: generateId(),
          messages: [newMessage],
          created_at: new Date(),
          updated_at: new Date(),
        };
        return updatedConv;
      }

      // Check for duplicate messages
      const lastMessage = prev.messages[prev.messages.length - 1];
      if (lastMessage &&
          lastMessage.content === content &&
          lastMessage.type === type &&
          (new Date().getTime() - new Date(lastMessage.timestamp).getTime()) < 5000) {
        console.log('Duplicate message prevented:', content);
        return prev;
      }

      updatedConv = {
        ...prev,
        messages: [...prev.messages, newMessage],
        updated_at: new Date(),
      };
      return updatedConv;
    });

    setConversations(prev => {
      if (!updatedConv) return prev;
      const exists = prev.some(c => c.id === updatedConv!.id);
      if (!exists) return [updatedConv!, ...prev];
      return prev.map(conv => (conv.id === updatedConv!.id ? updatedConv! : conv));
    });
  }, []);

  // Simplified sendMessage that uses async internally but appears synchronous
  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    return await sendMessageAsync(content, attachments);
  }, []);

  const sendMessageAsync = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() || isLoading) return;

    // Ensure we have a conversation
    if (!currentConversation) {
      startNewConversation();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Add user message
    addMessage(content, 'user');
    setIsLoading(true);
    setProgress(0);
    setProgressMessage('Processing your request...');

    let hasCompleted = false;
    
    try {
      // Static mock response - LLM Integration disabled
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if the query is about attrition trend
      if (content.toLowerCase().includes('attrition trend') || content.toLowerCase().includes('last 6 months')) {
        const attritionResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here is the attrition trend for the last 6 months:',
          components: [
            {
              id: 'attrition-1',
              type: 'attrition_trend',
              title: 'Last 6 Months Attrition Trend',
              description: 'Monthly attrition data and analysis',
              properties: {}
            }
          ],
          dataset: {
            'attrition-1': {
              description: 'Attrition trend analysis',
              columns: ['month', 'attrition_count', 'attrition_rate', 'department'],
              data: [
                { month: 'October 2024', attrition_count: 3, attrition_rate: '2.5%', department: 'Engineering' },
                { month: 'November 2024', attrition_count: 5, attrition_rate: '4.2%', department: 'Engineering' },
                { month: 'December 2024', attrition_count: 4, attrition_rate: '3.3%', department: 'Engineering' },
                { month: 'January 2025', attrition_count: 6, attrition_rate: '5.0%', department: 'Engineering' },
                { month: 'February 2025', attrition_count: 7, attrition_rate: '5.8%', department: 'Engineering' },
                { month: 'March 2025', attrition_count: 8, attrition_rate: '6.7%', department: 'Engineering' }
              ],
              row_count: 6
            }
          },
          insights: {
            summary: 'Attrition rate has increased from 2.5% in October 2024 to 6.7% in March 2025. The top driver is competitive compensation offers from rival companies.',
            key_findings: [
              { reason: 'Competitive compensation offers', percentage: 35, trend: 'increasing' },
              { reason: 'Lack of career growth opportunities', percentage: 28, trend: 'stable' },
              { reason: 'Work-life balance concerns', percentage: 22, trend: 'increasing' },
              { reason: 'Better remote work options elsewhere', percentage: 10, trend: 'stable' },
              { reason: 'Management issues', percentage: 5, trend: 'decreasing' }
            ]
          } as any,
          layout: {
            type: 'grid',
            columns: 1,
            rows: 1,
            responsive: true,
            spacing: 'medium',
            component_arrangement: [
              {
                component_id: 'attrition-1',
                position: { row: 1, col: 1, span_col: 1, span_row: 1 },
                size: 'large'
              }
            ]
          }
        };
        addMessage('Here is the attrition trend for the last 6 months:', 'assistant', attritionResponse);
      } else if (content.toLowerCase().includes('portfolio') || content.toLowerCase().includes('how is my portfolio')) {
        const portfolioResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here is your portfolio health overview:',
          components: [
            {
              id: 'portfolio-1',
              type: 'portfolio_health',
              title: 'Portfolio Health Overview',
              description: 'Project health status and risk analysis',
              properties: {}
            }
          ],
          dataset: {
            'portfolio-1': {
              description: 'Portfolio health data',
              columns: ['project_name', 'health_status', 'completion_percentage', 'team_size', 'budget_utilization', 'deadline'],
              data: [
                { project_name: 'E-Commerce Platform Redesign', health_status: 'green', completion_percentage: 85, team_size: 12, budget_utilization: '78%', deadline: '2025-05-15' },
                { project_name: 'Mobile App Development', health_status: 'green', completion_percentage: 72, team_size: 8, budget_utilization: '65%', deadline: '2025-06-01' },
                { project_name: 'Data Migration Project', health_status: 'amber', completion_percentage: 45, team_size: 6, budget_utilization: '82%', deadline: '2025-04-30' },
                { project_name: 'AI Integration Module', health_status: 'red', completion_percentage: 30, team_size: 5, budget_utilization: '95%', deadline: '2025-04-20' },
                { project_name: 'Cloud Infrastructure Upgrade', health_status: 'amber', completion_percentage: 55, team_size: 9, budget_utilization: '88%', deadline: '2025-05-30' }
              ],
              row_count: 5
            }
          },
          insights: {
            summary: 'Your portfolio has 2 green projects, 2 amber projects, and 1 red project requiring immediate attention.',
            red_project_details: [
              {
                project_name: 'AI Integration Module',
                reasons: [
                  { reason: 'Budget overutilization at 95%', severity: 'high' },
                  { reason: 'Only 30% completion with deadline in 2 weeks', severity: 'critical' },
                  { reason: 'Key technical lead on medical leave', severity: 'high' }
                ],
                associates_at_risk: [
                  { name: 'John Smith', photo: 'https://i.pravatar.cc/150?img=11', risk_reason: 'High workload, considering offer from competitor' },
                  { name: 'Sarah Johnson', photo: 'https://i.pravatar.cc/150?img=32', risk_reason: 'Lack of career growth opportunities' },
                  { name: 'Mike Chen', photo: 'https://i.pravatar.cc/150?img=53', risk_reason: 'Work-life balance concerns' }
                ],
                recommended_actions: [
                  'Reallocate 2 senior developers from green projects',
                  'Request budget extension approval',
                  'Identify backup technical lead',
                  'Consider deadline extension by 3 weeks'
                ]
              }
            ]
          } as any,
          layout: {
            type: 'grid',
            columns: 1,
            rows: 1,
            responsive: true,
            spacing: 'medium',
            component_arrangement: [
              {
                component_id: 'portfolio-1',
                position: { row: 1, col: 1, span_col: 1, span_row: 1 },
                size: 'large'
              }
            ]
          }
        };
        addMessage('Here is your portfolio health overview:', 'assistant', portfolioResponse);
      } else if (content.toLowerCase().includes('plan of action to retain john smith') || content.toLowerCase().includes('retain john smith') || content.toLowerCase().includes('john smith retention')) {
        const retentionResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here is the retention plan for John Smith:',
          components: [
            {
              id: 'retention-1',
              type: 'retention_plan',
              title: 'Retention Plan - John Smith',
              description: 'Employee retention strategy with concerns, impact, and remediation',
              properties: {}
            }
          ],
          dataset: {
            'retention-1': {
              description: 'John Smith retention plan',
              columns: ['name', 'photo', 'role', 'department', 'tenure', 'performance_rating', 'current_project'],
              data: [{
                name: 'John Smith',
                photo: 'https://i.pravatar.cc/150?img=11',
                role: 'Senior Software Engineer',
                department: 'Engineering',
                tenure: '3.5 years',
                performance_rating: 'A-',
                current_project: 'AI Integration Module'
              }],
              row_count: 1
            }
          },
          insights: {
            concerns: [
              { type: 'Workload', severity: 'high', description: 'Consistently working 60+ hours per week with multiple concurrent project commitments' },
              { type: 'Career Growth', severity: 'critical', description: 'Has received a competitive offer from a competitor with 25% salary increase and senior architect role' },
              { type: 'Recognition', severity: 'medium', description: 'Feels underappreciated despite delivering high-impact features on multiple projects' }
            ],
            impact: {
              immediate: 'Loss of critical domain knowledge in AI/ML systems and React architecture',
              project_risk: 'AI Integration Module would be delayed by 4-6 weeks requiring replacement hiring and onboarding',
              team_impact: 'Mentoring responsibilities for 3 junior developers would need redistribution',
              financial_impact: 'Replacement cost estimated at $150,000 including recruitment, onboarding, and lost productivity',
              knowledge_loss: 'Deep understanding of legacy codebase and microservices architecture'
            },
            remediation: [
              {
                priority: 'Immediate (Within 1 week)',
                actions: [
                  { action: 'Schedule 1:1 meeting with John to discuss career aspirations and concerns', owner: 'Manager', status: 'pending' },
                  { action: 'Offer salary adjustment to match or exceed competitor offer (25-30% increase)', owner: 'HR', status: 'pending' },
                  { action: 'Propose promotion to Tech Lead with additional responsibilities', owner: 'Manager', status: 'pending' }
                ]
              },
              {
                priority: 'Short-term (Within 1 month)',
                actions: [
                  { action: 'Reduce workload by reassigning non-critical tasks to other team members', owner: 'Manager', status: 'pending' },
                  { action: 'Implement formal recognition program for high performers', owner: 'HR', status: 'pending' },
                  { action: 'Provide clear career development plan with milestones and growth opportunities', owner: 'Manager', status: 'pending' },
                  { action: 'Increase equity grant or stock options', owner: 'HR', status: 'pending' }
                ]
              },
              {
                priority: 'Long-term (Within 3 months)',
                actions: [
                  { action: 'Establish mentorship program where John leads technical initiatives', owner: 'Manager', status: 'pending' },
                  { action: 'Create specialized technical track for senior engineers', owner: 'HR', status: 'pending' },
                  { action: 'Regular skip-level meetings with senior leadership to ensure visibility', owner: 'Manager', status: 'pending' },
                  { action: 'Implement flexible work arrangements and additional PTO', owner: 'HR', status: 'pending' }
                ]
              }
            ]
          } as any,
          layout: {
            type: 'grid',
            columns: 1,
            rows: 1,
            responsive: true,
            spacing: 'medium',
            component_arrangement: [
              {
                component_id: 'retention-1',
                position: { row: 1, col: 1, span_col: 1, span_row: 1 },
                size: 'large'
              }
            ]
          }
        };
        addMessage('Here is the retention plan for John Smith:', 'assistant', retentionResponse);
      } else if (content.toLowerCase().includes('show attrition risk associates') || content.toLowerCase().includes('attrition risk associates') || content.toLowerCase().includes('associates at risk')) {
        const riskAssociatesResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here are the associates at risk of attrition:',
          components: [
            {
              id: 'risk-associates-1',
              type: 'risk_associates_grid',
              title: 'Associates at Risk',
              description: 'Employees with high attrition risk requiring attention',
              properties: {}
            }
          ],
          dataset: {
            'risk-associates-1': {
              description: 'Associates at risk',
              columns: ['name', 'photo', 'designation', 'department', 'attrition_risk', 'tenure'],
              data: [
                { name: 'John Smith', photo: 'https://i.pravatar.cc/150?img=11', designation: 'Senior Software Engineer', department: 'Engineering', attrition_risk: 'critical', tenure: '3.5 years' },
                { name: 'Sarah Johnson', photo: 'https://i.pravatar.cc/150?img=32', designation: 'Product Manager', department: 'Product', attrition_risk: 'high', tenure: '2.8 years' },
                { name: 'Mike Chen', photo: 'https://i.pravatar.cc/150?img=53', designation: 'DevOps Engineer', department: 'Engineering', attrition_risk: 'high', tenure: '1.5 years' },
                { name: 'Lisa Anderson', photo: 'https://i.pravatar.cc/150?img=23', designation: 'QA Lead', department: 'Engineering', attrition_risk: 'high', tenure: '3.0 years' }
              ],
              row_count: 4
            }
          },
          insights: {
            summary: '4 associates are at critical or high risk of attrition. Click on any associate to view their detailed retention plan.'
          } as any,
          layout: {
            type: 'grid',
            columns: 1,
            rows: 1,
            responsive: true,
            spacing: 'medium',
            component_arrangement: [
              {
                component_id: 'risk-associates-1',
                position: { row: 1, col: 1, span_col: 1, span_row: 1 },
                size: 'large'
              }
            ]
          }
        };
        addMessage('Here are the associates at risk of attrition:', 'assistant', riskAssociatesResponse);
      } else if (content.toLowerCase().includes('alice brown') || content.toLowerCase().includes('summary of alice')) {
        const cvResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here is the summary for Alice Brown:',
          components: [
            {
              id: 'cv-1',
              type: 'cv_template',
              title: 'Alice Brown - Profile Summary',
              description: 'Employee profile with key metrics',
              properties: {}
            }
          ],
          dataset: {
            'cv-1': {
              description: 'Alice Brown profile data',
              columns: ['name', 'photo', 'summary', 'projects_worked', 'skills', 'concerns', 'attrition_risk', 'project_impact', 'role', 'department'],
              data: [{
                name: 'Alice Brown',
                photo: 'https://i.pravatar.cc/150?img=5',
                summary: 'Experienced software engineer with strong React and TypeScript skills. Consistent performer on critical projects with high delivery rate.',
                projects_worked: 8,
                skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
                concerns: [
                  'Workload concerns raised in Q3 2024',
                  'Requested more challenging projects'
                ],
                attrition_risk: 'High',
                project_impact: 'Delivered 3 high-impact features, improved system performance by 40%',
                role: 'Senior Software Engineer',
                department: 'Engineering'
              }],
              row_count: 1
            }
          },
          layout: {
            type: 'grid',
            columns: 1,
            rows: 1,
            responsive: true,
            spacing: 'medium',
            component_arrangement: [
              {
                component_id: 'cv-1',
                position: { row: 1, col: 1, span_col: 1, span_row: 1 },
                size: 'large'
              }
            ]
          }
        };
        addMessage('Here is the summary for Alice Brown:', 'assistant', cvResponse);
      } else if (content.toLowerCase().includes('risk analysis') || content.toLowerCase().includes('projects at risk') || content.toLowerCase().includes('show risk')) {
        const riskAnalysisResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here is the risk analysis across your portfolio:',
          components: [
            { id: 'risk-1', type: 'risk_analysis', title: 'Project & Associate Risk Analysis', description: 'Cross-mapping projects at risk with at-risk associates', properties: {} }
          ],
          dataset: {
            'risk-1': {
              description: 'Project & Associate Risk Analysis',
              columns: ['project', 'client', 'project_risk', 'associate', 'role', 'attrition_level', 'attrition_score', 'recommendation'],
              data: [
                { project: 'Atlas CRM Migration', client: 'Globex Corp', project_risk: 'High', associate: 'John Smith', role: 'Tech Lead', attrition_level: 'High', attrition_score: 82, recommendation: 'Initiate retention discussion this week; assign Priya as backup tech lead and accelerate knowledge transfer over next 2 weeks.' },
                { project: 'Phoenix Data Platform', client: 'Initech', project_risk: 'High', associate: 'Alice Brown', role: 'Senior Data Engineer', attrition_level: 'High', attrition_score: 78, recommendation: 'Approve pending compensation review; offer L5 promotion track and rotate her off late-night on-call for 30 days.' },
                { project: 'Helix Mobile App', client: 'Stark Industries', project_risk: 'Medium', associate: 'Rahul Verma', role: 'Mobile Engineer', attrition_level: 'Medium', attrition_score: 64, recommendation: 'Schedule skip-level 1:1; provide React Native certification sponsorship and clearer growth roadmap.' },
                { project: 'Orion Analytics Suite', client: 'Wayne Enterprises', project_risk: 'Medium', associate: 'Sara Lee', role: 'BI Analyst', attrition_level: 'Low', attrition_score: 38, recommendation: 'Maintain current engagement; cross-train Karthik to reduce single-point-of-failure dependency.' },
                { project: 'Nimbus Cloud Re-platform', client: 'Cyberdyne Systems', project_risk: 'High', associate: 'David Park', role: 'Cloud Architect', attrition_level: 'Medium', attrition_score: 58, recommendation: 'Reduce scope of parallel projects; pair him with a senior architect and confirm certification budget for AWS Pro.' },
                { project: 'Vega Reporting Refresh', client: 'Umbrella Group', project_risk: 'Low', associate: 'Meera Iyer', role: 'Frontend Engineer', attrition_level: 'Medium', attrition_score: 55, recommendation: 'Provide flexible work arrangement; involve her in upcoming design system initiative for higher engagement.' }
              ],
              row_count: 6
            }
          },
          insights: { summary: '3 of 6 active projects are High risk, primarily driven by attrition risk on critical associates. Recommended actions focus on retention, knowledge transfer, and workload rebalancing.' } as any,
          layout: { type: 'grid', columns: 1, rows: 1, responsive: true, spacing: 'medium', component_arrangement: [{ component_id: 'risk-1', position: { row: 1, col: 1, span_col: 1, span_row: 1 }, size: 'large' }] }
        };
        addMessage('Here is the risk analysis across your portfolio. The table maps projects at risk with the at-risk associates working on them and recommended mitigations:', 'assistant', riskAnalysisResponse);
      } else if (content.toLowerCase().includes('pending action') || content.toLowerCase().includes('pending task') || content.toLowerCase().includes('plan of action')) {
        const pendingActionsResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here are the pending tasks from your plan of actions:',
          components: [
            { id: 'pending-1', type: 'pending_actions', title: 'Pending Plan of Action Tasks', description: 'Outstanding tasks awaiting completion', properties: {} }
          ],
          dataset: {
            'pending-1': {
              description: 'Pending Plan of Action Tasks',
              columns: ['task', 'associate', 'context', 'owner', 'priority', 'due_in', 'task_status'],
              data: [
                { task: 'Schedule 1:1 to discuss career aspirations and concerns', associate: 'John Smith', context: 'Atlas CRM Migration retention plan', owner: 'Manager', priority: 'High', due_in: 'Overdue by 2 days', task_status: 'pending' },
                { task: 'Review compensation package and submit for approval', associate: 'Alice Brown', context: 'Phoenix Data Platform retention plan', owner: 'HR', priority: 'High', due_in: 'Due in 1 day', task_status: 'pending' },
                { task: 'Provide clear career development plan with milestones', associate: 'John Smith', context: 'Atlas CRM Migration retention plan', owner: 'Manager', priority: 'Medium', due_in: 'Due in 5 days', task_status: 'pending' },
                { task: 'Approve AWS Pro certification budget', associate: 'David Park', context: 'Nimbus Cloud Re-platform', owner: 'Manager', priority: 'Medium', due_in: 'Due in 3 days', task_status: 'pending' },
                { task: 'Assign Priya as backup tech lead and start KT', associate: 'John Smith', context: 'Atlas CRM Migration', owner: 'Manager', priority: 'High', due_in: 'Due in 7 days', task_status: 'pending' },
                { task: 'Sponsor React Native certification', associate: 'Rahul Verma', context: 'Helix Mobile App', owner: 'L&D', priority: 'Low', due_in: 'Due in 14 days', task_status: 'pending' },
                { task: 'Rotate off late-night on-call for 30 days', associate: 'Alice Brown', context: 'Phoenix Data Platform', owner: 'Manager', priority: 'Medium', due_in: 'Due in 2 days', task_status: 'pending' }
              ],
              row_count: 7
            }
          },
          insights: { summary: '7 actions pending across 5 retention plans. 1 task is overdue and 2 are due within 48 hours.' } as any,
          layout: { type: 'grid', columns: 1, rows: 1, responsive: true, spacing: 'medium', component_arrangement: [{ component_id: 'pending-1', position: { row: 1, col: 1, span_col: 1, span_row: 1 }, size: 'large' }] }
        };
        addMessage('Here are the pending tasks from your plan of actions. 1 is overdue and 2 are due within 48 hours:', 'assistant', pendingActionsResponse);
      } else {
        // Generic static response
        addMessage('I understand your question. This is a static response - LLM integration is currently disabled. Please enable the LLM API to get actual AI responses.', 'assistant');
      }
      
      hasCompleted = true;
    } catch (error) {
      console.error('Chat error:', error);
      if (!hasCompleted) {
        addMessage('I apologize, but I encountered an error processing your request.', 'assistant');
      }
    } finally {
      setIsLoading(false);
      setProgress(null);
      setProgressMessage(null);
    }
  }, [currentConversation, isLoading, addMessage, startNewConversation]);

  const sendMessageStreaming = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() || isLoading) return;

    if (!currentConversation) {
      startNewConversation();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    addMessage(content, 'user');
    setIsLoading(true);
    setIsTyping(true);
    setProgress(0);
    setProgressMessage('Streaming response...');

    let hasCompleted = false;
    
    try {
      // Static mock response - LLM Integration disabled
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate streaming progress
      setProgress(50);
      setProgressMessage('Processing...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      
      // Check if the query is about Alice Brown
      if (content.toLowerCase().includes('alice brown') || content.toLowerCase().includes('summary of alice')) {
        const cvResponse: RAGApiResponse = {
          success: true,
          raw_response: 'Here is the summary for Alice Brown:',
          components: [
            {
              id: 'cv-1',
              type: 'cv_template',
              title: 'Alice Brown - Profile Summary',
              description: 'Employee profile with key metrics',
              properties: {}
            }
          ],
          dataset: {
            'cv-1': {
              description: 'Alice Brown profile data',
              columns: ['name', 'photo', 'summary', 'projects_worked', 'skills', 'concerns', 'attrition_risk', 'project_impact', 'role', 'department'],
              data: [{
                name: 'Alice Brown',
                photo: 'https://i.pravatar.cc/150?img=5',
                summary: 'Experienced software engineer with strong React and TypeScript skills. Consistent performer on critical projects with high delivery rate.',
                projects_worked: 8,
                skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
                concerns: [
                  'Workload concerns raised in Q3 2024',
                  'Requested more challenging projects'
                ],
                attrition_risk: 'High',
                project_impact: 'Delivered 3 high-impact features, improved system performance by 40%',
                role: 'Senior Software Engineer',
                department: 'Engineering'
              }],
              row_count: 1
            }
          },
          layout: {
            type: 'grid',
            columns: 1,
            rows: 1,
            responsive: true,
            spacing: 'medium',
            component_arrangement: [
              {
                component_id: 'cv-1',
                position: { row: 1, col: 1, span_col: 1, span_row: 1 },
                size: 'large'
              }
            ]
          }
        };
        addMessage('Here is the summary for Alice Brown:', 'assistant', cvResponse);
      } else {
        // Generic static response
        addMessage('I understand your question. This is a static response - LLM integration is currently disabled. Please enable the LLM API to get actual AI responses.', 'assistant');
      }
      
      hasCompleted = true;
    } catch (error) {
      console.error('Streaming chat error:', error);
      if (!hasCompleted) {
        addMessage('I apologize, but I encountered an error processing your request.', 'assistant');
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setProgress(null);
      setProgressMessage(null);
    }
  }, [currentConversation, isLoading, addMessage, startNewConversation]);

  const cancelActiveTask = useCallback(async (taskId?: string) => {
    // Static implementation - LLM Integration disabled
    setActiveTasks(prev => taskId ? prev.filter(id => id !== taskId) : []);
    setIsLoading(false);
    setProgress(null);
    setProgressMessage(null);
    setIsTyping(false);
  }, []);

  const cancelAllTasks = useCallback(async () => {
    // Static implementation - LLM Integration disabled
    setActiveTasks([]);
    setIsLoading(false);
    setProgress(null);
    setProgressMessage(null);
    setIsTyping(false);
  }, []);

  const loadConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  const renameConversation = useCallback((conversationId: string, title: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, title } : conv
      )
    );
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, archived: true } : conv
      )
    );
  }, []);

  const clearHistory = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
  }, []);

  const contextValue: ChatContextType = {
    currentConversation,
    conversations,
    isLoading,
    isTyping,
    progress,
    progressMessage,
    activeTasks,
    addMessage,
    sendMessage,
    sendMessageAsync,
    sendMessageStreaming,
    cancelActiveTask,
    cancelAllTasks,
    startNewConversation,
    loadConversation,
    deleteConversation,
    renameConversation,
    archiveConversation,
    clearHistory,
    setTyping: setIsTyping,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
