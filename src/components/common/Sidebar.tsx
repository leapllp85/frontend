'use client';

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Button, Input } from "@chakra-ui/react";
import { Home, BarChart3, FolderOpen, FileText, CheckCircle, LogOut, Send, Edit2, Bot } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from "@/lib/apis/auth";
import { useChatContext } from '@/contexts/ChatContext';
import { userApi } from "@/services";
import { UserProfile } from "../../services/userApi";

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
  
  const {
    sendMessageAsync,
    isLoading,
  } = useChatContext();

  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: FileText, label: "Surveys", href: "/surveys" },
    { icon: CheckCircle, label: "Action Items", href: "/action-items" },
  ];

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

  useEffect(() => {
    setMounted(true);
    fetchUserProfile();
  }, []);
  
  return (
    <VStack 
      w="5%"
      h="100vh" 
      // bg="#2d6a75"
      // bg= 'linear-gradient(135deg, #edede9   0%,#edede9 50%, #edede9 100%)'
      bg= 'circular-gradient(150deg, #0077b6 0%, #0077b6 20%, #0077b6 100%);'

      overflow="hidden"
      flexDirection="column" 
      justify="space-between"
      p={2}
      gap={2}
    >
      {/* Top Section */}
      <VStack w="full" gap={2} p={2} align="stretch">
       
        {/* User Profile */}
        <VStack gap={0} align="center" py={0}>
          <Box
            w="60px"
            h="50px"
            borderRadius="full"
            bg="gray.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize="lg"
            fontWeight="semi-bold"
            title={profileData?.user?.username || "Manager User"}
            cursor="pointer"
            _hover={{ bg: "gray.500", transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            {(profileData?.user?.username || "Manager User").charAt(0).toUpperCase()}
          </Box>
          <HStack gap={2}>
            {/* <Text fontSize="md" color="white" fontWeight="medium">
              {profileData?.user?.username || "Manager User"}
            </Text> */}
            {/* <Box
              as="button"
              p={0.5}
              borderRadius="sm"
              _hover={{ bg: "whiteAlpha.200" }}
              cursor="pointer"
            >
              // <Edit2 size={10} color="white" />
            </Box> */}
          </HStack>
        </VStack>

        {/* Navigation */}
        <VStack gap={2} align="stretch" mt={5}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <Box
                  px={3}
                  py={2.5}
                  borderRadius="lg"
                  bg={isActive ? "teal.500" : "transparent"}
                  _hover={{ 
                    bg: isActive ? "teal.600" : "whiteAlpha.200",
                    transform: "scale(1.05)"
                  }}
                  cursor="pointer"
                  transition="all 0.2s"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  title={item.label}
                  boxShadow={isActive ? "0 4px 12px rgba(56, 178, 172, 0.4)" : "none"}
                >
                  <Icon 
                    size={24} 
                    color={isActive ? "white" : "#6B7280"} 
                    style={{
                      filter: isActive ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" : "none"
                    }}
                  />
                </Box>
              </Link>
            );
          })}
          
          {/* Logout */}
          <Box
            px={3}
            py={2.5}
            borderRadius="lg"
            bg="transparent"
            _hover={{ 
              bg: "red.500",
              transform: "scale(1.05)"
            }}
            cursor="pointer"
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleLogout}
            title="Logout"
            className="logout-icon-container"
          >
            <LogOut 
              size={24} 
              color="#6B7280"
              style={{
                transition: "all 0.2s"
              }}
            />
          </Box>
        </VStack>
      </VStack>

      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .logout-icon-container:hover svg {
            color: white !important;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
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
          {/* Chat with Clyra AI */}
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
          {/* <HStack gap={3}>
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything..."
              bg="whiteAlpha.200"
              border="none"
              color="gray"
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
          </HStack> */}
        </VStack>
      </Box>
    </VStack>
  );
};
