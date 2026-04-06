'use client';

import React, { useState } from "react";
import { Box, Text, HStack, VStack, Heading, Flex, SimpleGrid } from "@chakra-ui/react";
import { Badge, BadgeColorScheme } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Users } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

interface ProjectRisk {
  id: number | string;
  title: string;
  description?: string;
  team_members_count: number;
  go_live_date: string;
  criticality: 'High' | 'Medium' | 'Low';
  status?: string;
  created_at?: string;
}

interface ProjectRisksProps {
  projects?: ProjectRisk[];
}

const defaultProjects: ProjectRisk[] = [
  {
    id: '1',
    title: 'Website Redesign',
    team_members_count: 1,
    go_live_date: '2024-12-25',
    criticality: 'High',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Strategy Workshop',
    team_members_count: 2,
    go_live_date: '2024-11-25',
    criticality: 'Medium',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Business Plan Development',
    team_members_count: 4,
    go_live_date: '2024-11-25',
    criticality: 'Low',
    status: 'Active'
  },
  {
    id: '4',
    title: 'Email Marketing Services',
    team_members_count: 16,
    go_live_date: '2024-11-25',
    criticality: 'Medium',
    status: 'Active'
  },
  {
    id: '5',
    title: '6-month design retainer',
    team_members_count: 1,
    go_live_date: '2024-11-25',
    criticality: 'High',
    status: 'Active'
  }
];

// Helper function to derive risk level from criticality
const getRiskLevelFromCriticality = (criticality: 'High' | 'Medium' | 'Low'): 'High Risk' | 'Medium Risk' | 'Low Risk' => {
  switch (criticality) {
    case 'High':
      return 'High Risk';
    case 'Medium':
      return 'Medium Risk';
    case 'Low':
      return 'Low Risk';
    default:
      return 'Medium Risk';
  }
};

const getRiskColor = (level: 'High Risk' | 'Medium Risk' | 'Low Risk'): {
  bg: string;
  border: string;
  text: string;
  icon: string;
  badge: BadgeColorScheme;
  progress: string;
} => {
  switch (level) {
    case 'High Risk': return { 
      bg: 'red.50', 
      border: 'red.300', 
      text: 'red.600', 
      icon: '#EF4444',
      badge: 'red' as BadgeColorScheme,
      progress: 'red.500'
    };
    case 'Medium Risk': return { 
      bg: 'orange.50', 
      border: 'orange.300', 
      text: 'orange.600', 
      icon: '#F97316',
      badge: 'orange' as BadgeColorScheme,
      progress: 'orange.500'
    };
    case 'Low Risk': return { 
      bg: 'green.50', 
      border: 'green.300', 
      text: 'green.600', 
      icon: '#10B981',
      badge: 'green' as BadgeColorScheme,
      progress: 'green.500'
    };
    default: return { 
      bg: 'gray.50', 
      border: 'gray.300', 
      text: 'gray.600', 
      icon: '#6B7280',
      badge: 'gray' as BadgeColorScheme,
      progress: 'gray.500'
    };
  }
};

const ProjectCard = ({ project }: { project: ProjectRisk }) => {
  const [isHovered, setIsHovered] = useState(false);
  const riskLevel = getRiskLevelFromCriticality(project.criticality);
  const riskColors = getRiskColor(riskLevel);
  
  return (
    <Box
      p={3}
      borderRadius="xl"
      border="1px solid"
      borderColor={isHovered ? riskColors.border : 'gray.200'}
      bg={isHovered ? riskColors.bg : 'white'}
      transition="all 0.2s ease"
      cursor="pointer"
      shadow="sm"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
        borderColor: riskColors.border
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VStack align="stretch" gap={2.5}>
        {/* Title */}
        <Text
          fontSize="sm"
          fontWeight="600"
          color="gray.900"
          lineClamp={1}
          letterSpacing="-0.01em"
        >
          {project.title}
        </Text>
        
        {/* Details Row with Risk Badge */}
        <HStack gap={3} fontSize="xs" color="gray.600" flexWrap="wrap" justify="space-between" align="center">
          <HStack gap={3}>
            <HStack gap={1.5}>
              <Users size={14} color="#6B7280" strokeWidth={2} />
              <Text fontWeight="500">{project.team_members_count}</Text>
            </HStack>
            <HStack gap={1.5}>
              <Calendar size={14} color="#6B7280" strokeWidth={2} />
              <Text fontWeight="500">{project.go_live_date}</Text>
            </HStack>
          </HStack>
          
          {/* Risk Badge on same line */}
          <Badge
            colorScheme={riskColors.badge}
            fontSize="2xs"
            px={2}
            py={0.5}
            borderRadius="md"
            fontWeight="600"
            textTransform="uppercase"
            flexShrink={0}
          >
            {project.criticality} Risk
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
};

export const ProjectRisks: React.FC<ProjectRisksProps> = ({
  projects = defaultProjects
}) => {
  const { itemsToShow } = useResponsive(3, 5);
  const displayProjects = projects.slice(0, itemsToShow);

  return (
    <VStack h="full" align="stretch" gap={4}>
      {/* Header */}
      <HStack justify="space-between" align="start" pb={3} borderBottom="2px solid" borderColor="gray.200">
        <HStack gap={3} align="start">
          <Box p={2} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.100">
            <AlertTriangle size={20} color="#F97316" strokeWidth={2.5} />
          </Box>
          <VStack align="start" gap={0.5}>
            <Heading size="md" color="gray.900" fontWeight="700" letterSpacing="-0.02em">
              Projects At Risk
            </Heading>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Projects requiring immediate attention
            </Text>
          </VStack>
        </HStack>
        <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full" fontWeight="700">
          {projects.length} Projects
        </Badge>
      </HStack>

      {/* List of Projects */}
      {projects.length > 0 && (
        <SimpleGrid 
          columns={{ base: 1, md: 2 }} 
          gap={3} 
          flex="1"
          alignItems="start"
        >
          {displayProjects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SimpleGrid>
      )}
      {/* Empty State */}
      {projects.length === 0 && (
        <Box 
          h={"full"}
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text 
            fontSize="0.8125rem" 
            color="gray.400" 
            fontWeight="500"
            letterSpacing="0.005em"
          >
            No projects at risk
          </Text>
        </Box>
      )}

      {/* View More Footer */}
      {projects.length > 0 && (
        <Box 
          pt={3}
          borderTop="1px solid"
          borderColor="gray.200"
          textAlign="center"
        >
          <Text 
            fontSize="sm" 
            color="blue.600" 
            cursor="pointer" 
            fontWeight="600"
            _hover={{ color: "blue.700", textDecoration: "underline" }}
            transition="all 0.2s"
            letterSpacing="-0.01em"
          >
            View All {projects.length} Projects →
          </Text>
        </Box>
      )}

    </VStack>
  );
};
