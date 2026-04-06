'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { ProgressBar } from '../../ui/progress';

interface RiskItem {
  label: string;
  value: number;
}

interface RiskDistributionCardProps {
  category: string;
  items: RiskItem[];
  categoryColor?: string;
}

export const RiskDistributionCard: React.FC<RiskDistributionCardProps> = ({
  category,
  items,
  categoryColor = 'blue.600'
}) => {
  return (
    <Box
      p={3}
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: 'md', borderColor: 'gray.300' }}
    >
      <Heading size="xs" color={categoryColor} mb={3} fontWeight="600">
        {category}
      </Heading>
      <VStack align="stretch" gap={2.5}>
        {items.map((item, idx) => (
          <Box key={idx}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.700" fontWeight="500">
                {item.label}
              </Text>
              <Text fontSize="xs" fontWeight="600" color="gray.900">
                {item.value}%
              </Text>
            </HStack>
            <ProgressBar
              value={item.value}
              colorPalette={item.value >= 65 ? 'red' : item.value >= 50 ? 'orange' : 'green'}
              borderRadius="md"
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
