'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Sidebar } from '@/components/common/Sidebar';
import AIResponse from '../common/AIResponse';
import { chatApi } from '@/services/chatApi';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    if (hasQueried && userQuestion.trim()) {
      setIsLoading(true);
      setError(null); // Clear previous errors
      
      chatApi
        .sendMessage(userQuestion)
        .then((response) => {
          setAiResponse(response.response);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [hasQueried, userQuestion]);

  return (
    <Flex w="full" h="full" bg="gray.50">
      <Sidebar setHasQueried={setHasQueried} setUserQuestion={setUserQuestion} />
      
      {/* Main Content Area */}
      <Box h="100vh" flex={1} overflowY="scroll">
      {!hasQueried ? (
        children
      ) : (
        <AIResponse 
          aiResponse={aiResponse}
          isLoading={isLoading}
          error={error}
          userQuestion={userQuestion}
        />
      )}
      </Box>
    </Flex>
  );
};
