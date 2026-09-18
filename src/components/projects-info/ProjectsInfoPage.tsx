"use client";

import { VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { ProjectPulseBanner } from "./ProjectPulseBanner";
import { ProjectsWorkspace } from "./ProjectsWorkspace";

export function ProjectsInfoPage() {
  return (
    <TopNavLayout>
      <VStack align="stretch" gap={{ base: "22px", md: "24px" }}>
        <ProjectPulseBanner />
        <ProjectsWorkspace />
      </VStack>
    </TopNavLayout>
  );
}
