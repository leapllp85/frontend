'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/components/common/Profile';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole } from '@/utils/rbac';
import { Box, Spinner, Text, Button } from '@chakra-ui/react';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ManagerWellnessDashboard } from '@/components/common/ManagerWellnessDashboard';

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
        console.log('📊 Desktop notification clicked - opening wellness dashboard modal');
        event.preventDefault();
        
        // Focus the window and set flag to open modal
        window.focus();
        localStorage.setItem('openWellnessDashboard', 'true');
        localStorage.setItem('wellnessDashboardTimestamp', Date.now().toString());
        
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

  // Listen for notification click to open wellness dashboard modal
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openWellnessDashboard' && e.newValue === 'true') {
        console.log('📊 Notification click detected - opening wellness dashboard modal');
        setShowWellnessDashboard(true);
        
        // Clear the flag after opening
        localStorage.removeItem('openWellnessDashboard');
        localStorage.removeItem('wellnessDashboardTimestamp');
      }
    };

    // Also check on mount in case the flag was set while the page was in background
    const checkExistingFlag = () => {
      const flag = localStorage.getItem('openWellnessDashboard');
      if (flag === 'true') {
        console.log('📊 Existing notification flag detected - opening wellness dashboard modal');
        setShowWellnessDashboard(true);
        localStorage.removeItem('openWellnessDashboard');
        localStorage.removeItem('wellnessDashboardTimestamp');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    checkExistingFlag();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Request notification permission and setup periodic desktop notifications
  useEffect(() => {
    if (!isLoading && user && !showLoadingScreen) {
      const userRole = getUserRole(user);
      console.log('🔔 Notification setup check - User role:', userRole);
      
      // Only for managers
      if (userRole === 'Manager') {
        console.log('✅ User is a manager, setting up notifications');
        
        // Check if notifications are supported
        if (!('Notification' in window)) {
          console.error('❌ This browser does not support desktop notifications');
          return;
        }
        
        console.log('🔔 Current notification permission:', Notification.permission);
        
        // Request notification permission
        if (Notification.permission === 'default') {
          console.log('🔔 Requesting notification permission...');
          Notification.requestPermission().then(permission => {
            console.log('✅ Notification permission result:', permission);
            if (permission === 'granted') {
              console.log('🎉 Permission granted, notifications will work!');
            } else if (permission === 'denied') {
              console.error('❌ Permission denied. Please enable notifications in browser settings.');
              alert('Notification permission was denied. Please enable notifications in your browser settings to receive wellness alerts.');
            }
          });
        }
        
        // Setup periodic notifications if permission granted
        if (Notification.permission === 'granted') {
          console.log('🔔 Starting periodic desktop notification system (every 5 minutes)');
          
          const showDesktopNotification = () => {
            console.log('⏰ Desktop notification triggered at:', new Date().toLocaleTimeString());
            
            try {
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
              
              console.log('✅ Notification created successfully');
              
              // Handle notification click
              notification.onclick = (event) => {
                console.log('📊 Desktop notification clicked - opening wellness dashboard modal');
                event.preventDefault();
                
                // Focus the window and set flag to open modal
                window.focus();
                localStorage.setItem('openWellnessDashboard', 'true');
                localStorage.setItem('wellnessDashboardTimestamp', Date.now().toString());
                
                notification.close();
              };
              
              // Auto-close after 10 seconds
              setTimeout(() => {
                notification.close();
              }, 10000);
            } catch (error) {
              console.error('❌ Error creating notification:', error);
            }
          };
          
          // Show first notification after 2 seconds (for easier testing)
          console.log('⏱️  First notification will show in 2 seconds...');
          const initialTimer = setTimeout(showDesktopNotification, 2000);
          
          // Then show every 5 minutes (300000ms)
          const interval = setInterval(showDesktopNotification, 300000);
          
          // Cleanup on unmount
          return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
            console.log('🔕 Stopped periodic desktop notification system');
          };
        } else if (Notification.permission === 'denied') {
          console.warn('⚠️ Notification permission denied. Desktop notifications will not work.');
          alert('Notifications are blocked. Please enable them in your browser settings to receive wellness alerts.');
        }
      } else {
        console.log('❌ User is not a manager, skipping notification setup');
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
            <Box position="fixed" bottom={4} right={4} zIndex={1000} display="flex" flexDirection="column" gap={2}>
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
            </Box>
            
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
