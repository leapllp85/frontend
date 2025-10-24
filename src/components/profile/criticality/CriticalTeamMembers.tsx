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
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';

import { criticalityApi, CriticalityVsRiskData, RiskDistribution } from '../../../services';

interface CriticalityVsRiskProps {
  userId?: string;
}

const CriticalTeamMembersData = [
  {
    name: 'John Doe',
    criticality: 'Medium',
    attritionRisk: 'High',
  },
  {
    name: 'Jane Smith',
    criticality: 'High',
    attritionRisk: 'Medium',
  },
  {
    name: 'Bob Johnson',
    criticality: 'Low',
    attritionRisk: 'Low',
  },
  {
    name: 'Alice Brown',
    criticality: 'High',
    attritionRisk: 'High',
  },
  {
    name: 'Mike Wilson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
  },
  {
    name: 'Sarah Davis',
    criticality: 'High',
    attritionRisk: 'Low',
  },
  {
    name: 'Tom Garcia',
    criticality: 'Medium',
    attritionRisk: 'High',
  },
  {
    name: 'Lisa Chen',
    criticality: 'High',
    attritionRisk: 'Medium',
  },
  {
    name: 'David Martinez',
    criticality: 'High',
    attritionRisk: 'High',
  },
  {
    name: 'Emma Thompson',
    criticality: 'Medium',
    attritionRisk: 'Low',
  },
  {
    name: 'James Rodriguez',
    criticality: 'Low',
    attritionRisk: 'High',
  },
  {
    name: 'Sophia Lee',
    criticality: 'High',
    attritionRisk: 'Medium',
  },
  {
    name: 'Ryan Anderson',
    criticality: 'Medium',
    attritionRisk: 'High',
  },
  {
    name: 'Olivia Taylor',
    criticality: 'High',
    attritionRisk: 'Low',
  },
  {
    name: 'Kevin White',
    criticality: 'Low',
    attritionRisk: 'Medium',
  },
  {
    name: 'Maya Patel',
    criticality: 'High',
    attritionRisk: 'High',
  },
  {
    name: 'Alex Johnson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
  },
  {
    name: 'Grace Kim',
    criticality: 'High',
    attritionRisk: 'Low',
  },
];  

const CriticalTeamMember = ({ name, criticality, attritionRisk }: { name: string; criticality: string; attritionRisk: string }) => {
  return (
    <HStack py={2} w="full" justifyContent="space-between">
      <HStack>
        <Box
          width="10px"
          height="10px"
          background="red"
          borderRadius={"full"}
          box-shadow="0px 0px 4px rgba(0, 0, 0, 0.25)"
          transform="matrix(-1, 0, 0, 1, 0, 0)"
        ></Box>

        <Text
          fontSize="sm" 
          color="gray.600" 
          textAlign="center"
          fontWeight="normal"
        >{name}</Text>
      </HStack>
      {/* Red Color Badge for High Criticality, High Attrition Risk */}
      {/* Yellow Color Badge for High Criticality, Medium Attrition Risk */}
      {/* Green Color Badge for High Criticality, Low Attrition Risk */}
      {
        attritionRisk === 'High' ? (
          <Badge variant="solid" colorScheme="red">{criticality}</Badge>
        ) : attritionRisk === 'Medium' ? (
          <Badge variant="solid" colorScheme="yellow">{criticality}</Badge>
        ) : (
          <Badge variant="solid" colorScheme="green">{criticality}</Badge>
        )
      }
    </HStack>
  );
};



export const CriticalTeamMembers: React.FC<CriticalityVsRiskProps> = ({ userId }) => {
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
  if (loading) {
    return (
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="space-between" align="center">
     
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
            color="gray.800" 
            textAlign="center"
            fontWeight="normal"
          >
            Top 5% Critical Members
          </Heading>
          <Box 
            w="80%" 
            h="1.1px" 
            bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
          />
        </VStack>
      </Card.Header>
      <Card.Body h="full" display="flex" flexDirection="row" gap={0} w="full" px={7} py={6} pb={10}>
        <SimpleGrid columns={2} gap={5} w="full" h="full">
          {CriticalTeamMembersData.map((member, index) => (
            <Box key={index} w="full">
              <CriticalTeamMember 
                name={member.name}
                criticality={member.criticality}
                attritionRisk={member.attritionRisk}
              />
            </Box>
          ))}
        </SimpleGrid>
      </Card.Body>
    </Card.Root>
  );
};