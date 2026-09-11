"use client";

import { Box, Button, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NextLink from "next/link";
import { colors } from "@/types/styles";
import { quickActions, toIsoDate, type ActionSourceSegment, type ActionWeekDay } from "./actionItemData";
import { ActionCard, IconTile, SectionTitle } from "./shared";

type ActionSidebarProps = {
  weekDays: readonly ActionWeekDay[];
  weekRangeLabel: string;
  sourceSegments: readonly ActionSourceSegment[];
  selectedWeekDate: string | null;
  onSelectedWeekDateChange: (date: string | null) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCreateActionPlan: () => void;
};

const todayIsoDate = toIsoDate(new Date());

function WeekCard({
  weekDays,
  weekRangeLabel,
  selectedWeekDate,
  onSelectedWeekDateChange,
  onPreviousWeek,
  onNextWeek,
}: {
  weekDays: readonly ActionWeekDay[];
  weekRangeLabel: string;
  selectedWeekDate: string | null;
  onSelectedWeekDateChange: (date: string | null) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}) {
  return (
    <ActionCard>
      <HStack justify="space-between" mb="16px">
        <SectionTitle title="This Week" />
        <HStack gap="8px">
          <Button
            aria-label="Show previous week"
            w="24px"
            h="24px"
            minW="24px"
            p="0"
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            bg={colors.surface}
            color={colors.secondaryText}
            _hover={{ bg: "#F8FAFD", color: colors.primary }}
            onClick={onPreviousWeek}
          >
            <ChevronLeft size={14} />
          </Button>
          <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">{weekRangeLabel}</Text>
          <Button
            aria-label="Show next week"
            w="24px"
            h="24px"
            minW="24px"
            p="0"
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            bg={colors.surface}
            color={colors.secondaryText}
            _hover={{ bg: "#F8FAFD", color: colors.primary }}
            onClick={onNextWeek}
          >
            <ChevronRight size={14} />
          </Button>
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
              aria-label={`Filter actions due on ${day.day}, ${day.isoDate}`}
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

// function HighlightsCard() {
//   return (
//     <ActionCard>
//       <SectionTitle title="Upcoming Highlights" />
//       <VStack align="stretch" gap="0" mt="18px">
//         {upcomingHighlights.map((item) => {
//           const Icon = item.icon;
//           return (
//             <HStack key={item.id} justify="space-between" gap="16px" py="13px" borderBottom="1px solid" borderColor={colors.lightBorder} _last={{ borderBottom: "0" }}>
//               <HStack gap="14px" minW={0}>
//                 <IconTile tone={item.tone} size="36px">
//                   <Icon size={17} strokeWidth={2.1} />
//                 </IconTile>
//                 <VStack align="flex-start" gap="5px" minW={0}>
//                   <Text color={colors.primaryText} fontSize="13px" fontWeight="800">{item.title}</Text>
//                   <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">{item.description}</Text>
//                 </VStack>
//               </HStack>
//               <RowArrow size={17} color={colors.secondaryText} />
//             </HStack>
//           );
//         })}
//       </VStack>
//     </ActionCard>
//   );
// }

function SourceDonut({ sourceSegments, totalActions }: { sourceSegments: readonly ActionSourceSegment[]; totalActions: number }) {
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
            <Text color={colors.primaryText} fontSize="22px" fontWeight="800" lineHeight="1">{totalActions}</Text>
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

function QuickActionsCard({ onCreateActionPlan }: { onCreateActionPlan: () => void }) {
  return (
    <ActionCard>
      <SectionTitle title="Quick Actions" />
      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap="18px" mt="22px">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <Box w="56px" h="46px" bg={colors.primarySoft} color={colors.primary} borderRadius="10px" display="flex" alignItems="center" justifyContent="center">
                <Icon size={19} strokeWidth={2.1} />
              </Box>
              <Text color={colors.primaryText} fontSize="11px" fontWeight="700" textAlign="center" lineHeight="1.25">{action.label}</Text>
            </>
          );

          if (action.id === "create") {
            return (
              <VStack key={action.id} as="button" gap="10px" cursor="pointer" onClick={onCreateActionPlan} _hover={{ "& > div": { borderColor: colors.primaryLight, bg: "#DDEBFF" } }}>
                {content}
              </VStack>
            );
          }

          if (action.id === "reports") {
            return (
              <NextLink key={action.id} href="/survey-info" style={{ textDecoration: "none" }}>
                <VStack gap="10px" cursor="pointer" _hover={{ "& > div": { borderColor: colors.primaryLight, bg: "#DDEBFF" } }}>
                  {content}
                </VStack>
              </NextLink>
            );
          }

          return (
            <VStack key={action.id} gap="10px">
              {content}
            </VStack>
          );
        })}
      </Grid>
    </ActionCard>
  );
}

export function ActionSidebar({
  weekDays,
  weekRangeLabel,
  sourceSegments,
  selectedWeekDate,
  onSelectedWeekDateChange,
  onPreviousWeek,
  onNextWeek,
  onCreateActionPlan,
}: ActionSidebarProps) {
  const totalActions = sourceSegments.reduce((total, segment) => total + segment.value, 0);

  return (
    <VStack align="stretch" gap={{ base: "18px", md: "20px" }}>
      <WeekCard
        weekDays={weekDays}
        weekRangeLabel={weekRangeLabel}
        selectedWeekDate={selectedWeekDate}
        onSelectedWeekDateChange={onSelectedWeekDateChange}
        onPreviousWeek={onPreviousWeek}
        onNextWeek={onNextWeek}
      />
      {/* <HighlightsCard /> */}
      <SourceDonut sourceSegments={sourceSegments} totalActions={totalActions} />
      <QuickActionsCard onCreateActionPlan={onCreateActionPlan} />
    </VStack>
  );
}
