'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Grid,
  GridItem,
  Card,
  Heading,
  Flex
} from '@chakra-ui/react';
import { 
  Briefcase, 
  AlertTriangle, 
  TrendingUp, 
  Award,
  User,
  Target
} from 'lucide-react';

interface CandidateCVProps {
  name: string;
  photo?: string;
  summary: string;
  projectsWorked: number;
  skills: string[];
  concerns: string[];
  attritionRisk: 'Low' | 'Medium' | 'High';
  projectImpact: string;
  role?: string;
  department?: string;
}

export const CandidateCVTemplate: React.FC<CandidateCVProps> = ({
  name,
  photo,
  summary,
  projectsWorked,
  skills,
  concerns,
  attritionRisk,
  projectImpact,
  role = 'Software Engineer',
  department = 'Engineering'
}) => {
  const getAttritionColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getAttritionBg = (risk: string) => {
    switch (risk) {
      case 'High': return 'red.50';
      case 'Medium': return 'orange.50';
      case 'Low': return 'green.50';
      default: return 'gray.50';
    }
  };

  return (
    <Card.Root
      bg="white"
      borderRadius="2xl"
      shadow="lg"
      border="2px solid"
      borderColor="gray.200"
      overflow="hidden"
      maxW="600px"
      w="full"
    >
      {/* Header with Photo and Basic Info */}
      <Card.Header
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        p={6}
        borderBottom="3px solid"
        borderColor="purple.300"
      >
        <HStack gap={4} align="start">
          <Avatar.Root size="xl">
            <Avatar.Fallback name={name} />
            {photo && <Avatar.Image src={photo} />}
          </Avatar.Root>
          <VStack align="start" gap={1} flex={1}>
            <Heading size="lg" color="white" fontWeight="bold">
              {name}
            </Heading>
            <Text color="whiteAlpha.90" fontSize="sm" fontWeight="medium">
              {role}
            </Text>
            <Text color="whiteAlpha.80" fontSize="xs">
              {department}
            </Text>
          </VStack>
        </HStack>
      </Card.Header>

      <Card.Body p={5}>
        {/* Brief Summary */}
        <Box mb={4}>
          <HStack gap={2} mb={2}>
            <User size={16} color="#667eea" />
            <Text fontSize="sm" fontWeight="bold" color="gray.800">
              Summary
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.700" lineHeight="1.5">
            {summary}
          </Text>
        </Box>

        <Box h="1px" bg="gray.200" my={4} />

        {/* Quick Metrics Grid */}
        <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={4}>
          {/* Projects Worked */}
          <GridItem>
            <Box
              p={3}
              bg="blue.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="blue.200"
            >
              <HStack gap={2} mb={1}>
                <Briefcase size={14} color="#3b82f6" />
                <Text fontSize="xs" fontWeight="bold" color="blue.800">
                  Projects
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {projectsWorked}
              </Text>
              <Text fontSize="xs" color="blue.700">
                Active Projects
              </Text>
            </Box>
          </GridItem>

          {/* Attrition Risk */}
          <GridItem>
            <Box
              p={3}
              bg={getAttritionBg(attritionRisk)}
              borderRadius="lg"
              border="1px solid"
              borderColor={`${getAttritionColor(attritionRisk)}.200`}
            >
              <HStack gap={2} mb={1}>
                <AlertTriangle size={14} color={attritionRisk === 'High' ? '#ef4444' : attritionRisk === 'Medium' ? '#f59e0b' : '#10b981'} />
                <Text fontSize="xs" fontWeight="bold" color={`${getAttritionColor(attritionRisk)}.800`}>
                  Attrition Risk
                </Text>
              </HStack>
              <Badge
                colorScheme={getAttritionColor(attritionRisk)}
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
                fontWeight="bold"
              >
                {attritionRisk}
              </Badge>
            </Box>
          </GridItem>
        </Grid>

        {/* Skills */}
        <Box mb={4}>
          <HStack gap={2} mb={2}>
            <Award size={16} color="#8b5cf6" />
            <Text fontSize="sm" fontWeight="bold" color="gray.800">
              Skills
            </Text>
          </HStack>
          <Flex flexWrap="wrap" gap={2}>
            {skills.slice(0, 6).map((skill, index) => (
              <Badge
                key={index}
                bg="purple.50"
                color="purple.700"
                border="1px solid"
                borderColor="purple.200"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="medium"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && (
              <Badge
                bg="gray.100"
                color="gray.600"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                +{skills.length - 6} more
              </Badge>
            )}
          </Flex>
        </Box>

        {/* Project Impact */}
        <Box mb={4}>
          <HStack gap={2} mb={2}>
            <TrendingUp size={16} color="#10b981" />
            <Text fontSize="sm" fontWeight="bold" color="gray.800">
              Project Impact
            </Text>
          </HStack>
          <Box
            p={3}
            bg="green.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="green.200"
          >
            <Text fontSize="sm" color="green.800" fontWeight="medium">
              {projectImpact}
            </Text>
          </Box>
        </Box>

        {/* Concerns */}
        {concerns.length > 0 && (
          <Box>
            <HStack gap={2} mb={2}>
              <AlertTriangle size={16} color="#ef4444" />
              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                Concerns Raised
              </Text>
            </HStack>
            <VStack align="start" gap={2}>
              {concerns.map((concern, index) => (
                <Box
                  key={index}
                  p={2}
                  bg="red.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="red.200"
                  w="full"
                >
                  <Text fontSize="xs" color="red.800">
                    • {concern}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
