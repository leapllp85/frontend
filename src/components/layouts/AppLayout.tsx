'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Sidebar } from '@/components/common/Sidebar';
import AIResponse from '../common/AIResponse';
import { useChatContext } from '@/contexts/ChatContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    sendMessage, 
    sendMessageAsync, 
    sendMessageStreaming, 
    currentConversation, 
    isLoading, 
    progress, 
    progressMessage, 
    activeTasks, 
    cancelActiveTask, 
    cancelAllTasks 
  } = useChatContext();
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(false);
  const [currentUserQuestion, setCurrentUserQuestion] = useState<string>('');
  const [sendMode, setSendMode] = useState<'sync' | 'async' | 'streaming'>('async');
  
  // Track the last processed question to prevent duplicates
  const lastProcessedQuestionRef = useRef<string>('');
  const isProcessingRef = useRef<boolean>(false);

  const handleSendMessage = useCallback(async (question: string, mode?: 'sync' | 'async' | 'streaming') => {
    // Only prevent if currently loading or empty question
    if (!question.trim() || isLoading) {
      return;
    }

    // Only set current question if this is the first query or we're starting fresh
    if (!hasQueried) {
      setCurrentUserQuestion(question);
      setHasQueried(true);
    }
    
    setError(null);

    const actualMode = mode || sendMode;

    try {
      // Use the appropriate send method based on mode
      if (actualMode === 'async') {
        await sendMessageAsync(question);
      } else if (actualMode === 'streaming') {
        await sendMessageStreaming(question);
      } else {
        await sendMessage(question);
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError(error.message || 'Failed to send message');
    }
  }, [sendMessage, sendMessageAsync, sendMessageStreaming, sendMode, isLoading, hasQueried]);

  const resetView = useCallback(() => {
    setHasQueried(false);
    setCurrentUserQuestion('');
    setError(null);
    lastProcessedQuestionRef.current = '';
    isProcessingRef.current = false;
  }, []);

  return (
    <Flex w="full" h="100vh" bg="gray.50">
      <Sidebar 
        onSendMessage={(message) => handleSendMessage(message)}
        onResetView={resetView}
        disabled={false}
        enableAsync={true}
        enableStreaming={true}
      />
      
      {/* Main Content Area */}
      <Box 
        h="100vh" 
        w="80%"
        overflowY="auto"
        position="relative"
      >
        {!hasQueried ? 
            children
        : (
            <AIResponse 
              isLoading={isLoading}
              error={error}
              userQuestion={currentUserQuestion}
              onRetry={() => handleSendMessage(currentUserQuestion)}
              onReset={resetView}
            />
        )}
      </Box>
    </Flex>
  );
};