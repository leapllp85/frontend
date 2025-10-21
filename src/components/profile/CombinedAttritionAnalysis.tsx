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
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CombinedAttritionAnalysisProps {
  userId?: string;
}

interface AttritionData {
  id: number;
  year: number;
  month: number;
  high: number;
  medium: number;
  low: number;
  manager: number;
}

// Legend item component
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

export const CombinedAttritionAnalysis: React.FC<CombinedAttritionAnalysisProps> = ({ userId }) => {
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

  // Default trend data
  const defaultTrendData: AttritionData[] = [
    { id: 1, year: 2025, month: 6, high: 280, medium: 320, low: 290, manager: 1 },
    { id: 2, year: 2025, month: 7, high: 295, medium: 335, low: 305, manager: 1 },
    { id: 3, year: 2025, month: 8, high: 310, medium: 350, low: 295, manager: 1 },
    { id: 4, year: 2025, month: 9, high: 318, medium: 360, low: 302, manager: 1 },
    { id: 5, year: 2025, month: 10, high: 326, medium: 368, low: 310, manager: 1 },
    { id: 6, year: 2025, month: 11, high: 340, medium: 375, low: 315, manager: 1 }
  ];

  // Double Donut Chart Data - Inner (9 partitions) + Outer (3 partitions)
  const doubleDonutData = {
    datasets: [
      // Inner Ring - 9 Criticality Subdivisions
      {
        label: 'Criticality',
        data: [25, 25, 25, 40, 40, 40, 37, 37, 36],
        backgroundColor: [
          '#dc2626', '#ef4444', '#f87171', // High Criticality
          '#ea580c', '#f59e0b', '#fbbf24', // Medium Criticality
          '#16a34a', '#22c55e', '#4ade80'  // Low Criticality
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
      legend: { display: false },
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
    cutout: '55%',
    radius: '100%',
    animation: { duration: 1500, easing: 'easeOutQuart' as const },
    elements: { arc: { borderWidth: 2 } }
  };

  // Attrition distribution donut chart
  const attritionDonutData = {
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
          '#E53E3E', '#F56565', '#FC8181', // Mental Health
          '#2B6CB0', '#4299E1', // Motivation
          '#D69E2E', '#ECC94B', '#F6E05E', // Career
          '#38A169', '#48BB78' // Personal
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
          Object.values(riskData["Career Opputunities"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Personal"]).reduce((a, b) => a + b, 0)
        ],
        backgroundColor: ['#F56565', '#4299E1', '#ECC94B', '#48BB78'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        cutout: '70%',
        hoverOffset: 4
      }
    ]
  };

  const attritionDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
    animation: { duration: 1500, easing: 'easeOutQuart' as const },
    interaction: { intersect: false, mode: 'index' as const },
    elements: { arc: { borderWidth: 0 } }
  };

  // Line chart data for trends
  const trendChartData = {
    labels: defaultTrendData.map(item => `${item.year}-${String(item.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'High Attrition Risk',
        data: defaultTrendData.map(item => item.high),
        borderColor: '#FF4757',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: '#FF4757',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 3,
        fill: false,
        tension: 0.5,
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const
      },
      {
        label: 'Medium Attrition Risk',
        data: defaultTrendData.map(item => item.medium),
        borderColor: '#FFA726',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: '#FFA726',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 3,
        fill: false,
        tension: 0.5,
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const
      },
      {
        label: 'Low Attrition Risk',
        data: defaultTrendData.map(item => item.low),
        borderColor: '#66BB6A',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: '#66BB6A',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 3,
        fill: false,
        tension: 0.5,
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const
      }
    ]
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'transparent',
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          font: { size: 11, weight: 'bold' as const },
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#4A5568'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return `Month: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} employees`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', lineWidth: 1 },
        ticks: { color: '#4A5568', font: { size: 11, weight: 'normal' as const }, padding: 8 },
        border: { display: false }
      },
      y: {
        beginAtZero: false,
        min: 250,
        grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', lineWidth: 1 },
        ticks: { color: '#4A5568', font: { size: 11, weight: 'normal' as const }, padding: 8 },
        border: { display: false }
      }
    },
    elements: {
      point: { hoverBackgroundColor: '#FFFFFF', hoverBorderWidth: 4 },
      line: { borderCapStyle: 'round' as const, borderJoinStyle: 'round' as const }
    },
    animation: { duration: 1500, easing: 'easeOutCubic' as const },
    interaction: { intersect: false, mode: 'nearest' as const },
    hover: { mode: 'nearest' as const, intersect: false }
  };

  if (loading) {
    return (
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="space-between" align="center">
            <Heading size="sm" color="gray.800">Combined Attrition Analysis</Heading>
            <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
          </HStack>
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <VStack gap={4} align="center" justify="center" minH="200px">
            <Spinner size="lg" color="teal.500" />
            <Text color="gray.500" fontSize="sm">Loading analysis...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root bg="white" shadow="lg" borderRadius="2xl" h="full" display="flex" flexDirection="column" border="1px solid" borderColor="gray.200">
        <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="sm" color="gray.800">Combined Attrition Analysis</Heading>
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
            <VStack gap={2} align="start">
              <Text fontSize="sm" fontWeight="semibold" color="red.800">Error loading analysis</Text>
              <Text fontSize="sm" color="red.600">{error}</Text>
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
      maxH="600px"
      minH="550px"
      _hover={{ 
        transform: "translateY(-2px)", 
        shadow: "md",
        transition: "all 0.1s ease"
      }}
      transition="all 0.2s ease"
    >
      <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between" align="center">
          <Heading size="md" color="gray.800">Combined Criticality & Attrition Risk Analysis</Heading>
          <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
        </HStack>
      </Card.Header>

      <Card.Body p={4} h="full" display="flex" flexDirection="column" gap={4}>
        {/* Top Section - Charts and Team Members */}
        <Box display="flex" flexDirection="row" gap={4} h="250px">
          {/* Left side - Critical Team Members */}
          <Box w="20%" display="flex" flexDirection="column">
            <Text fontSize="sm" fontWeight="600" color="gray.800" mb={3} textAlign="left">
              Top Talent - Risk Levels
            </Text>
            
            <VStack gap={1} align="left" flex="1">
              {[
                { name: "Hans Zeimer", risk: "red.500" },
                { name: "Cristopher hussain", risk: "orange.500" },
                { name: "Fatimatul Robert", risk: "red.500" },
                { name: "Ahmed Sharma", risk: "green.500" },
                { name: "Maria Johnson", risk: "orange.500" },
                { name: "Tim Johnson", risk: "orange.500" }
              ].map((member, index) => (
                <Box key={index} pb={1} borderBottom="1px solid" borderColor="gray.200">
                  <HStack justify="left" align="left" mb={1}>
                    <Box px={1.5} py={0.5} bg={member.risk} color="white" borderRadius="sm" fontSize="2xs" fontWeight="semi-bold">
                      {member.name}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Middle section - Double Donut Chart */}
          <Box w="40%" display="flex" flexDirection="column" alignItems="center">
            <Text fontSize="sm" fontWeight="600" color="gray.800" mb={3} textAlign="center">
              Criticality & Risk Matrix
            </Text>
            
            <HStack gap={4} align="center" w="full" justify="center" flex="1">
              <Box 
                w="180px" 
                h="180px"
                filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                _hover={{ 
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease"
                }}
                transition="all 0.2s ease"
                position="relative"
              >
                <Doughnut data={doubleDonutData} options={doubleDonutOptions} />
              </Box>
              
              <VStack gap={3} align="start" w="120px">
                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.700" mb={1}>Inner Circle</Text>
                  <HStack gap={2} align="center">
                    <Box w={3} h={3} bg="#ff0000" borderRadius="full" />
                    <Text fontSize="xs" color="gray.700" fontWeight="500">Criticality</Text>
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.700" mb={1}>Outer Circle</Text>
                  <HStack gap={2} align="center">
                    <Box w={3} h={3} bg="#ff0000" borderRadius="full" />
                    <Text fontSize="xs" color="gray.700" fontWeight="500">Attrition Risk</Text>
                  </HStack>
                </Box>
              </VStack>
            </HStack>
          </Box>
          
          {/* Right side - Attrition Distribution */}
          <Box w="40%" display="flex" flexDirection="column" alignItems="center">
            <Text fontSize="sm" fontWeight="600" color="gray.800" mb={3} textAlign="center">
              Attrition Distribution
            </Text>
            
            <HStack gap={3} align="center" flex="1">
              <Box 
                w="160px" 
                h="160px"
                filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))"
                _hover={{ 
                  filter: "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))",
                  transform: "translateY(-2px)",
                  transition: "all 0.1s ease"
                }}
                transition="all 0.2s ease"
              >
                <Doughnut data={attritionDonutData} options={attritionDonutOptions} />
              </Box>

              <Box display="flex" flexDirection="column" justifyContent="center" ml={2}>
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>Categories</Text>
                <VStack gap={2} align="start">
                  <LegendItem color="#F56565" label="Mental Health" />
                  <LegendItem color="#4299E1" label="Motivation" />
                  <LegendItem color="#ECC94B" label="Career Opp." />
                  <LegendItem color="#48BB78" label="Personal" />
                </VStack>
              </Box>
            </HStack>
          </Box>
        </Box>

        {/* Bottom Section - Trend Line Chart */}
        <Box display="flex" flexDirection="column" h="250px">
          <Text fontSize="sm" fontWeight="600" color="gray.800" mb={3} textAlign="center">
            Attrition Risk Trends Over Time
          </Text>
          
          <Box 
            w="full" 
            h="full" 
            bg="transparent" 
            borderRadius="xl" 
            p={4}
            position="relative"
          >
            <Line data={trendChartData} options={trendChartOptions} />
          </Box>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
