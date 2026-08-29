"use client";

import { useState } from "react";
import { Grid, VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { ActionItemHeader } from "./ActionItemHeader";
import { ActionItemWorkspace } from "./ActionItemWorkspace";
import { ActionMetricsStrip } from "./ActionMetricsStrip";
import { ActionSidebar } from "./ActionSidebar";

export function ActionItemPage() {
  const [selectedWeekDate, setSelectedWeekDate] = useState<string | null>(null);

  return (
    <TopNavLayout>
      <VStack align="stretch" gap={{ base: "18px", md: "22px" }}>
        <ActionItemHeader />
        <ActionMetricsStrip />

        <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 402px" }} gap={{ base: "18px", xl: "22px" }} alignItems="start">
          <ActionItemWorkspace selectedWeekDate={selectedWeekDate} />
          <ActionSidebar selectedWeekDate={selectedWeekDate} onSelectedWeekDateChange={setSelectedWeekDate} />
        </Grid>
      </VStack>
    </TopNavLayout>
  );
}
