"use client";

import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import {
  Gauge,
  TimerReset,
  UserCheck,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { colors } from "@/types/styles";
import { talentMetrics } from "./talentManagementData";
import { ActionLink, IconBubble, TalentCard } from "./shared";

const metricIconByName = {
  members: UsersRound,
  assignments: UserCheck,
  utilization: TimerReset,
  overallocated: UserRoundX,
  capacity: Gauge,
} as const;

export function TalentMetricStrip() {
  return (
    <TalentCard minH={{ base: "auto", xl: "146px" }} px={{ base: "18px", md: "28px" }} py={{ base: "20px", xl: "30px" }}>
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
          xl: "repeat(5, minmax(0, 1fr))",
        }}
        gap={{ base: "18px", xl: "0" }}
        alignItems="center"
      >
        {talentMetrics.map((metric, index) => {
          const Icon = metricIconByName[metric.icon];
          const isLast = index === talentMetrics.length - 1;

          return (
            <Flex
              key={metric.id}
              align="center"
              gap={{ base: "14px", md: "18px" }}
              minW={0}
              pr={{ base: 0, xl: isLast ? 0 : "28px" }}
              pl={{ base: 0, xl: index === 0 ? 0 : "28px" }}
              borderRight={{ base: "0", xl: isLast ? "0" : "1px solid" }}
              borderColor={colors.border}
            >
              <IconBubble tone={metric.tone}>
                <Icon size={27} strokeWidth={2.1} />
              </IconBubble>

              <VStack align="flex-start" gap="7px" minW={0}>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="700" lineHeight="1.2">
                  {metric.label}
                </Text>
                <Text color={colors.primaryText} fontSize="27px" fontWeight="800" lineHeight="1">
                  {metric.value}
                </Text>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.2">
                  {metric.helper}
                </Text>
              </VStack>
            </Flex>
          );
        })}
      </Grid>

      <HStack justify="flex-end" mt={{ base: "18px", xl: "-4px" }}>
        <ActionLink>View full insights</ActionLink>
      </HStack>
    </TalentCard>
  );
}
