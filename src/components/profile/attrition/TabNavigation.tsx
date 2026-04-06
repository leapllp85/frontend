'use client';

import React from 'react';
import { HStack, Box, Text } from '@chakra-ui/react';

interface TabNavigationProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <HStack 
      w="full" 
      bg="gray.50" 
      borderRadius="xl" 
      p="3px"
      gap={0}
    >
      {tabs.map((tab, index) => (
        <Box
          key={index}
          flex={1}
          px={5}
          py={2.5}
          bg={activeTab === index ? "white" : "transparent"}
          color={activeTab === index ? "gray.800" : "gray.500"}
          cursor="pointer"
          fontSize="0.8125rem"
          fontWeight={activeTab === index ? "600" : "500"}
          letterSpacing="0.01em"
          textAlign="center"
          transition="all 0.2s ease"
          borderRadius="lg"
          shadow={activeTab === index ? "0 1px 3px rgba(0,0,0,0.08)" : "none"}
          onClick={() => onTabChange(index)}
          _hover={{
            color: activeTab === index ? "gray.800" : "gray.700",
            bg: activeTab === index ? "white" : "gray.100",
          }}
        >
          <Text>{tab}</Text>
        </Box>
      ))}
    </HStack>
  );
};
