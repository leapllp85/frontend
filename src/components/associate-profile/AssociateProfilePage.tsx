"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Flag,
  Layers3,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Star,
  Target,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  actionItemApi,
  allocationApi,
  courseApi,
  notificationsApi,
  projectApi,
  userApi,
} from "@/services";
import type {
  ActionItem,
  Course,
  NotificationsResponse,
  Project,
  ProjectAllocation,
  ProjectsPaginatedResponse,
} from "@/services";
import type { UserProfile } from "@/services/userApi";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

const ASSOCIATE_CAREER_STATE_KEY = "associateProfileCareerState";
const ASSOCIATE_SKILLS_STATE_KEY = "associateProfileSkillsState";
const ASSOCIATE_LEARNING_STATE_KEY = "associateProfileLearningState";
const FALLBACK_USER_ID = "1";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type SkillLevel = 1 | 2 | 3 | 4 | 5;

type SkillProficiencyState = Record<string, SkillLevel>;

type LearningProgressState = Record<string, number>;

type CareerGoalState = {
  selectedGoal: string;
  requiredSkills: string[];
  targetLevel: SkillLevel;
  targetDate: string;
};

type AssociateIdentity = {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  avatar: string;
  manager: string;
  joinDateLabel: string;
  tenureLabel: string;
  location: string;
  department: string;
  team: string;
  status: string;
};

type AssociateProjectSummary = {
  id: string;
  name: string;
  role: string;
  status: string;
  allocation: number | null;
  techStack: string[];
  progress: number | null;
};

type FocusTaskSummary = {
  id: string;
  title: string;
  dueLabel: string;
  priority: string;
  status: string;
};

type LearningSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number | null;
};

type AssociateUpdateSummary = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string;
  read: boolean;
};

type AssociateSkillSummary = {
  name: string;
  level: number;
};

type CareerProgressSummary = {
  progressPercent: number | null;
  competenciesMet: number;
  requiredCompetencies: number;
  skillsToStrengthen: string[];
};

type AspirationOption = {
  value: string;
  label: string;
  targetDate: string;
  requiredSkills: string[];
};

type AssociateProfileViewModel = {
  identity: AssociateIdentity | null;
  projects: AssociateProjectSummary[];
  focusTasks: FocusTaskSummary[];
  learning: LearningSummary[];
  updates: AssociateUpdateSummary[];
  career: CareerGoalState;
  skillLevels: SkillProficiencyState;
  skills: AssociateSkillSummary[];
  careerProgress: CareerProgressSummary;
};

type AssociateProfileState = {
  status: LoadStatus;
  error: string | null;
  userProfile: UserProfile | null;
  projectsResponse: ProjectsPaginatedResponse | null;
  allocations: ProjectAllocation[];
  actionItems: ActionItem[];
  courses: Course[];
  notifications: NotificationsResponse | null;
  careerState: CareerGoalState;
  skillLevels: SkillProficiencyState;
  learningProgress: LearningProgressState;
};

const defaultCareerState: CareerGoalState = {
  selectedGoal: "Tech Lead",
  requiredSkills: ["React", "TypeScript", "Node.js", "SQL", "System Design"],
  targetLevel: 4,
  targetDate: "2025-12-31",
};

const defaultSkillLevels: SkillProficiencyState = {
  React: 4,
  TypeScript: 4,
  "Node.js": 3,
  SQL: 3,
  "System Design": 2,
};

const defaultLearningProgress: LearningProgressState = {
  "associate-course-react-advanced": 40,
};

const aspirationOptions: AspirationOption[] = [
  {
    value: "tech-lead",
    label: "Tech Lead",
    targetDate: "2025-12-31",
    requiredSkills: ["Team Leadership", "System Design", "Code Review", "Mentoring", "Agile"],
  },
  {
    value: "engineering-manager",
    label: "Engineering Manager",
    targetDate: "2026-06-30",
    requiredSkills: ["People Management", "Strategic Planning", "Stakeholder Communication", "Team Building", "Budget Planning"],
  },
  {
    value: "architect",
    label: "Software Architect",
    targetDate: "2026-03-31",
    requiredSkills: ["System Design", "Cloud Architecture", "Microservices", "API Design", "Security"],
  },
  {
    value: "senior-architect",
    label: "Senior Architect",
    targetDate: "2026-12-31",
    requiredSkills: ["Enterprise Architecture", "Technology Strategy", "Solution Design", "Performance Optimization", "Scalability"],
  },
  {
    value: "principal-engineer",
    label: "Principal Engineer",
    targetDate: "2026-09-30",
    requiredSkills: ["Technical Strategy", "Innovation", "Cross-team Collaboration", "Research and Development", "Engineering Standards"],
  },
];

const fallbackUserProfile = {
  user: {
    id: Number(FALLBACK_USER_ID),
    username: "john.doe",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@clyra.example",
    role: "Associate",
    is_manager: false,
    manager: null,
    profile_pic: "",
    permissions: [],
    designation: "Senior Software Engineer",
  },
  profile: {
    id: 101,
    suggested_risk: "Low",
    username: "john.doe",
    first_name: "John",
    last_name: "Doe",
    profile_pic: "",
    age: 29,
    mental_health: "Low",
    motivation_factor: "Low",
    career_opportunities: "Medium",
    personal_reason: "Low",
    manager_assessment_risk: "Low",
    all_triggers: "",
    primary_trigger: "",
    created_at: "2022-01-15T00:00:00.000Z",
    updated_at: "2026-09-05T00:00:00.000Z",
    user: Number(FALLBACK_USER_ID),
    manager: null,
    employee_id: "EMP-2024-001",
    manager_name: "Priya Sharma",
    department: "Engineering",
    team: "Backend Engineering",
    location: "Bangalore, India",
    designation: "Senior Software Engineer",
  },
} as UserProfile;

const fallbackProjectsResponse = {
  count: 2,
  next: null,
  previous: null,
  results: {
    projects: [
      {
        id: 1,
        title: "Payroll Revamp",
        description: "Backend modernization for payroll workflows.",
        start_date: "2026-06-01",
        go_live_date: "2026-09-15",
        status: "Active",
        criticality: "High",
        source: "Backend Developer",
        created_at: "2026-06-01T00:00:00.000Z",
        assigned_to: [],
        business_unit: "Node.js • Express • PostgreSQL",
      },
      {
        id: 2,
        title: "Analytics Dashboard",
        description: "Contributor dashboard for workforce analytics.",
        start_date: "2026-07-10",
        go_live_date: "2026-10-01",
        status: "Active",
        criticality: "Medium",
        source: "Contributor",
        created_at: "2026-07-10T00:00:00.000Z",
        assigned_to: [],
        business_unit: "React • TypeScript • Recharts",
      },
    ],
    total_results: 2,
    search_query: "",
  },
} as ProjectsPaginatedResponse;

const fallbackAllocations = [
  { project: { id: 1 }, allocation_percentage: 60 },
  { project: { id: 2 }, allocation_percentage: 40 },
] as ProjectAllocation[];

const fallbackActionItems = [
  {
    id: 1,
    assigned_to: { id: Number(FALLBACK_USER_ID), username: "john.doe", email: "john.doe@clyra.example" },
    title: "Complete React Advanced Course - Module 3",
    status: "Pending",
    priority: "High",
    action: "Complete React Advanced Course - Module 3",
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-09-08T00:00:00.000Z",
  },
  {
    id: 2,
    assigned_to: { id: Number(FALLBACK_USER_ID), username: "john.doe", email: "john.doe@clyra.example" },
    title: "Practice TypeScript Challenges - 5 exercises",
    status: "Pending",
    priority: "Medium",
    action: "Practice TypeScript Challenges - 5 exercises",
    created_at: "2026-09-02T00:00:00.000Z",
    updated_at: "2026-09-12T00:00:00.000Z",
  },
  {
    id: 3,
    assigned_to: { id: Number(FALLBACK_USER_ID), username: "john.doe", email: "john.doe@clyra.example" },
    title: "Schedule 1-on-1 with your manager",
    status: "Pending",
    priority: "Medium",
    action: "Schedule 1-on-1 with your manager",
    created_at: "2026-09-03T00:00:00.000Z",
    updated_at: "2026-09-18T00:00:00.000Z",
  },
  {
    id: 4,
    assigned_to: { id: Number(FALLBACK_USER_ID), username: "john.doe", email: "john.doe@clyra.example" },
    title: "Update your skill proficiency",
    status: "Pending",
    priority: "Low",
    action: "Update your skill proficiency",
    created_at: "2026-09-04T00:00:00.000Z",
    updated_at: "2026-09-25T00:00:00.000Z",
  },
] as ActionItem[];

const fallbackCourses = [
  {
    id: "associate-course-react-advanced",
    title: "React Advanced Course",
    description: "Module 3: State Management",
    category_names: ["Continue Learning"],
    source: "Learning",
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "associate-course-system-design",
    title: "System Design Fundamentals",
    description: "12 modules • 8 hrs",
    category_names: ["Recommended for you"],
    source: "Learning",
    created_at: "2026-08-05T00:00:00.000Z",
  },
] as unknown as Course[];

const fallbackNotifications = {
  unread_count: 3,
  notifications: [
    {
      id: "skill-validation",
      title: "Skill validation requested",
      description: "Your manager has requested validation for 3 skills.",
      timestamp: "2h ago",
      type: "info",
    },
    {
      id: "project-update",
      title: "Project update",
      description: "Payroll Revamp milestone moved to Sep 15.",
      timestamp: "Yesterday",
      type: "warning",
    },
    {
      id: "learning-path",
      title: "New learning path added",
      description: "System Design Fundamentals learning path is now available.",
      timestamp: "2d ago",
      type: "info",
    },
  ],
} as NotificationsResponse;

const initialState: AssociateProfileState = {
  status: "ready",
  error: null,
  userProfile: fallbackUserProfile,
  projectsResponse: fallbackProjectsResponse,
  allocations: fallbackAllocations,
  actionItems: fallbackActionItems,
  courses: fallbackCourses,
  notifications: fallbackNotifications,
  careerState: defaultCareerState,
  skillLevels: defaultSkillLevels,
  learningProgress: defaultLearningProgress,
};

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function withFallback<T>(request: Promise<T>, fallback: T, timeoutMs = 1200): Promise<T> {
  return Promise.race([
    request.catch(() => fallback),
    new Promise<T>((resolve) => {
      window.setTimeout(() => resolve(fallback), timeoutMs);
    }),
  ]);
}

function getPersonName(userProfile: UserProfile | null) {
  const firstName = userProfile?.user?.first_name || userProfile?.profile?.first_name || "";
  const lastName = userProfile?.user?.last_name || userProfile?.profile?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || userProfile?.user?.username || userProfile?.profile?.username || "";
}

function formatDateLabel(dateValue?: string | null) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function calculateTenureLabel(dateValue?: string | null) {
  if (!dateValue) {
    return "";
  }

  const startDate = new Date(dateValue);
  if (Number.isNaN(startDate.getTime())) {
    return "";
  }

  const today = new Date();
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();

  if (today.getDate() < startDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearLabel = years > 0 ? `${years}y` : "";
  const monthLabel = months > 0 ? `${months}m` : "";

  return [yearLabel, monthLabel].filter(Boolean).join(" ") || "Less than 1m";
}

function normalizeProjects(
  projectsResponse: ProjectsPaginatedResponse | null,
  allocations: ProjectAllocation[],
): AssociateProjectSummary[] {
  const projects = projectsResponse?.results?.projects || [];

  return projects.map((project: Project) => {
    const allocation = allocations.find((item) => item.project?.id === project.id);

    return {
      id: String(project.id),
      name: project.title,
      role: project.source || "",
      status: project.status,
      allocation: allocation?.allocation_percentage ?? null,
      techStack: project.business_unit ? [project.business_unit] : [],
      progress: null,
    };
  });
}

function normalizeActionItems(actionItems: ActionItem[]): FocusTaskSummary[] {
  return actionItems.map((item) => ({
    id: String(item.id),
    title: item.title || item.action,
    dueLabel: formatDateLabel(item.updated_at || item.created_at),
    priority: item.priority || "Medium",
    status: item.status,
  }));
}

function normalizeLearningItems(
  courses: Course[],
  learningProgress: LearningProgressState,
): LearningSummary[] {
  return courses.map((course) => ({
    id: String(course.id),
    title: course.title,
    description: course.description,
    category: course.category_names?.join(", ") || course.category?.name || "",
    progress: learningProgress[String(course.id)] ?? null,
  }));
}

function normalizeUpdates(notifications: NotificationsResponse | null): AssociateUpdateSummary[] {
  return (notifications?.notifications || []).map((notification) => ({
    id: notification.id,
    title: notification.title,
    description: notification.description,
    timestamp: notification.timestamp,
    type: notification.type,
    read: notification.type !== "error",
  }));
}

function normalizeSkills(skillLevels: SkillProficiencyState): AssociateSkillSummary[] {
  return Object.entries(skillLevels).map(([name, level]) => ({ name, level }));
}

function getAspirationByLabel(label: string) {
  return aspirationOptions.find((option) => option.label === label) || aspirationOptions[0];
}

function getCareerStateForAspiration(option: AspirationOption): CareerGoalState {
  return {
    selectedGoal: option.label,
    requiredSkills: option.requiredSkills,
    targetLevel: 4,
    targetDate: option.targetDate,
  };
}

function calculateCareerProgress(
  careerState: CareerGoalState,
  skillLevels: SkillProficiencyState,
): CareerProgressSummary {
  const requiredSkills = careerState.requiredSkills;

  if (requiredSkills.length === 0) {
    return {
      progressPercent: null,
      competenciesMet: 0,
      requiredCompetencies: 0,
      skillsToStrengthen: [],
    };
  }

  const skillsToStrengthen = requiredSkills.filter((skill) => {
    const currentLevel = skillLevels[skill] || 0;
    return currentLevel < careerState.targetLevel;
  });
  const competenciesMet = requiredSkills.length - skillsToStrengthen.length;

  return {
    progressPercent: Math.round((competenciesMet / requiredSkills.length) * 100),
    competenciesMet,
    requiredCompetencies: requiredSkills.length,
    skillsToStrengthen,
  };
}

function buildAssociateIdentity(userProfile: UserProfile | null): AssociateIdentity | null {
  if (!userProfile) {
    return null;
  }

  const joinDate = userProfile.profile?.created_at || userProfile.profile?.updated_at;
  const userDetails = userProfile.user as typeof userProfile.user & {
    designation?: string;
    department?: string;
    location?: string;
  };
  const profileDetails = userProfile.profile as typeof userProfile.profile & {
    designation?: string;
    employee_id?: string;
    manager_name?: string;
    department?: string;
    team?: string;
    location?: string;
  };
  const title = profileDetails.designation || userDetails.designation || userProfile.user?.role || "Associate";

  return {
    id: profileDetails.employee_id || String(userProfile.user?.id || userProfile.profile?.id || ""),
    name: getPersonName(userProfile),
    role: userProfile.user?.role || "Associate",
    title,
    email: userProfile.user?.email || "",
    avatar: userProfile.user?.profile_pic || userProfile.profile?.profile_pic || "",
    manager: profileDetails.manager_name || (userProfile.user?.manager ? String(userProfile.user.manager) : ""),
    joinDateLabel: formatDateLabel(joinDate),
    tenureLabel: calculateTenureLabel(joinDate),
    location: profileDetails.location || userDetails.location || "",
    department: profileDetails.department || profileDetails.team || userDetails.department || "",
    team: profileDetails.team || profileDetails.department || userDetails.department || "",
    status: "Active",
  };
}

function buildAssociateProfileViewModel(state: AssociateProfileState): AssociateProfileViewModel {
  return {
    identity: buildAssociateIdentity(state.userProfile),
    projects: normalizeProjects(state.projectsResponse, state.allocations),
    focusTasks: normalizeActionItems(state.actionItems),
    learning: normalizeLearningItems(state.courses, state.learningProgress),
    updates: normalizeUpdates(state.notifications),
    career: state.careerState,
    skillLevels: state.skillLevels,
    skills: normalizeSkills(state.skillLevels),
    careerProgress: calculateCareerProgress(state.careerState, state.skillLevels),
  };
}

export function useAssociateProfileModel() {
  const [state, setState] = useState<AssociateProfileState>(() => ({
    ...initialState,
    careerState: readStoredJson(ASSOCIATE_CAREER_STATE_KEY, defaultCareerState),
    skillLevels: readStoredJson(ASSOCIATE_SKILLS_STATE_KEY, defaultSkillLevels),
    learningProgress: readStoredJson(ASSOCIATE_LEARNING_STATE_KEY, defaultLearningProgress),
  }));

  const loadAssociateProfile = useCallback(async () => {
    setState((currentState) => ({ ...currentState, status: "loading", error: null }));

    try {
      const userProfile = await withFallback(userApi.getCurrentUserProfile(), fallbackUserProfile);
      const userId = userProfile.user?.id ? String(userProfile.user.id) : undefined;
      const [
        projectsResponse,
        allocations,
        actionItemsResponse,
        coursesResponse,
        notifications,
      ] = await Promise.all([
        withFallback(projectApi.getMyProjects(), fallbackProjectsResponse),
        withFallback(allocationApi.getEmployeeAllocations(), fallbackAllocations),
        withFallback(actionItemApi.getActionItems(userId ? { user_id: userId } : undefined), null),
        withFallback(courseApi.getCourses(), null),
        withFallback(notificationsApi.getNotifications(), fallbackNotifications),
      ]);
      const loadedActionItems = actionItemsResponse?.results?.action_items || [];
      const loadedCourses = coursesResponse?.courses || [];
      const loadedProjects = projectsResponse?.results?.projects || [];
      const loadedNotifications = notifications?.notifications || [];

      setState((currentState) => ({
        ...currentState,
        status: "ready",
        userProfile,
        projectsResponse: loadedProjects.length > 0 ? projectsResponse : fallbackProjectsResponse,
        allocations: Array.isArray(allocations) && allocations.length > 0 ? allocations : fallbackAllocations,
        actionItems: loadedActionItems.length > 0 ? loadedActionItems : fallbackActionItems,
        courses: loadedCourses.length > 0 ? loadedCourses : fallbackCourses,
        notifications: loadedNotifications.length > 0 ? notifications : fallbackNotifications,
      }));
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        status: "ready",
        error: error instanceof Error ? error.message : "Failed to load associate profile",
      }));
    }
  }, []);

  useEffect(() => {
    loadAssociateProfile();
  }, [loadAssociateProfile]);

  const setCareerState = useCallback((careerState: CareerGoalState) => {
    writeStoredJson(ASSOCIATE_CAREER_STATE_KEY, careerState);
    setState((currentState) => ({ ...currentState, careerState }));
  }, []);

  const setSkillLevel = useCallback((skillName: string, level: SkillLevel) => {
    setState((currentState) => {
      const skillLevels = { ...currentState.skillLevels, [skillName]: level };
      writeStoredJson(ASSOCIATE_SKILLS_STATE_KEY, skillLevels);

      return { ...currentState, skillLevels };
    });
  }, []);

  const setLearningProgress = useCallback((courseId: string, progress: number) => {
    setState((currentState) => {
      const learningProgress = {
        ...currentState.learningProgress,
        [courseId]: Math.max(0, Math.min(100, Math.round(progress))),
      };
      writeStoredJson(ASSOCIATE_LEARNING_STATE_KEY, learningProgress);

      return { ...currentState, learningProgress };
    });
  }, []);

  const viewModel = useMemo(() => buildAssociateProfileViewModel(state), [state]);

  return {
    state,
    viewModel,
    reload: loadAssociateProfile,
    setCareerState,
    setSkillLevel,
    setLearningProgress,
  };
}

export function AssociateProfilePage() {
  const { state, viewModel, reload, setCareerState } = useAssociateProfileModel();
  const identity = viewModel.identity;
  const hasRenderableData = Boolean(identity);
  const displayName = identity?.name || "Associate";
  const firstName = displayName.split(" ")[0] || "Associate";

  return (
    <Box minH="100vh" bg={colors.background} color={colors.primaryText} fontFamily="Arial, Helvetica, sans-serif">
      <AssociateTopNav identity={identity} unreadCount={state.notifications?.unread_count || 0} />

      <Box
        as="main"
        px={{ base: "16px", md: "28px", xl: "46px" }}
        pt={{ base: "28px", md: "34px", xl: "36px" }}
        pb={{ base: "40px", md: "48px" }}
      >
        <VStack align="stretch" gap={{ base: "18px", xl: "20px" }}>
          <HeaderSection identity={identity} firstName={firstName} />

          {(state.status === "loading" || state.status === "idle") && !hasRenderableData ? (
            <LoadingPanel />
          ) : state.status === "error" && !hasRenderableData ? (
            <ErrorPanel message={state.error} onRetry={reload} />
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                xl: "minmax(280px, 0.82fr) minmax(420px, 1.24fr) minmax(340px, 1.18fr)",
              }}
              gap={{ base: "18px", xl: "22px" }}
              alignItems="start"
            >
              <VStack align="stretch" gap={{ base: "18px", xl: "20px" }}>
                <ProfileCard identity={identity} />
                <FocusForYouCard tasks={viewModel.focusTasks} />
                <UpdatesCard updates={viewModel.updates} />
              </VStack>

              <VStack align="stretch" gap={{ base: "18px", xl: "20px" }}>
                <CareerPathCard viewModel={viewModel} onCareerChange={setCareerState} />
                <SkillsOverviewCard viewModel={viewModel} />
              </VStack>

              <VStack align="stretch" gap={{ base: "18px", xl: "20px" }}>
                <MyProjectsCard projects={viewModel.projects} />
                <LearningCard learning={viewModel.learning} />
                <QuickActionsCard />
              </VStack>
            </Grid>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

function AssociateTopNav({
  identity,
  unreadCount,
}: {
  identity: AssociateIdentity | null;
  unreadCount: number;
}) {
  const navItems = ["Overview", "Teams", "Projects", "Talent Pool", "Surveys", "Reports"];
  const todayLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <Box
      as="header"
      bg={colors.surface}
      borderBottom="1px solid"
      borderColor={colors.border}
      boxShadow="0 1px 8px rgba(11, 12, 28, 0.04)"
    >
      <Flex
        minH="74px"
        px={{ base: "16px", md: "28px", xl: "48px" }}
        align="center"
        justify="space-between"
        gap={{ base: 4, xl: 8 }}
        flexWrap={{ base: "wrap", xl: "nowrap" }}
      >
        <HStack gap="14px" flexShrink={0}>
          <LogoMark />
          <Text fontSize={{ base: "17px", md: "18px" }} fontWeight="800" letterSpacing="0">
            Attrition Hub
          </Text>
        </HStack>

        <HStack
          as="nav"
          aria-label="Associate profile sections"
          display={{ base: "none", md: "flex" }}
          flex="1"
          justify="center"
          gap={{ md: "28px", xl: "44px" }}
          minW={0}
        >
          {navItems.map((item, index) => (
            <Box key={item} position="relative" h="74px" display="flex" alignItems="center">
              <Text
                color={index === 0 ? colors.primary : colors.primaryText}
                fontSize="13px"
                fontWeight="800"
                lineHeight="1"
                whiteSpace="nowrap"
              >
                {item}
              </Text>
              {index === 0 && (
                <Box position="absolute" left="0" right="0" bottom="0" h="3px" bg={colors.primary} />
              )}
            </Box>
          ))}
        </HStack>

        <HStack gap={{ base: 2.5, md: 3 }} flexShrink={0}>
          <Box position="relative" display={{ base: "none", "2xl": "block" }} w="260px">
            <Box position="absolute" left="13px" top="50%" transform="translateY(-50%)" color={colors.mutedText}>
              <Search size={16} />
            </Box>
            <Input
              aria-label="Search"
              h="40px"
              pl="40px"
              bg="#F8FAFD"
              border="1px solid"
              borderColor={colors.lightBorder}
              borderRadius="6px"
              fontSize="13px"
              placeholder="Search"
            />
          </Box>

          <Button
            display={{ base: "none", lg: "inline-flex" }}
            h="40px"
            px="14px"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            color={colors.primaryText}
            fontSize="13px"
            fontWeight="800"
            _hover={{ bg: "#F8FAFD" }}
          >
            <CalendarDays size={15} color={colors.secondaryText} />
            {todayLabel}
          </Button>

          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              h="40px"
              w="40px"
              minW="40px"
              bg="transparent"
              borderRadius="full"
              color={colors.primaryText}
              _hover={{ bg: colors.primarySoft }}
            >
              <Bell size={20} />
            </IconButton>
            {unreadCount > 0 && (
              <Box
                position="absolute"
                top="2px"
                right="1px"
                minW="17px"
                h="17px"
                borderRadius="999px"
                bg={colors.primary}
                color={colors.surface}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="10px"
                fontWeight="800"
                border="2px solid"
                borderColor={colors.surface}
              >
                {unreadCount}
              </Box>
            )}
          </Box>

          <HStack gap="12px">
            <Avatar identity={identity} size="42px" />
            <Box display={{ base: "none", sm: "block" }}>
              <Text fontSize="13px" fontWeight="800" lineHeight="1.15">
                {identity?.name || "Associate"}
              </Text>
              <Text color={colors.mutedText} fontSize="12px" fontWeight="700" mt="3px">
                {identity?.role || "Associate"}
              </Text>
            </Box>
            <ChevronDown size={16} color={colors.secondaryText} />
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}

function HeaderSection({ identity, firstName }: { identity: AssociateIdentity | null; firstName: string }) {
  const stats = [
    { icon: User, label: identity?.title || "Role unavailable" },
    { icon: Building2, label: identity?.department || "Department unavailable" },
    { icon: MapPin, label: identity?.location || "Location unavailable" },
    { icon: CalendarDays, label: identity?.tenureLabel ? `${identity.tenureLabel} with company` : "Tenure unavailable" },
  ];

  return (
    <Flex direction={{ base: "column", xl: "row" }} justify="space-between" align={{ base: "stretch", xl: "center" }} gap="18px">
      <Box>
        <Text as="h1" color={colors.primaryText} fontSize={{ base: "22px", md: "24px" }} fontWeight="800" lineHeight="1.15">
          Good morning, {firstName}
        </Text>
        <Text color={colors.secondaryText} fontSize="14px" fontWeight="600" mt="8px">
          Here is your workspace for today.
        </Text>
      </Box>

      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 4 }}
        gap="0"
        bg={colors.surface}
        border={cardBorder}
        borderColor={colors.border}
        borderRadius={cardRadius}
        boxShadow={cardShadow}
        overflow="hidden"
      >
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <HStack key={item.label} gap="10px" px="18px" py="14px" minW={{ lg: "170px" }}>
              <Icon size={17} color={colors.secondaryText} />
              <Text fontSize="13px" fontWeight="800" whiteSpace="nowrap" color={colors.primaryText}>
                {item.label}
              </Text>
            </HStack>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
}

function DashboardCard({
  title,
  actionLabel,
  children,
  minH,
  showArrow=true,
}: {
  title: string;
  actionLabel?: string;
  children: ReactNode;
  minH?: string;
  showArrow?: boolean;
}) {
  return (
    <Box bg={colors.surface} border={cardBorder} borderColor={colors.border} borderRadius={cardRadius} boxShadow={cardShadow} minH={minH} overflow="hidden">
      <Flex align="center" justify="space-between" gap="12px" px="22px" pt="22px" pb="16px">
        <Text as="h2" fontSize="15px" fontWeight="800" lineHeight="1">
          {title}
        </Text>
        {actionLabel && (
          <ActionLink showArrow={showArrow}>
            {actionLabel}
          </ActionLink>
        )}
      </Flex>
      {children}
    </Box>
  );
}

function ProfileCard({ identity }: { identity: AssociateIdentity | null }) {
  const detailRows = [
    ["Employee ID", identity?.id],
    ["Manager", identity?.manager],
    ["Team", identity?.team],
    ["Date Joined", identity?.joinDateLabel],
    ["Location", identity?.location],
  ];

  return (
    <DashboardCard title="" minH="318px">
      <VStack align="stretch" gap="20px" px="22px" pb="22px">
        <HStack gap="18px">
          <Avatar identity={identity} size="76px" />
          <Box minW={0}>
            <HStack gap="10px" align="center">
              <Text fontSize="18px" fontWeight="800" lineHeight="1.15" truncate>
                {identity?.name || "Associate"}
              </Text>
              <Badge bg="#E8F8F0" color={colors.success} borderRadius="6px" px="8px" py="4px" fontSize="11px" fontWeight="800">
                {identity?.status || "Active"}
              </Badge>
            </HStack>
            <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="8px">
              {identity?.title || "Role unavailable"}
            </Text>
          </Box>
        </HStack>

        <Box h="1px" bg={colors.lightBorder} />

        <VStack align="stretch" gap="13px">
          {detailRows.map(([label, value]) => (
            <HStack key={label} justify="space-between" gap="16px">
              <Text color={colors.mutedText} fontSize="13px" fontWeight="700">
                {label}
              </Text>
              <Text color={colors.primaryText} fontSize="13px" fontWeight="800" textAlign="right">
                {value || "Unavailable"}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </DashboardCard>
  );
}

function FocusForYouCard({ tasks }: { tasks: FocusTaskSummary[] }) {
  return (
    <DashboardCard title="Focus for You" actionLabel={`${tasks.length} tasks`} minH="388px" showArrow={false}>
      {tasks.length === 0 ? (
        <EmptyState icon={Star} title="No focus tasks" message="Action items assigned to you will appear here." />
      ) : (
        <VStack align="stretch" gap="0">
          {tasks.slice(0, 4).map((task) => (
            <HStack key={task.id} justify="space-between" gap="14px" px="22px" py="18px" borderTop="1px solid" borderColor={colors.lightBorder}>
              <HStack gap="14px" minW={0}>
                <PriorityPill priority={task.priority} />
                <Box minW={0}>
                  <Text fontSize="13px" fontWeight="800" truncate>
                    {task.title}
                  </Text>
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="5px">
                    {task.dueLabel ? `Due: ${task.dueLabel}` : task.status}
                  </Text>
                </Box>
              </HStack>
              <IconButton aria-label={`Open ${task.title}`} h="30px" w="30px" minW="30px" bg={colors.primarySoft} color={colors.primary} borderRadius="6px">
                <ArrowRight size={15} />
              </IconButton>
            </HStack>
          ))}
        </VStack>
      )}
    </DashboardCard>
  );
}

function CareerPathCard({
  viewModel,
  onCareerChange,
}: {
  viewModel: AssociateProfileViewModel;
  onCareerChange: (careerState: CareerGoalState) => void;
}) {
  const { career } = viewModel;
  const [isAspirationOpen, setIsAspirationOpen] = useState(false);
  const selectedAspiration = getAspirationByLabel(career.selectedGoal);
  const currentYear = viewModel.identity?.joinDateLabel?.slice(-4) || "2022";
  const targetYear = selectedAspiration.targetDate.slice(0, 4);
  const targetLabel = formatDateLabel(selectedAspiration.targetDate) || "Target date not set";

  const handleAspirationSelect = (option: AspirationOption) => {
    onCareerChange(getCareerStateForAspiration(option));
    setIsAspirationOpen(false);
  };

  return (
    <DashboardCard title="Career Path" actionLabel="View details" minH="352px">
      <VStack align="stretch" gap="18px" px="22px" pb="22px">
        <Box position="relative">
          <Text color={colors.secondaryText} fontSize="12px" fontWeight="800" mb="9px">
            Aspiration
          </Text>
          <HStack
            as="button"
            w="full"
            h="44px"
            justify="space-between"
            border="1px solid"
            borderColor={isAspirationOpen ? colors.primaryLight : colors.border}
            borderRadius="8px"
            px="14px"
            bg={colors.surface}
            color={colors.primaryText}
            boxShadow={isAspirationOpen ? "0 0 0 3px rgba(29, 127, 227, 0.08)" : "none"}
            _hover={{ bg: "#F8FAFD", borderColor: colors.primaryLight }}
            onClick={() => setIsAspirationOpen((isOpen) => !isOpen)}
            aria-expanded={isAspirationOpen}
            aria-haspopup="listbox"
          >
            <HStack gap="10px" minW={0}>
              <Target size={18} color={colors.secondaryText} />
              <Text fontSize="13px" fontWeight="800" truncate>
                {selectedAspiration.label}
              </Text>
            </HStack>
            <ChevronDown size={16} color={colors.secondaryText} />
          </HStack>

          {isAspirationOpen && (
            <Box
              role="listbox"
              position="absolute"
              left="0"
              right="0"
              top="calc(100% + 8px)"
              zIndex={10}
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="10px"
              boxShadow="0 14px 34px rgba(11, 12, 28, 0.14)"
              overflow="hidden"
            >
              {aspirationOptions.map((option) => (
                <Box
                  key={option.value}
                  as="button"
                  role="option"
                  aria-selected={option.label === selectedAspiration.label}
                  w="full"
                  textAlign="left"
                  px="14px"
                  py="12px"
                  bg={option.label === selectedAspiration.label ? colors.primarySoft : colors.surface}
                  _hover={{ bg: "#F8FAFD" }}
                  onClick={() => handleAspirationSelect(option)}
                >
                  <Text fontSize="13px" fontWeight="800" color={colors.primaryText}>
                    {option.label}
                  </Text>
                  <Text mt="4px" fontSize="12px" fontWeight="600" color={colors.secondaryText}>
                    Focus: {option.requiredSkills.slice(0, 3).join(", ")}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 32px 1fr" }} gap="18px" alignItems="center">
          <CareerStep icon={User} label="Current Role" value={viewModel.identity?.title || "Unavailable"} tone="primary" />
          <Box display={{ base: "none", md: "flex" }} justifyContent="center" color={colors.mutedText}>
            <ArrowRight size={18} />
          </Box>
          <CareerStep icon={Flag} label="Next Goal" value={career.selectedGoal || "No goal saved"} tone="success" />
        </Grid>

        <Box h="1px" bg={colors.lightBorder} />

        <VStack align="stretch" gap="18px">
          <Box>
            <Text color={colors.primaryText} fontSize="13px" fontWeight="800" mb="14px">
              Growth Timeline
            </Text>
            <Box position="relative" px="8px" pb="2px">
              <Box position="absolute" left="18px" right="18px" top="9px" h="2px" bg={colors.lightBorder} />
              <Box position="absolute" left="18px" right="50%" top="9px" h="2px" bg={colors.primary} />
              <SimpleGrid columns={3} gap="12px" position="relative">
                <TimelineMilestone year={currentYear} label="Joined" tone="primary" />
                <TimelineMilestone year="Now" label={viewModel.identity?.title || "Current role"} tone="success" />
                <TimelineMilestone year={targetYear} label={selectedAspiration.label} tone="warning" />
              </SimpleGrid>
            </Box>
            <HStack mt="14px" gap="9px" color={colors.secondaryText}>
              <CalendarDays size={15} />
              <Text fontSize="12px" fontWeight="700">
                Target: {targetLabel}
              </Text>
            </HStack>
          </Box>

          <Box pt="16px" borderTop="1px solid" borderColor={colors.lightBorder}>
            <Text color={colors.primaryText} fontSize="13px" fontWeight="800" mb="12px">
              Top Skills to Focus
            </Text>
            <Flex gap="9px" flexWrap="wrap">
              {selectedAspiration.requiredSkills.map((skill) => (
                <Badge
                  key={skill}
                  bg="#F8FAFD"
                  color={colors.secondaryText}
                  border="1px solid"
                  borderColor={colors.border}
                  borderRadius="999px"
                  px="10px"
                  py="6px"
                  fontSize="11px"
                  fontWeight="800"
                >
                  {skill}
                </Badge>
              ))}
            </Flex>
          </Box>
        </VStack>
      </VStack>
    </DashboardCard>
  );
}

function SkillsOverviewCard({ viewModel }: { viewModel: AssociateProfileViewModel }) {
  return (
    <DashboardCard title="Skills Overview" actionLabel="View all skills" minH="236px">
      {viewModel.skills.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No skills saved" message="Skill proficiency saved by the associate will appear here." compact />
      ) : (
        <Grid templateColumns={{ base: "1fr", lg: "1fr minmax(210px, 0.92fr)" }} gap="20px" px="22px" pb="22px">
          <VStack align="stretch" gap="13px">
            {viewModel.skills.slice(0, 6).map((skill) => (
              <HStack key={skill.name} justify="space-between" gap="18px">
                <Text fontSize="13px" fontWeight="800" color={colors.primaryText}>
                  {skill.name}
                </Text>
                <HStack gap="8px">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      w="11px"
                      h="11px"
                      borderRadius="full"
                      bg={level <= skill.level ? colors.primary : colors.surface}
                      border="1px solid"
                      borderColor={level <= skill.level ? colors.primary : "#AEB9CA"}
                    />
                  ))}
                </HStack>
              </HStack>
            ))}
          </VStack>

          <Box borderLeft={{ lg: "1px solid" }} borderColor={colors.lightBorder} pl={{ lg: "22px" }}>
            <Box bg="#F8FBFF" border="1px solid" borderColor={colors.border} borderRadius="10px" p="18px">
              <Text color={colors.primary} fontSize="12px" fontWeight="800">
                Recommended for you
              </Text>
              <Text fontSize="14px" fontWeight="800" mt="12px">
                {viewModel.careerProgress.skillsToStrengthen[0] || "No skill gap calculated"}
              </Text>
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="700" mt="10px">
                Based on your saved career goal
              </Text>
              <ActionLink mt="18px">Explore learning</ActionLink>
            </Box>
          </Box>
        </Grid>
      )}
    </DashboardCard>
  );
}

function MyProjectsCard({ projects }: { projects: AssociateProjectSummary[] }) {
  return (
    <DashboardCard title="My Projects" actionLabel="View all projects" minH="310px">
      {projects.length === 0 ? (
        <EmptyState icon={BriefcaseBusiness} title="No active projects" message="Projects returned by your account will appear here." />
      ) : (
        <VStack align="stretch" gap="0" px="22px" pb="14px">
          {projects.slice(0, 3).map((project, index) => (
            <HStack key={project.id} align="center" gap="16px" py="18px" borderTop={index === 0 ? "1px solid" : undefined} borderColor={colors.lightBorder}>
              <IconTile tone={index % 2 === 0 ? "primary" : "success"}>
                <Layers3 size={27} />
              </IconTile>
              <Box minW={0} flex="1">
                <HStack gap="9px">
                  <Text fontSize="14px" fontWeight="800" truncate>
                    {project.name}
                  </Text>
                  <Badge bg={colors.primarySoft} color={colors.secondaryText} borderRadius="6px" px="8px" py="3px" fontSize="11px" fontWeight="800">
                    {project.status}
                  </Badge>
                </HStack>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" mt="8px">
                  {project.role || "Role unavailable"}
                </Text>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" mt="8px" truncate>
                  {project.techStack.length > 0 ? `Tech: ${project.techStack.join(" • ")}` : "Tech stack unavailable"}
                </Text>
                <Box mt="12px">
                  <ProgressBar value={project.allocation ?? 0} color={index % 2 === 0 ? colors.primary : colors.success} muted={!project.allocation} />
                </Box>
              </Box>
              <Box textAlign="right" minW="62px">
                <Text fontSize="15px" fontWeight="800">
                  {project.allocation === null ? "--" : `${project.allocation}%`}
                </Text>
                <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" mt="7px">
                  Allocation
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      )}
    </DashboardCard>
  );
}

function LearningCard({ learning }: { learning: LearningSummary[] }) {
  return (
    <DashboardCard title="Learning & Development" actionLabel="View all" minH="284px">
      {learning.length === 0 ? (
        <EmptyState icon={BookOpen} title="No learning items" message="Courses returned by the learning service will appear here." compact />
      ) : (
        <VStack align="stretch" gap="14px" px="22px" pb="22px">
          {learning.slice(0, 2).map((item, index) => (
            <Box key={item.id} bg="#F8FBFF" border="1px solid" borderColor={colors.border} borderRadius="10px" p="16px">
              <HStack justify="space-between" align="center" gap="14px">
                <Box minW={0}>
                  <Text color={colors.primary} fontSize="12px" fontWeight="800">
                    {index === 0 ? "Continue Learning" : "Recommended for you"}
                  </Text>
                  <Text fontSize="13px" fontWeight="800" mt="10px" truncate>
                    {item.title}
                  </Text>
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" mt="9px" truncate>
                    {item.category || item.description || "Course details unavailable"}
                  </Text>
                </Box>
                <Button h="36px" px="16px" bg={colors.surface} border="1px solid" borderColor={colors.border} borderRadius="6px" color={colors.primary} fontSize="12px" fontWeight="800">
                  {item.progress === null ? "Explore" : "Continue"}
                </Button>
              </HStack>
              {item.progress !== null && (
                <HStack gap="16px" mt="14px">
                  <ProgressBar value={item.progress} color={colors.primary} />
                  <Text minW="38px" fontSize="13px" fontWeight="800">
                    {item.progress}%
                  </Text>
                </HStack>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </DashboardCard>
  );
}

function UpdatesCard({ updates }: { updates: AssociateUpdateSummary[] }) {
  return (
    <DashboardCard title="Updates & Alerts" actionLabel="View all updates" minH="230px">
      {updates.length === 0 ? (
        <EmptyState icon={Bell} title="No updates" message="Notifications from the API will appear here." compact />
      ) : (
        <VStack align="stretch" gap="14px" px="22px" pb="22px">
          {updates.slice(0, 3).map((update) => (
            <HStack key={update.id} gap="14px" align="flex-start">
              <IconTile tone={update.type === "warning" ? "warning" : update.type === "error" ? "danger" : "primary"} size="42px">
                <Bell size={18} />
              </IconTile>
              <Box flex="1" minW={0}>
                <HStack justify="space-between" gap="12px" align="start">
                  <Text fontSize="13px" fontWeight="800" truncate>
                    {update.title}
                  </Text>
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" whiteSpace="nowrap">
                    {update.timestamp}
                  </Text>
                </HStack>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="5px" truncate>
                  {update.description}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      )}
    </DashboardCard>
  );
}

function QuickActionsCard() {
  const actions = [
    { label: "Validate Skills", icon: ShieldCheck },
    { label: "View Learning", icon: BookOpen },
    { label: "Request Feedback", icon: MessageSquareText },
    { label: "Update Profile", icon: User },
  ];

  return (
    <DashboardCard title="Quick Actions" minH="150px">
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="14px" px="22px" pb="22px">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              h="70px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="8px"
              color={colors.primaryText}
              fontSize="11px"
              fontWeight="800"
              flexDirection="column"
              gap="8px"
              _hover={{ bg: "#F8FAFD", borderColor: colors.primaryLight }}
            >
              <Icon size={22} color={colors.primary} />
              {action.label}
            </Button>
          );
        })}
      </SimpleGrid>
    </DashboardCard>
  );
}

function LogoMark() {
  return (
    <Box w="36px" h="36px" position="relative" flexShrink={0}>
      <Box position="absolute" inset="0" bg="linear-gradient(135deg, #5F7BF3 0%, #1D7FE3 100%)" clipPath="polygon(50% 0%, 92% 25%, 92% 76%, 50% 100%, 8% 76%, 8% 25%)" />
      <Box position="absolute" inset="7px" bg={colors.surface} clipPath="polygon(50% 0%, 92% 25%, 92% 76%, 50% 100%, 8% 76%, 8% 25%)" />
      <Box position="absolute" right="0" bottom="2px" w="16px" h="16px" bg={colors.primaryLight} clipPath="polygon(50% 0%, 92% 25%, 92% 76%, 50% 100%, 8% 76%, 8% 25%)" />
    </Box>
  );
}

function Avatar({ identity, size }: { identity: AssociateIdentity | null; size: string }) {
  const initials = (identity?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (identity?.avatar) {
    return (
      <Image
        src={identity.avatar}
        alt={identity.name}
        w={size}
        h={size}
        borderRadius="full"
        objectFit="cover"
        flexShrink={0}
      />
    );
  }

  return (
    <Box
      w={size}
      h={size}
      borderRadius="full"
      bg={colors.primarySoft}
      color={colors.primary}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="14px"
      fontWeight="800"
      flexShrink={0}
    >
      {initials}
    </Box>
  );
}

function CareerStep({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "primary" | "success";
}) {
  return (
    <HStack gap="13px" border="1px solid" borderColor={colors.border} borderRadius="10px" p="16px">
      <IconTile tone={tone} size="40px">
        <Icon size={19} />
      </IconTile>
      <Box minW={0}>
        <Text color={colors.mutedText} fontSize="11px" fontWeight="800">
          {label}
        </Text>
        <Text fontSize="13px" fontWeight="800" mt="5px" truncate>
          {value}
        </Text>
      </Box>
    </HStack>
  );
}

function TimelineMilestone({
  year,
  label,
  tone,
}: {
  year: string;
  label: string;
  tone: "primary" | "success" | "warning";
}) {
  const toneStyles = {
    primary: { bg: colors.primary, shadow: "rgba(29, 127, 227, 0.15)" },
    success: { bg: colors.success, shadow: "rgba(57, 186, 133, 0.15)" },
    warning: { bg: colors.warning, shadow: "rgba(253, 184, 63, 0.16)" },
  }[tone];

  return (
    <VStack align="stretch" gap="10px">
      <Box
        w="18px"
        h="18px"
        borderRadius="full"
        bg={toneStyles.bg}
        border="4px solid"
        borderColor={colors.surface}
        boxShadow={`0 0 0 5px ${toneStyles.shadow}`}
        mx="auto"
        position="relative"
        zIndex={1}
      />
      <Box bg="#F8FAFD" border="1px solid" borderColor={colors.border} borderRadius="8px" px="10px" py="9px" textAlign="center" minH="58px">
        <Text color={toneStyles.bg} fontSize="12px" fontWeight="800" lineHeight="1">
          {year}
        </Text>
        <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" mt="7px" truncate>
          {label}
        </Text>
      </Box>
    </VStack>
  );
}

function IconTile({
  tone,
  children,
  size = "56px",
}: {
  tone: "primary" | "success" | "warning" | "danger";
  children: ReactNode;
  size?: string;
}) {
  const toneStyles = {
    primary: { bg: colors.primarySoft, color: colors.primary },
    success: { bg: "#E8F8F0", color: colors.success },
    warning: { bg: "#FFF3DE", color: "#F97316" },
    danger: { bg: "#FDEDEA", color: colors.danger },
  }[tone];

  return (
    <Box
      w={size}
      h={size}
      minW={size}
      borderRadius="12px"
      bg={toneStyles.bg}
      color={toneStyles.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Box>
  );
}

function PriorityPill({ priority }: { priority: string }) {
  const normalizedPriority = priority.toLowerCase();
  const style =
    normalizedPriority === "high"
      ? { bg: "#FDEDEA", color: colors.danger }
      : normalizedPriority === "low"
        ? { bg: colors.primarySoft, color: colors.secondaryText }
        : { bg: "#FFF3DE", color: "#F97316" };

  return (
    <Box px="10px" py="5px" minW="58px" textAlign="center" bg={style.bg} color={style.color} borderRadius="6px" fontSize="11px" fontWeight="800">
      {priority}
    </Box>
  );
}

function ProgressBar({
  value,
  color,
  muted,
}: {
  value: number;
  color: string;
  muted?: boolean;
}) {
  return (
    <Box flex="1" h="6px" bg="#EEF1F5" borderRadius="999px" overflow="hidden">
      <Box h="full" w={`${Math.max(0, Math.min(100, value))}%`} bg={muted ? "#D7DEE8" : color} borderRadius="999px" />
    </Box>
  );
}

function ActionLink({
  children,
  mt,
  showArrow = true,
}: {
  children: ReactNode;
  mt?: string;
  showArrow?: boolean;
}) {
  return (
    <HStack as="button" mt={mt} gap="8px" color={colors.primary} fontSize="13px" fontWeight="800" lineHeight="1" whiteSpace="nowrap" _hover={{ color: "#1668BA" }}>
      <Text as="span">{children}</Text>
      {showArrow && <ArrowRight size={15} strokeWidth={2.3} />}
    </HStack>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  compact?: boolean;
}) {
  return (
    <VStack align="center" justify="center" gap="10px" minH={compact ? "110px" : "190px"} px="22px" pb="22px" textAlign="center">
      <IconTile tone="primary" size="42px">
        <Icon size={18} />
      </IconTile>
      <Text fontSize="13px" fontWeight="800">
        {title}
      </Text>
      <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" maxW="280px">
        {message}
      </Text>
    </VStack>
  );
}

function LoadingPanel() {
  return (
    <Box bg={colors.surface} border={cardBorder} borderColor={colors.border} borderRadius={cardRadius} boxShadow={cardShadow} py="72px">
      <VStack gap="14px">
        <Spinner color={colors.primary} />
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
          Loading associate profile
        </Text>
      </VStack>
    </Box>
  );
}

function ErrorPanel({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <Box bg={colors.surface} border={cardBorder} borderColor={colors.border} borderRadius={cardRadius} boxShadow={cardShadow} p="28px">
      <VStack align="flex-start" gap="14px">
        <IconTile tone="danger" size="44px">
          <ClipboardCheck size={19} />
        </IconTile>
        <Box>
          <Text fontSize="15px" fontWeight="800">
            Could not load associate profile
          </Text>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="6px">
            {message || "Please try again."}
          </Text>
        </Box>
        <Button onClick={onRetry} h="38px" bg={colors.primary} color={colors.surface} borderRadius="6px" fontSize="13px" fontWeight="800">
          Retry
        </Button>
      </VStack>
    </Box>
  );
}
