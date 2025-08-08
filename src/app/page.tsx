'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { Profile } from '@/components/common/Profile';
import { AIResponse } from '@/components/common/AIResponse';
import DashboardChatSidebar from '@/components/pages/DashboardChatSidebar';
import AuthDebug from '@/components/debug/AuthDebug';
import ManagerTest from '@/components/debug/ManagerTest';

export default function Home() {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState('employee1');
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(false);

  const handleAiResponse = (response: string) => {
    setAiResponse(response);
    setError(null); // Clear any previous errors
    setHasQueried(true); // Mark that a query has been made
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setHasQueried(true); // Mark that a query has been initiated
    }
  };

  const handleError = (error: string) => {
    setError(error);
  };

  // Get current user from localStorage or authentication context
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (err) {
      console.warn('Failed to get current user from localStorage:', err);
    }
  }, []);

  return (
    <Flex w="full" maxH="90vh" h="90vh" bg="gray.50">
      {/* <AuthDebug /> */}
      <ManagerTest />
      <Flex w="full" h="full" gap={0}>
        {/* Chat Sidebar */}
        <Box w="40%" h="full" borderRight="1px" borderColor="gray.200">
          <DashboardChatSidebar 
            handleAiResponse={handleAiResponse}
            handleLoading={handleLoading}
            handleError={handleError}
          />
        </Box>
        
        {/* Profile/AI Response Section */}
        <Box w="60%" h="full" overflowY="auto">
          {!hasQueried ? (
            <Profile width="full" />
          ) : (
            <AIResponse 
              aiResponse={aiResponse}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
