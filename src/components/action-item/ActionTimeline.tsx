"use client";

import { Box, Button, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Flag, UserRound } from "lucide-react";
import { colors } from "@/types/styles";
import { priorityColors, sourceColors, statusStyles, type ActionItemTimelineEntry } from "./actionItemData";
import { EmptyState, IconTile, toneStyles } from "./shared";

type ActionTimelineProps = {
  currentPage: number;
  items: readonly ActionItemTimelineEntry[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
  expandedId: string | null;
  onExpandedIdChange: (id: string | null) => void;
  onPageChange: (page: number) => void;
};

export function ActionTimeline({
  currentPage,
  items,
  pageSize,
  totalItems,
  totalPages,
  expandedId,
  onExpandedIdChange,
  onPageChange,
}: ActionTimelineProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (items.length === 0) {
    return <EmptyState>No actions match the current filters.</EmptyState>;
  }

  return (
    <Box position="relative" mt="18px" minW={0}>
      <Box position="absolute" left="3px" top="10px" bottom="58px" w="1px" bg="#DDE8FF" />
      <VStack align="stretch" gap="16px">
        {items.map((item) => {
          const Icon = item.icon;
          const statusStyle = statusStyles[item.status];
          const sourceColor = sourceColors[item.source];
          const isExpanded = expandedId === item.id;
          const toneStyle = toneStyles[item.tone];

          return (
            <Box key={item.id} position="relative" pl="22px">
              <Box
                position="absolute"
                left="-3px"
                top="54px"
                w="12px"
                h="12px"
                borderRadius="full"
                bg={colors.surface}
                border="2px solid"
                borderColor={toneStyle.rail}
                zIndex={1}
              />
              <HStack gap="6px" mb="9px">
                <Text color={colors.primary} fontSize="12px" fontWeight="800">
                  {item.dateLabel}
                </Text>
                <Text color={colors.primary} fontSize="12px" fontWeight="700">
                  • {item.dayLabel}
                </Text>
              </HStack>

              <Grid
                templateColumns={{ base: "1fr", xl: "minmax(270px, 1fr) 128px 78px 124px 112px 28px" }}
                gap={{ base: "12px", xl: "14px" }}
                alignItems="center"
                w="full"
                px="14px"
                py="12px"
                bg={colors.surface}
                border="1px solid"
                borderColor={colors.lightBorder}
                borderRadius="10px"
              >
                <HStack gap="14px" minW={0}>
                  <IconTile tone={item.tone} size="42px">
                    <Icon size={19} strokeWidth={2.1} />
                  </IconTile>
                  <VStack align="flex-start" gap="6px" minW={0}>
                    <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.2">
                      {item.title}
                    </Text>
                    <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.45">
                      {item.description}
                    </Text>
                  </VStack>
                </HStack>

                <HStack gap="7px" minW={0}>
                  <UserRound size={14} color={colors.secondaryText} />
                  <Text color={colors.primaryText} fontSize="11px" fontWeight="700" lineClamp={1}>
                    {item.owner}
                  </Text>
                </HStack>

                <HStack gap="7px" color={priorityColors[item.priority]}>
                  <Flag size={14} />
                  <Text fontSize="11px" fontWeight="800">
                    {item.priority}
                  </Text>
                </HStack>

                <HStack gap="7px" color={sourceColor} minW={0}>
                  <CalendarDays size={14} />
                  <Text fontSize="11px" fontWeight="800" lineClamp={1}>
                    {item.source}
                  </Text>
                </HStack>

                <VStack align={{ base: "flex-start", xl: "flex-end" }} gap="7px">
                  <Text color={item.tone === "danger" ? "#EF4444" : "#F97316"} fontSize="11px" fontWeight="700" whiteSpace="nowrap">
                    {item.dueLabel}
                  </Text>
                  <Box
                    px="12px"
                    py="6px"
                    border="1px solid"
                    borderColor={statusStyle.border}
                    borderRadius="6px"
                    bg={statusStyle.bg}
                    color={statusStyle.color}
                    fontSize="11px"
                    fontWeight="800"
                    lineHeight="1"
                  >
                    {item.status}
                  </Box>
                </VStack>

                <Button
                  h="28px"
                  minW="28px"
                  px="0"
                  bg="transparent"
                  color={colors.secondaryText}
                  _hover={{ bg: "#F8FAFD" }}
                  onClick={() => onExpandedIdChange(isExpanded ? null : item.id)}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.title}`}
                >
                  <ChevronDown size={17} />
                </Button>
              </Grid>

              {isExpanded && (
                <Box
                  ml={{ base: "0", xl: "64px" }}
                  mt="8px"
                  px="16px"
                  py="12px"
                  bg="#FBFCFE"
                  border="1px solid"
                  borderColor={colors.lightBorder}
                  borderRadius="8px"
                >
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.5">
                    Mock detail: owner, source, priority, and due date are local-only for this prototype.
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>

      <HStack
        justify="space-between"
        mt="16px"
        px="18px"
        py="12px"
        bg={colors.surface}
        border="1px solid"
        borderColor={colors.lightBorder}
        borderRadius="0 0 10px 10px"
        flexWrap="wrap"
        gap="12px"
      >
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
          Showing {startItem} to {endItem} of {totalItems} actions
        </Text>
        <HStack gap="8px">
          <Button h="34px" minW="34px" px="0" border="1px solid" borderColor={colors.border} bg={colors.surface} color={colors.secondaryText} disabled={currentPage === 1} _disabled={{ opacity: 0.45 }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft size={16} />
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <Button key={page} h="34px" minW="34px" px="0" bg={isActive ? colors.primary : colors.surface} border="1px solid" borderColor={isActive ? colors.primary : colors.border} color={isActive ? colors.surface : colors.primaryText} fontSize="12px" fontWeight="800" _hover={{ bg: isActive ? colors.primary : "#F8FAFD" }} onClick={() => onPageChange(page)}>
                {page}
              </Button>
            );
          })}
          <Button h="34px" minW="34px" px="0" border="1px solid" borderColor={colors.border} bg={colors.surface} color={colors.secondaryText} disabled={currentPage === totalPages} _disabled={{ opacity: 0.45 }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRight size={16} />
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
