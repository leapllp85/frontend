'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading } from '@chakra-ui/react';

export interface SentimentItem {
  label: string;
  value: number;
  color: string;
}

interface SurveySentimentBarProps {
  items: SentimentItem[];
  title?: string;
}

export const SurveySentimentBar: React.FC<SurveySentimentBarProps> = ({
  items,
  title = 'Survey Sentiment'
}) => {
  return (
    <Box
      p={3}
      bg="blue.50"
      borderRadius="md"
      border="1px solid"
      borderColor="blue.200"
      display="flex"
      flexDirection="column"
      h="full"
    >
      <HStack gap={1.5} mb={2}>
        <Box w="2px" h="2px" borderRadius="full" bg="blue.600" />
        <Heading size="xs" color="gray.800" fontWeight="600">
          {title}
        </Heading>
      </HStack>

      <VStack align="stretch" gap={2} flex="1" justify="center">
        {items.map((item, idx) => (
          <HStack key={idx} justify="space-between" align="center">
            <HStack gap={2} flex="0 0 100px">
              <Box w="8px" h="8px" borderRadius="full" bg={item.color} />
              <Text fontSize="2xs" color="gray.700" fontWeight="500">
                {item.label}
              </Text>
            </HStack>
            <Box flex="1" h="6px" bg="gray.200" borderRadius="full" mx={2}>
              <Box w={`${item.value}%`} h="full" bg={item.color} borderRadius="full" />
            </Box>
            <Text fontSize="2xs" fontWeight="600" color="gray.900" w="30px" textAlign="right">
              {item.value}%
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
