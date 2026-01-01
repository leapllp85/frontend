'use client';

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Button, Input, Badge, SimpleGrid, Heading, IconButton } from "@chakra-ui/react";
import { Home, Users, FolderOpen, FileText, CheckCircle, LogOut, Send, Edit2, Bot, Network, ClipboardList, UserSearch, BookOpen, TrendingUp, Clock, BarChart3, Target, Heart, Brain, Sparkles, Video, MessageCircle, UserCircle } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from "@/lib/apis/auth";
import { useChatContext } from '@/contexts/ChatContext';
import { userApi } from "@/services";
import { UserProfile } from "../../services/userApi";
import { getUserRole } from '@/utils/rbac';

type ProfileData = UserProfile;

interface SidebarProps {
  onSendMessage?: (message: string) => Promise<void>;
  onResetView?: () => void;
  disabled?: boolean;
  enableAsync?: boolean;
  enableStreaming?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onSendMessage, 
  onResetView,
  disabled = false,
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAssociateInsightsOpen, setIsAssociateInsightsOpen] = useState(false);
  const [isTeamSummaryOpen, setIsTeamSummaryOpen] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState<any>(null);
  const [isEngagementDetailOpen, setIsEngagementDetailOpen] = useState(false);
  
  const {
    sendMessageAsync,
    isLoading,
  } = useChatContext();

  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Get role-specific home route
  const getHomeRoute = () => {
    if (!user) return "/";
    const userRole = getUserRole(user);
    return userRole === 'Associate' ? "/team-member-view" : "/";
  };

  const allNavigationItems = [
    { icon: Home, label: "Home", href: getHomeRoute(), roles: ['Manager', 'Associate'] },
    { icon: Users, label: "My Team", href: "/teams", roles: ['Manager'] },
    { icon: Network, label: "Organization", href: "/organization", roles: ['Manager'] },
    { icon: FolderOpen, label: "Projects", href: "/projects", roles: ['Manager', 'Associate'] },
    { icon: BarChart3, label: "Survey", href: "/manager-dashboard", roles: ['Manager'] },
    { icon: FileText, label: "Surveys", href: "/surveys", roles: ['Associate'] },
    { icon: ClipboardList, label: "Survey Responses", href: "/survey-responses", roles: ['Associate'] },
    { icon: CheckCircle, label: "Action Items", href: "/action-items", roles: ['Associate'] },
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => {
    if (!user) return true; // Show all items if no user (fallback)
    const userRole = getUserRole(user);
    return item.roles.includes(userRole);
  });

  const handleSendMessage = useCallback(async () => {
    const message = chatMessage.trim();
    if (!message || isLoading || disabled) return;

    setChatMessage("");
    
    try {
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        await sendMessageAsync(message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [chatMessage, onSendMessage, sendMessageAsync, isLoading, disabled]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const fetchUserProfile = async () => {
    try {
      const data = await userApi.getCurrentUserProfile();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const { logout: authLogout } = useAuth();
  
  const handleLogout = useCallback(() => {
    logout();
    authLogout();
  }, [authLogout]);

  const handleNavClick = useCallback(() => {
    if (onResetView) {
      onResetView();
    }
  }, [onResetView]);

  const handleChatbotClick = useCallback(() => {
    router.push('/chat');
  }, [router]);

  useEffect(() => {
    setMounted(true);
    fetchUserProfile();
  }, []);
  
  return (
    <VStack 
      w="230px"
      h="100vh" 
      bg="linear-gradient(180deg, rgba(248, 249, 250, 0.95) 0%, rgba(233, 236, 239, 0.95) 100%)"
      backdropFilter="blur(10px)"
      overflow="hidden"
      flexDirection="column" 
      justify="space-between"
      p={4}
      gap={4}
      borderRight="1px solid"
      borderColor="gray.300"
      shadow="2xl"
      position="relative"
      zIndex={100}
      css={{
        boxShadow: '8px 0 30px rgba(0, 0, 0, 0.15), 4px 0 50px rgba(0, 0, 0, 0.1), 0 0 60px rgba(0, 0, 0, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,  
          right: 0,
          bottom: 0,
          background: 'aliceblue',
            //background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
          pointerEvents: 'none',
          zIndex: -1
        }
      }}
    >
      {/* Top Section */}
      <VStack w="full" gap={2} align="center">
       
        {/* Manager Profile Picture */}
        <VStack gap={1.5} align="center" w="full">
          <Box
            w="150px"
            h="150px"
            borderRadius="xl"
            overflow="hidden"
            border="2px solid"
            borderColor="white"
            shadow="xl"
            cursor="pointer"
            _hover={{ transform: "scale(1.05)", shadow: "2xl" }}
            transition="all 0.3s"
            position="relative"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces"
              alt="Manager Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="white"
              fontSize="3xl"
              fontWeight="bold"
              display="none"
              _groupHover={{ display: 'flex' }}
            >
              {profileData?.user?.first_name?.charAt(0).toUpperCase() || 'M'}
              {profileData?.user?.last_name?.charAt(0).toUpperCase() || 'D'}
            </Box>
          </Box>
          <VStack gap={0} align="center" mb={4}>
            <Text fontSize="sm" color="gray.800" fontWeight="bold" textAlign="center" lineHeight="1.2">
              {profileData?.user?.first_name || 'Joe'}
            </Text>
            <Text fontSize="sm" color="gray.800" fontWeight="bold" textAlign="center" lineHeight="1.2">
              {profileData?.user?.last_name || 'Right'}
            </Text>
          </VStack>
        </VStack>

        {/* Navigation */}
        <VStack gap={1.5} align="center" w="full" flex={1} justify="center" py={4}>
          {/* My Space - Only for Managers (First Option) */}
          {user && getUserRole(user) === 'Manager' && (
            <Link href="/my-space" style={{ width: '100%' }}>
              <VStack gap={0.5} align="center" w="full">
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="xl"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  _hover={{ 
                    bg: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                    transform: "translateY(-2px)"
                  }}
                  cursor="pointer"
                  transition="all 0.2s"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 2px 8px rgba(102, 126, 234, 0.3)"
                >
                  <UserCircle 
                    size={22} 
                    color="white"
                    strokeWidth={2}
                  />
                </Box>
                <Text 
                  fontSize="10px" 
                  color="purple.600" 
                  textAlign="center" 
                  fontWeight="600"
                  lineHeight="1.2"
                  maxW="60px"
                >
                  My Space
                </Text>
              </VStack>
            </Link>
          )}
          
          {/* Divider after My Space for Managers */}
          {user && getUserRole(user) === 'Manager' && (
            <Box w="40px" h="1px" bg="gray.300" my={1} />
          )}
          
          {navigationItems.map((item) => {
            const Icon = item.icon;
            // Handle home route active state for both Manager and Associate
            const isActive = item.label === "Home" 
              ? (pathname === "/" || pathname === "/team-member-view")
              : pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick} style={{ width: '100%' }}>
                <VStack gap={0.5} align="center" w="full">
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="xl"
                    bg={isActive ? "blue.500" : "transparent"}
                    _hover={{ 
                      bg: isActive ? "blue.600" : "gray.200",
                      transform: "translateY(-2px)"
                    }}
                    cursor="pointer"
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={isActive ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none"}
                  >
                    <Icon 
                      size={22} 
                      color={isActive ? "white" : "#6B7280"}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </Box>
                  <Text 
                    fontSize="10px" 
                    color={isActive ? "blue.600" : "gray.600"} 
                    textAlign="center" 
                    fontWeight={isActive ? "700" : "500"}
                    lineHeight="1.2"
                    maxW="60px"
                  >
                    {item.label}
                  </Text>
                </VStack>
              </Link>
            );
          })}
          
          {/* Logout */}
          <VStack gap={0.5} align="center" w="full">
            <Box
              w="48px"
              h="48px"
              borderRadius="xl"
              bg="transparent"
              _hover={{ 
                bg: "red.50",
                transform: "translateY(-2px)"
              }}
              cursor="pointer"
              transition="all 0.2s"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={handleLogout}
            >
              <LogOut 
                size={22} 
                color="#DC2626"
                strokeWidth={2}
              />
            </Box>
            <Text 
              fontSize="10px" 
              color="red.600" 
              textAlign="center" 
              fontWeight="600"
              lineHeight="1.2"
              maxW="60px"
            >
              Logout
            </Text>
          </VStack>
          
          {/* Associate Insights - Only for Managers */}
         {/*  {user && getUserRole(user) === 'Manager' && (
            <VStack gap={1} align="center">
              <Box
                px={3}
                py={2.5}
                borderRadius="lg"
                bg="transparent"
                _hover={{ 
                  bg: "gray.300",
                  transform: "scale(1.05)"
                }}
                cursor="pointer"
                transition="all 0.2s"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => setIsAssociateInsightsOpen(true)}
              >
                <UserSearch 
                  size={22} 
                  color="#4B5563"
                />
              </Box>
              <Text fontSize="10px" color="gray.700" textAlign="center" fontWeight="medium">
                Insights
              </Text>
            </VStack>
          )} */}
          
          {/* Team Summary - Only for Managers */}
        {/*   {user && getUserRole(user) === 'Manager' && (
            <VStack gap={1} align="center">
              <Box
                px={3}
                py={2.5}
                borderRadius="lg"
                bg="transparent"
                _hover={{ 
                  bg: "gray.300",
                  transform: "scale(1.05)"
                }}
                cursor="pointer"
                transition="all 0.2s"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => setIsTeamSummaryOpen(true)}
              >
                <BarChart3 
                  size={22} 
                  color="#4B5563"
                />
              </Box>
              <Text fontSize="10px" color="gray.700" textAlign="center" fontWeight="medium">
                Summary
              </Text>
            </VStack>
          )} */}
        </VStack>
      </VStack>

      {/* Bottom Section - Empty for now */}

      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideUpModal {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          @keyframes chatbotFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes chatbotPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
          @keyframes chatbotGlow {
            0%, 100% { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 1), 0 0 60px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3); }
          }
          @keyframes chatbotBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-5px) scale(1.1); }
          }
          @keyframes chatbotPing {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          @keyframes chatbotShimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          .chatbot-float {
            animation: chatbotFloat 3s ease-in-out infinite !important;
          }
          .chatbot-pulse {
            animation: chatbotPulse 2s ease-in-out infinite !important;
          }
          .chatbot-glow {
            animation: chatbotGlow 2s ease-in-out infinite !important;
          }
          .chatbot-bounce {
            animation: chatbotBounce 2s ease-in-out infinite !important;
          }
          .chatbot-ping {
            animation: chatbotPing 2s cubic-bezier(0, 0, 0.2, 1) infinite !important;
          }
          .chatbot-shimmer::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: chatbotShimmer 3s ease-in-out infinite !important;
          }
        `
      }} />

      {/* Fancy Animated Chatbot Overlay */}
      <Box
        position="fixed"
        bottom="20px"
        left="20px"
        zIndex={1000}
        cursor="pointer"
        _hover={{ transform: "scale(1.1)" }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        className="chatbot-float"
        onClick={handleChatbotClick}
      >
        {/* Outer Glow Ring */}
        <Box
          position="absolute"
          top="-8px"
          left="-8px"
          w="80px"
          h="80px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)"
          className="chatbot-pulse"
        />
        
        {/* Main Chatbot Button */}
        <Box
          w="64px"
          h="64px"
          borderRadius="full"
          bg="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.4)"
          position="relative"
          overflow="hidden"
          className="chatbot-glow chatbot-shimmer"
        >
          <Box className="chatbot-bounce">
            <Bot 
              size={28} 
              color="white" 
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
              }}
            />
          </Box>
        </Box>

        {/* Notification Dot */}
        <Box
          position="absolute"
          top="8px"
          right="8px"
          w="16px"
          h="16px"
          borderRadius="full"
          bg="linear-gradient(135deg, #ef4444 0%, #f97316 100%)"
          border="2px solid white"
          className="chatbot-ping"
        />

        {/* Tooltip */}
        <Box
          position="absolute"
          bottom="75px"
          left="50%"
          transform="translateX(-50%)"
          bg="rgba(0, 0, 0, 0.8)"
          color="white"
          px={3}
          py={2}
          borderRadius="lg"
          fontSize="sm"
          fontWeight="medium"
          whiteSpace="nowrap"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.3s"
          _after={{
            content: '""',
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            border: "6px solid transparent",
            borderTopColor: "rgba(0, 0, 0, 0.8)"
          }}
        >
          Chat with Clyra AI
        </Box>
      </Box>

      {/* AI Assistant - Bottom Section */}
      <Box w="full" p={3} px={2} bg= 'circular-gradient(135deg,rgb(27, 93, 105) 0%,rgb(20, 71, 80)) 50%, #1a525c 100%)'>
        <VStack  w="full" gap={2} p={2} align="stretch">
          {/* <HStack gap={3}>
            <Bot size={15} color="gray" />
            {/* <Text fontSize="md" color="gray" fontWeight="semi-bold">
              Clyra AI
            </Text> */}
          {/* </HStack>  */}
          
          {/* <Text fontSize="sm" color="whiteAlpha.800" lineHeight="1.4">
            Ask me anything about your projects, action items, or team insights!
          </Text> */}
          
          {/* Chat Input */}
          <HStack gap={3}>
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything..."
              bg="whiteAlpha.200"
              border="none"
              color="black"
              _placeholder={{ color: "whiteAlpha.600" }}
              _focus={{ 
                bg: "whiteAlpha.300",
                outline: "none"
              }}
              size="sm"
              fontSize="xs"
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading}
              h="32px"
            />
            <Button
              size="sm"
              bg="whiteAlpha.300"
              color="gray"
              _hover={{ bg: "whiteAlpha.400" }}
              onClick={handleSendMessage}
              disabled={disabled || isLoading || !chatMessage.trim()}
              minW="auto"
              px={2.5}
              h="32px"
            >
              <Send size={14} />
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Associate Insights Modal */}
      {isAssociateInsightsOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.7)"
          backdropFilter="blur(10px)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsAssociateInsightsOpen(false)}
          animation="fadeIn 0.2s ease-out"
        >
          <Box
            bg="white"
            borderRadius="3xl"
            maxW="1200px"
            w="95%"
            maxH="90vh"
            overflow="hidden"
            onClick={(e) => e.stopPropagation()}
            boxShadow="0 30px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.05)"
            animation="slideUpModal 0.3s ease-out"
          >
            {/* Modal Header */}
            <Box
              p={6}
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                    <UserSearch size={24} color="white" />
                  </Box>
                  <Heading size="lg" color="white" fontWeight="600">
                    Individual Associate Summaries
                  </Heading>
                </HStack>
                <IconButton
                  onClick={() => setIsAssociateInsightsOpen(false)}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  size="sm"
                  aria-label="Close"
                >
                  ✕
                </IconButton>
              </HStack>
            </Box>

            {/* Modal Body */}
            <Box 
              p={6} 
              overflowY="auto" 
              maxH="calc(90vh - 100px)"
              bg="gray.50"
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                },
              }}
            >
              <VStack gap={5} align="stretch">
                <Box 
                  p={4} 
                  bg="white" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="blue.100"
                  boxShadow="sm"
                >
                  <HStack justify="space-between" align="center">
                    <HStack gap={2}>
                      <Box 
                        p={2} 
                        bg="blue.100" 
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <UserSearch size={18} color="#3b82f6" />
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text fontSize="md" fontWeight="600" color="gray.800">
                          Team Member Insights
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Comprehensive overview of skill development and well-being
                        </Text>
                      </VStack>
                    </HStack>
                    
                    {/* Color Legend */}
                    <HStack gap={3} display={{ base: "none", md: "flex" }}>
                      <HStack gap={1.5}>
                        <Box 
                          w="20px" 
                          h="20px" 
                          bg="rgba(254, 226, 226, 1)" 
                          borderRadius="md"
                          border="1px solid"
                          borderColor="rgba(254, 202, 202, 1)"
                        />
                        <Text fontSize="xs" color="gray.700" fontWeight="600">High</Text>
                      </HStack>
                      <HStack gap={1.5}>
                        <Box 
                          w="20px" 
                          h="20px" 
                          bg="rgba(255, 237, 213, 1)" 
                          borderRadius="md"
                          border="1px solid"
                          borderColor="rgba(253, 186, 116, 1)"
                        />
                        <Text fontSize="xs" color="gray.700" fontWeight="600">Medium</Text>
                      </HStack>
                      <HStack gap={1.5}>
                        <Box 
                          w="20px" 
                          h="20px" 
                          bg="rgba(220, 252, 231, 1)" 
                          borderRadius="md"
                          border="1px solid"
                          borderColor="rgba(187, 247, 208, 1)"
                        />
                        <Text fontSize="xs" color="gray.700" fontWeight="600">Low</Text>
                      </HStack>
                    </HStack>
                  </HStack>
                </Box>
                
                {/* Detailed Associates List */}
                {[
                  { 
                    name: 'John Doe', 
                    skillGap: 'High', 
                    skillGapDesc: 'Needs advanced React patterns and TypeScript',
                    mentalHealth: 'High risk',
                    mentalHealthDesc: 'Schedule immediate 1-on-1, high workload',
                    learningPlan: ['Advanced React Patterns', 'TypeScript Deep Dive', 'System Design Basics'],
                    progress: [65, 40, 20],
                    overallProgress: 42
                  },
                  { 
                    name: 'Jane Smith', 
                    skillGap: 'Medium', 
                    skillGapDesc: 'System Design and Cloud Architecture focus needed',
                    mentalHealth: 'Good',
                    mentalHealthDesc: 'Stable, good work-life balance',
                    learningPlan: ['System Design Fundamentals', 'AWS Solutions Architect', 'Microservices Architecture'],
                    progress: [80, 55, 30],
                    overallProgress: 55
                  },
                  { 
                    name: 'Mike Johnson', 
                    skillGap: 'Low', 
                    skillGapDesc: 'On track with current skill development',
                    mentalHealth: 'Medium',
                    mentalHealthDesc: 'Monitor workload, recent project stress',
                    learningPlan: ['Advanced Kubernetes', 'DevOps Best Practices', 'Performance Optimization'],
                    progress: [90, 75, 60],
                    overallProgress: 75
                  },
                  { 
                    name: 'Sarah Williams', 
                    skillGap: 'Low', 
                    skillGapDesc: 'Exceeding expectations, mentor potential',
                    mentalHealth: 'Good',
                    mentalHealthDesc: 'Excellent well-being, team motivator',
                    learningPlan: ['Leadership Skills', 'Technical Mentoring', 'Architecture Patterns'],
                    progress: [85, 70, 95],
                    overallProgress: 83
                  },
                  { 
                    name: 'David Brown', 
                    skillGap: 'Medium', 
                    skillGapDesc: 'Backend optimization and database skills needed',
                    mentalHealth: 'Good',
                    mentalHealthDesc: 'Stable, engaged with team activities',
                    learningPlan: ['Database Performance Tuning', 'Node.js Advanced', 'API Design Patterns'],
                    progress: [70, 60, 45],
                    overallProgress: 58
                  }
                ].map((associate, idx) => (
                  <Box
                    key={idx}
                    p={6}
                    bg="white"
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor="gray.200"
                    cursor="pointer"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ 
                      borderColor: "purple.400", 
                      shadow: "xl", 
                      transform: "translateY(-4px) scale(1.01)",
                      bg: "purple.50"
                    }}
                    position="relative"
                    overflow="visible"
                    boxShadow="sm"
                  >
                    {/* Header Section */}
                    <HStack justify="space-between" mb={4}>
                      <HStack gap={3}>
                        <Box
                          w="56px"
                          h="56px"
                          borderRadius="full"
                          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontWeight="bold"
                          fontSize="xl"
                          boxShadow="0 4px 12px rgba(102, 126, 234, 0.4)"
                          transition="all 0.3s"
                          _hover={{
                            transform: "scale(1.1) rotate(5deg)",
                            boxShadow: "0 6px 16px rgba(102, 126, 234, 0.6)"
                          }}
                        >
                          {associate.name.charAt(0)}
                        </Box>
                        <VStack align="start" gap={1}>
                          <Text fontWeight="700" fontSize="lg" color="gray.800">{associate.name}</Text>
                          <HStack gap={2}>
                            <Text fontSize="xs" color="gray.500">{associate.name.toLowerCase().replace(' ', '.')}@company.com</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                      <VStack align="end" gap={1}>
                        <Badge
                          bg={
                            associate.skillGap === 'High' ? 'rgba(254, 226, 226, 1)' :
                            associate.skillGap === 'Medium' ? 'rgba(255, 237, 213, 1)' :
                            'rgba(220, 252, 231, 1)'
                          }
                          color={
                            associate.skillGap === 'High' ? 'rgba(185, 28, 28, 1)' :
                            associate.skillGap === 'Medium' ? 'rgba(194, 65, 12, 1)' :
                            'rgba(21, 128, 61, 1)'
                          }
                          fontSize="sm"
                          px={4}
                          py={1.5}
                          borderRadius="full"
                          fontWeight="600"
                          boxShadow="sm"
                          border="1px solid"
                          borderColor={
                            associate.skillGap === 'High' ? 'rgba(254, 202, 202, 1)' :
                            associate.skillGap === 'Medium' ? 'rgba(253, 186, 116, 1)' :
                            'rgba(187, 247, 208, 1)'
                          }
                        >
                          {associate.skillGap} Skill Gap
                        </Badge>
                        <Text fontSize="xs" color="gray.500" fontWeight="500">
                          Overall: {associate.overallProgress}%
                        </Text>
                      </VStack>
                    </HStack>

                    {/* Summary Section */}
                    <SimpleGrid columns={2} gap={3} mb={4}>
                      <Box p={3} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                        <HStack gap={2} mb={1}>
                          <BookOpen size={16} color="#2563eb" />
                          <Text fontSize="xs" fontWeight="600" color="blue.800">Skill Gap Analysis</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.700">{associate.skillGapDesc}</Text>
                      </Box>
                      <Box 
                        p={3} 
                        bg="pink.50" 
                        borderRadius="lg" 
                        border="1px solid" 
                        borderColor="pink.200"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ bg: "pink.100", borderColor: "pink.300", transform: "translateY(-2px)", shadow: "md" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssociate(associate);
                          setIsEngagementDetailOpen(true);
                        }}
                      >
                        <HStack gap={2} mb={1}>
                          <TrendingUp size={16} color="#ec4899" />
                          <Text fontSize="xs" fontWeight="600" color="pink.800">Mental Health Status</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.700" mb={2}>{associate.mentalHealthDesc}</Text>
                        
                        {/* Wellness Engagement Summary */}
                        <Box mt={2} pt={2} borderTop="1px solid" borderColor="pink.200">
                          <Text fontSize="2xs" fontWeight="600" color="gray.600" mb={1}>Wellness Engagement (Last 30 days) - Click for details</Text>
                          <HStack gap={3} justify="space-between">
                            <HStack gap={1}>
                              <BookOpen size={12} color="#dd6b20" />
                              <Text fontSize="xs" fontWeight="600" color="gray.700">{Math.floor(Math.random() * 15) + 8}</Text>
                              <Text fontSize="2xs" color="gray.600">articles</Text>
                            </HStack>
                            <HStack gap={1}>
                              <Video size={12} color="#9333ea" />
                              <Text fontSize="xs" fontWeight="600" color="gray.700">{Math.floor(Math.random() * 10) + 4}</Text>
                              <Text fontSize="2xs" color="gray.600">videos</Text>
                            </HStack>
                            <HStack gap={1}>
                              <MessageCircle size={12} color="#3b82f6" />
                              <Text fontSize="xs" fontWeight="600" color="gray.700">{Math.floor(Math.random() * 5) + 2}</Text>
                              <Text fontSize="2xs" color="gray.600">chats</Text>
                            </HStack>
                          </HStack>
                        </Box>
                      </Box>
                    </SimpleGrid>

                    {/* Learning Plan Section */}
                    <Box p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
                      <HStack gap={2} mb={3}>
                        <CheckCircle size={18} color="#9333ea" />
                        <Heading size="sm" color="purple.900" fontWeight="600">
                          Recommended Learning Plan
                        </Heading>
                      </HStack>
                      
                      <VStack gap={3} align="stretch">
                        {associate.learningPlan.map((course, courseIdx) => (
                          <Box key={courseIdx}>
                            <HStack justify="space-between" mb={1}>
                              <HStack gap={2}>
                                <Clock size={14} color="#6b7280" />
                                <Text fontSize="sm" fontWeight="500" color="gray.800">{course}</Text>
                              </HStack>
                              <Text fontSize="xs" fontWeight="600" color="purple.600">
                                {associate.progress[courseIdx]}%
                              </Text>
                            </HStack>
                            <Box 
                              w="full" 
                              h="8px" 
                              bg="gray.200" 
                              borderRadius="full" 
                              overflow="hidden"
                              position="relative"
                            >
                              <Box 
                                w={`${associate.progress[courseIdx]}%`} 
                                h="full" 
                                bg={
                                  associate.progress[courseIdx] >= 80 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' :
                                  associate.progress[courseIdx] >= 50 ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' :
                                  'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                                }
                                transition="width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                                position="relative"
                                _after={{
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  bg: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                  animation: "shimmer 2s infinite"
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </VStack>

                      {/* Overall Progress */}
                      <Box mt={4} pt={3} borderTop="1px solid" borderColor="purple.200">
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="600" color="gray.800">Overall Learning Progress</Text>
                          <Badge 
                            colorScheme={
                              associate.overallProgress >= 70 ? 'green' :
                              associate.overallProgress >= 50 ? 'blue' :
                              'orange'
                            }
                            fontSize="sm"
                            px={3}
                            py={1}
                          >
                            {associate.overallProgress}%
                          </Badge>
                        </HStack>
                        <Box w="full" h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
                          <Box 
                            w={`${associate.overallProgress}%`} 
                            h="full" 
                            bg={
                              associate.overallProgress >= 70 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' :
                              associate.overallProgress >= 50 ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' :
                              'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                            }
                            transition="width 0.3s ease"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Box>
        </Box>
      )}

      {/* Team Summary Modal */}
      {isTeamSummaryOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(8px)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsTeamSummaryOpen(false)}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            maxW="800px"
            w="90%"
            maxH="80vh"
            overflow="hidden"
            onClick={(e) => e.stopPropagation()}
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          >
            {/* Modal Header */}
            <Box
              p={6}
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                    <BarChart3 size={24} color="white" />
                  </Box>
                  <Heading size="lg" color="white" fontWeight="600">
                    Team Summary
                  </Heading>
                </HStack>
                <IconButton
                  onClick={() => setIsTeamSummaryOpen(false)}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  size="sm"
                  aria-label="Close"
                >
                  ✕
                </IconButton>
              </HStack>
            </Box>

            {/* Modal Body */}
            <Box p={6} overflowY="auto" maxH="calc(80vh - 100px)">
              <VStack gap={4} align="stretch">
                {/* Skill Gap Summary */}
                <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                  <HStack gap={2} mb={3}>
                    <Target size={18} color="#2563eb" />
                    <Heading size="sm" color="gray.800" fontWeight="600">
                      Skill Gap Analysis
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                    3 team members need immediate skill development. Focus areas: Advanced React patterns, System Design, and Cloud Architecture. Average skill gap: 35%.
                  </Text>
                </Box>

                {/* Mental Health Summary */}
                <Box p={4} bg="pink.50" borderRadius="lg" border="1px solid" borderColor="pink.200">
                  <HStack gap={2} mb={3}>
                    <Heart size={18} color="#ec4899" />
                    <Heading size="sm" color="gray.800" fontWeight="600">
                      Mental Health Overview
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                    2 team members showing high mental health risk. Recommend immediate 1-on-1 check-ins, workload review, and wellness program enrollment. 1 member also reports low motivation.
                  </Text>
                </Box>

                {/* Quick Stats */}
                <SimpleGrid columns={2} gap={3}>
                  <Box p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" color="gray.600" mb={1}>High Risk Members</Text>
                    <Text fontSize="xl" fontWeight="bold" color="red.600">
                      3 / 12
                    </Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" color="gray.600" mb={1}>Mental Health Concerns</Text>
                    <Text fontSize="xl" fontWeight="bold" color="pink.600">
                      2 / 12
                    </Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" color="gray.600" mb={1}>Low Motivation</Text>
                    <Text fontSize="xl" fontWeight="bold" color="orange.600">
                      1 / 12
                    </Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" color="gray.600" mb={1}>Career Concerns</Text>
                    <Text fontSize="xl" fontWeight="bold" color="purple.600">
                      2 / 12
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Recommendations */}
                <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                  <HStack gap={2} mb={3}>
                    <Brain size={18} color="#059669" />
                    <Heading size="sm" color="gray.800" fontWeight="600">
                      Recommended Actions
                    </Heading>
                  </HStack>
                  <VStack align="stretch" gap={2}>
                    <HStack gap={2}>
                      <Text fontSize="lg">•</Text>
                      <Text fontSize="sm" color="gray.700">Schedule 1-on-1s with high-risk members this week</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Text fontSize="lg">•</Text>
                      <Text fontSize="sm" color="gray.700">Enroll team in advanced technical training programs</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Text fontSize="lg">•</Text>
                      <Text fontSize="sm" color="gray.700">Review workload distribution and project assignments</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Text fontSize="lg">•</Text>
                      <Text fontSize="sm" color="gray.700">Promote wellness initiatives and mental health resources</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Engagement Detail Modal */}
      {isEngagementDetailOpen && selectedAssociate && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(8px)"
          zIndex={10000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsEngagementDetailOpen(false)}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            maxW="800px"
            w="90%"
            maxH="85vh"
            overflow="hidden"
            onClick={(e) => e.stopPropagation()}
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          >
            {/* Modal Header */}
            <Box p={6} bg="linear-gradient(135deg, #ec4899 0%, #db2777 100%)" color="white">
              <HStack justify="space-between" mb={2}>
                <VStack align="start" gap={1}>
                  <Heading size="lg">{selectedAssociate.name}</Heading>
                  <Text fontSize="sm" opacity={0.9}>Wellness Engagement Details</Text>
                </VStack>
                <IconButton
                  onClick={() => setIsEngagementDetailOpen(false)}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.300" }}
                  size="sm"
                  aria-label="Close"
                >
                  ✕
                </IconButton>
              </HStack>
            </Box>

            {/* Modal Body */}
            <Box p={6} overflowY="auto" maxH="calc(85vh - 180px)">
              <VStack gap={5} align="stretch">
                {/* Engagement Stats */}
                <SimpleGrid columns={3} gap={4}>
                  <Box textAlign="center" p={4} bg="orange.50" borderRadius="lg" border="2px solid" borderColor="orange.200">
                    <HStack justify="center" gap={2} mb={2}>
                      <BookOpen size={20} color="#dd6b20" />
                      <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                        {Math.floor(Math.random() * 15) + 8}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" fontWeight="600">Articles Read</Text>
                    <Text fontSize="xs" color="gray.600">Last 30 days</Text>
                  </Box>
                  <Box textAlign="center" p={4} bg="purple.50" borderRadius="lg" border="2px solid" borderColor="purple.200">
                    <HStack justify="center" gap={2} mb={2}>
                      <Video size={20} color="#9333ea" />
                      <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                        {Math.floor(Math.random() * 10) + 4}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" fontWeight="600">Videos Watched</Text>
                    <Text fontSize="xs" color="gray.600">Last 30 days</Text>
                  </Box>
                  <Box textAlign="center" p={4} bg="blue.50" borderRadius="lg" border="2px solid" borderColor="blue.200">
                    <HStack justify="center" gap={2} mb={2}>
                      <MessageCircle size={20} color="#3b82f6" />
                      <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                        {Math.floor(Math.random() * 5) + 2}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" fontWeight="600">Chat Sessions</Text>
                    <Text fontSize="xs" color="gray.600">Last 30 days</Text>
                  </Box>
                </SimpleGrid>

                {/* Content Engagement Trends */}
                <Box p={4} bg="gray.50" borderRadius="xl">
                  <HStack justify="space-between" mb={4}>
                    <Heading size="sm" color="gray.800">Content Engagement Trends</Heading>
                    <Badge colorScheme="green" fontSize="xs">
                      <HStack gap={1}>
                        <TrendingUp size={12} />
                        <Text>+25% this month</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                  <VStack gap={3} align="stretch">
                    <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">🧘 Stress Management Articles</Text>
                        <Badge colorScheme="orange" fontSize="xs">High Interest</Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.600" mb={2}>Accessed 8 times in the last 2 weeks</Text>
                      <Box w="full" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                        <Box w="75%" h="full" bg="orange.400" />
                      </Box>
                    </Box>
                    <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">💤 Work-Life Balance Videos</Text>
                        <Badge colorScheme="purple" fontSize="xs">Moderate</Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.600" mb={2}>Watched 5 videos in the last month</Text>
                      <Box w="full" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                        <Box w="55%" h="full" bg="purple.400" />
                      </Box>
                    </Box>
                    <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">💬 Anonymous Chat Support</Text>
                        <Badge colorScheme="blue" fontSize="xs">Recent</Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.600" mb={2}>3 sessions in the past week</Text>
                      <Box w="full" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                        <Box w="40%" h="full" bg="blue.400" />
                      </Box>
                    </Box>
                  </VStack>
                </Box>

                {/* AI Insights */}
                <Box p={4} bg="purple.50" borderRadius="xl" border="2px solid" borderColor="purple.200">
                  <HStack gap={2} mb={3}>
                    <Brain size={18} color="#9333ea" />
                    <Heading size="sm" color="gray.800">AI-Powered Insights</Heading>
                  </HStack>
                  <VStack gap={3} align="stretch">
                    <Box p={3} bg="white" borderRadius="lg">
                      <HStack gap={2} mb={2}>
                        <Sparkles size={14} color="#f59e0b" />
                        <Text fontSize="sm" fontWeight="600" color="gray.800">Pattern Detected</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                        {selectedAssociate.name.split(' ')[0]} shows consistent engagement with <strong>stress-related content</strong>, 
                        particularly during <strong>Monday mornings and late evenings</strong>. This suggests potential work-related 
                        stress and difficulty with work-life boundaries.
                      </Text>
                    </Box>
                    <Box p={3} bg="white" borderRadius="lg">
                      <HStack gap={2} mb={2}>
                        <CheckCircle size={14} color="#22c55e" />
                        <Text fontSize="sm" fontWeight="600" color="gray.800">Positive Engagement</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                        Actively seeking help through multiple channels. This proactive behavior is a positive indicator 
                        of self-awareness and willingness to improve.
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Recommended Actions for Manager */}
                <Box p={4} bg="green.50" borderRadius="xl" border="2px solid" borderColor="green.200">
                  <HStack gap={2} mb={3}>
                    <Target size={18} color="#22c55e" />
                    <Heading size="sm" color="gray.800">Recommended Actions for Manager</Heading>
                  </HStack>
                  <VStack gap={2} align="stretch">
                    <HStack gap={3} p={3} bg="white" borderRadius="lg">
                      <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1.5} />
                      <Text fontSize="sm" color="gray.700">
                        <strong>Schedule immediate 1-on-1 check-in</strong> to discuss workload and stress management strategies
                      </Text>
                    </HStack>
                    <HStack gap={3} p={3} bg="white" borderRadius="lg">
                      <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1.5} />
                      <Text fontSize="sm" color="gray.700">
                        <strong>Recommend stress management workshop</strong> enrollment (next session: Dec 5, 2025)
                      </Text>
                    </HStack>
                    <HStack gap={3} p={3} bg="white" borderRadius="lg">
                      <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1.5} />
                      <Text fontSize="sm" color="gray.700">
                        <strong>Review current project assignments</strong> to identify potential workload redistribution
                      </Text>
                    </HStack>
                    <HStack gap={3} p={3} bg="white" borderRadius="lg">
                      <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1.5} />
                      <Text fontSize="sm" color="gray.700">
                        <strong>Connect with EAP counselor</strong> for professional mental health support
                      </Text>
                    </HStack>
                    <HStack gap={3} p={3} bg="white" borderRadius="lg">
                      <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1.5} />
                      <Text fontSize="sm" color="gray.700">
                        <strong>Monitor engagement trends weekly</strong> and follow up on resource utilization
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            {/* Modal Footer */}
            <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
              <HStack justify="flex-end" gap={3}>
                <Button variant="outline" onClick={() => setIsEngagementDetailOpen(false)}>
                  Close
                </Button>
                <Button colorScheme="pink">
                  Schedule Follow-up
                </Button>
              </HStack>
            </Box>
          </Box>
        </Box>
      )}
    </VStack>
  );
};
