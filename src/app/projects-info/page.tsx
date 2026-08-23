import type { Metadata } from "next";
import { ProjectsInfoPage } from "@/components/projects-info/ProjectsInfoPage";

export const metadata: Metadata = {
  title: "Projects Info",
  description: "Project portfolio overview and project details",
};

export default function ProjectsInfoRoute() {
  return <ProjectsInfoPage />;
}
