"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Box, Button, Flex, Grid, HStack, IconButton, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  Atom,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Cloud,
  Code2,
  Cpu,
  Database,
  Droplet,
  Dumbbell,
  Eye,
  GitBranch,
  Heart,
  LockKeyhole,
  MessageCircle,
  Moon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Utensils,
  User,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cardBorder, colors } from "@/types/styles";

type HealthGrowthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Tone = "primary" | "success" | "warning" | "purple" | "orange";

type ActionTile = {
  title: string;
  detail: string;
  icon: LucideIcon;
  tone: Tone;
};

type ScheduleItem = {
  time: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  tone: Tone;
  bg: string;
};

type ResourceItem = {
  title: string;
  detail: string;
  image: string;
};

type SkillMetric = {
  value: string;
  label: string;
  tone: Tone;
  progress: number;
};

type SkillBreakdownItem = {
  title: string;
  detail: string;
  score: number;
  icon: LucideIcon;
  tone: Tone;
};

type GrowthChartPoint = {
  label: string;
  yourSkill: number;
  market: number;
};

type LearningQuarter = {
  quarter: string;
  title: string;
  detail: string;
  tone: Tone;
};

const actionTiles: ActionTile[] = [
  { title: "5-Min Meditation", detail: "Start now", icon: Users, tone: "primary" },
  { title: "Desk Stretches", detail: "3 exercises", icon: Dumbbell, tone: "success" },
  { title: "Sleep Tracker", detail: "7.5h avg", icon: Moon, tone: "purple" },
  { title: "Water Reminder", detail: "6/8 glasses", icon: Droplet, tone: "primary" },
];

const scheduleItems: ScheduleItem[] = [
  { time: "9:00 AM", title: "Morning Stretch", detail: "5 min desk exercises", icon: Dumbbell, tone: "success", bg: "#EAF9F3" },
  { time: "11:00 AM", title: "Hydration Break", detail: "Drink water", icon: Droplet, tone: "primary", bg: "#EBF4FF" },
  { time: "1:00 PM", title: "Lunch & Walk", detail: "15 min outdoor", icon: Utensils, tone: "purple", bg: "#F5F0FF" },
  { time: "3:00 PM", title: "Eye Rest", detail: "20-20-20 rule", icon: Eye, tone: "orange", bg: "#FFF2E8" },
  { time: "5:00 PM", title: "Mindful Moment", detail: "5 min breathing exercise", icon: Moon, tone: "primary", bg: "#EAF5FF" },
];

const wellnessTips: ActionTile[] = [
  { title: "Practice Mindfulness", detail: "5 min daily meditation", icon: Users, tone: "primary" },
  { title: "Desk Yoga", detail: "Stretch at your desk", icon: Dumbbell, tone: "success" },
  { title: "Eye Rest", detail: "20-20-20 rule", icon: Sparkles, tone: "purple" },
  { title: "Quick Walk", detail: "15-min walk boosts mood", icon: Dumbbell, tone: "orange" },
  { title: "Neck Stretch", detail: "Release desk tension", icon: Waves, tone: "warning" },
  { title: "Quality Sleep", detail: "7-9 hours nightly", icon: Moon, tone: "primary" },
  { title: "Connect Socially", detail: "Regular catch-ups", icon: Users, tone: "success" },
];

const stressResources: ResourceItem[] = [
  {
    title: "Deep Breathing",
    detail: "4-7-8 technique",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
  },
  {
    title: "Muscle Relaxation",
    detail: "Progressive technique",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  },
  {
    title: "Nature Therapy",
    detail: "20 min outdoors",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    title: "Music Therapy",
    detail: "Calming sounds",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
  },
];

const skillMetrics: SkillMetric[] = [
  { value: "4", label: "Total Skills", tone: "primary", progress: 72 },
  { value: "2", label: "Expert", tone: "purple", progress: 58 },
  { value: "3", label: "Projects", tone: "success", progress: 76 },
  { value: "100%", label: "Engaged", tone: "primary", progress: 100 },
];

const skillBreakdown: SkillBreakdownItem[] = [
  { title: "Advanced React", detail: "Hooks, Performance, Patterns", score: 95, icon: Atom, tone: "primary" },
  { title: "GraphQL & APIs", detail: "Apollo, Schema, Resolvers", score: 82, icon: GitBranch, tone: "purple" },
  { title: "AI/ML Integration", detail: "ChatGPT, TensorFlow, LangChain", score: 99, icon: Cpu, tone: "warning" },
  { title: "Python & Data Science", detail: "Pandas, NumPy, Scikit-learn", score: 98, icon: Database, tone: "success" },
  { title: "Kubernetes & Docker", detail: "Container Orchestration", score: 88, icon: Code2, tone: "primary" },
  { title: "AWS & Cloud Services", detail: "EC2, Lambda, S3", score: 85, icon: Cloud, tone: "primary" },
];

const growthChartPoints: GrowthChartPoint[] = [
  { label: "React", yourSkill: 42, market: 26 },
  { label: "GraphQL", yourSkill: 51, market: 34 },
  { label: "AI/ML", yourSkill: 60, market: 40 },
  { label: "Python", yourSkill: 70, market: 50 },
  { label: "K8s", yourSkill: 81, market: 60 },
  { label: "AWS", yourSkill: 92, market: 69 },
];

const learningTimeline: LearningQuarter[] = [
  { quarter: "Q1", title: "React", detail: "Months 1-3", tone: "purple" },
  { quarter: "Q2", title: "GraphQL", detail: "Months 4-6", tone: "primary" },
  { quarter: "Q3", title: "AI / ML", detail: "Months 7-9", tone: "orange" },
  { quarter: "Q4", title: "Cloud", detail: "Months 10-12", tone: "success" },
];

const toneStyles: Record<Tone, { bg: string; color: string; border?: string }> = {
  primary: { bg: colors.primarySoft, color: colors.primary },
  success: { bg: "#E8F8F0", color: colors.success },
  warning: { bg: "#FFF3DE", color: colors.warning },
  purple: { bg: "#F0EAFF", color: "#7658D5" },
  orange: { bg: "#FFF0E5", color: "#D86B2B" },
};

export function HealthGrowthModal({ isOpen, onClose }: HealthGrowthModalProps) {
  const [activeTab, setActiveTab] = useState<"skills" | "wellness">("wellness");
  const [isExpertChatOpen, setIsExpertChatOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("wellness");
      setIsExpertChatOpen(false);
      setIsAnonymous(false);
      setIsConnecting(false);
      setShowWelcome(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isConnecting) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsConnecting(false);
      setShowWelcome(true);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isConnecting]);

  if (!isOpen) {
    return null;
  }

  const closeExpertChat = () => {
    setIsExpertChatOpen(false);
    setIsAnonymous(false);
    setIsConnecting(false);
    setShowWelcome(false);
  };

  return (
    <>
      <Box
        position="fixed"
        inset="0"
        zIndex={1300}
        bg="rgba(20, 35, 58, 0.58)"
        backdropFilter="blur(7px)"
        display="flex"
        alignItems={{ base: "flex-start", xl: "center" }}
        justifyContent="center"
        px={{ base: "14px", md: "22px", xl: "24px", "2xl": "58px" }}
        py={{ base: "18px", md: "22px", xl: "26px", "2xl": "58px" }}
        overflowY="auto"
        onClick={onClose}
      >
        <Box
          w="full"
          maxW={{ base: "100%", xl: "1280px", "2xl": "1774px" }}
          maxH={{ base: "none", xl: "88vh" }}
          bg="rgba(255, 255, 255, 0.98)"
          border="1px solid rgba(222, 229, 240, 0.94)"
          borderRadius="8px"
          boxShadow="0 34px 86px rgba(14, 25, 44, 0.34)"
          overflow="hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <Box maxH={{ base: "none", xl: "88vh" }} overflowY="auto">
            <Flex
              px={{ base: "22px", lg: "24px", "2xl": "32px" }}
              py={{ base: "20px", lg: "18px", "2xl": "25px" }}
              align="center"
              justify="space-between"
              borderBottom="1px solid"
              borderColor="#DDE5F1"
              gap="18px"
            >
              <HStack gap={{ base: "18px", xl: "16px", "2xl": "24px" }} minW={0}>
                <IconBadge icon={activeTab === "skills" ? TrendingUp : Waves} tone="primary" size={{ base: "54px", xl: "48px", "2xl": "60px" }} iconSize={24} radius="13px" />
                <Box minW={0}>
                  <Text as="h2" color="#071E54" fontSize={{ base: "22px", md: "24px", xl: "22px", "2xl": "25px" }} fontWeight="800" lineHeight="1.05">
                    {activeTab === "skills" ? "Skill Analysis & Career Growth" : "Wellness Management"}
                  </Text>
                  <Text color="#6B81A9" fontSize={{ base: "13px", md: "14px", xl: "13px", "2xl": "16px" }} fontWeight="500" mt={{ base: "9px", xl: "7px", "2xl": "10px" }}>
                    {activeTab === "skills" ? "Personalized insights based on market trends" : "Your mental health and wellness resources"}
                  </Text>
                </Box>
              </HStack>

              <IconButton
                aria-label="Close health and growth"
                variant="ghost"
                h="40px"
                w="40px"
                minW="40px"
                borderRadius="6px"
                color="#355785"
                _hover={{ bg: "#F3F7FD" }}
                onClick={onClose}
              >
                <X size={24} strokeWidth={1.9} />
              </IconButton>
            </Flex>

            <Box px={{ base: "22px", lg: "24px", "2xl": "30px" }} pt={{ base: "20px", xl: "16px", "2xl": "22px" }} pb={{ base: "22px", lg: "18px", "2xl": "24px" }}>
              <HStack
                as="nav"
                aria-label="Health and growth tabs"
                h="42px"
                gap={{ base: "24px", md: "34px", "2xl": "56px" }}
                borderBottom="1px solid"
                borderColor="#DDE5F1"
              >
                <TabButton icon={Users} label="Skill Analysis & Growth" active={activeTab === "skills"} onClick={() => setActiveTab("skills")} />
                <TabButton icon={Waves} label="Wellness Management" active={activeTab === "wellness"} onClick={() => setActiveTab("wellness")} />
              </HStack>

              {activeTab === "skills" ? (
                <SkillAnalysisView />
              ) : (
                <WellnessManagementView onOpenExpert={() => setIsExpertChatOpen(true)} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <ExpertChatModal
        isOpen={isExpertChatOpen}
        isAnonymous={isAnonymous}
        isConnecting={isConnecting}
        showWelcome={showWelcome}
        onClose={closeExpertChat}
        onUseAnonymous={() => {
          setIsAnonymous(true);
          setShowWelcome(false);
          setIsConnecting(true);
        }}
        onUseProfile={() => {
          setIsAnonymous(false);
          setShowWelcome(false);
          setIsConnecting(true);
        }}
        onCancelConnection={() => {
          setIsConnecting(false);
          setIsAnonymous(false);
          setShowWelcome(false);
        }}
      />
      <style>{`
        @keyframes associateWellnessTipsScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes associateWellnessPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.72; }
        }

        @keyframes associateWellnessPing {
          0% { transform: scale(0.88); opacity: 0.65; }
          80%, 100% { transform: scale(1.35); opacity: 0; }
        }

        @keyframes associateWellnessBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active?: boolean; onClick: () => void }) {
  return (
    <HStack
      as="button"
      h={{ base: "42px", xl: "38px", "2xl": "42px" }}
      gap={{ base: "12px", xl: "9px", "2xl": "12px" }}
      color={active ? "#165DFB" : "#49658D"}
      fontSize={{ base: "13px", md: "15px", xl: "13px", "2xl": "16px" }}
      fontWeight={active ? "800" : "700"}
      lineHeight="1"
      borderBottom="2px solid"
      borderColor={active ? "#165DFB" : "transparent"}
      px="4px"
      whiteSpace="nowrap"
      _hover={{ color: "#165DFB" }}
      onClick={onClick}
    >
      <Icon size={21} strokeWidth={active ? 2.2 : 2} />
      <Text as="span">{label}</Text>
    </HStack>
  );
}

function SkillAnalysisView() {
  return (
    <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1.32fr) minmax(340px, 0.92fr)", "2xl": "minmax(0, 1.38fr) minmax(410px, 0.95fr)" }} gap={{ base: "20px", xl: "18px", "2xl": "28px" }} mt={{ base: "18px", xl: "14px", "2xl": "18px" }}>
      <Panel px={{ base: "18px", md: "22px", "2xl": "26px" }} py={{ base: "18px", xl: "15px", "2xl": "20px" }}>
        <Flex align="flex-start" justify="space-between" gap="16px">
          <Box>
            <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
              Skill Overview
            </Text>
            <Text color="#6D83AA" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600" mt="8px">
              Your current skill profile and expertise level.
            </Text>
          </Box>
          <Button
            h={{ base: "38px", xl: "32px", "2xl": "38px" }}
            px={{ base: "16px", xl: "12px", "2xl": "16px" }}
            bg={colors.surface}
            border="1px solid"
            borderColor="#DCE6F4"
            borderRadius="8px"
            color="#092558"
            fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }}
            fontWeight="800"
            _hover={{ bg: "#F8FBFF" }}
          >
            All Skills
            <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: "18px", xl: "14px", "2xl": "24px" }} mt={{ base: "30px", xl: "22px", "2xl": "34px" }}>
          {skillMetrics.map((metric) => (
            <SkillMetricRing key={metric.label} metric={metric} />
          ))}
        </SimpleGrid>

        <Box h="1px" bg="#EEF1F5" my={{ base: "24px", xl: "18px", "2xl": "26px" }} />

        <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
          Skills Breakdown
        </Text>

        <VStack align="stretch" gap="0" mt={{ base: "18px", xl: "14px", "2xl": "18px" }}>
          {skillBreakdown.map((skill) => (
            <SkillBreakdownRow key={skill.title} skill={skill} />
          ))}
        </VStack>
      </Panel>

      <VStack align="stretch" gap={{ base: "18px", xl: "14px", "2xl": "18px" }} minW={0}>
        <CareerGrowthCard />
        <LearningTimelineCard />
      </VStack>
    </Grid>
  );
}

function SkillMetricRing({ metric }: { metric: SkillMetric }) {
  const style = toneStyles[metric.tone];

  return (
    <VStack gap={{ base: "12px", xl: "9px", "2xl": "14px" }} align="center">
      <Box
        w={{ base: "82px", xl: "66px", "2xl": "90px" }}
        h={{ base: "82px", xl: "66px", "2xl": "90px" }}
        borderRadius="full"
        bg={`conic-gradient(${style.color} ${metric.progress * 3.6}deg, #E9EEF7 0deg)`}
        p={{ base: "5px", xl: "4px", "2xl": "5px" }}
      >
        <Box w="full" h="full" borderRadius="full" bg={colors.surface} display="flex" alignItems="center" justifyContent="center">
          <Text color="#092558" fontSize={{ base: "20px", xl: "16px", "2xl": "22px" }} fontWeight="800" lineHeight="1">
            {metric.value}
          </Text>
        </Box>
      </Box>
      <Text color="#6D83AA" fontSize={{ base: "13px", xl: "11px", "2xl": "13px" }} fontWeight="700" textAlign="center">
        {metric.label}
      </Text>
    </VStack>
  );
}

function SkillBreakdownRow({ skill }: { skill: SkillBreakdownItem }) {
  const style = toneStyles[skill.tone];
  const progressColor = skill.title.includes("AI/ML") ? "#FF6874" : style.color;

  return (
    <Grid
      templateColumns={{ base: "42px minmax(0, 1fr) 90px 50px 22px", xl: "38px minmax(0, 1fr) 150px 48px 18px", "2xl": "54px minmax(0, 1fr) 230px 64px 24px" }}
      alignItems="center"
      gap={{ base: "12px", xl: "12px", "2xl": "18px" }}
      py={{ base: "13px", xl: "11px", "2xl": "15px" }}
      borderBottom="1px solid"
      borderColor="#EEF1F5"
      _last={{ borderBottom: "0" }}
    >
      <IconBadge icon={skill.icon} tone={skill.tone} size={{ base: "42px", xl: "36px", "2xl": "50px" }} iconSize={20} radius="10px" />
      <Box minW={0}>
        <Text color="#092558" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="800" lineHeight="1.15" truncate>
          {skill.title}
        </Text>
        <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt="7px" truncate>
          {skill.detail}
        </Text>
      </Box>
      <Box h={{ base: "5px", xl: "4px", "2xl": "5px" }} bg="#E8EEF7" borderRadius="999px" overflow="hidden">
        <Box h="full" w={`${skill.score}%`} bg={progressColor} borderRadius="999px" />
      </Box>
      <Box border="1px solid" borderColor="#E4EAF4" borderRadius="8px" py={{ base: "8px", xl: "6px", "2xl": "8px" }} textAlign="center">
        <Text color="#092558" fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="800">
          {skill.score}%
        </Text>
      </Box>
      <ChevronRight size={18} color="#71809B" />
    </Grid>
  );
}

function CareerGrowthCard() {
  return (
    <Panel px={{ base: "18px", md: "22px", "2xl": "26px" }} py={{ base: "18px", xl: "15px", "2xl": "20px" }}>
      <Box>
        <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
          Career Growth
        </Text>
        <Text color="#6D83AA" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600" mt="8px">
          Your consolidated skills vs market standard
        </Text>
      </Box>

      <HStack justify="flex-end" gap={{ base: "16px", xl: "12px", "2xl": "18px" }} color="#53698F" fontSize={{ base: "12px", xl: "10px", "2xl": "12px" }} fontWeight="700" mt={{ base: "24px", xl: "16px", "2xl": "28px" }}>
        <LegendDot color="#2F7CF6" label="Your Skills" />
        <LegendDot color="#C8D4E7" label="Market Standard" />
      </HStack>

      <GrowthLineChart />

      <Box h="1px" bg="#EEF1F5" mt={{ base: "20px", xl: "15px", "2xl": "22px" }} mb={{ base: "18px", xl: "14px", "2xl": "20px" }} />

      <Grid templateColumns="1fr 1px 1fr" alignItems="center">
        <Box textAlign="center">
          <Text color="#14B874" fontSize={{ base: "23px", xl: "19px", "2xl": "26px" }} fontWeight="800" lineHeight="1">
            65%
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="700" mt="8px">
            Your Skills
          </Text>
        </Box>
        <Box h="44px" bg="#E4EAF4" />
        <Box textAlign="center">
          <Text color="#FF6E2F" fontSize={{ base: "23px", xl: "19px", "2xl": "26px" }} fontWeight="800" lineHeight="1">
            35%
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="700" mt="8px">
            Gap to Close
          </Text>
        </Box>
      </Grid>
    </Panel>
  );
}

function GrowthLineChart() {
  const width = 410;
  const height = 190;
  const left = 34;
  const right = 18;
  const top = 14;
  const bottom = 34;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const toPoint = (value: number, index: number) => {
    const x = left + (index / (growthChartPoints.length - 1)) * chartWidth;
    const y = top + (1 - value / 100) * chartHeight;
    return { x, y };
  };
  const yourPoints = growthChartPoints.map((point, index) => toPoint(point.yourSkill, index));
  const marketPoints = growthChartPoints.map((point, index) => toPoint(point.market, index));
  const linePath = (points: Array<{ x: number; y: number }>) => points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `M ${yourPoints[0].x} ${height - bottom} ${linePath(yourPoints).replace("M", "L")} L ${yourPoints[yourPoints.length - 1].x} ${height - bottom} Z`;

  return (
    <Box mt={{ base: "10px", xl: "6px", "2xl": "12px" }} overflow="hidden">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" role="img" aria-label="Career growth comparison chart">
        <defs>
          <linearGradient id="skillGrowthArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2F7CF6" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#2F7CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[100, 75, 50, 25, 0].map((tick) => {
          const y = top + (1 - tick / 100) * chartHeight;
          return (
            <g key={tick}>
              <line x1={left} x2={width - right} y1={y} y2={y} stroke="#EEF1F5" strokeWidth="1" />
              <text x="3" y={y + 4} fill="#6D83AA" fontSize="12" fontWeight="700">
                {tick}%
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#skillGrowthArea)" />
        <path d={linePath(marketPoints)} fill="none" stroke="#CAD5E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={linePath(yourPoints)} fill="none" stroke="#2F7CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {marketPoints.map((point, index) => (
          <circle key={`market-${growthChartPoints[index].label}`} cx={point.x} cy={point.y} r="4" fill="#CAD5E7" />
        ))}
        {yourPoints.map((point, index) => (
          <circle key={`your-${growthChartPoints[index].label}`} cx={point.x} cy={point.y} r="4.5" fill="#2F7CF6" />
        ))}
        {growthChartPoints.map((point, index) => {
          const x = left + (index / (growthChartPoints.length - 1)) * chartWidth;
          return (
            <text key={point.label} x={x} y={height - 8} textAnchor="middle" fill="#6D83AA" fontSize="12" fontWeight="700">
              {point.label}
            </text>
          );
        })}
      </svg>
    </Box>
  );
}

function LearningTimelineCard() {
  return (
    <Panel px={{ base: "18px", md: "22px", "2xl": "26px" }} py={{ base: "18px", xl: "15px", "2xl": "20px" }}>
      <HStack gap="12px" mb={{ base: "20px", xl: "15px", "2xl": "22px" }}>
        <CalendarDays size={18} color="#49658D" />
        <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
          Learning Timeline
        </Text>
      </HStack>

      <Grid templateColumns="22px minmax(0, 1fr)" gap={{ base: "16px", xl: "13px", "2xl": "18px" }}>
        <Box position="relative" pt="19px" pb="19px">
          <Box position="absolute" left="9px" top="19px" bottom="19px" w="2px" bg="#DCE5F2" />
          <Box position="absolute" left="9px" top="50%" bottom="19px" w="2px" bg="#39BA85" />
          <VStack align="center" justify="space-between" h="full" minH={{ base: "254px", xl: "220px", "2xl": "278px" }}>
            {learningTimeline.map((item) => (
              <Box key={item.quarter} w="12px" h="12px" borderRadius="full" bg={colors.surface} border="3px solid" borderColor={toneStyles[item.tone].color} zIndex={1} />
            ))}
          </VStack>
        </Box>

        <VStack align="stretch" gap={{ base: "14px", xl: "11px", "2xl": "16px" }}>
          {learningTimeline.map((item) => (
            <TimelineQuarterCard key={item.quarter} item={item} />
          ))}
        </VStack>
      </Grid>
    </Panel>
  );
}

function TimelineQuarterCard({ item }: { item: LearningQuarter }) {
  const style = toneStyles[item.tone];

  return (
    <HStack
      justify="space-between"
      gap="14px"
      minH={{ base: "58px", xl: "50px", "2xl": "66px" }}
      bg={`linear-gradient(135deg, ${style.bg} 0%, #FFFFFF 170%)`}
      border="1px solid"
      borderColor="#DCE6F4"
      borderRadius="10px"
      px={{ base: "13px", xl: "11px", "2xl": "15px" }}
      py={{ base: "10px", xl: "8px", "2xl": "11px" }}
    >
      <HStack gap={{ base: "14px", xl: "11px", "2xl": "16px" }} minW={0}>
        <Box
          w={{ base: "48px", xl: "40px", "2xl": "54px" }}
          h={{ base: "48px", xl: "40px", "2xl": "54px" }}
          minW={{ base: "48px", xl: "40px", "2xl": "54px" }}
          borderRadius="10px"
          bg={style.color}
          color={colors.surface}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={{ base: "14px", xl: "12px", "2xl": "15px" }}
          fontWeight="800"
          boxShadow={`0 10px 22px ${style.color}33`}
        >
          {item.quarter}
        </Box>
        <Box minW={0}>
          <Text color="#092558" fontSize={{ base: "14px", xl: "12px", "2xl": "15px" }} fontWeight="800" lineHeight="1.1">
            {item.title}
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt="7px">
            {item.detail}
          </Text>
        </Box>
      </HStack>
      <ChevronRight size={18} color="#71809B" />
    </HStack>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <HStack gap="7px">
      <Box w="8px" h="8px" borderRadius="full" bg={color} />
      <Text>{label}</Text>
    </HStack>
  );
}

function WellnessManagementView({ onOpenExpert }: { onOpenExpert: () => void }) {
  return (
    <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1.5fr) minmax(360px, 0.98fr)", "2xl": "minmax(0, 1.5fr) minmax(390px, 0.98fr)" }} gap={{ base: "20px", xl: "18px", "2xl": "28px" }} mt={{ base: "18px", xl: "14px", "2xl": "18px" }}>
      <VStack align="stretch" gap={{ base: "18px", xl: "14px", "2xl": "18px" }} minW={0}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: "14px", xl: "12px", "2xl": "14px" }}>
          {actionTiles.map((item) => (
            <ActionCard key={item.title} item={item} />
          ))}
        </SimpleGrid>

        <ScheduleCard />
        <WellnessTipsCard />
      </VStack>

      <VStack align="stretch" gap={{ base: "18px", xl: "14px", "2xl": "18px" }} minW={0}>
        <StressReliefCard />
        <SupportCard />
        <ExpertBanner onOpen={onOpenExpert} />
      </VStack>
    </Grid>
  );
}

function ActionCard({ item }: { item: ActionTile }) {
  const Icon = item.icon;

  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor="#DCE6F4"
      borderRadius="8px"
      minH={{ base: "132px", xl: "116px", "2xl": "146px" }}
      px={{ base: "18px", xl: "16px", "2xl": "20px" }}
      py={{ base: "18px", xl: "15px", "2xl": "19px" }}
      boxShadow="0 8px 22px rgba(29, 66, 117, 0.035)"
      cursor="pointer"
      _hover={{ borderColor: "#BFD4F2", boxShadow: "0 12px 28px rgba(29, 66, 117, 0.06)" }}
    >
      <Flex direction="column" h="full" justify="space-between" gap={{ base: "20px", xl: "16px", "2xl": "22px" }}>
        <IconBadge icon={Icon} tone={item.tone} size={{ base: "45px", xl: "39px", "2xl": "49px" }} iconSize={21} />
        <HStack justify="space-between" gap="10px">
          <Box minW={0}>
            <Text color="#092558" fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800" lineHeight="1.1">
              {item.title}
            </Text>
            <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt={{ base: "10px", xl: "8px", "2xl": "11px" }}>
              {item.detail}
            </Text>
          </Box>
          <RoundArrowButton label={`Open ${item.title}`} />
        </HStack>
      </Flex>
    </Box>
  );
}

function ScheduleCard() {
  return (
    <Panel px={{ base: "18px", md: "22px", "2xl": "26px" }} py={{ base: "18px", xl: "15px", "2xl": "19px" }}>
      <Flex justify="space-between" align="flex-start" gap="14px" mb={{ base: "22px", xl: "18px", "2xl": "24px" }}>
        <HStack gap="14px">
          <IconBadge icon={CalendarDays} tone="primary" size="38px" iconSize={20} radius="10px" />
          <Box>
            <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
              Today's Schedule
            </Text>
            <Text color="#6D83AA" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600" mt={{ base: "9px", xl: "7px", "2xl": "9px" }}>
              Your wellness activities for today
            </Text>
          </Box>
        </HStack>
        <Box bg="#F0EDFF" color="#174DF1" borderRadius="999px" px={{ base: "18px", xl: "14px", "2xl": "18px" }} py={{ base: "9px", xl: "7px", "2xl": "9px" }} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800" lineHeight="1">
          12:15 PM
        </Box>
      </Flex>

      <Box maxH={{ base: "374px", xl: "278px", "2xl": "374px" }} overflowY="auto" pr="4px">
        <VStack align="stretch" gap={{ base: "13px", xl: "10px", "2xl": "13px" }} position="relative">
          <Box position="absolute" left={{ base: "63px", md: "108px" }} top="0" bottom="0" w="2px" bg="#DDE8F6" />
          {scheduleItems.map((item, index) => (
            <ScheduleRow key={item.title} item={item} index={index} />
          ))}
        </VStack>
      </Box>
    </Panel>
  );
}

function ScheduleRow({ item, index }: { item: ScheduleItem; index: number }) {
  const dotColors = ["#38CFA0", "#4298F4", "#8C65F5", "#8C65F5", "#4298F4"];
  const Icon = item.icon;

  return (
    <Grid templateColumns={{ base: "70px 20px minmax(0, 1fr)", md: "96px 24px minmax(0, 1fr)" }} alignItems="center" gap={{ base: "8px", md: "18px" }} position="relative">
      <Text color="#49658D" fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="600" textAlign="right">
        {item.time}
      </Text>
      <Box w="9px" h="9px" borderRadius="full" bg={dotColors[index]} border="2px solid" borderColor={colors.surface} boxShadow="0 0 0 2px #DDE8F6" zIndex={1} />
      <HStack bg={item.bg} borderRadius="12px" minH={{ base: "58px", xl: "48px", "2xl": "60px" }} px={{ base: "13px", md: "18px", xl: "14px", "2xl": "21px" }} py={{ base: "10px", xl: "8px", "2xl": "10px" }} justify="space-between" gap="12px">
        <HStack gap={{ base: "18px", xl: "13px", "2xl": "18px" }} minW={0}>
          <IconBadge icon={Icon} tone={item.tone} size={{ base: "40px", xl: "34px", "2xl": "42px" }} iconSize={18} />
          <Box minW={0}>
            <Text color="#092558" fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800" lineHeight="1.1">
              {item.title}
            </Text>
            <Text color="#5F79A3" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt={{ base: "7px", xl: "5px", "2xl": "7px" }}>
              {item.detail}
            </Text>
          </Box>
        </HStack>
        <ChevronRight size={18} color="#174A89" strokeWidth={2} />
      </HStack>
    </Grid>
  );
}

function WellnessTipsCard() {
  const movingTips = useMemo(() => [...wellnessTips, ...wellnessTips], []);

  return (
    <Panel px={{ base: "16px", md: "20px", "2xl": "24px" }} py={{ base: "17px", xl: "14px", "2xl": "17px" }}>
      <HStack gap="14px" mb={{ base: "19px", xl: "14px", "2xl": "19px" }}>
        <IconBadge icon={Sparkles} tone="primary" size="38px" iconSize={20} radius="10px" />
        <Box>
          <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
            Wellness Tips
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600" mt={{ base: "9px", xl: "7px", "2xl": "9px" }}>
            Small changes, big impact
          </Text>
        </Box>
      </HStack>

      <Box overflow="hidden" position="relative">
        <HStack
          gap="13px"
          align="stretch"
          w="max-content"
          animation="associateWellnessTipsScroll 34s linear infinite"
          _hover={{ animationPlayState: "paused" }}
        >
          {movingTips.map((tip, index) => (
            <Box key={`${tip.title}-${index}`} w={{ base: "210px", md: "184px", xl: "176px", "2xl": "206px" }} flexShrink={0}>
              <TipCard tip={tip} />
            </Box>
          ))}
        </HStack>
      </Box>
    </Panel>
  );
}

function TipCard({ tip }: { tip: ActionTile }) {
  const gradients: Record<Tone, string> = {
    primary: "linear-gradient(135deg, #F8FBFF 0%, #EAF4FF 100%)",
    success: "linear-gradient(135deg, #F8FFFC 0%, #E6FAF1 100%)",
    warning: "linear-gradient(135deg, #FFFBF4 0%, #FFF1D8 100%)",
    purple: "linear-gradient(135deg, #FCFAFF 0%, #F1ECFF 100%)",
    orange: "linear-gradient(135deg, #FFFBF7 0%, #FFF0E4 100%)",
  };
  const Icon = tip.icon;

  return (
    <Box bg={gradients[tip.tone]} border="1px solid" borderColor={toneStyles[tip.tone].border || "#DDE8F6"} borderRadius="8px" minH={{ base: "116px", xl: "98px", "2xl": "116px" }} px={{ base: "18px", xl: "14px", "2xl": "18px" }} py={{ base: "16px", xl: "13px", "2xl": "16px" }}>
      <IconBadge icon={Icon} tone={tip.tone} size={{ base: "38px", xl: "32px", "2xl": "38px" }} iconSize={17} />
      <Text color="#092558" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="800" lineHeight="1.15" mt={{ base: "16px", xl: "12px", "2xl": "16px" }}>
        {tip.title}
      </Text>
      <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt={{ base: "10px", xl: "7px", "2xl": "10px" }}>
        {tip.detail}
      </Text>
    </Box>
  );
}

function StressReliefCard() {
  return (
    <Panel px={{ base: "18px", md: "20px", "2xl": "22px" }} py={{ base: "18px", xl: "14px", "2xl": "18px" }}>
      <Flex justify="space-between" align="center" gap="14px" mb={{ base: "16px", xl: "12px", "2xl": "16px" }}>
        <HStack gap="14px">
          <IconBadge icon={Zap} tone="primary" size="36px" iconSize={21} radius="10px" />
          <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
            Quick Stress Relief
          </Text>
        </HStack>
        <HStack as="button" color="#0E5AFF" gap="7px" fontSize="12px" fontWeight="800" _hover={{ color: "#164FCB" }}>
          <Text as="span">View all</Text>
          <ChevronRight size={15} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: "16px", xl: "12px", "2xl": "16px" }}>
        {stressResources.map((resource) => (
          <ResourceCard key={resource.title} resource={resource} />
        ))}
      </SimpleGrid>
    </Panel>
  );
}

function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <Box border="1px solid" borderColor="#DCE6F4" borderRadius="8px" overflow="hidden" bg={colors.surface}>
      <Image src={resource.image} alt="" h={{ base: "98px", xl: "78px", "2xl": "98px" }} w="full" objectFit="cover" />
      <HStack justify="space-between" gap="10px" px={{ base: "16px", xl: "12px", "2xl": "16px" }} py={{ base: "13px", xl: "10px", "2xl": "13px" }}>
        <Box minW={0}>
          <Text color="#092558" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="800" lineHeight="1.15">
            {resource.title}
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt={{ base: "8px", xl: "6px", "2xl": "8px" }}>
            {resource.detail}
          </Text>
        </Box>
        <IconButton
          aria-label={`Play ${resource.title}`}
          h="32px"
          w="32px"
          minW="32px"
          borderRadius="full"
          bg="#EAF4FF"
          color="#225FAE"
          _hover={{ bg: "#DCEEFF" }}
        >
          <CirclePlay size={15} fill="#225FAE" color="#225FAE" strokeWidth={1.6} />
        </IconButton>
      </HStack>
    </Box>
  );
}

function SupportCard() {
  return (
    <Panel px={{ base: "18px", md: "20px", "2xl": "22px" }} py={{ base: "20px", xl: "15px", "2xl": "20px" }}>
      <HStack align="flex-start" gap="14px">
        <IconBadge icon={Heart} tone="primary" size="36px" iconSize={22} radius="10px" />
        <Box flex="1" minW={0}>
          <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1">
            Need Support?
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600" mt={{ base: "12px", xl: "9px", "2xl": "12px" }}>
            Reach out if experiencing:
          </Text>
          <VStack align="stretch" gap={{ base: "8px", xl: "6px", "2xl": "8px" }} mt={{ base: "14px", xl: "10px", "2xl": "14px" }} color="#6D83AA" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600">
            {["Persistent sadness", "Sleep/appetite changes", "Anxiety or panic attacks"].map((item) => (
              <HStack key={item} gap="10px">
                <Box w="5px" h="5px" borderRadius="full" bg="#1F71FF" />
                <Text>{item}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </HStack>

      <HStack
        as="button"
        mt={{ base: "20px", xl: "14px", "2xl": "20px" }}
        w="full"
        justify="space-between"
        bg="#EAF5FF"
        borderRadius="10px"
        px="15px"
        py={{ base: "12px", xl: "9px", "2xl": "12px" }}
        _hover={{ bg: "#E1F0FF" }}
      >
        <HStack gap="14px">
          <IconBadge icon={Building2} tone="primary" size="38px" iconSize={20} radius="9px" />
          <Box textAlign="left">
            <Text color="#092558" fontSize="12px" fontWeight="800">
              Company Resources
            </Text>
            <Text color="#6D83AA" fontSize="12px" fontWeight="600" mt="5px">
              Contact HR for EAP & counselling
            </Text>
          </Box>
        </HStack>
        <ChevronRight size={18} color="#0E5AFF" />
      </HStack>
    </Panel>
  );
}

function ExpertBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <HStack
      as="button"
      minH={{ base: "137px", xl: "104px", "2xl": "137px" }}
      w="full"
      bg="linear-gradient(135deg, #EEF7FF 0%, #DCEEFF 100%)"
      border="1px solid"
      borderColor="#D7E8FA"
      borderRadius="8px"
      px={{ base: "18px", md: "24px", "2xl": "34px" }}
      py={{ base: "20px", xl: "16px", "2xl": "20px" }}
      justify="space-between"
      gap="18px"
      overflow="hidden"
      position="relative"
      cursor="pointer"
      textAlign="left"
      transition="all 0.2s ease"
      _hover={{ borderColor: "#B9D9F7", boxShadow: "0 12px 32px rgba(29, 127, 227, 0.1)", transform: "translateY(-1px)" }}
      onClick={onOpen}
    >
      <Box position="absolute" right="-44px" bottom="-64px" w="230px" h="170px" borderRadius="full" bg="rgba(255,255,255,0.32)" transform="rotate(-18deg)" />
      <HStack gap={{ base: "24px", xl: "16px", "2xl": "24px" }} position="relative" zIndex={1}>
        <IconBadge icon={BookOpen} tone="primary" size={{ base: "56px", xl: "44px", "2xl": "58px" }} iconSize={22} radius="full" />
        <Box>
          <Text color="#174A89" fontSize={{ base: "15px", xl: "13px", "2xl": "15px" }} fontWeight="800">
            Talk to Expert
          </Text>
          <Text color="#6D83AA" fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600" mt={{ base: "7px", xl: "5px", "2xl": "7px" }}>
            Get confidential support from our wellness team
          </Text>
        </Box>
      </HStack>
      <ChevronRight size={19} color="#0E5AFF" />
    </HStack>
  );
}

function ExpertChatModal({
  isOpen,
  isAnonymous,
  isConnecting,
  showWelcome,
  onClose,
  onUseAnonymous,
  onUseProfile,
  onCancelConnection,
}: {
  isOpen: boolean;
  isAnonymous: boolean;
  isConnecting: boolean;
  showWelcome: boolean;
  onClose: () => void;
  onUseAnonymous: () => void;
  onUseProfile: () => void;
  onCancelConnection: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={1400}
      bg="rgba(10, 19, 34, 0.58)"
      backdropFilter="blur(8px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: "18px", md: "28px" }}
      onClick={onClose}
    >
      <Box
        bg={colors.surface}
        borderRadius="14px"
        maxW={showWelcome ? "700px" : "520px"}
        w="full"
        maxH="86vh"
        overflow="hidden"
        border="1px solid"
        borderColor="#DCE6F4"
        boxShadow="0 28px 80px rgba(7, 15, 31, 0.32)"
        onClick={(event) => event.stopPropagation()}
      >
        <HStack justify="space-between" px="20px" py="16px" bg="linear-gradient(135deg, #667EEA 0%, #7657B4 100%)">
          <HStack gap="13px">
            <Box
              w="42px"
              h="42px"
              borderRadius="11px"
              bg="rgba(255,255,255,0.22)"
              color={colors.surface}
              display="flex"
              alignItems="center"
              justifyContent="center"
              animation="associateWellnessBounce 1.8s ease-in-out infinite"
            >
              <MessageCircle size={23} />
            </Box>
            <Box>
              <Text color={colors.surface} fontSize="18px" fontWeight="800" lineHeight="1">
                Talk to Expert
              </Text>
              <Text color="rgba(255,255,255,0.82)" fontSize="13px" fontWeight="600" mt="7px">
                Confidential wellness support
              </Text>
            </Box>
          </HStack>
          <IconButton aria-label="Close expert chat" variant="ghost" color={colors.surface} _hover={{ bg: "rgba(255,255,255,0.18)" }} onClick={onClose}>
            <X size={20} />
          </IconButton>
        </HStack>

        <Box p={{ base: "22px", md: "28px" }} overflowY="auto" maxH="calc(86vh - 74px)">
          {!isConnecting && !showWelcome ? (
            <VStack align="stretch" gap="22px">
              <Box textAlign="center">
                <Text color={colors.primaryText} fontSize="20px" fontWeight="800">
                  How would you like to connect?
                </Text>
                <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="9px">
                  Choose your preferred mode of communication
                </Text>
              </Box>

              <VStack align="stretch" gap="13px">
                <ExpertChoiceCard
                  icon={ShieldCheck}
                  title="Go Anonymous"
                  description="Your identity will remain completely private"
                  tone="purple"
                  onClick={onUseAnonymous}
                />
                <ExpertChoiceCard
                  icon={User}
                  title="Use My Profile"
                  description="Expert can see your profile for personalized help"
                  tone="primary"
                  onClick={onUseProfile}
                />
              </VStack>

              <HStack justify="center" gap="9px" bg="#F8FAFD" border="1px solid" borderColor={colors.lightBorder} borderRadius="10px" px="16px" py="13px">
                <LockKeyhole size={15} color={colors.mutedText} />
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                  All conversations are confidential and secure
                </Text>
              </HStack>
            </VStack>
          ) : showWelcome ? (
            <VStack align="stretch" gap="22px">
              <Box textAlign="center">
                <Box
                  mx="auto"
                  w="62px"
                  h="62px"
                  borderRadius="full"
                  bg="#F0EAFF"
                  color="#7658D5"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb="14px"
                >
                  <MessageCircle size={28} />
                </Box>
                <Text color={colors.primaryText} fontSize="25px" fontWeight="800" lineHeight="1.1">
                  Welcome to Safe Space
                </Text>
                <Text color={colors.secondaryText} fontSize="14px" fontWeight="600" mt="9px">
                  {isAnonymous ? "You are chatting anonymously" : "Connected with your profile"}
                </Text>
              </Box>

              <Box bg="#F6F1FF" border="1px solid" borderColor="#E1D4FF" borderRadius="12px" p="18px">
                <Text color={colors.primaryText} fontSize="14px" fontWeight="800" mb="14px">
                  Our wellness expert is here to help you with:
                </Text>
                <VStack align="stretch" gap="10px">
                  {["Stress and anxiety management", "Work-life balance guidance", "Mental health support", "Confidential counseling"].map((item) => (
                    <HStack key={item} gap="10px">
                      <Box color="#7658D5" fontSize="13px" fontWeight="800">
                        ✓
                      </Box>
                      <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
                        {item}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              <Box bg="#EAF5FF" border="1px solid" borderColor="#D7E8FA" borderRadius="10px" px="16px" py="14px" textAlign="center">
                <Text color="#174A89" fontSize="13px" fontWeight="800">
                  This is a safe, judgment-free space.
                </Text>
              </Box>

              <Button h="46px" bg="linear-gradient(135deg, #667EEA 0%, #7657B4 100%)" color={colors.surface} borderRadius="8px" fontSize="14px" fontWeight="800" _hover={{ bg: "linear-gradient(135deg, #596EDB 0%, #684BA5 100%)" }}>
                Start Conversation
              </Button>
            </VStack>
          ) : (
            <VStack gap="24px" py="18px">
              <Box position="relative" animation="associateWellnessPulse 1.5s ease-in-out infinite">
                <Box w="88px" h="88px" borderRadius="full" bg="linear-gradient(135deg, #667EEA 0%, #7657B4 100%)" color={colors.surface} display="flex" alignItems="center" justifyContent="center">
                  <MessageCircle size={42} />
                </Box>
                <Box position="absolute" inset="0" borderRadius="full" border="4px solid #BBA7F0" animation="associateWellnessPing 1.5s ease-out infinite" />
              </Box>

              <Box textAlign="center">
                <Text color={colors.primaryText} fontSize="23px" fontWeight="800">
                  Connecting to Expert...
                </Text>
                <Text color={colors.secondaryText} fontSize="14px" fontWeight="700" mt="10px">
                  {isAnonymous ? "Anonymous Mode Active" : "Using Your Profile"}
                </Text>
                <Text color={colors.mutedText} fontSize="13px" fontWeight="600" mt="9px">
                  Please wait while we connect you with a wellness expert
                </Text>
              </Box>

              <HStack gap="8px">
                {[0, 0.2, 0.4].map((delay) => (
                  <Box key={delay} w="8px" h="8px" bg="#7658D5" borderRadius="full" animation={`associateWellnessBounce 1s ease-in-out ${delay}s infinite`} />
                ))}
              </HStack>

              <Button h="36px" px="20px" bg={colors.surface} color={colors.secondaryText} border="1px solid" borderColor={colors.border} borderRadius="8px" fontSize="13px" fontWeight="800" _hover={{ bg: "#F8FAFD" }} onClick={onCancelConnection}>
                Cancel
              </Button>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function ExpertChoiceCard({
  icon: Icon,
  title,
  description,
  tone,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: Tone;
  onClick: () => void;
}) {
  const style = toneStyles[tone];

  return (
    <HStack
      as="button"
      w="full"
      justify="space-between"
      gap="14px"
      p="16px"
      bg={style.bg}
      border="1px solid"
      borderColor={tone === "purple" ? "#DDD0FF" : "#CFE2FB"}
      borderRadius="12px"
      textAlign="left"
      transition="all 0.2s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 28px rgba(11, 12, 28, 0.08)" }}
      onClick={onClick}
    >
      <HStack gap="14px" minW={0}>
        <Box w="48px" h="48px" minW="48px" borderRadius="12px" bg={style.color} color={colors.surface} display="flex" alignItems="center" justifyContent="center">
          <Icon size={23} />
        </Box>
        <Box minW={0}>
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800">
            {title}
          </Text>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="7px">
            {description}
          </Text>
        </Box>
      </HStack>
      <ChevronRight size={20} color={colors.secondaryText} />
    </HStack>
  );
}

function Panel({
  children,
  px,
  py,
}: {
  children: ReactNode;
  px: string | Record<string, string>;
  py: string | Record<string, string>;
}) {
  return (
    <Box bg={colors.surface} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" boxShadow="0 8px 22px rgba(29, 66, 117, 0.035)" px={px} py={py}>
      {children}
    </Box>
  );
}

function IconBadge({
  icon: Icon,
  tone,
  size,
  iconSize,
  radius = "full",
}: {
  icon: LucideIcon;
  tone: Tone;
  size: string | Record<string, string>;
  iconSize: number;
  radius?: string;
}) {
  const style = toneStyles[tone];

  return (
    <Box
      w={size}
      h={size}
      minW={size}
      borderRadius={radius}
      bg={style.bg}
      color={style.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon size={iconSize} strokeWidth={2.1} />
    </Box>
  );
}

function RoundArrowButton({
  label,
  direction = "right",
  display,
}: {
  label: string;
  direction?: "left" | "right";
  display?: Record<string, string>;
}) {
  return (
    <IconButton
      aria-label={label}
      display={display}
      h="30px"
      w="30px"
      minW="30px"
      borderRadius="full"
      bg="#EAF4FF"
      color="#225FAE"
      _hover={{ bg: "#DCEEFF" }}
    >
      <ChevronRight size={16} strokeWidth={2.1} style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }} />
    </IconButton>
  );
}
