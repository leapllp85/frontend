"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Download, Filter, UsersRound } from "lucide-react";
import { colors } from "@/types/styles";

export function TeamsInfoHeader() {
  return (
    <Flex
      w="full"
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={{ base: 5, md: 6 }}
      flexDir={{ base: "column", md: "row" }}
    >
      <HStack gap="18px" align="center" minW={0}>
        <Box
          w={{ base: "48px", md: "56px" }}
          h={{ base: "48px", md: "56px" }}
          borderRadius="full"
          bg={colors.primarySoft}
          color={colors.primary}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <UsersRound size={25} strokeWidth={2.1} />
        </Box>

        <VStack align="flex-start" gap="8px" minW={0}>
          <Text
            as="h1"
            color={colors.primaryText}
            fontSize={{ base: "22px", md: "24px" }}
            fontWeight="800"
            lineHeight="1.1"
            letterSpacing="0"
          >
            My Team
          </Text>
          <Text
            color={colors.secondaryText}
            fontSize={{ base: "13px", md: "14px" }}
            fontWeight="600"
            lineHeight="1.45"
          >
            Stay on top of your team&apos;s health, risks and engagement.
          </Text>
        </VStack>
      </HStack>

      <HStack gap={{ base: "12px", md: "16px" }} flexShrink={0}>
        <Button
          h="44px"
          px="18px"
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
          <HStack gap="10px">
            <Filter size={16} color={colors.secondaryText} />
            <Text>Filters</Text>
          </HStack>
        </Button>

        <Button
          h="44px"
          px="18px"
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
          <HStack gap="10px">
            <Download size={16} color={colors.primary} />
            <Text>Export Report</Text>
          </HStack>
        </Button>
      </HStack>
    </Flex>
  );
}
