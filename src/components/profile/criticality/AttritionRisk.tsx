'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  VStack,
  HStack,
  Text,
  Box,
  Heading,
  Spinner,
  Grid,
  GridItem,
  Flex
} from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { criticalityApi, CriticalityVsRiskData, RiskDistribution } from '../../../services';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CriticalityVsRiskProps {
  userId?: string;
}

// Legend item component - matching the exact image style
const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <HStack gap={2} align="center" minH="18px">
    <Box w={4} h={3} bg={color} borderRadius="sm" />
    {label && (
      <Text fontSize="xs" color="gray.700" fontWeight="semibold" minW="35px">
        {label}
      </Text>
    )}
  </HStack>
);

export const AttritionRisk: React.FC<CriticalityVsRiskProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  // Risk distribution data from API
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
    "Career Opputunities": {
      "Lack Of role clarity": 61,
      "No growth": 61,
      "Onsite Opputunity": 63
    },
    "Personal": {
      "Health Issues": 58,
      "Higher Education": 63
    }
  };


  // Criticality vs Risk Donut Chart Data
  const criticalityRiskPieData = {
    labels: [
      'High-High', 'High-Med', 'High-Low',
      'Med-High', 'Med-Med', 'Med-Low',
      'Low-High', 'Low-Med', 'Low-Low'
    ],
    datasets: [{
      label: 'Risk Distribution',
      data: [15, 25, 35, 20, 45, 55, 12, 30, 68],
      backgroundColor: [
        '#dc2626', '#ea580c', '#f59e0b', // High Criticality
        '#eab308', '#84cc16', '#22c55e', // Medium Criticality  
        '#06b6d4', '#3b82f6', '#8b5cf6'  // Low Criticality
      ],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  // Double Donut Chart Data - Inner (9 partitions) + Outer (3 partitions)
  const doubleDonutData = {
    datasets: [
      // Inner Ring - 9 Criticality Subdivisions (3 for each High, Med, Low)
      {
        label: 'Criticality',
        data: [
          // 3 partitions for High Criticality
          25, 25, 25,
          // 3 partitions for Medium Criticality  
          40, 40, 40,
          // 3 partitions for Low Criticality
          37, 37, 36
        ],
        backgroundColor: [
          // High Criticality partitions (red variations)
          '#dc2626', '#ef4444', '#f87171',
          // Medium Criticality partitions (orange/yellow variations)
          '#ea580c', '#f59e0b', '#fbbf24',
          // Low Criticality partitions (green variations)
          '#16a34a', '#22c55e', '#4ade80'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      },
      // Outer Ring - 3 Risk Levels
      {
        label: 'Risk',
        data: [75, 120, 110], // High, Medium, Low Risk
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }
    ]
  };

  const doubleDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label;
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            if (datasetLabel === 'Criticality') {
              const riskLabels = [
                'High Attrition Risk', 'Medium Attrition Risk', 'Low Attrition Risk',
                'High Attrition Risk', 'Medium Attrition Risk', 'Low Attrition Risk',
                'High Attrition Risk', 'Medium Attrition Risk', 'Low Attrition Risk'
              ];
              return `${riskLabels[context.dataIndex]}: ${value} (${percentage}%)`;
            } else {
              const labels = ['High Criticality', 'Medium Criticality', 'Low Criticality'];
              return `${labels[context.dataIndex]}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    },
    cutout: '55%', // Inner cutout for double ring effect
    radius: '100%', // Outer radius
    animation: {
      duration: 1500,
      easing: 'easeOutQuart' as const
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  // Merged donut chart with nested data
  const mergedDonutData = {
    labels: [
      'Concerns with Manager', 'Concerns with peers', 'Unrealistic Expectations',
      'Return to Office', 'Rewards and Recognition',
      'Lack Of role clarity', 'No growth', 'Onsite Opportunity',
      'Health Issues', 'Higher Education'
    ],
    datasets: [
      // Outer ring - Sub-categories (detailed triggers)
      {
        label: 'Top Triggers',
        data: [66, 61, 68, 69, 64, 61, 61, 63, 58, 63],
        backgroundColor: [
          '#E53E3E', '#F56565', '#FC8181', // Mental Health - red gradient
          '#2B6CB0', '#4299E1', // Motivation - blue gradient
          '#D69E2E', '#ECC94B', '#F6E05E', // Career - yellow gradient
          '#38A169', '#48BB78' // Personal - green gradient
        ],
        borderWidth: 0,
        cutout: '40%',
        hoverOffset: 6
      },
      // Inner ring - Main categories
      {
        label: 'Main Categories',
        data: [
          Object.values(riskData["Mental Health"]).reduce((a, b) => a + b, 0), // Total for Mental Health
          Object.values(riskData["Motivation"]).reduce((a, b) => a + b, 0), // Total for Motivation
          Object.values(riskData["Career Opputunities"]).reduce((a, b) => a + b, 0), // Total for Career
          Object.values(riskData["Personal"]).reduce((a, b) => a + b, 0) // Total for Personal
        ],
        backgroundColor: [
          '#F56565', // Mental Health
          '#4299E1', // Motivation  
          '#ECC94B', // Career Opportunities
          '#48BB78'  // Personal
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        cutout: '70%',
        hoverOffset: 4
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed || 0;
            return `${context.label}: ${Math.round(value)}`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      duration: 1500,
      easing: 'easeOutQuart' as const
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  if (loading) {
    return (
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="space-between" align="center">
            <Heading size="sm" color="gray.800">Criticality - Attrition Data</Heading>
            <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
          </HStack>
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <VStack gap={4} align="center" justify="center" minH="200px">
            <Spinner size="lg" color="teal.500" />
            <Text color="gray.500" fontSize="sm">Loading chart...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root bg="white" shadow="lg" borderRadius="2xl" h="full" display="flex" flexDirection="column" border="1px solid" borderColor="gray.200">
        <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
          {/* <Heading size="sm" color="gray.800">Criticality- Attrition Risk Statistics</Heading> */}
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
            <VStack gap={2} align="start">
              <Text fontSize="sm" fontWeight="semibold" color="red.800">
                Error loading chart
              </Text>
              <Text fontSize="sm" color="red.600">
                {error}
              </Text>
            </VStack>
          </Box>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root
      bg="#e6fffa"
      shadow="sm"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.50"
      h="full"
      display="flex"
      flexDirection="column"
      // _hover={{ 
      //   transform: "translateY(-2px)", 
      //   shadow: "md",
      //   transition: "all 0.1s ease"
      // }}
      transition="all 0.2s ease"
    >
      <Card.Header px={4} py={2} borderBottom="1px solid" borderColor="gray.100">
        <VStack gap={1}>
          <Heading
            size="md"
            color="gray.800"
            textAlign="center"
            fontWeight="600"
          >
            Attrition Risk Analysis
          </Heading>
          <Box
            w="100%"
            h="1.2px"
            bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
          />
        </VStack>
      </Card.Header>
      <Card.Body h="full" display="flex" flexDirection="row" gap={0} w="full" p={2}>
        <HStack gap={3} align="center" flex="1">
          <Box
            w="180px"
            h="180px"
            filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))"
            transition="all 0.2s ease"
          >
            <Doughnut data={mergedDonutData} options={donutOptions} />
          </Box>

          {/* Legend positioned close to chart */}
          <Box display="flex" flexDirection="column" justifyContent="center" ml={2}>
            <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
              Categories
            </Text>
            <VStack gap={3} align="start">
              <LegendItem color="#F56565" label="Mental Health" />
              <LegendItem color="#4299E1" label="Motivation" />
              <LegendItem color="#ECC94B" label="Career Opportunities" />
              <LegendItem color="#48BB78" label="Personal" />
            </VStack>
          </Box>
        </HStack>
      </Card.Body>
    </Card.Root >
  );
};