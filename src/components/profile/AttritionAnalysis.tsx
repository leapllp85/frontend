'use client';

import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  HStack, 
  Text, 
  Box, 
  Heading,
  Spinner,
  Grid,
  GridItem,
  Flex,
  Card
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

interface AttritionAnalysisProps {
  userId?: string;
}

export const AttritionAnalysis: React.FC<AttritionAnalysisProps> = ({ userId }) => {
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
  const distributionData = [
    { label: 'High Risk', value: 25, color: '#EF4444', percentage: 17.2 },
    { label: 'Medium Risk', value: 45, color: '#F59E0B', percentage: 31.0 },
    { label: 'Low Risk', value: 75, color: '#22C55E', percentage: 51.7 }
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
          Object.values(riskData["Mental Health"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Motivation"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Career Opportunities"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Personal"]).reduce((a, b) => a + b, 0)
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

  // Calculate total for percentage calculation
  const total = distributionData.reduce((sum, item) => sum + item.value, 0);

  // Generate SVG path for pie slice
  const createPieSlice = (startAngle: number, endAngle: number, radius: number, innerRadius: number = 0) => {
    const x1 = Math.cos(startAngle) * radius;
    const y1 = Math.sin(startAngle) * radius;
    const x2 = Math.cos(endAngle) * radius;
    const y2 = Math.sin(endAngle) * radius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    if (innerRadius > 0) {
      // Donut chart
      const x3 = Math.cos(endAngle) * innerRadius;
      const y3 = Math.sin(endAngle) * innerRadius;
      const x4 = Math.cos(startAngle) * innerRadius;
      const y4 = Math.sin(startAngle) * innerRadius;

      return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    } else {
      // Full pie chart
      return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }
  };

  if (loading) {
    return (
      <Card.Root bg="#ffffff" shadow="sm" borderRadius="3xl" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="center" align="center">
            <Heading size="md" color="gray.100" textAlign="center">Attrition Analysis</Heading>
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
          <Heading size="md" color="gray.100" textAlign="center">Attrition Analysis</Heading>
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
      // bg="#ffffff"
      // shadow="xs" 
      // borderRadius="3xl" 
      // h="full" 
      // display="flex" 
      // flexDirection="column" 
      // // border="1px solid" 
      // borderColor="gray.200"
      // maxW="800px"
      // transition="all 0.2s ease"
      // suppressHydrationWarning
      maxW="900px"
      bg="#ffffff"
      shadow="xs" 
      borderRadius="3xl" 
      h="full" 
      display="flex" 
      flexDirection="column"  
      borderColor="gray.100"
      // boxShadow="sm"
      p={2}
    >
      <Card.Header px={3} py={2}>
        <VStack gap={1}>
          <Heading 
            size="md" 
            color="gray.900" 
            textAlign="center"
            fontWeight="semibold"
          >
            Attrition Analysis
          </Heading>
          <Box 
            w="80%" 
            h="0.9px" 
            bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
          />
        </VStack>
      </Card.Header>
      
      <Card.Body h="full" display="flex" flexDirection="column" w="full" p={0} overflow="hidden">
        <HStack 
          align="stretch" 
          justify="space-between" 
          h="80%" 
          w="90%"
          gap={4}
          flex="1"
          minH="0"
        >
          {/* Left Side - Risk Distribution */}
          <VStack 
            align="center" 
            justify="center" 
            h="full" 
            w="50%"
            gap={3}
            flex="1"
            minH="0"
          >
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">
              Risk Distribution
            </Text>
            
            {/* Distribution Pie Chart */}
            <Box 
              position="relative" 
              w="240px"
              h="240px"
              flex="none"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="240px"
                height="240px"
                viewBox="-70 -70 140 140"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))",
                  maxWidth: "240px",
                  maxHeight: "240px"
                }}
              >
                {/* Pie slices */}
                {(() => {
                  let currentAngle = -Math.PI / 2; // Start from top
                  return distributionData.map((item, index) => {
                    const sliceAngle = (item.value / total) * 2 * Math.PI;
                    const endAngle = currentAngle + sliceAngle;
                    const path = createPieSlice(currentAngle, endAngle, 70, 45);
                    
                    const slice = (
                      <g key={index}>
                        <path
                          d={path}
                          fill={item.color}
                          stroke="white"
                          strokeWidth="3"
                          style={{
                            transition: "all 0.2s ease",
                            cursor: "pointer"
                          }}
                        />
                      </g>
                    );
                    
                    currentAngle = endAngle;
                    return slice;
                  });
                })()}
                
                {/* Center circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill="white"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              </svg>
            </Box>

            {/* Distribution Legend */}
            <VStack align="left" gap={1} w="full" maxW="200px">
              <Grid templateColumns="repeat(1, 1fr)" gap={1} w="full">
                {distributionData.map((item, index) => (
                  <Flex key={index} align="center" gap={2} minH="20px">
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg={item.color}
                      flexShrink={0}
                    />
                    <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>
                      {item.label}
                    </Text>
                    <Text fontSize="xs" fontWeight="700" color="gray.700" ml="auto">
                      {item.value}
                    </Text>
                  </Flex>
                ))}
              </Grid>
            </VStack>
          </VStack>

          {/* Right Side - Risk Analysis */}
          <VStack 
            align="center" 
            justify="center" 
            h="full" 
            w="50%"
            gap={3}
            flex="1"
            minH="0"
          >
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">
              Risk Analysis
            </Text>
            
            {/* Analysis Donut Chart */}
            <Box
              w="245px"
              h="245px"
              transition="all 0.2s ease"
            >
              <Doughnut data={analysisDonutData} options={donutOptions} />
            </Box>

            {/* Analysis Legend */}
            <VStack align="center" gap={1} w="full" maxW="200px">
              <Grid templateColumns="repeat(2, 1fr)" gap={1} w="full">
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#F56565" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Mental Health</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#4299E1" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Motivation</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#ECC94B" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Career Opp.</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#48BB78" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Personal</Text>
                </Flex>
              </Grid>
            </VStack>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
