'use client';

import React, { useState } from "react";
import { Box, Text, HStack, VStack, Card, Heading, Badge, Flex, Progress } from "@chakra-ui/react";
import { AlertTriangle, Calendar, Users, TrendingUp } from 'lucide-react';

interface ProjectRisk {
  id: string;
  title: string;
  team_members_count: number;
  go_live_date: string;
  criticality: 'High' | 'Medium' | 'Low';
  progress: number;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  risk_level?: 'high' | 'medium' | 'low' | 'critical';
  tasks: number;
  members: number;
  dueDate: string;
}

interface ProjectRisksProps {
  projects?: ProjectRisk[];
}

const defaultProjects: ProjectRisk[] = [
  {
    id: '1',
    title: 'Website Redesign',
    team_members_count: 1,
    go_live_date: 'Dec 25',
    criticality: 'High',
    progress: 11,
    riskLevel: 'High Risk',
    tasks: 1,
    members: 1,
    dueDate: 'Dec 25'
  },
  {
    id: '2',
    title: 'Strategy Workshop',
    team_members_count: 2,
    go_live_date: 'Nov 25',
    criticality: 'Medium',
    progress: 25,
    riskLevel: 'Medium Risk',
    tasks: 2,
    members: 2,
    dueDate: 'Nov 25'
  },
  {
    id: '3',
    title: 'Business Plan Development',
    team_members_count: 4,
    go_live_date: 'Nov 25',
    criticality: 'Low',
    progress: 61,
    riskLevel: 'Low Risk',
    tasks: 4,
    members: 4,
    dueDate: 'Nov 25'
  },
  {
    id: '4',
    title: 'Email Marketing Services',
    team_members_count: 16,
    go_live_date: 'Nov 25',
    criticality: 'Medium',
    progress: 33,
    riskLevel: 'Medium Risk',
    tasks: 16,
    members: 16,
    dueDate: 'Nov 25'
  },
  {
    id: '5',
    title: '6-month design retainer',
    team_members_count: 1,
    go_live_date: 'Nov 25',
    criticality: 'High',
    progress: 100,
    riskLevel: 'High Risk',
    tasks: 1,
    members: 1,
    dueDate: 'Nov 25'
  }
];

const getRiskColor = (level: 'High Risk' | 'Medium Risk' | 'Low Risk') => {
  switch (level) {
    case 'High Risk': return { 
      bg: 'red.50', 
      border: 'red.300', 
      text: 'red.600', 
      icon: '#EF4444',
      badge: 'red',
      progress: 'red.500'
    };
    case 'Medium Risk': return { 
      bg: 'orange.50', 
      border: 'orange.300', 
      text: 'orange.600', 
      icon: '#F97316',
      badge: 'orange',
      progress: 'orange.500'
    };
    case 'Low Risk': return { 
      bg: 'green.50', 
      border: 'green.300', 
      text: 'green.600', 
      icon: '#10B981',
      badge: 'green',
      progress: 'green.500'
    };
    default: return { 
      bg: 'gray.50', 
      border: 'gray.300', 
      text: 'gray.600', 
      icon: '#6B7280',
      badge: 'gray',
      progress: 'gray.500'
    };
  }
};

const ProjectCard = ({ project }: { project: ProjectRisk }) => {
  const [isHovered, setIsHovered] = useState(false);
  const riskColors = getRiskColor(project.riskLevel);
  
  return (
    <Box
      p={2.5}
      borderRadius="md"
      border="1px solid"
      borderColor={isHovered ? riskColors.border : 'gray.200'}
      bg={isHovered ? riskColors.bg : 'white'}
      transition="all 0.2s ease"
      cursor="pointer"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-1px)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HStack align="center" justify="space-between" gap={2}>
        {/* Left: Project Title and Progress */}
        <VStack align="start" gap={1} flex="1" minW="0">
          <Flex align="center" gap={2} w="full">
            <Text
              fontSize="xs"
              fontWeight="normal"
              color="gray.800"
              lineClamp={1}
              flex="1"
            >
              {project.title}
            </Text>
            <Badge
              colorScheme={riskColors.badge}
              fontSize="10px"
              px={1.5}
              py={0.5}
              borderRadius="sm"
              fontWeight="semibold"
              flexShrink={0}
            >
              {project.riskLevel}
            </Badge>
          </Flex>
          
          {/* Progress Bar - Compact */}
        {/*   <HStack w="full" gap={2}>
            <Box flex="1" minW="0">
              <Box w="full" bg="gray.200" borderRadius="full" h="4px" overflow="hidden">
                <Box
                  w={`${project.progress}%`}
                  bg={riskColors.progress}
                  h="full"
                  transition="all 0.3s ease"
                  borderRadius="full"
                />
              </Box>
            </Box>
            <Text fontSize="10px" color="gray.600" fontWeight="semibold" flexShrink={0}>
              {project.progress}%
            </Text>
          </HStack> */}
        </VStack>

        {/* Right: Compact Details */}
        <HStack gap={2} flexShrink={0}>
          <HStack gap={0.5}>
            <Users size={12} color="#6B7280" />
            <Text fontSize="10px" color="gray.600">
              {project.team_members_count}
            </Text>
          </HStack>
          <HStack gap={0.5}>
            <Calendar size={12} color="#6B7280" />
            <Text fontSize="10px" color="gray.600">
              {project.go_live_date}
            </Text>
          </HStack>
          <HStack gap={0.5}>
            <AlertTriangle size={12} color={riskColors.icon} />
            <Text fontSize="10px" color={riskColors.text} fontWeight="medium">
              {project.criticality}
            </Text>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  );
};

export const ProjectRisks: React.FC<ProjectRisksProps> = ({
  projects = defaultProjects
}) => {
  // Show all 5 projects
  const displayProjects = projects.slice(0, 5);

  return (
    <VStack h="full" align="stretch" gap={2}>
      {/* Header - Compact */}
      <HStack justify="space-between" align="center" pb={1.5} borderBottom="2px solid" borderColor="gray.200">
        <HStack gap={2}>
          <Box p={1.5} bg="orange.50" borderRadius="md">
            <AlertTriangle size={16} color="#F97316" />
          </Box>
          <VStack align="start" gap={0}>
            <Heading size="sm" color="gray.800" fontWeight="bold">
              Projects At Risk
            </Heading>
            <Text fontSize="10px" color="gray.500">
              Projects requiring immediate attention
            </Text>
          </VStack>
        </HStack>
        <Badge colorScheme="orange" fontSize="10px" px={1.5} py={0.5} borderRadius="sm">
          {projects.length} Projects
        </Badge>
      </HStack>

      {/* List of Projects - No Scroll */}
      <VStack gap={1.5} align="stretch" flex="1">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </VStack>

      {/* View More Footer - Compact */}
      {projects.length > 5 && (
        <Box 
          pt={1.5}
          borderTop="1px solid"
          borderColor="gray.200"
          textAlign="center"
        >
          <Text 
            fontSize="xs" 
            color="blue.500" 
            cursor="pointer" 
            fontWeight="semibold"
            _hover={{ color: "blue.600", textDecoration: "underline" }}
            transition="all 0.2s"
          >
            View All {projects.length} Projects →
          </Text>
        </Box>
      )}
    </VStack>
  );
};
