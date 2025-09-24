// Centralized Type Definitions for Corporate MVP Frontend
// This file consolidates all shared interfaces to prevent conflicts

// Role-based Access Control Types
export type UserRole = 'Associate' | 'Manager';

export interface UserPermissions {
    canViewDashboard: boolean;
    canViewTeamProjects: boolean;
    canViewMyTeam: boolean;
    canViewTeamAnalytics: boolean;
    canManageTeam: boolean;
    canViewActionItems: boolean;
    canAssignActionItems: boolean;
    canViewCourses: boolean;
    canAssignCourses: boolean;
    canCreateProjects: boolean;
    canEditProjects: boolean;
    canViewSurveys: boolean;
    canCreateSurveys: boolean;
    canDeleteSurveys: boolean;
}

// Base User Types
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role?: UserRole;
    is_manager?: boolean;
    permissions?: UserPermissions;
}

// Employee Types
export interface Employee {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    department?: string;
}

// Component-specific Employee type for compatibility
export interface ComponentEmployee {
    id: number;
    name: string;
    email?: string;
    role: string;
    department?: string;
}

export interface EmployeeProfile {
    role: string;
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    profile_pic?: string;
    mental_health?: 'High' | 'Medium' | 'Low';
    motivation_factor?: 'High' | 'Medium' | 'Low';
    career_opportunities?: 'High' | 'Medium' | 'Low';
    personal_reason?: 'High' | 'Medium' | 'Low';
    suggested_risk?: 'High' | 'Medium' | 'Low';
    project_criticality?: 'High' | 'Medium' | 'Low';
    manager_assessment_risk?: 'High' | 'Medium' | 'Low';
    all_triggers?: string;
    primary_trigger: 'MH' | 'MT' | 'CO' | 'PR';
    age: number;
    email: string;
    total_allocation: number;
}

// Project Types
export interface Contributor {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    department?: string;
    criticality: 'High' | 'Medium' | 'Low';
    projectCriticality: 'High' | 'Medium' | 'Low';
    allocationPercentage: number;
}

export interface Project {
    id: string;
    name: string;
    title: string;
    description: string;
    timeline: string;
    go_live_date: string;
    criticality: 'High' | 'Medium' | 'Low';
    status: 'Active' | 'Inactive';
    isActive: boolean;
    contributors: Contributor[];
    assigned_to: User[];
    progress?: number;
}

// Team Types
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    age: number;
    mentalHealth: 'High' | 'Medium' | 'Low';
    motivationFactor: 'High' | 'Medium' | 'Low';
    careerOpportunities: 'High' | 'Medium' | 'Low';
    personalReason: 'High' | 'Medium' | 'Low';
    managerAssessmentRisk: 'High' | 'Medium' | 'Low';
    utilization?: number;
    projectCriticality?: 'High' | 'Medium' | 'Low';
    attritionRisk?: 'High' | 'Medium' | 'Low';
    triggers?: {
        mentalHealth: boolean;
        motivation: boolean;
        career: boolean;
        personal: boolean;
    };
    primaryTrigger?: 'MH' | 'MT' | 'CO' | 'PR';
}

// Dashboard Types
export interface DashboardQuickData {
    team_attrition_risk: number;
    team_mental_health: number;
    avg_utilization: number;
    top_talent: Array<{
        id: number;
        name: string;
        project_criticality: 'High' | 'Medium' | 'Low';
    }>;
    average_age: number;
}

export interface AttritionGraphData {
    high: number;
    medium: number;
    low: number;
}

export interface DistributionGraphData {
    mental_health: { high: number; medium: number; low: number };
    motivation_factor: { high: number; medium: number; low: number };
    career_opportunities: { high: number; medium: number; low: number };
    personal_reason: { high: number; medium: number; low: number };
    primary_triggers: { MH: number; MT: number; CO: number; PR: number };
}

// Action Items Types
export interface ActionItem {
    id: string;
    title: string;
    action: string;
    status: 'Pending' | 'Completed';
    created_at: string;
    updated_at: string;
}

// Course Types
export interface CourseCategory {
    id: string;
    name: string;
    description?: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    category_id: string;
    duration: string;
    instructor: string;
    created_at: string;
    updated_at: string;
}

// Survey Types
export interface Survey {
    id: number;
    title: string;
    description: string;
    status: 'Draft' | 'Active' | 'Completed';
    created_at: string;
    updated_at: string;
    responses_count: number;
    questions?: SurveyQuestion[];
}

export interface SurveyQuestion {
    id: string;
    question: string;
    type: 'text' | 'multiple_choice' | 'rating';
    options?: string[];
}

export interface SurveyResponse {
    id: string;
    survey_id: string;
    user_id: string;
    responses: Record<string, any>;
    created_at: string;
}

export interface SurveySummary {
    total_available: number;
    completed: number;
    draft: number;
    active: number;
}

// Allocation Types
export interface AllocationSummary {
    employee_id: string;
    employee_name: string;
    total_allocation: number;
    projects: Array<{
        project_id: string;
        project_name: string;
        allocation_percentage: number;
    }>;
}

// Common UI Types
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type Status = 'Active' | 'Inactive' | 'Pending' | 'Completed';

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next?: string;
    previous?: string;
}