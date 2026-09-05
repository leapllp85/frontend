"use client";

import { VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { ActionSurveyHeader } from "./ActionSurveyHeader";
import { ActionSurveyMetrics } from "./ActionSurveyMetrics";
import { ActionSurveyWorkspace } from "./ActionSurveyWorkspace";

export function ActionSurveyPage() {
  return (
    <TopNavLayout>
      <VStack align="stretch" gap={{ base: "18px", md: "22px" }}>
        <ActionSurveyHeader />
        <ActionSurveyMetrics />
        <ActionSurveyWorkspace />
      </VStack>
    </TopNavLayout>
  );
}
