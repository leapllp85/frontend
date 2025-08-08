// Role-Based Access Control (RBAC) Utilities
import { User, UserRole, UserPermissions } from '@/types';

/**
 * Determines user role based on backend data
 * Manager status is determined by having associates reporting to them
 */
export function getUserRole(user: User): UserRole {
    return user.is_manager ? 'Manager' : 'Associate';
}

/**
 * Gets user permissions based on their role
 * Manager inherits all Associate permissions plus additional ones
 */
export function getUserPermissions(role: UserRole): UserPermissions {
    const basePermissions: UserPermissions = {
        canViewDashboard: false,
        canViewTeamProjects: false,
        canViewMyTeam: false,
        canViewTeamAnalytics: false,
        canManageTeam: false,
        canViewActionItems: false,
        canAssignActionItems: false,
        canViewCourses: false,
        canAssignCourses: false,
        canCreateProjects: false,
        canEditProjects: false,
        canViewSurveys: false,
        canCreateSurveys: false,
        canDeleteSurveys: false,
    };

    switch (role) {
        case 'Associate':
            return {
                ...basePermissions,
                // Associates have basic access
                canViewDashboard: false, // Associates don't see team dashboard
                canViewTeamProjects: false, // Associates see only their projects
                canViewMyTeam: false,
                canViewTeamAnalytics: false,
                canManageTeam: false,
                // Action Items and Courses - Associates can VIEW but not ASSIGN
                canViewActionItems: true, // All users can view action items
                canAssignActionItems: false, // Only managers can assign
                canViewCourses: true, // All users can view courses
                canAssignCourses: false, // Only managers can assign
                // Project Management - Associates can only VIEW projects
                canCreateProjects: false, // Only managers can create projects
                canEditProjects: false, // Only managers can edit projects
                // Survey Management - Associates can VIEW but not CREATE/DELETE
                canViewSurveys: true, // All users can view surveys
                canCreateSurveys: false, // Only managers can create surveys
                canDeleteSurveys: false, // Only managers can delete surveys
            };

        case 'Manager':
            return {
                ...basePermissions,
                // Managers inherit all Associate features plus management features
                canViewDashboard: true, // Team Dashboard
                canViewTeamProjects: true, // Team Projects
                canViewMyTeam: true, // My Team management
                canViewTeamAnalytics: true, // Team analytics
                canManageTeam: true, // Team management capabilities
                // Action Items and Courses - Managers can both VIEW and ASSIGN
                canViewActionItems: true, // All users can view action items
                canAssignActionItems: true, // Managers can assign action items
                canViewCourses: true, // All users can view courses
                canAssignCourses: true, // Managers can assign courses
                // Project Management - Managers can CREATE and EDIT projects
                canCreateProjects: true, // Managers can create new projects
                canEditProjects: true, // Managers can edit existing projects
                // Survey Management - Managers can VIEW, CREATE, and DELETE
                canViewSurveys: true, // All users can view surveys
                canCreateSurveys: true, // Managers can create surveys
                canDeleteSurveys: true, // Managers can delete surveys
            };

        default:
            return basePermissions;
    }
}

/**
 * Navigation items based on user role
 */
export interface NavigationItem {
    name: string;
    href: string;
    icon?: string;
    requiresRole?: UserRole[];
    requiresPermission?: keyof UserPermissions;
}

export const baseNavItems: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'My Projects', href: '/projects' },
    { name: 'Surveys', href: '/surveys' },
    { 
        name: 'Action Items', 
        href: '/action-items',
        requiresPermission: 'canViewActionItems'
    },
    { 
        name: 'Courses', 
        href: '/courses',
        requiresPermission: 'canViewCourses'
    },
];

export const managerNavItems: NavigationItem[] = [
    ...baseNavItems,
    { 
        name: 'Dashboard', 
        href: '/dashboard',
        requiresRole: ['Manager'],
        requiresPermission: 'canViewDashboard'
    },
    { 
        name: 'My Team', 
        href: '/my-team',
        requiresRole: ['Manager'],
        requiresPermission: 'canViewMyTeam'
    },
];

/**
 * Get navigation items based on user role and permissions
 */
export function getNavigationItems(user: User | null): NavigationItem[] {
    if (!user) return [];

    const role = getUserRole(user);
    const permissions = getUserPermissions(role);

    const allNavItems = role === 'Manager' ? managerNavItems : baseNavItems;

    return allNavItems.filter(item => {
        // Check role requirement
        if (item.requiresRole && !item.requiresRole.includes(role)) {
            return false;
        }

        // Check permission requirement
        if (item.requiresPermission && !permissions[item.requiresPermission]) {
            return false;
        }

        return true;
    });
}

/**
 * Check if user has permission to access a specific route
 */
export function canAccessRoute(user: User | null, route: string): boolean {
    if (!user) return false;

    const role = getUserRole(user);
    const permissions = getUserPermissions(role);

    // Define route access rules
    const routePermissions: Record<string, keyof UserPermissions | 'always'> = {
        '/': 'always',
        '/projects': 'always', // All users can see their projects
        '/surveys': 'always', // All users can access surveys
        '/dashboard': 'canViewDashboard',
        '/projects/team': 'canViewTeamProjects',
        '/my-team': 'canViewMyTeam',
        '/action-items': 'canViewActionItems', // All users can view action items
        '/courses': 'canViewCourses', // All users can view courses
        '/projects/onboard': 'canCreateProjects', // Only managers can create projects
        '/projects/edit': 'canEditProjects', // Only managers can edit projects
    };

    const requiredPermission = routePermissions[route];

    if (!requiredPermission || requiredPermission === 'always') {
        return true;
    }

    return permissions[requiredPermission];
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: keyof UserPermissions): boolean {
    if (!user) return false;

    const role = getUserRole(user);
    const permissions = getUserPermissions(role);

    return permissions[permission];
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
    if (!user) return false;
    return getUserRole(user) === role;
}
