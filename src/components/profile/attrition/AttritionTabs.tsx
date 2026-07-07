'use client';

import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

interface AttritionTabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const AttritionTabs: React.FC<AttritionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <VStack gap={0} w="full" align="stretch" position="relative">
      {/* Tabs - Overlapping Parallelogram Shape */}
      <Box w="full" position="relative" mb={0} display="flex">
        {tabs.map((tab, index) => (
          <Box
            key={index}
            flex={1}
            px={6}
            py={2.5}
            ml={index > 0 ? "-30px" : "0"}
            bg={activeTab === index ? "rgba(224, 255, 255, 0.5)" : "rgba(245, 245, 245, 0.3)"}
            color={activeTab === index ? "cyan.700" : "gray.500"}
            cursor="pointer"
            fontSize="sm"
            fontWeight={activeTab === index ? "bold" : "medium"}
            textAlign="center"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            position="relative"
            overflow="visible"
            borderRadius="12px"
            border="none"
            zIndex={activeTab === index ? 10 : index}
            onMouseEnter={() => onTabChange(index)}
            _hover={{
              bg: activeTab === index ? "rgba(224, 255, 255, 0.6)" : "rgba(245, 245, 245, 0.5)",
              zIndex: activeTab === index ? 10 : 5
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: activeTab === index ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)" : "transparent",
              borderRadius: "12px",
              zIndex: -1
            }}
          >
            {tab}
          </Box>
        ))}
      </Box>
    </VStack>
  );
};
