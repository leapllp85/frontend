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
}) => {
  return (
    <VStack gap={1} align="center" w="full" h="full" py={2}>
      <VStack gap={0} align="center" w="full" px={1}>
        <HStack gap={1} justify="center" align="center" w="full">
          <Box p={1} borderRadius="lg">
            <Icon as={icon} size="sm" color={color} />
          </Box>
          <Text fontSize="md" color="gray.700" fontWeight="normal" textAlign="center" lineHeight="1.1">
            {label}
          </Text>
        </HStack>
        <Box 
          w="100%" 
          h="1px" 
          bg={`linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`}
        />
      </VStack>
      <Text fontSize="lg" fontWeight="bold" color="gray.900" letterSpacing={0.5}>{value}</Text>
    </VStack>
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
    <HStack w="full" align="stretch">
      {/* Left space for additional data */}
      <Box flex="0" minW="100px">
        {/* This space is reserved for additional data */}
      </Box>
      
      {/* Stats Cards Container - positioned towards right */}
      <Card.Root 
        flex="15"
        maxW="1600px"
        bg="linear-gradient(135deg, #ffffff 0%, #ffffff 100%)" 
        shadow="xs" 
        borderRadius="2xl"
        border="1px solid"
        // borderColor="gray.200"
        p={0}
        h="80px"
      >
        <SimpleGrid 
          columns={{ base: 2, sm: 3, md: 5 }} 
          gap={1} 
          w="full" 
          h="full"
          alignItems="center"
        >
          {statData({ activeProjects, teamMembers, avgUtilization, highRiskProjects, attritionRiskMembers }).map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </SimpleGrid>
      </Card.Root>
    </HStack>
  );
};
