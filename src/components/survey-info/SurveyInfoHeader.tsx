"use client";

import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import NextLink from "next/link";
import { colors } from "@/types/styles";
import { surveyInfoLinks, surveyInfoPageCopy } from "./surveyInfoData";

export function SurveyInfoHeader() {
  return (
    <HStack align="flex-start" justify="space-between" gap="18px" flexWrap={{ base: "wrap", md: "nowrap" }}>
      <Box minW={0}>
        <Text
          as="h1"
          color={colors.primaryText}
          fontSize={{ base: "22px", md: "24px" }}
          fontWeight="800"
          lineHeight="1.1"
          letterSpacing="0"
        >
          {surveyInfoPageCopy.title}
        </Text>
        <Text
          color={colors.secondaryText}
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight="600"
          lineHeight="1.45"
          mt="10px"
        >
          {surveyInfoPageCopy.subtitle}
        </Text>
      </Box>

      <Box textAlign="center" flexShrink={0}>
        <NextLink href={surveyInfoLinks.createSurvey} style={{ textDecoration: "none" }}>
          <Button
            h="44px"
            px="18px"
            bg={colors.primary}
            color={colors.surface}
            borderRadius="6px"
            fontSize="13px"
            fontWeight="800"
            _hover={{ bg: "#1668BA" }}
          >
            <HStack gap="9px">
              <Plus size={17} strokeWidth={2.3} />
              <Text>Create Survey</Text>
            </HStack>
          </Button>
        </NextLink>
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" mt="9px">
          Manager only
        </Text>
      </Box>
    </HStack>
  );
}
