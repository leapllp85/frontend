import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  Heart,
  Lightbulb,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Smile,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ActionSurveyMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: string;
  tone: "primary" | "success" | "warning" | "danger" | "purple";
  icon: LucideIcon;
};

export type ActionSurveyTab = "Survey Templates" | "Survey Responses" | "Action Items";
export type SurveyTemplateStatus = "Active" | "Draft" | "Closed";
export type SurveyTemplateType = "Engagement" | "Wellness" | "Project" | "Leadership" | "Operations" | "Culture" | "Experience";
export type SurveyResponseStatus = "Reviewed" | "Pending" | "Awaiting Review";
export type SurveyResponseType = "Wellness" | "Leadership" | "Project" | "Engagement" | "Culture" | "Experience";
export type SurveyActionPriority = "High" | "Medium" | "Low";
export type SurveyActionStatus = "Pending" | "Completed";
export type SurveyActionSource = "Wellness" | "Leadership" | "Engagement" | "Experience" | "Project";

export type SurveyTemplate = {
  id: string;
  title: string;
  description: string;
  type: SurveyTemplateType;
  status: SurveyTemplateStatus;
  responses: number | null;
  responseRate: number | null;
  updatedLabel: string;
  questionCount: number;
  published: boolean;
  icon: LucideIcon;
};

export type ResponseTimelineStep = {
  id: string;
  label: string;
  timestamp: string;
  status: "completed" | "upcoming";
};

export type FeedbackAction = {
  id: string;
  title: string;
  status: "Completed" | "In Progress" | "Pending";
  dueLabel: string;
};

export type SurveyResponse = {
  id: string;
  title: string;
  type: SurveyResponseType;
  status: SurveyResponseStatus;
  submittedLabel: string;
  reviewedLabel?: string;
  icon: LucideIcon;
  overview: {
    description: string;
    questions: number;
    duration: string;
    anonymous: boolean;
  };
  keyFeedback: readonly { id: string; title: string; description: string; icon: LucideIcon }[];
  userAnswers?: readonly { id: string; question: string; answer: string; icon: LucideIcon }[];
  managerResponse: {
    manager: string;
    role: string;
    initials: string;
    message: string;
    respondedLabel: string;
  };
  timeline: readonly ResponseTimelineStep[];
  actions: readonly FeedbackAction[];
};

export type SurveyActionItem = {
  id: string;
  title: string;
  source: SurveyActionSource;
  sourceSurvey: string;
  description: string;
  priority: SurveyActionPriority;
  dueDate: string;
  dueLabel: string;
  status: SurveyActionStatus;
  ctaLabel: string;
  insightMentions: string;
  sentimentInsight: string;
  icon: LucideIcon;
};

export const statusOptions = ["All Status", "Active", "Draft", "Closed"] as const;
export const typeOptions = ["All Type", "Engagement", "Wellness", "Project", "Leadership", "Operations"] as const;
export const sortOptions = ["Recently updated", "Response rate", "Most responses"] as const;
export const pageSizeOptions = ["8 per page", "12 per page"] as const;
export const responseTypeOptions = ["All Types", "Wellness", "Leadership", "Project", "Engagement", "Culture", "Experience"] as const;
export const responseRangeOptions = ["Last 6 Months", "Last 12 Months", "All Time"] as const;
export const responseStatusFilters = ["All", "Reviewed", "Pending", "Awaiting Review"] as const;
export const surveyActionStatusOptions = ["Status: All", "Pending", "Completed"] as const;
export const surveyActionPriorityOptions = ["Priority: All", "High", "Medium", "Low"] as const;
export const surveyActionSourceOptions = ["Source: All", "Wellness", "Leadership", "Engagement", "Experience", "Project"] as const;
export const surveyActionSortOptions = ["Sort: Due date", "Sort: Priority", "Sort: Status"] as const;
export const surveyActionPageSizeOptions = ["4 per page", "8 per page"] as const;

export const actionSurveyCopy = {
  title: "Manager Survey Dashboard",
  subtitle: "Manage surveys, review your feedback, and stay on top of actions.",
};

export const actionSurveyMetrics: readonly ActionSurveyMetric[] = [
  {
    id: "templates",
    label: "Survey Templates",
    value: "6",
    helper: "Active + Draft",
    trend: "14%",
    tone: "primary",
    icon: FileText,
  },
  {
    id: "responses",
    label: "Responses Submitted",
    value: "12",
    helper: "By you",
    trend: "8%",
    tone: "purple",
    icon: MessageSquareText,
  },
  {
    id: "pending-actions",
    label: "Pending Actions",
    value: "4",
    helper: "Require your attention",
    trend: "2%",
    tone: "warning",
    icon: Clock3,
  },
  {
    id: "completed-actions",
    label: "Completed Actions",
    value: "8",
    helper: "All time",
    trend: "10%",
    tone: "success",
    icon: CheckCircle2,
  },
  {
    id: "completion-rate",
    label: "Action Completion Rate",
    value: "86%",
    helper: "Across all actions",
    trend: "5%",
    tone: "primary",
    icon: BarChart3,
  },
] as const;

export const actionSurveyTabs: readonly { label: ActionSurveyTab; count: number }[] = [
  { label: "Survey Templates", count: 6 },
  { label: "Survey Responses", count: 12 },
  { label: "Action Items", count: 4 },
] as const;

export const surveyTemplates: readonly SurveyTemplate[] = [
  {
    id: "q4-engagement",
    title: "Q4 Engagement Pulse",
    description: "Understand how employees feel about their work, team, and organization.",
    type: "Engagement",
    status: "Active",
    responses: 42,
    responseRate: 72,
    updatedLabel: "Updated Aug 20, 2024",
    questionCount: 8,
    published: true,
    icon: UsersRound,
  },
  {
    id: "monthly-wellness",
    title: "Monthly Wellness Check-in",
    description: "Regular pulse on wellbeing, workload and work-life balance.",
    type: "Wellness",
    status: "Active",
    responses: 38,
    responseRate: 65,
    updatedLabel: "Updated Aug 18, 2024",
    questionCount: 6,
    published: true,
    icon: Heart,
  },
  {
    id: "project-feedback",
    title: "Project Feedback Survey",
    description: "Collect feedback on project execution, collaboration and outcomes.",
    type: "Project",
    status: "Draft",
    responses: null,
    responseRate: null,
    updatedLabel: "Updated Aug 15, 2024",
    questionCount: 7,
    published: false,
    icon: BriefcaseBusiness,
  },
  {
    id: "manager-effectiveness",
    title: "Manager Effectiveness",
    description: "Feedback on leadership style, support and team management.",
    type: "Leadership",
    status: "Closed",
    responses: 51,
    responseRate: 78,
    updatedLabel: "Closed Aug 10, 2024",
    questionCount: 10,
    published: true,
    icon: UserRound,
  },
  {
    id: "new-hire",
    title: "New Hire Experience Survey",
    description: "Understand new joiner experience during their first 90 days.",
    type: "Engagement",
    status: "Active",
    responses: 25,
    responseRate: 68,
    updatedLabel: "Updated Aug 08, 2024",
    questionCount: 9,
    published: true,
    icon: Smile,
  },
  {
    id: "mental-health",
    title: "Mental Health & Wellbeing",
    description: "Anonymous pulse on mental health and support availability.",
    type: "Wellness",
    status: "Draft",
    responses: null,
    responseRate: null,
    updatedLabel: "Updated Aug 08, 2024",
    questionCount: 5,
    published: false,
    icon: Heart,
  },
  {
    id: "process-improvement",
    title: "Process Improvement Survey",
    description: "Identify operational gaps and improvement opportunities.",
    type: "Operations",
    status: "Closed",
    responses: 33,
    responseRate: 70,
    updatedLabel: "Closed Jul 28, 2024",
    questionCount: 8,
    published: true,
    icon: Building2,
  },
  {
    id: "hybrid-work",
    title: "Hybrid Work Pulse",
    description: "Measure how current hybrid routines affect focus and collaboration.",
    type: "Engagement",
    status: "Active",
    responses: 29,
    responseRate: 64,
    updatedLabel: "Updated Jul 22, 2024",
    questionCount: 6,
    published: true,
    icon: UsersRound,
  },
  {
    id: "career-growth",
    title: "Career Growth Survey",
    description: "Understand perceived growth paths, mentoring, and support needs.",
    type: "Leadership",
    status: "Draft",
    responses: null,
    responseRate: null,
    updatedLabel: "Updated Jul 18, 2024",
    questionCount: 7,
    published: false,
    icon: UserRound,
  },
  {
    id: "team-rituals",
    title: "Team Rituals Check",
    description: "Review meeting quality, decision speed, and team rituals.",
    type: "Operations",
    status: "Closed",
    responses: 44,
    responseRate: 74,
    updatedLabel: "Closed Jul 12, 2024",
    questionCount: 8,
    published: true,
    icon: Building2,
  },
  {
    id: "project-kickoff",
    title: "Project Kickoff Readiness",
    description: "Check whether project teams have clear goals, roles, and timelines.",
    type: "Project",
    status: "Active",
    responses: 31,
    responseRate: 69,
    updatedLabel: "Updated Jul 04, 2024",
    questionCount: 9,
    published: true,
    icon: BriefcaseBusiness,
  },
  {
    id: "burnout-risk",
    title: "Burnout Risk Pulse",
    description: "Track workload sustainability and recovery signals across teams.",
    type: "Wellness",
    status: "Active",
    responses: 47,
    responseRate: 82,
    updatedLabel: "Updated Jun 28, 2024",
    questionCount: 6,
    published: true,
    icon: Heart,
  },
] as const;

export const surveyResponses: readonly SurveyResponse[] = [
  {
    id: "q4-wellness",
    title: "Q4 2024 Wellness Check-in",
    type: "Wellness",
    status: "Reviewed",
    submittedLabel: "Submitted Oct 15, 2024",
    reviewedLabel: "Reviewed Oct 17, 2024",
    icon: Heart,
    overview: {
      description: "A pulse survey to understand work-life balance, stress levels, and overall wellbeing.",
      questions: 8,
      duration: "~4 min",
      anonymous: true,
    },
    keyFeedback: [
      { id: "balance", title: "Work-Life Balance", description: "Extended working hours are impacting personal time.", icon: Sparkles },
      { id: "stress", title: "Stress Levels", description: "High stress during peak project phases due to tight deadlines.", icon: ShieldCheck },
      { id: "support", title: "Support Needed", description: "Clearer prioritization and better workload distribution.", icon: Lightbulb },
    ],
    userAnswers: [
      {
        id: "workload",
        question: "How manageable is your current workload?",
        answer: "2 / 5 - Somewhat difficult",
        icon: FileText,
      },
      {
        id: "stress-source",
        question: "What is contributing most to your stress?",
        answer: "Tight deadlines, extended working hours, and frequent context switching.",
        icon: ShieldCheck,
      },
      {
        id: "balance-help",
        question: "What would help improve your work-life balance?",
        answer: "Better workload planning, clearer priorities, and dedicated focus time.",
        icon: Lightbulb,
      },
    ],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message:
        "Thank you for sharing your concerns. Your wellbeing is a priority. We have noticed similar feedback across the team and are taking steps to improve workload allocation and meeting culture.",
      respondedLabel: "Responded Oct 18, 2024, 11:05 AM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Oct 15, 2024, 10:32 AM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Oct 17, 2024, 02:14 PM", status: "completed" },
      { id: "responded", label: "Manager responded", timestamp: "Oct 18, 2024, 11:05 AM", status: "completed" },
      { id: "followups", label: "Follow-ups scheduled", timestamp: "Nov 15, 2024", status: "upcoming" },
    ],
    actions: [
      { id: "redistribute", title: "Redistribute workload within team", status: "Completed", dueLabel: "Due Oct 24, 2024" },
      { id: "no-meeting", title: "Implement no-meeting Fridays", status: "In Progress", dueLabel: "Due Nov 02, 2024" },
      { id: "stress-workshop", title: "Schedule stress management workshop", status: "Pending", dueLabel: "Due Nov 15, 2024" },
    ],
  },
  {
    id: "manager-effectiveness-response",
    title: "Manager Effectiveness Survey",
    type: "Leadership",
    status: "Awaiting Review",
    submittedLabel: "Submitted Sep 28, 2024",
    icon: UserRound,
    overview: {
      description: "Feedback on leadership communication, decision clarity, and support expectations.",
      questions: 10,
      duration: "~5 min",
      anonymous: true,
    },
    keyFeedback: [
      { id: "clarity", title: "Decision Clarity", description: "More context before priority changes would help planning.", icon: Lightbulb },
      { id: "coaching", title: "Coaching Support", description: "Regular coaching moments are helpful and should continue.", icon: Sparkles },
    ],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Your response is awaiting manager review. A response will appear here once reviewed.",
      respondedLabel: "Pending review",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Sep 28, 2024, 04:22 PM", status: "completed" },
      { id: "reviewed", label: "Manager review pending", timestamp: "Awaiting review", status: "upcoming" },
    ],
    actions: [],
  },
  {
    id: "project-feedback-response",
    title: "Project Feedback Survey",
    type: "Project",
    status: "Reviewed",
    submittedLabel: "Submitted Sep 10, 2024",
    reviewedLabel: "Reviewed Sep 12, 2024",
    icon: FileText,
    overview: {
      description: "A short review of delivery quality, project communication, and collaboration health.",
      questions: 7,
      duration: "~4 min",
      anonymous: false,
    },
    keyFeedback: [
      { id: "handoffs", title: "Handoffs", description: "Cross-functional handoffs improved after weekly checkpoints.", icon: Rocket },
      { id: "risks", title: "Risk Visibility", description: "Project risks should be visible earlier in planning.", icon: ShieldCheck },
    ],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Thanks for the detailed project feedback. We will add earlier risk reviews to upcoming project rituals.",
      respondedLabel: "Responded Sep 13, 2024, 09:40 AM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Sep 10, 2024, 01:18 PM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Sep 12, 2024, 10:00 AM", status: "completed" },
      { id: "responded", label: "Manager responded", timestamp: "Sep 13, 2024, 09:40 AM", status: "completed" },
    ],
    actions: [{ id: "risk-review", title: "Add early risk review to project kickoff", status: "Completed", dueLabel: "Due Sep 30, 2024" }],
  },
  {
    id: "q3-engagement",
    title: "Q3 2024 Engagement Pulse",
    type: "Engagement",
    status: "Reviewed",
    submittedLabel: "Submitted Jul 20, 2024",
    reviewedLabel: "Reviewed Jul 22, 2024",
    icon: Smile,
    overview: {
      description: "Quarterly engagement pulse focused on motivation, alignment, and belonging.",
      questions: 9,
      duration: "~5 min",
      anonymous: true,
    },
    keyFeedback: [{ id: "alignment", title: "Team Alignment", description: "Clear goals helped the team stay focused.", icon: Sparkles }],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Great to hear alignment is improving. We will keep goals visible in weekly planning.",
      respondedLabel: "Responded Jul 23, 2024, 03:10 PM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Jul 20, 2024, 02:45 PM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Jul 22, 2024, 11:20 AM", status: "completed" },
    ],
    actions: [],
  },
  {
    id: "diversity-inclusion",
    title: "Diversity & Inclusion Survey",
    type: "Culture",
    status: "Reviewed",
    submittedLabel: "Submitted Jun 15, 2024",
    reviewedLabel: "Reviewed Jun 17, 2024",
    icon: UsersRound,
    overview: {
      description: "Culture survey focused on inclusion, voice, and psychological safety.",
      questions: 8,
      duration: "~4 min",
      anonymous: true,
    },
    keyFeedback: [{ id: "voice", title: "Employee Voice", description: "Team forums create useful space for ideas.", icon: MessageSquareText }],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Thank you for the thoughtful culture feedback. We will keep making space for open participation.",
      respondedLabel: "Responded Jun 18, 2024, 12:30 PM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Jun 15, 2024, 09:00 AM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Jun 17, 2024, 04:10 PM", status: "completed" },
    ],
    actions: [],
  },
  {
    id: "q2-wellness",
    title: "Q2 2024 Wellness Check-in",
    type: "Wellness",
    status: "Reviewed",
    submittedLabel: "Submitted Apr 15, 2024",
    reviewedLabel: "Reviewed Apr 17, 2024",
    icon: Heart,
    overview: {
      description: "Wellness check-in covering energy, workload, and support availability.",
      questions: 8,
      duration: "~4 min",
      anonymous: true,
    },
    keyFeedback: [{ id: "energy", title: "Energy Levels", description: "Energy improved after workload reprioritization.", icon: Sparkles }],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Glad to see progress. We will keep watching workload and recovery signals.",
      respondedLabel: "Responded Apr 18, 2024, 10:15 AM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Apr 15, 2024, 05:05 PM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Apr 17, 2024, 09:15 AM", status: "completed" },
    ],
    actions: [],
  },
  {
    id: "onboarding-experience",
    title: "Onboarding Experience Survey",
    type: "Experience",
    status: "Reviewed",
    submittedLabel: "Submitted Mar 02, 2024",
    reviewedLabel: "Reviewed Mar 05, 2024",
    icon: Rocket,
    overview: {
      description: "Feedback on onboarding clarity, early support, and first project readiness.",
      questions: 7,
      duration: "~4 min",
      anonymous: false,
    },
    keyFeedback: [{ id: "readiness", title: "First Project Readiness", description: "Starter guides helped reduce ramp-up time.", icon: Lightbulb }],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Thank you for sharing what worked during onboarding. We will reuse those patterns for future joiners.",
      respondedLabel: "Responded Mar 06, 2024, 02:05 PM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Mar 02, 2024, 03:50 PM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Mar 05, 2024, 11:45 AM", status: "completed" },
    ],
    actions: [],
  },
  {
    id: "annual-engagement",
    title: "Annual Engagement Survey",
    type: "Engagement",
    status: "Reviewed",
    submittedLabel: "Submitted Jan 18, 2024",
    reviewedLabel: "Reviewed Jan 22, 2024",
    icon: BarChart3,
    overview: {
      description: "Annual engagement survey covering motivation, growth, recognition, and collaboration.",
      questions: 12,
      duration: "~7 min",
      anonymous: true,
    },
    keyFeedback: [{ id: "growth", title: "Growth", description: "Clear growth conversations were the strongest positive theme.", icon: Sparkles }],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "Thank you for the annual feedback. We will keep growth planning active through quarterly check-ins.",
      respondedLabel: "Responded Jan 23, 2024, 01:35 PM",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Jan 18, 2024, 10:05 AM", status: "completed" },
      { id: "reviewed", label: "Reviewed by manager", timestamp: "Jan 22, 2024, 04:25 PM", status: "completed" },
    ],
    actions: [],
  },
  {
    id: "workload-priorities",
    title: "Workload Priorities Pulse",
    type: "Wellness",
    status: "Pending",
    submittedLabel: "Submitted Dec 12, 2023",
    icon: Clock3,
    overview: {
      description: "Pulse survey on workload clarity and priority tradeoffs.",
      questions: 5,
      duration: "~3 min",
      anonymous: true,
    },
    keyFeedback: [{ id: "priorities", title: "Priorities", description: "Priority shifts need clearer tradeoff notes.", icon: Lightbulb }],
    managerResponse: {
      manager: "Rahul Singh",
      role: "Your Manager",
      initials: "RS",
      message: "This response is queued for review.",
      respondedLabel: "Pending review",
    },
    timeline: [
      { id: "submitted", label: "Submitted by you", timestamp: "Dec 12, 2023, 02:20 PM", status: "completed" },
      { id: "reviewed", label: "Manager review pending", timestamp: "Pending", status: "upcoming" },
    ],
    actions: [],
  },
] as const;

export const surveyActionItems: readonly SurveyActionItem[] = [
  {
    id: "workload-balance",
    title: "Improve team workload balance",
    source: "Wellness",
    sourceSurvey: "Monthly Wellness Check-in",
    description: "Several team members reported concerns about workload and work-life balance.",
    priority: "High",
    dueDate: "Aug 28, 2024",
    dueLabel: "In 3 days",
    status: "Pending",
    ctaLabel: "View Details",
    insightMentions: "6 employees mentioned workload concerns",
    sentimentInsight: "Response sentiment dropped 12%",
    icon: Heart,
  },
  {
    id: "leadership-feedback",
    title: "Follow up on leadership feedback",
    source: "Leadership",
    sourceSurvey: "Manager Effectiveness Survey",
    description: "Recurring feedback on communication and team support needs your attention.",
    priority: "Medium",
    dueDate: "Sep 02, 2024",
    dueLabel: "In 8 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "4 employees mentioned support gaps",
    sentimentInsight: "Leadership confidence dipped 8%",
    icon: UserRound,
  },
  {
    id: "career-growth",
    title: "Address career growth concerns",
    source: "Engagement",
    sourceSurvey: "Q4 Engagement Pulse",
    description: "Employees shared feedback about learning opportunities and career development.",
    priority: "Medium",
    dueDate: "Sep 05, 2024",
    dueLabel: "In 11 days",
    status: "Pending",
    ctaLabel: "Start Action",
    insightMentions: "5 employees mentioned growth concerns",
    sentimentInsight: "Growth sentiment dropped 9%",
    icon: MessageSquareText,
  },
  {
    id: "onboarding-experience",
    title: "Improve onboarding experience",
    source: "Experience",
    sourceSurvey: "New Hire Experience Survey",
    description: "New joiners highlighted areas to improve onboarding process.",
    priority: "Low",
    dueDate: "Sep 12, 2024",
    dueLabel: "In 18 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "3 new hires mentioned onboarding gaps",
    sentimentInsight: "Onboarding clarity improved 4%",
    icon: FileText,
  },
  {
    id: "project-handoffs",
    title: "Clarify project handoffs",
    source: "Project",
    sourceSurvey: "Project Feedback Survey",
    description: "Project teams need clearer ownership when work moves between functions.",
    priority: "High",
    dueDate: "Aug 22, 2024",
    dueLabel: "3 days overdue",
    status: "Pending",
    ctaLabel: "View Details",
    insightMentions: "7 employees mentioned handoff friction",
    sentimentInsight: "Delivery confidence dropped 10%",
    icon: BriefcaseBusiness,
  },
  {
    id: "meeting-load",
    title: "Reduce recurring meeting load",
    source: "Wellness",
    sourceSurvey: "Q4 2024 Wellness Check-in",
    description: "Feedback indicates meeting density is reducing focus time.",
    priority: "Medium",
    dueDate: "Aug 29, 2024",
    dueLabel: "In 4 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "5 employees mentioned meeting overload",
    sentimentInsight: "Focus sentiment dropped 7%",
    icon: Clock3,
  },
  {
    id: "recognition",
    title: "Improve recognition rituals",
    source: "Engagement",
    sourceSurvey: "Annual Engagement Survey",
    description: "Team members want more consistent recognition for high-impact work.",
    priority: "Low",
    dueDate: "Sep 18, 2024",
    dueLabel: "In 24 days",
    status: "Completed",
    ctaLabel: "View Details",
    insightMentions: "4 employees mentioned recognition",
    sentimentInsight: "Recognition sentiment rose 6%",
    icon: Sparkles,
  },
  {
    id: "support-docs",
    title: "Create team support guide",
    source: "Leadership",
    sourceSurvey: "Manager Effectiveness Survey",
    description: "Document escalation paths and support expectations for the team.",
    priority: "Medium",
    dueDate: "Sep 10, 2024",
    dueLabel: "In 16 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "3 employees asked for support clarity",
    sentimentInsight: "Support confidence is stable",
    icon: Lightbulb,
  },
  {
    id: "wellbeing-retro",
    title: "Schedule wellbeing retro",
    source: "Wellness",
    sourceSurvey: "Burnout Risk Pulse",
    description: "Create a dedicated discussion around stress signals and recovery time.",
    priority: "High",
    dueDate: "Aug 24, 2024",
    dueLabel: "1 day overdue",
    status: "Pending",
    ctaLabel: "View Details",
    insightMentions: "8 employees mentioned burnout risk",
    sentimentInsight: "Wellbeing sentiment dropped 14%",
    icon: Flame,
  },
  {
    id: "kickoff-template",
    title: "Update kickoff template",
    source: "Project",
    sourceSurvey: "Project Kickoff Readiness",
    description: "Add clearer scope, risks, and decision-owner sections to kickoff docs.",
    priority: "Low",
    dueDate: "Sep 20, 2024",
    dueLabel: "In 26 days",
    status: "Completed",
    ctaLabel: "View Details",
    insightMentions: "2 teams mentioned unclear kickoff docs",
    sentimentInsight: "Project readiness improved 5%",
    icon: BriefcaseBusiness,
  },
  {
    id: "peer-learning",
    title: "Launch peer learning circle",
    source: "Engagement",
    sourceSurvey: "Career Growth Survey",
    description: "Create monthly peer learning sessions based on requested growth areas.",
    priority: "Medium",
    dueDate: "Sep 06, 2024",
    dueLabel: "In 12 days",
    status: "Pending",
    ctaLabel: "Start Action",
    insightMentions: "6 employees requested peer learning",
    sentimentInsight: "Growth sentiment dropped 5%",
    icon: UsersRound,
  },
  {
    id: "first-week-checklist",
    title: "Refresh first-week checklist",
    source: "Experience",
    sourceSurvey: "Onboarding Experience Survey",
    description: "New hires need clearer first-week milestones and buddy expectations.",
    priority: "Low",
    dueDate: "Sep 14, 2024",
    dueLabel: "In 20 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "4 new hires mentioned checklist gaps",
    sentimentInsight: "Early clarity improved 3%",
    icon: Rocket,
  },
  {
    id: "priority-changes",
    title: "Document priority changes",
    source: "Leadership",
    sourceSurvey: "Workload Priorities Pulse",
    description: "Managers should document priority changes and tradeoffs in one place.",
    priority: "High",
    dueDate: "Aug 30, 2024",
    dueLabel: "In 5 days",
    status: "Pending",
    ctaLabel: "Start Action",
    insightMentions: "5 employees mentioned priority churn",
    sentimentInsight: "Planning confidence dropped 11%",
    icon: Lightbulb,
  },
  {
    id: "process-review",
    title: "Run process review session",
    source: "Project",
    sourceSurvey: "Process Improvement Survey",
    description: "Review operational blockers and assign owners for the top three gaps.",
    priority: "Medium",
    dueDate: "Sep 08, 2024",
    dueLabel: "In 14 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "5 employees mentioned process blockers",
    sentimentInsight: "Operations sentiment is steady",
    icon: Building2,
  },
  {
    id: "quiet-hours",
    title: "Pilot protected focus hours",
    source: "Wellness",
    sourceSurvey: "Hybrid Work Pulse",
    description: "Introduce focus-hour norms to protect deep work time.",
    priority: "Medium",
    dueDate: "Sep 03, 2024",
    dueLabel: "In 9 days",
    status: "Pending",
    ctaLabel: "Continue",
    insightMentions: "6 employees mentioned interruptions",
    sentimentInsight: "Focus sentiment dropped 6%",
    icon: Clock3,
  },
  {
    id: "belonging",
    title: "Create inclusion listening circle",
    source: "Engagement",
    sourceSurvey: "Diversity & Inclusion Survey",
    description: "Open a recurring space for employees to discuss belonging and inclusion.",
    priority: "Low",
    dueDate: "Sep 26, 2024",
    dueLabel: "In 32 days",
    status: "Completed",
    ctaLabel: "View Details",
    insightMentions: "4 employees mentioned belonging",
    sentimentInsight: "Inclusion sentiment improved 7%",
    icon: UsersRound,
  },
] as const;
