"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { ChartNoAxesColumnIncreasing, UsersRound } from "lucide-react";
import { colors } from "@/types/styles";
import { talentManagementTabs } from "./talentManagementData";

const tabIconById = {
  analytics: ChartNoAxesColumnIncreasing,
  pool: UsersRound,
} as const;

export function TalentTabs() {
  return (
    <HStack gap="0" align="flex-end" overflowX="auto">
      {talentManagementTabs.map((tab) => {
        const Icon = tabIconById[tab.id];

        return (
          <Box
            key={tab.id}
            as="button"
            h="48px"
            px={{ base: "15px", md: "19px" }}
            display="flex"
            alignItems="center"
            gap="10px"
            bg={tab.isActive ? colors.primarySoft : colors.surface}
            color={tab.isActive ? colors.primary : colors.secondaryText}
            border="1px solid"
            borderColor={colors.lightBorder}
            borderBottomColor={tab.isActive ? colors.primary : colors.lightBorder}
            borderTopRadius="8px"
            borderBottomRadius="0"
            fontSize="13px"
            fontWeight="800"
            lineHeight="1"
            flexShrink={0}
            cursor="default"
          >
            <Icon size={16} strokeWidth={2.1} />
            <Text as="span" whiteSpace="nowrap">
              {tab.label}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
}
