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
    title: 'Project Alpha',
    team_members_count: 8,
    go_live_date: '15 Dec 2023',
    criticality: 'High',
    progress: 35,
    riskLevel: 'High Risk',
    tasks: 12345,
    members: 8,
    dueDate: '15 Dec 2023'
  },
  {
    id: '2',
    title: 'Project Beta',
    team_members_count: 5,
    go_live_date: '20 Jan 2024',
    criticality: 'Medium',
    progress: 65,
    riskLevel: 'Medium Risk',
    tasks: 28340,
    members: 5,
    dueDate: '20 Jan 2024'
  },
  {
    id: '3',
    title: 'Project Gamma',
    team_members_count: 6,
    go_live_date: '10 Feb 2024',
    criticality: 'Low',
    progress: 85,
    riskLevel: 'Low Risk',
    tasks: 34340,
    members: 6,
    dueDate: '10 Feb 2024'
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
                        {project.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {project.team_members_count} members
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Due: {project.go_live_date}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      Progress: 80%
                    </Text>
                  </VStack>
                  <VStack align="end" gap={0}>
                    <Badge colorPalette={riskColors.colorPalette} size="sm">
                      {project.criticality}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      51 tasks
                    </Text>
                  </VStack>
                </HStack>
                <Box w="full" bg="gray.200" borderRadius="full" h="2">
                  <Box 
                    w="80%" 
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
