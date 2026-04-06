'use client';

import React from 'react';
import { HStack, Box, Text } from '@chakra-ui/react';

interface MetricBarProps {
  label: string;
  value: number;
  color: string;
  labelWidth?: string;
  showIcon?: boolean;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  label,
  value,
  color,
  labelWidth = '20%',
  showIcon = true,
}) => {
  return (
    <HStack justify="space-between" align="center">
      <HStack gap={2} flex={`0 0 ${labelWidth}`}>
        {showIcon && (
          <Box w="8px" h="8px" borderRadius="full" bg={color} flexShrink={0} />
        )}
        <Text fontSize="0.75rem" color="gray.600" fontWeight="500">
          {label}
        </Text>
      </HStack>
      <Box flex="1" h="6px" bg="gray.100" borderRadius="full" mx={2}>
        <Box 
          w={`${value}%`} 
          h="full" 
          bg={color} 
          borderRadius="full" 
          transition="width 0.6s ease" 
        />
      </Box>
      <Text fontSize="0.75rem" fontWeight="700" color="gray.800" w="35px" textAlign="right">
        {value}%
      </Text>
    </HStack>
  );
};
