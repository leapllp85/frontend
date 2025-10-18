'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, Heading, Badge } from "@chakra-ui/react";

interface ProjectRisk {
  id: string;
  title: string;
  team_members_count: number;
  go_live_date: string;
  criticality: 'High' | 'Medium' | 'Low';
  progress: number;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
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
    title: 'Esparza-Jordan Proactive',
    team_members_count: 7,
    go_live_date: 'Dec 25',
    criticality: 'High',
    progress: 55,
    riskLevel: 'High Risk',
    tasks: 12345,
    members: 7,
    dueDate: 'Dec 25'
  },
  {
    id: '2',
    title: 'Esparza-Jordan Proactive',
    team_members_count: 3,
    go_live_date: 'Nov 25',
    criticality: 'Medium',
    progress: 65,
    riskLevel: 'Medium Risk',
    tasks: 28340,
    members: 3,
    dueDate: 'Nov 25'
  },
  {
    id: '3',
    title: 'Esparza-Jordan Proactive',
    team_members_count: 3,
    go_live_date: 'Nov 25',
    criticality: 'Low',
    progress: 85,
    riskLevel: 'Low Risk',
    tasks: 34340,
    members: 3,
    dueDate: 'Nov 25'
  },
  {
    id: '4',
    title: 'Esparza-Jordan Proactive',
    team_members_count: 3,
    go_live_date: 'Nov 25',
    criticality: 'Medium',
    progress: 75,
    riskLevel: 'Medium Risk',
    tasks: 15000,
    members: 3,
    dueDate: 'Nov 25'
  }
];

const getRiskColor = (level: 'High Risk' | 'Medium Risk' | 'Low Risk') => {
  switch (level) {
    case 'High Risk': return { colorPalette: 'red', bgColor: 'red.500' };
    case 'Medium Risk': return { colorPalette: 'yellow', bgColor: 'yellow.500' };
    case 'Low Risk': return { colorPalette: 'green', bgColor: 'green.500' };
    default: return { colorPalette: 'gray', bgColor: 'gray.500' };
  }
};

export const ProjectRisks: React.FC<ProjectRisksProps> = ({
  projects = defaultProjects
}) => {
  // Sort projects by risk priority (High > Medium > Low) and show only top 4
  const getTopPriorityProjects = (projects: ProjectRisk[]) => {
    const riskPriority = { 'High Risk': 3, 'Medium Risk': 2, 'Low Risk': 1 };
    return projects
      .sort((a, b) => riskPriority[b.riskLevel] - riskPriority[a.riskLevel])
      .slice(0, 4);
  };

  const topProjects = getTopPriorityProjects(projects);

  return (
    <Card.Root 
      bg="#e6fffa"
      shadow="sm" 
      borderRadius="2xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
      maxH="320px"
      minH="280px"
    >
      <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between" align="center">
          <Heading size="sm" color="gray.800">Projects At Risk</Heading>
          <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
        </HStack>
      </Card.Header>
      <Card.Body p={3} flex="1" overflow="auto">
        <VStack gap={2.5} align="start">
          {topProjects.map((project) => {
            const riskColors = getRiskColor(project.riskLevel);
            return (
              <Box key={project.id}>
                <HStack justify="space-between" mb={1.5} align="start">
                  <VStack align="start" gap={0.5} flex={1} minW={0}>
                    <HStack gap={2} wrap="wrap">
                      <Text fontSize="xs" fontWeight="semibold" color="gray.800" truncate>
                        {project.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {project.team_members_count}m
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Due: {project.go_live_date}
                    </Text>
                  </VStack>
                  <VStack align="end" gap={0.5} flexShrink={0}>
                    <Badge colorPalette={riskColors.colorPalette} size="sm">
                      {project.criticality}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {project.progress}%
                    </Text>
                  </VStack>
                </HStack>
                <Box w="full" bg="gray.200" borderRadius="full" h="1.5">
                  <Box 
                    w={`${project.progress}%`} 
                    bg={riskColors.bgColor} 
                    borderRadius="full" 
                    h="1.5" 
                    transition="width 0.3s ease"
                  />
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
