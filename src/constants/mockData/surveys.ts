/**
 * Mock Surveys Data - 6 Surveys with Questions and Responses
 */

export interface MockSurvey {
  id: number;
  title: string;
  description: string;
  created_at: string;
  ui_status: 'active' | 'pending' | 'closed' | 'completed' | 'draft';
  completion_rate: number;
  survey_type: string;
  end_date: string;
  questions: MockQuestion[];
}

export interface MockQuestion {
  id: number;
  question_text: string;
  question_type: 'rating' | 'multiple_choice' | 'text';
  options?: string[];
}

export interface MockSurveyResponse {
  survey_id: number;
  employee_id: number;
  responses: { question_id: number; answer: string | number }[];
  completed_at: string;
}

export const MOCK_SURVEYS: MockSurvey[] = [
  {
    id: 1,
    title: 'Q1 2024 Team Engagement Survey',
    description: 'Quarterly survey to assess team engagement, satisfaction, and areas for improvement',
    created_at: '2024-01-05T09:00:00Z',
    ui_status: 'active',
    completion_rate: 73,
    survey_type: 'engagement',
    end_date: '2024-04-15T23:59:59Z',
    questions: [
      { id: 1, question_text: 'How satisfied are you with your current role?', question_type: 'rating' },
      { id: 2, question_text: 'How would you rate work-life balance?', question_type: 'rating' },
      { id: 3, question_text: 'Do you feel supported by your manager?', question_type: 'multiple_choice', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'] },
      { id: 4, question_text: 'What improvements would you like to see in the team?', question_type: 'text' },
    ],
  },
  {
    id: 2,
    title: 'Mental Health & Wellness Check-in',
    description: 'Monthly wellness survey to monitor team mental health and wellbeing',
    created_at: '2024-03-01T09:00:00Z',
    ui_status: 'active',
    completion_rate: 87,
    survey_type: 'wellness',
    end_date: '2024-03-31T23:59:59Z',
    questions: [
      { id: 5, question_text: 'How would you rate your current stress level?', question_type: 'rating' },
      { id: 6, question_text: 'Are you experiencing burnout symptoms?', question_type: 'multiple_choice', options: ['Yes, frequently', 'Sometimes', 'Rarely', 'No'] },
      { id: 7, question_text: 'Do you have access to mental health resources you need?', question_type: 'multiple_choice', options: ['Yes', 'Somewhat', 'No', 'Not sure'] },
      { id: 8, question_text: 'What support would be most helpful for you?', question_type: 'text' },
    ],
  },
  {
    id: 3,
    title: 'Project Feedback Survey',
    description: 'Gather feedback on recent project experiences and collaboration',
    created_at: '2024-02-15T09:00:00Z',
    ui_status: 'completed',
    completion_rate: 100,
    survey_type: 'project_feedback',
    end_date: '2024-03-15T23:59:59Z',
    questions: [
      { id: 9, question_text: 'How clear were project objectives and requirements?', question_type: 'rating' },
      { id: 10, question_text: 'Rate the effectiveness of team collaboration', question_type: 'rating' },
      { id: 11, question_text: 'Were resources adequate for project success?', question_type: 'multiple_choice', options: ['More than adequate', 'Adequate', 'Somewhat lacking', 'Insufficient'] },
      { id: 12, question_text: 'What could improve future project execution?', question_type: 'text' },
    ],
  },
  {
    id: 4,
    title: 'Career Development Survey',
    description: 'Understand career aspirations and development needs',
    created_at: '2024-01-20T09:00:00Z',
    ui_status: 'active',
    completion_rate: 60,
    survey_type: 'career',
    end_date: '2024-04-30T23:59:59Z',
    questions: [
      { id: 13, question_text: 'How satisfied are you with your career growth opportunities?', question_type: 'rating' },
      { id: 14, question_text: 'Do you see a clear career path in the organization?', question_type: 'multiple_choice', options: ['Yes, very clear', 'Somewhat clear', 'Unclear', 'No path visible'] },
      { id: 15, question_text: 'What skills would you like to develop?', question_type: 'text' },
      { id: 16, question_text: 'Are you interested in leadership opportunities?', question_type: 'multiple_choice', options: ['Yes, very interested', 'Somewhat interested', 'Not currently', 'No'] },
    ],
  },
  {
    id: 5,
    title: 'Remote Work Experience Survey',
    description: 'Evaluate remote work setup and hybrid work preferences',
    created_at: '2024-02-01T09:00:00Z',
    ui_status: 'active',
    completion_rate: 80,
    survey_type: 'remote_work',
    end_date: '2024-04-01T23:59:59Z',
    questions: [
      { id: 17, question_text: 'How effective is your remote work setup?', question_type: 'rating' },
      { id: 18, question_text: 'What is your preferred work arrangement?', question_type: 'multiple_choice', options: ['Fully remote', 'Hybrid (3 days office)', 'Hybrid (2 days office)', 'Fully in-office'] },
      { id: 19, question_text: 'Do you have adequate technology and tools for remote work?', question_type: 'multiple_choice', options: ['Yes, excellent', 'Yes, adequate', 'Some gaps', 'No, insufficient'] },
      { id: 20, question_text: 'What would improve your remote work experience?', question_type: 'text' },
    ],
  },
  {
    id: 6,
    title: 'Manager Effectiveness Survey',
    description: 'Anonymous feedback on management and leadership',
    created_at: '2024-03-10T09:00:00Z',
    ui_status: 'active',
    completion_rate: 53,
    survey_type: 'manager_feedback',
    end_date: '2024-04-10T23:59:59Z',
    questions: [
      { id: 21, question_text: 'How would you rate communication from your manager?', question_type: 'rating' },
      { id: 22, question_text: 'Does your manager provide helpful feedback?', question_type: 'multiple_choice', options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'] },
      { id: 23, question_text: 'Do you feel your manager advocates for your growth?', question_type: 'multiple_choice', options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'] },
      { id: 24, question_text: 'What could your manager do to better support you?', question_type: 'text' },
    ],
  },
];

// Survey Statistics for each survey
export const MOCK_SURVEY_STATISTICS = {
  1: {
    total_responses: 11,
    completed_responses: 11,
    pending_responses: 4,
  },
  2: {
    total_responses: 13,
    completed_responses: 13,
    pending_responses: 2,
  },
  3: {
    total_responses: 15,
    completed_responses: 15,
    pending_responses: 0,
  },
  4: {
    total_responses: 9,
    completed_responses: 9,
    pending_responses: 6,
  },
  5: {
    total_responses: 12,
    completed_responses: 12,
    pending_responses: 3,
  },
  6: {
    total_responses: 8,
    completed_responses: 8,
    pending_responses: 7,
  },
};

// Question Statistics with answer distributions
export const MOCK_QUESTION_STATS = {
  1: [
    {
      id: 1,
      question_text: 'How satisfied are you with your current role?',
      question_type: 'rating',
      total_answers: 11,
      answer_distribution: {
        '5': { count: 4, percentage: 36 },
        '4': { count: 4, percentage: 36 },
        '3': { count: 2, percentage: 18 },
        '2': { count: 1, percentage: 9 },
        '1': { count: 0, percentage: 0 },
      },
    },
    {
      id: 2,
      question_text: 'How would you rate work-life balance?',
      question_type: 'rating',
      total_answers: 11,
      answer_distribution: {
        '5': { count: 3, percentage: 27 },
        '4': { count: 5, percentage: 45 },
        '3': { count: 2, percentage: 18 },
        '2': { count: 1, percentage: 9 },
        '1': { count: 0, percentage: 0 },
      },
    },
    {
      id: 3,
      question_text: 'Do you feel supported by your manager?',
      question_type: 'multiple_choice',
      total_answers: 11,
      answer_distribution: {
        'Strongly Agree': { count: 5, percentage: 45 },
        'Agree': { count: 4, percentage: 36 },
        'Neutral': { count: 2, percentage: 18 },
        'Disagree': { count: 0, percentage: 0 },
      },
    },
    {
      id: 4,
      question_text: 'What improvements would you like to see in the team?',
      question_type: 'text',
      total_answers: 9,
      answer_distribution: {},
    },
  ],
  2: [
    {
      id: 5,
      question_text: 'How would you rate your current stress level?',
      question_type: 'rating',
      total_answers: 13,
      answer_distribution: {
        '5': { count: 1, percentage: 8 },
        '4': { count: 3, percentage: 23 },
        '3': { count: 6, percentage: 46 },
        '2': { count: 2, percentage: 15 },
        '1': { count: 1, percentage: 8 },
      },
    },
    {
      id: 6,
      question_text: 'Are you experiencing burnout symptoms?',
      question_type: 'multiple_choice',
      total_answers: 13,
      answer_distribution: {
        'Yes, frequently': { count: 2, percentage: 15 },
        'Sometimes': { count: 5, percentage: 38 },
        'Rarely': { count: 4, percentage: 31 },
        'No': { count: 2, percentage: 15 },
      },
    },
    {
      id: 7,
      question_text: 'Do you have access to mental health resources you need?',
      question_type: 'multiple_choice',
      total_answers: 13,
      answer_distribution: {
        'Yes': { count: 7, percentage: 54 },
        'Somewhat': { count: 4, percentage: 31 },
        'No': { count: 1, percentage: 8 },
        'Not sure': { count: 1, percentage: 8 },
      },
    },
    {
      id: 8,
      question_text: 'What support would be most helpful for you?',
      question_type: 'text',
      total_answers: 11,
      answer_distribution: {},
    },
  ],
};

// Pending members for each survey
export const MOCK_PENDING_MEMBERS = {
  1: [
    { id: 6, name: 'James Anderson', email: 'james.anderson@company.com', department: 'Engineering' },
    { id: 10, name: 'Christopher Lee', email: 'christopher.lee@company.com', department: 'Product' },
    { id: 12, name: 'Daniel Brown', email: 'daniel.brown@company.com', department: 'Design' },
    { id: 15, name: 'Rachel Moore', email: 'rachel.moore@company.com', department: 'Marketing' },
  ],
  2: [
    { id: 4, name: 'David Martinez', email: 'david.martinez@company.com', department: 'Engineering' },
    { id: 14, name: 'Kevin Miller', email: 'kevin.miller@company.com', department: 'Operations' },
  ],
  3: [],
  4: [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'Engineering' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', department: 'Product' },
    { id: 5, name: 'Jessica Taylor', email: 'jessica.taylor@company.com', department: 'Design' },
    { id: 8, name: 'Robert Wilson', email: 'robert.wilson@company.com', department: 'Engineering' },
    { id: 11, name: 'Jennifer White', email: 'jennifer.white@company.com', department: 'Marketing' },
    { id: 13, name: 'Michelle Davis', email: 'michelle.davis@company.com', department: 'Sales' },
  ],
  5: [
    { id: 2, name: 'Michael Chen', email: 'michael.chen@company.com', department: 'Engineering' },
    { id: 7, name: 'Lisa Thompson', email: 'lisa.thompson@company.com', department: 'HR' },
    { id: 9, name: 'Amanda Garcia', email: 'amanda.garcia@company.com', department: 'Finance' },
  ],
  6: [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'Engineering' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', department: 'Product' },
    { id: 6, name: 'James Anderson', email: 'james.anderson@company.com', department: 'Engineering' },
    { id: 10, name: 'Christopher Lee', email: 'christopher.lee@company.com', department: 'Product' },
    { id: 12, name: 'Daniel Brown', email: 'daniel.brown@company.com', department: 'Design' },
    { id: 13, name: 'Michelle Davis', email: 'michelle.davis@company.com', department: 'Sales' },
    { id: 15, name: 'Rachel Moore', email: 'rachel.moore@company.com', department: 'Marketing' },
  ],
};
