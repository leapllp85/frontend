"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, HStack, Input, Text, VStack } from "@chakra-ui/react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Quote,
  Search,
} from "lucide-react";
import { colors } from "@/types/styles";
import {
  pageSizeOptions,
  responseRangeOptions,
  responseStatusFilters,
  responseTypeOptions,
  surveyResponses,
  type FeedbackAction,
  type ResponseTimelineStep,
  type SurveyResponse,
  type SurveyResponseStatus,
  type SurveyResponseType,
} from "./actionSurveyData";
import { SurveyPanel, typeStyles } from "./ActionSurveyShared";

type ResponseStatusFilter = (typeof responseStatusFilters)[number];
type ResponseTypeFilter = (typeof responseTypeOptions)[number];
type ResponseRangeFilter = (typeof responseRangeOptions)[number];
type PageSizeOption = (typeof pageSizeOptions)[number];

const responsePageSizeByOption: Record<PageSizeOption, number> = {
  "8 per page": 8,
  "12 per page": 12,
};

const responseStatusStyles: Record<SurveyResponseStatus, { bg: string; color: string }> = {
  Reviewed: { bg: "#E8F8F0", color: colors.success },
  Pending: { bg: "#FFF3DE", color: "#F97316" },
  "Awaiting Review": { bg: "#FFF3DE", color: "#B45309" },
};

const actionStatusStyles: Record<FeedbackAction["status"], { bg: string; color: string }> = {
  Completed: { bg: "#E8F8F0", color: colors.success },
  "In Progress": { bg: colors.primarySoft, color: colors.primary },
  Pending: { bg: "#FFF3DE", color: "#F97316" },
};

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
          height: "40px",
          minWidth: "120px",
          border: `1px solid ${colors.border}`,
          borderRadius: "6px",
          background: colors.surface,
          color: colors.primaryText,
          fontSize: "12px",
          fontWeight: 800,
          padding: "0 34px 0 12px",
          appearance: "none",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <Box position="absolute" right="11px" top="12px" pointerEvents="none" color={colors.secondaryText}>
        <ChevronDown size={15} />
      </Box>
    </Box>
  );
}

function StatusPill({ status }: { status: SurveyResponseStatus }) {
  const style = responseStatusStyles[status];
  return (
    <Text as="span" bg={style.bg} color={style.color} px="12px" py="6px" borderRadius="8px" fontSize="11px" fontWeight="800" lineHeight="1">
      {status}
    </Text>
  );
}

function ResponseFilters({
  search,
  type,
  range,
  status,
  onSearchChange,
  onTypeChange,
  onRangeChange,
  onStatusChange,
}: {
  search: string;
  type: ResponseTypeFilter;
  range: ResponseRangeFilter;
  status: ResponseStatusFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: ResponseTypeFilter) => void;
  onRangeChange: (value: ResponseRangeFilter) => void;
  onStatusChange: (value: ResponseStatusFilter) => void;
}) {
  return (
    <VStack align="stretch" gap="14px">
      <HStack gap="12px" flexWrap="wrap">
        <HStack h="40px" flex="1" minW={{ base: "full", md: "280px" }} px="12px" border="1px solid" borderColor={colors.border} borderRadius="6px" bg={colors.surface}>
          <Search size={15} color={colors.secondaryText} />
          <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search survey responses..." border="0" p="0" h="full" color={colors.primaryText} fontSize="12px" _focus={{ boxShadow: "none" }} _placeholder={{ color: colors.mutedText }} />
        </HStack>
        <SelectControl label="Response type" value={type} options={responseTypeOptions} onChange={onTypeChange} />
        <SelectControl label="Response range" value={range} options={responseRangeOptions} onChange={onRangeChange} />
      </HStack>

      <HStack gap="8px" overflowX="auto">
        {responseStatusFilters.map((filter) => {
          const isActive = status === filter;
          const count = filter === "All" ? surveyResponses.length : surveyResponses.filter((response) => response.status === filter).length;
          return (
            <Button key={filter} h="32px" px="13px" border="1px solid" borderColor={isActive ? colors.primary : colors.border} borderRadius="16px" bg={isActive ? colors.primarySoft : colors.surface} color={isActive ? colors.primary : colors.secondaryText} fontSize="12px" fontWeight="800" _hover={{ bg: colors.primarySoft }} onClick={() => onStatusChange(filter)}>
              {filter} ({count})
            </Button>
          );
        })}
      </HStack>
    </VStack>
  );
}

function ResponseRow({
  response,
  isSelected,
  onSelect,
}: {
  response: SurveyResponse;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = response.icon;
  const typeStyle = typeStyles[response.type];

  return (
    <HStack as="button" w="full" justify="space-between" gap="14px" px="16px" py="14px" bg={isSelected ? "#F8FBFF" : colors.surface} border="1px solid" borderColor={isSelected ? "#AFCFFF" : colors.lightBorder} borderRadius={isSelected ? "8px" : "0"} textAlign="left" cursor="pointer" _hover={{ bg: "#F8FAFD" }} onClick={onSelect}>
      <HStack gap="14px" minW={0}>
        <Box w="38px" h="38px" borderRadius="10px" bg={typeStyle.bg} color={typeStyle.color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
          <Icon size={18} strokeWidth={2.1} />
        </Box>
        <VStack align="flex-start" gap="5px" minW={0}>
          <Text color={colors.primaryText} fontSize="14px" fontWeight="800" lineClamp={1}>{response.title}</Text>
          <HStack gap="7px" color={colors.secondaryText} minW={0}>
            <Text fontSize="12px" fontWeight="700">{response.type}</Text>
            <Text fontSize="12px" fontWeight="800">•</Text>
            <Text fontSize="12px" fontWeight="700" lineClamp={1}>{response.submittedLabel}</Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack gap="14px" flexShrink={0}>
        <StatusPill status={response.status} />
        <ChevronRight size={18} color={colors.secondaryText} />
      </HStack>
    </HStack>
  );
}

function ResponsePagination({
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
  const pageSize = responsePageSizeByOption[pageSizeOption];
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <HStack justify="space-between" gap="12px" flexWrap="wrap" pt="14px">
      <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">Showing {startItem}-{endItem} of {totalItems} responses</Text>
      <HStack gap="8px">
        <Button h="32px" minW="32px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} disabled={currentPage === 1} _disabled={{ opacity: 0.45 }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft size={14} />
        </Button>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;
          return (
            <Button key={page} h="32px" minW="32px" px="0" bg={isActive ? colors.primary : colors.surface} border="1px solid" borderColor={isActive ? colors.primary : colors.border} color={isActive ? colors.surface : colors.primaryText} fontSize="12px" fontWeight="800" _hover={{ bg: isActive ? colors.primary : "#F8FAFD" }} onClick={() => onPageChange(page)}>
              {page}
            </Button>
          );
        })}
        <Button h="32px" minW="32px" px="0" bg={colors.surface} border="1px solid" borderColor={colors.border} disabled={currentPage === totalPages} _disabled={{ opacity: 0.45 }} _hover={{ bg: "#F8FAFD" }} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight size={14} />
        </Button>
      </HStack>
      <SelectControl label="Responses per page" value={pageSizeOption} options={pageSizeOptions} onChange={onPageSizeOptionChange} />
    </HStack>
  );
}

function splitTimestamp(timestamp: string) {
  const [datePart, timePart] = timestamp.split(", ");
  return { date: datePart ?? timestamp, time: timePart ?? "" };
}

function ProgressTracker({ timeline }: { timeline: readonly ResponseTimelineStep[] }) {
  return (
    <Box border="1px solid" borderColor={colors.border} borderRadius="10px" px={{ base: "14px", md: "24px" }} py="22px">
      <Grid templateColumns={{ base: "1fr", md: `repeat(${timeline.length}, minmax(0, 1fr))` }} gap={{ base: "18px", md: "0" }} position="relative">
        <Box display={{ base: "none", md: "block" }} position="absolute" left="10%" right="10%" top="12px" h="2px" bg={colors.primarySoft} />
        {timeline.map((step, index) => {
          const isComplete = step.status === "completed";
          const { date, time } = splitTimestamp(step.timestamp);
          return (
            <VStack key={step.id} gap="10px" position="relative" zIndex={1}>
              <Box w="24px" h="24px" borderRadius="full" bg={isComplete ? colors.primary : colors.primarySoft} color={isComplete ? colors.surface : colors.primary} border="1px solid" borderColor={isComplete ? colors.primary : "#C8DDFA"} display="flex" alignItems="center" justifyContent="center" fontSize="11px" fontWeight="800">
                {isComplete ? <Check size={13} strokeWidth={3} /> : index + 1}
              </Box>
              <Text color={colors.primaryText} fontSize="12px" fontWeight="800" textAlign="center">{step.label.replace(" by you", "").replace("Manager responded", "Manager Responded").replace("Follow-ups scheduled", "Follow-up")}</Text>
              <VStack gap="2px">
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" textAlign="center">{date}</Text>
                {time && <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" textAlign="center">{time}</Text>}
              </VStack>
            </VStack>
          );
        })}
      </Grid>
    </Box>
  );
}

function YourFeedbackPanel({ response }: { response: SurveyResponse }) {
  const feedbackRows =
    response.userAnswers ??
    response.keyFeedback.map((item) => ({
      id: item.id,
      question: item.title,
      answer: item.description,
      icon: item.icon,
    }));

  return (
    <VStack align="stretch" gap="20px" p="18px" minH="410px" border="1px solid" borderColor={colors.border} borderRadius="10px" bg="#FCFBFF">
      <Text color={colors.primaryText} fontSize="15px" fontWeight="800">Your Feedback</Text>
      <VStack align="stretch" gap="22px">
        {feedbackRows.map((item) => {
          const Icon = item.icon;
          return (
            <HStack key={item.id} align="flex-start" gap="14px">
              <Box w="30px" h="30px" borderRadius="8px" bg={colors.primarySoft} color={colors.primary} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                <Icon size={15} />
              </Box>
              <VStack align="flex-start" gap="7px">
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.35">{item.question}</Text>
                <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.5">Your answer: {item.answer}</Text>
              </VStack>
            </HStack>
          );
        })}
      </VStack>
      <Button alignSelf="flex-start" mt="auto" h="38px" px="14px" bg={colors.surface} border="1px solid" borderColor="#C8DDFA" color={colors.primary} borderRadius="6px" fontSize="12px" fontWeight="800" _hover={{ bg: colors.primarySoft }}>
        <HStack gap="8px">
          <Eye size={15} />
          <Text>View all your answers</Text>
        </HStack>
      </Button>
    </VStack>
  );
}

function ManagerResponseSummary({ response }: { response: SurveyResponse }) {
  return (
    <VStack align="stretch" gap="16px" p="18px" border="1px solid" borderColor={colors.border} borderRadius="10px" bg="#F8FBFF">
      <Text color={colors.primary} fontSize="15px" fontWeight="800">Manager Response</Text>
      <HStack align="flex-start" gap="14px">
        <Box w="34px" h="34px" borderRadius="9px" bg={colors.primarySoft} color={colors.primary} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
          <Quote size={18} />
        </Box>
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.55">{response.managerResponse.message}</Text>
      </HStack>
      <HStack gap="10px" pl="48px">
        <Box w="32px" h="32px" borderRadius="full" bg={colors.primarySoft} color={colors.primary} display="flex" alignItems="center" justifyContent="center" fontSize="11px" fontWeight="800">{response.managerResponse.initials}</Box>
          <VStack align="flex-start" gap="1px">
          <Text color={colors.primaryText} fontSize="12px" fontWeight="800">{response.managerResponse.manager}</Text>
          <Text color={colors.secondaryText} fontSize="11px" fontWeight="600">{response.managerResponse.respondedLabel}</Text>
          </VStack>
        </HStack>
    </VStack>
  );
}

function FeedbackActionsPanel({ actions }: { actions: readonly FeedbackAction[] }) {
  return (
    <VStack align="stretch" gap="14px" p="18px" border="1px solid" borderColor={colors.border} borderRadius="10px" bg="#FBFDFC">
      <Text color={colors.primaryText} fontSize="15px" fontWeight="800">Actions from this feedback</Text>
      {actions.length === 0 ? (
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">No linked action items yet.</Text>
      ) : (
        actions.map((action) => {
          const style = actionStatusStyles[action.status];
          return (
            <HStack key={action.id} justify="space-between" gap="12px">
              <HStack align="flex-start" gap="10px" minW={0}>
                <Box mt="2px" w="18px" h="18px" borderRadius="full" border="2px solid" borderColor={style.color} color={style.color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                  {action.status === "Completed" ? <Check size={11} /> : <Clock3 size={11} />}
                </Box>
                <VStack align="flex-start" gap="4px" minW={0}>
                  <Text color={colors.primaryText} fontSize="12px" fontWeight="800" lineClamp={1}>{action.title}</Text>
                  <HStack gap="8px" flexWrap="wrap">
                    <Text color={style.color} fontSize="11px" fontWeight="800">{action.status}</Text>
                    <Text color={colors.secondaryText} fontSize="11px" fontWeight="700">•</Text>
                    <Text color={colors.secondaryText} fontSize="11px" fontWeight="700">{action.dueLabel}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <ChevronRight size={16} color={colors.secondaryText} />
            </HStack>
          );
        })
      )}
      <Button alignSelf="flex-start" mt="4px" h="34px" px="0" bg="transparent" color={colors.primary} fontSize="12px" fontWeight="800" _hover={{ bg: "transparent", color: "#1668BA" }}>
        <HStack gap="8px">
          <Text>View all actions</Text>
          <ChevronRight size={15} />
        </HStack>
      </Button>
    </VStack>
  );
}

function ResponseDetailPanel({ response }: { response: SurveyResponse }) {
  return (
    <VStack align="stretch" gap="16px">
      <HStack justify="space-between" align="flex-start" gap="14px" flexWrap="wrap">
        <VStack align="flex-start" gap="9px" minW={0}>
          <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1.2">{response.title}</Text>
          <HStack gap="9px" color={colors.secondaryText} flexWrap="wrap">
            <Text fontSize="12px" fontWeight="700">{response.type}</Text>
            <Text fontSize="12px" fontWeight="800">•</Text>
            <Text fontSize="12px" fontWeight="700">{response.submittedLabel}</Text>
            <Text fontSize="12px" fontWeight="800">•</Text>
            <StatusPill status={response.status} />
          </HStack>
        </VStack>
        <Button h="38px" px="14px" bg={colors.surface} border="1px solid" borderColor="#C8DDFA" color={colors.primary} borderRadius="6px" fontSize="12px" fontWeight="800" _hover={{ bg: colors.primarySoft }}>
            <HStack gap="8px">
              <Download size={15} />
            <Text>Download PDF</Text>
            </HStack>
          </Button>
      </HStack>

      <ProgressTracker timeline={response.timeline} />

      <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) minmax(280px, 0.92fr)" }} gap="16px">
        <YourFeedbackPanel response={response} />
        <VStack align="stretch" gap="16px">
          <ManagerResponseSummary response={response} />
          <FeedbackActionsPanel actions={response.actions} />
        </VStack>
      </Grid>
    </VStack>
  );
}

export function SurveyResponsesTab() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ResponseTypeFilter>("All Types");
  const [range, setRange] = useState<ResponseRangeFilter>("Last 6 Months");
  const [status, setStatus] = useState<ResponseStatusFilter>("All");
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>("8 per page");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResponseId, setSelectedResponseId] = useState(surveyResponses[0]?.id ?? "");

  const filteredResponses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return surveyResponses.filter((response) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        response.title.toLowerCase().includes(normalizedSearch) ||
        response.type.toLowerCase().includes(normalizedSearch);
      const matchesType = type === "All Types" || response.type === type;
      const matchesStatus = status === "All" || response.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, status, type]);

  const pageSize = responsePageSizeByOption[pageSizeOption];
  const totalPages = Math.max(1, Math.ceil(filteredResponses.length / pageSize));
  const pageResponses = filteredResponses.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedResponse = filteredResponses.find((response) => response.id === selectedResponseId) ?? filteredResponses[0] ?? surveyResponses[0];

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSizeOption, range, search, status, type]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (filteredResponses.length > 0 && !filteredResponses.some((response) => response.id === selectedResponseId)) {
      setSelectedResponseId(filteredResponses[0].id);
    }
  }, [filteredResponses, selectedResponseId]);

  return (
    <Grid templateColumns={{ base: "1fr", xl: "minmax(360px, 0.9fr) minmax(0, 1.1fr)" }} gap="16px" p="16px">
      <VStack align="stretch" gap="14px">
        <ResponseFilters search={search} type={type} range={range} status={status} onSearchChange={setSearch} onTypeChange={setType} onRangeChange={setRange} onStatusChange={setStatus} />
        <VStack align="stretch" gap="0" border="1px solid" borderColor={colors.lightBorder} borderRadius="8px" overflow="hidden">
          {pageResponses.length === 0 ? (
            <VStack minH="240px" justify="center">
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">No survey responses match the current filters.</Text>
            </VStack>
          ) : (
            pageResponses.map((response) => (
              <ResponseRow key={response.id} response={response} isSelected={selectedResponse.id === response.id} onSelect={() => setSelectedResponseId(response.id)} />
            ))
          )}
        </VStack>
        <ResponsePagination currentPage={currentPage} pageSizeOption={pageSizeOption} totalItems={filteredResponses.length} totalPages={totalPages} onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))} onPageSizeOptionChange={setPageSizeOption} />
      </VStack>
      <ResponseDetailPanel response={selectedResponse} />
    </Grid>
  );
}
