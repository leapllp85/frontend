"use client";

import { useMemo, useState } from "react";
import { Box, Button, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { Activity, ArrowRight, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, FileText, Lock, Sparkles, UsersRound } from "lucide-react";
import NextLink from "next/link";
import { colors } from "@/types/styles";
import { pendingSurveySortOptions, pendingSurveys, type PendingSurveySort } from "./surveyInfoData";
import { IconTile, SectionHeader, SurveyCard } from "./shared";

const surveyIconByName = {
  activity: Activity,
  users: UsersRound,
  file: FileText,
  sparkle: Sparkles,
} as const;

const pageSize = 4;

export function PendingSurveyList() {
  const [sortBy, setSortBy] = useState<PendingSurveySort>("dueDate");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const activeSortLabel =
    pendingSurveySortOptions.find((option) => option.value === sortBy)?.label ?? "Due Date";
  const sortedSurveys = useMemo(() => {
    return [...pendingSurveys].sort((firstSurvey, secondSurvey) => {
      if (sortBy === "duration") {
        return firstSurvey.durationMinutes - secondSurvey.durationMinutes;
      }

      if (sortBy === "title") {
        return firstSurvey.title.localeCompare(secondSurvey.title);
      }

      return firstSurvey.dueDateValue.localeCompare(secondSurvey.dueDateValue);
    });
  }, [sortBy]);
  const totalPages = Math.max(1, Math.ceil(sortedSurveys.length / pageSize));
  const currentPageSurveys = sortedSurveys.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedSurveys.length);
  const goToPage = (nextPage: number) => setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));

  return (
    <SurveyCard minH={{ base: "auto", xl: "552px" }}>
      <SectionHeader
        title="Your surveys"
        description="Surveys waiting for your feedback"
        action={
          <HStack position="relative" gap="7px" color={colors.secondaryText} fontSize="13px" fontWeight="700" whiteSpace="nowrap">
            <Text>Sort by:</Text>
            <Button
              h="28px"
              px="8px"
              bg={colors.surface}
              color={colors.primary}
              borderRadius="6px"
              fontSize="13px"
              fontWeight="800"
              _hover={{ bg: "#F8FAFD" }}
              onClick={() => setIsSortOpen((isOpen) => !isOpen)}
              aria-expanded={isSortOpen}
            >
              <HStack gap="6px">
                <Text>{activeSortLabel}</Text>
                <ChevronDown size={14} />
              </HStack>
            </Button>

            {isSortOpen && (
              <VStack
                position="absolute"
                right="0"
                top="calc(100% + 6px)"
                zIndex={4}
                align="stretch"
                gap="2px"
                w="148px"
                p="6px"
                bg={colors.surface}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="8px"
                boxShadow="0 12px 28px rgba(11, 12, 28, 0.12)"
              >
                {pendingSurveySortOptions.map((option) => (
                  <Button
                    key={option.value}
                    h="32px"
                    justifyContent="flex-start"
                    bg={sortBy === option.value ? colors.primarySoft : colors.surface}
                    color={sortBy === option.value ? colors.primary : colors.secondaryText}
                    borderRadius="6px"
                    fontSize="12px"
                    fontWeight="800"
                    _hover={{ bg: colors.primarySoft }}
                    onClick={() => {
                      setSortBy(option.value);
                      setCurrentPage(1);
                      setIsSortOpen(false);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </VStack>
            )}
          </HStack>
        }
      />

      <VStack align="stretch" gap="0" border="1px solid" borderColor={colors.lightBorder} borderRadius="10px" overflow="hidden">
        {currentPageSurveys.map((survey) => {
          const Icon = surveyIconByName[survey.icon];

          return (
            <Grid
              key={survey.id}
              templateColumns={{ base: "1fr", lg: "minmax(320px, 1.5fr) minmax(170px, 0.8fr) 90px 150px" }}
              gap={{ base: "14px", lg: "18px" }}
              alignItems="center"
              px="16px"
              py="18px"
              borderBottom="1px solid"
              borderColor={colors.lightBorder}
              _last={{ borderBottom: "0" }}
            >
              <HStack gap="16px" minW={0}>
                <IconTile tone={survey.tone}>
                  <Icon size={24} strokeWidth={2.1} />
                </IconTile>
                <VStack align="flex-start" gap="8px" minW={0}>
                  <Text color={colors.primaryText} fontSize="14px" fontWeight="800" lineHeight="1.15">
                    {survey.title}
                  </Text>
                  <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.55">
                    {survey.description}
                  </Text>
                </VStack>
              </HStack>

              <VStack align="flex-start" gap="9px">
                {survey.isAnonymous && (
                  <HStack gap="8px">
                    <Lock size={14} color={colors.secondaryText} />
                    <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">Anonymous</Text>
                  </HStack>
                )}
                <HStack gap="8px">
                  <Clock3 size={14} color={colors.secondaryText} />
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">{survey.duration}</Text>
                </HStack>
                <Text color={colors.mutedText} fontSize="11px" fontWeight="700">
                  {survey.questionCount} questions
                </Text>
                <HStack gap="8px">
                  <CalendarDays size={14} color={colors.secondaryText} />
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">{survey.dueDate}</Text>
                </HStack>
              </VStack>

              <Box
                justifySelf={{ base: "flex-start", lg: "center" }}
                px="13px"
                py="7px"
                borderRadius="8px"
                bg="#E8F8F0"
                color={colors.success}
                fontSize="12px"
                fontWeight="800"
                lineHeight="1"
              >
                {survey.status}
              </Box>

              <NextLink href={survey.startHref} style={{ textDecoration: "none" }}>
                <Button
                  h="40px"
                  w="full"
                  bg={colors.surface}
                  border="1px solid"
                  borderColor={colors.border}
                  borderRadius="6px"
                  color={colors.primary}
                  fontSize="13px"
                  fontWeight="800"
                  _hover={{ bg: "#F8FAFD" }}
                >
                  <HStack gap="12px">
                    <Text>Start Survey</Text>
                    <ArrowRight size={17} strokeWidth={2.3} />
                  </HStack>
                </Button>
              </NextLink>
            </Grid>
          );
        })}
      </VStack>

      <Flex
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap="14px"
        mt="16px"
        flexDir={{ base: "column", md: "row" }}
      >
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
          Showing {startItem}-{endItem} of {sortedSurveys.length} surveys
        </Text>

        <HStack gap="8px">
          <Button
            h="34px"
            minW="34px"
            px="0"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            color={colors.secondaryText}
            disabled={currentPage === 1}
            _hover={{ bg: "#F8FAFD" }}
            _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
            onClick={() => goToPage(currentPage - 1)}
            aria-label="Previous surveys page"
          >
            <ChevronLeft size={16} />
          </Button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                h="34px"
                minW="34px"
                px="0"
                bg={isActive ? colors.primary : colors.surface}
                border="1px solid"
                borderColor={isActive ? colors.primary : colors.border}
                borderRadius="6px"
                color={isActive ? colors.surface : colors.secondaryText}
                fontSize="12px"
                fontWeight="800"
                _hover={{ bg: isActive ? colors.primary : "#F8FAFD" }}
                onClick={() => goToPage(page)}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </Button>
            );
          })}

          <Button
            h="34px"
            minW="34px"
            px="0"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            color={colors.secondaryText}
            disabled={currentPage === totalPages}
            _hover={{ bg: "#F8FAFD" }}
            _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
            onClick={() => goToPage(currentPage + 1)}
            aria-label="Next surveys page"
          >
            <ChevronRight size={16} />
          </Button>
        </HStack>
      </Flex>
    </SurveyCard>
  );
}
