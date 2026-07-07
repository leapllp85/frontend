'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Grid } from '@chakra-ui/react';

export interface EngagementMetric {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

interface EngagementMetricsProps {
  metrics: EngagementMetric[];
  title?: string;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  metrics,
  title = 'Engagement'
}) => {
  return (
    <Box
      p={3}
      bg="purple.50"
      borderRadius="md"
      border="1px solid"
      borderColor="purple.200"
      display="flex"
      flexDirection="column"
      h="full"
    >
      <HStack gap={1.5} mb={2}>
        <Box w="2px" h="2px" borderRadius="full" bg="purple.600" />
        <Heading size="xs" color="gray.800" fontWeight="600">
          {title}
        </Heading>
      </HStack>

      <Grid templateColumns="repeat(2, 1fr)" gap={2} flex="1">
        {metrics.map((metric, idx) => (
          <VStack key={idx} align="center" gap={1}>
            <Box
              w="40px"
              h="40px"
              borderRadius="full"
              bg={metric.color}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="lg" lineHeight="1">
                {metric.icon || '📊'}
              </Text>
            </Box>
            <Text fontSize="xl" fontWeight="700" color="gray.900" lineHeight="1">
              {metric.value}%
            </Text>
            <Text fontSize="2xs" color="gray.600" textAlign="center" lineHeight="1.2">
              {metric.label}
            </Text>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
};
