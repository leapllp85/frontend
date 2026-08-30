export const talentManagementPageCopy = {
  title: "Talent Management",
  subtitle: "Optimize project staffing and make the right talent assignments.",
};

export const talentManagementTabs = [
  {
    id: "analytics",
    label: "Talent Analytics",
  },
  {
    id: "pool",
    label: "Talent Pool",
  },
] as const;

export type TalentManagementTabId = (typeof talentManagementTabs)[number]["id"];
export type TalentTone = "primary" | "success" | "warning" | "danger" | "purple" | "neutral";
export type SkillDemandStatus = "High" | "Medium" | "Low" | "Good";
export type TalentAvailability = "Available" | "Busy";
export type TalentValidationLevel = "High" | "Medium" | "Low";
export type TalentDepartment = "Engineering" | "Product" | "Data";

export type TalentPoolSkill = {
  name: string;
  validation: TalentValidationLevel;
};

export type TalentPoolMember = {
  id: string;
  name: string;
  role: string;
  department: TalentDepartment;
  initials: string;
  avatarUrl?: string;
  avatarBg: string;
  availability: TalentAvailability;
  workingOn?: string;
  experience: string;
  currentRole: string;
  skills: TalentPoolSkill[];
};

export const talentValidationLevelLabels: Record<TalentValidationLevel, string> = {
  High: "Validated in Project",
  Medium: "Manager Given",
  Low: "Self Proclaimed",
};

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

export const talentPoolMembers: readonly TalentPoolMember[] = [
  {
    id: "alice-brown",
    name: "Alice Brown",
    role: "Senior Cloud Engineer",
    department: "Engineering",
    initials: "AB",
    avatarUrl: "https://i.pravatar.cc/96?img=47",
    avatarBg: "linear-gradient(135deg, #F7B267 0%, #D8572A 100%)",
    availability: "Available",
    experience: "6.2 yrs",
    currentRole: "Cloud Engineer",
    skills: [
      { name: "AWS", validation: "High" },
      { name: "Python", validation: "Medium" },
      { name: "Kubernetes", validation: "Medium" },
      { name: "Docker", validation: "Low" },
      { name: "Terraform", validation: "Medium" },
      { name: "CI/CD", validation: "High" },
      { name: "Monitoring", validation: "Low" },
    ],
  },
  {
    id: "david-martinez",
    name: "David Martinez",
    role: "Mobile Developer",
    department: "Engineering",
    initials: "DM",
    avatarUrl: "https://i.pravatar.cc/96?img=12",
    avatarBg: "linear-gradient(135deg, #B7D0E9 0%, #2C415C 100%)",
    availability: "Busy",
    workingOn: "Mobile App Redesign",
    experience: "4.8 yrs",
    currentRole: "Mobile Developer",
    skills: [
      { name: "React Native", validation: "High" },
      { name: "TypeScript", validation: "High" },
      { name: "iOS", validation: "Medium" },
      { name: "Android", validation: "Medium" },
      { name: "GraphQL", validation: "Low" },
      { name: "Firebase", validation: "Medium" },
    ],
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    role: "Data Scientist",
    department: "Data",
    initials: "MP",
    avatarUrl: "https://i.pravatar.cc/96?img=32",
    avatarBg: "linear-gradient(135deg, #F3A683 0%, #B33771 100%)",
    availability: "Available",
    experience: "5.6 yrs",
    currentRole: "Data Scientist",
    skills: [
      { name: "Python", validation: "High" },
      { name: "Machine Learning", validation: "Medium" },
      { name: "SQL", validation: "Low" },
      { name: "Tableau", validation: "Medium" },
      { name: "NLP", validation: "High" },
      { name: "Statistics", validation: "Medium" },
    ],
  },
  {
    id: "marcus-thompson",
    name: "Marcus Thompson",
    role: "DevOps Engineer",
    department: "Engineering",
    initials: "MT",
    avatarUrl: "https://i.pravatar.cc/96?img=68",
    avatarBg: "linear-gradient(135deg, #5D7FA0 0%, #101B2C 100%)",
    availability: "Busy",
    workingOn: "Infrastructure Migration",
    experience: "7.1 yrs",
    currentRole: "DevOps Engineer",
    skills: [
      { name: "AWS", validation: "High" },
      { name: "Docker", validation: "Medium" },
      { name: "Kubernetes", validation: "Medium" },
      { name: "Terraform", validation: "Low" },
      { name: "Linux", validation: "High" },
      { name: "Security", validation: "Medium" },
    ],
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    role: "Product Designer",
    department: "Product",
    initials: "JS",
    avatarUrl: "https://i.pravatar.cc/96?img=45",
    avatarBg: "linear-gradient(135deg, #F8D5C9 0%, #C87E67 100%)",
    availability: "Busy",
    workingOn: "Customer Portal Revamp",
    experience: "4.3 yrs",
    currentRole: "Product Designer",
    skills: [
      { name: "Figma", validation: "High" },
      { name: "UI/UX", validation: "Low" },
      { name: "Prototyping", validation: "Medium" },
      { name: "User Research", validation: "Medium" },
      { name: "Design Systems", validation: "High" },
      { name: "Accessibility", validation: "Medium" },
    ],
  },
  {
    id: "lisa-chen",
    name: "Lisa Chen",
    role: "Backend Developer",
    department: "Engineering",
    initials: "LC",
    avatarUrl: "https://i.pravatar.cc/96?img=5",
    avatarBg: "linear-gradient(135deg, #A8E6CF 0%, #2D8C72 100%)",
    availability: "Available",
    experience: "5.0 yrs",
    currentRole: "Backend Developer",
    skills: [
      { name: "Java", validation: "High" },
      { name: "Spring Boot", validation: "Medium" },
      { name: "SQL", validation: "Low" },
      { name: "AWS", validation: "Medium" },
      { name: "Kafka", validation: "High" },
    ],
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Security Engineer",
    department: "Engineering",
    initials: "PS",
    avatarUrl: "https://i.pravatar.cc/96?img=49",
    avatarBg: "linear-gradient(135deg, #F7B267 0%, #D8572A 100%)",
    availability: "Available",
    experience: "6.8 yrs",
    currentRole: "Security Engineer",
    skills: [
      { name: "Kubernetes", validation: "High" },
      { name: "AWS", validation: "High" },
      { name: "Docker", validation: "Medium" },
      { name: "Threat Modeling", validation: "High" },
      { name: "Compliance", validation: "Medium" },
    ],
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    role: "Cloud Architect",
    department: "Engineering",
    initials: "JW",
    avatarUrl: "https://i.pravatar.cc/96?img=59",
    avatarBg: "linear-gradient(135deg, #E1A177 0%, #6A3A21 100%)",
    availability: "Busy",
    workingOn: "Cloud Cost Optimization",
    experience: "8.4 yrs",
    currentRole: "Cloud Architect",
    skills: [
      { name: "AWS", validation: "High" },
      { name: "Azure", validation: "Medium" },
      { name: "Terraform", validation: "High" },
      { name: "Docker", validation: "Medium" },
      { name: "FinOps", validation: "Low" },
    ],
  },
  {
    id: "emily-rodriguez",
    name: "Emily Rodriguez",
    role: "People Analyst",
    department: "Data",
    initials: "ER",
    avatarUrl: "https://i.pravatar.cc/96?img=44",
    avatarBg: "linear-gradient(135deg, #F8D5C9 0%, #C87E67 100%)",
    availability: "Available",
    experience: "3.9 yrs",
    currentRole: "People Analyst",
    skills: [
      { name: "SQL", validation: "High" },
      { name: "Tableau", validation: "Medium" },
      { name: "Python", validation: "Low" },
      { name: "Survey Design", validation: "Medium" },
      { name: "Storytelling", validation: "High" },
    ],
  },
] as const;
