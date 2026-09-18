"use client";

import { useMemo, useState } from "react";
import { Grid, VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { Toaster, toaster } from "@/components/ui/toaster";
import { ActionItemHeader } from "./ActionItemHeader";
import { ActionItemWorkspace } from "./ActionItemWorkspace";
import { ActionMetricsStrip } from "./ActionMetricsStrip";
import { ActionSidebar } from "./ActionSidebar";
import { CreateActionPlanModal } from "./CreateActionPlanModal";
import {
  addDays,
  buildActionItemMetrics,
  buildActionTimelineItems,
  buildSourceSegments,
  buildWeekDays,
  formatWeekRangeLabel,
  getStartOfWeek,
  timelineItems,
  toIsoDate,
  type ActionItemApiEntry,
} from "./actionItemData";

export function ActionItemPage() {
  const [selectedWeekDate, setSelectedWeekDate] = useState<string | null>(null);
  const [visibleWeekStart, setVisibleWeekStart] = useState(() => toIsoDate(getStartOfWeek(new Date())));
  const [items, setItems] = useState<ActionItemApiEntry[]>(() => [...timelineItems]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const timelineEntries = useMemo(() => buildActionTimelineItems(items), [items]);
  const metrics = useMemo(() => buildActionItemMetrics(items), [items]);
  const weekDays = useMemo(() => buildWeekDays(items, visibleWeekStart), [items, visibleWeekStart]);
  const weekRangeLabel = useMemo(() => formatWeekRangeLabel(visibleWeekStart), [visibleWeekStart]);
  const sourceSegments = useMemo(() => buildSourceSegments(items), [items]);

  const handleCreateActionPlan = (actionItem: ActionItemApiEntry) => {
    setItems((currentItems) => [actionItem, ...currentItems]);
    setIsCreateModalOpen(false);
    toaster.success({
      title: "Action plan added successfully",
      description: `${actionItem.title} has been added to your timeline.`,
      duration: 3000,
    });
  };

  return (
    <TopNavLayout>
      <Toaster />
      <CreateActionPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateActionPlan}
      />
      <VStack align="stretch" gap={{ base: "18px", md: "22px" }}>
        <ActionItemHeader onCreateActionPlan={() => setIsCreateModalOpen(true)} />
        <ActionMetricsStrip metrics={metrics} />

        <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 402px" }} gap={{ base: "18px", xl: "22px" }} alignItems="start">
          <ActionItemWorkspace items={timelineEntries} selectedWeekDate={selectedWeekDate} />
          <ActionSidebar
            weekDays={weekDays}
            weekRangeLabel={weekRangeLabel}
            sourceSegments={sourceSegments}
            selectedWeekDate={selectedWeekDate}
            onSelectedWeekDateChange={setSelectedWeekDate}
            onPreviousWeek={() => {
              setSelectedWeekDate(null);
              setVisibleWeekStart((currentWeekStart) => toIsoDate(addDays(currentWeekStart, -7)));
            }}
            onNextWeek={() => {
              setSelectedWeekDate(null);
              setVisibleWeekStart((currentWeekStart) => toIsoDate(addDays(currentWeekStart, 7)));
            }}
            onCreateActionPlan={() => setIsCreateModalOpen(true)}
          />
        </Grid>
      </VStack>
    </TopNavLayout>
  );
}
