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
  Flex
} from '@chakra-ui/react';
import { Card } from '@chakra-ui/react';
import { criticalityApi, CriticalityVsRiskData, RiskDistribution } from '../../../services';

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

  // Pie chart data for display
  const pieData = [
    { label: 'High Risk', value: 25, color: '#EF4444', percentage: 17.2 },
    { label: 'Medium Risk', value: 45, color: '#F59E0B', percentage: 31.0 },
    { label: 'Low Risk', value: 75, color: '#22C55E', percentage: 51.7 }
  ];

  // Calculate total for percentage calculation
  const total = pieData.reduce((sum, item) => sum + item.value, 0);

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
                <HStack justify="space-between" align="center">
                  <Heading size="sm" color="gray.800">Attrition Risks Distribution</Heading>
                  {/* <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text> */}
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
          Attrition Risks Distribution
          </Heading>
          <Box 
                          w="80%" 
                          h="0.9px" 
                          bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
                      />
        </VStack>
      </Card.Header>
      <Card.Body h="full" display="flex" flexDirection="column" w="full" p={2} overflow="hidden">
        <VStack 
          align="center" 
          justify="center" 
          h="full" 
          w="full"
          gap={2}
          flex="1"
          minH="0"
        >
          {/* Clean Minimalist Pie Chart */}
          <Box 
            position="relative" 
            w="220px"
            h="220px"
            flex="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <svg
              width="220px"
              height="220px"
              viewBox="-80 -80 160 160"
              style={{
                filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))",
                maxWidth: "220px",
                maxHeight: "220px"
              }}
            >
              {/* Pie slices */}
              {(() => {
                let currentAngle = -Math.PI / 2; // Start from top
                return pieData.map((item, index) => {
                  const sliceAngle = (item.value / total) * 2 * Math.PI;
                  const endAngle = currentAngle + sliceAngle;
                  const path = createPieSlice(currentAngle, endAngle, 80, -10); // Full pie chart
                  
                  const slice = (
                    <g key={index}>
                      {/* Clean slice */}
                      <path
                        d={path}
                        fill={item.color}
                        stroke="white"
                        strokeWidth="5"
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
              
              {/* Clean center circle */}
              <circle
                cx="0"
                cy="0"
                r="24"
                fill="white"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
       
            </svg>
          </Box>

          {/* Clean Legend - Bottom */}
          <VStack align="left" gap={0} w="full" maxW="300px">
            <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full">
              {pieData.map((item, index) => (
                <Flex key={index} align="center" gap={2} minH="30px">
                  <Box
                    w="8px"
                    h="8px"
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
            
            {/* Summary */}
            {/* <Box w="full" h="0.5px" bg="gray.200" my={1} /> */}
            <Flex align="center" justify="center" w="full" minH="16px">
              {/* <Text fontSize="xs" fontWeight="600" color="gray.600" mr={2}>
                Total Users:
              </Text>
              <Text fontSize="xs" fontWeight="700" color="gray.900">
                {total} */}
              {/* </Text> */}
            </Flex>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};