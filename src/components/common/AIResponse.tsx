import React from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  HStack,
  Heading,
  Card,
  Flex,
  Badge,
  Avatar,
} from '@chakra-ui/react';
import { Bot, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { RAGApiResponse, ChatMessage } from '../../types/ragApi';
import { ComponentRenderer } from '../data/ComponentRenderer';
import { InsightsPanel } from '../data/InsightsPanel';
import { ConversationView } from '../chat/ConversationView';
import { TypingIndicator } from '../chat/TypingIndicator';
import { useChatContext } from '../../contexts/ChatContext';

interface AIResponseProps {
  aiResponse?: string | RAGApiResponse;
  isLoading: boolean;
  error: string | null;
  userQuestion?: string;
}

export const AIResponse: React.FC<AIResponseProps> = ({
  aiResponse,
  isLoading,
  error,
  userQuestion,
}) => {
  const { currentConversation, isTyping } = useChatContext();

  return (
    <Box 
      w="full" 
      h="full" 
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      overflowY="auto"
      position="relative"
      m={0}
      p={0}
    >
      <VStack align="start" gap={{ base: 4, md: 6 }} h="full" p={{ base: 4, md: 6 }} position="relative" m={0}>
        {/* Header */}
        <Box w="full">
          <HStack gap={{ base: 2, md: 3 }} mb={2}>
            <Box 
              p={{ base: 1.5, md: 2 }} 
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
              borderRadius="lg"
              color="white"
            >
              <Bot size={20} />
            </Box>
            <VStack align="start" gap={0}>
              <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="black" letterSpacing="tight">
                AI Assistant
              </Heading>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" fontWeight="medium" display={{ base: "none", md: "block" }}>
                Powered by advanced AI technology
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Error Display */}
        {error && (
          <Card.Root 
            w="full" 
            bg="linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" 
            borderColor="red.300" 
            borderWidth="1px"
            borderRadius="xl"
            shadow="lg"
            _hover={{ transform: "translateY(-1px)", shadow: "xl" }}
            transition="all 0.3s ease"
          >
            <Card.Body p={{ base: 4, md: 6 }}>
              <HStack gap={{ base: 2, md: 3 }}>
                <Box p={{ base: 1.5, md: 2 }} bg="red.100" borderRadius="full" color="red.600">
                  <Zap size={16} />
                </Box>
                <VStack align="start" gap={1}>
                  <Text color="red.700" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold">
                    Something went wrong
                  </Text>
                  <Text color="red.600" fontSize={{ base: "xs", md: "sm" }}>
                    {error}
                  </Text>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        {/* Loading Display */}
        {isLoading && (
          <Card.Root 
            w="full" 
            bg="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" 
            borderColor="blue.300" 
            borderWidth="1px"
            borderRadius="xl"
            shadow="lg"
            _hover={{ transform: "translateY(-1px)", shadow: "xl" }}
            transition="all 0.3s ease"
          >
            <Card.Body p={{ base: 4, md: 6 }}>
              <HStack gap={{ base: 3, md: 4 }}>
                <Box position="relative">
                  <Spinner size={{ base: "sm", md: "md" }} color="blue.500" />
                  <Box 
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  >
                    <Sparkles size={12} color="#3b82f6" />
                  </Box>
                </Box>
                <VStack align="start" gap={1}>
                  <Text color="blue.700" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold">
                    AI is thinking...
                  </Text>
                  <Text color="blue.600" fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "block" }}>
                    Processing your request with advanced AI
                  </Text>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        {/* User Question Display - Hidden when using chat context */}
        {/* {userQuestion && !currentConversation && (
          <Card.Root 
            w="full" 
            bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            borderColor="blue.400" 
            borderWidth="1px"
            borderRadius="2xl"
            shadow="lg"
            _hover={{ transform: "translateY(-1px)", shadow: "xl" }}
            transition="all 0.3s ease"
            overflow="hidden"
            flexShrink={0}
          >
            <Card.Header p={{ base: 4, md: 6 }} pb={{ base: 2, md: 4 }}>
              <HStack gap={{ base: 2, md: 3 }}>
                <Avatar.Root size={{ base: "sm", md: "md" }} bg="whiteAlpha.200" color="white">
                  <Avatar.Fallback>
                    <MessageSquare size={16} />
                  </Avatar.Fallback>
                </Avatar.Root>
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" color="white" fontSize={{ base: "md", md: "lg" }}>
                    Your Question
                  </Text>
                  <Badge 
                    bg="whiteAlpha.200" 
                    color="white" 
                    variant="solid" 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                    fontSize="2xs"
                    display={{ base: "none", md: "flex" }}
                  >
                    <MessageSquare size={10} style={{ marginRight: '4px' }} />
                    Query
                  </Badge>
                </VStack>
              </HStack>
            </Card.Header>
            <Card.Body p={{ base: 4, md: 6 }} pt={0}>
              <Box 
                p={{ base: 4, md: 6 }} 
                bg="whiteAlpha.200" 
                borderRadius="xl" 
                border="1px" 
                borderColor="whiteAlpha.300"
                backdropFilter="blur(10px)"
                w="full"
              >
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  lineHeight="1.7" 
                  color="white"
                  fontWeight="medium"
                  whiteSpace="pre-wrap"
                >
                  {userQuestion}
                </Text>
              </Box>
            </Card.Body>
          </Card.Root>
        )} */}

        {/* Conversation Display */}
        {currentConversation && currentConversation.messages.length > 0 ? (
          <Box w="full" overflowY="auto" maxH="calc(100vh - 200px)" flexShrink={1}>
            <VStack gap={4} align="stretch">
              <ConversationView messages={currentConversation.messages} />
              <TypingIndicator isVisible={isTyping} />
            </VStack>
          </Box>
        ) : (
          !isLoading && !error && (
            <Card.Root 
              w="full" 
              bg="white"
              borderColor="gray.200" 
              borderWidth="1px"
              borderRadius="2xl"
              shadow="xl"
              _hover={{ transform: "translateY(-2px)", shadow: "2xl" }}
              transition="all 0.3s ease"
              overflow="hidden"
              flex="1"
            >
              <Card.Body p={{ base: 4, md: 8 }}>
                <Flex align="center" justify="center" minH={{ base: "300px", md: "400px" }} direction="column">
                  <VStack gap={{ base: 4, md: 6 }} maxW="md" textAlign="center">
                    {/* Animated AI Icon */}
                    <Box position="relative">
                      <Box
                        w={{ base: "16", md: "20" }}
                        h={{ base: "16", md: "20" }}
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        borderRadius="2xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        shadow="xl"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="all 0.3s ease"
                      >
                        <Bot size={36} color="white" />
                      </Box>
                      <Box 
                        position="absolute"
                        top="-2"
                        right="-2"
                        w={{ base: "4", md: "6" }}
                        h={{ base: "4", md: "6" }}
                        bg="green.400"
                        borderRadius="full"
                        border="3px solid"
                        borderColor="white"
                        animation="pulse 2s infinite"
                      />
                    </Box>

                    {/* Welcome Content */}
                    <VStack gap={{ base: 2, md: 3 }}>
                      <Heading 
                        size={{ base: "xl", md: "2xl" }} 
                        color="gray.800" 
                        fontWeight="black" 
                        letterSpacing="tight"
                      >
                        Welcome to AI Assistant
                      </Heading>
                      <Text 
                        color="gray.600" 
                        fontSize={{ base: "md", md: "lg" }} 
                        lineHeight="1.6"
                        maxW="sm"
                      >
                        Start a conversation in the chat sidebar to unlock the power of AI-driven insights and assistance.
                      </Text>
                    </VStack>

                    {/* Feature Pills */}
                    <HStack gap={{ base: 2, md: 3 }} flexWrap="wrap" justify="center" mt={{ base: 3, md: 4 }}>
                      <Badge 
                        bg="blue.50" 
                        color="blue.700" 
                        variant="solid" 
                        px={3} 
                        py={2} 
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="semibold"
                        border="1px solid"
                        borderColor="blue.200"
                      >
                        <MessageSquare size={14} style={{ marginRight: '6px' }} />
                        Smart Conversations
                      </Badge>
                      <Badge 
                        bg="purple.50" 
                        color="purple.700" 
                        variant="solid" 
                        px={3} 
                        py={2} 
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="semibold"
                        border="1px solid"
                        borderColor="purple.200"
                      >
                        <Sparkles size={14} style={{ marginRight: '6px' }} />
                        AI-Powered
                      </Badge>
                      <Badge 
                        bg="green.50" 
                        color="green.700" 
                        variant="solid" 
                        px={3} 
                        py={2} 
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="semibold"
                        border="1px solid"
                        borderColor="green.200"
                      >
                        <Zap size={14} style={{ marginRight: '6px' }} />
                        Instant Results
                      </Badge>
                    </HStack>

                    {/* Call to Action */}
                    {/* <Box 
                      mt={{ base: 4, md: 6 }}
                      p={{ base: 3, md: 4 }}
                      bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="blue.200"
                      w="full"
                    >
                      <Text 
                        fontSize={{ base: "xs", md: "sm" }} 
                        color="blue.700" 
                        textAlign="center"
                        fontWeight="medium"
                      >
                        💡 Tip: Ask me anything about your projects, action items, or team insights!
                      </Text>
                    </Box> */}
                  </VStack>
                </Flex>
              </Card.Body>
            </Card.Root>
          )
        )}
      </VStack>
    </Box>
  );
};

export default AIResponse;
