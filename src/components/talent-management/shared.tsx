"use client";

import type { ReactNode } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";
import type { TalentTone } from "./talentManagementData";

export const toneStyles: Record<TalentTone, { bg: string; color: string; softBorder: string }> = {
  primary: { bg: colors.primarySoft, color: colors.primary, softBorder: "#D8E7FA" },
  success: { bg: "#E8F8F0", color: colors.success, softBorder: "#D4F0E4" },
  warning: { bg: "#FFF3DE", color: "#F97316", softBorder: "#FCE2B7" },
  danger: { bg: "#FDEDEA", color: colors.danger, softBorder: "#F9D3CF" },
  purple: { bg: "#F1E9FF", color: "#8C5CF6", softBorder: "#E1D4FB" },
  neutral: { bg: "#F4F6FA", color: colors.mutedText, softBorder: colors.lightBorder },
};

export function TalentCard({
  children,
  minH,
  px,
  py,
}: {
  children: ReactNode;
  minH?: string | { base?: string; md?: string; lg?: string; xl?: string };
  px?: string | { base?: string; md?: string; lg?: string; xl?: string };
  py?: string | { base?: string; md?: string; lg?: string; xl?: string };
}) {
  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      minH={minH}
      px={px ?? { base: "18px", md: "22px" }}
      py={py ?? { base: "18px", md: "22px" }}
    >
      {children}
    </Box>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <HStack align="flex-start" justify="space-between" gap="16px" mb="18px">
      <VStack align="flex-start" gap="7px" minW={0}>
        <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.1">
          {title}
        </Text>
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.35">
          {description}
        </Text>
      </VStack>
      {action}
    </HStack>
  );
}

export function IconBubble({
  tone,
  children,
  size = "64px",
}: {
  tone: TalentTone;
  children: ReactNode;
  size?: string;
}) {
  const style = toneStyles[tone];

  return (
    <Box
      w={size}
      h={size}
      borderRadius="full"
      bg={style.bg}
      color={style.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {children}
    </Box>
  );
}

export function ActionLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <HStack
      as="button"
      gap="8px"
      color={colors.primary}
      fontSize="13px"
      fontWeight="800"
      lineHeight="1"
      whiteSpace="nowrap"
      cursor="pointer"
      _hover={{ color: "#1668BA" }}
      onClick={onClick}
    >
      <Text as="span">{children}</Text>
      <ArrowRight size={15} strokeWidth={2.3} />
    </HStack>
  );
}

export function SkillPill({ children }: { children: ReactNode }) {
  return (
    <Box
      px="10px"
      py="5px"
      borderRadius="6px"
      bg="#F1F3F7"
      color={colors.secondaryText}
      fontSize="11px"
      fontWeight="700"
      lineHeight="1"
      whiteSpace="nowrap"
    >
      {children}
    </Box>
  );
}
