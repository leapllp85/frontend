import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Flag,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ActionItemStatus = "In Progress" | "Pending" | "Completed";
export type ActionItemPriority = "High" | "Medium" | "Low";
export type ActionItemSource =
  | "Team Health"
  | "Manager Survey"
  | "Wellness Survey"
  | "Project Risk"
  | "Other";

export type ActionItemMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: "primary" | "success" | "danger" | "warning" | "neutral";
  icon: LucideIcon;
  progress?: number;
};

export type ActionWeekDay = {
  day: string;
  date: string;
  isoDate: string;
  counts: readonly { value: string; color: string }[];
};

export type ActionItemHighlight = {
  id: string;
  title: string;
  description: string;
  tone: "primary" | "danger" | "warning" | "purple";
  icon: LucideIcon;
};

export type ActionSourceSegment = {
  label: ActionItemSource;
  value: number;
  percent: number;
  color: string;
};

type ActionItemTone = "primary" | "success" | "danger" | "warning";

export type ActionItemApiEntry = {
  id: string;
  dateLabel: string;
  dayLabel: string;
  title: string;
  description: string;
  owner: string;
  source: ActionItemSource;
  priority: ActionItemPriority;
  status: ActionItemStatus;
  dueLabel: string;
  dueSort: string;
};

export type ActionItemTimelineEntry = ActionItemApiEntry & {
  tone: ActionItemTone;
  icon: LucideIcon;
};

export const actionItemCopy = {
  title: "Action Items",
  subtitle: "Turn insights into measurable action.",
  createLabel: "Create Action Plan",
};

export const actionItemTabs = ["Due Soon", "Overdue", "Completed"] as const;
export type ActionItemTab = (typeof actionItemTabs)[number];

export const sources: readonly ("All sources" | ActionItemSource)[] = ["All sources", "Team Health", "Manager Survey", "Wellness Survey", "Project Risk", "Other"];
export const priorities: readonly ("All priorities" | ActionItemPriority)[] = ["All priorities", "High", "Medium", "Low"];

export const timelineItems: readonly ActionItemApiEntry[] = [
  {
    id: "reduce-allocation",
    dateLabel: "TODAY",
    dayLabel: "May 24",
    title: "Reduce Project Allocation",
    description: "Work with Christopher to reduce allocation from 95% to 80%",
    owner: "Christopher Lee",
    priority: "High",
    source: "Team Health",
    status: "In Progress",
    dueLabel: "2 days overdue",
    dueSort: "2024-05-22",
  },
  {
    id: "manager-1on1",
    dateLabel: "AUG 25",
    dayLabel: "Sunday",
    title: "Schedule 1-on-1 with Manager",
    description: "Discuss career development and well-being",
    owner: "Emily Rodriguez",
    priority: "Medium",
    source: "Manager Survey",
    status: "Pending",
    dueLabel: "Due today",
    dueSort: "2024-05-24",
  },
  {
    id: "review-allocation",
    dateLabel: "AUG 27",
    dayLabel: "Tuesday",
    title: "Review Team Allocation",
    description: "Assess current project allocations and identify overallocation issues",
    owner: "Jessica Taylor",
    priority: "Medium",
    source: "Team Health",
    status: "Pending",
    dueLabel: "Due in 2 days",
    dueSort: "2024-05-26",
  },
  {
    id: "stress-workshop",
    dateLabel: "AUG 30",
    dayLabel: "Friday",
    title: "Stress Management Workshop",
    description: "Organize workshop for the team on stress management techniques",
    owner: "James Anderson",
    priority: "High",
    source: "Wellness Survey",
    status: "Pending",
    dueLabel: "Due in 5 days",
    dueSort: "2024-05-29",
  },
  {
    id: "project-docs",
    dateLabel: "SEP 02",
    dayLabel: "Monday",
    title: "Update Project Documentation",
    description: "Complete documentation for Q3 projects",
    owner: "Michael Chen",
    priority: "Low",
    source: "Project Risk",
    status: "Completed",
    dueLabel: "Due in 8 days",
    dueSort: "2024-06-02",
  },
  {
    id: "handoff-plan",
    dateLabel: "SEP 05",
    dayLabel: "Thursday",
    title: "Create Handoff Plan",
    description: "Prepare a backup owner and transition notes for critical tasks",
    owner: "Christopher Lee",
    priority: "Medium",
    source: "Other",
    status: "Pending",
    dueLabel: "Due in 11 days",
    dueSort: "2024-06-05",
  },
] as const;

export const quickActions = [
  { id: "create", label: "Create Action Plan", icon: CheckCircle2 },
  { id: "export", label: "Export Actions", icon: Download },
  { id: "reports", label: "View Reports", icon: TrendingUp },
] as const;

export const sourceColors: Record<ActionItemSource, string> = {
  "Team Health": "#2563EB",
  "Manager Survey": "#6F42F5",
  "Wellness Survey": "#39BA85",
  "Project Risk": "#F97316",
  Other: "#71809B",
};

export const priorityColors: Record<ActionItemPriority, string> = {
  High: "#EF4444",
  Medium: "#F97316",
  Low: "#39BA85",
};

export const statusStyles: Record<ActionItemStatus, { bg: string; color: string; border: string }> = {
  "In Progress": { bg: "#FFF7F5", color: "#EF4444", border: "#FACAC5" },
  Pending: { bg: "#FFF8EF", color: "#F97316", border: "#FFD9AF" },
  Completed: { bg: "#F0FBF6", color: "#179C67", border: "#BEEBD8" },
};

const weekDates = [
  { day: "MON", date: "20", isoDate: "2024-05-20" },
  { day: "TUE", date: "21", isoDate: "2024-05-21" },
  { day: "WED", date: "22", isoDate: "2024-05-22" },
  { day: "THU", date: "23", isoDate: "2024-05-23" },
  { day: "FRI", date: "24", isoDate: "2024-05-24" },
  { day: "SAT", date: "25", isoDate: "2024-05-25" },
  { day: "SUN", date: "26", isoDate: "2024-05-26" },
] as const;

const sourceOrder: readonly ActionItemSource[] = ["Team Health", "Manager Survey", "Wellness Survey", "Project Risk", "Other"];
const weekStart = "2024-05-20";
const weekEnd = "2024-05-26";

function isOverdue(item: ActionItemApiEntry) {
  return item.dueLabel.toLowerCase().includes("overdue");
}

function isDueThisWeek(item: ActionItemApiEntry) {
  return item.dueSort >= weekStart && item.dueSort <= weekEnd && item.status !== "Completed";
}

function getActionTone(item: ActionItemApiEntry): ActionItemTone {
  if (item.status === "Completed") return "success";
  if (isOverdue(item) || item.priority === "High") return "danger";
  if (item.priority === "Medium" || item.dueLabel.toLowerCase().includes("today")) return "warning";
  return "primary";
}

function getActionIcon(item: ActionItemApiEntry): LucideIcon {
  if (item.status === "Completed") return CheckCircle2;
  if (isOverdue(item) || item.priority === "High") return AlertTriangle;
  if (item.source === "Team Health") return Activity;
  if (item.source === "Project Risk") return FileText;
  if (item.dueLabel.toLowerCase().includes("today")) return Clock3;
  return FileText;
}

function getWeekCountColor(item: ActionItemApiEntry) {
  if (isOverdue(item) || item.priority === "High") return priorityColors.High;
  if (item.priority === "Medium") return priorityColors.Medium;
  if (item.status === "Completed") return priorityColors.Low;
  return sourceColors[item.source];
}

function groupCountsByColor(items: readonly ActionItemApiEntry[]) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    const color = getWeekCountColor(item);
    acc[color] = (acc[color] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([color, value]) => ({ value: String(value), color }));
}

export const actionTimelineItems: readonly ActionItemTimelineEntry[] = timelineItems.map((item) => ({
  ...item,
  tone: getActionTone(item),
  icon: getActionIcon(item),
}));

export const weekDays: readonly ActionWeekDay[] = weekDates.map((day) => ({
  ...day,
  counts: groupCountsByColor(timelineItems.filter((item) => item.dueSort === day.isoDate)),
}));

const overdueCount = timelineItems.filter(isOverdue).length;
const dueThisWeekCount = timelineItems.filter(isDueThisWeek).length;
const highPriorityCount = timelineItems.filter((item) => item.priority === "High" && item.status !== "Completed").length;

export const upcomingHighlights: readonly ActionItemHighlight[] = [
  {
    id: "overdue",
    title: `${overdueCount} ${overdueCount === 1 ? "action is" : "actions are"} overdue`,
    description: "Require immediate attention",
    tone: "danger",
    icon: AlertTriangle,
  },
  {
    id: "due-week",
    title: `${dueThisWeekCount} ${dueThisWeekCount === 1 ? "action" : "actions"} due this week`,
    description: "Stay on track to meet deadlines",
    tone: "warning",
    icon: Clock3,
  },
  {
    id: "high-priority",
    title: `${highPriorityCount} high priority ${highPriorityCount === 1 ? "action" : "actions"}`,
    description: "Focus on critical items first",
    tone: "purple",
    icon: Flag,
  },
];

export const sourceSegments: readonly ActionSourceSegment[] = sourceOrder
  .map((source) => {
    const value = timelineItems.filter((item) => item.source === source).length;
    return {
      label: source,
      value,
      percent: timelineItems.length === 0 ? 0 : Math.round((value / timelineItems.length) * 100),
      color: sourceColors[source],
    };
  })
  .filter((segment) => segment.value > 0);

const completedCount = timelineItems.filter((item) => item.status === "Completed").length;
const openCount = timelineItems.length - completedCount;
const completionRate = timelineItems.length === 0 ? 0 : Math.round((completedCount / timelineItems.length) * 100);

export const actionItemMetrics: readonly ActionItemMetric[] = [
  {
    id: "total",
    label: "Total Actions",
    value: String(timelineItems.length),
    helper: "Your action items",
    tone: "primary",
    icon: FileText,
  },
  {
    id: "open",
    label: "Open",
    value: String(openCount),
    helper: "Items in progress",
    tone: "success",
    icon: Clock3,
  },
  {
    id: "overdue",
    label: "Overdue",
    value: String(overdueCount),
    helper: "Require immediate attention",
    tone: "danger",
    icon: AlertTriangle,
  },
  {
    id: "due-soon",
    label: "Due Soon",
    value: String(dueThisWeekCount),
    helper: "Due this week",
    tone: "warning",
    icon: RefreshCw,
  },
  {
    id: "completion",
    label: "Completion Rate",
    value: `${completionRate}%`,
    helper: `${completedCount} completed`,
    tone: "neutral",
    icon: CheckCircle2,
    progress: completionRate,
  },
];
