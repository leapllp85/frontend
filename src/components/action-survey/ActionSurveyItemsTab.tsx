"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, HStack, Input, Text, VStack } from "@chakra-ui/react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  MoreVertical,
  Search,
  Save,
} from "lucide-react";
import { colors } from "@/types/styles";
import {
  surveyActionItems,
  surveyActionPageSizeOptions,
  surveyActionPriorityOptions,
  surveyActionSortOptions,
  surveyActionSourceOptions,
  surveyActionStatusOptions,
  type SurveyActionItem,
  type SurveyActionPriority,
  type SurveyActionSource,
  type SurveyActionStatus,
} from "./actionSurveyData";
import { SurveyPanel, typeStyles } from "./ActionSurveyShared";

type StatusFilter = (typeof surveyActionStatusOptions)[number];
type PriorityFilter = (typeof surveyActionPriorityOptions)[number];
type SourceFilter = (typeof surveyActionSourceOptions)[number];
type SortOption = (typeof surveyActionSortOptions)[number];
type PageSizeOption = (typeof surveyActionPageSizeOptions)[number];

const pageSizeByOption: Record<PageSizeOption, number> = {
  "4 per page": 4,
  "8 per page": 8,
};

const priorityRank: Record<SurveyActionPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const priorityColors: Record<SurveyActionPriority, string> = {
  High: colors.danger,
  Medium: "#F97316",
  Low: colors.success,
};

const statusStyles: Record<SurveyActionStatus, { bg: string; color: string }> = {
  Pending: { bg: "#FFF3DE", color: "#F97316" },
  Completed: { bg: "#E8F8F0", color: colors.success },
};

function parseDueTime(item: SurveyActionItem) {
  return new Date(`${item.dueDate.replace(",", "")}`).getTime();
}

function isOverdue(item: SurveyActionItem) {
  return item.dueLabel.toLowerCase().includes("overdue");
}

function isDueThisWeek(item: SurveyActionItem) {
  const lower = item.dueLabel.toLowerCase();
  if (lower.includes("overdue")) return false;
  const match = lower.match(/in (\d+) days/);
  return lower.includes("today") || (match ? Number(match[1]) <= 7 : false);
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

function ActionControls({
  search,
  status,
  priority,
  source,
  sort,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSourceChange,
  onSortChange,
}: {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
  source: SourceFilter;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onSourceChange: (value: SourceFilter) => void;
  onSortChange: (value: SortOption) => void;
}) {
  return (
    <HStack justify="space-between" gap="14px" flexWrap="wrap">
      <HStack h="42px" flex="1" minW={{ base: "full", xl: "320px" }} px="12px" border="1px solid" borderColor={colors.border} borderRadius="6px" bg={colors.surface}>
        <Search size={16} color={colors.secondaryText} />
        <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search action items..." border="0" p="0" h="full" color={colors.primaryText} fontSize="12px" _focus={{ boxShadow: "none" }} _placeholder={{ color: colors.mutedText }} />
      </HStack>
      <SelectControl label="Action status" value={status} options={surveyActionStatusOptions} onChange={onStatusChange} />
      <SelectControl label="Action priority" value={priority} options={surveyActionPriorityOptions} onChange={onPriorityChange} />
      <SelectControl label="Action source" value={source} options={surveyActionSourceOptions} onChange={onSourceChange} />
      <SelectControl label="Action sort" value={sort} options={surveyActionSortOptions} onChange={onSortChange} />
      <Button h="42px" minW="42px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} color={colors.primaryText} _hover={{ bg: "#F8FAFD" }} aria-label="List settings">
        <ListFilter size={16} />
      </Button>
    </HStack>
  );
}

function ActionRow({
  item,
  isSelected,
  onSelect,
}: {
  item: SurveyActionItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;
  const sourceStyle = typeStyles[item.source];
  const statusStyle = statusStyles[item.status];
  const priorityColor = priorityColors[item.priority];

  return (
    <Grid
      as="button"
      templateColumns={{ base: "1fr", xl: "minmax(260px, 1fr) 110px 130px 150px 128px 26px" }}
      gap={{ base: "14px", xl: "18px" }}
      alignItems="center"
      w="full"
      px="18px"
      py="20px"
      bg={isSelected ? "#F8FBFF" : colors.surface}
      borderBottom="1px solid"
      borderColor={colors.lightBorder}
      textAlign="left"
      cursor="pointer"
      _last={{ borderBottom: "0" }}
      _hover={{ bg: "#F8FAFD" }}
      onClick={onSelect}
    >
      <HStack gap="18px" minW={0}>
        <Box w="52px" h="52px" borderRadius="12px" bg={sourceStyle.bg} color={sourceStyle.color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
          <Icon size={24} strokeWidth={2.1} />
        </Box>
        <VStack align="flex-start" gap="7px" minW={0}>
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.2">{item.title}</Text>
          <HStack gap="8px" color={colors.secondaryText} flexWrap="wrap">
            <Text color={sourceStyle.color} fontSize="12px" fontWeight="800">{item.source}</Text>
            <Text fontSize="12px" fontWeight="800">•</Text>
            <Text fontSize="12px" fontWeight="700">{item.sourceSurvey}</Text>
          </HStack>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.45">{item.description}</Text>
        </VStack>
      </HStack>

      <VStack align="flex-start" gap="8px">
        <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Priority</Text>
        <HStack gap="8px">
          <Box w="8px" h="8px" borderRadius="full" bg={priorityColor} />
          <Text color={colors.primaryText} fontSize="12px" fontWeight="700">{item.priority}</Text>
        </HStack>
      </VStack>

      <VStack align="flex-start" gap="7px">
        <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Due</Text>
        <HStack gap="8px">
          <CalendarDays size={15} color={colors.secondaryText} />
          <Text color={colors.primaryText} fontSize="12px" fontWeight="700">{item.dueDate}</Text>
        </HStack>
        <Text color={isOverdue(item) || item.priority === "High" ? colors.danger : colors.secondaryText} fontSize="11px" fontWeight="800">{item.dueLabel}</Text>
      </VStack>

      <VStack align="flex-start" gap="8px">
        <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Status</Text>
        <Text bg={statusStyle.bg} color={statusStyle.color} px="10px" py="6px" borderRadius="7px" fontSize="11px" fontWeight="800" lineHeight="1">{item.status}</Text>
      </VStack>

      <Button h="38px" px="18px" bg={colors.surface} border="1px solid" borderColor="#B9D6FA" color={colors.primary} borderRadius="6px" fontSize="12px" fontWeight="800" _hover={{ bg: colors.primarySoft }} onClick={(event) => event.stopPropagation()}>
        {item.ctaLabel}
      </Button>

      <Button h="30px" minW="26px" px="0" bg="transparent" color={colors.primaryText} _hover={{ bg: "#F8FAFD" }} aria-label={`More options for ${item.title}`} onClick={(event) => event.stopPropagation()}>
        <MoreVertical size={17} />
      </Button>
    </Grid>
  );
}

function ActionPagination({
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
    <HStack justify="space-between" gap="12px" flexWrap="wrap" pt="16px">
      <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">Showing {startItem}-{endItem} of {totalItems} action items</Text>
      <HStack gap="8px">
        <Button h="34px" minW="34px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} color={colors.secondaryText} disabled={currentPage === 1} _disabled={{ opacity: 0.45 }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage - 1)}>
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
        <Button h="34px" minW="34px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} color={colors.primaryText} disabled={currentPage === totalPages} _disabled={{ opacity: 0.45 }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight size={15} />
        </Button>
      </HStack>
      <SelectControl label="Action items per page" value={pageSizeOption} options={surveyActionPageSizeOptions} onChange={onPageSizeOptionChange} />
    </HStack>
  );
}

function ActionDetailsDrawer({
  item,
  draftStatus,
  isDirty,
  onDraftStatusChange,
  onSave,
}: {
  item: SurveyActionItem;
  draftStatus: SurveyActionStatus;
  isDirty: boolean;
  onDraftStatusChange: (status: SurveyActionStatus) => void;
  onSave: () => void;
}) {
  const Icon = item.icon;
  const sourceStyle = typeStyles[item.source];
  const statusStyle = statusStyles[item.status];
  const priorityColor = priorityColors[item.priority];

  return (
    <SurveyPanel>
      <VStack align="stretch" gap="18px" p="20px">
        <HStack justify="space-between" align="flex-start" gap="12px">
          <HStack gap="12px" minW={0}>
            <Box w="44px" h="44px" borderRadius="12px" bg={sourceStyle.bg} color={sourceStyle.color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
              <Icon size={21} strokeWidth={2.1} />
            </Box>
            <VStack align="flex-start" gap="5px" minW={0}>
              <Text color={colors.primary} fontSize="12px" fontWeight="800">Action details</Text>
              <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1.25">{item.title}</Text>
            </VStack>
          </HStack>
          <Text bg={statusStyle.bg} color={statusStyle.color} px="10px" py="6px" borderRadius="7px" fontSize="11px" fontWeight="800" lineHeight="1">
            {item.status}
          </Text>
        </HStack>

        <VStack align="stretch" gap="10px" pt="16px" borderTop="1px solid" borderColor={colors.lightBorder}>
          <Text color={colors.primaryText} fontSize="13px" fontWeight="800">Description</Text>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.55">{item.description}</Text>
        </VStack>

        <Grid templateColumns="1fr 1fr" gap="12px">
          <VStack align="flex-start" gap="6px" p="12px" border="1px solid" borderColor={colors.lightBorder} borderRadius="8px">
            <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Source</Text>
            <Text color={sourceStyle.color} fontSize="12px" fontWeight="800">{item.source}</Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" lineHeight="1.35">{item.sourceSurvey}</Text>
          </VStack>
          <VStack align="flex-start" gap="6px" p="12px" border="1px solid" borderColor={colors.lightBorder} borderRadius="8px">
            <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Priority</Text>
            <HStack gap="8px">
              <Box w="8px" h="8px" borderRadius="full" bg={priorityColor} />
              <Text color={colors.primaryText} fontSize="12px" fontWeight="800">{item.priority}</Text>
            </HStack>
          </VStack>
          <VStack align="flex-start" gap="6px" p="12px" border="1px solid" borderColor={colors.lightBorder} borderRadius="8px">
            <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Due date</Text>
            <Text color={colors.primaryText} fontSize="12px" fontWeight="800">{item.dueDate}</Text>
            <Text color={isOverdue(item) || item.priority === "High" ? colors.danger : colors.secondaryText} fontSize="11px" fontWeight="800">{item.dueLabel}</Text>
          </VStack>
          <VStack align="flex-start" gap="6px" p="12px" border="1px solid" borderColor={colors.lightBorder} borderRadius="8px">
            <Text color={colors.mutedText} fontSize="11px" fontWeight="800">Signals</Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" lineHeight="1.35">{item.insightMentions}</Text>
          </VStack>
        </Grid>

        <VStack align="stretch" gap="10px" p="14px" border="1px solid" borderColor={colors.lightBorder} borderRadius="8px" bg="#FBFCFE">
          <Text color={colors.primaryText} fontSize="13px" fontWeight="800">Feedback signal</Text>
          <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.45">{item.sentimentInsight}</Text>
        </VStack>

        <VStack align="stretch" gap="9px" pt="4px">
          <Text color={colors.primaryText} fontSize="13px" fontWeight="800">Update status</Text>
          <SelectControl label="Selected action status" value={draftStatus} options={["Pending", "Completed"] as const} onChange={onDraftStatusChange} />
          <Button h="40px" bg={colors.primary} color={colors.surface} borderRadius="6px" fontSize="13px" fontWeight="800" disabled={!isDirty} _disabled={{ opacity: 0.5, cursor: "not-allowed" }} _hover={{ bg: "#1668BA" }} onClick={onSave}>
            <HStack gap="8px">
              <Save size={15} />
              <Text>Save status</Text>
            </HStack>
          </Button>
        </VStack>
      </VStack>
    </SurveyPanel>
  );
}

function ComingUpCard({ items }: { items: readonly SurveyActionItem[] }) {
  const dueThisWeek = items.filter((item) => item.status === "Pending" && isDueThisWeek(item)).length;
  const overdue = items.filter((item) => item.status === "Pending" && isOverdue(item)).length;
  const pending = items.filter((item) => item.status === "Pending").length;

  const stats = [
    { label: `${dueThisWeek} actions due this week`, color: "#F97316" },
    { label: `${overdue} action${overdue === 1 ? "" : "s"} overdue`, color: colors.danger },
    { label: `${pending} actions pending`, color: colors.primary },
  ] as const;

  return (
    <SurveyPanel>
      <VStack align="stretch" gap="16px" p="20px">
        <HStack gap="10px">
          <CalendarDays size={18} color={colors.primary} />
          <Text color={colors.primary} fontSize="13px" fontWeight="800">Coming up</Text>
        </HStack>
        <VStack align="stretch" gap="14px">
          {stats.map((stat) => (
            <HStack key={stat.label} gap="12px">
              <Box w="7px" h="7px" borderRadius="full" bg={stat.color} />
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">{stat.label}</Text>
            </HStack>
          ))}
        </VStack>
        <HStack pt="14px" borderTop="1px solid" borderColor={colors.lightBorder} color={colors.primary} gap="8px">
          <Text fontSize="13px" fontWeight="800">View all action items</Text>
          <ChevronRight size={15} />
        </HStack>
      </VStack>
    </SurveyPanel>
  );
}

export function ActionSurveyItemsTab() {
  const [items, setItems] = useState<SurveyActionItem[]>(() => [...surveyActionItems]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("Status: All");
  const [priority, setPriority] = useState<PriorityFilter>("Priority: All");
  const [source, setSource] = useState<SourceFilter>("Source: All");
  const [sort, setSort] = useState<SortOption>("Sort: Due date");
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>("8 per page");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(surveyActionItems[0]?.id ?? "");
  const [draftStatus, setDraftStatus] = useState<SurveyActionStatus>(surveyActionItems[0]?.status ?? "Pending");
  const [savedNotice, setSavedNotice] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch) ||
          item.sourceSurvey.toLowerCase().includes(normalizedSearch);
        const matchesStatus = status === "Status: All" || item.status === status;
        const matchesPriority = priority === "Priority: All" || item.priority === priority;
        const matchesSource = source === "Source: All" || item.source === source;
        return matchesSearch && matchesStatus && matchesPriority && matchesSource;
      })
      .sort((first, second) => {
        if (sort === "Sort: Priority") return priorityRank[first.priority] - priorityRank[second.priority];
        if (sort === "Sort: Status") return first.status.localeCompare(second.status);
        return parseDueTime(first) - parseDueTime(second);
      });
  }, [items, priority, search, sort, source, status]);

  const pageSize = pageSizeByOption[pageSizeOption];
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pageItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedItem = items.find((item) => item.id === selectedItemId) ?? filteredItems[0] ?? items[0];
  const isStatusDirty = selectedItem ? draftStatus !== selectedItem.status : false;

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSizeOption, priority, search, sort, source, status]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0].id);
    }
  }, [filteredItems, selectedItemId]);

  useEffect(() => {
    if (selectedItem) {
      setDraftStatus(selectedItem.status);
      setSavedNotice("");
    }
  }, [selectedItem]);

  function saveStatus() {
    if (!selectedItem || !isStatusDirty) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: draftStatus,
              ctaLabel: draftStatus === "Completed" ? "View Details" : item.ctaLabel,
            }
          : item,
      ),
    );
    setSavedNotice("Status saved locally.");
  }

  return (
    <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 320px" }} gap="16px" p="16px">
      <VStack align="stretch" gap="16px" minW={0}>
        <ActionControls search={search} status={status} priority={priority} source={source} sort={sort} onSearchChange={setSearch} onStatusChange={setStatus} onPriorityChange={setPriority} onSourceChange={setSource} onSortChange={setSort} />
        <VStack align="stretch" gap="0" border="1px solid" borderColor={colors.lightBorder} borderRadius="10px" overflow="hidden" bg={colors.surface}>
          {pageItems.length === 0 ? (
            <VStack minH="260px" justify="center">
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">No action items match the current filters.</Text>
            </VStack>
          ) : (
            pageItems.map((item) => (
              <ActionRow key={item.id} item={item} isSelected={selectedItem?.id === item.id} onSelect={() => setSelectedItemId(item.id)} />
            ))
          )}
        </VStack>
        <ActionPagination currentPage={currentPage} pageSizeOption={pageSizeOption} totalItems={filteredItems.length} totalPages={totalPages} onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))} onPageSizeOptionChange={setPageSizeOption} />
      </VStack>
      <VStack align="stretch" gap="16px">
        {selectedItem && (
          <>
            <ActionDetailsDrawer item={selectedItem} draftStatus={draftStatus} isDirty={isStatusDirty} onDraftStatusChange={setDraftStatus} onSave={saveStatus} />
            {savedNotice && (
              <HStack px="14px" py="10px" bg="#E8F8F0" border="1px solid #CFEBDD" borderRadius="8px" color={colors.success}>
                <CheckCircle2 size={15} />
                <Text fontSize="12px" fontWeight="800">{savedNotice}</Text>
              </HStack>
            )}
          </>
        )}
        <ComingUpCard items={items} />
      </VStack>
    </Grid>
  );
}
