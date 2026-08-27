export const surveyInfoPageCopy = {
  title: "Surveys",
  subtitle: "Share your feedback. Help us build a better workplace.",
};

export const surveyInfoSummary = [
  {
    id: "to-complete",
    label: "To Complete",
    value: "3",
    helper: "Surveys waiting for your feedback",
    tone: "primary",
  },
  {
    id: "completed",
    label: "Completed",
    value: "5",
    helper: "Surveys you've already submitted",
    tone: "success",
  },
  {
    id: "response-rate",
    label: "Your Response Rate",
    value: "82%",
    helper: "Keep it up! Your feedback matters",
    tone: "purple",
  },
] as const;

export type SurveyInfoTone = "primary" | "success" | "warning" | "purple";
export type PendingSurveySort = "dueDate" | "duration" | "title";

export const pendingSurveySortOptions: readonly { value: PendingSurveySort; label: string }[] = [
  { value: "dueDate", label: "Due Date" },
  { value: "duration", label: "Time Needed" },
  { value: "title", label: "Survey Name" },
] as const;

export const pendingSurveys = [
  {
    id: "engagement-pulse",
    title: "Quarterly Engagement Pulse",
    description: "Tell us how you're feeling about your work, team, and overall experience.",
    icon: "activity",
    tone: "warning",
    isAnonymous: true,
    duration: "~ 3 min",
    durationMinutes: 3,
    dueDate: "Due Sep 02, 2024",
    dueDateValue: "2024-09-02",
    status: "Active",
    questionCount: 7,
    startHref: "/surveys/submit/engagement-pulse",
  },
  {
    id: "manager-effectiveness",
    title: "Manager Effectiveness Survey",
    description: "Share anonymous feedback about your manager and leadership.",
    icon: "users",
    tone: "purple",
    isAnonymous: true,
    duration: "~ 5 min",
    durationMinutes: 5,
    dueDate: "Due Sep 05, 2024",
    status: "Active",
    dueDateValue: "2024-09-05",
    questionCount: 10,
    startHref: "/surveys/submit/manager-effectiveness",
  },
  {
    id: "project-feedback",
    title: "Project Feedback Survey",
    description: "Help us improve by sharing your experience on your recent project.",
    icon: "file",
    tone: "primary",
    isAnonymous: false,
    duration: "~ 4 min",
    durationMinutes: 4,
    dueDate: "Due Sep 10, 2024",
    dueDateValue: "2024-09-10",
    status: "Active",
    questionCount: 8,
    startHref: "/surveys/submit/project-feedback",
  },
  {
    id: "wellbeing-checkin",
    title: "Wellbeing Check-in",
    description: "Share a quick update on your wellbeing, workload, and support needs.",
    icon: "sparkle",
    tone: "success",
    isAnonymous: true,
    duration: "~ 2 min",
    durationMinutes: 2,
    dueDate: "Due Sep 12, 2024",
    dueDateValue: "2024-09-12",
    status: "Active",
    questionCount: 5,
    startHref: "/surveys/submit/wellbeing-checkin",
  },
  {
    id: "team-collaboration",
    title: "Team Collaboration Pulse",
    description: "Tell us how collaboration, communication, and handoffs are working this month.",
    icon: "users",
    tone: "purple",
    isAnonymous: true,
    duration: "~ 6 min",
    durationMinutes: 6,
    dueDate: "Due Sep 16, 2024",
    dueDateValue: "2024-09-16",
    status: "Active",
    questionCount: 11,
    startHref: "/surveys/submit/team-collaboration",
  },
  {
    id: "growth-feedback",
    title: "Growth & Learning Feedback",
    description: "Help us understand which learning paths and growth support would help most.",
    icon: "file",
    tone: "primary",
    isAnonymous: false,
    duration: "~ 4 min",
    durationMinutes: 4,
    dueDate: "Due Sep 20, 2024",
    dueDateValue: "2024-09-20",
    status: "Active",
    questionCount: 8,
    startHref: "/surveys/submit/growth-feedback",
  },
  {
    id: "workload-balance",
    title: "Workload Balance Survey",
    description: "Share whether current priorities, deadlines, and meetings feel sustainable.",
    icon: "activity",
    tone: "warning",
    isAnonymous: true,
    duration: "~ 5 min",
    durationMinutes: 5,
    dueDate: "Due Sep 24, 2024",
    dueDateValue: "2024-09-24",
    status: "Active",
    questionCount: 9,
    startHref: "/surveys/submit/workload-balance",
  },
] as const;

export const completedSurveys = [
  {
    id: "completed-engagement-pulse",
    title: "Quarterly Engagement Pulse",
    icon: "activity",
    tone: "warning",
    completedDate: "Completed Aug 12, 2024",
    completedDateValue: "2024-08-12",
    resultsHref: "/surveys/view/completed-engagement-pulse",
  },
  {
    id: "completed-project-feedback",
    title: "Project Feedback Survey",
    icon: "file",
    tone: "primary",
    completedDate: "Completed Jul 28, 2024",
    completedDateValue: "2024-07-28",
    resultsHref: "/surveys/view/completed-project-feedback",
  },
  {
    id: "completed-wellbeing",
    title: "Wellbeing Check-in",
    icon: "sparkle",
    tone: "success",
    completedDate: "Completed Jul 15, 2024",
    completedDateValue: "2024-07-15",
    resultsHref: "/surveys/view/completed-wellbeing",
  },
] as const;

export const resumeSurvey = {
  id: "manager-effectiveness",
  title: "Manager Effectiveness Survey",
  completedQuestions: 6,
  totalQuestions: 10,
  description: "You completed 6 of 10 questions",
  progress: 60,
  continueHref: "/surveys/submit/manager-effectiveness",
};

export const feedbackMatters = [
  {
    id: "anonymous",
    text: "Your feedback is anonymous and confidential.",
    icon: "mail",
  },
  {
    id: "identify",
    text: "It helps us identify what's working and what's not.",
    icon: "sparkle",
  },
  {
    id: "change",
    text: "It drives real changes that improve your workplace.",
    icon: "shield",
  },
] as const;

export const surveyInfoLinks = {
  createSurvey: "/surveys/create",
  surveyProcess: "/surveys",
};
