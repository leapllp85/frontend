"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Download, Hand } from "lucide-react";
import { colors } from "../../types/styles";

export function ManagerOverviewPageHeader() {
  return (
    <Flex
      w="full"
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={4}
      flexDir={{ base: "column", md: "row" }}
    >
      <VStack align="flex-start" gap={2}>
        <HStack gap={2.5} align="center">
          <Text
            as="h1"
            color={colors.primaryText}
            fontSize={{ base: "22px", md: "22px", xl: "22px" }}
            fontWeight="800"
            lineHeight="1.15"
            letterSpacing="0"
          >
            Good evening, Manager!
          </Text>
          <Box color={colors.warning} transform="rotate(-12deg)">
            <Hand size={24} fill="#FDB83F" stroke="#D68A1E" strokeWidth={1.8} />
          </Box>
        </HStack>
        <Text
          color={colors.secondaryText}
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight="500"
          lineHeight="1.5"
        >
          Here&apos;s a snapshot of your team&apos;s attribution health.
        </Text>
      </VStack>

      <Button
        h="40px"
        px="16px"
        bg={colors.surface}
        color={colors.primaryText}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="6px"
        fontSize="13px"
        fontWeight="800"
        boxShadow="0 1px 2px rgba(11, 12, 28, 0.02)"
        _hover={{ bg: "#F8FAFD", borderColor: "#D9E1EA" }}
      >
        <HStack gap={2.5}>
          <Download size={16} color={colors.primary} />
          <Text>Export Report</Text>
        </HStack>
      </Button>
    </Flex>
  );
}
