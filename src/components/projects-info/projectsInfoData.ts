import {
  BarChart3,
  Boxes,
  DollarSign,
  Layers3,
  Monitor,
  Package,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/types/styles";

export type ProjectPulseMetric = {
  label: string;
  value: string;
  dotColor?: string;
};

export type ProjectPulseData = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  metrics: readonly ProjectPulseMetric[];
  trendLabel: string;
  trendValue: string;
};

export const projectPulseData: ProjectPulseData = {
  title: "Project Pulse",
  subtitle: "Overview of all projects",
  icon: Sparkles,
  metrics: [
    {
      label: "Total Projects",
      value: "20",
    },
    {
      label: "Active",
      value: "20",
      dotColor: colors.success,
    },
    {
      label: "High Priority",
      value: "8",
      dotColor: "#FF4758",
    },
    {
      label: "Medium Priority",
      value: "7",
      dotColor: "#FF9F1A",
    },
    {
      label: "Low Priority",
      value: "5",
      dotColor: "#FF9F1A",
    },
  ],
  trendLabel: "On track",
  trendValue: "75%",
};

export type ProjectCriticality = "High" | "Medium" | "Low";
export type ProjectStatus = "Active" | "Paused" | "Completed";
export type ProjectBusinessUnit =
  | "Digital"
  | "Supply Chain"
  | "Operations"
  | "Finance"
  | "Merchandising";

export type ProjectContributor = {
  initials: string;
  name: string;
  role: string;
  avatarUrl: string;
  bg: string;
  color: string;
};

export type ProjectInfo = {
  id: string;
  projectId: string;
  name: string;
  businessUnit: ProjectBusinessUnit;
  memberCount: number;
  startDate: string;
  goLiveDate: string;
  progress: number;
  criticality: ProjectCriticality;
  status: ProjectStatus;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  contributors: readonly ProjectContributor[];
};

export const projectCriticalityStyles: Record<
  ProjectCriticality,
  { color: string; bg: string }
> = {
  High: {
    color: colors.danger,
    bg: "#FDEDEA",
  },
  Medium: {
    color: "#D97706",
    bg: "#FFF3DE",
  },
  Low: {
    color: colors.success,
    bg: "#E8F8F0",
  },
};

export const projectStatusStyles: Record<ProjectStatus, { color: string; bg: string }> = {
  Active: {
    color: colors.success,
    bg: "#E8F8F0",
  },
  Paused: {
    color: "#D97706",
    bg: "#FFF3DE",
  },
  Completed: {
    color: colors.primary,
    bg: colors.primarySoft,
  },
};

export const businessUnitOptions = [
  "All",
  "Digital",
  "Supply Chain",
  "Operations",
  "Finance",
  "Merchandising",
] as const;

export const criticalityOptions = ["All", "High", "Medium", "Low"] as const;
export const statusOptions = ["All", "Active", "Paused", "Completed"] as const;

const contributors: Record<string, ProjectContributor> = {
  sarah: {
    initials: "SJ",
    name: "Sarah Johnson",
    role: "Sr. Product Designer",
    avatarUrl: "https://i.pravatar.cc/160?img=47",
    bg: "#FDEDEA",
    color: colors.danger,
  },
  emily: {
    initials: "ER",
    name: "Emily Rodriguez",
    role: "UX Researcher",
    avatarUrl: "https://i.pravatar.cc/160?img=32",
    bg: "#F1EDFF",
    color: "#7B61FF",
  },
  james: {
    initials: "JA",
    name: "James Anderson",
    role: "Frontend Developer",
    avatarUrl: "https://i.pravatar.cc/160?img=59",
    bg: "#FFF3DE",
    color: "#D97706",
  },
  david: {
    initials: "DM",
    name: "David Martinez",
    role: "Backend Developer",
    avatarUrl: "https://i.pravatar.cc/160?img=12",
    bg: "#E8F8F0",
    color: colors.success,
  },
  lisa: {
    initials: "LP",
    name: "Lisa Patel",
    role: "QA Engineer",
    avatarUrl: "https://i.pravatar.cc/160?img=44",
    bg: colors.primarySoft,
    color: colors.primary,
  },
};

export const projectsInfoList: readonly ProjectInfo[] = [
  {
    id: "ecommerce-platform-redesign",
    projectId: "PRJ-1001",
    name: "E-Commerce Platform Redesign",
    businessUnit: "Digital",
    memberCount: 12,
    startDate: "Jan 15, 2024",
    goLiveDate: "Jun 30, 2024",
    progress: 75,
    criticality: "High",
    status: "Active",
    description:
      "Complete overhaul of the customer-facing e-commerce platform with modern UI/UX.",
    icon: Monitor,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.sarah, contributors.emily, contributors.james],
  },
  {
    id: "supply-chain-optimization",
    projectId: "PRJ-1002",
    name: "Supply Chain Optimization",
    businessUnit: "Supply Chain",
    memberCount: 8,
    startDate: "Feb 1, 2024",
    goLiveDate: "Aug 15, 2024",
    progress: 60,
    criticality: "High",
    status: "Active",
    description:
      "Improve fulfillment planning, inventory movement, and supplier coordination.",
    icon: Package,
    iconBg: "#E8F8F0",
    iconColor: colors.success,
    contributors: [contributors.david, contributors.lisa, contributors.sarah],
  },
  {
    id: "customer-analytics-dashboard",
    projectId: "PRJ-1003",
    name: "Customer Analytics Dashboard",
    businessUnit: "Digital",
    memberCount: 6,
    startDate: "Jan 20, 2024",
    goLiveDate: "May 30, 2024",
    progress: 85,
    criticality: "Medium",
    status: "Active",
    description:
      "Centralized analytics workspace for customer journeys, cohorts, and revenue signals.",
    icon: BarChart3,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.emily, contributors.james, contributors.david],
  },
  {
    id: "inventory-management-system",
    projectId: "PRJ-1004",
    name: "Inventory Management System",
    businessUnit: "Operations",
    memberCount: 10,
    startDate: "Mar 1, 2024",
    goLiveDate: "Sep 30, 2024",
    progress: 55,
    criticality: "High",
    status: "Active",
    description:
      "Operational tooling for stock visibility, reorder alerts, and warehouse controls.",
    icon: Layers3,
    iconBg: "#F1EDFF",
    iconColor: "#7B61FF",
    contributors: [contributors.david, contributors.sarah, contributors.lisa],
  },
  {
    id: "financial-reporting-automation",
    projectId: "PRJ-1005",
    name: "Financial Reporting Automation",
    businessUnit: "Finance",
    memberCount: 7,
    startDate: "Feb 15, 2024",
    goLiveDate: "Jul 31, 2024",
    progress: 65,
    criticality: "Medium",
    status: "Active",
    description:
      "Automated reporting pipelines for finance close, forecasts, and compliance views.",
    icon: DollarSign,
    iconBg: "#FFF3DE",
    iconColor: "#F58220",
    contributors: [contributors.james, contributors.emily, contributors.lisa],
  },
  {
    id: "product-catalog-expansion",
    projectId: "PRJ-1006",
    name: "Product Catalog Expansion",
    businessUnit: "Merchandising",
    memberCount: 5,
    startDate: "Jan 10, 2024",
    goLiveDate: "Jun 15, 2024",
    progress: 55,
    criticality: "Medium",
    status: "Active",
    description:
      "Catalog scale-up with richer taxonomy, merchandising controls, and validation tools.",
    icon: ShoppingBag,
    iconBg: "#FDEDEA",
    iconColor: colors.danger,
    contributors: [contributors.sarah, contributors.david, contributors.james],
  },
  {
    id: "mobile-app-development",
    projectId: "PRJ-1007",
    name: "Mobile App Development",
    businessUnit: "Digital",
    memberCount: 11,
    startDate: "Feb 20, 2024",
    goLiveDate: "Oct 31, 2024",
    progress: 40,
    criticality: "High",
    status: "Active",
    description:
      "Native mobile experience for account management, discovery, and push workflows.",
    icon: Smartphone,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.lisa, contributors.emily, contributors.david],
  },
  {
    id: "warehouse-automation",
    projectId: "PRJ-1008",
    name: "Warehouse Automation",
    businessUnit: "Operations",
    memberCount: 9,
    startDate: "Mar 15, 2024",
    goLiveDate: "Nov 30, 2024",
    progress: 35,
    criticality: "High",
    status: "Active",
    description:
      "Automation program for receiving, picking, packing, and warehouse visibility.",
    icon: Boxes,
    iconBg: "#F1EDFF",
    iconColor: "#7B61FF",
    contributors: [contributors.david, contributors.james, contributors.sarah],
  },
  {
    id: "loyalty-program-refresh",
    projectId: "PRJ-1009",
    name: "Loyalty Program Refresh",
    businessUnit: "Digital",
    memberCount: 6,
    startDate: "Apr 1, 2024",
    goLiveDate: "Dec 15, 2024",
    progress: 30,
    criticality: "Low",
    status: "Active",
    description:
      "Refresh of rewards, segmentation rules, and customer engagement surfaces.",
    icon: ShoppingBag,
    iconBg: "#FFF3DE",
    iconColor: "#F58220",
    contributors: [contributors.sarah, contributors.lisa, contributors.emily],
  },
  {
    id: "returns-portal-modernization",
    projectId: "PRJ-1010",
    name: "Returns Portal Modernization",
    businessUnit: "Operations",
    memberCount: 4,
    startDate: "Apr 12, 2024",
    goLiveDate: "Sep 1, 2024",
    progress: 50,
    criticality: "Low",
    status: "Active",
    description:
      "Self-service return flows with updated eligibility rules and logistics tracking.",
    icon: Package,
    iconBg: "#E8F8F0",
    iconColor: colors.success,
    contributors: [contributors.james, contributors.david, contributors.lisa],
  },
  {
    id: "pricing-rules-engine",
    projectId: "PRJ-1011",
    name: "Pricing Rules Engine",
    businessUnit: "Finance",
    memberCount: 8,
    startDate: "May 4, 2024",
    goLiveDate: "Jan 15, 2025",
    progress: 22,
    criticality: "Medium",
    status: "Active",
    description:
      "Pricing controls, approval workflows, and audit-ready rule management.",
    icon: DollarSign,
    iconBg: "#FFF3DE",
    iconColor: "#F58220",
    contributors: [contributors.emily, contributors.david, contributors.sarah],
  },
  {
    id: "vendor-scorecard",
    projectId: "PRJ-1012",
    name: "Vendor Scorecard",
    businessUnit: "Supply Chain",
    memberCount: 5,
    startDate: "May 20, 2024",
    goLiveDate: "Nov 15, 2024",
    progress: 48,
    criticality: "Low",
    status: "Active",
    description:
      "Shared vendor performance view for delivery, quality, cost, and risk signals.",
    icon: BarChart3,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.lisa, contributors.james, contributors.david],
  },
  {
    id: "regional-fulfillment-rollout",
    projectId: "PRJ-1013",
    name: "Regional Fulfillment Rollout",
    businessUnit: "Supply Chain",
    memberCount: 9,
    startDate: "Jun 1, 2024",
    goLiveDate: "Feb 28, 2025",
    progress: 28,
    criticality: "High",
    status: "Active",
    description:
      "Regional fulfillment launch with new carrier rules, routing logic, and capacity planning.",
    icon: Package,
    iconBg: "#E8F8F0",
    iconColor: colors.success,
    contributors: [contributors.david, contributors.sarah, contributors.james],
  },
  {
    id: "security-access-review",
    projectId: "PRJ-1014",
    name: "Security Access Review",
    businessUnit: "Operations",
    memberCount: 6,
    startDate: "Jun 10, 2024",
    goLiveDate: "Oct 20, 2024",
    progress: 62,
    criticality: "High",
    status: "Active",
    description:
      "Access cleanup and review workflow for critical operational and administrative systems.",
    icon: Layers3,
    iconBg: "#FDEDEA",
    iconColor: colors.danger,
    contributors: [contributors.lisa, contributors.david, contributors.emily],
  },
  {
    id: "checkout-performance-upgrade",
    projectId: "PRJ-1015",
    name: "Checkout Performance Upgrade",
    businessUnit: "Digital",
    memberCount: 7,
    startDate: "Jun 18, 2024",
    goLiveDate: "Dec 5, 2024",
    progress: 44,
    criticality: "High",
    status: "Active",
    description:
      "Performance improvements across checkout, payment authorization, and order placement.",
    icon: Monitor,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.sarah, contributors.james, contributors.david],
  },
  {
    id: "campaign-planning-suite",
    projectId: "PRJ-1016",
    name: "Campaign Planning Suite",
    businessUnit: "Merchandising",
    memberCount: 5,
    startDate: "Jul 2, 2024",
    goLiveDate: "Jan 10, 2025",
    progress: 33,
    criticality: "Medium",
    status: "Active",
    description:
      "Planning tools for promotions, category calendars, creative review, and launch readiness.",
    icon: ShoppingBag,
    iconBg: "#FFF3DE",
    iconColor: "#F58220",
    contributors: [contributors.emily, contributors.sarah, contributors.lisa],
  },
  {
    id: "data-quality-monitoring",
    projectId: "PRJ-1017",
    name: "Data Quality Monitoring",
    businessUnit: "Digital",
    memberCount: 6,
    startDate: "Jul 15, 2024",
    goLiveDate: "Nov 8, 2024",
    progress: 58,
    criticality: "Medium",
    status: "Active",
    description:
      "Monitoring and alerting for customer, product, and operational data reliability.",
    icon: BarChart3,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.james, contributors.david, contributors.lisa],
  },
  {
    id: "invoice-reconciliation",
    projectId: "PRJ-1018",
    name: "Invoice Reconciliation",
    businessUnit: "Finance",
    memberCount: 4,
    startDate: "Aug 1, 2024",
    goLiveDate: "Feb 14, 2025",
    progress: 26,
    criticality: "Medium",
    status: "Active",
    description:
      "Finance reconciliation automation for invoices, exceptions, and approval handoffs.",
    icon: DollarSign,
    iconBg: "#FFF3DE",
    iconColor: "#F58220",
    contributors: [contributors.david, contributors.emily, contributors.sarah],
  },
  {
    id: "content-localization",
    projectId: "PRJ-1019",
    name: "Content Localization",
    businessUnit: "Merchandising",
    memberCount: 5,
    startDate: "Aug 12, 2024",
    goLiveDate: "Mar 18, 2025",
    progress: 18,
    criticality: "Low",
    status: "Active",
    description:
      "Localization workflows for product content, regional campaigns, and compliance copy.",
    icon: Layers3,
    iconBg: "#F1EDFF",
    iconColor: "#7B61FF",
    contributors: [contributors.sarah, contributors.lisa, contributors.james],
  },
  {
    id: "partner-api-enablement",
    projectId: "PRJ-1020",
    name: "Partner API Enablement",
    businessUnit: "Digital",
    memberCount: 8,
    startDate: "Aug 20, 2024",
    goLiveDate: "Apr 30, 2025",
    progress: 15,
    criticality: "Low",
    status: "Active",
    description:
      "External partner API foundation for catalog access, order updates, and service events.",
    icon: Smartphone,
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    contributors: [contributors.james, contributors.david, contributors.emily],
  },
];
