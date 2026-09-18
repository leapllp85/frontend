import { BriefcaseBusiness, Heart, TrendingUp, UsersRound, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/types/styles";

export type HealthPillar = {
  label: string;
  score: number;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
  iconBg: string;
};

export type AttentionItem = {
  initials: string;
  name: string;
  detail: string;
  status: string;
  statusColor: string;
  avatarBg: string;
};

export type TeamRiskLevel = "Low" | "Medium" | "High";

export type TeamMemberHighlight = {
  initials: string;
  name: string;
  role: string;
  riskLevel: TeamRiskLevel;
  healthScore: number;
  mentalHealth: number;
  motivation: number;
  careerGrowth: number;
  workLife: number;
  distribution: {
    risk: number;
    health: number;
  };
};

export const teamHealthSummary = {
  score: 82,
  total: 100,
  change: "6 pts",
};

export const healthPillars: readonly HealthPillar[] = [
  {
    label: "Mental Health",
    score: 72,
    change: "2%",
    trend: "down",
    icon: Heart,
    color: colors.danger,
    iconBg: "#FDEDEA",
  },
  {
    label: "Motivation",
    score: 68,
    change: "3%",
    trend: "up",
    icon: Zap,
    color: "#F58220",
    iconBg: "#FFF3DE",
  },
  {
    label: "Career Growth",
    score: 58,
    change: "4%",
    trend: "up",
    icon: TrendingUp,
    color: colors.success,
    iconBg: "#E8F8F0",
  },
  {
    label: "Work-Life",
    score: 63,
    change: "1%",
    trend: "up",
    icon: UsersRound,
    color: "#5F5CE6",
    iconBg: "#EFEDFF",
  },
];

export const needsAttentionItems: readonly AttentionItem[] = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    detail: "No check-in in 12 days",
    status: "High Risk",
    statusColor: colors.danger,
    avatarBg: "#FDEDEA",
  },
  {
    initials: "LP",
    name: "Lisa Thompson",
    detail: "Motivation dropped 18%",
    status: "Motivation ↓",
    statusColor: "#F58220",
    avatarBg: "#FFF3DE",
  },
  {
    initials: "DM",
    name: "David Martinez",
    detail: "Great improvement this week",
    status: "Improved",
    statusColor: colors.success,
    avatarBg: "#E8F8F0",
  },
];

export const teamsInfoHeaderIcon = BriefcaseBusiness;

export const teamRiskStyles: Record<
  TeamRiskLevel,
  { color: string; bg: string; label: string }
> = {
  Low: {
    color: colors.success,
    bg: "#E8F8F0",
    label: "Low Risk",
  },
  Medium: {
    color: "#F58220",
    bg: "#FFF3DE",
    label: "Medium Risk",
  },
  High: {
    color: "#F23D4F",
    bg: "#FDEDEA",
    label: "High Risk",
  },
};

export const teamMembers: readonly TeamMemberHighlight[] = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    role: "Sr. Product Designer",
    riskLevel: "High",
    healthScore: 72,
    mentalHealth: 3,
    motivation: 3,
    careerGrowth: 2,
    workLife: 4,
    distribution: { risk: 66, health: 78 },
  },
  {
    initials: "MC",
    name: "Michael Chen",
    role: "Frontend Developer",
    riskLevel: "Medium",
    healthScore: 68,
    mentalHealth: 3,
    motivation: 3,
    careerGrowth: 3,
    workLife: 3,
    distribution: { risk: 36, health: 35 },
  },
  {
    initials: "DM",
    name: "David Martinez",
    role: "Backend Developer",
    riskLevel: "Low",
    healthScore: 85,
    mentalHealth: 1,
    motivation: 2,
    careerGrowth: 3,
    workLife: 4,
    distribution: { risk: 22, health: 83 },
  },
  {
    initials: "ER",
    name: "Emily Rodriguez",
    role: "UX Researcher",
    riskLevel: "High",
    healthScore: 65,
    mentalHealth: 3,
    motivation: 3,
    careerGrowth: 2,
    workLife: 4,
    distribution: { risk: 78, health: 70 },
  },
  {
    initials: "JT",
    name: "Jessica Taylor",
    role: "Product Manager",
    riskLevel: "Medium",
    healthScore: 70,
    mentalHealth: 2,
    motivation: 3,
    careerGrowth: 2,
    workLife: 3,
    distribution: { risk: 64, health: 40 },
  },
  {
    initials: "JA",
    name: "James Anderson",
    role: "Data Analyst",
    riskLevel: "Low",
    healthScore: 82,
    mentalHealth: 1,
    motivation: 2,
    careerGrowth: 2,
    workLife: 4,
    distribution: { risk: 28, health: 68 },
  },
  {
    initials: "LP",
    name: "Lisa Thompson",
    role: "QA Engineer",
    riskLevel: "High",
    healthScore: 60,
    mentalHealth: 3,
    motivation: 3,
    careerGrowth: 2,
    workLife: 4,
    distribution: { risk: 89, health: 61 },
  },
  {
    initials: "AG",
    name: "Amanda Green",
    role: "People Partner",
    riskLevel: "Low",
    healthScore: 88,
    mentalHealth: 1,
    motivation: 2,
    careerGrowth: 3,
    workLife: 4,
    distribution: { risk: 38, health: 75 },
  },
  {
    initials: "CL",
    name: "Carlos Lee",
    role: "DevOps Engineer",
    riskLevel: "Medium",
    healthScore: 66,
    mentalHealth: 2,
    motivation: 3,
    careerGrowth: 2,
    workLife: 3,
    distribution: { risk: 72, health: 28 },
  },
  {
    initials: "RW",
    name: "Rachel Wilson",
    role: "Marketing Lead",
    riskLevel: "Medium",
    healthScore: 74,
    mentalHealth: 2,
    motivation: 3,
    careerGrowth: 2,
    workLife: 3,
    distribution: { risk: 83, health: 39 },
  },
  {
    initials: "NP",
    name: "Noah Patel",
    role: "Sales Operations",
    riskLevel: "Low",
    healthScore: 79,
    mentalHealth: 1,
    motivation: 2,
    careerGrowth: 3,
    workLife: 3,
    distribution: { risk: 20, health: 62 },
  },
  {
    initials: "PS",
    name: "Priya Shah",
    role: "Content Strategist",
    riskLevel: "Medium",
    healthScore: 73,
    mentalHealth: 2,
    motivation: 3,
    careerGrowth: 2,
    workLife: 3,
    distribution: { risk: 57, health: 48 },
  },
  {
    initials: "OK",
    name: "Olivia Kim",
    role: "Finance Analyst",
    riskLevel: "Low",
    healthScore: 84,
    mentalHealth: 1,
    motivation: 2,
    careerGrowth: 3,
    workLife: 4,
    distribution: { risk: 33, health: 86 },
  },
  {
    initials: "BW",
    name: "Brian Wilson",
    role: "Customer Success",
    riskLevel: "High",
    healthScore: 62,
    mentalHealth: 3,
    motivation: 3,
    careerGrowth: 2,
    workLife: 3,
    distribution: { risk: 84, health: 53 },
  },
  {
    initials: "DO",
    name: "Daniel Moore",
    role: "Solutions Architect",
    riskLevel: "Low",
    healthScore: 76,
    mentalHealth: 1,
    motivation: 2,
    careerGrowth: 3,
    workLife: 3,
    distribution: { risk: 44, health: 66 },
  },
];

export const teamRiskFilters = [
  { label: "All", value: "all", count: teamMembers.length },
  { label: "High Risk", value: "High", count: 4 },
  { label: "Medium Risk", value: "Medium", count: 5 },
  { label: "Low Risk", value: "Low", count: 6 },
] as const;
