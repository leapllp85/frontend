"use client";

import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { organizationStats } from "./organizationInfoData";
import { colors } from "@/types/styles";

export function OrganizationStats() {
  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, xl: 4 }}
      gap={{ base: "12px", xl: "14px" }}
      flex="1"
      minW={0}
    >
      {organizationStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <HStack
            key={stat.label}
            h="68px"
            px="18px"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="12px"
            boxShadow="0 10px 30px rgba(11, 12, 28, 0.025)"
            gap="13px"
            align="center"
          >
            <Box
              w="34px"
              h="34px"
              borderRadius="full"
              bg={stat.bg}
              color={stat.color}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Icon size={17} strokeWidth={2.2} />
            </Box>

            <VStack align="flex-start" gap="3px" minW={0}>
              <Text color={colors.primaryText} fontSize="21px" fontWeight="800" lineHeight="1">
                {stat.value}
              </Text>
              <HStack gap="6px" minW={0}>
                <Text
                  color={colors.secondaryText}
                  fontSize="12px"
                  fontWeight="600"
                  lineHeight="1.2"
                  whiteSpace="nowrap"
                >
                  {stat.label}
                </Text>
                {stat.helper && <Info size={12} color={colors.mutedText} />}
              </HStack>
            </VStack>
          </HStack>
        );
      })}
    </SimpleGrid>
  );
}
