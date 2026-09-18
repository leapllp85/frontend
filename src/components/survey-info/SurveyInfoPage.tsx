"use client";

import { Grid, VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { FeedbackMattersCard } from "./FeedbackMattersCard";
import { PendingSurveyList } from "./PendingSurveyList";
import { ResumeSurveyCard } from "./ResumeSurveyCard";
import { SurveyInfoHeader } from "./SurveyInfoHeader";
import { SurveyStatsStrip } from "./SurveyStatsStrip";

export function SurveyInfoPage() {
  return (
    <TopNavLayout>
      <VStack align="stretch" gap={{ base: "18px", md: "22px" }}>
        <SurveyInfoHeader />
        <SurveyStatsStrip />

        <Grid
          templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 392px" }}
          gap={{ base: "18px", xl: "22px" }}
          alignItems="start"
        >
          <PendingSurveyList />

          <VStack align="stretch" gap={{ base: "18px", md: "20px" }}>
            <ResumeSurveyCard />
            <FeedbackMattersCard />
          </VStack>
        </Grid>
      </VStack>
    </TopNavLayout>
  );
}
