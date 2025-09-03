'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Sidebar } from '@/components/common/Sidebar';
import AIResponse from '../common/AIResponse';
import { chatApi } from '@/services/chatApi';
import { useChatContext } from '@/contexts/ChatContext';
import { RAGApiResponse } from '@/types/ragApi';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { addMessage, currentConversation } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    if (hasQueried && userQuestion.trim()) {
      setIsLoading(true);
      setError(null);
      
      // Add user message to conversation
      addMessage(userQuestion, 'user');
      
      chatApi
        .sendMessageAsync(userQuestion, currentConversation?.id)
        .then((response) => {
          // Add assistant response to conversation
          if (typeof response.response === 'string') {
            addMessage(response.response, 'assistant');
          } else {
            // For RAG responses, add with structured data
            const content = response.response.raw_response || 'AI generated response';
            addMessage(content, 'assistant', response.response as RAGApiResponse);
          }
        })
        .catch((error) => {
          setError(error.message);
          addMessage(`Error: ${error.message}`, 'assistant');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [hasQueried, userQuestion, addMessage, currentConversation?.id]);

  return (
    <Flex w="full" h="100vh" bg="gray.50">
      <Sidebar setHasQueried={setHasQueried} setUserQuestion={setUserQuestion} />
      
      {/* Main Content Area */}
      <Box h="100vh" flex={1} overflowY="scroll">
      {!hasQueried ? (
        children
      ) : (
        <AIResponse 
          isLoading={isLoading}
          error={error}
          userQuestion={userQuestion}
        />
      )}
      </Box>
    </Flex>
  );
};
