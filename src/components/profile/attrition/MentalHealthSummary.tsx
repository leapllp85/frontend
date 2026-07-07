'use client';

import React from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';

export interface MentalHealthData {
  highRiskMembers: number;
  concernsReported: number;
  actionItems: string[];
}

interface MentalHealthSummaryProps {
  data: MentalHealthData;
}

export const MentalHealthSummary: React.FC<MentalHealthSummaryProps> = ({ data }) => {
  return (
    <Box p={2} bg="pink.50" borderRadius="md" border="1px solid" borderColor="pink.200">
      <Text fontSize="xs" color="gray.800" fontWeight="600" mb={1.5}>
        Mental Health — Action Required
      </Text>

      <HStack gap={3} mb={1.5} flexWrap="wrap">
        <HStack gap={1}>
          <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
          <Text fontSize="2xs" color="gray.700">
            High-risk members: {data.highRiskMembers}
          </Text>
        </HStack>
        <HStack gap={1}>
          <Box w="6px" h="6px" borderRadius="full" bg="#f97316" />
          <Text fontSize="2xs" color="gray.700">
            Concerns reported: {data.concernsReported}
          </Text>
        </HStack>
      </HStack>

      <Text fontSize="2xs" color="gray.800" fontWeight="600" mb={0.5}>
        Immediate Actions
      </Text>
      <VStack align="stretch" gap={0.5}>
        {data.actionItems.map((item, idx) => (
          <HStack key={idx} gap={1}>
            <Text fontSize="2xs" color="gray.700">•</Text>
            <Text fontSize="2xs" color="gray.700">{item}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
