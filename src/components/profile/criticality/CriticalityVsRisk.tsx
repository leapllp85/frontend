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

  // Bar chart data for risk distribution
  const chartData = {
    labels: [
      'High Risk',
      'Medium Risk', 
      'Low Risk'
    ],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [35, 28, 22], // Top 3 risk distribution data
        backgroundColor: [
          '#F56565', // Red - High Risk (from CriticalityMetrics)
          '#ED8936', // Orange - Medium Risk (from CriticalityMetrics)
          '#4299E1'  // Blue - Low Risk (from CriticalityMetrics)
        ],
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: 8, // Rounded bar tops
        borderSkipped: false,
        barThickness: 20, // Make bars slimmer
        categoryPercentage: 0.6, // Reduce category width
        hoverBackgroundColor: [
          '#E53E3E', // Darker red on hover
          '#DD6B20', // Darker orange on hover
          '#3182CE'  // Darker blue on hover
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Horizontal bars
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
            const label = context.dataset.label || '';
            const value = context.parsed.x || 0;
            return `${context.label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 40,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11,
            weight: 'bold'
          }
        },
        categoryPercentage: 0.6, // Make bars slimmer
        barPercentage: 0.8 // Additional bar thickness control
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    hover: {
      animationDuration: 200
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
          <Heading size="sm" color="gray.800">Criticality- Attrition Chart</Heading>
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
      borderColor="gray.100"
      h="full" 
      display="flex" 
      flexDirection="column"
      maxH="320px"
      minH="240px"
    >
      <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between" align="center">
          <Heading size="md" color="gray.800">Criticality- Attrition Chart</Heading>
          <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
        </HStack>
      </Card.Header>
      <Card.Body p={6} h="full" display="flex" flexDirection="column">
        <Flex h="full" gap={10} align="start" justify="flex-end" pr={4} pt={-1}>
          {/* Chart and Legend Container - positioned to the right */}
          {/* Empty content area */}
          <Box w="full" h="200px" display="flex" align="center" justify="center">
            <Text color="gray.500" fontSize="sm">
              Chart content will be displayed here
            </Text>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};