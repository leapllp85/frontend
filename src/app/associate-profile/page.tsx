import type { Metadata } from "next";
import { AssociateProfilePage } from "@/components/associate-profile/AssociateProfilePage";

export const metadata: Metadata = {
  title: "Associate Profile",
  description: "Associate workspace, career progress, projects, learning, and updates",
};

export default function AssociateProfileRoute() {
  return <AssociateProfilePage />;
}
