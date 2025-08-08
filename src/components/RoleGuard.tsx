"use client";

import React from 'react';
import { useRBAC } from '@/contexts/AuthContext';
import { UserRole, UserPermissions } from '@/types';
import { Box, Text } from '@chakra-ui/react';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
    requiredPermission?: keyof UserPermissions;
    fallback?: React.ReactNode;
    showAccessDenied?: boolean;
}

/**
 * RoleGuard component that conditionally renders children based on user role and permissions
 * 
 * @param children - Content to render if user has access
 * @param requiredRoles - Array of roles that can access this content
 * @param requiredPermission - Specific permission required to access this content
 * @param fallback - Custom fallback component to show when access is denied
 * @param showAccessDenied - Whether to show access denied message (default: false, just hides content)
 */
export default function RoleGuard({
    children,
    requiredRoles,
    requiredPermission,
    fallback,
    showAccessDenied = false,
}: RoleGuardProps) {
    const { canAccess } = useRBAC();

    // Check if user has access
    const hasAccess = canAccess(requiredRoles, requiredPermission);

    if (!hasAccess) {
        // Return custom fallback if provided
        if (fallback) {
            return <>{fallback}</>;
        }

        // Show access denied message if requested
        if (showAccessDenied) {
            return (
                <Box p={4} textAlign="center" bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
                    <Text color="red.600" fontSize="sm">
                        You don't have permission to view this content.
                    </Text>
                </Box>
            );
        }

        // Default: render nothing
        return null;
    }

    // User has access, render children
    return <>{children}</>;
}

// Convenience components for common role checks
export function ManagerOnly({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredRoles'>) {
    return (
        <RoleGuard 
            requiredRoles={['Manager']} 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function AssociateOnly({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredRoles'>) {
    return (
        <RoleGuard 
            requiredRoles={['Associate']} 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

// Permission-based guards
export function RequireTeamManagement({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canManageTeam" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function RequireDashboardAccess({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canViewDashboard" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

// Action Items permission guards
export function RequireActionItemsView({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canViewActionItems" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function RequireActionItemsAssign({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canAssignActionItems" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

// Courses permission guards
export function RequireCoursesView({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canViewCourses" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function RequireCoursesAssign({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canAssignCourses" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

// Project Management permission guards
export function RequireProjectCreate({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredPermission'>) {
    return (
        <RoleGuard 
            requiredPermission="canCreateProjects" 
            fallback={fallback} 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function RequireProjectEdit({ children, showAccessDenied = false }: RoleGuardProps) {
    return (
        <RoleGuard 
            requiredPermission="canEditProjects" 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

// Survey Permission Guards
export function RequireSurveyView({ children, showAccessDenied = false }: RoleGuardProps) {
    return (
        <RoleGuard 
            requiredPermission="canViewSurveys" 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function RequireSurveyCreate({ children, showAccessDenied = false }: RoleGuardProps) {
    return (
        <RoleGuard 
            requiredPermission="canCreateSurveys" 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}

export function RequireSurveyDelete({ children, showAccessDenied = false }: RoleGuardProps) {
    return (
        <RoleGuard 
            requiredPermission="canDeleteSurveys" 
            showAccessDenied={showAccessDenied}
        >
            {children}
        </RoleGuard>
    );
}