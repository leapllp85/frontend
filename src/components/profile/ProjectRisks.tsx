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
    case 'High Risk': return { colorPalette: 'red', bgColor: 'red.500', progressColor: 'red.400' };
    case 'Medium Risk': return { colorPalette: 'yellow', bgColor: 'yellow.500', progressColor: 'green.400' };
    case 'Low Risk': return { colorPalette: 'green', bgColor: 'green.500', progressColor: 'green.500' };
    default: return { colorPalette: 'gray', bgColor: 'gray.500', progressColor: 'gray.400' };
  }
};

const getRiskStatus = (level: 'High Risk' | 'Medium Risk' | 'Low Risk') => {
  switch (level) {
    case 'High Risk': return 'Needs Attention';
    case 'Medium Risk': return 'At Risk';
    case 'Low Risk': return 'At Risk';
    default: return 'At Risk';
  }
};

export const ProjectRisks: React.FC<ProjectRisksProps> = ({
  projects = defaultProjects
}) => {
  // Show all projects as in dashboard
  const displayProjects = projects;

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
      maxH="320px"
      minH="280px"
     
      transition="all 0.2s ease"
    >
      <Card.Header p={3} pb={2}  borderColor="gray.200">
        <VStack justify="space-between" align="center">
          <Heading
            size="md"
            color="gray.900"
            textAlign="center"
            fontWeight="normal"
          >
             Projects At Risk
             
            </Heading>
            <Box 
                w="80%" 
                h="0.9px" 
                bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
            />
          
        </VStack>
    

      </Card.Header>
      <Card.Body p={2} flex="1">
        {/* Table Header */}
        <HStack justify="space-between" align="center" w="full" mb={3} px={1}>
          <Text fontSize="xs" fontWeight="600" color="gray.500" flex="2">
            Project
          </Text>
          {/* <Text fontSize="xs" fontWeight="600" color="gray.500" textAlign="center" w="60px">
            Budget
          </Text> */}
          <Text fontSize="xs" fontWeight="600" color="gray.500" textAlign="center" w="60px">
            Progress
          </Text>
          <Text fontSize="xs" fontWeight="600" color="gray.500" textAlign="right" w="100px">
            Status
          </Text>
        </HStack>

        {/* Project Rows */}
        <VStack gap={0} align="start" w="full">
          {displayProjects.map((project) => {
            const riskColors = getRiskColor(project.riskLevel);
            const riskStatus = getRiskStatus(project.riskLevel);
            
            return (
              <Box key={project.id} w="full">
                <HStack justify="space-between" align="center" w="full" mb={2}>
                  {/* Project Name */}
                  <Box flex="2">
                    <Text fontSize="sm" fontWeight="300" color="gray.900" truncate>
                      {project.title}
                    </Text>
                  </Box>

                  {/* Budget Progress Bar */}
                  <Box w="60px" textAlign="center">
                    <Box w="full" bg="gray.200" borderRadius="full" h="6px" mb={1}>
                      <Box 
                        w={`${project.progress}%`} 
                        bg={riskColors.progressColor} 
                        borderRadius="full" 
                        h="full" 
                        transition="all 0.2s ease"
                      />
                    </Box>
                    {/* <Text fontSize="xs" color="gray.600">
                      {project.progress}%
                    </Text> */}
                  </Box>

                  {/* Tasks Count */}
                  {/* <Box w="50px" textAlign="center">
                    <Box 
                      bg="gray.100" 
                      borderRadius="md" 
                      px={2} 
                      py={1}
                      display="inline-block"
                    >
                      <Text fontSize="xs" fontWeight="500" color="gray.700">
                        {project.tasks}
                      </Text>
                    </Box>
                  </Box> */}

                  {/* Risk Status */}
                  <Box w="100px" textAlign="right">
                    <HStack justify="end" align="center" gap={2}>
                      <Box 
                        w={2} 
                        h={2} 
                        bg="red.700" 
                        borderRadius="full"
                      />
                      <Text fontSize="xs" fontWeight="500" color="red.700">
                        {riskStatus}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Card.Body>

    </Card.Root>
  );
};
