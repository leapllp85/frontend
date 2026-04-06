'use client';

import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';

export interface QuickStat {
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

interface QuickStatCardProps {
  stats: QuickStat[];
}

export const QuickStatCard: React.FC<QuickStatCardProps> = ({ stats }) => {
  return (
    <Box p={2} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
      <Text fontSize="xs" color="gray.800" fontWeight="600" mb={2}>
        Quick Stats
      </Text>

      <VStack align="stretch" gap={2}>
        {stats.map((stat, idx) => (
          <Box
            key={idx}
            p={2}
            bg={stat.bgColor}
            borderRadius="md"
            border="1px solid"
            borderColor={`${stat.color}.200`}
          >
            <Text fontSize="xl" fontWeight="700" color={stat.color} lineHeight="1">
              {stat.value}
            </Text>
            <Text fontSize="2xs" color="gray.700" mt={0.5}>
              {stat.label}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
