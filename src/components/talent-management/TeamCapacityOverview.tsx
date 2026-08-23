"use client";

import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { UsersRound } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { colors } from "@/types/styles";
import { capacityRows, capacitySegments, capacitySummaryAlert } from "./talentManagementData";
import { ActionLink, IconBubble, SectionHeader, TalentCard, toneStyles } from "./shared";

ChartJS.register(ArcElement, Tooltip);

const capacityChartData: ChartData<"doughnut", number[], string> = {
  labels: capacitySegments.map((segment) => segment.chartLabel),
  datasets: [
    {
      data: capacitySegments.map((segment) => segment.value),
      backgroundColor: capacitySegments.map((segment) => segment.color),
      borderColor: colors.surface,
      borderWidth: 0,
      hoverBorderWidth: 0,
      spacing: 0,
    },
  ],
};

const capacityChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "74%",
  animation: {
    duration: 0,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
      padding: 10,
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
};

function CapacityDonut() {
  return (
    <Box
      position="relative"
      w={{ base: "136px", md: "156px" }}
      h={{ base: "136px", md: "156px" }}
      mx={{ base: "auto", md: "0" }}
    >
      <Doughnut
        aria-label="Team capacity distribution"
        data={capacityChartData}
        options={capacityChartOptions}
      />
    </Box>
  );
}

function CapacityLegend() {
  return (
    <VStack align="stretch" gap="13px" w="full">
      {capacitySegments.map((item) => (
        <HStack key={item.id} justify="space-between" gap="14px">
          <HStack gap="10px" minW={0}>
            <Box w="9px" h="9px" borderRadius="full" bg={item.color} flexShrink={0} />
            <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" lineHeight="1.2">
              {item.legendLabel}
            </Text>
          </HStack>
          <Text color={colors.primaryText} fontSize="12px" fontWeight="800" lineHeight="1">
            {item.count}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}

function CapacityRow({ row }: { row: (typeof capacityRows)[number] }) {
  const style = toneStyles[row.tone];

  return (
    <Grid
      templateColumns={{
        base: "minmax(170px, 1.2fr) minmax(128px, 1fr) 64px 72px",
        md: "minmax(180px, 1.2fr) minmax(160px, 1fr) 70px 84px",
      }}
      alignItems="center"
      gap="14px"
      minW={{ base: "560px", md: "0" }}
      px="16px"
      py="13px"
      border="1px solid"
      borderColor={colors.lightBorder}
      borderRadius="10px"
      bg={colors.surface}
    >
      <HStack gap="12px" minW={0}>
        <Box
          w="34px"
          h="34px"
          borderRadius="8px"
          bg={style.bg}
          color={style.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <UsersRound size={18} strokeWidth={2.1} />
        </Box>
        <VStack align="flex-start" gap="4px" minW={0}>
          <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.1">
            {row.range}
          </Text>
          <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1.2">
            {row.label}
          </Text>
        </VStack>
      </HStack>

      <HStack gap="12px" color={style.color}>
        {Array.from({ length: row.icons }).map((_, index) => (
          <UsersRound key={`${row.id}-${index}`} size={14} strokeWidth={1.9} />
        ))}
      </HStack>

      <Text color={colors.primaryText} fontSize="13px" fontWeight="800" textAlign="right">
        {row.members}
      </Text>
      <Text color={colors.primaryText} fontSize="13px" fontWeight="800" textAlign="right">
        {row.percentLabel}
      </Text>
    </Grid>
  );
}

export function TeamCapacityOverview() {
  return (
    <TalentCard minH={{ base: "auto", xl: "448px" }}>
      <SectionHeader
        title="Team Capacity Overview"
        description="Understand how your team's capacity is distributed."
      />

      <Grid
        templateColumns={{ base: "1fr", lg: "270px 1px minmax(0, 1fr)" }}
        gap={{ base: "22px", lg: "24px" }}
        alignItems="stretch"
      >
        <VStack align="stretch" gap="22px" px={{ base: "4px", md: "10px", lg: "18px" }}>
          <CapacityDonut />
          <CapacityLegend />
        </VStack>

        <Box display={{ base: "none", lg: "block" }} bg={colors.lightBorder} />

        <VStack align="stretch" gap="10px" minW={0}>
          <Grid
            templateColumns={{ base: "minmax(180px, 1.2fr) minmax(160px, 1fr) 70px 84px" }}
            gap="14px"
            px="16px"
            minW={{ base: "560px", md: "0" }}
            overflowX="auto"
          >
            {["Members by Allocation Range", "", "Members", "% of Team"].map((label, index) => (
              <Text
                key={`${label}-${index}`}
                color={colors.secondaryText}
                fontSize="12px"
                fontWeight="800"
                lineHeight="1"
                textAlign={index > 1 ? "right" : "left"}
              >
                {label}
              </Text>
            ))}
          </Grid>

          <Box overflowX="auto">
            <VStack align="stretch" gap="8px">
              {capacityRows.map((row) => (
                <CapacityRow key={row.id} row={row} />
              ))}
            </VStack>
          </Box>
        </VStack>
      </Grid>

      <Flex
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap="16px"
        mt="18px"
        px="16px"
        py="13px"
        border="1px solid"
        borderColor="#DCEAFE"
        borderRadius="8px"
        bg="#F7FBFF"
        flexDir={{ base: "column", md: "row" }}
      >
        <HStack gap="12px" minW={0}>
          <IconBubble tone="primary" size="28px">
            <UsersRound size={15} strokeWidth={2.1} />
          </IconBubble>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.35">
            {capacitySummaryAlert.message}
          </Text>
        </HStack>
        <ActionLink>View capacity details</ActionLink>
      </Flex>
    </TalentCard>
  );
}
