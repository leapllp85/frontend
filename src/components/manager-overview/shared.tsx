"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { cardBorder, cardRadius, cardShadow, colors } from "../../types/styles";

export function LogoMark() {
  return (
    <Box
      aria-hidden="true"
      w={{ base: "32px", md: "38px" }}
      h={{ base: "32px", md: "38px" }}
      position="relative"
      flexShrink={0}
    >
      <Box
        position="absolute"
        inset="0"
        bg="linear-gradient(135deg, #5F7BF3 0%, #1D7FE3 100%)"
        clipPath="polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      />
      <Box
        position="absolute"
        inset="7px"
        bg={colors.surface}
        clipPath="polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      />
      <Box
        position="absolute"
        right="0"
        bottom="2px"
        w="44%"
        h="44%"
        bg={colors.primaryLight}
        clipPath="polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      />
    </Box>
  );
}

export function AnalyticsCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box
      minH={{ base: "300px", xl: "278px" }}
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      px={{ base: "20px", md: "22px" }}
      py={{ base: "20px", md: "24px" }}
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" justify="space-between" gap="16px" mb="22px">
        <Text
          as="h2"
          color={colors.primaryText}
          fontSize="15px"
          fontWeight="800"
          lineHeight="1"
          letterSpacing="0"
        >
          {title}
        </Text>
        {action}
      </Flex>
      {children}
    </Box>
  );
}

export function DetailCard({
  title,
  actionLabel,
  children,
}: {
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      minH={{ base: "304px", xl: "306px" }}
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      px={{ base: "20px", md: "22px" }}
      py={{ base: "20px", md: "22px" }}
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" justify="space-between" gap="16px" mb="16px">
        <Text
          as="h2"
          color={colors.primaryText}
          fontSize="15px"
          fontWeight="800"
          lineHeight="1"
        >
          {title}
        </Text>
        {actionLabel && (
          <Text
            color={colors.primary}
            fontSize="14px"
            fontWeight="700"
            lineHeight="1"
            whiteSpace="nowrap"
          >
            {actionLabel}
          </Text>
        )}
      </Flex>
      {children}
    </Box>
  );
}

export function Sparkline({ points, color }: { points: readonly number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const normalizedPoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 64;
      const y = 24 - ((point - min) / Math.max(max - min, 1)) * 18;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 64 28" width="64px" height="28px" style={{ flexShrink: 0 }}>
      <polyline
        points={normalizedPoints}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
