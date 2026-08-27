"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRight, UsersRound } from "lucide-react";
import NextLink from "next/link";
import { colors } from "@/types/styles";
import { resumeSurvey } from "./surveyInfoData";
import { IconTile, SurveyCard } from "./shared";

export function ResumeSurveyCard() {
  return (
    <SurveyCard>
      <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.1" mb="22px">
        Continue where you left off
      </Text>

      <HStack gap="16px" align="flex-start">
        <IconTile tone="purple" size="50px">
          <UsersRound size={22} strokeWidth={2.1} />
        </IconTile>
        <VStack align="flex-start" gap="9px" minW={0}>
          <Text color={colors.primaryText} fontSize="14px" fontWeight="800" lineHeight="1.2">
            {resumeSurvey.title}
          </Text>
          <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.35">
            You completed {resumeSurvey.completedQuestions} of {resumeSurvey.totalQuestions} questions
          </Text>
        </VStack>
      </HStack>

      <Flex align="center" gap="18px" mt="28px">
        <Box flex="1" h="8px" bg="#EEF1F5" borderRadius="full" overflow="hidden">
          <Box h="full" w={`${resumeSurvey.progress}%`} bg="#8C5CF6" borderRadius="full" />
        </Box>
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
          {resumeSurvey.progress}%
        </Text>
      </Flex>

      <NextLink href={resumeSurvey.continueHref} style={{ textDecoration: "none" }}>
        <Button
          w="full"
          h="44px"
          mt="28px"
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          borderRadius="6px"
          color="#6F42F5"
          fontSize="13px"
          fontWeight="800"
          _hover={{ bg: "#F8FAFD" }}
        >
          <HStack gap="12px">
            <Text>Continue Survey</Text>
            <ArrowRight size={17} strokeWidth={2.3} />
          </HStack>
        </Button>
      </NextLink>
    </SurveyCard>
  );
}
