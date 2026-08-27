"use client";

import { Box, Button, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, ChevronRight as RowArrow } from "lucide-react";
import { colors } from "@/types/styles";
import { quickActions, sourceSegments, upcomingHighlights, weekDays } from "./actionItemData";
import { ActionCard, IconTile, SectionTitle } from "./shared";

type ActionSidebarProps = {
  selectedWeekDate: string | null;
  onSelectedWeekDateChange: (date: string | null) => void;
};

const todayIsoDate = "2024-05-24";

function WeekCard({ selectedWeekDate, onSelectedWeekDateChange }: ActionSidebarProps) {
  return (
    <ActionCard>
      <HStack justify="space-between" mb="16px">
        <SectionTitle title="This Week" />
        <HStack gap="8px">
          <Box w="24px" h="24px" border="1px solid" borderColor={colors.border} borderRadius="6px" display="flex" alignItems="center" justifyContent="center" color={colors.secondaryText}>
            <ChevronLeft size={14} />
          </Box>
          <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">May 20 - May 26</Text>
          <Box w="24px" h="24px" border="1px solid" borderColor={colors.border} borderRadius="6px" display="flex" alignItems="center" justifyContent="center" color={colors.secondaryText}>
            <ChevronRight size={14} />
          </Box>
        </HStack>
      </HStack>
      <Grid templateColumns="repeat(7, minmax(0, 1fr))" gap="6px">
        {weekDays.map((day) => {
          const isSelected = selectedWeekDate === day.isoDate;
          const isToday = selectedWeekDate === null && day.isoDate === todayIsoDate;
          const isEmphasized = isSelected || isToday;
          const totalActions = day.counts.reduce((total, count) => total + Number(count.value), 0);

          return (
            <Button
              key={day.isoDate}
              aria-pressed={isSelected}
              aria-label={`Filter actions due on ${day.day}, May ${day.date}`}
              h="auto"
              minW="0"
              px="0"
              py="0"
              bg="transparent"
              borderRadius="9px"
              _hover={{ bg: "#F8FAFD" }}
              onClick={() => onSelectedWeekDateChange(isSelected ? null : day.isoDate)}
            >
              <VStack
                w="full"
                minH="88px"
                gap="7px"
                py="9px"
                border="1px solid"
                borderColor={isEmphasized ? "#B9D6FA" : colors.lightBorder}
                borderRadius="9px"
                bg={isEmphasized ? colors.primarySoft : colors.surface}
              >
                <Text color={colors.secondaryText} fontSize="10px" fontWeight="800" lineHeight="1">{day.day}</Text>
                <Box
                  minW="30px"
                  h="30px"
                  px="8px"
                  borderRadius="8px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={isEmphasized ? colors.primary : "transparent"}
                  color={isEmphasized ? colors.surface : colors.primaryText}
                >
                  <Text fontSize="14px" fontWeight="800" lineHeight="1">{day.date}</Text>
                </Box>
                <HStack gap="5px" minH="13px" justify="center">
                  {totalActions === 0 ? (
                    <Box w="6px" h="6px" borderRadius="full" bg="#C7D0DF" />
                  ) : (
                    day.counts.map((count, index) => (
                      <HStack key={`${day.day}-${index}`} gap="3px">
                        <Text color={colors.secondaryText} fontSize="10px" fontWeight="800" lineHeight="1">{count.value}</Text>
                        <Box w="6px" h="6px" borderRadius="full" bg={count.color} />
                      </HStack>
                    ))
                  )}
                </HStack>
              </VStack>
            </Button>
          );
        })}
      </Grid>
    </ActionCard>
  );
}

function HighlightsCard() {
  return (
    <ActionCard>
      <SectionTitle title="Upcoming Highlights" />
      <VStack align="stretch" gap="0" mt="18px">
        {upcomingHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <HStack key={item.id} justify="space-between" gap="16px" py="13px" borderBottom="1px solid" borderColor={colors.lightBorder} _last={{ borderBottom: "0" }}>
              <HStack gap="14px" minW={0}>
                <IconTile tone={item.tone} size="36px">
                  <Icon size={17} strokeWidth={2.1} />
                </IconTile>
                <VStack align="flex-start" gap="5px" minW={0}>
                  <Text color={colors.primaryText} fontSize="13px" fontWeight="800">{item.title}</Text>
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">{item.description}</Text>
                </VStack>
              </HStack>
              <RowArrow size={17} color={colors.secondaryText} />
            </HStack>
          );
        })}
      </VStack>
    </ActionCard>
  );
}

function SourceDonut() {
  const stops = sourceSegments.reduce(
    (acc, segment) => {
      const start = acc.current;
      const end = start + segment.percent * 3.6;
      acc.parts.push(`${segment.color} ${start}deg ${end}deg`);
      acc.current = end;
      return acc;
    },
    { current: 0, parts: [] as string[] },
  );

  return (
    <ActionCard>
      <SectionTitle title="By Source" />
      <HStack mt="18px" gap="22px" align="center">
        <Box position="relative" w="120px" h="120px" borderRadius="full" bg={`conic-gradient(${stops.parts.join(", ")})`} flexShrink={0}>
          <VStack position="absolute" inset="30px" borderRadius="full" bg={colors.surface} align="center" justify="center" gap="2px">
            <Text color={colors.primaryText} fontSize="22px" fontWeight="800" lineHeight="1">25</Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="700">Total</Text>
          </VStack>
        </Box>
        <VStack align="stretch" gap="9px" flex="1">
          {sourceSegments.map((segment) => (
            <HStack key={segment.label} justify="space-between" gap="12px">
              <HStack gap="9px">
                <Box w="9px" h="9px" borderRadius="3px" bg={segment.color} />
                <Text color={colors.primaryText} fontSize="12px" fontWeight="700">{segment.label}</Text>
              </HStack>
              <Text color={colors.primaryText} fontSize="12px" fontWeight="700">{segment.value} ({segment.percent}%)</Text>
            </HStack>
          ))}
        </VStack>
      </HStack>
    </ActionCard>
  );
}

function QuickActionsCard() {
  return (
    <ActionCard>
      <SectionTitle title="Quick Actions" />
      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap="18px" mt="22px">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <VStack key={action.id} gap="10px">
              <Box w="56px" h="46px" bg={colors.primarySoft} color={colors.primary} borderRadius="10px" display="flex" alignItems="center" justifyContent="center">
                <Icon size={19} strokeWidth={2.1} />
              </Box>
              <Text color={colors.primaryText} fontSize="11px" fontWeight="700" textAlign="center" lineHeight="1.25">{action.label}</Text>
            </VStack>
          );
        })}
      </Grid>
    </ActionCard>
  );
}

export function ActionSidebar({ selectedWeekDate, onSelectedWeekDateChange }: ActionSidebarProps) {
  return (
    <VStack align="stretch" gap={{ base: "18px", md: "20px" }}>
      <WeekCard selectedWeekDate={selectedWeekDate} onSelectedWeekDateChange={onSelectedWeekDateChange} />
      <HighlightsCard />
      <SourceDonut />
      <QuickActionsCard />
    </VStack>
  );
}
