import React from "react";
import { Box, Text, HStack, VStack, Card, SimpleGrid } from "@chakra-ui/react";
import { FileText, Users, BarChart3, AlertTriangle } from "lucide-react";

interface StatsRowProps {
  activeProjects: number;
  teamMembers?: number;
  avgUtilization?: string;
  highRiskProjects?: number;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  activeProjects,
  teamMembers = 42,
  avgUtilization = "82%",
  highRiskProjects = 3
}) => {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
      <Card.Root bg="white" shadow="md" borderRadius="xl" p={3}>
        <VStack gap={2}>
          <HStack gap={2}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FileText size={16} color="#3b82f6" />
            </Box>
            <Text fontSize="sm" color="gray.600">Active Projects</Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {activeProjects}
          </Text>
        </VStack>
      </Card.Root>
      
      <Card.Root bg="white" shadow="md" borderRadius="xl" p={3}>
        <VStack gap={2}>
          <HStack gap={2}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <Users size={16} color="#16a34a" />
            </Box>
            <Text fontSize="sm" color="gray.600">Team Members</Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">{teamMembers}</Text>
        </VStack>
      </Card.Root>
      
      <Card.Root bg="white" shadow="md" borderRadius="xl" p={3}>
        <VStack gap={2}>
          <HStack gap={2}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <BarChart3 size={16} color="#ea580c" />
            </Box>
            <Text fontSize="sm" color="gray.600">Avg. Utilization</Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">{avgUtilization}</Text>
        </VStack>
      </Card.Root>
      
      <Card.Root bg="white" shadow="md" borderRadius="xl" p={3}>
        <VStack gap={2}>
          <HStack gap={2}>
            <Box p={2} bg="red.100" borderRadius="lg">
              <AlertTriangle size={16} color="#dc2626" />
            </Box>
            <Text fontSize="sm" color="gray.600">High Risk Projects</Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">{highRiskProjects}</Text>
        </VStack>
      </Card.Root>
    </SimpleGrid>
  );
};
