"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import type { ChartData } from "chart.js";
import { ChevronDown } from "lucide-react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  donutChartOptions,
  lineChartOptions,
} from "../../config/chartConfig";
import { attritionDrivers, attritionOverview } from "./data";
import { AnalyticsCard } from "./shared";
import { colors, sectionGap, threeColumnTemplate } from "../../types/styles";

const trendRangeOptions = ["Last 6 Months", "Last 1 Year", "Last 2 Years", "Last 3 Years"] as const;
type TrendRangeOption = (typeof trendRangeOptions)[number];

type TrendDataResponse = {
  labels: string[];
  values: number[];
};

const mockTrendDataByRange: Record<TrendRangeOption, TrendDataResponse> = {
  "Last 6 Months": {
    labels: ["Feb '25", "Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25"],
    values: [170, 105, 310, 245, 180, 475],
  },
  "Last 1 Year": {
    labels: ["Aug '25", "Oct '25", "Dec '25", "Feb '26", "Apr '26", "Jun '26", "Aug '26"],
    values: [140, 210, 190, 260, 315, 285, 345],
  },
  "Last 2 Years": {
    labels: ["Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26"],
    values: [120, 165, 205, 255, 285, 240, 310, 360],
  },
  "Last 3 Years": {
    labels: ["2024 Q1", "2024 Q3", "2025 Q1", "2025 Q3", "2026 Q1", "2026 Q3"],
    values: [95, 145, 210, 275, 330, 390],
  },
};

function buildLineChartData(data: TrendDataResponse): ChartData<"line", number[], string> {
  return {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
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
}

async function fetchAttritionTrendData(range: TrendRangeOption): Promise<TrendDataResponse> {
  return mockTrendDataByRange[range];
}

function AttritionOverviewCard() {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const activeSegmentData = attritionOverview.find((item) => item.label === activeSegment);
  const attritionChartData = useMemo<ChartData<"doughnut", number[], string>>(
    () => ({
      labels: attritionOverview.map((item) => item.label),
      datasets: [
        {
          data: attritionOverview.map((item) => item.value),
          backgroundColor: attritionOverview.map((item) =>
            activeSegment && activeSegment !== item.label ? `${item.color}2E` : item.color,
          ),
          borderColor: colors.surface,
          borderWidth: 0,
          hoverBorderWidth: 0,
          spacing: 0,
        },
      ],
    }),
    [activeSegment],
  );

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
          <Doughnut data={attritionChartData} options={donutChartOptions} />
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
              {activeSegmentData ? activeSegmentData.value : 47}%
            </Text>
            <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1">
              {activeSegmentData ? activeSegmentData.label : "At Risk"}
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
            <HStack
              as="button"
              key={item.label}
              justify="space-between"
              gap={8}
              w="full"
              type="button"
              textAlign="left"
              cursor="pointer"
              opacity={activeSegment && activeSegment !== item.label ? 0.45 : 1}
              transition="opacity 0.2s ease, transform 0.2s ease"
              _hover={{ transform: "translateX(2px)" }}
              aria-pressed={activeSegment === item.label}
              onClick={() => setActiveSegment((current) => (current === item.label ? null : item.label))}
            >
              <HStack gap={3}>
                <Box w="12px" h="12px" borderRadius="full" bg={item.color} flexShrink={0} />
                <Text
                  color={colors.secondaryText}
                  fontSize="14px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {item.label}
                </Text>
              </HStack>
              <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
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
  const [selectedRange, setSelectedRange] = useState<TrendRangeOption>("Last 6 Months");
  const [trendChartData, setTrendChartData] = useState(() =>
    buildLineChartData(mockTrendDataByRange["Last 6 Months"]),
  );
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const rangeDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isRangeOpen) {
      return;
    }

    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        rangeDropdownRef.current &&
        !rangeDropdownRef.current.contains(target)
      ) {
        setIsRangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, [isRangeOpen]);

  const handleRangeSelect = async (option: TrendRangeOption) => {
    setSelectedRange(option);
    setIsRangeOpen(false);

    const nextTrendData = await fetchAttritionTrendData(option);
    setTrendChartData(buildLineChartData(nextTrendData));
  };

  return (
    <AnalyticsCard
      title="Attrition Trend"
      action={
        <Box ref={rangeDropdownRef} position="relative">
          <Button
            h="36px"
            px={3.5}
            bg={colors.surface}
            color={colors.primaryText}
            border="1px solid"
            borderColor={isRangeOpen ? colors.primaryLight : colors.border}
            borderRadius="6px"
            fontSize="13px"
            fontWeight="700"
            _hover={{ bg: "#F8FAFD" }}
            onClick={() => setIsRangeOpen((isOpen) => !isOpen)}
            aria-expanded={isRangeOpen}
            aria-haspopup="menu"
          >
            <HStack gap={2}>
              <Text>{selectedRange}</Text>
              <ChevronDown size={14} color={colors.secondaryText} />
            </HStack>
          </Button>

          {isRangeOpen && (
            <Box
              position="absolute"
              right="0"
              top="calc(100% + 8px)"
              zIndex={20}
              w="152px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="8px"
              boxShadow="0 12px 30px rgba(11, 12, 28, 0.12)"
              overflow="hidden"
            >
              {trendRangeOptions.map((option) => {
                const isSelected = option === selectedRange;

                return (
                  <Button
                    key={option}
                    w="full"
                    h="38px"
                    px="12px"
                    justifyContent="flex-start"
                    bg={isSelected ? colors.primarySoft : colors.surface}
                    color={colors.primaryText}
                    borderRadius="0"
                    fontSize="13px"
                    fontWeight={isSelected ? "800" : "700"}
                    _hover={{ bg: colors.primarySoft }}
                    onClick={() => handleRangeSelect(option)}
                  >
                    {option}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>
      }
    >
      <Box flex="1" minH="0" h={{ base: "210px", xl: "198px" }}>
        <Line data={trendChartData} options={lineChartOptions} />
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
                <Text color={colors.secondaryText} fontSize="14px" fontWeight="600">
                  {driver.label}
                </Text>
                <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                  {driver.value}%
                </Text>
              </HStack>
              <Box w="full" h="6px" bg="#F0F2F6" borderRadius="999px" overflow="hidden">
                <Box w={width} h="full" bg={driver.color} borderRadius="999px" />
              </Box>
            </Box>
          );
        })}
      </VStack>
    </AnalyticsCard>
  );
}

export function AnalyticsSection() {
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
