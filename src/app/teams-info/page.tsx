import type { Metadata } from "next";
import { TeamsInfoPage } from "@/components/teams-info/TeamsInfoPage";

export const metadata: Metadata = {
  title: "Teams Info",
  description: "Team health and engagement overview",
};

export default function TeamsInfoRoute() {
  return <TeamsInfoPage />;
}
