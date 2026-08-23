"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/types/styles";
import { talentManagementPageCopy } from "./talentManagementData";
import { TalentTabs } from "./TalentTabs";

export function TalentManagementHeader() {
  return (
    <VStack align="stretch" gap={{ base: "16px", md: "18px" }}>
      <Box>
        <Text
          as="h1"
          color={colors.primaryText}
          fontSize={{ base: "22px", md: "24px" }}
          fontWeight="800"
          lineHeight="1.15"
          letterSpacing="0"
        >
          {talentManagementPageCopy.title}
        </Text>
        <Text
          color={colors.secondaryText}
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight="600"
          lineHeight="1.45"
          mt="8px"
        >
          {talentManagementPageCopy.subtitle}
        </Text>
      </Box>

      <TalentTabs />
    </VStack>
  );
}
