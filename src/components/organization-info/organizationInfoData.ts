import { Activity, Network, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/types/styles";

export type OrganizationScope = {
  label: string;
  value: "my-team" | "my-department" | "entire-organization";
};

export type OrganizationStat = {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

export type OrganizationRiskLevel = "low" | "medium" | "high";

export type OrganizationPerson = {
  id: string;
  name: string;
  role: string;
  riskLevel: OrganizationRiskLevel;
  avatarUrl: string;
  reports?: readonly OrganizationPerson[];
  hasCollapsedReports?: boolean;
};

export type OrganizationExternalManager = {
  name: string;
  role: string;
  avatarUrl: string;
};

export type OrganizationEmployeeProfileDetails = {
  department: string;
  location: string;
  employeeId: string;
  experience: string;
  level: string;
  tenure: string;
  projects: string;
  spanOfControl: string;
};

export type OrganizationActiveProject = {
  id: string;
  name: string;
  memberCount: number;
  progress: number;
  accent: "purple" | "green";
  avatarUrls: readonly string[];
  extraMembers: number;
};

export const organizationScopes: readonly OrganizationScope[] = [
  { label: "My Team", value: "my-team" },
  { label: "My Department", value: "my-department" },
  { label: "Entire Organization", value: "entire-organization" },
];

export const organizationStats: readonly OrganizationStat[] = [
  {
    label: "Team Members",
    value: "8",
    icon: UsersRound,
    color: colors.primary,
    bg: colors.primarySoft,
  },
  {
    label: "Manager",
    value: "1",
    icon: UsersRound,
    color: colors.success,
    bg: "#E8F8F0",
  },
  {
    label: "Active Projects",
    value: "2",
    icon: UsersRound,
    color: "#7B61FF",
    bg: "#F1EDFF",
  },
  {
    label: "Avg. Span of Control",
    value: "4.6",
    helper: "info",
    icon: Activity,
    color: "#F58220",
    bg: "#FFF3DE",
  },
];

export const organizationHeader = {
  title: "Organization",
  subtitle: "Explore your people and reporting relationships.",
  icon: Network,
};

export const organizationRiskStyles: Record<
  OrganizationRiskLevel,
  { label: string; color: string; bg: string }
> = {
  low: {
    label: "Low Risk",
    color: "#00A86B",
    bg: "#E8F8F0",
  },
  medium: {
    label: "Medium Risk",
    color: "#F58220",
    bg: "#FFF3DE",
  },
  high: {
    label: "High Risk",
    color: "#FF3347",
    bg: "#FDEDEA",
  },
};

export const organizationProfileTabs = ["Overview", "Reports", "Projects", "Activity"] as const;

export const organizationExternalManager: OrganizationExternalManager = {
  name: "Mike Stevia",
  role: "Chief Executive Officer",
  avatarUrl: "https://i.pravatar.cc/160?img=59",
};

export const organizationEmployeeProfileDetails: Record<string, OrganizationEmployeeProfileDetails> = {
  you: {
    department: "Engineering",
    location: "New York, USA",
    employeeId: "EMP-2001",
    experience: "6.3 years",
    level: "Level 3",
    tenure: "2.8 years",
    projects: "2",
    spanOfControl: "4.6",
  },
  "sarah-johnson": {
    department: "Engineering",
    location: "New York, USA",
    employeeId: "EMP-2008",
    experience: "4.1 years",
    level: "Level 2",
    tenure: "1.9 years",
    projects: "1",
    spanOfControl: "3.0",
  },
  "david-lee": {
    department: "Engineering",
    location: "Austin, USA",
    employeeId: "EMP-2012",
    experience: "5.4 years",
    level: "Level 2",
    tenure: "2.4 years",
    projects: "2",
    spanOfControl: "3.0",
  },
  "lisa-chen": {
    department: "Quality",
    location: "Seattle, USA",
    employeeId: "EMP-2024",
    experience: "3.6 years",
    level: "Level 2",
    tenure: "1.4 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  "michael-brown": {
    department: "Platform",
    location: "Denver, USA",
    employeeId: "EMP-2030",
    experience: "4.8 years",
    level: "Level 2",
    tenure: "2.0 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  "era-jackson": {
    department: "Engineering",
    location: "New York, USA",
    employeeId: "EMP-2041",
    experience: "2.6 years",
    level: "Level 1",
    tenure: "1.1 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  "jakes-robert": {
    department: "Engineering",
    location: "Boston, USA",
    employeeId: "EMP-2042",
    experience: "2.9 years",
    level: "Level 1",
    tenure: "1.2 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  alila: {
    department: "Design Systems",
    location: "Chicago, USA",
    employeeId: "EMP-2043",
    experience: "2.3 years",
    level: "Level 1",
    tenure: "1.0 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  "emily-davis": {
    department: "Engineering",
    location: "New York, USA",
    employeeId: "EMP-2051",
    experience: "2.8 years",
    level: "Level 1",
    tenure: "1.3 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  "james-wilson": {
    department: "Engineering",
    location: "Austin, USA",
    employeeId: "EMP-2052",
    experience: "3.1 years",
    level: "Level 1",
    tenure: "1.5 years",
    projects: "1",
    spanOfControl: "0.0",
  },
  "priya-sharma": {
    department: "Product Design",
    location: "San Francisco, USA",
    employeeId: "EMP-2053",
    experience: "2.5 years",
    level: "Level 1",
    tenure: "1.1 years",
    projects: "1",
    spanOfControl: "0.0",
  },
};

export const organizationActiveProjects: readonly OrganizationActiveProject[] = [
  {
    id: "web-platform-redesign",
    name: "Web Platform Redesign",
    memberCount: 5,
    progress: 72,
    accent: "purple",
    avatarUrls: [
      "https://i.pravatar.cc/160?img=47",
      "https://i.pravatar.cc/160?img=32",
      "https://i.pravatar.cc/160?img=44",
      "https://i.pravatar.cc/160?img=11",
    ],
    extraMembers: 1,
  },
  {
    id: "mobile-app-development",
    name: "Mobile App Development",
    memberCount: 3,
    progress: 58,
    accent: "green",
    avatarUrls: [
      "https://i.pravatar.cc/160?img=11",
      "https://i.pravatar.cc/160?img=8",
      "https://i.pravatar.cc/160?img=13",
      "https://i.pravatar.cc/160?img=45",
    ],
    extraMembers: 1,
  },
];

export const organizationChartRoot: OrganizationPerson = {
  id: "you",
  name: "You",
  role: "Engineering Manager",
  riskLevel: "low",
  avatarUrl: "https://i.pravatar.cc/160?img=12",
  reports: [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      role: "Senior Frontend Developer",
      riskLevel: "low",
      avatarUrl: "https://i.pravatar.cc/160?img=47",
      hasCollapsedReports: true,
      reports: [
        {
          id: "era-jackson",
          name: "Era Jackson",
          role: "Frontend Developer",
          riskLevel: "low",
          avatarUrl: "https://i.pravatar.cc/160?img=32",
        },
        {
          id: "jakes-robert",
          name: "Jakes Robert",
          role: "Frontend Developer",
          riskLevel: "low",
          avatarUrl: "https://i.pravatar.cc/160?img=8",
        },
        {
          id: "alila",
          name: "Alila Wilson",
          role: "UI Developer",
          riskLevel: "low",
          avatarUrl: "https://i.pravatar.cc/160?img=44",
        },
      ],
    },
    {
      id: "david-lee",
      name: "David Lee",
      role: "Senior Backend Developer",
      riskLevel: "low",
      avatarUrl: "https://i.pravatar.cc/160?img=11",
      reports: [
        {
          id: "emily-davis",
          name: "Emily Davis",
          role: "Frontend Developer",
          riskLevel: "low",
          avatarUrl: "https://i.pravatar.cc/160?img=32",
        },
        {
          id: "james-wilson",
          name: "James Wilson",
          role: "Frontend Developer",
          riskLevel: "low",
          avatarUrl: "https://i.pravatar.cc/160?img=8",
        },
        {
          id: "priya-sharma",
          name: "Priya Sharma",
          role: "UI Developer",
          riskLevel: "low",
          avatarUrl: "https://i.pravatar.cc/160?img=44",
        },
      ],
    },
    {
      id: "lisa-chen",
      name: "Lisa Chen",
      role: "QA Lead",
      riskLevel: "low",
      avatarUrl: "https://i.pravatar.cc/160?img=45",
      hasCollapsedReports: true,
    },
    {
      id: "michael-brown",
      name: "Michael Brown",
      role: "DevOps Engineer",
      riskLevel: "medium",
      avatarUrl: "https://i.pravatar.cc/160?img=13",
    },
  ],
};
