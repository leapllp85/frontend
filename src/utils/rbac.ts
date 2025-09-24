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
 * Gets user permissions based on the permissions array from JWT API
 * Converts API permission strings to UserPermissions object
 */
export function getUserPermissions(user: User): UserPermissions {
    const permissions = user.permissions || [];
    
    // Map API permission strings to UserPermissions boolean flags
    const permissionMap: Record<string, keyof UserPermissions> = {
        'chat': 'canViewDashboard', // Basic access
        'profile': 'canViewDashboard', // Basic access
        'surveys': 'canViewSurveys',
        'my_projects': 'canViewDashboard', // Basic project access
        'team_dashboard': 'canViewDashboard',
        'team_projects': 'canViewTeamProjects',
        'my_team': 'canViewMyTeam',
        'survey_management': 'canCreateSurveys'
    };
    
    const userPermissions: UserPermissions = {
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
    
    // Set permissions based on API response
    permissions.forEach(permission => {
        switch (permission) {
            case 'chat':
            case 'profile':
                userPermissions.canViewDashboard = true;
                break;
            case 'surveys':
                userPermissions.canViewSurveys = true;
                break;
            case 'my_projects':
                userPermissions.canViewDashboard = true;
                break;
            case 'team_dashboard':
                userPermissions.canViewDashboard = true;
                userPermissions.canViewTeamAnalytics = true;
                break;
            case 'team_projects':
                userPermissions.canViewTeamProjects = true;
                userPermissions.canCreateProjects = true;
                userPermissions.canEditProjects = true;
                break;
            case 'my_team':
                userPermissions.canViewMyTeam = true;
                userPermissions.canManageTeam = true;
                userPermissions.canAssignActionItems = true;
                userPermissions.canAssignCourses = true;
                break;
            case 'survey_management':
                userPermissions.canCreateSurveys = true;
                userPermissions.canDeleteSurveys = true;
                break;
        }
    });
    
    // All users can view action items and courses
    userPermissions.canViewActionItems = true;
    userPermissions.canViewCourses = true;
    
    return userPermissions;
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
    const permissions = getUserPermissions(user);

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
    const permissions = getUserPermissions(user);

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

    const permissions = getUserPermissions(user);

    return permissions[permission];
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
    if (!user) return false;
    return getUserRole(user) === role;
}
