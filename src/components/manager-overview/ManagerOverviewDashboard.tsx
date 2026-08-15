"use client";

import { Box } from "@chakra-ui/react";
import { ManagerOnly } from "@/components/RoleGuard";
import { AnalyticsSection } from "./AnalyticsSection";
import { DetailsSection } from "./DetailsSection";
import { InsightBanner } from "./InsightBanner";
import { ManagerOverviewPageHeader } from "./ManagerOverviewPageHeader";
import { SummaryMetrics } from "./SummaryMetrics";
import { colors } from "../../types/styles";
import { TopNavbar } from "../topnavbar/TopNavbar";

// TEMP: keep the prototype visible while auth is bypassed for /manager-overview.
// Set this to false or remove it when the dashboard should require manager auth again.
const temporaryAuthBypass = true;

export function ManagerOverviewDashboard() {
  const dashboardShell = (
    <Box
      minH="100vh"
      bg={colors.background}
      color={colors.primaryText}
      fontFamily="Arial, Helvetica, sans-serif"
    >
      <TopNavbar />

      <Box
        as="main"
        px={{ base: "16px", md: "28px", xl: "46px" }}
        pt={{ base: "28px", md: "34px", xl: "36px" }}
        pb={{ base: "40px", md: "48px" }}
      >
        <ManagerOverviewPageHeader />
        <SummaryMetrics />
        <AnalyticsSection />
        <DetailsSection />
        <InsightBanner />
      </Box>
    </Box>
  );

  if (temporaryAuthBypass) {
    return dashboardShell;
  }

  return <ManagerOnly>{dashboardShell}</ManagerOnly>;
}
