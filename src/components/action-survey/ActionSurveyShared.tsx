"use client";

import type { ReactNode } from "react";
import { Box, Text } from "@chakra-ui/react";
import { colors } from "@/types/styles";
import type { ActionSurveyMetric, SurveyTemplateStatus, SurveyTemplateType } from "./actionSurveyData";

export const surveyToneStyles: Record<ActionSurveyMetric["tone"], { bg: string; color: string }> = {
  primary: { bg: colors.primarySoft, color: colors.primary },
  success: { bg: "#E8F8F0", color: colors.success },
  warning: { bg: "#FFF3DE", color: "#F97316" },
  danger: { bg: "#FDEDEA", color: colors.danger },
  purple: { bg: "#F1E9FF", color: "#6F42F5" },
};

export const statusStyles: Record<SurveyTemplateStatus, { bg: string; color: string; dot?: string }> = {
  Active: { bg: "#E8F8F0", color: "#179C67", dot: colors.success },
  Draft: { bg: "#FFF3DE", color: "#F97316", dot: "#F97316" },
  Closed: { bg: "#F1F4F8", color: colors.secondaryText },
};

export const typeStyles: Record<SurveyTemplateType, { bg: string; color: string }> = {
  Engagement: { bg: colors.primarySoft, color: colors.primary },
  Wellness: { bg: "#E8F8F0", color: colors.success },
  Project: { bg: colors.primarySoft, color: colors.primary },
  Leadership: { bg: colors.primarySoft, color: colors.primary },
  Operations: { bg: colors.primarySoft, color: colors.primary },
  Culture: { bg: colors.primarySoft, color: colors.primary },
  Experience: { bg: "#E8F8F0", color: colors.success },
};

export function SurveyPanel({ children }: { children: ReactNode }) {
  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="12px"
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)"
    >
      {children}
    </Box>
  );
}

export function MetricIconTile({ tone, children }: { tone: ActionSurveyMetric["tone"]; children: ReactNode }) {
  const style = surveyToneStyles[tone];

  return (
    <Box w="48px" h="48px" borderRadius="12px" bg={style.bg} color={style.color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
      {children}
    </Box>
  );
}

export function Pill({ children, bg, color }: { children: ReactNode; bg: string; color: string }) {
  return (
    <Text as="span" bg={bg} color={color} px="10px" py="5px" borderRadius="7px" fontSize="11px" fontWeight="800" lineHeight="1">
      {children}
    </Text>
  );
}
