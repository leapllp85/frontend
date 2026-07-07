'use client';

import React, { ReactNode } from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';

interface AnalysisCardProps {
  title: string;
  hoverBorderColor?: string;
  children: ReactNode;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  hoverBorderColor = 'blue.200',
  children,
}) => {
  return (
    <VStack
      align="stretch"
      justify="flex-start"
      h="full"
      flex="1"
      minW="0"
      maxW="full"
      gap={0}
      minH="0"
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      shadow="0 1px 8px rgba(0,0,0,0.04)"
      transition="all 0.25s ease"
      cursor="pointer"
      _hover={{
        shadow: '0 4px 16px rgba(0,0,0,0.08)',
        transform: 'scale(1.02)',
        borderColor: hoverBorderColor,
        zIndex: 10,
      }}
      overflow="hidden"
    >
      {/* Fixed Header - 10% */}
      <Box
        px={3}
        py={2.5}
        borderBottom="1px solid"
        borderColor="gray.100"
        flexShrink={0}
        bg="gray.50"
      >
        <Text
          fontSize="0.8125rem"
          fontWeight="700"
          color="gray.700"
          textAlign="center"
          letterSpacing="0.01em"
        >
          {title}
        </Text>
      </Box>

      {/* Content Area - 90% */}
      <Box minH="0" px={3} py={3}>
        {children}
      </Box>
    </VStack>
  );
};
