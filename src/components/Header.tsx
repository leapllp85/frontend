"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, checkTokenAndRedirect } from "@/lib/apis/auth";
import { getNavigationItems } from "@/utils/rbac";
import { useAuth } from "@/contexts/AuthContext";
import { usePageLoader } from "@/hooks/usePageLoader";
import {
    Box,
    HStack,
    Text,
    Button,
    Heading,
} from '@chakra-ui/react';
import { Home, FolderOpen, Users, BarChart3, LogOut, CheckSquare, BookOpen, FileText } from 'lucide-react';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout: authLogout } = useAuth();
    const { navigateWithLoader } = usePageLoader();

    useEffect(() => {
        // Check if user is authenticated on component mount
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);

        // Set up interval to check token expiry every minute
        const interval = setInterval(() => {
            if (!checkTokenAndRedirect()) {
                setIsAuthenticated(false);
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        authLogout();
        setIsAuthenticated(false);
    };

    const handleNavigation = (path: string) => {
        navigateWithLoader(path, 'Loading page...');
    };

    const isActivePath = (path: string) => {
        return pathname === path;
    };

    // Only show header if user is authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Get role-based navigation items
    const navigationItems = getNavigationItems(user);
    
    // Map navigation items to include icons
    const iconMap: Record<string, any> = {
        '/': Home,
        '/projects': FolderOpen,
        '/surveys': FileText,
        '/action-items': CheckSquare,
        '/courses': BookOpen,
        '/dashboard': BarChart3,
        '/my-team': Users,
    };
    
    const navItems = navigationItems.map(item => ({
        path: item.href,
        label: item.name,
        icon: iconMap[item.href] || FolderOpen,
    }));

    return (
        <Box
            as="header"
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={6}
            py={4}
            position="sticky"
            top={0}
            zIndex={50}
            shadow="lg"
            w="full"
        >
            <HStack justify="space-between" align="center">
                {/* Logo/Brand */}
                <Heading size="lg" color="#a5489f">
                    Corporate MVP
                </Heading>

                {/* Navigation */}
                <HStack gap={1}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActivePath(item.path);
                        
                        return (
                            <Button
                                key={item.path}
                                variant={isActive ? "solid" : "ghost"}
                                bg={isActive ? "#a5489f" : "transparent"}
                                color={isActive ? "white" : "gray.600"}
                                _hover={{
                                    bg: isActive ? "#8a3d85" : "gray.100",
                                    color: isActive ? "white" : "gray.800"
                                }}
                                onClick={() => handleNavigation(item.path)}
                                size="md"
                            >
                                <HStack gap={2}>
                                    <Icon size={18} />
                                    <Text>{item.label}</Text>
                                </HStack>
                            </Button>
                        );
                    })}
                </HStack>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    colorPalette="red"
                    size="md"
                >
                    <HStack gap={2}>
                        <LogOut size={18} />
                        <Text>Logout</Text>
                    </HStack>
                </Button>
            </HStack>
        </Box>
    );
}
