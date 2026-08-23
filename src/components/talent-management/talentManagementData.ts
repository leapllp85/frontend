export const talentManagementPageCopy = {
  title: "Talent Management",
  subtitle: "Optimize project staffing and make the right talent assignments.",
};

export const talentManagementTabs = [
  {
    id: "analytics",
    label: "Talent Analytics",
    isActive: true,
  },
  {
    id: "pool",
    label: "Talent Pool",
    isActive: false,
  },
] as const;

export type TalentTone = "primary" | "success" | "warning" | "danger" | "purple" | "neutral";
export type SkillDemandStatus = "High" | "Medium" | "Low" | "Good";

export const talentMetrics = [
  {
    id: "team-members",
    label: "Total Team Members",
    value: "8",
    helper: "Across all projects",
    icon: "members",
    tone: "primary",
  },
  {
    id: "active-assignments",
    label: "Active Assignments",
    value: "14",
    helper: "Across projects",
    icon: "assignments",
    tone: "success",
  },
  {
    id: "team-utilization",
    label: "Avg. Team Utilization",
    value: "74%",
    helper: "Team capacity",
    icon: "utilization",
    tone: "warning",
  },
  {
    id: "overallocated",
    label: "Overallocated",
    value: "2",
    helper: "Members > 100%",
    icon: "overallocated",
    tone: "danger",
  },
  {
    id: "available-capacity",
    label: "Available Capacity",
    value: "26%",
    helper: "Unallocated",
    icon: "capacity",
    tone: "purple",
  },
] as const;

export const capacitySegments = [
  {
    id: "optimal",
    chartLabel: "Optimal",
    legendLabel: "Optimal (70% - 100%)",
    count: 3,
    value: 37.5,
    color: "#39BA85",
  },
  {
    id: "underutilized",
    chartLabel: "Underutilized",
    legendLabel: "Underutilized (< 70%)",
    count: 3,
    value: 37.5,
    color: "#2F72F4",
  },
  {
    id: "overallocated",
    chartLabel: "Overallocated",
    legendLabel: "Overallocated (> 100%)",
    count: 2,
    value: 25,
    color: "#FF8A3D",
  },
  {
    id: "unavailable",
    chartLabel: "Unavailable",
    legendLabel: "Unavailable",
    count: 0,
    value: 0,
    color: "#F04355",
  },
] as const;

export const capacityRows = [
  {
    id: "over",
    range: "> 100%",
    label: "Overallocated",
    members: 2,
    percent: 25,
    percentLabel: "25%",
    icons: 5,
    tone: "danger",
  },
  {
    id: "optimal",
    range: "70% - 100%",
    label: "Optimally allocated",
    members: 3,
    percent: 37.5,
    percentLabel: "37.5%",
    icons: 6,
    tone: "success",
  },
  {
    id: "under",
    range: "30% - 70%",
    label: "Underutilized",
    members: 3,
    percent: 37.5,
    percentLabel: "37.5%",
    icons: 6,
    tone: "warning",
  },
  {
    id: "low",
    range: "< 30%",
    label: "Low utilization",
    members: 0,
    percent: 0,
    percentLabel: "0%",
    icons: 4,
    tone: "neutral",
  },
] as const;

export const capacitySummaryAlert = {
  memberCount: 2,
  message:
    "2 members are overallocated. Review their assignments to prevent burnout and reduce attrition risk.",
};

export const talentInsights = [
  {
    id: "overallocated",
    title: "2 members are overallocated",
    description: "High risk of burnout and attrition.",
    icon: "members",
    tone: "danger",
  },
  {
    id: "underutilized",
    title: "3 members underutilized",
    description: "Consider assigning to active projects.",
    icon: "bolt",
    tone: "warning",
  },
  {
    id: "skill-gaps",
    title: "4 skill gaps detected",
    description: "These skills are needed in upcoming projects.",
    icon: "target",
    tone: "purple",
  },
  {
    id: "healthy",
    title: "Team utilization is healthy",
    description: "You are making the most of your team capacity.",
    icon: "smile",
    tone: "success",
  },
] as const;

export const skillsInDemand = [
  {
    skill: "Kubernetes",
    required: 5,
    available: 2,
    gap: 3,
    coverage: 40,
    status: "High" as SkillDemandStatus,
  },
  {
    skill: "React",
    required: 4,
    available: 2,
    gap: 2,
    coverage: 50,
    status: "Medium" as SkillDemandStatus,
  },
  {
    skill: "AWS",
    required: 3,
    available: 2,
    gap: 1,
    coverage: 67,
    status: "Low" as SkillDemandStatus,
  },
  {
    skill: "Python",
    required: 4,
    available: 4,
    gap: 0,
    coverage: 100,
    status: "Good" as SkillDemandStatus,
  },
  {
    skill: "Docker",
    required: 3,
    available: 3,
    gap: 0,
    coverage: 100,
    status: "Good" as SkillDemandStatus,
  },
] as const;

export const availableTalent = [
  {
    id: "priya",
    name: "Priya Sharma",
    role: "Security Engineer",
    initials: "PS",
    avatarBg: "linear-gradient(135deg, #F7B267 0%, #D8572A 100%)",
    skills: ["Kubernetes", "AWS", "Docker"],
    availability: 100,
    availabilityLabel: "100%",
  },
  {
    id: "james",
    name: "James Wilson",
    role: "DevOps Engineer",
    initials: "JW",
    avatarBg: "linear-gradient(135deg, #E1A177 0%, #6A3A21 100%)",
    skills: ["AWS", "Docker", "Terraform"],
    availability: 75,
    availabilityLabel: "75%",
  },
  {
    id: "maya",
    name: "Maya Patel",
    role: "Data Engineer",
    initials: "MP",
    avatarBg: "linear-gradient(135deg, #F3A683 0%, #B33771 100%)",
    skills: ["Python", "SQL", "Machine Learning"],
    availability: 50,
    availabilityLabel: "50%",
  },
] as const;
