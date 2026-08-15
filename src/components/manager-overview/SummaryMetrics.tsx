"use client";

import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { ArrowUp, Minus } from "lucide-react";
import { summaryMetrics } from "./data";
import { cardBorder, cardRadius, cardShadow, colors, rowGap } from "../../types/styles";

export function SummaryMetrics() {
  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, xl: 4 }}
      gap={rowGap}
      mt={{ base: "24px", md: "28px" }}
    >
      {summaryMetrics.map((metric) => {
        const Icon = metric.icon;
        const isFlat = metric.trendPrefix === "flat";

        return (
          <Box
            key={metric.label}
            minH={{ base: "124px", lg: "132px" }}
            bg={colors.surface}
            border={cardBorder}
            borderColor={colors.border}
            borderRadius={cardRadius}
            boxShadow={cardShadow}
            px={{ base: "20px", md: "22px" }}
            py={{ base: "18px", md: "20px" }}
            display="flex"
            alignItems="center"
          >
            <HStack gap={{ base: "16px", md: "20px" }} align="center" w="full">
              <Box
                h={{ base: "62px", md: "72px" }}
                w={{ base: "62px", md: "72px" }}
                borderRadius="full"
                bg={metric.iconBg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon size={30} color={metric.iconColor} strokeWidth={2} />
              </Box>

              <VStack align="flex-start" gap={2} minW={0}>
                <Text
                  color={colors.primaryText}
                  fontSize="12px"
                  fontWeight="800"
                  lineHeight="1"
                  textTransform="uppercase"
                  letterSpacing="0"
                >
                  {metric.label}
                </Text>
                <Text
                  color={metric.valueColor ?? colors.primaryText}
                  fontSize={{ base: "28px", md: "30px" }}
                  fontWeight="800"
                  lineHeight="1"
                  letterSpacing="0"
                >
                  {metric.value}
                </Text>
                <HStack gap={1.5} color={isFlat ? colors.secondaryText : colors.success}>
                  {isFlat ? (
                    <Minus size={15} strokeWidth={2.4} />
                  ) : (
                    <ArrowUp size={15} strokeWidth={2.4} />
                  )}
                  <Text
                    as="span"
                    color={isFlat ? colors.secondaryText : colors.success}
                    fontSize="13px"
                    fontWeight="800"
                    lineHeight="1"
                  >
                    {metric.trend}
                  </Text>
                  <Text
                    as="span"
                    color={colors.secondaryText}
                    fontSize="13px"
                    fontWeight="600"
                    lineHeight="1"
                    whiteSpace="nowrap"
                  >
                    vs last month
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}
