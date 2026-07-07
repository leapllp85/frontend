'use client';

import React from 'react';
import { HStack, Box, VStack, Text } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
}) => {
  return (
    <HStack gap={2.5} pb={3} borderBottom="1px solid" borderColor="gray.100">
      <Box p={1.5} bg={iconBg} borderRadius="lg">
        <Icon size={18} color={iconColor} />
      </Box>
      <VStack align="start" gap={0}>
        <Text fontSize="0.875rem" fontWeight="700" color="gray.800">
          {title}
        </Text>
        <Text fontSize="0.6875rem" color="gray.400" fontWeight="500">
          {subtitle}
        </Text>
      </VStack>
    </HStack>
  );
};
