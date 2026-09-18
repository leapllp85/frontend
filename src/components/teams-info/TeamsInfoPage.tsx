"use client";

import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { TeamHealthSummary } from "./TeamHealthSummary";
import { TeamMemberHighlights } from "./TeamMemberHighlights";
import { TeamsInfoHeader } from "./TeamsInfoHeader";

export function TeamsInfoPage() {
  return (
    <TopNavLayout>
      <TeamsInfoHeader />
      <TeamHealthSummary />
      <TeamMemberHighlights />
    </TopNavLayout>
  );
}
