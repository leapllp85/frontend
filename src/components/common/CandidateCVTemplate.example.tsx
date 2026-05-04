// Example usage of CandidateCVTemplate for Alice Brown
// This demonstrates the data structure expected when the chat system responds to "provide me summary of Alice Brown"

import { CandidateCVTemplate } from './CandidateCVTemplate';

// Example 1: Direct component usage
export const AliceBrownCVExample = () => {
  const aliceBrownData = {
    name: 'Alice Brown',
    photo: '/avatars/alice-brown.jpg', // Optional - will use initials if not provided
    summary: 'Experienced software engineer with strong React and TypeScript skills. Consistent performer on critical projects with high delivery rate.',
    projectsWorked: 8,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
    concerns: [
      'Workload concerns raised in Q3 2024',
      'Requested more challenging projects'
    ],
    attritionRisk: 'High' as const,
    projectImpact: 'Delivered 3 high-impact features, improved system performance by 40%',
    role: 'Senior Software Engineer',
    department: 'Engineering'
  };

  return <CandidateCVTemplate {...aliceBrownData} />;
};

// Example 2: Chat response integration (how the backend should return data)
export const aliceBrownChatResponse = {
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
        photo: '/avatars/alice-brown.jpg',
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

// Example 3: Minimal data (required fields only)
export const aliceBrownMinimalExample = () => {
  return (
    <CandidateCVTemplate
      name="Alice Brown"
      summary="Software engineer with 5 years of experience"
      projectsWorked={5}
      skills={['React', 'TypeScript', 'Node.js']}
      concerns={[]}
      attritionRisk="Low"
      projectImpact="Consistent delivery of quality code"
    />
  );
};
