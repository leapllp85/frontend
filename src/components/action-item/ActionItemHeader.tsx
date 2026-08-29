"use client";

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { ChevronDown, Plus } from "lucide-react";
import { colors } from "@/types/styles";
import { actionItemCopy } from "./actionItemData";

export function ActionItemHeader() {
  return (
    <HStack justify="space-between" align={{ base: "flex-start", md: "center" }} gap="18px" flexWrap={{ base: "wrap", md: "nowrap" }}>
      <VStack align="flex-start" gap="7px" minW={0}>
        <Text as="h1" color={colors.primaryText} fontSize={{ base: "22px", md: "24px" }} fontWeight="800" lineHeight="1.1">
          {actionItemCopy.title}
        </Text>
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.4">
          {actionItemCopy.subtitle}
        </Text>
      </VStack>

      <Button h="42px" px="18px" bg={colors.primary} color={colors.surface} borderRadius="6px" fontSize="13px" fontWeight="800" _hover={{ bg: "#1668BA" }}>
        <HStack gap="9px">
          <Plus size={17} strokeWidth={2.3} />
          <Text>{actionItemCopy.createLabel}</Text>
          <ChevronDown size={15} strokeWidth={2.3} />
        </HStack>
      </Button>
    </HStack>
  );
}
