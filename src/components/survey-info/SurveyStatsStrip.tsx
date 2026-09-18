"use client";

import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { BarChart3, CheckCircle2, ClipboardList } from "lucide-react";
import { colors } from "@/types/styles";
import { surveyInfoSummary } from "./surveyInfoData";
import { IconTile, SurveyCard } from "./shared";

const summaryIconById = {
  "to-complete": ClipboardList,
  completed: CheckCircle2,
  "response-rate": BarChart3,
} as const;

export function SurveyStatsStrip() {
  return (
    <SurveyCard minH={{ base: "auto", xl: "132px" }}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }} gap={{ base: "18px", md: "0" }}>
        {surveyInfoSummary.map((item, index) => {
          const Icon = summaryIconById[item.id];
          const isLast = index === surveyInfoSummary.length - 1;

          return (
            <Flex
              key={item.id}
              align="center"
              gap={{ base: "16px", md: "22px" }}
              minH="84px"
              px={{ base: "0", md: index === 0 ? "0" : "28px" }}
              borderRight={{ base: "0", md: isLast ? "0" : "1px solid" }}
              borderColor={colors.border}
              minW={0}
            >
              <IconTile tone={item.tone} size="72px">
                <Icon size={28} strokeWidth={2.1} />
              </IconTile>
              <VStack align="flex-start" gap="7px" minW={0}>
                <Text color={colors.primaryText} fontSize="28px" fontWeight="800" lineHeight="1">
                  {item.value}
                </Text>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.2">
                  {item.label}
                </Text>
                <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.35">
                  {item.helper}
                </Text>
              </VStack>
            </Flex>
          );
        })}
      </Grid>
    </SurveyCard>
  );
}
