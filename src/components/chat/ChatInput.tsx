'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  HStack,
  VStack,
  Button,
  Textarea,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { Send } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendMessageAsync?: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  onTyping?: (isTyping: boolean) => void;
  progress?: string | null;
  useAsyncChat?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendMessageAsync,
  isLoading = false,
  disabled = false,
  placeholder = "Type your message...",
  maxLength = 2000,
  onTyping,
  progress,
  useAsyncChat = true,
}) => {
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Handle typing indicator
  const handleInputChange = (value: string) => {
    setMessage(value);
    
    if (onTyping) {
      onTyping(true);
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      const timeout = setTimeout(() => {
        onTyping(false);
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled || isLoading) {
      return;
    }

    // Use async chat if available and enabled
    if (useAsyncChat && onSendMessageAsync) {
      onSendMessageAsync(message.trim());
    } else {
      onSendMessage(message.trim());
    }
    
    setMessage('');
    
    if (onTyping) {
      onTyping(false);
    }
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  }, [message, disabled, isLoading, onSendMessage, onSendMessageAsync, onTyping, typingTimeout, useAsyncChat]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <Box w="full">
      {/* Progress Indicator */}
      <ProgressIndicator 
        isVisible={isLoading} 
        progress={progress}
        className="mb-4"
      />

      {/* Main Input Area */}
      <VStack gap={2} align="stretch">
        <Box position="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            resize="none"
            minH="44px"
            maxH="120px"
            bg="white"
            border="2px solid"
            borderColor={isOverLimit ? "red.300" : "gray.200"}
            borderRadius="xl"
            _focus={{
              borderColor: isOverLimit ? "red.400" : "blue.400",
              boxShadow: `0 0 0 1px ${isOverLimit ? '#fc8181' : '#63b3ed'}`,
            }}
            _hover={{
              borderColor: isOverLimit ? "red.300" : "gray.300",
            }}
            pr="120px"
            fontSize="sm"
            lineHeight="1.5"
          />
          
          {/* Character Count */}
          {(isNearLimit || isOverLimit) && (
            <Text
              position="absolute"
              bottom="2"
              right="100px"
              fontSize="xs"
              color={isOverLimit ? "red.500" : "orange.500"}
              fontWeight="medium"
            >
              {characterCount}/{maxLength}
            </Text>
          )}
        </Box>

        {/* Action Buttons */}
        <HStack justify="space-between" align="center">
          <HStack gap={1}>
            {/* Loading Spinner */}
            {isLoading && (
              <Spinner size="sm" color="blue.500" />
            )}
          </HStack>

          {/* Send Button */}
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleSend}
            disabled={disabled || isLoading || isOverLimit || !message.trim()}
            borderRadius="lg"
            px={6}
          >
            <HStack gap={2}>
              <Send size={16} />
              <Text>{isLoading ? 'Processing...' : 'Send'}</Text>
            </HStack>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
