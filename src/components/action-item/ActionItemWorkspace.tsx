"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/types/styles";
import {
  actionTimelineItems,
  actionItemTabs,
  type ActionItemPriority,
  type ActionItemSource,
  type ActionItemTab,
} from "./actionItemData";
import { ActionControls } from "./ActionControls";
import { ActionTimeline } from "./ActionTimeline";

const pageSize = 5;

type ActionItemWorkspaceProps = {
  selectedWeekDate: string | null;
};

export function ActionItemWorkspace({ selectedWeekDate }: ActionItemWorkspaceProps) {
  const [viewMode, setViewMode] = useState<"Timeline" | "Overview">("Timeline");
  const [activeTab, setActiveTab] = useState<ActionItemTab>(actionItemTabs[0]);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<"All sources" | ActionItemSource>("All sources");
  const [priority, setPriority] = useState<"All priorities" | ActionItemPriority>("All priorities");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return actionTimelineItems
      .filter((item) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch) ||
          item.owner.toLowerCase().includes(normalizedSearch);
        const matchesSource = source === "All sources" || item.source === source;
        const matchesPriority = priority === "All priorities" || item.priority === priority;
        const matchesWeekDate = selectedWeekDate === null || item.dueSort === selectedWeekDate;
        const matchesTab =
          (activeTab === "Due Soon" && item.status !== "Completed") ||
          (activeTab === "Overdue" && item.dueLabel.includes("overdue")) ||
          (activeTab === "Completed" && item.status === "Completed");

        return matchesSearch && matchesSource && matchesPriority && matchesWeekDate && matchesTab;
      })
      .sort((firstItem, secondItem) => firstItem.dueSort.localeCompare(secondItem.dueSort));
  }, [activeTab, priority, search, selectedWeekDate, source]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pageItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [activeTab, priority, search, selectedWeekDate, source]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <Box minW={0}>
      <ActionControls
        activeTab={activeTab}
        priority={priority}
        search={search}
        source={source}
        viewMode={viewMode}
        onActiveTabChange={setActiveTab}
        onPriorityChange={setPriority}
        onSearchChange={setSearch}
        onSourceChange={setSource}
        onViewModeChange={setViewMode}
      />

      {viewMode === "Timeline" ? (
        <ActionTimeline
          currentPage={currentPage}
          expandedId={expandedId}
          items={pageItems}
          pageSize={pageSize}
          totalItems={filteredItems.length}
          totalPages={totalPages}
          onExpandedIdChange={setExpandedId}
          onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
        />
      ) : (
        <VStack align="center" justify="center" minH="420px" mt="18px" border="1px solid" borderColor={colors.lightBorder} borderRadius="10px" bg={colors.surface}>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
            Overview mode uses the same local action data.
          </Text>
        </VStack>
      )}
    </Box>
  );
}
