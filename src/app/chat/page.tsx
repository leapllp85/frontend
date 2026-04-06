'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Input, 
  Button, 
  Text, 
  Avatar, 
  Flex,
  IconButton,
  Textarea,
  Spinner
} from '@chakra-ui/react';
import { Send, Bot, User, ArrowLeft, Trash2, Copy, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { asyncChatApi } from '@/services/asyncChatApi';
import { RAGApiResponse } from '@/types/ragApi';
import { toaster } from '@/components/ui/toaster';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  ragResponse?: RAGApiResponse;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Clyra AI, your intelligent assistant. I can help you with project insights, team analytics, action items, and much more. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    const userPrompt = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Call asyncChatApi directly to get the full RAG response
      const chatResponse = await asyncChatApi.sendMessageAsync(userPrompt, undefined, {
        onProgress: (progress, message) => {
          console.log(`Progress: ${progress}% - ${message}`);
        },
        onComplete: (ragResponse) => {
          console.log('RAG Response received:', ragResponse);
        }
      });
      
      // Format the response based on what we got back
      let responseContent = '';
      let ragResponse: RAGApiResponse | undefined;
      
      if (chatResponse && chatResponse.response) {
        // Handle both string and RAGApiResponse types
        if (typeof chatResponse.response === 'string') {
          responseContent = chatResponse.response;
        } else {
          ragResponse = chatResponse.response;
          const insights = ragResponse.insights;
        
        if (insights) {
          if (insights.key_findings && insights.key_findings.length > 0) {
            responseContent += '**Key Findings:**\n';
            insights.key_findings.forEach((finding: string) => {
              responseContent += `• ${finding}\n`;
            });
            responseContent += '\n';
          }
          
          if (insights.recommendations && insights.recommendations.length > 0) {
            responseContent += '**Recommendations:**\n';
            insights.recommendations.forEach((rec: string) => {
              responseContent += `• ${rec}\n`;
            });
            responseContent += '\n';
          }
          
          if (insights.alerts && insights.alerts.length > 0) {
            responseContent += '**⚠️ Alerts:**\n';
            insights.alerts.forEach((alert: string) => {
              responseContent += `• ${alert}\n`;
            });
            responseContent += '\n';
          }
          
          if (insights.next_steps && insights.next_steps.length > 0) {
            responseContent += '**Next Steps:**\n';
            insights.next_steps.forEach((step: string) => {
              responseContent += `• ${step}\n`;
            });
          }
        }
        }
      }
      
      if (!responseContent) {
        // Generate a contextual response based on the query
        const query = userPrompt.toLowerCase();
        
        if (query.includes('employee') || query.includes('team member') || query.includes('staff')) {
          responseContent = "**Team Analysis:**\n\nBased on current data, I can provide insights on:\n\n• Employee risk assessments and attrition predictions\n• Performance metrics and utilization rates\n• Mental health and wellness indicators\n• Career development and growth opportunities\n\nFor detailed analysis, try asking:\n• 'Show me all high-risk employees'\n• 'Who are my top performers?'\n• 'List employees with mental health concerns'";
        } else if (query.includes('project')) {
          responseContent = "**Project Insights:**\n\nI can help you analyze:\n\n• Project risk levels and health metrics\n• Resource allocation and team assignments\n• Timeline and milestone tracking\n• Critical dependencies and blockers\n\nFor detailed analysis, try asking:\n• 'Which projects are at risk?'\n• 'Show project allocation by team'\n• 'List projects with critical members'";
        } else if (query.includes('mental') || query.includes('wellness') || query.includes('health')) {
          responseContent = "**Mental Health & Wellness:**\n\nI can provide insights on:\n\n• Team mental health score trends\n• Employees requiring support\n• Wellness program effectiveness\n• Stress and burnout indicators\n\nFor detailed analysis, try asking:\n• 'Team mental health trends'\n• 'Employees needing mental health support'\n• 'Mental health distribution by department'";
        } else if (query.includes('attrition') || query.includes('turnover') || query.includes('retention')) {
          responseContent = "**Attrition & Retention Analysis:**\n\nI can help you understand:\n\n• Attrition risk factors and predictions\n• Top reasons for employee turnover\n• Retention strategies and effectiveness\n• Department-wise attrition trends\n\nFor detailed analysis, try asking:\n• 'Attrition risk analysis'\n• 'Top reasons for employee attrition'\n• 'Predict which employees might leave'";
        } else {
          responseContent = "**How can I help you today?**\n\nI can provide insights on:\n\n**Team Analytics:**\n• Employee risk and performance analysis\n• Mental health and wellness tracking\n• Attrition predictions and retention strategies\n\n**Project Management:**\n• Project risk assessment\n• Resource allocation optimization\n• Timeline and milestone tracking\n\n**Quick Suggestions:**\n• 'Show me all high-risk employees'\n• 'Which projects are at risk?'\n• 'Team mental health trends'\n• 'Attrition risk analysis'\n• 'Team utilization report'";
        }
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date(),
        ragResponse: ragResponse
      };

      setMessages(prev => prev.slice(0, -1).concat([aiResponse]));
      setIsTyping(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.slice(0, -1));
      setIsTyping(false);
      setIsLoading(false);
      toaster.error({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Hello! I'm Clyra AI, your intelligent assistant. I can help you with project insights, team analytics, action items, and much more. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date()
    }]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toaster.success({
      title: 'Copied!',
      description: 'Message copied to clipboard',
      duration: 2000,
    });
  };

  return (
    <Box w="100vw" h="100vh" bg="gray.50" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        bg="linear-gradient(135deg, #0077b6 0%, #3b82f6 50%, #8b5cf6 100%)"
        color="white"
        px={6}
        py={4}
        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      >
        <HStack justify="space-between" align="center">
          <HStack gap={4}>
            <IconButton
              aria-label="Go back"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => router.push('/')}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <HStack gap={3}>
              <Box
                w="40px"
                h="40px"
                borderRadius="full"
                bg="linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 12px rgba(0,0,0,0.2)"
              >
                <Bot size={20} color="white" />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="lg" fontWeight="bold">
                  Clyra AI
                </Text>
                <Text fontSize="sm" opacity={0.8}>
                  Your Intelligent Assistant
                </Text>
              </VStack>
            </HStack>
          </HStack>
          
          <HStack gap={2}>
            <IconButton
              aria-label="Clear chat"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={clearChat}
            >
              <Trash2 size={18} />
            </IconButton>
            <IconButton
              aria-label="Close chat"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => router.push('/')}
            >
              <X size={18} />
            </IconButton>
          </HStack>
        </HStack>
      </Box>

      {/* Messages Container */}
      <Box
        flex="1"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box
          flex="1"
          overflowY="auto"
          px={4}
          py={6}
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          }}
        >
          <VStack gap={6} align="stretch" maxW="4xl" mx="auto">
            {messages.map((message) => (
              <Flex
                key={message.id}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                align="flex-start"
                gap={3}
              >
                {message.sender === 'assistant' && (
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg="linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <Bot size={16} color="white" />
                  </Box>
                )}
                
                <Box
                  maxW="70%"
                  bg={message.sender === 'user' ? 
                    'linear-gradient(135deg, #0077b6 0%, #3b82f6 100%)' : 
                    'white'
                  }
                  color={message.sender === 'user' ? 'white' : 'gray.800'}
                  px={4}
                  py={3}
                  borderRadius="2xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                  position="relative"
                  _hover={{
                    '& .message-actions': {
                      opacity: 1
                    }
                  }}
                >
                  {message.isLoading ? (
                    <HStack gap={2}>
                      <Spinner size="sm" color="teal.500" />
                      <Text fontSize="sm" color="gray.500">
                        Clyra is thinking...
                      </Text>
                    </HStack>
                  ) : (
                    <>
                      <Text fontSize="sm" lineHeight="1.5" whiteSpace="pre-wrap">
                        {message.content}
                      </Text>
                      
                      {/* Message Actions */}
                      <HStack
                        className="message-actions"
                        position="absolute"
                        top="-10px"
                        right="-10px"
                        bg="white"
                        borderRadius="full"
                        boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                        p={1}
                        opacity={0}
                        transition="opacity 0.2s"
                        gap={1}
                      >
                        <IconButton
                          aria-label="Copy message"
                          size="xs"
                          variant="ghost"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy size={12} />
                        </IconButton>
                      </HStack>
                    </>
                  )}
                  
                  <Text
                    fontSize="xs"
                    color={message.sender === 'user' ? 'whiteAlpha.700' : 'gray.500'}
                    mt={2}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </Box>

                {message.sender === 'user' && (
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg="gray.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <User size={16} color="gray.600" />
                  </Box>
                )}
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Input Area */}
        <Box
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          px={4}
          py={4}
          boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
        >
          <HStack gap={3} maxW="4xl" mx="auto">
            <Box flex="1" position="relative">
              <Textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="xl"
                resize="none"
                minH="50px"
                maxH="120px"
                py={3}
                px={4}
                color="black"
                _focus={{
                  borderColor: "teal.400",
                  boxShadow: "0 0 0 1px teal.400"
                }}
                _placeholder={{
                  color: "gray.500"
                }}
              />
            </Box>
            
            <IconButton
              aria-label="Send message"
              bg="linear-gradient(135deg, #0077b6 0%, #3b82f6 100%)"
              color="white"
              size="lg"
              borderRadius="xl"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
              }}
              _active={{
                transform: "scale(0.95)"
              }}
              transition="all 0.2s"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              boxShadow="0 2px 8px rgba(0,0,0,0.15)"
            >
              {isLoading ? <Spinner size="sm" /> : <Send size={20} />}
            </IconButton>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
