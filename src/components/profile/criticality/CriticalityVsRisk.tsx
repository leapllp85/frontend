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

  // Funnel data for display
  const funnelData = [
    { label: 'High Risk', value: 25, color: '#EF4444', width: '60px' },
    { label: 'Medium Risk', value: 45, color: '#F59E0B', width: '100px' },
    { label: 'Low Risk', value: 75, color: '#22C55E', width: '140px' }
  ];

  if (loading) {
    return (
            <Card.Root bg="#ffffff" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100" h="full" display="flex" flexDirection="column">
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
      shadow="sm" 
      borderRadius="3xl"
      border="2px solid" 
      borderColor="gray.50"
      h="full" 
      display="flex" 
      flexDirection="column"
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
          Attrition Risks Distribution
          </Heading>
          <Box 
                          w="80%" 
                          h="0.9px" 
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
          {/* 3D Funnel Chart - Trapezoid Shapes with Depth */}
          <VStack gap={2} w="full" h="full" justify="center" align="center">
            {/* High Risk - Top (widest trapezoid) with 3D effect */}
            <Box
              position="relative"
              w="220px"
              h="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transform="perspective(800px) rotateX(15deg)"
              _hover={{ 
                transform: "perspective(800px) rotateX(15deg) translateY(-4px) scale(1.02)", 
                transition: "all 0.4s ease" 
              }}
            >
              {/* 3D Base Layer */}
              <Box
                position="absolute"
                w="full"
                h="full"
                bg="linear-gradient(180deg, #B91C1C, #7F1D1D)"
                clipPath="polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)"
                transform="translateY(4px) translateX(2px)"
                opacity={1}
                borderRadius="3xl"
              />
              {/* Main 3D Surface */}
              <Box
                position="absolute"
                w="full"
                h="full"
                bg="linear-gradient(145deg, #FCA5A5 0%, #F87171 15%, #EF4444 40%, #DC2626 70%, #B91C1C 100%)"
                clipPath="polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)"
                boxShadow="0 8px 25px rgba(239, 68, 68, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.3)"
                borderRadius="4px"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "15%",
                  left: "20%",
                  right: "20%",
                  height: "25%",
                  // bg: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  borderRadius: "50%",
                  filter: "blur(3px)"
                }}
              />
              <Text fontSize="md" fontWeight="normal" color="white" zIndex={2} textShadow="0 1px 4px rgba(0,0,0,0.5)">
                High: 25
              </Text>
            </Box>

            {/* Medium Risk - Middle trapezoid with 3D effect */}
            <Box
              position="relative"
              w="170px"
              h="55px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transform="perspective(800px) rotateX(15deg)"
              _hover={{ 
                transform: "perspective(800px) rotateX(15deg) translateY(-4px) scale(1.02)", 
                transition: "all 0.4s ease" 
              }}
            >
              {/* 3D Base Layer */}
              <Box
                position="absolute"
                w="full"
                h="full"
                bg="linear-gradient(180deg, #B45309, #92400E)"
                clipPath="polygon(15% 0%, 85% 0%, 75% 100%, 25% 100%)"
                transform="translateY(4px) translateX(2px)"
                opacity={1}
                borderRadius="3xl"
              />
              {/* Main 3D Surface */}
              <Box
                position="absolute"
                w="full"
                h="full"
                bg="linear-gradient(145deg, #FDE047 0%, #FACC15 15%, #F59E0B 40%, #D97706 70%, #B45309 100%)"
                clipPath="polygon(15% 0%, 85% 0%, 75% 100%, 25% 100%)"
                boxShadow="0 8px 25px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.3)"
                borderRadius="3xl"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "15%",
                  left: "20%",
                  right: "20%",
                  height: "25%",
                  // bg: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  borderRadius: "50%",
                  filter: "blur(3px)"
                }}
              />
              <Text fontSize="md" fontWeight="normal" color="white" zIndex={2} textShadow="0 1px 4px rgba(0,0,0,0.5)">
                Medium: 45
              </Text>
            </Box>

            {/* Low Risk - Bottom (narrowest trapezoid) with 3D effect */}
            <Box
              position="relative"
              w="120px"
              h="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transform="perspective(800px) rotateX(15deg)"
              _hover={{ 
                transform: "perspective(800px) rotateX(15deg) translateY(-4px) scale(1.02)", 
                transition: "all 0.4s ease" 
              }}
            >
              {/* 3D Base Layer */}
              <Box
                position="absolute"
                w="full"
                h="full"
                bg="linear-gradient(180deg, #15803D, #166534)"
                clipPath="polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)"
                transform="translateY(4px) translateX(2px)"
                opacity={1}
                borderRadius="4px"
              />
              {/* Main 3D Surface */}
              <Box
                position="absolute"
                w="full"
                h="full"
                bg="linear-gradient(145deg, #86EFAC 0%, #4ADE80 15%, #22C55E 40%, #16A34A 70%, #15803D 100%)"
                clipPath="polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)"
                boxShadow="0 8px 25px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.3)"
                borderRadius="4px"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "15%",
                  left: "20%",
                  right: "20%",
                  height: "25%",
                  borderRadius: "80%",
                }}
              />
              <Text fontSize="md" fontWeight="normal" color="white" zIndex={2} textShadow="0 1px 4px rgba(0,0,0,0.5)">
                Low: 75
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};