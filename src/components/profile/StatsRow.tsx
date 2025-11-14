'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, SimpleGrid , Icon, IconProps } from "@chakra-ui/react";
import { File, Users, TrendingUp, AlertTriangle, FileText, BarChart3 } from "lucide-react";
import { AttritionTrendsPanel } from "./AttritionTrendsPanel";


interface StatsRowProps {
  mentalhealthRisk: number;
  teamMembers?: number;
  attritionRisk?: number;
}

const statData = ({mentalhealthRisk, teamMembers, attritionRisk}: StatsRowProps) => [
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
    label: "Mental Health Risk",
    value: mentalhealthRisk,
    color: "#3b82f6",
    icon: FileText
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
    <VStack gap={2} align="center" w="full" h="full" py={2}>
      <VStack gap={0} align="center" w="full" px={5} py={1}>
        <HStack gap={5} justify="center" align="center" w="full">
          <Box p={2} borderRadius="lg">
            <Icon as={icon} size="md" color={color} />
          </Box>
          <Text fontSize="md" color="gray.700" fontWeight="normal" textAlign="left" lineHeight="1.2">
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
  mentalhealthRisk=55,
  teamMembers = 2597,
  attritionRisk = 259,
}) => {
  return (
    <HStack w="full" align="stretch">

      
      {/* Stats Cards Container - positioned towards right */}
      <Card.Root 
      maxW="900px"
      bg="#ffffff"
      shadow="xs" 
      borderRadius="3xl" 
      h="full" 
      display="flex" 
      flexDirection="column"  
      borderColor="gray.100"
      // boxShadow="sm"
      p={2}
      >
        <SimpleGrid 
          columns={{ base: 0, sm: 0, md:3 }} 
          gap={25} 
          w="100%" 
          h="100%"
          alignItems="center"
        >
          {statData({ teamMembers,attritionRisk,mentalhealthRisk}).map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </SimpleGrid>
      </Card.Root>
    </HStack>
  );
};
