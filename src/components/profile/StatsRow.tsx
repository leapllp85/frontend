'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, SimpleGrid } from "@chakra-ui/react";
import { File, Users, TrendingUp, AlertTriangle } from "lucide-react";

interface StatsRowProps {
  activeProjects: number;
  teamMembers?: number;
  avgUtilization?: string;
  highRiskProjects?: number;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  activeProjects,
  teamMembers = 2597,
  avgUtilization = "87%",
  highRiskProjects = 3
}) => {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" p={4} border="1px solid" borderColor="gray.100">
        <VStack gap={2} align="center" w="full">
          <VStack gap={1} align="center" w="full">
            <HStack gap={2} justify="center">
              <Box p={1.5} bg="#dbeafe" borderRadius="md">
                <File size={18} color="#3b82f6" />
              </Box>
              <Text fontSize="lg" color="gray.800" fontWeight="large">Active Projects</Text>
            </HStack>
            <Box w="80%" h="0.3px" bg="gray.200" mt={1} />
          </VStack>
          <Text fontSize="3xl" fontWeight="semi-bold" color="gray.900" lineHeight="1">
            {activeProjects}
          </Text>
          <Text fontSize="md" color="red.500" fontWeight="small">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
      
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" p={4} border="1px solid" borderColor="gray.100">
        <VStack gap={2} align="center" w="full">
          <VStack gap={1} align="center" w="full">
            <HStack gap={2} justify="center">
              <Box p={1.5} bg="#d1fae5" borderRadius="md">
                <Users size={18} color="#10b981" />
              </Box>
              <Text fontSize="lg" color="gray.800" fontWeight="large">Team Members</Text>
            </HStack>
            <Box w="80%" h="0.3px" bg="gray.200" mt={1} />
          </VStack>
          <Text fontSize="3xl" fontWeight="semi-bold" color="gray.900" lineHeight="1">{teamMembers}</Text>
          <Text fontSize="xs" color="green.500" fontWeight="small">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
      
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" p={4} border="1px solid" borderColor="gray.100">
        <VStack gap={2} align="center" w="full">
          <VStack gap={1} align="center" w="full">
            <HStack gap={2} justify="center">
              <Box p={1.5} bg="#fed7aa" borderRadius="md">
                <TrendingUp size={18} color="#f97316" />
              </Box>
              <Text fontSize="lg" color="gray.800" fontWeight="large">Average Utilization</Text>
            </HStack>
            <Box w="80%" h="0.3px" bg="gray.200" mt={1} />
          </VStack>
          <Text fontSize="3xl" fontWeight="semi-bold" color="gray.900" lineHeight="1">{avgUtilization}</Text>
          <Text fontSize="xs" color="green.500" fontWeight="small">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
      
      <Card.Root bg="#e6fffa" shadow="sm" borderRadius="2xl" p={4} border="1px solid" borderColor="gray.100">
        <VStack gap={2} align="center" w="full">
          <VStack gap={1} align="center" w="full">
            <HStack gap={2} justify="center">
              <Box p={1.5} bg="#fee2e2" borderRadius="md">
                <AlertTriangle size={18} color="#ef4444" />
              </Box>
              <Text fontSize="lg" color="gray.800" fontWeight="large">High Risk Projects</Text>
            </HStack>
            <Box w="80%" h="0.3px" bg="gray.200" mt={1} />
          </VStack>
          <Text fontSize="3xl" fontWeight="semi-bold" color="gray.900" lineHeight="1">{highRiskProjects.toString().padStart(2, '0')}</Text>
          <Text fontSize="xs" color="red.500" fontWeight="small">-0.45% ↓</Text>
        </VStack>
      </Card.Root>
    </SimpleGrid>
  );
};
