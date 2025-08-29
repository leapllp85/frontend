import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Button, Input } from "@chakra-ui/react";
import { Home, FolderOpen, FileText, Users, BarChart3, CheckCircle, LogOut, Send, MessageCircle } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useAuth, useRBAC } from '@/contexts/AuthContext';
import { logout } from "@/lib/apis/auth";

interface SidebarProps {
  setHasQueried: React.Dispatch<React.SetStateAction<boolean>>;
  setUserQuestion: React.Dispatch<React.SetStateAction<string>>;
}

export const Sidebar: React.FC<SidebarProps> = ({setHasQueried, setUserQuestion}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [activeRoute, setActiveRoute] = useState("/");

  const pathname = usePathname();
  const { hasRole } = useRBAC();

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: FileText, label: "Surveys", href: "/surveys" },
    { icon: CheckCircle, label: "Action Items", href: "/action-items" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "My Team", href: "/my-team" },
  ];

  useEffect(() => { 
    setActiveRoute(pathname);
  }, [pathname]);

  const handleSendMessage = () => {
    setHasQueried(true);
    if (chatMessage.trim()) {
      setUserQuestion(chatMessage);
      setChatMessage("");
    }
  };

  const { user, logout: authLogout } = useAuth();
  
  const handleLogout = () => {
    logout();
    authLogout();
  };
  
  return (
    <VStack 
      w={{ base: "280px", md: "320px", lg: "25vw", xl: "22vw", "2xl": "20vw" }}
      minW="280px"
      maxW="25vw"
      h="100vh" 
      bg="linear-gradient(180deg, #a4489e 0%, #8b5a9d 100%)"
      overflow="hidden"
      flexDirection="column"
      justify="space-between"
    >
      {/* Welcome message */}
      <VStack p={6} gap={8} pt={16} w="full">
        {/* Decorative dots */}
        <HStack gap={2}>
          <Box w="3" h="3" bg="whiteAlpha.400" borderRadius="full" />
          <Box w="3" h="3" bg="whiteAlpha.400" borderRadius="full" />
          <Box w="3" h="3" bg="whiteAlpha.400" borderRadius="full" />
          <Box w="3" h="3" bg="whiteAlpha.400" borderRadius="full" />
        </HStack>
        {hasRole('Manager') ? (
          <VStack gap={2}>
            <Text color="whiteAlpha.800" fontSize="sm" mb={1}>
              Hi There,
            </Text>
            <Text color="white" fontSize="lg" fontWeight="medium">
              How can I help you
            </Text>
          </VStack>
        ) : (
          <VStack gap={2}>
            <Text color="whiteAlpha.800" fontSize="sm" mb={1}>
              Hi There,
            </Text>
            <Text color="white" fontSize="lg" fontWeight="medium">
              Welcome to Corporate MVP
            </Text>
          </VStack>
        )}
      </VStack>
    
      {/* Navigation */}
      <VStack w="full" gap={2} px={{ base: 4, md: 6 }} mt={{ base: 4, md: 8 }}>
        {navigationItems.map((item, index) => (
          <Link key={index} href={item.href} style={{ width: '100%' }}>
            <Button
              w="full"
              h={{ base: "10", md: "12" }}
              bg={activeRoute === item.href ? "whiteAlpha.200" : "transparent"}
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              justifyContent="flex-start"
              variant="ghost"
              fontWeight="medium"
              borderRadius="lg"
              fontSize={{ base: "sm", md: "md" }}
            >
              <HStack gap={2}>
                <item.icon size={18} />
                <Text>{item.label}</Text>
              </HStack>
            </Button>
          </Link>
        ))}
        {/* Logout Button at Bottom */}
        <Button
          w="full"
          h={{ base: "10", md: "12" }}
          bg="transparent"
          color="white"
          _hover={{ bg: "red.500" }}
          justifyContent="flex-start"
          variant="ghost"
          fontWeight="medium"
          borderRadius="lg"
          onClick={handleLogout}
          fontSize={{ base: "sm", md: "md" }}
        >
          <HStack gap={2}>
            <LogOut size={18} />
            <Text>Logout</Text>
          </HStack>
        </Button>
      </VStack>
      
      {/* AI Assistant Chat Section - Manager Only */}
      {hasRole('Manager') && (
        <Box px={{ base: 4, md: 6 }} mt={{ base: 4, md: 8 }} pb={{ base: 4, md: 6 }} display="flex" flexDirection="column" w="full">
          <VStack gap={3} align="stretch" h="full">
            <HStack gap={2} align="center">
              <MessageCircle size={18} color="white" />
              <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="bold">AI Assistant</Text>
            </HStack>
            
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
                _focus={{ borderColor: "whiteAlpha.400" }}
                size="sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="sm"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={handleSendMessage}
                minW="auto"
                px={3}
              >
                <Send size={14} />
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
