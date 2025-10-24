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
import { Bar } from 'react-chartjs-2';
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
      <Text fontSize="xs" color="gray.700" fontWeight="normal" minW="35px">
        {label}
      </Text>
    )}
  </HStack> 
);

export const CriticalityVsRisk: React.FC<CriticalityVsRiskProps> = ({ userId }) => {
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

  // Bar Chart Data - 3 categories
  const barChartData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [35, 45, 20], // High, Medium, Low percentages
        backgroundColor: [
          '#EF4444', // Red for High Risk
          '#F59E0B', // Orange for Medium Risk  
          '#22C55E'  // Green for Low Risk
        ],
        borderColor: [
          '#DC2626',
          '#D97706',
          '#16A34A'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const barChartOptions = {
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
            const value = context.parsed.y || 0;
            return `${context.label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10
          },
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
            weight: '500'
          }
        }
      }
    },
    elements: {
      bar: {
        borderWidth: 2
      }
    }
  };

  if (loading) {
    return (
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100" h="full" display="flex" flexDirection="column">
        {/* <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
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
        </Card.Body> */}
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
              <Text fontSize="sm" fontWeight="normal" color="red.800">
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
      bg="#ffffff" 
      shadow="sm" 
      borderRadius="3xl"
      border="1px solid" 
      borderColor="gray.50"
      h="full" 
      display="flex" 
      flexDirection="column"
      transition="all 0.2s ease"
      w="full"
    >
      <Card.Header px={4} py={2} borderBottom="1px solid" borderColor="gray.100">
        <VStack gap={1}>
          <Heading 
            size="md" 
            color="gray.900" 
            textAlign="center"
            fontWeight="normal"
          >
            Critical Members Attrition Risks
          </Heading>
          <Box 
            w="100%" 
            h="1.1px" 
            bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
          />
        </VStack>
      </Card.Header>
      <Card.Body h="full" display="flex" flexDirection="column" gap={0} w="full" p={2} px={1} py={1} pb={0}>
        <VStack 
          gap={0} 
          align="center" 
          justify="center" 
          h="full" 
          w="full"
        >
          {/* Bar Chart Container - Centered */}
          <Box w="190px" h="80%" position="relative" display="flex" alignItems="center" justifyContent="center">
            <Bar data={barChartData} options={barChartOptions} />
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};