"use client";

import React from "react";
import { Badge, Box, Button, Flex, Grid, HStack, IconButton, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Battery, BriefcaseBusiness, CalendarDays, CheckCircle2, Minus, TrendingDown, TrendingUp, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/types/styles";

interface TrendData {
  date: string;
  energy: string;
  workload: string;
}

interface TrendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TrendSummary = {
  status: string;
  color: string;
  softBg: string;
  icon: LucideIcon;
};

export const TrendModal: React.FC<TrendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const history = readCheckInHistory();
  const last7Days = history.slice(-7);
  const energyTrend = last7Days.length > 0 ? calculateEnergyTrend(last7Days) : null;
  const workloadTrend = last7Days.length > 0 ? calculateWorkloadTrend(last7Days) : null;
  const manageableDays = last7Days.filter((day) => day.workload === "yes").length;
  const averageEnergy = getAverageEnergy(last7Days);

  return (
    <Box
      position="fixed"
      inset="0"
      bg="rgba(18, 31, 50, 0.62)"
      backdropFilter="blur(8px)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "14px", md: "28px" }}
      py={{ base: "18px", md: "30px" }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <Box
        bg={colors.surface}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="14px"
        boxShadow="0 28px 80px rgba(7, 15, 31, 0.28)"
        w="full"
        maxW="920px"
        maxH="90vh"
        overflow="hidden"
      >
        <Flex align="center" justify="space-between" gap="18px" px={{ base: "18px", md: "24px" }} py={{ base: "17px", md: "20px" }} borderBottom="1px solid" borderColor={colors.lightBorder}>
          <HStack gap="14px" minW={0}>
            <Flex w="46px" h="46px" borderRadius="12px" bg={colors.primarySoft} color={colors.primary} align="center" justify="center" flexShrink={0}>
              <TrendingUp size={22} />
            </Flex>
            <Box minW={0}>
              <Text color={colors.primaryText} fontSize={{ base: "18px", md: "21px" }} fontWeight="800" lineHeight="1.15">
                Your 7-Day Wellness Trend
              </Text>
              <Text color={colors.secondaryText} fontSize={{ base: "12px", md: "13px" }} fontWeight="600" mt="6px">
                Track your energy and workload patterns
              </Text>
            </Box>
          </HStack>

          <IconButton aria-label="Close trend modal" variant="ghost" color={colors.secondaryText} borderRadius="8px" _hover={{ bg: "#F8FAFD" }} onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Flex>

        <Box px={{ base: "18px", md: "24px" }} py={{ base: "18px", md: "22px" }} overflowY="auto" maxH="calc(90vh - 86px)">
          {last7Days.length === 0 ? (
            <EmptyTrendState />
          ) : (
            <VStack align="stretch" gap="16px">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="14px">
                {energyTrend ? (
                  <SummaryCard
                    icon={Battery}
                    title="Energy Level"
                    status={energyTrend.status}
                    metric={averageEnergy}
                    caption="Average mood score"
                    color={energyTrend.color}
                    softBg={energyTrend.softBg}
                    TrendIcon={energyTrend.icon}
                  />
                ) : null}
                {workloadTrend ? (
                  <SummaryCard
                    icon={BriefcaseBusiness}
                    title="Workload"
                    status={workloadTrend.status}
                    metric={`${manageableDays}/${last7Days.length}`}
                    caption="Manageable days"
                    color={workloadTrend.color}
                    softBg={workloadTrend.softBg}
                    TrendIcon={workloadTrend.icon}
                  />
                ) : null}
              </SimpleGrid>

              <Grid templateColumns={{ base: "1fr", lg: "minmax(0, 1.35fr) minmax(260px, 0.65fr)" }} gap="16px" alignItems="stretch">
                <TrendChart days={last7Days} />
                <DailyBreakdown days={last7Days} />
              </Grid>

              <Flex
                align="center"
                justify="space-between"
                gap="14px"
                flexWrap={{ base: "wrap", md: "nowrap" }}
                bg="#F8FBFF"
                border="1px solid"
                borderColor={colors.border}
                borderRadius="12px"
                px="16px"
                py="14px"
              >
                <HStack gap="12px">
                  <Flex w="36px" h="36px" borderRadius="full" bg={colors.primarySoft} color={colors.primary} align="center" justify="center">
                    <CheckCircle2 size={18} />
                  </Flex>
                  <Box>
                    <Text color={colors.primaryText} fontSize="13px" fontWeight="800">
                      Keep tracking your wellbeing
                    </Text>
                    <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="4px">
                      More check-ins make these insights more useful.
                    </Text>
                  </Box>
                </HStack>
                <Button h="40px" px="18px" bg={colors.primary} color={colors.surface} borderRadius="7px" fontSize="13px" fontWeight="800" _hover={{ bg: "#1668BA" }} onClick={onClose}>
                  Close
                </Button>
              </Flex>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

function readCheckInHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const historyStr = window.localStorage.getItem("checkInHistory");
    const parsedHistory = historyStr ? JSON.parse(historyStr) : [];
    return Array.isArray(parsedHistory) ? (parsedHistory as TrendData[]) : [];
  } catch {
    return [];
  }
}

function calculateEnergyTrend(data: TrendData[]): TrendSummary {
  const values = data.map((day) => getEnergyValue(day.energy));
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (avg >= 2.5) {
    return { status: "Improving", color: colors.success, softBg: "#E8F8F0", icon: TrendingUp };
  }
  if (avg >= 1.8) {
    return { status: "Stable", color: colors.warning, softBg: "#FFF3DE", icon: Minus };
  }
  return { status: "Needs Attention", color: colors.danger, softBg: "#FDEDEA", icon: TrendingDown };
}

function calculateWorkloadTrend(data: TrendData[]): TrendSummary {
  const manageableCount = data.filter((day) => day.workload === "yes").length;
  const percentage = (manageableCount / data.length) * 100;

  if (percentage >= 70) {
    return { status: "Manageable", color: colors.success, softBg: "#E8F8F0", icon: TrendingUp };
  }
  if (percentage >= 40) {
    return { status: "Moderate", color: colors.warning, softBg: "#FFF3DE", icon: Minus };
  }
  return { status: "Overwhelming", color: colors.danger, softBg: "#FDEDEA", icon: TrendingDown };
}

function getEnergyValue(energy: string) {
  if (energy === "high") {
    return 3;
  }
  if (energy === "medium") {
    return 2;
  }
  return 1;
}

function getWorkloadValue(workload: string) {
  return workload === "yes" ? 3 : 1;
}

function getAverageEnergy(days: TrendData[]) {
  if (days.length === 0) {
    return "0.0";
  }

  const average = days.reduce((sum, day) => sum + getEnergyValue(day.energy), 0) / days.length;
  return average.toFixed(1);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SummaryCard({
  icon: Icon,
  title,
  status,
  metric,
  caption,
  color,
  softBg,
  TrendIcon,
}: {
  icon: LucideIcon;
  title: string;
  status: string;
  metric: string;
  caption: string;
  color: string;
  softBg: string;
  TrendIcon: LucideIcon;
}) {
  return (
    <Box bg={colors.surface} border="1px solid" borderColor={colors.border} borderRadius="12px" p="16px" boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)">
      <Flex justify="space-between" align="flex-start" gap="14px">
        <HStack gap="12px">
          <Flex w="40px" h="40px" borderRadius="10px" bg={softBg} color={color} align="center" justify="center">
            <Icon size={20} />
          </Flex>
          <Box>
            <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
              {title}
            </Text>
            <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="5px">
              {caption}
            </Text>
          </Box>
        </HStack>
        <Flex w="32px" h="32px" borderRadius="full" bg={softBg} color={color} align="center" justify="center">
          <TrendIcon size={17} />
        </Flex>
      </Flex>

      <HStack mt="18px" align="end" justify="space-between">
        <Text color={colors.primaryText} fontSize="28px" fontWeight="800" lineHeight="1">
          {metric}
        </Text>
        <Badge bg={softBg} color={color} borderRadius="999px" px="10px" py="5px" fontSize="11px" fontWeight="800" textTransform="none">
          {status}
        </Badge>
      </HStack>
    </Box>
  );
}

function TrendChart({ days }: { days: TrendData[] }) {
  const chartWidth = 520;
  const chartHeight = 190;
  const leftPadding = 42;
  const rightPadding = 24;
  const topPadding = 20;
  const bottomPadding = 38;
  const usableWidth = chartWidth - leftPadding - rightPadding;
  const usableHeight = chartHeight - topPadding - bottomPadding;
  const xStep = days.length > 1 ? usableWidth / (days.length - 1) : 0;
  const getPoint = (value: number, index: number) => {
    const x = leftPadding + index * xStep;
    const y = topPadding + ((3 - value) / 2) * usableHeight;
    return `${x},${y}`;
  };
  const energyPoints = days.map((day, index) => getPoint(getEnergyValue(day.energy), index));
  const workloadPoints = days.map((day, index) => getPoint(getWorkloadValue(day.workload), index));

  return (
    <Box bg={colors.surface} border="1px solid" borderColor={colors.border} borderRadius="12px" p="16px" boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)">
      <HStack justify="space-between" align="flex-start" gap="14px" mb="14px">
        <Box>
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800">
            Energy & Workload Trend
          </Text>
          <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="5px">
            Last {days.length} check-ins
          </Text>
        </Box>
        <HStack gap="14px" color={colors.secondaryText} flexWrap="wrap" justify="flex-end">
          <LegendDot color={colors.primaryLight} label="Energy" />
          <LegendDot color={colors.success} label="Workload" />
        </HStack>
      </HStack>

      <Box overflowX="auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="214" role="img" aria-label="Energy trend over recent check-ins">
          {[0, 1, 2].map((line) => {
            const y = topPadding + line * (usableHeight / 2);
            return <line key={line} x1={leftPadding} y1={y} x2={chartWidth - rightPadding} y2={y} stroke={colors.lightBorder} strokeWidth="1" />;
          })}
          <text x="8" y={topPadding + 4} fill={colors.mutedText} fontSize="11px" fontWeight="700">
            High
          </text>
          <text x="8" y={topPadding + usableHeight / 2 + 4} fill={colors.mutedText} fontSize="11px" fontWeight="700">
            Med
          </text>
          <text x="8" y={topPadding + usableHeight + 4} fill={colors.mutedText} fontSize="11px" fontWeight="700">
            Low
          </text>
          <polyline points={workloadPoints.join(" ")} fill="none" stroke={colors.success} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          <polyline points={energyPoints.join(" ")} fill="none" stroke={colors.primaryLight} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
          {days.map((day, index) => {
            const [energyX, energyY] = energyPoints[index].split(",").map(Number);
            const [workloadX, workloadY] = workloadPoints[index].split(",").map(Number);
            return (
              <g key={`${day.date}-${index}`}>
                <circle cx={workloadX} cy={workloadY} r="4.5" fill={colors.surface} stroke={colors.success} strokeWidth="2.4" opacity="0.78" />
                <circle cx={energyX} cy={energyY} r="5" fill={colors.surface} stroke={colors.primaryLight} strokeWidth="2.6" />
                <text x={energyX} y={chartHeight - 8} textAnchor="middle" fill={colors.secondaryText} fontSize="11px" fontWeight="700">
                  {formatDate(day.date).split(" ")[1] || formatDate(day.date)}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Box>
  );
}

function DailyBreakdown({ days }: { days: TrendData[] }) {
  return (
    <Box bg={colors.surface} border="1px solid" borderColor={colors.border} borderRadius="12px" p="16px" boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)">
      <HStack gap="10px" mb="14px">
        <Flex w="34px" h="34px" borderRadius="9px" bg={colors.primarySoft} color={colors.primary} align="center" justify="center">
          <CalendarDays size={17} />
        </Flex>
        <Box>
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800">
            Daily Breakdown
          </Text>
          <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="4px">
            Recent submissions
          </Text>
        </Box>
      </HStack>

      <VStack align="stretch" gap="9px" maxH="234px" overflowY="auto" pr="3px">
        {days.map((day, index) => (
          <HStack key={`${day.date}-${index}`} justify="space-between" gap="12px" border="1px solid" borderColor={colors.lightBorder} borderRadius="9px" px="12px" py="10px">
            <Box>
              <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
                {formatDate(day.date)}
              </Text>
              <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" mt="4px">
                Workload {day.workload === "yes" ? "manageable" : "high"}
              </Text>
            </Box>
            <Badge bg={getEnergyTone(day.energy).bg} color={getEnergyTone(day.energy).color} borderRadius="999px" px="9px" py="5px" fontSize="10px" fontWeight="800" textTransform="capitalize">
              {day.energy}
            </Badge>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <HStack gap="6px">
      <Box w="8px" h="8px" borderRadius="full" bg={color} />
      <Text fontSize="11px" fontWeight="700">
        {label}
      </Text>
    </HStack>
  );
}

function EmptyTrendState() {
  return (
    <Box textAlign="center" py="54px" px="20px">
      <Flex mx="auto" w="54px" h="54px" borderRadius="14px" bg={colors.primarySoft} color={colors.primary} align="center" justify="center">
        <TrendingUp size={24} />
      </Flex>
      <Text color={colors.primaryText} fontSize="17px" fontWeight="800" mt="18px">
        No trend data yet
      </Text>
      <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="8px">
        Complete your daily check-ins to see wellness patterns here.
      </Text>
    </Box>
  );
}

function getEnergyTone(energy: string) {
  if (energy === "high") {
    return { bg: "#E8F8F0", color: colors.success };
  }
  if (energy === "medium") {
    return { bg: "#FFF3DE", color: "#B66A12" };
  }
  return { bg: "#FDEDEA", color: colors.danger };
}
