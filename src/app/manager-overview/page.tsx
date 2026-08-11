import type { Metadata } from "next";
import { ManagerOverviewDashboard } from "@/components/manager-overview/ManagerOverviewDashboard";

export const metadata: Metadata = {
  title: "Manager Overview",
  description: "Manager attribution overview dashboard",
};

export default function ManagerOverviewPage() {
  return <ManagerOverviewDashboard />;
}
