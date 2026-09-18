"use client";

import { useEffect, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { ManagerOnly } from "@/components/RoleGuard";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRole } from "@/utils/rbac";
import { AnalyticsSection } from "./AnalyticsSection";
import { DetailsSection } from "./DetailsSection";
import { InsightBanner } from "./InsightBanner";
import { ManagerOverviewPageHeader } from "./ManagerOverviewPageHeader";
import { SummaryMetrics } from "./SummaryMetrics";

const ManagerWellnessDashboard = dynamic(() => import("@/components/common/ManagerWellnessDashboard").then((mod) => ({ default: mod.ManagerWellnessDashboard })), {
  loading: () => <Box p={4}><Spinner size="lg" /></Box>,
  ssr: false,
});

// TEMP: keep the prototype visible while auth is bypassed for /manager-overview.
// Set this to false or remove it when the dashboard should require manager auth again.
const temporaryAuthBypass = true;

export function ManagerOverviewDashboard() {
  const { user, isLoading } = useAuth();
  const [showWellnessDashboard, setShowWellnessDashboard] = useState(false);

  useEffect(() => {
    if (isLoading || !user || getUserRole(user) !== "Manager") {
      return;
    }

    const hasSeenDashboardToday = localStorage.getItem("managerWellnessDashboardShown");
    const today = new Date().toDateString();

    if (hasSeenDashboardToday !== today) {
      const timer = window.setTimeout(() => {
        setShowWellnessDashboard(true);
      }, 500);

      return () => window.clearTimeout(timer);
    }
  }, [isLoading, user]);

  const dashboardShell = (
    <>
      <TopNavLayout>
        <ManagerOverviewPageHeader />
        <SummaryMetrics />
        <AnalyticsSection />
        <DetailsSection />
        <InsightBanner />
      </TopNavLayout>

      <ManagerWellnessDashboard
        isOpen={showWellnessDashboard}
        onClose={() => {
          setShowWellnessDashboard(false);
          localStorage.setItem("managerWellnessDashboardShown", new Date().toDateString());
        }}
      />
    </>
  );

  if (temporaryAuthBypass) {
    return dashboardShell;
  }

  return <ManagerOnly>{dashboardShell}</ManagerOnly>;
}
