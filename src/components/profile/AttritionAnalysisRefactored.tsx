'use client';

import React, { useState, useEffect } from 'react';
import { VStack, HStack, Text, Box, Heading, Spinner, Card } from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  AttritionTabs,
  AnalysisTabContent,
  SummaryTabContent,
  RecommendationsTabContent,
  type DistributionDataItem,
  type SentimentItem,
  type EngagementMetric,
  type SkillGapData,
  type MentalHealthData,
  type QuickStat,
  type InsightCategory
} from './attrition';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface AttritionAnalysisProps {
  userId?: string;
}

export const AttritionAnalysis: React.FC<AttritionAnalysisProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  // ============================================================================
  // DATA CONFIGURATION
  // ============================================================================

  // Risk distribution data
  const riskData = {
    "Mental Health": {
      "Concerns with Manager": 66,
      "Concerns with peers": 61,
      "Unrealistic Expectations": 68
    },
    "Motivation": {
      "Return to Office": 69,
      "Rewards and Recognition": 64
    },
    "Career Opportunities": {
      "Lack Of role clarity": 61,
      "No growth": 61,
      "Onsite Opportunity": 63
    },
    "Personal": {
      "Health Issues": 58,
      "Higher Education": 63
    }
  };

  // Distribution pie chart data
  const distributionData: DistributionDataItem[] = [
    { label: 'High', value: 25, color: '#FF6B6B', percentage: 17.2 },
    { label: 'Weak Performer', value: 30, color: '#FFB088', percentage: 20.7 },
    { label: 'Current Opportunity', value: 35, color: '#87CEEB', percentage: 24.1 },
    { label: 'Managed Expectations', value: 55, color: '#7EC8E3', percentage: 37.9 }
  ];

  // Analysis donut chart data
  const analysisDonutData = {
    labels: [
      'Concerns with Manager', 'Concerns with peers', 'Unrealistic Expectations',
      'Return to Office', 'Rewards and Recognition',
      'Lack Of role clarity', 'No growth', 'Onsite Opportunity',
      'Health Issues', 'Higher Education'
    ],
    datasets: [
      {
        label: 'Top Triggers',
        data: [66, 61, 68, 69, 64, 61, 61, 63, 58, 63],
        backgroundColor: [
          '#9B8FD9', '#A89EDD', '#B5ADE1',
          '#7EC8E3', '#87CEEB',
          '#FFD89C', '#FFE4B3', '#FFF0CC',
          '#A8D5BA', '#B8DFC8'
        ],
        borderWidth: 0,
        cutout: '40%',
        hoverOffset: 6
      },
      {
        label: 'Main Categories',
        data: [
          Object.values(riskData["Mental Health"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Motivation"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Career Opportunities"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Personal"]).reduce((a, b) => a + b, 0)
        ],
        backgroundColor: ['#7EC8E3', '#87CEEB', '#9DD9D2', '#A8E6CF'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        cutout: '70%',
        hoverOffset: 4
      }
    ]
  };

  // Survey sentiment data
  const surveySentimentData: SentimentItem[] = [
    { label: 'Workload Stress', value: 68, color: '#ef4444' },
    { label: 'Work-Life Balance', value: 45, color: '#f97316' },
    { label: 'Career Growth', value: 52, color: '#f59e0b' }
  ];

  // Engagement metrics data
  const engagementData: EngagementMetric[] = [
    { label: 'Team Collaboration', value: 72, color: 'purple.100', icon: '👥' },
    { label: 'Innovation', value: 68, color: 'blue.100', icon: '💡' },
    { label: 'Learning', value: 81, color: 'green.100', icon: '📚' },
    { label: 'Satisfaction', value: 75, color: 'orange.100', icon: '⭐' }
  ];

  // Skill gap data
  const skillGapData: SkillGapData = {
    membersNeedDevelopment: 3,
    gapPercentage: 35,
    focusAreas: ['React', 'System Design', 'Cloud']
  };

  // Mental health data
  const mentalHealthData: MentalHealthData = {
    highRiskMembers: 2,
    concernsReported: 5,
    actionItems: [
      'Schedule 1-on-1 check-ins',
      'Review workload distribution',
      'Provide mental health resources'
    ]
  };

  // Quick stats data
  const quickStats: QuickStat[] = [
    { label: 'At Risk', value: '12%', color: 'red.600', bgColor: 'red.50' },
    { label: 'Improving', value: '8', color: 'green.600', bgColor: 'green.50' },
    { label: 'Stable', value: '45', color: 'blue.600', bgColor: 'blue.50' }
  ];

  // Immediate actions
  const immediateActions: InsightCategory[] = [
    {
      title: 'Survey Sentiment',
      icon: '📋',
      items: [
        'Address high workload concerns with team leads',
        'Review and redistribute workload across team members'
      ]
    },
    {
      title: 'Mental Health',
      icon: '🧠',
      items: [
        'Schedule wellness check-ins with at-risk team members',
        'Enroll team in mental health support programs'
      ]
    },
    {
      title: 'Skill Development',
      icon: '📈',
      items: [
        'Create personalized learning paths for each team member',
        'Allocate budget for technical training and certifications'
      ]
    }
  ];

  // Preventive measures
  const preventiveMeasures: InsightCategory[] = [
    {
      title: 'Project Management',
      icon: '📅',
      items: [
        'Review project timelines and adjust unrealistic deadlines',
        'Implement agile methodologies for better sprint planning'
      ]
    },
    {
      title: 'Resource Planning',
      icon: '👥',
      items: [
        'Balance workload distribution based on skill levels',
        'Hire additional resources for high-priority initiatives'
      ]
    },
    {
      title: 'Continuous Monitoring',
      icon: '📊',
      items: [
        'Monitor team morale through regular pulse surveys',
        'Establish clear communication channels for feedback'
      ]
    }
  ];

  // ============================================================================
  // LOADING & ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <Card.Root bg="#ffffff" shadow="sm" borderRadius="3xl" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="center" align="center">
            <Spinner size="sm" color="cyan.500" />
            <Heading size="md" color="gray.700">Loading Attrition Analysis...</Heading>
          </HStack>
        </Card.Header>
        <Card.Body display="flex" alignItems="center" justifyContent="center" flex="1">
          <VStack gap={4}>
            <Spinner size="xl" color="cyan.500" />
            <Text color="gray.500">Analyzing team data...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root bg="white" shadow="lg" borderRadius="2xl" h="full" display="flex" flexDirection="column" border="1px solid" borderColor="gray.200">
        <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.100" textAlign="center">Attrition Analysis</Heading>
        </Card.Header>
        <Card.Body display="flex" alignItems="center" justifyContent="center" flex="1">
          <VStack gap={3}>
            <Box p={3} bg="red.100" borderRadius="full">
              <Text fontSize="2xl">⚠️</Text>
            </Box>
            <Text color="red.600" fontWeight="semibold">Error loading analysis</Text>
            <Text color="gray.600" fontSize="sm">{error}</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const tabs = ['Attrition Analysis', 'Your Attention', 'Recommendations'];

  return (
    <Card.Root
      w="100%"
      bg="#ffffff"
      shadow="xs"
      borderRadius="3xl"
      h="full"
      display="flex"
      flexDirection="column"
      borderColor="gray.100"
      p={2}
    >
      <Card.Header px={4} pt={2} pb={4} borderBottom="none">
        <AttritionTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Card.Header>

      <Card.Body flex="1" minH="0" overflow="hidden" p={0}>
        {/* Tab 0: Attrition Analysis */}
        {activeTab === 0 && (
          <AnalysisTabContent
            riskData={riskData}
            distributionData={distributionData}
            analysisDonutData={analysisDonutData}
            surveySentimentData={surveySentimentData}
            engagementData={engagementData}
          />
        )}

        {/* Tab 1: Your Attention (Summary) */}
        {activeTab === 1 && (
          <SummaryTabContent
            skillGapData={skillGapData}
            mentalHealthData={mentalHealthData}
            quickStats={quickStats}
          />
        )}

        {/* Tab 2: Recommendations */}
        {activeTab === 2 && (
          <RecommendationsTabContent
            immediateActions={immediateActions}
            preventiveMeasures={preventiveMeasures}
          />
        )}
      </Card.Body>
    </Card.Root>
  );
};
