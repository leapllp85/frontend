'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Grid, Card } from '@chakra-ui/react';

export interface InsightCategory {
  title: string;
  icon: string;
  items: string[];
}

interface ActionableInsightsProps {
  categories: InsightCategory[];
  title?: string;
  emoji?: string;
}

export const ActionableInsights: React.FC<ActionableInsightsProps> = ({
  categories,
  title = 'Actionable Insights',
  emoji = '🎯'
}) => {
  return (
    <Card.Root
      flex="1"
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      shadow="sm"
    >
      <Card.Body py={2} px={4}>
        <VStack align="stretch" gap={2}>
          <HStack gap={3} align="center" justify="center">
            <Box
              w="28px"
              h="28px"
              borderRadius="full"
              bg="cyan.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" lineHeight="1">
                {emoji}
              </Text>
            </Box>
            <Heading size="sm" color="gray.800" fontWeight="600">
              {title}
            </Heading>
          </HStack>

          <Grid templateRows={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            {categories.map((category, idx) => (
              <Box key={idx}>
                <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>
                  {category.icon} {category.title}
                </Text>
                <VStack align="stretch" gap={1}>
                  {category.items.map((item, itemIdx) => (
                    <Text key={itemIdx} fontSize="xs" color="gray.700">
                      • {item}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </Grid>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
