'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/components/common/Profile';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole } from '@/utils/rbac';
import { Box, Spinner, Text } from '@chakra-ui/react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState('employee1');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();

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

  // Role-based redirection logic
  useEffect(() => {
    if (!isLoading && user) {
      const userRole = getUserRole(user);
      
      // If user is an Associate, redirect to team-member-view
      if (userRole === 'Associate') {
        setIsRedirecting(true);
        router.push('/team-member-view');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication or redirecting
  if (isLoading || isRedirecting) {
    return (
      <AppLayout>
        <Box 
          w="full" 
          h="full" 
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={4}
        >
          <Spinner size="xl" color="teal.500" />
          <Text fontSize="lg" color="gray.600">
            {isRedirecting ? 'Redirecting to your dashboard...' : 'Loading...'}
          </Text>
        </Box>
      </AppLayout>
    );
  }

  // For Managers, show the Profile dashboard (current behavior)
  return (
    <AppLayout>
        <Profile width="full" />
    </AppLayout>
  );
}
