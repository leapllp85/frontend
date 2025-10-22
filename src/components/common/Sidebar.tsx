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
      w="20%"
      h="100vh" 
      // bg="#2d6a75"
      bg= 'linear-gradient(135deg, #226773 0%,rgb(6, 80, 93) 50%, #1a525c 100%)'
      overflow="hidden"
      flexDirection="column"
      justify="space-between"
      p={2}
      gap={2}
    >
      {/* Top Section */}
      <VStack w="full" gap={6} p={4} align="stretch">
       
        {/* User Profile */}
        <VStack gap={3} align="center" py={5}>
          <Box
            w="50px"
            h="50px"
            borderRadius="full"
            bg="teal.800"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize="lg"
            fontWeight="semi-bold"
          >
            {(profileData?.user?.username || "Manager User").charAt(0).toUpperCase()}
          </Box>
          <HStack gap={2}>
            <Text fontSize="md" color="white" fontWeight="medium">
              {profileData?.user?.username || "Manager User"}
            </Text>
            <Box
              as="button"
              p={0.5}
              borderRadius="sm"
              _hover={{ bg: "whiteAlpha.200" }}
              cursor="pointer"
            >
              <Edit2 size={10} color="white" />
            </Box>
          </HStack>
        </VStack>

        {/* Navigation */}
        <VStack gap={2} align="stretch" mt={2}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <HStack
                  px={3}
                  py={2.5}
                  borderRadius="lg"
                  bg={isActive ? "#4a9ba8" : "transparent"}
                  _hover={{ bg: isActive ? "#4a9ba8" : "whiteAlpha.100" }}
                  cursor="pointer"
                  transition="all 0.2s"
                  gap={3}
                >
                  <Icon size={18} color="white" />
                  <Text fontSize="md" color="white" fontWeight={isActive ? "semibold" : "normal"}>
                    {item.label}
                  </Text>
                </HStack>
              </Link>
            );
          })}
          
          {/* Logout */}
          <HStack
            px={3}
            py={2.5}
            borderRadius="lg"
            bg="transparent"
            _hover={{ bg: "whiteAlpha.100" }}
            cursor="pointer"
            transition="all 0.2s"
            gap={3}
            onClick={handleLogout}
          >
            <LogOut size={18} color="white" />
            <Text fontSize="md" color="white">
              Logout
            </Text>
          </HStack>
        </VStack>
      </VStack>

      {/* AI Assistant - Bottom Section */}
      <Box w="full" p={3} pb={6} bg= 'circular-gradient(135deg,rgb(27, 93, 105) 0%,rgb(20, 71, 80)) 50%, #1a525c 100%)'>
        <VStack gap={6} align="stretch">
          <HStack gap={3}>
            <Bot size={20} color="white" />
            <Text fontSize="md" color="white" fontWeight="semi-bold">
              Clyra AI
            </Text>
          </HStack>
          
          <Text fontSize="sm" color="whiteAlpha.800" lineHeight="1.4">
            Ask me anything about your projects, action items, or team insights!
          </Text>
          
          {/* Chat Input */}
          <HStack gap={3}>
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything..."
              bg="whiteAlpha.200"
              border="none"
              color="white"
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
              color="white"
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
    </VStack>
  );
};
