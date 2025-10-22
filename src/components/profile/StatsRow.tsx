'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, SimpleGrid , Icon, IconProps } from "@chakra-ui/react";
import { File, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { AttritionTrendsPanel } from "./AttritionTrendsPanel";


interface StatsRowProps {
  activeProjects: number;
  teamMembers?: number;
  avgUtilization?: string;
  highRiskProjects?: number;
  attritionRiskMembers?: number;
}

const statData = ({activeProjects, teamMembers, avgUtilization, highRiskProjects, attritionRiskMembers}: StatsRowProps) => [
  {
    label: "Active Projects",
    value: activeProjects,
    color: "#10b981",
    icon: Users
  },
  {
    label: "Team Members",
    value: teamMembers,
    color: "red",
    icon: Users
  },
  {
    label: "Avg Utilization",
    value: avgUtilization,
    color: "#f97316",
    icon: TrendingUp
  },
  {
    label: "High Risk Projects",
    value: highRiskProjects,
    color: "#3b82f6",
    icon: File
  },
  {
    label: "Attrition Risk Members",
    value: attritionRiskMembers,
    color: "#ef4444",
    icon: AlertTriangle
  }
]

const StatsCard = ({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string | number | undefined;
  color: string;
  icon: IconProps['as'];
  // "linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)"
}) => {
  return (
    <Card.Root 
        bg="linear-gradient(135deg, #e6fffa 0%, #f0fdfa 100%)" 
        shadow="xs" 
        borderRadius="xl"
        border="1px solid"
        borderColor="rgba(0,0,0,0.25)" 
        p={{ base: 1, md: 1.5 }} 
        transition="all 0.2s ease"
      >
        <VStack gap={{ base: 1, md: 1.5 }} align="center" w="full" h="full" py={1}>
          <VStack gap={0} align="center" w="full" px={1}>
            <HStack gap={{ base: 0.4, md: 0.8 }}  justify="center" align="center" w="full" alignItems="center" justifyContent="center">
              <Box p={2}  borderRadius="lg">
                <Icon as={icon} size="md" color={color} />
              </Box>
              <Text fontSize="md" color="gray.700" fontWeight="semibold" textAlign="center" lineHeight="1.2">
                {label}
              </Text>
            </HStack>
            <Box 
              w="100%" 
              h="1.2px" 
              bg={`linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`}
            />
          </VStack>
          <Text fontSize="md" fontWeight="bold" color="gray.900" letterSpacing={0.7}>{value}</Text>
          {/* <Box width="full" display="flex" justifyContent="flex-end" mt={-4} px={4}> */}
            {/* <Text fontSize="xs" color="green.500" fontWeight="medium" >+0.45% ↑</Text> */}
          {/* </Box> */}
         
        </VStack>
      </Card.Root>
  )
}
export const StatsRow: React.FC<StatsRowProps> = ({
  activeProjects,
  teamMembers = 2597,
  avgUtilization = "87%",
  highRiskProjects = 3,
  attritionRiskMembers = 259
}) => {
  return (
    <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} gap={{ base: 2, md: 4 }} w="full" maxW="100%">
      {statData({ activeProjects, teamMembers, avgUtilization, highRiskProjects, attritionRiskMembers }).map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </SimpleGrid>
  );
};
