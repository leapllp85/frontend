"use client";

import type { CSSProperties } from "react";
import { Box, Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as RowChevronRight,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import {
  businessUnitOptions,
  criticalityOptions,
  projectCriticalityStyles,
  projectStatusStyles,
  statusOptions,
  type ProjectBusinessUnit,
  type ProjectCriticality,
  type ProjectInfo,
  type ProjectStatus,
} from "./projectsInfoData";
import { colors } from "@/types/styles";

export type BusinessUnitFilter = "All" | ProjectBusinessUnit;
export type CriticalityFilter = "All" | ProjectCriticality;
export type StatusFilter = "All" | ProjectStatus;

type ProjectsListPanelProps = {
  businessUnitFilter: BusinessUnitFilter;
  criticalityFilter: CriticalityFilter;
  currentPage: number;
  filteredCount: number;
  pageSize: number;
  projects: readonly ProjectInfo[];
  isDetailsOpen: boolean;
  searchQuery: string;
  selectedProjectId: string;
  statusFilter: StatusFilter;
  totalProjects: number;
  totalPages: number;
  onBusinessUnitChange: (value: BusinessUnitFilter) => void;
  onCriticalityChange: (value: CriticalityFilter) => void;
  onPageChange: (page: number) => void;
  onProjectSelect: (project: ProjectInfo) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
};

const tableLayouts = {
  compact: {
    columns: "minmax(290px, 1.15fr) minmax(260px, 0.9fr) 104px 86px 24px",
    columnGap: "16px",
    minWidth: "860px",
    timelineGap: "16px",
  },
  expanded: {
    columns: "minmax(360px, 430px) minmax(460px, 1fr) 124px 104px 24px",
    columnGap: "24px",
    minWidth: "1120px",
    timelineGap: "24px",
  },
} as const;

type ProjectTableLayout = (typeof tableLayouts)[keyof typeof tableLayouts];

const selectStyle: CSSProperties = {
  appearance: "none",
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: "6px",
  color: colors.primaryText,
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 700,
  height: "44px",
  lineHeight: "1.1",
  padding: "18px 38px 6px 14px",
  width: "100%",
};

function ProjectBadge({
  label,
  style,
}: {
  label: string;
  style: { color: string; bg: string };
}) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      justifySelf="start"
      w="fit-content"
      minW="58px"
      h="23px"
      px="10px"
      borderRadius="5px"
      bg={style.bg}
      color={style.color}
      fontSize="11px"
      fontWeight="700"
      lineHeight="1"
      whiteSpace="nowrap"
    >
      {label}
    </Box>
  );
}

function ProjectFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <Box position="relative" w={{ base: "full", md: "168px", "2xl": "180px" }} flexShrink={0}>
      <Text
        position="absolute"
        top="8px"
        left="14px"
        color={colors.mutedText}
        fontSize="11px"
        fontWeight="600"
        lineHeight="1"
        pointerEvents="none"
        zIndex={1}
      >
        {label}
      </Text>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={selectStyle}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Box
        position="absolute"
        right="13px"
        top="50%"
        transform="translateY(-50%)"
        pointerEvents="none"
        color={colors.secondaryText}
      >
        <ChevronDown size={15} />
      </Box>
    </Box>
  );
}

function ProjectIcon({ project }: { project: ProjectInfo }) {
  const Icon = project.icon;

  return (
    <Box
      w="44px"
      h="44px"
      borderRadius="8px"
      bg={project.iconBg}
      color={project.iconColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Icon size={21} strokeWidth={2.1} />
    </Box>
  );
}

function ProjectRow({
  project,
  isSelected,
  layout,
  onSelect,
}: {
  project: ProjectInfo;
  isSelected: boolean;
  layout: ProjectTableLayout;
  onSelect: (project: ProjectInfo) => void;
}) {
  return (
    <Box
      as="button"
      w="full"
      minW={layout.minWidth}
      bg={isSelected ? "#FBFDFF" : colors.surface}
      border="0"
      borderLeft="3px solid"
      borderLeftColor={isSelected ? colors.primary : "transparent"}
      borderBottom="1px solid"
      borderBottomColor={colors.lightBorder}
      cursor="pointer"
      textAlign="left"
      _hover={{ bg: "#FBFDFF" }}
      onClick={() => onSelect(project)}
    >
      <Box
        display="grid"
        gridTemplateColumns={layout.columns}
        columnGap={layout.columnGap}
        alignItems="center"
        minH="67px"
        px={{ base: "12px", xl: "16px" }}
        py="9px"
      >
        <HStack gap="14px" minW={0}>
          <ProjectIcon project={project} />
          <VStack align="flex-start" gap="6px" minW={0}>
            <Text
              color={isSelected ? colors.primary : colors.primaryText}
              fontSize="13px"
              fontWeight="800"
              lineHeight="1.15"
              truncate
            >
              {project.name}
            </Text>
            <HStack gap="8px" color={colors.secondaryText} minW={0}>
              <Text fontSize="12px" fontWeight="600" lineHeight="1" truncate>
                {project.businessUnit}
              </Text>
              <Box w="3px" h="3px" borderRadius="full" bg={colors.mutedText} flexShrink={0} />
              <Text fontSize="12px" fontWeight="600" lineHeight="1" whiteSpace="nowrap">
                {project.memberCount} members
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <VStack align="stretch" gap="9px" minW={0} pr="8px">
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            columnGap={layout.timelineGap}
            minW={0}
          >
            <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" whiteSpace="nowrap" truncate>
              {project.startDate}
            </Text>
            <Text
              color={colors.secondaryText}
              fontSize="12px"
              fontWeight="600"
              whiteSpace="nowrap"
              textAlign="right"
              truncate
            >
              {project.goLiveDate}
            </Text>
          </Box>
          <HStack gap="9px">
            <Box h="4px" flex="1" bg={colors.lightBorder} borderRadius="999px" overflow="hidden">
              <Box
                h="full"
                w={`${project.progress}%`}
                bg={colors.primary}
                borderRadius="999px"
              />
            </Box>
            <Text
              minW="34px"
              color={colors.secondaryText}
              fontSize="12px"
              fontWeight="700"
              textAlign="right"
            >
              {project.progress}%
            </Text>
          </HStack>
        </VStack>

        <ProjectBadge
          label={project.criticality}
          style={projectCriticalityStyles[project.criticality]}
        />

        <ProjectBadge label={project.status} style={projectStatusStyles[project.status]} />

        <HStack justify="flex-end">
          <RowChevronRight size={18} color={colors.secondaryText} />
        </HStack>
      </Box>
    </Box>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <HStack gap="9px">
      <Button
        h="32px"
        w="32px"
        minW="32px"
        p={0}
        borderRadius="6px"
        bg={colors.surface}
        border="1px solid"
        borderColor={colors.border}
        disabled={currentPage === 1}
        _hover={{ bg: "#F8FAFD" }}
        _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={15} color={colors.primaryText} />
      </Button>

      {pageNumbers.map((page) => {
        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            h="32px"
            w="32px"
            minW="32px"
            p={0}
            borderRadius="6px"
            bg={isActive ? colors.primary : colors.surface}
            color={isActive ? colors.surface : colors.primaryText}
            border="1px solid"
            borderColor={isActive ? colors.primary : colors.border}
            fontSize="12px"
            fontWeight="800"
            _hover={{ bg: isActive ? colors.primary : "#F8FAFD" }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        h="32px"
        w="32px"
        minW="32px"
        p={0}
        borderRadius="6px"
        bg={colors.surface}
        border="1px solid"
        borderColor={colors.border}
        disabled={currentPage === totalPages}
        _hover={{ bg: "#F8FAFD" }}
        _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={15} color={colors.primaryText} />
      </Button>
    </HStack>
  );
}

export function ProjectsListPanel({
  businessUnitFilter,
  criticalityFilter,
  currentPage,
  filteredCount,
  isDetailsOpen,
  pageSize,
  projects,
  searchQuery,
  selectedProjectId,
  statusFilter,
  totalProjects,
  totalPages,
  onBusinessUnitChange,
  onCriticalityChange,
  onPageChange,
  onProjectSelect,
  onSearchChange,
  onStatusChange,
}: ProjectsListPanelProps) {
  const resultStart = filteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const resultEnd = Math.min(currentPage * pageSize, filteredCount);
  const tableLayout = isDetailsOpen ? tableLayouts.compact : tableLayouts.expanded;

  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="12px"
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)"
      px={{ base: "16px", md: "22px", xl: "24px" }}
      py={{ base: "18px", md: "22px", xl: "24px" }}
      minW={0}
      overflow="hidden"
    >
      <VStack align="stretch" gap={{ base: "18px", xl: "20px" }}>
        <Flex justify="space-between" gap="16px" align="flex-start" wrap={{ base: "wrap", lg: "nowrap" }}>
          <VStack align="flex-start" gap="7px">
            <Text color={colors.primaryText} fontSize="19px" fontWeight="800" lineHeight="1">
              All Projects
            </Text>
            <Text color={colors.secondaryText} fontSize="13px" fontWeight="500" lineHeight="1.25">
              Track, manage and monitor all active initiatives across the organization.
            </Text>
          </VStack>

          <HStack gap="12px">
            <Button
              h="38px"
              px="18px"
              borderRadius="6px"
              bg={colors.primary}
              color={colors.surface}
              border="1px solid"
              borderColor={colors.primary}
              fontSize="13px"
              fontWeight="800"
              _hover={{ bg: "#176CC1" }}
            >
              <Plus size={16} />
              New Project
            </Button>
            <Button
              h="38px"
              w="38px"
              minW="38px"
              p={0}
              borderRadius="6px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              _hover={{ bg: "#F8FAFD" }}
            >
              <MoreHorizontal size={18} color={colors.primaryText} />
            </Button>
          </HStack>
        </Flex>

        <Flex justify="space-between" gap="16px" align="center" wrap={{ base: "wrap", xl: "nowrap" }}>
          <Box
            position="relative"
            w={{
              base: "full",
              xl: isDetailsOpen ? "410px" : "520px",
              "2xl": isDetailsOpen ? "460px" : "560px",
            }}
            maxW="100%"
          >
            <Box
              position="absolute"
              left="16px"
              top="50%"
              transform="translateY(-50%)"
              color={colors.secondaryText}
              zIndex={1}
            >
              <Search size={17} />
            </Box>
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search projects by name, team or keyword..."
              h="44px"
              pl="46px"
              pr="14px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="6px"
              color={colors.primaryText}
              fontSize="13px"
              fontWeight="600"
              _placeholder={{ color: colors.mutedText }}
              _focus={{ borderColor: colors.primaryLight, boxShadow: `0 0 0 1px ${colors.primaryLight}` }}
            />
          </Box>

          <HStack gap={{ base: "12px", xl: "14px" }} wrap={{ base: "wrap", md: "nowrap" }} w={{ base: "full", xl: "auto" }}>
            <ProjectFilterSelect
              label="Business Unit"
              value={businessUnitFilter}
              options={businessUnitOptions}
              onChange={(value) => onBusinessUnitChange(value as BusinessUnitFilter)}
            />
            <ProjectFilterSelect
              label="Criticality"
              value={criticalityFilter}
              options={criticalityOptions}
              onChange={(value) => onCriticalityChange(value as CriticalityFilter)}
            />
            <ProjectFilterSelect
              label="Status"
              value={statusFilter}
              options={statusOptions}
              onChange={(value) => onStatusChange(value as StatusFilter)}
            />
          </HStack>
        </Flex>

        <Box overflow="hidden">
          <Box overflowX="auto" overflowY="hidden">
            <Box
              display="grid"
              gridTemplateColumns={tableLayout.columns}
              columnGap={tableLayout.columnGap}
              minW={tableLayout.minWidth}
              px={{ base: "15px", xl: "19px" }}
              pb="12px"
              color={colors.secondaryText}
            >
              <Text fontSize="12px" fontWeight="700">
                Project
              </Text>
              <Text fontSize="12px" fontWeight="700">
                Timeline
              </Text>
              <Text fontSize="12px" fontWeight="700">
                Criticality
              </Text>
              <Text fontSize="12px" fontWeight="700">
                Status
              </Text>
              <Box />
            </Box>

            <Box border="1px solid" borderColor={colors.border} borderRadius="8px" overflow="hidden">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    isSelected={project.id === selectedProjectId}
                    layout={tableLayout}
                    onSelect={onProjectSelect}
                  />
                ))
              ) : (
                <Box
                  minW={tableLayout.minWidth}
                  h="180px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={colors.secondaryText}
                  fontSize="13px"
                  fontWeight="700"
                >
                  No projects found.
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Flex align="center" justify="space-between" gap="16px" wrap="wrap">
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600">
            Showing {resultStart} to {resultEnd} of {totalProjects} projects
          </Text>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </Flex>
      </VStack>
    </Box>
  );
}
