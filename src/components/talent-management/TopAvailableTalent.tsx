"use client";

import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/types/styles";
import { availableTalent } from "./talentManagementData";
import { ActionLink, SectionHeader, SkillPill, TalentCard } from "./shared";

function TalentAvatar({
  initials,
  bg,
}: {
  initials: string;
  bg: string;
}) {
  return (
    <Box
      w="42px"
      h="42px"
      borderRadius="full"
      bg={bg}
      color={colors.surface}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="12px"
      fontWeight="800"
      boxShadow="0 7px 16px rgba(11, 12, 28, 0.12)"
      flexShrink={0}
    >
      {initials}
    </Box>
  );
}

export function TopAvailableTalent() {
  return (
    <TalentCard minH={{ base: "auto", xl: "344px" }}>
      <SectionHeader
        title="Top Available Talent"
        description="Best available resources to fill your skill gaps."
        action={<ActionLink>View all available</ActionLink>}
      />

      <VStack align="stretch" gap="0">
        {availableTalent.map((talent) => (
          <Grid
            key={talent.id}
            templateColumns={{
              base: "1fr",
              md: "minmax(210px, 1.3fr) minmax(240px, 1.35fr) 110px 92px",
            }}
            alignItems="center"
            gap={{ base: "12px", md: "18px" }}
            py="14px"
            borderBottom="1px solid"
            borderColor={colors.lightBorder}
          >
            <HStack gap="13px" minW={0}>
              <TalentAvatar initials={talent.initials} bg={talent.avatarBg} />
              <VStack align="flex-start" gap="5px" minW={0}>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.1">
                  {talent.name}
                </Text>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.2">
                  {talent.role}
                </Text>
              </VStack>
            </HStack>

            <Flex align="center" gap="18px" wrap="wrap" minW={0}>
              <HStack gap="8px">
                <Box w="8px" h="8px" bg={colors.success} borderRadius="full" />
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                  Available
                </Text>
              </HStack>
              <VStack align="flex-start" gap="7px" minW={0}>
                <Text color={colors.secondaryText} fontSize="11px" fontWeight="800" lineHeight="1">
                  Top Skills
                </Text>
                <HStack gap="8px" wrap="wrap">
                  {talent.skills.map((skill) => (
                    <SkillPill key={skill}>{skill}</SkillPill>
                  ))}
                </HStack>
              </VStack>
            </Flex>

            <VStack align={{ base: "flex-start", md: "flex-start" }} gap="5px">
              <Text color={colors.secondaryText} fontSize="11px" fontWeight="800" lineHeight="1">
                Availability
              </Text>
              <Text color={colors.primaryText} fontSize="16px" fontWeight="800" lineHeight="1">
                {talent.availabilityLabel}
              </Text>
              <Box
                w="68px"
                h="4px"
                bg={colors.lightBorder}
                borderRadius="full"
                overflow="hidden"
                aria-label={`${talent.availabilityLabel} availability`}
              >
                <Box h="full" w={`${talent.availability}%`} bg={colors.success} borderRadius="full" />
              </Box>
            </VStack>

            <Text color={colors.primary} fontSize="12px" fontWeight="800" textAlign={{ base: "left", md: "right" }}>
              View profile
            </Text>
          </Grid>
        ))}
      </VStack>

      <HStack mt="18px">
        <ActionLink>View all available talent</ActionLink>
      </HStack>
    </TalentCard>
  );
}
