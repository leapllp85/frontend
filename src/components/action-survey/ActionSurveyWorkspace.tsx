"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { BarChart3, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, MessageSquare, MoreHorizontal, Plus, Search, Target } from "lucide-react";
import { colors } from "@/types/styles";
import {
  actionSurveyTabs,
  pageSizeOptions,
  sortOptions,
  statusOptions,
  surveyTemplates,
  type ActionSurveyTab,
  type SurveyTemplate,
  type SurveyTemplateStatus,
  type SurveyTemplateType,
  typeOptions,
} from "./actionSurveyData";
import { statusStyles, SurveyPanel, typeStyles } from "./ActionSurveyShared";
import { ActionSurveyItemsTab } from "./ActionSurveyItemsTab";
import { SurveyResponsesTab } from "./SurveyResponsesTab";

const tabIcons: Record<ActionSurveyTab, typeof BarChart3> = {
  "Survey Templates": BarChart3,
  "Survey Responses": MessageSquare,
  "Action Items": Target,
};

type StatusFilter = (typeof statusOptions)[number];
type TypeFilter = (typeof typeOptions)[number];
type SortOption = (typeof sortOptions)[number];
type PageSizeOption = (typeof pageSizeOptions)[number];

const pageSizeByOption: Record<PageSizeOption, number> = {
  "8 per page": 7,
  "12 per page": 11,
};

function getUpdatedTime(template: SurveyTemplate) {
  const match = template.updatedLabel.match(/(?:Updated|Closed) ([A-Za-z]{3}) (\d{2}), (\d{4})/);
  if (!match) return 0;
  return new Date(`${match[1]} ${match[2]}, ${match[3]}`).getTime();
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <Box position="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        style={{
          height: "42px",
          minWidth: "138px",
          border: `1px solid ${colors.border}`,
          borderRadius: "6px",
          background: colors.surface,
          color: colors.primaryText,
          fontSize: "12px",
          fontWeight: 800,
          padding: "0 36px 0 14px",
          appearance: "none",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <Box position="absolute" right="12px" top="13px" pointerEvents="none" color={colors.secondaryText}>
        <ChevronDown size={15} />
      </Box>
    </Box>
  );
}

function SurveyTemplateCard({ template }: { template: SurveyTemplate }) {
  const Icon = template.icon;
  const statusStyle = statusStyles[template.status];
  const typeStyle = typeStyles[template.type];

  return (
    <VStack align="stretch" justify="space-between" minH="238px" p="16px" border="1px solid" borderColor={colors.lightBorder} borderRadius="10px" bg={colors.surface} gap="18px">
      <VStack align="stretch" gap="16px">
        <HStack justify="space-between" align="flex-start" gap="12px">
          <HStack gap="12px" minW={0}>
            <Box w="32px" h="32px" borderRadius="9px" bg={typeStyle.bg} color={typeStyle.color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
              <Icon size={16} strokeWidth={2.2} />
            </Box>
            <Text color={typeStyle.color} fontSize="12px" fontWeight="800">{template.type}</Text>
          </HStack>
          <HStack gap="6px" bg={statusStyle.bg} color={statusStyle.color} px="10px" py="6px" borderRadius="7px">
            {statusStyle.dot && <Box w="7px" h="7px" borderRadius="full" bg={statusStyle.dot} />}
            <Text fontSize="11px" fontWeight="800" lineHeight="1">{template.status}</Text>
          </HStack>
        </HStack>

        <VStack align="stretch" gap="8px">
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.25">
            {template.title}
          </Text>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.5">
            {template.description}
          </Text>
        </VStack>
      </VStack>

      <VStack align="stretch" gap="12px">
        {template.published ? (
          <Grid templateColumns="1fr 1fr" gap="0" alignItems="center">
            <VStack align="flex-start" gap="2px">
              <Text color={colors.primaryText} fontSize="15px" fontWeight="800">{template.responses}</Text>
              <Text color={colors.secondaryText} fontSize="11px" fontWeight="700">Responses</Text>
            </VStack>
            <VStack align="flex-start" gap="2px" borderLeft="1px solid" borderColor={colors.lightBorder} pl="18px">
              <Text color={colors.primaryText} fontSize="15px" fontWeight="800">{template.responseRate}%</Text>
              <Text color={colors.secondaryText} fontSize="11px" fontWeight="700">Response rate</Text>
            </VStack>
          </Grid>
        ) : (
          <Text color="#F97316" fontSize="12px" fontWeight="800">Not published</Text>
        )}

        <HStack justify="space-between" pt="12px" borderTop="1px solid" borderColor={colors.lightBorder} gap="10px">
          <HStack gap="8px" minW={0}>
            <CalendarDays size={14} color={colors.secondaryText} />
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" lineClamp={1}>{template.updatedLabel}</Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="800">•</Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" whiteSpace="nowrap">{template.questionCount} questions</Text>
          </HStack>
          <MoreHorizontal size={17} color={colors.primaryText} />
        </HStack>
      </VStack>
    </VStack>
  );
}

function CreateSurveyCard() {
  return (
    <VStack minH="238px" justify="center" gap="14px" border="1px dashed" borderColor="#AFCFFF" borderRadius="10px" bg="#FCFDFF" color={colors.primary} p="18px">
      <Box w="54px" h="54px" borderRadius="full" bg={colors.primarySoft} border="1px solid #C8DDFA" display="flex" alignItems="center" justifyContent="center">
        <Plus size={24} strokeWidth={2.1} />
      </Box>
      <Text color={colors.primary} fontSize="15px" fontWeight="800">Create new survey</Text>
      <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" textAlign="center" lineHeight="1.45">
        Start from scratch or use a previous template
      </Text>
    </VStack>
  );
}

function WorkspaceTabs({ activeTab, onActiveTabChange }: { activeTab: ActionSurveyTab; onActiveTabChange: (tab: ActionSurveyTab) => void }) {
  return (
    <HStack gap="0" h="48px" overflowX="auto" borderBottom="1px solid" borderColor={colors.lightBorder}>
      {actionSurveyTabs.map((tab) => {
        const Icon = tabIcons[tab.label];
        const isActive = activeTab === tab.label;

        return (
          <HStack as="button" key={tab.label} h="full" minW={{ base: "190px", md: "220px" }} px="24px" borderRight="1px solid" borderColor={colors.lightBorder} borderBottom="2px solid" borderBottomColor={isActive ? colors.primary : "transparent"} color={isActive ? colors.primary : colors.secondaryText} bg="transparent" gap="10px" flexShrink={0} cursor="pointer" onClick={() => onActiveTabChange(tab.label)}>
            <Icon size={17} strokeWidth={2.1} />
            <Text fontSize="13px" fontWeight="800">{tab.label}</Text>
            <Text bg={isActive ? colors.primary : "#12213A"} color={colors.surface} px="8px" py="3px" borderRadius="8px" fontSize="11px" fontWeight="800" lineHeight="1">{tab.count}</Text>
          </HStack>
        );
      })}
    </HStack>
  );
}

function TemplateControls({
  search,
  status,
  type,
  sort,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
}: {
  search: string;
  status: StatusFilter;
  type: TypeFilter;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onTypeChange: (value: TypeFilter) => void;
  onSortChange: (value: SortOption) => void;
}) {
  return (
    <HStack justify="space-between" gap="14px" flexWrap="wrap" px="16px" py="18px">
      <HStack gap="12px" flex="1" minW={{ base: "full", xl: "0" }} flexWrap="wrap">
        <HStack h="42px" w={{ base: "full", md: "420px" }} px="12px" border="1px solid" borderColor={colors.border} borderRadius="6px" bg={colors.surface}>
          <Search size={16} color={colors.secondaryText} />
          <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search templates by title or description..." border="0" p="0" h="full" color={colors.primaryText} fontSize="12px" _focus={{ boxShadow: "none" }} _placeholder={{ color: colors.mutedText }} />
        </HStack>
        <SelectControl label="Status" value={status} options={statusOptions} onChange={onStatusChange} />
        <SelectControl label="Type" value={type} options={typeOptions} onChange={onTypeChange} />
        <SelectControl label="Sort" value={sort} options={sortOptions} onChange={onSortChange} />
      </HStack>
      <Button h="42px" px="20px" bg={colors.primary} color={colors.surface} borderRadius="6px" fontSize="13px" fontWeight="800" _hover={{ bg: "#1668BA" }}>
        <HStack gap="9px">
          <Plus size={17} strokeWidth={2.3} />
          <Text>Create Survey</Text>
        </HStack>
      </Button>
    </HStack>
  );
}

function PaginationBar({
  currentPage,
  pageSizeOption,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeOptionChange,
}: {
  currentPage: number;
  pageSizeOption: PageSizeOption;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeOptionChange: (value: PageSizeOption) => void;
}) {
  const pageSize = pageSizeByOption[pageSizeOption];
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <HStack justify="space-between" px="16px" py="18px" flexWrap="wrap" gap="12px">
      <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">Showing {startItem}-{endItem} of {totalItems} templates</Text>
      <HStack gap="10px">
        <Button h="34px" minW="34px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} color={colors.mutedText} disabled={currentPage === 1} _disabled={{ opacity: 0.45, cursor: "not-allowed" }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft size={15} />
        </Button>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;

          return (
          <Button key={page} h="34px" minW="34px" px="0" bg={isActive ? colors.primary : colors.surface} border="1px solid" borderColor={isActive ? colors.primary : colors.border} color={isActive ? colors.surface : colors.primaryText} fontSize="12px" fontWeight="800" _hover={{ bg: isActive ? colors.primary : "#F8FAFD" }} onClick={() => onPageChange(page)}>
            {page}
          </Button>
          );
        })}
        <Button h="34px" minW="34px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} color={colors.primaryText} disabled={currentPage === totalPages} _disabled={{ opacity: 0.45, cursor: "not-allowed" }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight size={15} />
        </Button>
      </HStack>
      <SelectControl label="Templates per page" value={pageSizeOption} options={pageSizeOptions} onChange={onPageSizeOptionChange} />
    </HStack>
  );
}

export function ActionSurveyWorkspace() {
  const [activeTab, setActiveTab] = useState<ActionSurveyTab>("Survey Templates");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [type, setType] = useState<TypeFilter>("All Type");
  const [sort, setSort] = useState<SortOption>("Recently updated");
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>("8 per page");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return surveyTemplates
      .filter((template) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          template.title.toLowerCase().includes(normalizedSearch) ||
          template.description.toLowerCase().includes(normalizedSearch);
        const matchesStatus = status === "All Status" || template.status === status;
        const matchesType = type === "All Type" || template.type === type;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((first, second) => {
        if (sort === "Response rate") return (second.responseRate ?? -1) - (first.responseRate ?? -1);
        if (sort === "Most responses") return (second.responses ?? -1) - (first.responses ?? -1);
        return getUpdatedTime(second) - getUpdatedTime(first);
      });
  }, [search, sort, status, type]);

  const pageSize = pageSizeByOption[pageSizeOption];
  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / pageSize));
  const pageTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, pageSizeOption, search, sort, status, type]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <SurveyPanel>
      <WorkspaceTabs activeTab={activeTab} onActiveTabChange={setActiveTab} />
      {activeTab === "Survey Templates" ? (
        <>
          <TemplateControls search={search} status={status} type={type} sort={sort} onSearchChange={setSearch} onStatusChange={setStatus} onTypeChange={setType} onSortChange={setSort} />
          <Grid px="16px" templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }} gap="14px">
            {pageTemplates.map((template) => (
              <SurveyTemplateCard key={template.id} template={template} />
            ))}
            {currentPage === 1 && <CreateSurveyCard />}
          </Grid>
          {filteredTemplates.length === 0 && (
            <VStack minH="180px" justify="center" px="16px">
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">No survey templates match the current filters.</Text>
            </VStack>
          )}
          <PaginationBar currentPage={currentPage} pageSizeOption={pageSizeOption} totalItems={filteredTemplates.length} totalPages={totalPages} onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))} onPageSizeOptionChange={setPageSizeOption} />
        </>
      ) : activeTab === "Survey Responses" ? (
        <SurveyResponsesTab />
      ) : (
        <ActionSurveyItemsTab />
      )}
    </SurveyPanel>
  );
}
