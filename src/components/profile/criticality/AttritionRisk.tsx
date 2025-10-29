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
  Flex
} from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface CriticalityVsRiskProps {
  userId?: string;
}


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
      <Card.Root bg="#ffffff" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="space-between" align="center">
            <Heading size="sm" color="gray.800">Criticality - Attrition Data</Heading>
            <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
          </HStack>
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <VStack gap={4} align="center" justify="center" minH="200px">
            <Spinner size="lg" color="teal.500" />
            <Text color="gray.500" fontSize="sm">Loading data...</Text>
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
      shadow="xs" 
      borderRadius="3xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
      w="full"
      transition="all 0.2s ease"
      suppressHydrationWarning
    >
      <Card.Header px={4} py={2} >
        <VStack gap={1}>
          <Heading
            size="md"
            color="gray.900"
            textAlign="center"
            fontWeight="normal"
          >
            Attrition Risk Analysis
          </Heading>
          <Box 
                          w="full" 
                          h="0.9px" 
                          bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
                      />
        </VStack>
      </Card.Header>
      <Card.Body h="full" display="flex" flexDirection="column" gap={2} w="full" p={0}>
        <VStack gap={6} align="center" flex="1" justify="center" minH="0">
          {/* Chart */}
          <Box
            w="230px"
            h="230px"
            // filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.0))"
            transition="all 0.2s ease"
          >
            <Doughnut data={mergedDonutData} options={donutOptions} />
          </Box>

          {/* Legend positioned at bottom */}
          <VStack align="center" gap={0} w="full" maxW="300px">
            <Grid templateColumns="repeat(2, 1fr)" gap={0} w="full">
              <Flex align="center" gap={2} minH="20px">
                <Box w="8px" h="8px" borderRadius="full" bg="#F56565" flexShrink={0} />
                <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Mental Health</Text>
              </Flex>
              <Flex align="center" gap={2} minH="20px">
                <Box w="8px" h="8px" borderRadius="full" bg="#4299E1" flexShrink={0} />
                <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Motivation</Text>
              </Flex>
              <Flex align="center" gap={2} minH="20px">
                <Box w="8px" h="8px" borderRadius="full" bg="#ECC94B" flexShrink={0} />
                <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Career Opportunities</Text>
              </Flex>
              <Flex align="center" gap={2} minH="20px">
                <Box w="8px" h="8px" borderRadius="full" bg="#48BB78" flexShrink={0} />
                <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Personal</Text>
              </Flex>
            </Grid>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root >
  );
};