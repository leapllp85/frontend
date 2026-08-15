"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ChevronRight, Lightbulb } from "lucide-react";
import { cardRadius, colors } from "../../types/styles";

export function InsightBanner() {
  return (
    <Flex
      mt={{ base: "18px", md: "18px" }}
      minH={{ base: "92px", md: "78px" }}
      bg="#F0F6FE"
      border="1px solid"
      borderColor={colors.lightBorder}
      borderRadius={cardRadius}
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.025)"
      px={{ base: "20px", md: "22px" }}
      py={{ base: "16px", md: "14px" }}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={4}
      flexDir={{ base: "column", md: "row" }}
    >
      <HStack gap={4} align="center" minW={0}>
        <Box
          w="52px"
          h="52px"
          borderRadius="full"
          bg={colors.primarySoft}
          color={colors.primary}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Lightbulb size={24} strokeWidth={2.1} />
        </Box>
        <VStack align="flex-start" gap={2} minW={0}>
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1">
            Insight of the Day
          </Text>
          <Text
            color={colors.secondaryText}
            fontSize="14px"
            fontWeight="600"
            lineHeight="1.4"
          >
            Attrition risk has increased by 12% this month compared to last month.
          </Text>
        </VStack>
      </HStack>

      <Button
        h="44px"
        px={5}
        bg={colors.surface}
        color={colors.primary}
        border="1px solid"
        borderColor="#C9DDF6"
        borderRadius="8px"
        fontSize="14px"
        fontWeight="800"
        flexShrink={0}
        _hover={{ bg: "#F8FAFD", borderColor: colors.primaryLight }}
      >
        <HStack gap={3}>
          <Text>View Detailed Analytics</Text>
          <ChevronRight size={18} />
        </HStack>
      </Button>
    </Flex>
  );
}
