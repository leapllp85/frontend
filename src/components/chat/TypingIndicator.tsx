'use client';

import React from 'react';
import {
  Box,
  HStack,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  isVisible: boolean;
  userName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible,
  userName = 'AI Assistant',
}) => {
  if (!isVisible) return null;

  return (
    <Box
      w="full"
      opacity={isVisible ? 1 : 0}
      transform={isVisible ? 'translateY(0)' : 'translateY(10px)'}
      transition="all 0.3s ease"
    >
      <HStack gap={3} p={4} align="start">
        <Avatar.Root size="sm" bg="purple.100" color="purple.600">
          <Avatar.Fallback>
            <Bot size={14} />
          </Avatar.Fallback>
        </Avatar.Root>
        
        <Box
          bg="gray.100"
          borderRadius="2xl"
          px={4}
          py={3}
          maxW="200px"
        >
          <HStack gap={1} align="center">
            <Text fontSize="sm" color="gray.600" mr={2}>
              {userName} is typing
            </Text>
            <HStack gap={1}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  w="6px"
                  h="6px"
                  bg="gray.400"
                  borderRadius="full"
                  css={{
                    animation: 'bounce 1.4s infinite',
                    animationDelay: `${i * 0.16}s`,
                    '@keyframes bounce': {
                      '0%, 60%, 100%': {
                        transform: 'translateY(0)',
                      },
                      '30%': {
                        transform: 'translateY(-10px)',
                      },
                    },
                  }}
                />
              ))}
            </HStack>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};
