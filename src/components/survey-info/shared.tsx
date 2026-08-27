"use client";

import type { ReactNode } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import NextLink from "next/link";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";
import type { SurveyInfoTone } from "./surveyInfoData";

export const surveyToneStyles: Record<SurveyInfoTone, { bg: string; color: string }> = {
  primary: { bg: colors.primarySoft, color: colors.primary },
  success: { bg: "#E8F8F0", color: colors.success },
  warning: { bg: "#FFF3DE", color: "#F97316" },
  purple: { bg: "#F1E9FF", color: "#8C5CF6" },
};

export function SurveyCard({
  children,
  minH,
}: {
  children: ReactNode;
  minH?: string | { base?: string; md?: string; xl?: string };
}) {
  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      minH={minH}
      px={{ base: "18px", md: "22px" }}
      py={{ base: "18px", md: "22px" }}
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
    <HStack justify="space-between" align="flex-start" gap="16px" mb="16px">
      <VStack align="flex-start" gap="7px" minW={0}>
        <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.1">
          {title}
        </Text>
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.35">
          {description}
        </Text>
      </VStack>
      {action}
    </HStack>
  );
}

export function IconTile({
  tone,
  children,
  size = "58px",
}: {
  tone: SurveyInfoTone;
  children: ReactNode;
  size?: string;
}) {
  const style = surveyToneStyles[tone];

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

export function ActionLink({ children, href }: { children: ReactNode; href?: string }) {
  const content = (
    <>
      <Text as="span">{children}</Text>
      <ArrowRight size={15} strokeWidth={2.3} />
    </>
  );

  if (href) {
    return (
      <NextLink href={href} style={{ textDecoration: "none" }}>
        <HStack
          gap="8px"
          color={colors.primary}
          fontSize="13px"
          fontWeight="800"
          lineHeight="1"
          whiteSpace="nowrap"
          cursor="pointer"
          _hover={{ color: "#1668BA" }}
        >
          {content}
        </HStack>
      </NextLink>
    );
  }

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
    >
      {content}
    </HStack>
  );
}
