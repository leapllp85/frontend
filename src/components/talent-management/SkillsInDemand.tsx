"use client";

import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/types/styles";
import { skillsInDemand, type SkillDemandStatus } from "./talentManagementData";
import { ActionLink, SectionHeader, TalentCard } from "./shared";

const statusStyle: Record<SkillDemandStatus, { bg: string; color: string; bar: string }> = {
  High: { bg: "#FDEDEA", color: colors.danger, bar: colors.danger },
  Medium: { bg: "#FFF3DE", color: "#F97316", bar: "#F97316" },
  Low: { bg: "#FFF3DE", color: "#C77800", bar: colors.warning },
  Good: { bg: "#E8F8F0", color: colors.success, bar: colors.success },
};

function CoverageBar({ value, status }: { value: number; status: SkillDemandStatus }) {
  const color = statusStyle[status].bar;

  return (
    <HStack gap="10px" minW="142px" aria-label={`${value}% coverage`}>
      <Box flex="1" h="5px" borderRadius="full" bg="#EEF1F5" overflow="hidden">
        <Box h="full" w={`${value}%`} bg={color} borderRadius="full" />
      </Box>
      <Text color={colors.secondaryText} fontSize="12px" fontWeight="700" minW="34px" textAlign="right">
        {value}%
      </Text>
    </HStack>
  );
}

export function SkillsInDemand() {
  return (
    <TalentCard minH={{ base: "auto", xl: "344px" }}>
      <SectionHeader
        title="Skills in Demand"
        description="Skills required across active projects vs. available in team."
      />

      <Box overflowX="auto">
        <VStack align="stretch" gap="0" minW="660px">
          <Grid
            templateColumns="1.1fr 88px 94px 70px 1.5fr"
            gap="14px"
            pb="10px"
            borderBottom="1px solid"
            borderColor={colors.lightBorder}
          >
            {["Skill", "Required", "Available", "Gap", "Coverage"].map((heading) => (
              <Text key={heading} color={colors.secondaryText} fontSize="11px" fontWeight="800">
                {heading}
              </Text>
            ))}
          </Grid>

          {skillsInDemand.map((skill) => {
            const style = statusStyle[skill.status];

            return (
              <Grid
                key={skill.skill}
                templateColumns="1.1fr 88px 94px 70px 1.5fr"
                gap="14px"
                alignItems="center"
                py="12px"
                borderBottom="1px solid"
                borderColor={colors.lightBorder}
              >
                <Text color={colors.primaryText} fontSize="13px" fontWeight="700">
                  {skill.skill}
                </Text>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="700">
                  {skill.required}
                </Text>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="700">
                  {skill.available}
                </Text>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="700">
                  {skill.gap}
                </Text>
                <HStack gap="14px" justify="space-between">
                  <Box
                    px="9px"
                    py="5px"
                    borderRadius="6px"
                    bg={style.bg}
                    color={style.color}
                    fontSize="11px"
                    fontWeight="800"
                    lineHeight="1"
                    minW="62px"
                    textAlign="center"
                  >
                    {skill.status}
                  </Box>
                  <CoverageBar value={skill.coverage} status={skill.status} />
                </HStack>
              </Grid>
            );
          })}
        </VStack>
      </Box>

      <HStack mt="18px">
        <ActionLink>View all skill gaps</ActionLink>
      </HStack>
    </TalentCard>
  );
}
