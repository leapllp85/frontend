'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Avatar,
  Badge,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { Bot, User, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types/ragApi';
import { ComponentRenderer } from '../data/ComponentRenderer';
import { InsightsPanel } from '../data/InsightsPanel';

interface ConversationViewProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const formatTime = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const ConversationView: React.FC<ConversationViewProps> = ({ 
  messages, 
  isLoading = false, 
  error = null,
  onRetry 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Memoize and filter messages
  const uniqueMessages = useMemo(() => {
    const seen = new Set();
    return messages.filter(message => {
      const key = `${message.content}-${message.type}-${new Date(message.timestamp).getTime()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <Box p={4} bg="red.50" borderRadius="md" borderColor="red.200" borderWidth="1px" mb={4}>
        <HStack gap={2} align="start">
          <Box color="red.500" mt={0.5}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </Box>
          <VStack align="start" gap={1} flex={1}>
            <Text color="red.700" fontSize="sm" fontWeight="semibold">
              Error loading messages
            </Text>
            <Text color="red.600" fontSize="sm">
              {error}
              {onRetry && (
                <Text as="button" color="blue.500" onClick={onRetry} ml={2} textDecoration="underline">
                  Retry
                </Text>
              )}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  }
  
  return (
    <VStack gap={4} w="full" align="stretch" pb={4}>
      {isLoading && (
        <Flex justify="center" py={4}>
          <Spinner size="md" color="blue.500" />
        </Flex>
      )}
      
      {uniqueMessages.map((message) => (
        <Box key={`${message.id}-${new Date(message.timestamp).getTime()}`} w="full">
          {message.type === 'user' ? (
            // User Message
            <Flex justify="flex-end" w="full">
              <Card.Root 
                maxW="80%" 
                bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                borderRadius="2xl"
                shadow="md"
              >
                <Card.Header p={4} pb={2}>
                  <HStack gap={2} justify="space-between">
                    <HStack gap={2}>
                      <Avatar.Root size="sm" bg="whiteAlpha.200" color="white">
                        <Avatar.Fallback>
                          <User size={14} />
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Text fontSize="sm" fontWeight="semibold" color="white">
                        You
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="whiteAlpha.700">
                      {formatTime(message.timestamp)}
                    </Text>
                  </HStack>
                </Card.Header>
                <Card.Body p={4} pt={0}>
                  <Text color="white" fontSize="sm" lineHeight="1.6">
                    {message.content}
                  </Text>
                </Card.Body>
              </Card.Root>
            </Flex>
          ) : (
            // Assistant Message
            <Flex justify="flex-start" w="full">
              <VStack align="start" gap={3} maxW="95%" w="full">
                <Card.Root 
                  w="full"
                  bg="white"
                  borderColor="gray.200"
                  borderWidth="1px"
                  borderRadius="2xl"
                  shadow="md"
                >
                  <Card.Header p={4} pb={2}>
                    <HStack gap={2} justify="space-between">
                      <HStack gap={2}>
                        <Avatar.Root size="sm" bg="purple.100" color="purple.600">
                          <Avatar.Fallback>
                            <Bot size={14} />
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                          AI Assistant
                        </Text>
                        <Badge 
                          bg="purple.50" 
                          color="purple.700" 
                          variant="solid" 
                          px={2} 
                          py={1} 
                          borderRadius="full"
                          fontSize="2xs"
                        >
                          <MessageSquare size={8} style={{ marginRight: '4px' }} />
                          Response
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {formatTime(message.timestamp)}
                      </Text>
                    </HStack>
                  </Card.Header>
                  <Card.Body p={4} pt={0}>
                    {message.response ? (
                      // Structured RAG Response
                      <VStack gap={4} w="full" align="start">
                        {/* Error Display */}
                        {!message.response.success && message.response.error && (
                          <Box p={4} bg="red.50" borderRadius="xl" borderColor="red.200" borderWidth="1px" w="full">
                            <HStack gap={2} align="start">
                              <Box color="red.500" mt={0.5}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                              </Box>
                              <VStack align="start" gap={1} flex={1}>
                                <Text color="red.700" fontSize="sm" fontWeight="semibold">
                                  Unable to process your request
                                </Text>
                                <Text color="red.600" fontSize="xs">
                                  {typeof message.response.error === 'string' 
                                    ? message.response.error.replace(/[\[\]"']/g, '').replace(/\\u201c|\\u201d/g, '"')
                                    : 'An unexpected error occurred. Please try again.'}
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>
                        )}

                        {/* Data Visualization */}
                        {message.response.success && message.response.analysis && message.response.dataset && (
                          <Box w="full">
                            <ComponentRenderer 
                              config={message.response.analysis.component_config} 
                              dataset={message.response.dataset} 
                            />
                          </Box>
                        )}

                        {/* Insights Panel */}
                        {message.response.success && message.response.insights && (
                          <InsightsPanel insights={message.response.insights} />
                        )}

                        {/* Raw Response Fallback */}
                        {message.response.raw_response && (
                          <Box p={3} bg="gray.50" borderRadius="lg" w="full">
                            <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                              {message.response.raw_response}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    ) : (
                      message.content.toLowerCase().includes('error') || message.content.toLowerCase().includes('apologize') ? (
                        <Box p={4} bg="orange.50" borderRadius="xl" borderColor="orange.200" borderWidth="1px" w="full">
                          <HStack gap={2} align="start">
                            <Box color="orange.500" mt={0.5}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                              </svg>
                            </Box>
                            <Text color="orange.700" fontSize="sm" whiteSpace="pre-wrap" flex={1}>
                              {message.content}
                            </Text>
                          </HStack>
                        </Box>
                      ) : (
                        <Text color="gray.800" fontSize="sm" whiteSpace="pre-wrap">
                          {message.content}
                        </Text>
                      )
                    )}
                  </Card.Body>
                </Card.Root>
              </VStack>
            </Flex>
          )}
        </Box>
      ))}
      
      <div ref={messagesEndRef} />
    </VStack>
  );
};