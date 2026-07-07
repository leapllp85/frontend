'use client';

import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface ActionItemCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  borderColor: string;
  items: string[];
}

export const ActionItemCard: React.FC<ActionItemCardProps> = ({
  title,
  icon: Icon,
  color,
  bg,
  borderColor,
  items,
}) => {
  return (
    <Box
      px={3.5}
      py={2.5}
      bg={bg}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{ shadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <HStack gap={2} mb={1.5}>
        <Icon size={14} color={color} />
        <Text fontSize="0.75rem" fontWeight="600" color="gray.800">
          {title}
        </Text>
      </HStack>
      <VStack align="stretch" gap={0.5}>
        {items.map((item, i) => (
          <HStack key={i} gap={2} align="start">
            <Box mt="5px">
              <ChevronRight size={11} color="#9CA3AF" />
            </Box>
            <Text fontSize="0.70rem" color="gray.600" lineHeight="1.5">
              {item}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
