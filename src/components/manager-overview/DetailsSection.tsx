"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ChartData } from "chart.js";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import NextLink from "next/link";
import { Doughnut } from "react-chartjs-2";
import { projectDoughnutOptions } from "../../config/chartConfig";
import {
  criticalMembers,
  nearingDeadlineProjectsCount,
  projectStatuses,
  upcomingDeadlines,
} from "./data";
import { DetailCard, Sparkline } from "./shared";
import { colors, sectionGap, threeColumnTemplate } from "../../types/styles";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const monthIndexByLabel: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const calendarWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const currentYear = new Date().getFullYear();

function getDeadlineDate(monthLabel: string, dayLabel: string) {
  const month = monthIndexByLabel[monthLabel] ?? 0;
  return new Date(currentYear, month, Number(dayLabel));
}

function formatCalendarMonth(date: Date) {
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getCalendarDays(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days: Array<Date | null> = Array.from({ length: firstDay.getDay() }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function isSameCalendarDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function formatReadableDeadline(date: Date) {
  return `${monthNames[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
}

function TopCriticalMembersCard() {
  return (
    <DetailCard title="Top Critical Members" actionLabel="View All" actionHref="/teams-info">
      <VStack align="stretch" justify={"space-between"} gap={0} flex="1">
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
                <Text color={member.color} fontSize="12px" fontWeight="700" lineHeight="1">
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
              {/* <IconButton
                aria-label={`More options for ${member.name}`}
                variant="ghost"
                w="28px"
                minW="28px"
                h="28px"
                color={colors.secondaryText}
                _hover={{ bg: colors.primarySoft }}
              >
                <MoreVertical size={16} />
              </IconButton> */}
            </HStack>
          </HStack>
        ))}
      </VStack>
    </DetailCard>
  );
}

function ProjectsOverviewCard() {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const activeStatusData = projectStatuses.find((status) => status.label === activeStatus);
  const projectChartData = useMemo<ChartData<"doughnut", number[], string>>(
    () => ({
      labels: projectStatuses.map((status) => status.label),
      datasets: [
        {
          data: projectStatuses.map((status) => status.value),
          backgroundColor: projectStatuses.map((status) =>
            activeStatus && activeStatus !== status.label ? `${status.color}2E` : status.color,
          ),
          borderColor: colors.surface,
          borderWidth: 2,
          hoverBorderWidth: 2,
          spacing: 0,
        },
      ],
    }),
    [activeStatus],
  );

  return (
    <DetailCard title="Projects Overview">
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
          <Doughnut data={projectChartData} options={projectDoughnutOptions} />
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
              {activeStatusData ? activeStatusData.value : 20}
            </Text>
            <Text color={colors.secondaryText} fontSize="13px" fontWeight="600">
              {activeStatusData ? activeStatusData.label : "Total Projects"}
            </Text>
          </VStack>
        </Box>

        <VStack align="stretch" gap="18px" minW={{ base: "full", sm: "184px" }}>
          {projectStatuses.map((status) => (
            <HStack
              as="button"
              key={status.label}
              justify="space-between"
              gap={4}
              w="full"
              type="button"
              textAlign="left"
              cursor="pointer"
              opacity={activeStatus && activeStatus !== status.label ? 0.45 : 1}
              transition="opacity 0.2s ease, transform 0.2s ease"
              _hover={{ transform: "translateX(2px)" }}
              aria-pressed={activeStatus === status.label}
              onClick={() => setActiveStatus((current) => (current === status.label ? null : status.label))}
            >
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
            {nearingDeadlineProjectsCount} projects are nearing their deadlines
          </Text>
        </HStack>
        <NextLink href="/projects-info" style={{ display: "inline-flex" }}>
          <IconButton
            aria-label="View projects overview details"
            variant="ghost"
            w="28px"
            minW="28px"
            h="28px"
            color={colors.secondaryText}
            _hover={{ bg: colors.surface }}
          >
            <ChevronRight size={18} color={colors.secondaryText} />
          </IconButton>
        </NextLink>
      </HStack>
    </DetailCard>
  );
}

function UpcomingDeadlinesCard() {
  const deadlinesWithDates = useMemo(
    () =>
      upcomingDeadlines.map((deadline) => ({
        ...deadline,
        date: getDeadlineDate(deadline.month, deadline.day),
      })),
    [],
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const firstUpcomingDeadline = deadlinesWithDates[0]?.date ?? new Date(currentYear, 7, 1);
    return new Date(firstUpcomingDeadline.getFullYear(), firstUpcomingDeadline.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(deadlinesWithDates[0]?.date ?? null);
  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const selectedDeadlineEntries = useMemo(() => {
    if (!selectedDate) return [];
    return deadlinesWithDates.filter((deadline) => isSameCalendarDate(deadline.date, selectedDate));
  }, [deadlinesWithDates, selectedDate]);

  return (
    <DetailCard
      title="Upcoming Deadlines"
      action={
        <Button
          variant="ghost"
          h="auto"
          minW="auto"
          p={0}
          color={colors.primary}
          fontSize="14px"
          fontWeight="700"
          lineHeight="1"
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          onClick={() => setIsCalendarOpen(true)}
        >
          View Calendar
        </Button>
      }
    >
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
              <Text color={deadline.dateColor} fontSize="11px" fontWeight="800" lineHeight="1">
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
              <Text color={deadline.riskColor} fontSize="12px" fontWeight="700" lineHeight="1">
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

      {isCalendarOpen && (
        <Portal>
          <Flex
            position="fixed"
            inset={0}
            bg="rgba(11, 12, 28, 0.42)"
            zIndex={1400}
            align="center"
            justify="center"
            p={{ base: 4, md: 6 }}
            onClick={() => setIsCalendarOpen(false)}
          >
            <Box
              w="full"
              maxW="980px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="20px"
              boxShadow="0 28px 80px rgba(11, 12, 28, 0.18)"
              overflow="hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <Flex
                align={{ base: "flex-start", md: "center" }}
                justify="space-between"
                gap={4}
                px={{ base: 5, md: 6 }}
                py={5}
                borderBottom="1px solid"
                borderColor={colors.lightBorder}
                flexDir={{ base: "column", md: "row" }}
              >
                <Box>
                  <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1.1">
                    Project Deadlines Calendar
                  </Text>
                  <Text mt={1} color={colors.mutedText} fontSize="13px" fontWeight="600">
                    Review upcoming milestones and planned delivery dates.
                  </Text>
                </Box>
                <IconButton
                  aria-label="Close calendar"
                  variant="ghost"
                  alignSelf={{ base: "flex-end", md: "center" }}
                  color={colors.secondaryText}
                  _hover={{ bg: colors.primarySoft }}
                  onClick={() => setIsCalendarOpen(false)}
                >
                  <X size={18} />
                </IconButton>
              </Flex>

              <Grid templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }} gap={0}>
                <Box px={{ base: 5, md: 6 }} py={5} borderRight={{ base: "none", lg: "1px solid" }} borderColor={colors.lightBorder}>
                  <HStack justify="space-between" mb={5}>
                    <HStack gap={2}>
                      <IconButton
                        aria-label="Previous month"
                        variant="ghost"
                        color={colors.secondaryText}
                        _hover={{ bg: colors.primarySoft }}
                        onClick={() =>
                          setCalendarMonth(
                            (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                          )
                        }
                      >
                        <ChevronLeft size={18} />
                      </IconButton>
                      <Text color={colors.primaryText} fontSize="16px" fontWeight="800">
                        {formatCalendarMonth(calendarMonth)}
                      </Text>
                      <IconButton
                        aria-label="Next month"
                        variant="ghost"
                        color={colors.secondaryText}
                        _hover={{ bg: colors.primarySoft }}
                        onClick={() =>
                          setCalendarMonth(
                            (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                          )
                        }
                      >
                        <ChevronRight size={18} />
                      </IconButton>
                    </HStack>
                    <Text color={colors.mutedText} fontSize="12px" fontWeight="700">
                      {deadlinesWithDates.length} deadlines
                    </Text>
                  </HStack>

                  <Grid templateColumns="repeat(7, minmax(0, 1fr))" gap={2}>
                    {calendarWeekDays.map((day) => (
                      <Flex
                        key={day}
                        h="34px"
                        align="center"
                        justify="center"
                        color={colors.mutedText}
                        fontSize="12px"
                        fontWeight="800"
                      >
                        {day}
                      </Flex>
                    ))}

                    {calendarDays.map((day, index) => {
                      if (!day) {
                        return <Box key={`empty-${index}`} h={{ base: "68px", md: "78px" }} />;
                      }

                      const matchingDeadlines = deadlinesWithDates.filter((deadline) =>
                        isSameCalendarDate(deadline.date, day),
                      );
                      const isSelected = selectedDate ? isSameCalendarDate(day, selectedDate) : false;

                      return (
                        <Button
                          key={day.toISOString()}
                          h={{ base: "68px", md: "78px" }}
                          p={2.5}
                          borderRadius="12px"
                          border="1px solid"
                          borderColor={isSelected ? colors.primary : colors.lightBorder}
                          bg={isSelected ? colors.primarySoft : colors.surface}
                          _hover={{ bg: colors.primarySoft }}
                          display="flex"
                          alignItems="stretch"
                          justifyContent="flex-start"
                          onClick={() => setSelectedDate(day)}
                        >
                          <VStack align="stretch" w="full" h="full" gap={1}>
                            <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1">
                              {day.getDate()}
                            </Text>
                            <VStack align="stretch" gap={1} mt="auto">
                              {matchingDeadlines.slice(0, 2).map((deadline) => (
                                <Box
                                  key={deadline.title}
                                  h="6px"
                                  borderRadius="999px"
                                  bg={deadline.badgeColor}
                                  opacity={0.9}
                                />
                              ))}
                              {matchingDeadlines.length > 2 && (
                                <Text color={colors.mutedText} fontSize="10px" fontWeight="700" lineHeight="1">
                                  +{matchingDeadlines.length - 2} more
                                </Text>
                              )}
                            </VStack>
                          </VStack>
                        </Button>
                      );
                    })}
                  </Grid>
                </Box>

                <Box px={{ base: 5, md: 6 }} py={5} bg="#FCFDFE">
                  <Text color={colors.primaryText} fontSize="15px" fontWeight="800" mb={1}>
                    {selectedDate ? formatReadableDeadline(selectedDate) : "Select a date"}
                  </Text>
                  <Text color={colors.mutedText} fontSize="12px" fontWeight="600" mb={5}>
                    Deadline details mapped from the current project list.
                  </Text>

                  {selectedDeadlineEntries.length > 0 ? (
                    <VStack align="stretch" gap={3}>
                      {selectedDeadlineEntries.map((deadline) => (
                        <Box
                          key={deadline.title}
                          p={4}
                          borderRadius="14px"
                          bg={colors.surface}
                          border="1px solid"
                          borderColor={colors.border}
                          boxShadow="0 10px 30px rgba(11, 12, 28, 0.04)"
                        >
                          <HStack justify="space-between" align="start" gap={3} mb={2}>
                            <Text color={colors.primaryText} fontSize="14px" fontWeight="800" lineHeight="1.3">
                              {deadline.title}
                            </Text>
                            <Box
                              px={2.5}
                              h="26px"
                              borderRadius="999px"
                              bg={`${deadline.badgeColor}14`}
                              color={deadline.badgeColor}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="11px"
                              fontWeight="800"
                              whiteSpace="nowrap"
                            >
                              {deadline.daysLeft}
                            </Box>
                          </HStack>
                          <HStack justify="space-between" gap={3} flexWrap="wrap">
                            <Text color={deadline.riskColor} fontSize="12px" fontWeight="700">
                              {deadline.risk}
                            </Text>
                            <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">
                              Due {formatReadableDeadline(deadline.date)}
                            </Text>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Flex
                      minH="220px"
                      align="center"
                      justify="center"
                      border="1px dashed"
                      borderColor={colors.border}
                      borderRadius="16px"
                      bg={colors.surface}
                      px={6}
                    >
                      <VStack gap={2} textAlign="center">
                        <CalendarDays size={22} color={colors.secondaryText} />
                        <Text color={colors.primaryText} fontSize="14px" fontWeight="700">
                          No deadlines on this date
                        </Text>
                        <Text color={colors.mutedText} fontSize="12px" fontWeight="600">
                          Select a highlighted day to view project deadline details.
                        </Text>
                      </VStack>
                    </Flex>
                  )}
                </Box>
              </Grid>
            </Box>
          </Flex>
        </Portal>
      )}
    </DetailCard>
  );
}

export function DetailsSection() {
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
