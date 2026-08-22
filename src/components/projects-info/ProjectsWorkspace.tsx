"use client";

import { useEffect, useMemo, useState } from "react";
import { Grid } from "@chakra-ui/react";
import { ProjectDetailsPanel } from "./ProjectDetailsPanel";
import {
  ProjectsListPanel,
  type BusinessUnitFilter,
  type CriticalityFilter,
  type StatusFilter,
} from "./ProjectsListPanel";
import { projectsInfoList, type ProjectInfo } from "./projectsInfoData";

const pageSize = 8;

export function ProjectsWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<BusinessUnitFilter>("All");
  const [criticalityFilter, setCriticalityFilter] = useState<CriticalityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectsInfoList[0].id);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projectsInfoList.filter((project) => {
      const matchesBusinessUnit =
        businessUnitFilter === "All" || project.businessUnit === businessUnitFilter;
      const matchesCriticality =
        criticalityFilter === "All" || project.criticality === criticalityFilter;
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.projectId.toLowerCase().includes(normalizedQuery) ||
        project.businessUnit.toLowerCase().includes(normalizedQuery) ||
        project.contributors.some((contributor) =>
          contributor.name.toLowerCase().includes(normalizedQuery),
        );

      return matchesBusinessUnit && matchesCriticality && matchesStatus && matchesSearch;
    });
  }, [businessUnitFilter, criticalityFilter, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [currentPage, filteredProjects]);

  const selectedProject =
    projectsInfoList.find((project) => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    setCurrentPage(1);
  }, [businessUnitFilter, criticalityFilter, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  function handleProjectSelect(project: ProjectInfo) {
    setSelectedProjectId(project.id);
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        xl: selectedProject ? "minmax(0, 1fr) 390px" : "1fr",
        "2xl": selectedProject ? "minmax(0, 1fr) 410px" : "1fr",
      }}
      gap={{ base: "18px", xl: "18px" }}
      alignItems="start"
      minW={0}
    >
      <ProjectsListPanel
        businessUnitFilter={businessUnitFilter}
        criticalityFilter={criticalityFilter}
        currentPage={currentPage}
        filteredCount={filteredProjects.length}
        isDetailsOpen={Boolean(selectedProject)}
        pageSize={pageSize}
        projects={paginatedProjects}
        searchQuery={searchQuery}
        selectedProjectId={selectedProjectId ?? ""}
        statusFilter={statusFilter}
        totalProjects={filteredProjects.length}
        totalPages={totalPages}
        onBusinessUnitChange={setBusinessUnitFilter}
        onCriticalityChange={setCriticalityFilter}
        onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
        onProjectSelect={handleProjectSelect}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />

      {selectedProject && (
        <ProjectDetailsPanel
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </Grid>
  );
}
