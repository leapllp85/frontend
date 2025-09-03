'use client';

import React, { useState } from 'react';
import { Box, VStack, Button, Text, Heading, HStack, Badge } from '@chakra-ui/react';
import { AIResponse } from '../../../components/common/AIResponse';
import { RAGApiResponse } from '../../../types/ragApi';

// Mock mental health RAG responses for testing manager queries
const teamMentalHealthOverview: RAGApiResponse = {
  success: true,
  analysis: {
    query_intent: "Show team mental health status overview",
    data_requirements: ["employee_name", "mental_health", "motivation_factor", "career_opportunities", "personal_reason"],
    recommended_component: "chart",
    component_config: {
      type: "bar_chart",
      title: "Team Mental Health Risk Assessment",
      description: "Risk levels across different wellness categories for your team",
      properties: {
        x_axis: "risk_category",
        y_axis: "high_risk_count",
        aggregation: "count",
        filters: ["risk_level", "department"]
      }
    }
  },
  queries: [
    {
      description: "Get team mental health risk distribution",
      sql: "SELECT 'Mental Health' as risk_category, COUNT(*) as high_risk_count FROM apis_employeeprofile ep JOIN auth_user u ON ep.user_id = u.id WHERE ep.manager_id = 1 AND ep.mental_health = 'High' UNION SELECT 'Motivation' as risk_category, COUNT(*) as high_risk_count FROM apis_employeeprofile ep WHERE ep.manager_id = 1 AND ep.motivation_factor = 'High' UNION SELECT 'Career Opportunities' as risk_category, COUNT(*) as high_risk_count FROM apis_employeeprofile ep WHERE ep.manager_id = 1 AND ep.career_opportunities = 'High' UNION SELECT 'Personal Reasons' as risk_category, COUNT(*) as high_risk_count FROM apis_employeeprofile ep WHERE ep.manager_id = 1 AND ep.personal_reason = 'High'",
      orm: "EmployeeProfile.objects.filter(manager_id=1).aggregate(...)",
      expected_fields: ["risk_category", "high_risk_count"]
    }
  ],
  dataset: [
    {
      description: "Team mental health risk distribution",
      columns: ["risk_category", "high_risk_count", "total_team_size"],
      data: [
        { risk_category: "Mental Health", high_risk_count: 2, total_team_size: 8 },
        { risk_category: "Motivation", high_risk_count: 1, total_team_size: 8 },
        { risk_category: "Career Opportunities", high_risk_count: 3, total_team_size: 8 },
        { risk_category: "Personal Reasons", high_risk_count: 1, total_team_size: 8 }
      ],
      row_count: 4
    }
  ],
  insights: {
    key_findings: [
      "3 team members have high career opportunity concerns - highest risk area",
      "2 team members show high mental health risk indicators",
      "Overall team wellness shows 7 high-risk indicators across 8 team members"
    ],
    recommendations: [
      "Schedule individual career development discussions with affected team members",
      "Consider implementing mental health support resources",
      "Review workload distribution and career progression opportunities",
      "Arrange team wellness check-ins on a regular basis"
    ],
    next_steps: [
      "Schedule one-on-one meetings with high-risk team members",
      "Research employee assistance programs for mental health support",
      "Create individual development plans focusing on career growth",
      "Implement weekly team wellness check-ins"
    ]
  }
};

const highRiskEmployees: RAGApiResponse = {
  success: true,
  analysis: {
    query_intent: "Identify team members with high mental health risk",
    data_requirements: ["employee_name", "mental_health", "primary_trigger", "manager_assessment_risk"],
    recommended_component: "table",
    component_config: {
      type: "data_table",
      title: "High Risk Team Members",
      description: "Team members requiring immediate attention for mental health support",
      properties: {
        filters: ["risk_level", "primary_trigger"]
      }
    }
  },
  dataset: [
    {
      description: "High risk team members with detailed assessment",
      columns: ["employee_name", "mental_health", "motivation_factor", "career_opportunities", "personal_reason", "primary_trigger", "all_triggers", "last_updated"],
      data: [
        { 
          employee_name: "Sarah Johnson", 
          mental_health: "High", 
          motivation_factor: "Medium", 
          career_opportunities: "High", 
          personal_reason: "Low",
          primary_trigger: "MH",
          all_triggers: "MH,CO",
          last_updated: "2024-08-25"
        },
        { 
          employee_name: "Mike Chen", 
          mental_health: "High", 
          motivation_factor: "High", 
          career_opportunities: "Medium", 
          personal_reason: "Medium",
          primary_trigger: "MH",
          all_triggers: "MH,MT",
          last_updated: "2024-08-28"
        },
        { 
          employee_name: "Lisa Rodriguez", 
          mental_health: "Medium", 
          motivation_factor: "Low", 
          career_opportunities: "High", 
          personal_reason: "High",
          primary_trigger: "CO",
          all_triggers: "CO,PR",
          last_updated: "2024-08-26"
        }
      ],
      row_count: 3
    }
  ],
  insights: {
    key_findings: [
      "2 team members have high mental health risk requiring immediate attention",
      "Mental Health is the primary trigger for 2 out of 3 high-risk employees",
      "Career Opportunities concern affects all 3 high-risk team members"
    ],
    recommendations: [
      "Prioritize immediate support for Sarah Johnson and Mike Chen (high mental health risk)",
      "Address career development concerns across the team",
      "Consider professional counseling resources for mental health support",
      "Implement regular check-ins with high-risk team members"
    ],
    next_steps: [
      "Schedule urgent one-on-one meetings with Sarah and Mike",
      "Research and provide mental health resources and support options",
      "Create career development plans for all three employees",
      "Set up weekly wellness check-ins for the next month"
    ]
  }
};

const teamTriggerAnalysis: RAGApiResponse = {
  success: true,
  analysis: {
    query_intent: "Analyze primary triggers affecting team members",
    data_requirements: ["primary_trigger", "trigger_count", "trigger_description"],
    recommended_component: "chart",
    component_config: {
      type: "pie_chart",
      title: "Team Primary Triggers Distribution",
      description: "Most common triggers affecting your team's wellness",
      properties: {
        x_axis: "trigger_name",
        y_axis: "employee_count",
        aggregation: "count"
      }
    }
  },
  dataset: [
    {
      description: "Primary trigger distribution across team",
      columns: ["trigger_code", "trigger_name", "employee_count", "percentage"],
      data: [
        { trigger_code: "MH", trigger_name: "Mental Health", employee_count: 3, percentage: 37.5 },
        { trigger_code: "CO", trigger_name: "Career Opportunities", employee_count: 2, percentage: 25.0 },
        { trigger_code: "MT", trigger_name: "Motivation Factor", employee_count: 2, percentage: 25.0 },
        { trigger_code: "PR", trigger_name: "Personal Reason", employee_count: 1, percentage: 12.5 }
      ],
      row_count: 4
    }
  ],
  insights: {
    key_findings: [
      "Mental Health is the primary concern for 37.5% of team members",
      "Career development and motivation issues each affect 25% of the team",
      "Personal reasons are the least common primary trigger at 12.5%"
    ],
    recommendations: [
      "Implement mental health awareness and support programs",
      "Review career development pathways and advancement opportunities",
      "Address team motivation through recognition and engagement initiatives",
      "Create a supportive environment for discussing personal challenges"
    ],
    next_steps: [
      "Organize mental health awareness workshop for the team",
      "Schedule career development planning sessions",
      "Implement team motivation and recognition programs",
      "Establish confidential support channels for personal issues"
    ]
  }
};

export default function MentalHealthExamples() {
  const [currentResponse, setCurrentResponse] = useState<RAGApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mentalHealthQueries = [
    { 
      name: "Team Mental Health Overview", 
      response: teamMentalHealthOverview,
      query: "Show my team's mental health status",
      description: "Risk distribution across wellness categories"
    },
    { 
      name: "High Risk Employees", 
      response: highRiskEmployees,
      query: "Who in my team has high mental health risk?",
      description: "Detailed view of team members needing attention"
    },
    { 
      name: "Primary Triggers Analysis", 
      response: teamTriggerAnalysis,
      query: "What are my team's primary triggers?",
      description: "Distribution of wellness triggers affecting the team"
    }
  ];

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack gap={6} maxW="6xl" mx="auto">
        <VStack gap={4} textAlign="center">
          <Heading size="2xl" color="gray.800">
            Manager Mental Health Queries
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Test mental health and wellness queries that managers can ask about their teams
          </Text>
          <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
            Manager Role Required
          </Badge>
        </VStack>

        <VStack gap={4} w="full">
          <Text fontWeight="semibold" color="gray.700" fontSize="lg">
            Sample Mental Health Queries:
          </Text>
          <VStack gap={3} w="full">
            {mentalHealthQueries.map((query, index) => (
              <Box key={index} p={4} bg="white" borderRadius="lg" shadow="sm" w="full" maxW="4xl">
                <VStack gap={3}>
                  <HStack justify="space-between" w="full">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold" color="gray.800">
                        "{query.query}"
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {query.description}
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="purple"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setCurrentResponse(query.response);
                          setIsLoading(false);
                        }, 1000);
                      }}
                      disabled={isLoading}
                    >
                      {query.name}
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
          
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setCurrentResponse(null)}
            mt={4}
          >
            Clear Results
          </Button>
        </VStack>

        <Box w="full">
          <AIResponse
            aiResponse={currentResponse || ''}
            isLoading={isLoading}
            error={null}
            userQuestion={currentResponse ? mentalHealthQueries.find(q => q.response === currentResponse)?.query : undefined}
          />
        </Box>
      </VStack>
    </Box>
  );
}
