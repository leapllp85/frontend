'use client';

import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  gradientFrom: string;
  gradientTo: string;
  valueColor: string;
  shadowColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  gradientFrom,
  gradientTo,
  valueColor,
  shadowColor,
}) => {
  return (
    <Box
      bg={`linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`}
      borderRadius="1.125rem"
      p={{ base: '1rem', md: '1.25rem' }}
      boxShadow={`0 4px 16px ${shadowColor}, 0 2px 6px rgba(0, 0, 0, 0.06)`}
      transition="all 0.25s ease"
      border="1px solid"
      borderColor="rgba(255,255,255,0.7)"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: `0 8px 24px ${shadowColor.replace('0.15', '0.22')}, 0 4px 10px rgba(0, 0, 0, 0.08)`,
      }}
    >
      <HStack justify="space-between" align="center">
        <VStack align="start" gap="0.375rem">
          <Text fontSize="0.8125rem" color="gray.500" fontWeight="600" letterSpacing="0.02em" textTransform="uppercase">
            {label}
          </Text>
          <Text fontSize="2rem" fontWeight="800" color={valueColor} lineHeight="1.1" letterSpacing="-0.02em">
            {value}
          </Text>
        </VStack>
        <Box p="0.625rem" bg={iconBgColor} borderRadius="0.875rem" opacity={0.9}>
          <Icon size="1.375rem" color={iconColor} />
        </Box>
      </HStack>
    </Box>
  );
};
