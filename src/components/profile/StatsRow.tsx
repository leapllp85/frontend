'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, SimpleGrid } from "@chakra-ui/react";
import { File, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { AttritionTrendsPanel } from "./AttritionTrendsPanel";

interface StatsRowProps {
  activeProjects: number;
  teamMembers?: number;
  avgUtilization?: string;
  highRiskProjects?: number;
  attritionRiskMembers?: number;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  activeProjects,
  teamMembers = 2597,
  avgUtilization = "87%",
  highRiskProjects = 3,
  attritionRiskMembers = 259
}) => {
  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} gap={{ base: 1, md: 2 }} w="full" maxW="100%">

  <Card.Root 
        bg="linear-gradient(135deg, #e6fffa 0%, #f0fdfa 100%)" 
        shadow="sm" 
        borderRadius="xl" 
        p={{ base: 1, md: 1.5 }} 
        border="1px solid" 
        borderColor="rgba(255,255,255,0.3)"
        _hover={{ 
          transform: "translateY(-2px)", 
          shadow: "md",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
      >
        <VStack gap={{ base: 1, md: 1.5 }} align="center" w="full" h="full" justify="space-between">
          <VStack gap={1} align="center">
            <HStack gap={{ base: 1, md: 2 }} justify="center" align="center">
              <Box p={2}  borderRadius="lg">
                <Users size={16} color="#10b981" />
              </Box>
              <Text fontSize="md" color="gray.700" fontWeight="semibold" textAlign="center" lineHeight="1.2">
                Team Members
              </Text>
            </HStack>
            <Box 
              w="60%" 
              h="1px" 
              bg="linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)"
            />
          </VStack>
          <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1">{teamMembers}</Text>
          <Text fontSize="xs" color="green.500" fontWeight="medium">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
      <Card.Root 
        bg="linear-gradient(135deg, #e6fffa 0%, #f0fdfa 100%)" 
        shadow="sm" 
        borderRadius="xl" 
        p={{ base: 1, md: 1.5 }} 
        border="1px solid" 
        borderColor="rgba(255,255,255,0.3)"
        _hover={{ 
          transform: "translateY(-2px)", 
          shadow: "md",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
      >
        <VStack gap={{ base: 0.5, md: 1 }} align="center" w="full" h="full" justify="space-between">
          <VStack gap={1} align="center">
            <HStack gap={{ base: 1, md: 2 }} justify="center" align="center">
              <Box p={2}  borderRadius="lg">
                <Users size={16} color="red" />
              </Box>
              <Text fontSize="md" color="gray.700" fontWeight="semibold" textAlign="center" lineHeight="1.2">
                Attrition Risk Members
              </Text>
            </HStack>
            <Box 
              w="60%" 
              h="1px" 
              bg="linear-gradient(90deg, transparent 0%,rgb(185, 81, 16) 50%, transparent 100%)"
            />
          </VStack>
          <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1">{teamMembers}</Text>
          <Text fontSize="xs" color="green.500" fontWeight="medium">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
           <Card.Root 
        bg="linear-gradient(135deg, #e6fffa 0%, #f0fdfa 100%)" 
        shadow="sm" 
        borderRadius="xl" 
        p={{ base: 1, md: 1.5 }} 
        border="1px solid" 
        borderColor="rgba(255,255,255,0.3)"
        _hover={{ 
          transform: "translateY(-2px)", 
          shadow: "md",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
      >
        <VStack gap={{ base: 1, md: 1.5 }} align="center" w="full" h="full" justify="space-between">
          <VStack gap={1} align="center">
            <HStack gap={{ base: 1, md: 2 }} justify="center" align="center">
              <Box p={2}  borderRadius="lg">
                <TrendingUp size={16} color="#f97316" />
              </Box>
              <Text fontSize="md" color="gray.700" fontWeight="semibold" textAlign="center" lineHeight="1.2">
                Avg Utilization
              </Text>
            </HStack>
            <Box 
              w="60%" 
              h="1px" 
              bg="linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)"
            />
          </VStack>
          <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1">{avgUtilization}</Text>
          <Text fontSize="xs" color="green.500" fontWeight="medium">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
      <Card.Root 
        bg="linear-gradient(135deg, #e6fffa 0%, #f0fdfa 100%)" 
        shadow="sm" 
        borderRadius="xl" 
        p={{ base: 1, md: 1.5 }} 
        border="1px solid" 
        borderColor="rgba(255,255,255,0.3)"
        _hover={{ 
          transform: "translateY(-2px)", 
          shadow: "md",
          transition: "all 0.1s ease"
        }}
        transition="all 0.2s ease"
      >
        <VStack gap={{ base: 1, md: 1.5 }} align="center" w="full" h="full" justify="space-between">
          <VStack gap={1} align="center">
            <HStack gap={{ base: 1, md: 2 }} justify="center" align="center">
              <Box p={2}  borderRadius="lg">
                <File size={16} color="#3b82f6" />
              </Box>
              <Text fontSize="md" color="gray.700" fontWeight="semibold" textAlign="center" lineHeight="1.2">
                Active Projects
              </Text>
            </HStack>
            <Box 
              w="60%" 
              h="1px" 
              bg="linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)"
            />
          </VStack>
          <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1">
            {activeProjects}
          </Text>
          <Text fontSize="xs" color="red.500" fontWeight="medium">+0.45% ↑</Text>
        </VStack>
      </Card.Root>
      
      <Card.Root 
        bg="linear-gradient(135deg, #e6fffa 0%, #f0fdfa 100%)" 
        shadow="sm" 
        borderRadius="xl" 
        p={{ base: 1, md: 1.5 }} 
        border="1px solid" 
        borderColor="rgba(255,255,255,0.3)"
        _hover={{ 
          transform: "translateY(-2px)", 
          shadow: "md",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
      >
        <VStack gap={{ base: 1, md: 1.5 }} align="center" w="full" h="full" justify="space-between">
          <VStack gap={1} align="center">
            <HStack gap={{ base: 1, md: 2 }} justify="center" align="center">
              <Box p={2}  borderRadius="lg">
                <AlertTriangle size={16} color="#ef4444" />
              </Box>
              <Text fontSize="md" color="gray.700" fontWeight="semibold" textAlign="center" lineHeight="1.2">
                High Risk Projects
              </Text>
            </HStack>
            <Box 
              w="60%" 
              h="1px" 
              bg="linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)"
            />
          </VStack>
          <Text fontSize="xl" fontWeight="bold" color="gray.900" lineHeight="1">{highRiskProjects.toString().padStart(2, '0')}</Text>
          <Text fontSize="xs" color="red.500" fontWeight="medium">-0.45% ↓</Text>
        </VStack>
      </Card.Root>

      
    </SimpleGrid>
  );
};
