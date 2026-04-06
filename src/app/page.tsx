'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole } from '@/utils/rbac';
import { Box, Spinner, Text, Button } from '@chakra-ui/react';
import { LoadingScreen } from '@/components/common/LoadingScreen';

// Lazy load heavy components
const Profile = dynamic(() => import('@/components/common/Profile').then(mod => ({ default: mod.Profile })), {
  loading: () => <LoadingScreen />,
  ssr: false,
});

const ManagerWellnessDashboard = dynamic(() => import('@/components/common/ManagerWellnessDashboard').then(mod => ({ default: mod.ManagerWellnessDashboard })), {
  loading: () => <Box p={4}><Spinner size="lg" /></Box>,
  ssr: false,
});

export default function Home() {
  const [currentUser, setCurrentUser] = useState('employee1');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showWellnessDashboard, setShowWellnessDashboard] = useState(false);
  const showWellnessDashboardRef = useRef(setShowWellnessDashboard);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Keep ref updated
  useEffect(() => {
    showWellnessDashboardRef.current = setShowWellnessDashboard;
  }, []);

  // Manual trigger function for testing
  const triggerNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('🔔 Manual notification trigger');
      
      const notification = new Notification('Team Wellness Dashboard', {
        body: 'Check your team\'s wellness metrics and identify members who may need support.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'wellness-dashboard',
        requireInteraction: false,
        silent: false
      });
      
      notification.onclick = (event) => {
        console.log('📊 Desktop notification clicked - opening wellness dashboard in popup window');
        event.preventDefault();
        
        // Open wellness dashboard in popup window with modal-like dimensions
        const width = 1200;
        const height = 800;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        window.open(
          '/wellness-dashboard',
          'wellnessDashboard',
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
        
        notification.close();
      };
      
      setTimeout(() => notification.close(), 10000);
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          triggerNotification();
        }
      });
    } else {
      alert('Notifications are blocked. Please enable them in your browser settings.');
    }
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

  // Show loading screen after authentication
  useEffect(() => {
    if (!isLoading && user) {
      setShowLoadingScreen(true);
      
      // Show loading screen for 2 seconds
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading]);

  // Show wellness dashboard modal for managers on first daily login
  useEffect(() => {
    console.log('=== Wellness Dashboard Effect ===');
    console.log('isLoading:', isLoading);
    console.log('user:', user);
    console.log('showLoadingScreen:', showLoadingScreen);
    
    if (!isLoading && user && !showLoadingScreen) {
      console.log('Conditions met, checking user role...');
      
      // Check if user is a manager
      const userRole = getUserRole(user);
      console.log('User role:', userRole);
      
      if (userRole === 'Manager') {
        // TEMPORARY: Clear localStorage for testing - remove this line after testing
        localStorage.removeItem('managerWellnessDashboardShown');
        
        const hasSeenDashboardToday = localStorage.getItem('managerWellnessDashboardShown');
        const today = new Date().toDateString();
        console.log('Dashboard shown today?', hasSeenDashboardToday);
        console.log('Today:', today);
        console.log('Comparison:', hasSeenDashboardToday, '!==', today, '=', hasSeenDashboardToday !== today);
        
        if (hasSeenDashboardToday !== today) {
          console.log('✅ Will show dashboard modal in 1 second...');
          setTimeout(() => {
            console.log('🚀 SHOWING DASHBOARD MODAL NOW');
            console.log('Setting showWellnessDashboard to true');
            setShowWellnessDashboard(true);
          }, 1000);
        } else {
          console.log('❌ Dashboard already shown today');
        }
      } else {
        console.log('❌ User is not a manager, skipping dashboard');
      }
    } else {
      console.log('Conditions not met yet');
    }
  }, [isLoading, user, showLoadingScreen]);

  // Role-based redirection logic
  useEffect(() => {
    if (!isLoading && user && !showLoadingScreen) {
      const userRole = getUserRole(user);
      
      // If user is an Associate, redirect to team-member-view
      if (userRole === 'Associate') {
        setIsRedirecting(true);
        router.push('/team-member-view');
        return;
      }
    }
  }, [user, isLoading, showLoadingScreen, router]);

  // Request notification permission and setup periodic desktop notifications
  useEffect(() => {
    if (!isLoading && user && !showLoadingScreen) {
      const userRole = getUserRole(user);
      
      // Only for managers
      if (userRole === 'Manager') {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          console.log('🔔 Requesting notification permission...');
          Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
          });
        }
        
        // Setup periodic notifications if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          console.log('🔔 Starting periodic desktop notification system (every 5 minutes)');
          
          const showDesktopNotification = () => {
            console.log('⏰ 5-minute desktop notification triggered');
            
            const notification = new Notification('Team Wellness Dashboard', {
              body: 'Check your team\'s wellness metrics and identify members who may need support.',
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: 'wellness-dashboard',
              requireInteraction: false,
              silent: false,
              data: {
                action: 'open-wellness-dashboard',
                timestamp: Date.now()
              }
            });
            
            // Handle notification click
            notification.onclick = (event) => {
              console.log('📊 Desktop notification clicked - opening wellness dashboard in popup window');
              event.preventDefault();
              
              // Open wellness dashboard in popup window with modal-like dimensions
              const width = 1200;
              const height = 800;
              const left = (screen.width - width) / 2;
              const top = (screen.height - height) / 2;
              
              window.open(
                '/wellness-dashboard',
                'wellnessDashboard',
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
              );
              
              notification.close();
            };
            
            // Auto-close after 10 seconds
            setTimeout(() => {
              notification.close();
            }, 10000);
          };
          
          // Show first notification after 5 seconds (for testing)
          const initialTimer = setTimeout(showDesktopNotification, 5000);
          
          // Then show every 5 minutes (300000ms)
          const interval = setInterval(showDesktopNotification, 300000);
          
          // Cleanup on unmount
          return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
            console.log('🔕 Stopped periodic desktop notification system');
          };
        } else if ('Notification' in window && Notification.permission === 'denied') {
          console.warn('⚠️ Notification permission denied. Desktop notifications will not work.');
        }
      }
    }
  }, [user, isLoading, showLoadingScreen]);

  // Show animated loading screen after login
  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

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
    <>
      <AppLayout>
          <Box position="relative">
            {/* Test Buttons - Remove after testing */}
            {/* <Box position="fixed" bottom={4} right={4} zIndex={1000} display="flex" flexDirection="column" gap={2}>
              <Button
                onClick={() => {
                  console.log('Manual trigger - showWellnessDashboard:', !showWellnessDashboard);
                  setShowWellnessDashboard(!showWellnessDashboard);
                }}
                bg="purple.500"
                color="white"
                size="lg"
                _hover={{ bg: 'purple.600' }}
              >
                {showWellnessDashboard ? 'Hide' : 'Show'} Wellness Dashboard
              </Button>
              
              <Button
                onClick={triggerNotification}
                bg="blue.500"
                color="white"
                size="lg"
                _hover={{ bg: 'blue.600' }}
              >
                🔔 Test Notification
              </Button>
            </Box> */}
            
            <Profile width="full" />
          </Box>
      </AppLayout>

      {/* Manager Wellness Dashboard Modal */}
      {console.log('Rendering ManagerWellnessDashboard with isOpen:', showWellnessDashboard)}
      <ManagerWellnessDashboard
        isOpen={showWellnessDashboard}
        onClose={() => {
          console.log('🔴 Closing wellness dashboard');
          setShowWellnessDashboard(false);
          // Mark as shown for today only after user closes it
          const today = new Date().toDateString();
          localStorage.setItem('managerWellnessDashboardShown', today);
          console.log('Dashboard marked as shown for today:', today);
        }}
      />
    </>
  );
}
