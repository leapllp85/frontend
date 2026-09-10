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

export const actionItemTabs = ["All", "Due Soon", "Overdue", "Completed"] as const;
export type ActionItemTab = (typeof actionItemTabs)[number];

export const sources: readonly ("All sources" | ActionItemSource)[] = ["All sources", "Team Health", "Manager Survey", "Wellness Survey", "Project Risk", "Other"];
export const priorities: readonly ("All priorities" | ActionItemPriority)[] = ["All priorities", "High", "Medium", "Low"];

function buildTimelineItem({
  offsetDays,
  ...item
}: Omit<ActionItemApiEntry, "dateLabel" | "dayLabel" | "dueLabel" | "dueSort"> & { offsetDays: number }): ActionItemApiEntry {
  const dueDate = addDays(new Date(), offsetDays);

  return {
    ...item,
    dateLabel: formatTimelineDateLabel(dueDate),
    dayLabel: formatTimelineDayLabel(dueDate),
    dueLabel: buildDueLabel(dueDate),
    dueSort: toIsoDate(dueDate),
  };
}

export const timelineItems: readonly ActionItemApiEntry[] = [
  buildTimelineItem({
    id: "reduce-allocationn",
    title: "Reduce Project Allocation",
    description: "Work with Christopher to reduce allocation from 95% to 80%",
    owner: "Christopher Lee",
    priority: "High",
    source: "Team Health",
    status: "In Progress",
    offsetDays: -7,
  }),
  buildTimelineItem({
    id: "reduce-allocationnn",
    title: "Reduce Project Allocation",
    description: "Work with Christopher to reduce allocation from 95% to 80%",
    owner: "Christopher Lee",
    priority: "High",
    source: "Team Health",
    status: "In Progress",
    offsetDays: -5,
  }),
  buildTimelineItem({
    id: "reduce-allocation",
    title: "Reduce Project Allocation",
    description: "Work with Christopher to reduce allocation from 95% to 80%",
    owner: "Christopher Lee",
    priority: "High",
    source: "Team Health",
    status: "In Progress",
    offsetDays: 0,
  }),
  buildTimelineItem({
    id: "manager-1on1",
    title: "Schedule 1-on-1 with Manager",
    description: "Discuss career development and well-being",
    owner: "Emily Rodriguez",
    priority: "Medium",
    source: "Manager Survey",
    status: "Pending",
    offsetDays: 0,
  }),
  buildTimelineItem({
    id: "review-allocation",
    title: "Review Team Allocation",
    description: "Assess current project allocations and identify overallocation issues",
    owner: "Jessica Taylor",
    priority: "Medium",
    source: "Team Health",
    status: "Pending",
    offsetDays: 2,
  }),
  buildTimelineItem({
    id: "stress-workshop",
    title: "Stress Management Workshop",
    description: "Organize workshop for the team on stress management techniques",
    owner: "James Anderson",
    priority: "High",
    source: "Wellness Survey",
    status: "Pending",
    offsetDays: 5,
  }),
  buildTimelineItem({
    id: "project-docs",
    title: "Update Project Documentation",
    description: "Complete documentation for Q3 projects",
    owner: "Michael Chen",
    priority: "Low",
    source: "Project Risk",
    status: "Completed",
    offsetDays: 8,
  }),
  buildTimelineItem({
    id: "handoff-plan",
    title: "Create Handoff Plan",
    description: "Prepare a backup owner and transition notes for critical tasks",
    owner: "Christopher Lee",
    priority: "Medium",
    source: "Other",
    status: "Pending",
    offsetDays: 11,
  }),
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

const sourceOrder: readonly ActionItemSource[] = ["Team Health", "Manager Survey", "Wellness Survey", "Project Risk", "Other"];

type CalendarDateValue = Date | string | number;

function normalizeCalendarDate(date: CalendarDateValue) {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  const normalizedDate = new Date(date);
  return Number.isNaN(normalizedDate.getTime()) ? new Date() : normalizedDate;
}

export function toIsoDate(date: CalendarDateValue) {
  const normalizedDate = normalizeCalendarDate(date);
  const year = normalizedDate.getFullYear();
  const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
  const day = String(normalizedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(date: CalendarDateValue, days: number) {
  const nextDate = new Date(normalizeCalendarDate(date));
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function getStartOfWeek(date: CalendarDateValue) {
  const normalizedDate = normalizeCalendarDate(date);
  const weekStart = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate());
  const dayIndex = weekStart.getDay();
  const daysFromMonday = dayIndex === 0 ? 6 : dayIndex - 1;
  weekStart.setDate(weekStart.getDate() - daysFromMonday);
  return weekStart;
}

export function formatWeekRangeLabel(weekStartDate: CalendarDateValue) {
  const normalizedWeekStartDate = normalizeCalendarDate(weekStartDate);
  const weekEndDate = addDays(normalizedWeekStartDate, 6);
  const startMonth = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(normalizedWeekStartDate);
  const endMonth = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(weekEndDate);
  const startDay = normalizedWeekStartDate.getDate();
  const endDay = weekEndDate.getDate();

  if (normalizedWeekStartDate.getFullYear() !== weekEndDate.getFullYear()) {
    return `${startDay} ${startMonth} ${normalizedWeekStartDate.getFullYear()} - ${endDay} ${endMonth} ${weekEndDate.getFullYear()}`;
  }

  if (startMonth !== endMonth) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }

  return `${startMonth} ${startDay} - ${endDay}`;
}

function formatTimelineDateLabel(date: CalendarDateValue) {
  const normalizedDate = normalizeCalendarDate(date);
  const today = new Date();
  const tomorrow = addDays(today, 1);

  if (toIsoDate(normalizedDate) === toIsoDate(today)) {
    return "TODAY";
  }

  if (toIsoDate(normalizedDate) === toIsoDate(tomorrow)) {
    return "TOMORROW";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(normalizedDate).toUpperCase();
}

function formatTimelineDayLabel(date: CalendarDateValue) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(normalizeCalendarDate(date));
}

function buildDueLabel(date: CalendarDateValue) {
  const normalizedDate = normalizeCalendarDate(date);
  const today = normalizeCalendarDate(new Date());
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate());
  const diffDays = Math.round((due.getTime() - current.getTime()) / 86400000);

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return `${overdueDays} ${overdueDays === 1 ? "day" : "days"} overdue`;
  }

  if (diffDays === 0) {
    return "Due today";
  }

  return `Due in ${diffDays} ${diffDays === 1 ? "day" : "days"}`;
}

function getWeekDates(weekStartDate: CalendarDateValue) {
  const normalizedWeekStartDate = normalizeCalendarDate(weekStartDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(normalizedWeekStartDate, index);
    return {
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date).toUpperCase(),
      date: String(date.getDate()),
      isoDate: toIsoDate(date),
    };
  });
}

export function isOverdue(item: ActionItemApiEntry) {
  return item.dueLabel.toLowerCase().includes("overdue");
}

export function isDueThisWeek(item: ActionItemApiEntry, referenceDate: CalendarDateValue = new Date()) {
  const weekStart = getStartOfWeek(referenceDate);
  const weekEnd = addDays(weekStart, 6);
  return item.dueSort >= toIsoDate(weekStart) && item.dueSort <= toIsoDate(weekEnd) && item.status !== "Completed";
}

export function getActionTone(item: ActionItemApiEntry): ActionItemTone {
  if (item.status === "Completed") return "success";
  if (isOverdue(item) || item.priority === "High") return "danger";
  if (item.priority === "Medium" || item.dueLabel.toLowerCase().includes("today")) return "warning";
  return "primary";
}

export function getActionIcon(item: ActionItemApiEntry): LucideIcon {
  if (item.status === "Completed") return CheckCircle2;
  if (isOverdue(item) || item.priority === "High") return AlertTriangle;
  if (item.source === "Team Health") return Activity;
  if (item.source === "Project Risk") return FileText;
  if (item.dueLabel.toLowerCase().includes("today")) return Clock3;
  return FileText;
}

export function getWeekCountColor(item: ActionItemApiEntry) {
  if (isOverdue(item) || item.priority === "High") return priorityColors.High;
  if (item.priority === "Medium") return priorityColors.Medium;
  if (item.status === "Completed") return priorityColors.Low;
  return sourceColors[item.source];
}

export function groupCountsByColor(items: readonly ActionItemApiEntry[]) {
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

export const weekDays: readonly ActionWeekDay[] = getWeekDates(getStartOfWeek(new Date())).map((day) => ({
  ...day,
  counts: groupCountsByColor(timelineItems.filter((item) => item.dueSort === day.isoDate)),
}));

export function buildActionTimelineItems(items: readonly ActionItemApiEntry[]): ActionItemTimelineEntry[] {
  return items.map((item) => ({
    ...item,
    tone: getActionTone(item),
    icon: getActionIcon(item),
  }));
}

export function buildWeekDays(items: readonly ActionItemApiEntry[], weekStartDate: CalendarDateValue = getStartOfWeek(new Date())): ActionWeekDay[] {
  return getWeekDates(weekStartDate).map((day) => ({
    ...day,
    counts: groupCountsByColor(items.filter((item) => item.dueSort === day.isoDate)),
  }));
}

const overdueCount = timelineItems.filter(isOverdue).length;
const dueThisWeekCount = timelineItems.filter(isDueThisWeek).length;
const highPriorityCount = timelineItems.filter((item) => item.priority === "High" && item.status !== "Completed").length;

// export const upcomingHighlights: readonly ActionItemHighlight[] = [
//   {
//     id: "overdue",
//     title: `${overdueCount} ${overdueCount === 1 ? "action is" : "actions are"} overdue`,
//     description: "Require immediate attention",
//     tone: "danger",
//     icon: AlertTriangle,
//   },
//   {
//     id: "due-week",
//     title: `${dueThisWeekCount} ${dueThisWeekCount === 1 ? "action" : "actions"} due this week`,
//     description: "Stay on track to meet deadlines",
//     tone: "warning",
//     icon: Clock3,
//   },
//   {
//     id: "high-priority",
//     title: `${highPriorityCount} high priority ${highPriorityCount === 1 ? "action" : "actions"}`,
//     description: "Focus on critical items first",
//     tone: "purple",
//     icon: Flag,
//   },
// ];

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

export function buildUpcomingHighlights(items: readonly ActionItemApiEntry[]): ActionItemHighlight[] {
  const itemOverdueCount = items.filter(isOverdue).length;
  const itemDueThisWeekCount = items.filter(isDueThisWeek).length;
  const itemHighPriorityCount = items.filter((item) => item.priority === "High" && item.status !== "Completed").length;

  return [
    {
      id: "overdue",
      title: `${itemOverdueCount} ${itemOverdueCount === 1 ? "action is" : "actions are"} overdue`,
      description: "Require immediate attention",
      tone: "danger",
      icon: AlertTriangle,
    },
    {
      id: "due-week",
      title: `${itemDueThisWeekCount} ${itemDueThisWeekCount === 1 ? "action" : "actions"} due this week`,
      description: "Stay on track to meet deadlines",
      tone: "warning",
      icon: Clock3,
    },
    {
      id: "high-priority",
      title: `${itemHighPriorityCount} high priority ${itemHighPriorityCount === 1 ? "action" : "actions"}`,
      description: "Focus on critical items first",
      tone: "purple",
      icon: Flag,
    },
  ];
}

export function buildSourceSegments(items: readonly ActionItemApiEntry[]): ActionSourceSegment[] {
  return sourceOrder
    .map((source) => {
      const value = items.filter((item) => item.source === source).length;
      return {
        label: source,
        value,
        percent: items.length === 0 ? 0 : Math.round((value / items.length) * 100),
        color: sourceColors[source],
      };
    })
    .filter((segment) => segment.value > 0);
}

export function buildActionItemMetrics(items: readonly ActionItemApiEntry[]): ActionItemMetric[] {
  const itemOverdueCount = items.filter(isOverdue).length;
  const itemDueThisWeekCount = items.filter(isDueThisWeek).length;
  const itemCompletedCount = items.filter((item) => item.status === "Completed").length;
  const itemOpenCount = items.length - itemCompletedCount;
  const itemCompletionRate = items.length === 0 ? 0 : Math.round((itemCompletedCount / items.length) * 100);

  return [
    {
      id: "total",
      label: "Total Actions",
      value: String(items.length),
      helper: "Your action items",
      tone: "primary",
      icon: FileText,
    },
    {
      id: "open",
      label: "Open",
      value: String(itemOpenCount),
      helper: "Items in progress",
      tone: "success",
      icon: Clock3,
    },
    {
      id: "overdue",
      label: "Overdue",
      value: String(itemOverdueCount),
      helper: "Require immediate attention",
      tone: "danger",
      icon: AlertTriangle,
    },
    {
      id: "due-soon",
      label: "Due Soon",
      value: String(itemDueThisWeekCount),
      helper: "Due this week",
      tone: "warning",
      icon: RefreshCw,
    },
    {
      id: "completion",
      label: "Completion Rate",
      value: `${itemCompletionRate}%`,
      helper: `${itemCompletedCount} completed`,
      tone: "neutral",
      icon: CheckCircle2,
      progress: itemCompletionRate,
    },
  ];
}
