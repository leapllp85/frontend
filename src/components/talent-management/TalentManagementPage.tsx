"use client";

import { useState } from "react";
import { Grid, VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { TalentManagementHeader } from "./TalentManagementHeader";
import { TalentMetricStrip } from "./TalentMetricStrip";
import { TeamCapacityOverview } from "./TeamCapacityOverview";
import { TalentInsights } from "./TalentInsights";
import { SkillsInDemand } from "./SkillsInDemand";
import { TopAvailableTalent } from "./TopAvailableTalent";
import { TalentPoolTab } from "./TalentPoolTab";
import type { TalentManagementTabId } from "./talentManagementData";

export function TalentManagementPage() {
  const [activeTab, setActiveTab] = useState<TalentManagementTabId>("analytics");

  return (
    <TopNavLayout>
      <VStack align="stretch" gap={{ base: "18px", md: "22px" }}>
        <TalentManagementHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "analytics" ? (
          <>
            <TalentMetricStrip />

            <Grid
              templateColumns={{ base: "1fr", xl: "minmax(0, 1.72fr) minmax(360px, 0.98fr)" }}
              gap={{ base: "18px", xl: "20px" }}
              alignItems="stretch"
            >
              <TeamCapacityOverview />
              <TalentInsights />
            </Grid>

            <Grid
              templateColumns={{ base: "1fr", xl: "minmax(360px, 0.88fr) minmax(0, 1.12fr)" }}
              gap={{ base: "18px", xl: "20px" }}
              alignItems="stretch"
            >
              <SkillsInDemand />
              <TopAvailableTalent onViewAll={() => setActiveTab("pool")} />
            </Grid>
          </>
        ) : (
          <TalentPoolTab />
        )}
      </VStack>
    </TopNavLayout>
  );
}
