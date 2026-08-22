import type { Metadata } from "next";
import { OrganizationInfoPage } from "@/components/organization-info/OrganizationInfoPage";

export const metadata: Metadata = {
  title: "Organization Info",
  description: "Organization structure and reporting overview",
};

export default function OrganizationInfoRoute() {
  return <OrganizationInfoPage />;
}
