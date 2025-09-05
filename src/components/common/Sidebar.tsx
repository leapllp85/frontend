import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Button, Input, Spinner, Badge, IconButton } from "@chakra-ui/react";
import { Home, FolderOpen, FileText, Users, BarChart3, CheckCircle, LogOut, Send, MessageCircle, Zap, X } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useAuth, useRBAC } from '@/contexts/AuthContext';
import { logout } from "@/lib/apis/auth";
import { useChatContext } from '@/contexts/ChatContext';

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
  enableAsync = true,
  enableStreaming = true
}) => {
  const [chatMessage, setChatMessage] = useState("");
  
  const {
    sendMessage: contextSendMessage,
    sendMessageAsync,
    sendMessageStreaming,
    isLoading,
    progress,
    progressMessage,
    cancelActiveTask
  } = useChatContext();

  const pathname = usePathname();
  const { hasRole, user } = useRBAC();

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: FileText, label: "Surveys", href: "/surveys" },
    { icon: CheckCircle, label: "Action Items", href: "/action-items" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "My Team", href: "/my-team" },
  ];

  const handleSendMessage = useCallback(async () => {
    const message = chatMessage.trim();
    if (!message || isLoading || disabled) return;

    setChatMessage("");
    
    try {
      // Always use async mode internally for seamless experience
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
  
  return (
    <VStack 
      w={{ base: "260px", md: "280px", lg: "300px", xl: "320px", "2xl": "340px" }}
      minW={{ base: "260px", md: "280px" }}
      maxW={{ base: "260px", md: "280px", lg: "300px", xl: "320px", "2xl": "340px" }}
      h="100vh" 
      bg="linear-gradient(180deg, #a4489e 0%, #8b5a9d 100%)"
      overflow="hidden"
      flexDirection="column"
      justify="space-between"
    >
      {/* Welcome message */}
      <VStack p={{ base: 4, md: 5, lg: 6 }} gap={{ base: 2, md: 4, lg: 6 }} pt={{ base: 8, md: 10, lg: 12 }} w="full">
        {/* Decorative dots - visible only on 15.6+ inch screens */}
        <HStack gap={2} display={{ base: "none", "2xl": "flex" }}>
          {[...Array(4)].map((_, i) => (
            <Box 
              key={i}
              w="3" 
              h="3" 
              bg="whiteAlpha.400" 
              borderRadius="full" 
            />
          ))}
        </HStack>
        
        <VStack gap={2}>
          <Text color="whiteAlpha.800" fontSize={{ base: "xs", md: "sm" }} mb={1}>
            Hello, {user?.first_name || 'User'}!,
          </Text>
          <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
            {hasRole('Manager') ? 'How can I help you' : 'Welcome to Corporate MVP'}
          </Text>
        </VStack>
      </VStack>
    
      {/* Navigation */}
      <VStack w="full" gap={{ base: 1, md: 1, lg: 2 }} px={{ base: 3, md: 4, lg: 5 }}>
        {navigationItems.map((item, index) => (
          <Link key={index} href={item.href} style={{ width: '100%' }}>
            <Button
              w="full"
              h={{ base: "9", md: "10", lg: "11" }}
              bg={pathname === item.href ? "whiteAlpha.200" : "transparent"}
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              justifyContent="flex-start"
              variant="ghost"
              fontWeight="medium"
              borderRadius="lg"
              fontSize={{ base: "xs", md: "sm", lg: "md" }}
              onClick={handleNavClick}
            >
              <HStack gap={2}>
                <item.icon size={16} />
                <Text>{item.label}</Text>
              </HStack>
            </Button>
          </Link>
        ))}
        
        {/* Logout Button */}
        <Button
          w="full"
          h={{ base: "9", md: "10", lg: "11" }}
          bg="transparent"
          color="white"
          _hover={{ bg: "red.500" }}
          justifyContent="flex-start"
          variant="ghost"
          fontWeight="medium"
          borderRadius="lg"
          onClick={handleLogout}
          fontSize={{ base: "xs", md: "sm", lg: "md" }}
        >
          <HStack gap={2}>
            <LogOut size={16} />
            <Text>Logout</Text>
          </HStack>
        </Button>
      </VStack>
      
      {/* AI Assistant Chat Section - Manager Only */}
      {hasRole('Manager') && (
        <Box 
          px={{ base: 3, md: 4, lg: 5 }} 
          mt={{ base: 3, md: 5, lg: 6 }} 
          pb={{ base: 3, md: 4, lg: 5, "2xl": 12 }} 
          w="full"
        >
          <VStack gap={3} align="stretch" h="full">
            <HStack gap={2} align="center">
              <MessageCircle size={18} color="white" />
              <Text color="white" fontSize={{ base: "xs", md: "sm", lg: "md" }} fontWeight="bold">
                AI Assistant
              </Text>
            </HStack>
            
            <HStack
              p={{ base: 2, md: 3, lg: 4 }}
              borderRadius="xl"
              border="1px solid"
              borderColor="whiteAlpha.200"
              w="full"
              gap={2}
            >
              <Text 
                fontSize={{ base: "xs", md: "sm", lg: "md" }} 
                color="white" 
                fontWeight="medium"
              >
                💡
              </Text>
              <Text 
                fontSize={{ base: "2xs", md: "xs", lg: "sm" }} 
                color="white" 
                fontWeight="medium"
                textAlign="left"
              >
                Ask me anything about your projects, action items, or team insights!
              </Text>
            </HStack>
            
            {/* Progress Indicator */}
            {(isLoading || progress !== null) && (
              <Box w="full" p={{ base: 2, md: 3 }} bg="whiteAlpha.100" borderRadius="lg" border="1px solid" borderColor="whiteAlpha.200">
                <VStack gap={2} align="start">
                  <HStack justify="space-between" w="full">
                    <Text fontSize={{ base: "2xs", md: "xs" }} color="white" fontWeight="medium">
                      {progressMessage || 'Processing...'}
                    </Text>
                    {isLoading && (
                      <IconButton
                        size="xs"
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        onClick={() => cancelActiveTask()}
                        aria-label="Cancel"
                      >
                        <X size={10} />
                      </IconButton>
                    )}
                  </HStack>
                  {progress !== null && (
                    <Box
                      w="full"
                      h="2"
                      bg="whiteAlpha.200"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        h="full"
                        bg="purple.400"
                        borderRadius="full"
                        width={`${progress}%`}
                        transition="width 0.3s ease"
                      />
                    </Box>
                  )}
                </VStack>
              </Box>
            )}
            

            {/* Chat Input */}
            <HStack gap={2}>
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask me anything..."
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                color="white"
                _placeholder={{ color: "whiteAlpha.600" }}
                _focus={{ 
                  borderColor: "whiteAlpha.400",
                  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.4)"
                }}
                size={{ base: "xs", md: "sm" }}
                onKeyPress={handleKeyPress}
                disabled={disabled || isLoading}
              />
              <Button
                size={{ base: "xs", md: "sm" }}
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: "whiteAlpha.300" }}
                _disabled={{ 
                  opacity: 0.6,
                  cursor: "not-allowed"
                }}
                onClick={handleSendMessage}
                minW="auto"
                px={3}
                disabled={disabled || isLoading || !chatMessage.trim()}
              >
                {isLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <Send size={14} />
                )}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};