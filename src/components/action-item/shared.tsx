"use client";

import type { ReactNode } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

export const toneStyles = {
  primary: { bg: colors.primarySoft, color: colors.primary, rail: colors.primary },
  success: { bg: "#E8F8F0", color: colors.success, rail: colors.success },
  danger: { bg: "#FDEDEA", color: "#EF4444", rail: "#EF4444" },
  warning: { bg: "#FFF3DE", color: "#F97316", rail: "#F97316" },
  purple: { bg: "#F1E9FF", color: "#8C5CF6", rail: "#8C5CF6" },
  neutral: { bg: "#F4F6FA", color: colors.secondaryText, rail: colors.lightBorder },
} as const;

export type ActionTone = keyof typeof toneStyles;

export function ActionCard({
  children,
  minH,
  px,
  py,
}: {
  children: ReactNode;
  minH?: string | { base?: string; md?: string; xl?: string };
  px?: string | { base?: string; md?: string; xl?: string };
  py?: string | { base?: string; md?: string; xl?: string };
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

export function IconTile({
  tone,
  children,
  size = "48px",
}: {
  tone: ActionTone;
  children: ReactNode;
  size?: string;
}) {
  const style = toneStyles[tone];

  return (
    <Box
      w={size}
      h={size}
      borderRadius="12px"
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

export function SectionTitle({ title }: { title: string }) {
  return (
    <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.1">
      {title}
    </Text>
  );
}

export function ActionLink({ children }: { children: ReactNode }) {
  return (
    <HStack
      as="button"
      gap="8px"
      color={colors.primary}
      fontSize="13px"
      fontWeight="800"
      lineHeight="1"
      cursor="pointer"
      _hover={{ color: "#1668BA" }}
    >
      <Text as="span">{children}</Text>
      <ArrowRight size={15} strokeWidth={2.3} />
    </HStack>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <VStack
      align="center"
      justify="center"
      minH="240px"
      border="1px solid"
      borderColor={colors.lightBorder}
      borderRadius="10px"
      bg="#FBFCFE"
    >
      <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
        {children}
      </Text>
    </VStack>
  );
}
