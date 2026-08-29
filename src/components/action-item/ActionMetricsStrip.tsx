"use client";

import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/types/styles";
import { actionItemMetrics } from "./actionItemData";
import { ActionCard, IconTile } from "./shared";

export function ActionMetricsStrip() {
  return (
    <ActionCard minH={{ base: "auto", xl: "104px" }} px={{ base: "18px", md: "26px" }} py="20px">
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))", xl: "repeat(5, minmax(0, 1fr))" }}
        gap={{ base: "18px", xl: "0" }}
        alignItems="center"
      >
        {actionItemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isLast = index === actionItemMetrics.length - 1;

          return (
            <Flex
              key={metric.id}
              align="center"
              gap="18px"
              minW={0}
              pr={{ base: 0, xl: isLast ? 0 : "28px" }}
              pl={{ base: 0, xl: index === 0 ? 0 : "28px" }}
              borderRight={{ base: "0", xl: isLast ? "0" : "1px solid" }}
              borderColor={colors.border}
            >
              {metric.progress === undefined && (
                <IconTile tone={metric.tone} size="48px">
                  <Icon size={22} strokeWidth={2.1} />
                </IconTile>
              )}

              <VStack align="flex-start" gap="7px" minW={0} flex="1">
                <Text color={colors.primaryText} fontSize="22px" fontWeight="800" lineHeight="1">
                  {metric.value}
                </Text>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.1">
                  {metric.label}
                </Text>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.2">
                  {metric.helper}
                </Text>
              </VStack>

              {metric.progress !== undefined && (
                <Box flex="1.35" h="8px" bg={colors.lightBorder} borderRadius="full" overflow="hidden" minW="120px">
                  <Box h="full" w={`${metric.progress}%`} bg={colors.primary} borderRadius="full" />
                </Box>
              )}
            </Flex>
          );
        })}
      </Grid>
    </ActionCard>
  );
}
