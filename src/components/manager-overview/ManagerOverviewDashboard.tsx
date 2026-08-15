"use client";

import { ManagerOnly } from "@/components/RoleGuard";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { AnalyticsSection } from "./AnalyticsSection";
import { DetailsSection } from "./DetailsSection";
import { InsightBanner } from "./InsightBanner";
import { ManagerOverviewPageHeader } from "./ManagerOverviewPageHeader";
import { SummaryMetrics } from "./SummaryMetrics";

// TEMP: keep the prototype visible while auth is bypassed for /manager-overview.
// Set this to false or remove it when the dashboard should require manager auth again.
const temporaryAuthBypass = true;

export function ManagerOverviewDashboard() {
  const dashboardShell = (
    <TopNavLayout>
      <ManagerOverviewPageHeader />
      <SummaryMetrics />
      <AnalyticsSection />
      <DetailsSection />
      <InsightBanner />
    </TopNavLayout>
  );

  if (temporaryAuthBypass) {
    return dashboardShell;
  }

  return <ManagerOnly>{dashboardShell}</ManagerOnly>;
}
