import type { Metadata } from "next";
import { TalentManagementPage } from "@/components/talent-management/TalentManagementPage";

export const metadata: Metadata = {
  title: "Talent Management",
  description: "Talent capacity and assignment overview",
};

export default function TalentManagementRoute() {
  return <TalentManagementPage />;
}
