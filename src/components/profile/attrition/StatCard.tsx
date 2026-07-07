'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface StatCardProps {
  value: string;
  label: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color }) => {
  return (
    <Box
      flex={1}
      p={3}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      shadow="0 1px 4px rgba(0,0,0,0.04)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Text 
        fontSize="1.375rem" 
        fontWeight="800" 
        color={color} 
        lineHeight="1.2" 
        letterSpacing="-0.02em"
      >
        {value}
      </Text>
      <Text fontSize="0.6875rem" fontWeight="500" color="gray.500" mt={0.5}>
        {label}
      </Text>
    </Box>
  );
};
