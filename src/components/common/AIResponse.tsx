'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Flex,
  IconButton,
  Spinner,
  GridItem,
  Grid,
  Badge,
  Heading
} from '@chakra-ui/react';
import { RefreshCw, ArrowLeft, MessageSquare, Bot, X, Clock } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { MultiComponentRenderer } from './MultiComponentRenderer';
import { RAGApiResponse, ChatMessage } from '@/types/ragApi';

interface AIResponseProps {
  isLoading?: boolean;
  error?: string | null;
  userQuestion: string;
  onRetry?: () => void;
  onReset?: () => void;
}

const AIResponse: React.FC<AIResponseProps> = ({
  isLoading = false,
  error = null,
  userQuestion,
  onRetry,
  onReset
}) => {
  const { 
    currentConversation, 
    progress, 
    progressMessage, 
    activeTasks, 
    cancelActiveTask, 
    cancelAllTasks 
  } = useChatContext();
  const messages = currentConversation?.messages || [];

  // Helper function to render structured AI response
  const renderStructuredResponse = (message: ChatMessage) => {
    console.log('Rendering message:', message);
    console.log('Message response:', message.response);
    
    if (!message.response) {
      return (
        <Box w="full" px={2}>
          <Text whiteSpace="pre-wrap">
            {message.content}
          </Text>
        </Box>
      );
    }

    // Handle string responses
    if (typeof message.response === 'string') {
      return (
        <Box w="full" px={2}>
          <Text whiteSpace="pre-wrap">
            {message.response}
          </Text>
        </Box>
      );
    }

    const ragResponse = message.response as RAGApiResponse;
    console.log('RAG Response:', ragResponse);
    
    return (
      <Box w="full">
        <VStack align="start" gap={4} w="full">
          {/* Text Response */}
          {ragResponse.raw_response && (
            <Box w="full" p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Text whiteSpace="pre-wrap" lineHeight="1.6" color="gray.700">
                {ragResponse.raw_response}
              </Text>
            </Box>
          )}

          {/* Multi-Component Rendering - Handle layout and components */}
          {(ragResponse.components && ragResponse.components.length > 0) || ragResponse.layout ? (
            <Box w="full">
              <MultiComponentRenderer 
                response={ragResponse}
                showInsights={false}
                showDataSources={false}
                layout="vertical"
              />
            </Box>
          ) : null}

          {/* Insights Section */}
          {ragResponse.insights && (
            <Box w="full" p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
              <Text fontWeight="semibold" color="blue.800" mb={3}>Key Insights</Text>
              <VStack align="start" gap={4} w="full">
                {ragResponse.insights.key_findings && ragResponse.insights.key_findings.length > 0 && (
                  <Box w="full">
                    <Text fontWeight="semibold" color="blue.800" mb={2}>Key Findings</Text>
                    <VStack align="start" gap={1}>
                      {ragResponse.insights.key_findings.map((finding, index) => (
                        <Text key={index} fontSize="sm" color="blue.700">• {finding}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
                
                {ragResponse.insights.recommendations && ragResponse.insights.recommendations.length > 0 && (
                  <Box w="full">
                    <Text fontWeight="semibold" color="blue.800" mb={2}>Recommendations</Text>
                    <VStack align="start" gap={1}>
                      {ragResponse.insights.recommendations.map((rec, index) => (
                        <Text key={index} fontSize="sm" color="blue.700">• {rec}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}

                {ragResponse.insights.next_steps && ragResponse.insights.next_steps.length > 0 && (
                  <Box w="full">
                    <Text fontWeight="semibold" color="blue.800" mb={2}>Next Steps</Text>
                    <VStack align="start" gap={1}>
                      {ragResponse.insights.next_steps.map((step, index) => (
                        <Text key={index} fontSize="sm" color="blue.700">• {step}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}

                {ragResponse.insights.alerts && ragResponse.insights.alerts.length > 0 && (
                  <Box w="full">
                    <Text fontWeight="semibold" color="red.800" mb={2}>Alerts</Text>
                    <VStack align="start" gap={1}>
                      {ragResponse.insights.alerts.map((alert, index) => (
                        <Text key={index} fontSize="sm" color="red.700">⚠️ {alert}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>
          )}

        {/* Query Information */}
        {ragResponse.queries && ragResponse.queries.length > 0 && (
          <Box w="full" p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.200" shadow="lg">
            <Text fontWeight="semibold" color="gray.800" mb={3}>Data Sources</Text>
            <VStack align="start" gap={3}>
              {ragResponse.queries.map((query, index) => (
                <Box key={index} w="full">
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                    {query.description}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Fields: {query.expected_fields.join(', ')}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
        </VStack>
      </Box>
    );
  };

  const handleReset = () => {
    if (onReset) onReset();
  };

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  return (
    <Box h="100vh" bg="gray.50" position="relative">
      {userQuestion ? (
        <>
          {/* Header */}
          <Box bg="white" borderBottom="1px solid" borderColor="gray.200" p={4} shadow="lg">
            <Flex justify="space-between" align="center">
              <HStack gap={3}>
                <IconButton
                  aria-label="Go back"
                  onClick={handleReset}
                  variant="ghost"
                  colorScheme="gray"
                  color="gray.600"
                  _hover={{ color: 'gray.800', bg: 'gray.100' }}
                  size="sm"
                >
                  <Box as={ArrowLeft} boxSize="18px" />
                </IconButton>
                <HStack>
                  <Box as={MessageSquare} boxSize="20px" color="purple.500" />
                  <Heading size="md" color="gray.800">AI Assistant</Heading>
                  {/* Active Tasks Indicator */}
                  {activeTasks.length > 0 && (
                    <Badge colorScheme="orange" variant="solid" fontSize="xs">
                      {activeTasks.length} active
                    </Badge>
                  )}
                </HStack>
              </HStack>

              <HStack gap={2}>
                {/* Progress Controls */}
                {activeTasks.length > 0 && (
                  <HStack gap={2}>
                    <IconButton
                      aria-label="Cancel current task"
                      onClick={() => cancelActiveTask()}
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      title="Cancel current task"
                    >
                      <Box as={X} boxSize="16px" />
                    </IconButton>
                    {activeTasks.length > 1 && (
                      <Button
                        onClick={() => cancelAllTasks()}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        title="Cancel all tasks"
                      >
                        Cancel All
                      </Button>
                    )}
                  </HStack>
                )}
                
                {error && (
                  <Button
                    onClick={handleRetry}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                  >
                    <Box as={RefreshCw} boxSize="16px" mr={2} />
                    Retry
                  </Button>
                )}
              </HStack>
            </Flex>
            
            {/* Progress Bar */}
            {/* {(isLoading || progress !== null || progressMessage) && (
              <Box mt={3} p={3} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
                <VStack align="start" gap={2}>
                  <HStack justify="space-between" w="full">
                    <HStack gap={2}>
                      {isLoading && <Spinner size="sm" color="purple.500" />}
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {progressMessage || 'Processing your request...'}
                      </Text>
                    </HStack>
                    <HStack gap={1}>
                      {activeTasks.map((task, index) => (
                        <Box
                          key={`${task}-${index}`}
                          w={2}
                          h={2}
                          borderRadius="full"
                          bg="orange.400"
                          title={`Task ${index + 1}: active`}
                        />
                      ))}
                    </HStack>
                  </HStack>
                  {progress !== null && (
                    <Box w="full" h="2" bg="gray.200" borderRadius="full" overflow="hidden">
                      <Box
                        h="full"
                        bg="purple.400"
                        borderRadius="full"
                        width={`${progress}%`}
                        transition="width 0.3s ease"
                      />
                    </Box>
                  )}
                </VStack>
              </Box>
            )} */}
          </Box>

          {/* Content Area */}
          <Box flex={1} overflowY="auto">
            <Box w="full" maxW="none">
              <Box display="flex" flexDirection="column" gap={4} w="full" p={4}>
                {/* Question Display */}
                {messages.find(m => m.type === 'user') && (
                  <Box p={4} bg="blue.50" borderLeft="4px solid" borderColor="blue.400" borderRadius="xl" w="full">
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" fontWeight="semibold" color="blue.700">Your Question</Text>
                      <Text color="blue.800">{messages.find(m => m.type === 'user')?.content}</Text>
                    </VStack>
                  </Box>
                )}

                {/* Enhanced Loading State */}
                {isLoading && (
                  <Flex justify="center" align="center" py={8}>
                    <VStack gap={4}>
                      <Box position="relative">
                        <Spinner size="lg" color="purple.500" />
                        {activeTasks.length > 0 && (
                          <Badge
                            position="absolute"
                            top="-2"
                            right="-2"
                            colorScheme="orange"
                            borderRadius="full"
                            fontSize="xs"
                          >
                            {activeTasks.length}
                          </Badge>
                        )}
                      </Box>
                      <VStack gap={2}>
                        <Text color="gray.600" fontWeight="medium">
                          {progressMessage || 'Processing your request...'}
                        </Text>
                        {/* {progress !== null && (
                          <Text fontSize="sm" color="gray.500">
                            {Math.round(progress)}% complete
                          </Text>
                        )} */}
                        {activeTasks.length > 0 && (
                          <HStack gap={2} mt={2}>
                            {activeTasks.map((task, index) => (
                              <HStack key={`${task}-${index}`} gap={1}>
                                <Box
                                  as={Clock}
                                  boxSize="12px"
                                  color="orange.500"
                                />
                                <Text fontSize="xs" color="gray.500">
                                  Task {index + 1}
                                </Text>
                              </HStack>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </Flex>
                )}

                {/* Error State */}
                {error && (
                  <Box p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="xl">
                    <VStack align="start" gap={2}>
                      <Text fontWeight="semibold" color="red.800">Error occurred!</Text>
                      <Text color="red.700">{error}</Text>
                    </VStack>
                  </Box>
                )}

                {/* Latest Assistant Response Only */}
                {!isLoading && !error && (() => {
                  // Get only the latest assistant message
                  const latestAssistantMessage = messages.filter(m => m.type === 'assistant').slice(-1)[0];
                  
                  console.log('All messages:', messages);
                  console.log('Latest assistant message:', latestAssistantMessage);
                  
                  if (!latestAssistantMessage) {
                    console.log('No assistant message found');
                    return null;
                  }
                  
                  return (
                    <Flex gap={3} justify="flex-start" w="full">
                      <Box boxSize={8} bg="purple.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                        <Box as={Bot} boxSize="16px" color="#805AD5" />
                      </Box>

                      <Box
                        w="full"
                        bg="white"
                        color="gray.800"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        p={4}
                      >
                        {renderStructuredResponse(latestAssistantMessage)}
                        <Text
                          fontSize="xs"
                          mt={2}
                          color="gray.500"
                        >
                          {latestAssistantMessage.timestamp.toLocaleTimeString()}
                        </Text>
                      </Box>
                    </Flex>
                  );
                })()}

                {/* Empty State */}
                {!isLoading && !error && messages.length === 0 && (
                  <Flex justify="center" align="center" py={12}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Box mb={4}>
                        <Box as={MessageSquare} boxSize="48px" color="#9F7AEA" />
                      </Box>
                      <Heading size="lg" color="gray.700" mb={2}>No response yet</Heading>
                      <Text color="gray.500">Your AI assistant is ready to help.</Text>
                    </Box>
                  </Flex>
                )}
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        // Welcome Screen
        <Flex flex={1} align="center" justify="center">
          <VStack gap={6} textAlign="center">
            <Box as={MessageSquare} boxSize="64px" color="#a4489e" />
            <Heading size="xl" color="gray.800" mb={2}>Welcome to AI Assistant</Heading>
            <Text color="gray.600" mb={8}>Ask me anything using the chat input in the sidebar.</Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} maxW="2xl">
              <GridItem>
                <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading size="md" color="gray.800" mb={2}>Project Insights</Heading>
                  <Text fontSize="sm" color="gray.600">Get analysis on your current projects and their status.</Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading size="md" color="gray.800" mb={2}>Team Analytics</Heading>
                  <Text fontSize="sm" color="gray.600">Understand team performance and productivity metrics.</Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading size="md" color="gray.800" mb={2}>Action Items</Heading>
                  <Text fontSize="sm" color="gray.600">Track and manage your important action items.</Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading size="md" color="gray.800" mb={2}>Quick Reports</Heading>
                  <Text fontSize="sm" color="gray.600">Generate instant reports and summaries.</Text>
                </Box>
              </GridItem>
            </Grid>
          </VStack>
        </Flex>
      )}

    </Box>
  );
};

export default AIResponse;