"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserPermissions } from '@/types';
import { getUserRole, getUserPermissions } from '@/utils/rbac';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    permissions: UserPermissions | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [permissions, setPermissions] = useState<UserPermissions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Update role and permissions when user changes
    useEffect(() => {
        if (user) {
            const userRole = getUserRole(user);
            const userPermissions = getUserPermissions(user);
            setRole(userRole);
            setPermissions(userPermissions);
            setIsAuthenticated(true);
        } else {
            setRole(null);
            setPermissions(null);
            setIsAuthenticated(false);
        }
    }, [user]);

    // Initialize user from localStorage on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    // Try to get user data from localStorage or fetch from API
                    const storedUser = localStorage.getItem('userData');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                    } else {
                        // If no stored user data, we might need to fetch it
                        // For now, we'll handle this in the login flow
                        console.log('Token exists but no user data found');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        // Store user data in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userData));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        setPermissions(null);
        setIsAuthenticated(false);
        // Clear stored data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
    };

    const value: AuthContextType = {
        user,
        role,
        permissions,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook for role-based access control
export function useRBAC() {
    const { user, role, permissions } = useAuth();

    const hasRole = (requiredRole: UserRole): boolean => {
        return role === requiredRole;
    };

    const hasPermission = (permission: keyof UserPermissions): boolean => {
        return permissions ? permissions[permission] : false;
    };

    const canAccess = (requiredRoles?: UserRole[], requiredPermission?: keyof UserPermissions): boolean => {
        if (requiredRoles && role && !requiredRoles.includes(role)) {
            return false;
        }

        if (requiredPermission && !hasPermission(requiredPermission)) {
            return false;
        }

        return true;
    };

    return {
        user,
        role,
        permissions,
        hasRole,
        hasPermission,
        canAccess,
    };
}
