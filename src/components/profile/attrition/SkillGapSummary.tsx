'use client';

import React from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';

export interface SkillGapData {
  membersNeedDevelopment: number;
  gapPercentage: number;
  focusAreas: string[];
}

interface SkillGapSummaryProps {
  data: SkillGapData;
}

export const SkillGapSummary: React.FC<SkillGapSummaryProps> = ({ data }) => {
  return (
    <Box p={2} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
      <Text fontSize="xs" color="gray.800" fontWeight="600" mb={1.5}>
        Skill Gap
      </Text>

      <HStack gap={3} mb={1.5} flexWrap="wrap">
        <HStack gap={1}>
          <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
          <Text fontSize="2xs" color="gray.700">
            Members need development: {data.membersNeedDevelopment}
          </Text>
        </HStack>
        <HStack gap={1}>
          <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
          <Text fontSize="2xs" color="gray.700">
            Gap: {data.gapPercentage}%
          </Text>
        </HStack>
      </HStack>

      <Text fontSize="2xs" color="gray.800" fontWeight="600" mb={0.5}>
        Focus Areas
      </Text>
      <VStack align="stretch" gap={0.5}>
        {data.focusAreas.map((area, idx) => (
          <HStack key={idx} gap={1}>
            <Text fontSize="2xs" color="gray.700">•</Text>
            <Text fontSize="2xs" color="gray.700">{area}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
