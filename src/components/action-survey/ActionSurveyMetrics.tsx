"use client";

import { Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { TrendingUp } from "lucide-react";
import { colors } from "@/types/styles";
import { actionSurveyMetrics } from "./actionSurveyData";
import { MetricIconTile, SurveyPanel } from "./ActionSurveyShared";

export function ActionSurveyMetrics() {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(5, minmax(0, 1fr))" }} gap="14px">
      {actionSurveyMetrics.map((metric) => {
        const Icon = metric.icon;
        const isWarningTrend = metric.id === "pending-actions";

        return (
          <SurveyPanel key={metric.id}>
            <Flex align="center" gap="16px" minH="104px" px="18px" py="16px">
              <MetricIconTile tone={metric.tone}>
                <Icon size={23} strokeWidth={2.1} />
              </MetricIconTile>
              <VStack align="stretch" gap="7px" flex="1" minW={0}>
                <HStack justify="space-between" align="flex-start" gap="10px">
                  <Text color={colors.primaryText} fontSize="22px" fontWeight="800" lineHeight="1">
                    {metric.value}
                  </Text>
                  <HStack gap="3px" color={isWarningTrend ? colors.danger : colors.success}>
                    <TrendingUp size={13} strokeWidth={2.2} />
                    <Text fontSize="12px" fontWeight="800">{metric.trend}</Text>
                  </HStack>
                </HStack>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.1">
                  {metric.label}
                </Text>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.2">
                  {metric.helper}
                </Text>
              </VStack>
            </Flex>
          </SurveyPanel>
        );
      })}
    </Grid>
  );
}
