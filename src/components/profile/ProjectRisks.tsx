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
      .slice(0, 3);
  };

  const topProjects = getTopPriorityProjects(projects);

  return (
    <Card.Root 
      bg="#ffffff"
      shadow="xs" 
      borderRadius="2xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
      maxH="320px"
      minH="280px"
     
      transition="all 0.2s ease"
    >
      <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.200">
        <VStack justify="space-between" align="center">
          <Heading
            size="md"
            color="gray.900"
            textAlign="center"
            fontWeight="normal"
          >
             Projects At Risk
             
            </Heading>
            {/* <Box 
                        w="100%" 
                        h="1.1px" 
                        bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
                      /> */}
          
        </VStack>
    

      </Card.Header>
      <Card.Body p={6} flex="1">
  <VStack gap={1} align="start" w="full">
    {topProjects.map((project) => {
      const riskColors = getRiskColor(project.riskLevel);
      return (
        <Box key={project.id} w="full">
          <HStack justify="space-between" align="center" w="full" mb={1} spacing={1}>
            {/* Left side: Title, Team Members, Due Date */}
            <HStack gap={1} flex={1} minW={0} overflow="hidden">
              <Text fontSize="xs" fontWeight="medium" color="gray.900" truncate>
                {project.title}
              </Text>
              <Box height="2px" width="35px" />

              <Text fontSize="xs" color="gray.900">
                {project.team_members_count}Members
              </Text>
              <Box height="1px" width="5px" />
              <Text fontSize="xs" color="gray.900" whiteSpace="nowrap">
                Due: {project.go_live_date}
              </Text>
            </HStack>

            {/* Right side: Criticality & Progress */}
            <HStack spacing={1} flexShrink={0}>
              <Badge colorPalette={riskColors.colorPalette} size="sm">
                {project.criticality}
              </Badge>
              <Text fontSize="sm" color="gray.900">
                {project.progress}%
              </Text>
            </HStack>
          </HStack>

          {/* Progress Bar */}
          <Box w="full" bg="gray.200" borderRadius="full" h="1">
            <Box 
              w={`${project.progress}%`} 
              bg={riskColors.bgColor} 
              borderRadius="full" 
              h="1" 
              transition="all 0.2s ease"
              _hover={{ 
                transform: "translateY(-1px)", 
                shadow: "sm"
              }}
            />
          </Box>
        </Box>
      );
    })}
    <Text fontSize="xs" color="teal.500" cursor="pointer" textAlign="center">
      view more →
    </Text>
  </VStack>
</Card.Body>

    </Card.Root>
  );
};
