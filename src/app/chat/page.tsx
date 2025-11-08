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
import { useChatContext } from '@/contexts/ChatContext';
import { toaster } from '@/components/ui/toaster';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  
  const { sendMessageAsync, isLoading } = useChatContext();

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
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use the existing chat context to send message
      await sendMessageAsync(inputMessage.trim());
      
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          content: "I understand your question. Let me help you with that. This is a sample response that demonstrates the chat functionality. In a real implementation, this would be connected to your AI backend service.",
          sender: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => prev.slice(0, -1).concat([aiResponse]));
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.slice(0, -1));
      setIsTyping(false);
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
