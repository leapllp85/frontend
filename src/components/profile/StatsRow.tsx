'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, SimpleGrid , Icon, IconProps } from "@chakra-ui/react";
import { File, Users, TrendingUp, AlertTriangle, FileText, BarChart3 } from "lucide-react";
import { AttritionTrendsPanel } from "./AttritionTrendsPanel";


interface StatsRowProps {
  activeProjects: number;
  teamMembers?: number;
  avgUtilization?: string;
  highRiskProjects?: number;
  attritionRisk?: number;
   averageAge?: number;
  genderRatio?: string;
}

const statData = ({activeProjects, teamMembers, avgUtilization, highRiskProjects, attritionRisk, averageAge, genderRatio}: StatsRowProps) => [
  {
    label: "Team Members",
    value: teamMembers,
    color: "#10b981",
    icon: Users
  },
  {
    label: "Attrition Risk",
    value: attritionRisk,
    color: "#ef4444",
    icon: AlertTriangle
  },
  {
    label: "Active Projects",
    value: activeProjects,
    color: "#3b82f6",
    icon: FileText
  },
  {
    label: "High Risk Projects",
    value: highRiskProjects,
    color: "#ef4444",
    icon: AlertTriangle
  },
  {
    label: "Avg Utilization",
    value: avgUtilization,
    color: "#f59e0b",
    icon: BarChart3
  },
  {
    label: "Average Age",
    value: averageAge,
    color: "#ef4444",
    icon: AlertTriangle
  },
  {
    label: "Gender Ratio",
    value: genderRatio,
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
      <VStack gap={0} align="center" w="full" px={1} py={1}>
        <HStack gap={5} justify="center" align="center" w="full">
          <Box p={1} borderRadius="lg">
            <Icon as={icon} size="md" color={color} />
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
  attritionRisk = 259,
  averageAge = 30,
  genderRatio = "50:50"
}) => {
  return (
    <HStack w="full" align="stretch">

      
      {/* Stats Cards Container - positioned towards right */}
      <Card.Root 
        // flex="15"
        // maxW="200px"
        bg="#ffffff"
      shadow="xs" 
      borderRadius="3xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
        // borderColor="gray.200"
        p={1}
        // h="80px"
      >
        <SimpleGrid 
          columns={{ base: 2, sm: 2, md: 7 }} 
          gap={1} 
          w="99%" 
          h="99%"
          alignItems="center"
        >
          {statData({ teamMembers,attritionRisk,activeProjects, avgUtilization, highRiskProjects, averageAge, genderRatio }).map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </SimpleGrid>
      </Card.Root>
    </HStack>
  );
};
