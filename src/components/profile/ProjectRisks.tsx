import React from "react";
import { Box, Text, HStack, VStack, Card, Heading, Badge } from "@chakra-ui/react";

interface ProjectRisk {
  id: string;
  name: string;
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
    name: 'Project Alpha',
    progress: 35,
    riskLevel: 'High Risk',
    tasks: 12345,
    members: 8,
    dueDate: '15 Dec 2023'
  },
  {
    id: '2',
    name: 'Project Beta',
    progress: 65,
    riskLevel: 'Medium Risk',
    tasks: 28340,
    members: 5,
    dueDate: '20 Jan 2024'
  },
  {
    id: '3',
    name: 'Project Gamma',
    progress: 85,
    riskLevel: 'Low Risk',
    tasks: 34340,
    members: 6,
    dueDate: '10 Feb 2024'
  }
];

const getRiskColor = (riskLevel: ProjectRisk['riskLevel']) => {
  switch (riskLevel) {
    case 'High Risk': return { colorPalette: 'red', bgColor: 'red.500' };
    case 'Medium Risk': return { colorPalette: 'orange', bgColor: 'orange.500' };
    case 'Low Risk': return { colorPalette: 'green', bgColor: 'green.500' };
    default: return { colorPalette: 'gray', bgColor: 'gray.500' };
  }
};

export const ProjectRisks: React.FC<ProjectRisksProps> = ({
  projects = defaultProjects
}) => {
  // Sort projects by risk priority (High > Medium > Low) and show only top 3
  const getTopPriorityProjects = (projects: ProjectRisk[]) => {
    const riskPriority = { 'High Risk': 3, 'Medium Risk': 2, 'Low Risk': 1 };
    return projects
      .sort((a, b) => riskPriority[b.riskLevel] - riskPriority[a.riskLevel])
      .slice(0, 3);
  };

  const topProjects = getTopPriorityProjects(projects);

  return (
    <Card.Root bg="white" shadow="sm" borderRadius="xl" h="full" display="flex" flexDirection="column">
      <Card.Header p={3} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between">
          <Heading size="md" color="gray.800">Project Risks</Heading>
        </HStack>
      </Card.Header>
      <Card.Body p={3} flex="1" overflow="auto">
        <VStack gap={{base:3, "2xl":4}} align="stretch">
          {topProjects.map((project) => {
            const riskColors = getRiskColor(project.riskLevel);
            return (
              <Box key={project.id}>
                <HStack justify="space-between" mb={2}>
                  <VStack align="start" gap={0}>
                    <HStack gap={1} mt={2}>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                        {project.name}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {project.members} members
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Due: {project.dueDate}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      Progress: {project.progress}%
                    </Text>
                  </VStack>
                  <VStack align="end" gap={0}>
                    <Badge colorPalette={riskColors.colorPalette} size="sm">
                      {project.riskLevel}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {project.tasks} tasks
                    </Text>
                  </VStack>
                </HStack>
                <Box w="full" bg="gray.200" borderRadius="full" h="2">
                  <Box 
                    w={`${project.progress}%`} 
                    bg={riskColors.bgColor} 
                    borderRadius="full" 
                    h="2" 
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
