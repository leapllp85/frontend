"use client";

import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowUp,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Folder,
  Hand,
  Lightbulb,
  Minus,
  MoreVertical,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { ManagerOnly } from "@/components/RoleGuard";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
);

const colors = {
  background: "#FAFBFD",
  surface: "#FFFFFF",
  primary: "#1D7FE3",
  primaryLight: "#6EA0E6",
  primarySoft: "#E7F0FC",
  primaryText: "#0B0C1C",
  secondaryText: "#3D4B68",
  mutedText: "#71809B",
  border: "#E6EAF0",
  lightBorder: "#EEF1F5",
  success: "#39BA85",
  danger: "#E2493A",
  warning: "#FDB83F",
};

const navItems = ["Overview", "Team", "Projects", "Analytics", "Survey"];
const threeColumnTemplate = {
  base: "1fr",
  xl: "minmax(0, 1fr) minmax(0, 1.08fr) minmax(0, 1fr)",
};
const sectionGap = { base: "18px", lg: "18px" };
const rowGap = { base: "18px", md: "20px", xl: "18px" };
const cardRadius = "12px";
const cardBorder = "1px solid";
const cardShadow = "0 10px 30px rgba(11, 12, 28, 0.035)";

// TEMP: keep the prototype visible while auth is bypassed for /manager-overview.
// Set this to false or remove it when the dashboard should require manager auth again.
const temporaryAuthBypass = true;

const summaryMetrics = [
  {
    label: "Team Members",
    value: "15",
    valueColor: colors.primaryText,
    icon: Users,
    iconColor: colors.primary,
    iconBg: "#EEF3FF",
    trend: "12%",
    trendPrefix: "up",
  },
  {
    label: "Total Projects",
    value: "20",
    valueColor: colors.primaryText,
    icon: Folder,
    iconColor: colors.primary,
    iconBg: colors.primarySoft,
    trend: "8%",
    trendPrefix: "up",
  },
  {
    label: "Attrition Risk",
    value: "47%",
    valueColor: colors.danger,
    icon: TrendingUp,
    iconColor: colors.danger,
    iconBg: "#FDEDEA",
    trend: "12%",
    trendPrefix: "up",
  },
  {
    label: "Projects At Risk",
    value: "0",
    valueColor: colors.primaryText,
    icon: ShieldCheck,
    iconColor: colors.primary,
    iconBg: colors.primarySoft,
    trend: "0%",
    trendPrefix: "flat",
  },
] as const;

const attritionOverview = [
  { label: "At Risk", value: 47, color: colors.primary },
  { label: "Neutral", value: 33, color: colors.primaryLight },
  { label: "Low Risk", value: 20, color: colors.success },
] as const;

const attritionTrend = {
  labels: ["Feb '25", "Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25"],
  values: [170, 105, 310, 245, 180, 475],
};

const attritionDrivers = [
  { label: "Mental Health", value: 35, color: colors.primary },
  { label: "Motivation", value: 28, color: colors.primaryLight },
  { label: "Career Opportunities", value: 22, color: colors.success },
  { label: "Work-Life Balance", value: 15, color: colors.warning },
] as const;

const criticalMembers = [
  {
    name: "Alice Brown",
    initials: "AB",
    risk: "High Risk",
    score: "9.2",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #FF9A7A 0%, #8B2F24 100%)",
    sparkline: [18, 15, 10, 14, 12, 16],
  },
  {
    name: "David Martinez",
    initials: "DM",
    risk: "High Risk",
    score: "8.7",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #B7D0E9 0%, #2C415C 100%)",
    sparkline: [12, 16, 18, 13, 17, 16],
  },
  {
    name: "Maya Patel",
    initials: "MP",
    risk: "High Risk",
    score: "8.5",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #F7B56A 0%, #A74B26 100%)",
    sparkline: [18, 17, 12, 14, 11, 15],
  },
  {
    name: "Jane Smith",
    initials: "JS",
    risk: "Medium Risk",
    score: "6.3",
    color: colors.warning,
    avatar: "linear-gradient(135deg, #F8D5C9 0%, #C87E67 100%)",
    sparkline: [12, 15, 11, 16, 12, 14],
  },
  {
    name: "Marcus Thompson",
    initials: "MT",
    risk: "High Risk",
    score: "8.1",
    color: colors.danger,
    avatar: "linear-gradient(135deg, #5D7FA0 0%, #101B2C 100%)",
    sparkline: [10, 14, 17, 12, 15, 13],
  },
] as const;

const projectStatuses = [
  { label: "On Track", value: 10, percentage: 50, color: "#7DCEAE" },
  { label: "At Risk", value: 6, percentage: 30, color: "#F3CC74" },
  { label: "Delayed", value: 3, percentage: 15, color: "#EA8E86" },
  { label: "Completed", value: 1, percentage: 5, color: colors.primaryLight },
] as const;

const upcomingDeadlines = [
  {
    month: "AUG",
    day: "10",
    title: "E-Commerce Platform Redesign",
    risk: "High Risk",
    riskColor: colors.danger,
    daysLeft: "8 Days Left",
    badgeColor: colors.danger,
    dateBg: colors.primarySoft,
    dateColor: colors.primary,
  },
  {
    month: "AUG",
    day: "15",
    title: "Supply Chain Optimization",
    risk: "High Risk",
    riskColor: colors.danger,
    daysLeft: "13 Days Left",
    badgeColor: colors.primary,
    dateBg: colors.primarySoft,
    dateColor: colors.primary,
  },
  {
    month: "SEP",
    day: "10",
    title: "Inventory Management System",
    risk: "Medium Risk",
    riskColor: colors.warning,
    daysLeft: "39 Days Left",
    badgeColor: colors.success,
    dateBg: "#E8F8F0",
    dateColor: colors.success,
  },
  {
    month: "OCT",
    day: "25",
    title: "Mobile App Development",
    risk: "High Risk",
    riskColor: colors.danger,
    daysLeft: "84 Days Left",
    badgeColor: colors.warning,
    dateBg: "#FDEDEA",
    dateColor: colors.warning,
  },
] as const;

const donutChartData: ChartData<"doughnut", number[], string> = {
  labels: attritionOverview.map((item) => item.label),
  datasets: [
    {
      data: attritionOverview.map((item) => item.value),
      backgroundColor: attritionOverview.map((item) => item.color),
      borderColor: colors.surface,
      borderWidth: 0,
      hoverBorderWidth: 0,
      spacing: 0,
    },
  ],
};

const donutChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "61%",
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
};

const lineChartData: ChartData<"line", number[], string> = {
  labels: attritionTrend.labels,
  datasets: [
    {
      data: attritionTrend.values,
      borderColor: colors.primary,
      backgroundColor: "rgba(29, 127, 227, 0.12)",
      borderWidth: 3,
      pointBackgroundColor: colors.primary,
      pointBorderColor: colors.primary,
      pointHoverBackgroundColor: colors.primary,
      pointHoverBorderColor: colors.surface,
      pointRadius: 4,
      pointHoverRadius: 5,
      tension: 0.42,
      fill: true,
    },
  ],
};

const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
    },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: colors.secondaryText,
        font: { size: 12, weight: 600 },
      },
    },
    y: {
      min: 0,
      max: 500,
      ticks: {
        stepSize: 100,
        color: colors.secondaryText,
        font: { size: 12, weight: 600 },
      },
      border: { display: false },
      grid: {
        color: colors.lightBorder,
      },
    },
  },
};

const projectDoughnutData: ChartData<"doughnut", number[], string> = {
  labels: projectStatuses.map((status) => status.label),
  datasets: [
    {
      data: projectStatuses.map((status) => status.value),
      backgroundColor: projectStatuses.map((status) => status.color),
      borderColor: colors.surface,
      borderWidth: 2,
      hoverBorderWidth: 2,
      spacing: 0,
    },
  ],
};

const projectDoughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "72%",
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed} projects`,
      },
    },
  },
};

function LogoMark() {
  return (
    <Box
      aria-hidden="true"
      w={{ base: "32px", md: "38px" }}
      h={{ base: "32px", md: "38px" }}
      position="relative"
      flexShrink={0}
    >
      <Box
        position="absolute"
        inset="0"
        bg="linear-gradient(135deg, #5F7BF3 0%, #1D7FE3 100%)"
        clipPath="polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      />
      <Box
        position="absolute"
        inset="7px"
        bg={colors.surface}
        clipPath="polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      />
      <Box
        position="absolute"
        right="0"
        bottom="2px"
        w="44%"
        h="44%"
        bg={colors.primaryLight}
        clipPath="polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      />
    </Box>
  );
}

function ManagerOverviewTopNav() {
  return (
    <Box
      as="header"
      bg={colors.surface}
      borderBottom="1px solid"
      borderColor={colors.border}
      boxShadow="0 1px 8px rgba(11, 12, 28, 0.04)"
    >
      <Flex
        minH={{ base: "76px", xl: "76px" }}
        px={{ base: "16px", md: "24px" }}
        py={{ base: "12px", lg: 0 }}
        align="center"
        justify="space-between"
        gap={{ base: 4, xl: 8 }}
        flexWrap={{ base: "wrap", xl: "nowrap" }}
      >
        <HStack gap={{ base: 3, md: 4 }} flexShrink={0}>
          <LogoMark />
          <Text
            color={colors.primaryText}
            fontSize={{ base: "17px", md: "18px" }}
            fontWeight="800"
            letterSpacing="0"
            whiteSpace="nowrap"
          >
            CLYRA
          </Text>
        </HStack>

        <HStack
          as="nav"
          aria-label="Manager overview sections"
          gap={{ base: 4, lg: 8, xl: 10 }}
          display={{ base: "none", md: "flex" }}
          flex="1"
          justify={{ md: "center", xl: "flex-start" }}
          minW={0}
        >
          {navItems.map((item) => {
            const isActive = item === "Overview";

            return (
              <Box
                key={item}
                position="relative"
                h="76px"
                display="flex"
                alignItems="center"
              >
                <Text
                  color={isActive ? colors.primaryText : colors.primaryText}
                  fontSize="14px"
                  fontWeight={isActive ? "800" : "700"}
                  lineHeight="1"
                  whiteSpace="nowrap"
                >
                  {item}
                </Text>
                {isActive && (
                  <Box
                    position="absolute"
                    left="0"
                    right="0"
                    bottom="6px"
                    h="3px"
                    bg={colors.primary}
                    borderRadius="999px"
                  />
                )}
              </Box>
            );
          })}
        </HStack>

        <HStack
          as="nav"
          aria-label="Manager overview sections mobile"
          display={{ base: "flex", md: "none" }}
          order={{ base: 3, xl: 0 }}
          w="full"
          overflowX="auto"
          gap={6}
          pt={1}
          pb={0.5}
        >
          {navItems.map((item) => {
            const isActive = item === "Overview";

            return (
              <Box key={item} position="relative" pb={2} flexShrink={0}>
                <Text
                  color={colors.primaryText}
                  fontSize="13px"
                  fontWeight={isActive ? "800" : "700"}
                >
                  {item}
                </Text>
                {isActive && (
                  <Box
                    position="absolute"
                    left="0"
                    right="0"
                    bottom="0"
                    h="3px"
                    bg={colors.primary}
                    borderRadius="999px"
                  />
                )}
              </Box>
            );
          })}
        </HStack>

        <HStack
          gap={{ base: 2.5, md: 3, xl: 4 }}
          flex={{ base: "1 1 100%", xl: "0 0 auto" }}
          justify={{ base: "flex-end", xl: "flex-start" }}
          minW={0}
        >
          <Box
            position="relative"
            w={{ base: "100%", sm: "288px", lg: "320px" }}
            maxW={{ base: "100%", xl: "320px" }}
            display={{ base: "none", sm: "block" }}
          >
            <Box
              position="absolute"
              left="14px"
              top="50%"
              transform="translateY(-50%)"
              color={colors.secondaryText}
              zIndex={1}
              pointerEvents="none"
            >
              <Search size={17} strokeWidth={2} />
            </Box>
            <Input
              aria-label="Search"
              placeholder="Search anything..."
              h="44px"
              pl="44px"
              pr="16px"
              bg="#F8FAFD"
              border="1px solid"
              borderColor={colors.lightBorder}
              borderRadius="6px"
              color={colors.secondaryText}
              fontSize="13px"
              _placeholder={{ color: colors.mutedText }}
              _focus={{
                borderColor: colors.primaryLight,
                boxShadow: "0 0 0 1px #6EA0E6",
              }}
            />
          </Box>

          <Button
            h="44px"
            px={{ base: 3, md: 4 }}
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            color={colors.primaryText}
            fontSize="13px"
            fontWeight="700"
            _hover={{ bg: "#F8FAFD" }}
          >
            <HStack gap={2}>
              <CalendarDays size={16} color={colors.secondaryText} />
              <Text display={{ base: "none", md: "block" }} whiteSpace="nowrap">
                Sun, 2 Aug 2025
              </Text>
              <ChevronDown size={15} color={colors.secondaryText} />
            </HStack>
          </Button>

          <Box position="relative" flexShrink={0}>
            <IconButton
              aria-label="Notifications"
              h="44px"
              w="44px"
              minW="44px"
              bg="transparent"
              color={colors.primaryText}
              borderRadius="full"
              _hover={{ bg: colors.primarySoft }}
            >
              <Bell size={20} />
            </IconButton>
            <Box
              position="absolute"
              top="4px"
              right="4px"
              minW="17px"
              h="17px"
              px="3px"
              borderRadius="999px"
              bg={colors.primary}
              color={colors.surface}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="10px"
              fontWeight="800"
              lineHeight="1"
              border="2px solid"
              borderColor={colors.surface}
            >
              3
            </Box>
          </Box>

          <HStack gap={2.5} flexShrink={0}>
            <Box
              w="44px"
              h="44px"
              borderRadius="full"
              bg="linear-gradient(135deg, #D7E9F8 0%, #F2D6BE 100%)"
              border="1px solid"
              borderColor={colors.lightBorder}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Text
                color={colors.primaryText}
                fontSize="14px"
                fontWeight="800"
              >
                MU
              </Text>
            </Box>
            <HStack gap={1.5} display={{ base: "none", md: "flex" }}>
              <Text
                color={colors.primaryText}
                fontSize="13px"
                fontWeight="800"
                whiteSpace="nowrap"
              >
                Manager User
              </Text>
              <ChevronDown size={15} color={colors.secondaryText} />
            </HStack>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}

function ManagerOverviewPageHeader() {
  return (
    <Flex
      w="full"
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={4}
      flexDir={{ base: "column", md: "row" }}
    >
      <VStack align="flex-start" gap={2}>
        <HStack gap={2.5} align="center">
          <Text
            as="h1"
            color={colors.primaryText}
            fontSize={{ base: "22px", md: "22px", xl: "22px" }}
            fontWeight="800"
            lineHeight="1.15"
            letterSpacing="0"
          >
            Good evening, Manager!
          </Text>
          <Box color={colors.warning} transform="rotate(-12deg)">
            <Hand size={24} fill="#FDB83F" stroke="#D68A1E" strokeWidth={1.8} />
          </Box>
        </HStack>
        <Text
          color={colors.secondaryText}
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight="500"
          lineHeight="1.5"
        >
          Here&apos;s a snapshot of your team&apos;s attribution health.
        </Text>
      </VStack>

      <Button
        h="40px"
        px="16px"
        bg={colors.surface}
        color={colors.primaryText}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="6px"
        fontSize="13px"
        fontWeight="800"
        boxShadow="0 1px 2px rgba(11, 12, 28, 0.02)"
        _hover={{ bg: "#F8FAFD", borderColor: "#D9E1EA" }}
      >
        <HStack gap={2.5}>
          <Download size={16} color={colors.primary} />
          <Text>Export Report</Text>
        </HStack>
      </Button>
    </Flex>
  );
}

function SummaryMetrics() {
  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, xl: 4 }}
      gap={rowGap}
      mt={{ base: "24px", md: "28px" }}
    >
      {summaryMetrics.map((metric) => {
        const Icon = metric.icon;
        const isFlat = metric.trendPrefix === "flat";

        return (
          <Box
            key={metric.label}
            minH={{ base: "124px", lg: "132px" }}
            bg={colors.surface}
            border={cardBorder}
            borderColor={colors.border}
            borderRadius={cardRadius}
            boxShadow={cardShadow}
            px={{ base: "20px", md: "22px" }}
            py={{ base: "18px", md: "20px" }}
            display="flex"
            alignItems="center"
          >
            <HStack gap={{ base: "16px", md: "20px" }} align="center" w="full">
              <Box
                h={{ base: "62px", md: "72px" }}
                w={{ base: "62px", md: "72px" }}
                borderRadius="full"
                bg={metric.iconBg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon size={30} color={metric.iconColor} strokeWidth={2} />
              </Box>

              <VStack align="flex-start" gap={2} minW={0}>
                <Text
                  color={colors.primaryText}
                  fontSize="12px"
                  fontWeight="800"
                  lineHeight="1"
                  textTransform="uppercase"
                  letterSpacing="0"
                >
                  {metric.label}
                </Text>
                <Text
                  color={metric.valueColor ?? colors.primaryText}
                  fontSize={{ base: "28px", md: "30px" }}
                  fontWeight="800"
                  lineHeight="1"
                  letterSpacing="0"
                >
                  {metric.value}
                </Text>
                <HStack gap={1.5} color={isFlat ? colors.secondaryText : colors.success}>
                  {isFlat ? (
                    <Minus size={15} strokeWidth={2.4} />
                  ) : (
                    <ArrowUp size={15} strokeWidth={2.4} />
                  )}
                  <Text
                    as="span"
                    color={isFlat ? colors.secondaryText : colors.success}
                    fontSize="13px"
                    fontWeight="800"
                    lineHeight="1"
                  >
                    {metric.trend}
                  </Text>
                  <Text
                    as="span"
                    color={colors.secondaryText}
                    fontSize="13px"
                    fontWeight="600"
                    lineHeight="1"
                    whiteSpace="nowrap"
                  >
                    vs last month
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}

function AnalyticsCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box
      minH={{ base: "300px", xl: "278px" }}
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      px={{ base: "20px", md: "22px" }}
      py={{ base: "20px", md: "24px" }}
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" justify="space-between" gap="16px" mb="22px">
        <Text
          as="h2"
          color={colors.primaryText}
          fontSize="15px"
          fontWeight="800"
          lineHeight="1"
          letterSpacing="0"
        >
          {title}
        </Text>
        {action}
      </Flex>
      {children}
    </Box>
  );
}

function AttritionOverviewCard() {
  return (
    <AnalyticsCard title="Attrition Overview">
      <Flex
        flex="1"
        align="center"
        justify="space-between"
        gap={{ base: 5, md: 6 }}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Box
          position="relative"
          w={{ base: "188px", md: "194px" }}
          h={{ base: "188px", md: "194px" }}
          flexShrink={0}
        >
          <Doughnut data={donutChartData} options={donutChartOptions} />
          <VStack
            position="absolute"
            inset="0"
            align="center"
            justify="center"
            gap={1}
            pointerEvents="none"
          >
            <Text
              color={colors.primaryText}
              fontSize={{ base: "28px", md: "32px" }}
              fontWeight="800"
              lineHeight="1"
            >
              47%
            </Text>
            <Text
              color={colors.primaryText}
              fontSize="13px"
              fontWeight="800"
              lineHeight="1"
            >
              At Risk
            </Text>
          </VStack>
        </Box>

        <VStack
          align="stretch"
          gap="22px"
          minW={{ base: "full", sm: "152px" }}
          w={{ base: "full", sm: "auto" }}
        >
          {attritionOverview.map((item) => (
            <HStack key={item.label} justify="space-between" gap={8}>
              <HStack gap={3}>
                <Box
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={item.color}
                  flexShrink={0}
                />
                <Text
                  color={colors.secondaryText}
                  fontSize="14px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {item.label}
                </Text>
              </HStack>
              <Text
                color={colors.primaryText}
                fontSize="14px"
                fontWeight="800"
              >
                {item.value}%
              </Text>
            </HStack>
          ))}
        </VStack>
      </Flex>
    </AnalyticsCard>
  );
}

function AttritionTrendCard() {
  return (
    <AnalyticsCard
      title="Attrition Trend"
      action={
        <Button
          h="36px"
          px={3.5}
          bg={colors.surface}
          color={colors.primaryText}
          border="1px solid"
          borderColor={colors.border}
          borderRadius="6px"
          fontSize="13px"
          fontWeight="700"
          _hover={{ bg: "#F8FAFD" }}
        >
          <HStack gap={2}>
            <Text>Last 6 Months</Text>
            <ChevronDown size={14} color={colors.secondaryText} />
          </HStack>
        </Button>
      }
    >
      <Box flex="1" minH="0" h={{ base: "210px", xl: "198px" }}>
        <Line data={lineChartData} options={lineChartOptions} />
      </Box>
    </AnalyticsCard>
  );
}

function AttritionDriversCard() {
  const maxDriverValue = 45;

  return (
    <AnalyticsCard title="Attrition Drivers">
      <VStack align="stretch" gap="22px" flex="1" justify="center">
        {attritionDrivers.map((driver) => {
          const width = `${Math.round((driver.value / maxDriverValue) * 100)}%`;

          return (
            <Box key={driver.label}>
              <HStack justify="space-between" mb="9px" gap="16px">
                <Text
                  color={colors.secondaryText}
                  fontSize="14px"
                  fontWeight="600"
                >
                  {driver.label}
                </Text>
                <Text
                  color={colors.primaryText}
                  fontSize="14px"
                  fontWeight="800"
                >
                  {driver.value}%
                </Text>
              </HStack>
              <Box
                w="full"
                h="6px"
                bg="#F0F2F6"
                borderRadius="999px"
                overflow="hidden"
              >
                <Box
                  w={width}
                  h="full"
                  bg={driver.color}
                  borderRadius="999px"
                />
              </Box>
            </Box>
          );
        })}
      </VStack>
    </AnalyticsCard>
  );
}

function AnalyticsSection() {
  return (
    <Grid
      templateColumns={threeColumnTemplate}
      gap={sectionGap}
      mt={{ base: "18px", md: "24px" }}
    >
      <AttritionOverviewCard />
      <AttritionTrendCard />
      <AttritionDriversCard />
    </Grid>
  );
}

function DetailCard({
  title,
  actionLabel,
  children,
}: {
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      minH={{ base: "304px", xl: "306px" }}
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      px={{ base: "20px", md: "22px" }}
      py={{ base: "20px", md: "22px" }}
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" justify="space-between" gap="16px" mb="16px">
        <Text
          as="h2"
          color={colors.primaryText}
          fontSize="15px"
          fontWeight="800"
          lineHeight="1"
        >
          {title}
        </Text>
        {actionLabel && (
          <Text
            color={colors.primary}
            fontSize="14px"
            fontWeight="700"
            lineHeight="1"
            whiteSpace="nowrap"
          >
            {actionLabel}
          </Text>
        )}
      </Flex>
      {children}
    </Box>
  );
}

function Sparkline({ points, color }: { points: readonly number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const normalizedPoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 64;
      const y = 24 - ((point - min) / Math.max(max - min, 1)) * 18;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Box as="svg" viewBox="0 0 64 28" w="64px" h="28px" flexShrink={0}>
      <polyline
        points={normalizedPoints}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

function TopCriticalMembersCard() {
  return (
    <DetailCard title="Top Critical Members" actionLabel="View All">
      <VStack align="stretch" gap={0} flex="1">
        {criticalMembers.map((member, index) => (
          <HStack
            key={member.name}
            h="52px"
            justify="space-between"
            gap="12px"
            borderBottom={index === criticalMembers.length - 1 ? "0" : "1px solid"}
            borderColor={colors.lightBorder}
          >
            <HStack gap="12px" minW={0} flex="1">
              <Box
                h="34px"
                w="34px"
                borderRadius="full"
                bg={member.avatar}
                border="1px solid"
                borderColor={colors.lightBorder}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text color={colors.surface} fontSize="11px" fontWeight="800">
                  {member.initials}
                </Text>
              </Box>
              <VStack align="flex-start" gap={0.5} minW={0}>
                <Text
                  color={colors.primaryText}
                  fontSize="13px"
                  fontWeight="800"
                  lineHeight="1.1"
                  maxW="140px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {member.name}
                </Text>
                <Text
                  color={member.color}
                  fontSize="12px"
                  fontWeight="700"
                  lineHeight="1"
                >
                  {member.risk}
                </Text>
              </VStack>
            </HStack>

            <HStack gap={{ base: "8px", md: "12px" }} flexShrink={0}>
              <Box
                minW="44px"
                h="26px"
                px="8px"
                borderRadius="6px"
                bg={member.risk === "Medium Risk" ? "#FFF3DE" : "#FFE9E8"}
                color={member.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="13px"
                fontWeight="800"
              >
                {member.score}
              </Box>
              <Sparkline points={member.sparkline} color={member.color} />
              <IconButton
                aria-label={`More options for ${member.name}`}
                variant="ghost"
                w="28px"
                minW="28px"
                h="28px"
                color={colors.secondaryText}
                _hover={{ bg: colors.primarySoft }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </HStack>
          </HStack>
        ))}
      </VStack>
    </DetailCard>
  );
}

function ProjectsOverviewCard() {
  return (
    <DetailCard title="Projects Overview" actionLabel="View All">
      <Flex
        flex="1"
        align="center"
        justify="space-between"
        gap={{ base: 5, md: 6 }}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Box
          position="relative"
          w={{ base: "178px", md: "188px" }}
          h={{ base: "178px", md: "188px" }}
          flexShrink={0}
        >
          <Doughnut data={projectDoughnutData} options={projectDoughnutOptions} />
          <VStack
            position="absolute"
            inset="0"
            align="center"
            justify="center"
            gap={1}
            pointerEvents="none"
          >
            <Text
              color={colors.primaryText}
              fontSize={{ base: "30px", md: "34px" }}
              fontWeight="800"
              lineHeight="1"
            >
              20
            </Text>
            <Text color={colors.secondaryText} fontSize="13px" fontWeight="600">
              Total Projects
            </Text>
          </VStack>
        </Box>

        <VStack align="stretch" gap="18px" minW={{ base: "full", sm: "184px" }}>
          {projectStatuses.map((status) => (
            <HStack key={status.label} justify="space-between" gap={4}>
              <HStack gap={3}>
                <Box w="12px" h="12px" borderRadius="full" bg={status.color} />
                <Text color={colors.secondaryText} fontSize="14px" fontWeight="600">
                  {status.label}
                </Text>
              </HStack>
              <HStack gap={1.5}>
                <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                  {status.value}
                </Text>
                <Text color={colors.mutedText} fontSize="13px" fontWeight="600">
                  ({status.percentage}%)
                </Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </Flex>

      <HStack
        mt="16px"
        h="46px"
        px="12px"
        borderRadius="8px"
        bg="#F4F8FE"
        color={colors.secondaryText}
        justify="space-between"
      >
        <HStack gap={3}>
          <CalendarDays size={17} color={colors.secondaryText} />
          <Text fontSize="13px" fontWeight="600">
            2 projects are nearing their deadlines
          </Text>
        </HStack>
        <ChevronRight size={18} color={colors.secondaryText} />
      </HStack>
    </DetailCard>
  );
}

function UpcomingDeadlinesCard() {
  return (
    <DetailCard title="Upcoming Deadlines" actionLabel="View Calendar">
      <VStack align="stretch" gap={0} flex="1">
        {upcomingDeadlines.map((deadline, index) => (
          <HStack
            key={deadline.title}
            minH="58px"
            gap={4}
            py={2.5}
            borderBottom={index === upcomingDeadlines.length - 1 ? "0" : "1px solid"}
            borderColor={colors.lightBorder}
          >
            <VStack
              w="48px"
              h="48px"
              borderRadius="8px"
              bg={deadline.dateBg}
              align="center"
              justify="center"
              gap={0}
              flexShrink={0}
            >
              <Text
                color={deadline.dateColor}
                fontSize="11px"
                fontWeight="800"
                lineHeight="1"
              >
                {deadline.month}
              </Text>
              <Text
                color={colors.primaryText}
                fontSize="16px"
                fontWeight="800"
                lineHeight="1.15"
              >
                {deadline.day}
              </Text>
            </VStack>

            <VStack align="flex-start" gap={1} minW={0} flex="1">
              <Text
                color={colors.primaryText}
                fontSize="13px"
                fontWeight="800"
                lineHeight="1.15"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                maxW="100%"
              >
                {deadline.title}
              </Text>
              <Text
                color={deadline.riskColor}
                fontSize="12px"
                fontWeight="700"
                lineHeight="1"
              >
                {deadline.risk}
              </Text>
            </VStack>

            <Box
              px={2.5}
              h="27px"
              borderRadius="6px"
              bg={`${deadline.badgeColor}14`}
              color={deadline.badgeColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="12px"
              fontWeight="800"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {deadline.daysLeft}
            </Box>
          </HStack>
        ))}
      </VStack>
    </DetailCard>
  );
}

function DetailsSection() {
  return (
    <Grid
      templateColumns={threeColumnTemplate}
      gap={sectionGap}
      mt={{ base: "18px", md: "18px" }}
    >
      <TopCriticalMembersCard />
      <ProjectsOverviewCard />
      <UpcomingDeadlinesCard />
    </Grid>
  );
}

function InsightBanner() {
  return (
    <Flex
      mt={{ base: "18px", md: "18px" }}
      minH={{ base: "92px", md: "78px" }}
      bg="#F0F6FE"
      border="1px solid"
      borderColor={colors.lightBorder}
      borderRadius={cardRadius}
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.025)"
      px={{ base: "20px", md: "22px" }}
      py={{ base: "16px", md: "14px" }}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={4}
      flexDir={{ base: "column", md: "row" }}
    >
      <HStack gap={4} align="center" minW={0}>
        <Box
          w="52px"
          h="52px"
          borderRadius="full"
          bg={colors.primarySoft}
          color={colors.primary}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Lightbulb size={24} strokeWidth={2.1} />
        </Box>
        <VStack align="flex-start" gap={2} minW={0}>
          <Text
            color={colors.primaryText}
            fontSize="15px"
            fontWeight="800"
            lineHeight="1"
          >
            Insight of the Day
          </Text>
          <Text
            color={colors.secondaryText}
            fontSize="14px"
            fontWeight="600"
            lineHeight="1.4"
          >
            Attrition risk has increased by 12% this month compared to last month.
          </Text>
        </VStack>
      </HStack>

      <Button
        h="44px"
        px={5}
        bg={colors.surface}
        color={colors.primary}
        border="1px solid"
        borderColor="#C9DDF6"
        borderRadius="8px"
        fontSize="14px"
        fontWeight="800"
        flexShrink={0}
        _hover={{ bg: "#F8FAFD", borderColor: colors.primaryLight }}
      >
        <HStack gap={3}>
          <Text>View Detailed Analytics</Text>
          <ChevronRight size={18} />
        </HStack>
      </Button>
    </Flex>
  );
}

export function ManagerOverviewDashboard() {
  const dashboardShell = (
    <Box
      minH="100vh"
      bg={colors.background}
      color={colors.primaryText}
      fontFamily="Arial, Helvetica, sans-serif"
    >
      <ManagerOverviewTopNav />

      <Box
        as="main"
        px={{ base: "16px", md: "28px", xl: "46px" }}
        pt={{ base: "28px", md: "34px", xl: "36px" }}
        pb={{ base: "40px", md: "48px" }}
      >
        <ManagerOverviewPageHeader />
        <SummaryMetrics />
        <AnalyticsSection />
        <DetailsSection />
        <InsightBanner />
      </Box>
    </Box>
  );

  if (temporaryAuthBypass) {
    return dashboardShell;
  }

  return <ManagerOnly>{dashboardShell}</ManagerOnly>;
}
