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
import TeamCriticality from '@/components/common/TeamCriticality';

export default function Home() {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [teamCriticalityView, setTeamCriticalityView] = useState(false);
  const [currentUser, setCurrentUser] = useState('employee1');
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);
  const [userQuestion, setUserQuestion] = useState<string>('');

  const handleAiResponse = (response: string, question?: string) => {
    setAiResponse(response);
    setTeamCriticalityView(false);
    setError(null); // Clear any previous errors
    setHasQueried(true); // Mark that a query has been made
    if (question) {
      setUserQuestion(question);
    }
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
      const storedUser = localStorage.getItem('username');
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (err) {
      console.warn('Failed to get current user from localStorage:', err);
    }
  }, []);

  return (
    <Flex w="full" maxH="90vh" h="90vh" bg="gray.50">
      {/* <AuthDebug />
      <ManagerTest /> */}
      <Flex w="full" h="full" gap={0}>
        {/* Chat Sidebar */}
        <Box w="40%" h="full" borderRight="1px" borderColor="gray.200">
          <DashboardChatSidebar 
            currentUser={currentUser}
            handleAiResponse={handleAiResponse}
            handleLoading={handleLoading}
            handleError={handleError}
            hasQueried={hasQueried}
            setHasQueried={setHasQueried}
            setTeamCriticalityView={setTeamCriticalityView}
            teamCriticalityView={teamCriticalityView}
          />
        </Box>
        
        {/* Profile/AI Response Section */}
        <Box w="60%" h="full" overflowY="auto">
          {teamCriticalityView ? (
            <TeamCriticality onShowGraph={(data) => {
              setGraphData(data);
              setShowGraph(true);
            }} />
          ) : !hasQueried ? (
                <Profile width="full" />
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
    </Flex>
  );
}
