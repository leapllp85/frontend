"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkTokenAndRedirect } from "@/lib/apis/auth";
import { canAccessRoute } from "@/utils/rbac";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { VStack, Box, Text } from "@chakra-ui/react";

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                // Only redirect to login if not already on login page
                if (pathname !== "/login") {
                    router.push("/login");
                }
                return;
            }

            const isValid = checkTokenAndRedirect();
            setIsAuthenticated(isValid);
            setIsLoading(false);

            if (!isValid && pathname !== "/login") {
                router.push("/login");
            } else if (isValid && pathname === "/login") {
                // If user is authenticated and on login page, redirect to home
                router.push("/");
            }
        };

        // Initial auth check
        checkAuth();

        // Listen for localStorage changes (cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accessToken") {
                // Token changed in another tab
                if (e.newValue) {
                    // Token added/updated - user logged in
                    const isValid = checkTokenAndRedirect();
                    setIsAuthenticated(isValid);
                    if (isValid && pathname === "/login") {
                        router.push("/");
                    }
                } else {
                    // Token removed - user logged out
                    setIsAuthenticated(false);
                    if (pathname !== "/login") {
                        router.push("/login");
                    }
                }
            }
        };

        // Add storage event listener for cross-tab sync
        window.addEventListener("storage", handleStorageChange);

        // Set up interval to check token expiry periodically
        const interval = setInterval(() => {
            if (pathname !== "/login") {
                const isValid = checkTokenAndRedirect();
                if (!isValid) {
                    setIsAuthenticated(false);
                    router.push("/login");
                }
            }
        }, 60000); // Check every minute

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [pathname, router]);

    // Show loading state
    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    // For login page, don't show header
    if (pathname === "/login") {
        return <>{children}</>;
    }

    // Check if user has access to the current route
    if (isAuthenticated && user && !canAccessRoute(user, pathname)) {
        return (
            <VStack w="full" p={0} gap={0}>
                <Header />
                <Box p={8} textAlign="center">
                    <Text fontSize="xl" color="red.500" mb={4}>
                        Access Denied
                    </Text>
                    <Text color="gray.600">
                        You don't have permission to access this page.
                    </Text>
                </Box>
            </VStack>
        );
    }

    // For authenticated pages, show header
    return (
        <VStack w="full" p={0} gap={0}>
            <Header />
            {children}
        </VStack>
    );
}
