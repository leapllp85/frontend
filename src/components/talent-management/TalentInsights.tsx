"use client";

import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Smile, Target, UsersRound, Zap } from "lucide-react";
import { colors } from "@/types/styles";
import { talentInsights } from "./talentManagementData";
import { ActionLink, IconBubble, SectionHeader, TalentCard } from "./shared";

const insightIconByName = {
  members: UsersRound,
  bolt: Zap,
  target: Target,
  smile: Smile,
} as const;

export function TalentInsights() {
  return (
    <TalentCard minH={{ base: "auto", xl: "448px" }}>
      <SectionHeader
        title="Talent Insights"
        description="Key insights to help you manage your talent better."
      />

      <VStack align="stretch" gap="9px">
        {talentInsights.map((insight) => {
          const Icon = insightIconByName[insight.icon];

          return (
            <Flex
              key={insight.id}
              align="center"
              justify="space-between"
              gap="16px"
              px="15px"
              py="13px"
              border="1px solid"
              borderColor={colors.lightBorder}
              borderRadius="10px"
              bg={colors.surface}
            >
              <HStack gap="16px" minW={0}>
                <IconBubble tone={insight.tone} size="58px">
                  <Icon size={25} strokeWidth={2.1} />
                </IconBubble>
                <VStack align="flex-start" gap="7px" minW={0}>
                  <Text color={colors.primaryText} fontSize="14px" fontWeight="800" lineHeight="1.2">
                    {insight.title}
                  </Text>
                  <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.35">
                    {insight.description}
                  </Text>
                </VStack>
              </HStack>

              <Text color={colors.primary} fontSize="12px" fontWeight="800" flexShrink={0}>
                View
              </Text>
            </Flex>
          );
        })}
      </VStack>

      <HStack mt="18px">
        <ActionLink>View all insights</ActionLink>
      </HStack>
    </TalentCard>
  );
}
