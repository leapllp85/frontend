import type { LucideIcon } from "lucide-react";
import { Folder, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { colors } from "../../types/styles";

export const navItems = ["Overview", "Team", "Projects", "Analytics", "Survey"];

export type SummaryMetric = {
  label: string;
  value: string;
  valueColor: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend: string;
  trendPrefix: "up" | "flat";
};

export const summaryMetrics: readonly SummaryMetric[] = [
  {
    label: "Team Members",
    value: "15",
    valueColor: colors.primaryText,
    icon: Users,
    iconColor: colors.primary,
    iconBg: "#EEF3FF",
    trend: "12%",
    trendPrefix: "up",
  },
  {
    label: "Total Projects",
    value: "20",
    valueColor: colors.primaryText,
    icon: Folder,
    iconColor: colors.primary,
    iconBg: colors.primarySoft,
    trend: "8%",
    trendPrefix: "up",
  },
  {
    label: "Attrition Risk",
    value: "47%",
    valueColor: colors.danger,
    icon: TrendingUp,
    iconColor: colors.danger,
    iconBg: "#FDEDEA",
    trend: "12%",
    trendPrefix: "up",
  },
  {
    label: "Projects At Risk",
    value: "0",
    valueColor: colors.primaryText,
    icon: ShieldCheck,
    iconColor: colors.primary,
    iconBg: colors.primarySoft,
    trend: "0%",
    trendPrefix: "flat",
  },
];

export const attritionOverview = [
  { label: "At Risk", value: 47, color: colors.primary },
  { label: "Neutral", value: 33, color: colors.primaryLight },
  { label: "Low Risk", value: 20, color: colors.success },
] as const;

export const attritionTrend = {
  labels: ["Feb '25", "Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25"],
  values: [170, 105, 310, 245, 180, 475],
};

export const attritionDrivers = [
  { label: "Mental Health", value: 35, color: colors.primary },
  { label: "Motivation", value: 28, color: colors.primaryLight },
  { label: "Career Opportunities", value: 22, color: colors.success },
  { label: "Work-Life Balance", value: 15, color: colors.warning },
] as const;

export const criticalMembers = [
  {
    name: "Alice Brown",
    initials: "AB",
    risk: "High Risk",
    score: "9.2",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #FF9A7A 0%, #8B2F24 100%)",
    sparkline: [18, 15, 10, 14, 12, 16],
  },
  {
    name: "David Martinez",
    initials: "DM",
    risk: "High Risk",
    score: "8.7",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #B7D0E9 0%, #2C415C 100%)",
    sparkline: [12, 16, 18, 13, 17, 16],
  },
  {
    name: "Maya Patel",
    initials: "MP",
    risk: "High Risk",
    score: "8.5",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #F7B56A 0%, #A74B26 100%)",
    sparkline: [18, 17, 12, 14, 11, 15],
  },
  {
    name: "Jane Smith",
    initials: "JS",
    risk: "Medium Risk",
    score: "6.3",
    color: colors.warning,
    avatar: "linear-gradient(135deg, #F8D5C9 0%, #C87E67 100%)",
    sparkline: [12, 15, 11, 16, 12, 14],
  },
  {
    name: "Marcus Thompson",
    initials: "MT",
    risk: "High Risk",
    score: "8.1",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #5D7FA0 0%, #101B2C 100%)",
    sparkline: [10, 14, 17, 12, 15, 13],
  },
] as const;

export const projectStatuses = [
  { label: "On Track", value: 10, percentage: 50, color: colors.success },
  { label: "At Risk", value: 6, percentage: 30, color: colors.warning },
  { label: "Delayed", value: 3, percentage: 15, color: colors.danger },
  { label: "Completed", value: 1, percentage: 5, color: colors.primary },
] as const;

export const upcomingDeadlines = [
  {
    month: "AUG",
    day: "10",
    title: "E-Commerce Platform Redesign",
    risk: "High Risk",
    riskColor: colors.danger,
    daysLeft: "8 Days Left",
    badgeColor: colors.danger,
    dateBg: colors.primarySoft,
    dateColor: colors.primary,
  },
  {
    month: "AUG",
    day: "15",
    title: "Supply Chain Optimization",
    risk: "High Risk",
    riskColor: colors.danger,
    daysLeft: "13 Days Left",
    badgeColor: colors.primary,
    dateBg: colors.primarySoft,
    dateColor: colors.primary,
  },
  {
    month: "SEP",
    day: "10",
    title: "Inventory Management System",
    risk: "Medium Risk",
    riskColor: colors.warning,
    daysLeft: "39 Days Left",
    badgeColor: colors.success,
    dateBg: "#E8F8F0",
    dateColor: colors.success,
  },
  {
    month: "OCT",
    day: "25",
    title: "Mobile App Development",
    risk: "High Risk",
    riskColor: colors.danger,
    daysLeft: "84 Days Left",
    badgeColor: colors.warning,
    dateBg: "#FDEDEA",
    dateColor: colors.warning,
  },
] as const;

const nearingDeadlineDaysThreshold = 14;

function getDaysRemaining(daysLeft: string) {
  const matchedDays = daysLeft.match(/(\d+)/);
  return matchedDays ? Number(matchedDays[1]) : Number.POSITIVE_INFINITY;
}

export const nearingDeadlineProjectsCount = upcomingDeadlines.filter(
  (deadline) => getDaysRemaining(deadline.daysLeft) <= nearingDeadlineDaysThreshold,
).length;
