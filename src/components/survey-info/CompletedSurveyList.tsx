"use client";

import { Box, Button, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { Activity, CalendarDays, ExternalLink, FileText, Sparkles } from "lucide-react";
import NextLink from "next/link";
import { colors } from "@/types/styles";
import { completedSurveys } from "./surveyInfoData";
import { IconTile, SectionHeader, SurveyCard } from "./shared";

const completedIconByName = {
  activity: Activity,
  file: FileText,
  sparkle: Sparkles,
} as const;

export function CompletedSurveyList() {
  return (
    <SurveyCard>
      <SectionHeader
        title="Completed surveys"
        description="Surveys you've already submitted"
      />

      <VStack align="stretch" gap="0" border="1px solid" borderColor={colors.lightBorder} borderRadius="10px" overflow="hidden">
        {completedSurveys.map((survey) => {
          const Icon = completedIconByName[survey.icon];

          return (
            <Grid
              key={survey.id}
              templateColumns={{ base: "1fr", md: "minmax(260px, 1fr) 220px 140px" }}
              gap="16px"
              alignItems="center"
              px="12px"
              py="12px"
              borderBottom="1px solid"
              borderColor={colors.lightBorder}
              _last={{ borderBottom: "0" }}
            >
              <HStack gap="14px" minW={0}>
                <IconTile tone={survey.tone} size="34px">
                  <Icon size={16} strokeWidth={2.1} />
                </IconTile>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.2">
                  {survey.title}
                </Text>
              </HStack>

              <HStack gap="9px">
                <CalendarDays size={15} color={colors.secondaryText} />
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">
                  {survey.completedDate}
                </Text>
              </HStack>

              <NextLink href={survey.resultsHref} style={{ textDecoration: "none" }}>
                <Button
                  h="34px"
                  w="full"
                  bg={colors.surface}
                  border="1px solid"
                  borderColor={colors.border}
                  borderRadius="6px"
                  color={colors.primary}
                  fontSize="12px"
                  fontWeight="800"
                  _hover={{ bg: "#F8FAFD" }}
                >
                  <HStack gap="8px">
                    <Text>View Results</Text>
                    <ExternalLink size={14} strokeWidth={2.2} />
                  </HStack>
                </Button>
              </NextLink>
            </Grid>
          );
        })}
      </VStack>
    </SurveyCard>
  );
}
