"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { UsersRound } from "lucide-react";
import { TeamHealthDistribution } from "./TeamHealthDistribution";
import { TeamMembersTable, type TeamRiskFilterValue } from "./TeamMembersTable";
import { teamMembers } from "./teamsInfoData";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

export function TeamMemberHighlights() {
  const [activeRisk, setActiveRisk] = useState<TeamRiskFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return teamMembers.filter((member) => {
      const matchesRisk = activeRisk === "all" || member.riskLevel === activeRisk;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.role.toLowerCase().includes(normalizedQuery) ||
        member.initials.toLowerCase().includes(normalizedQuery);

      return matchesRisk && matchesSearch;
    });
  }, [activeRisk, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [currentPage, filteredMembers, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeRisk, pageSize, searchQuery]);

  return (
    <Box
      mt="18px"
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      px={{ base: "18px", md: "22px" }}
      py={{ base: "20px", md: "22px" }}
    >
      <Flex align="stretch" gap={{ base: "22px", xl: "24px" }} flexDir={{ base: "column", xl: "row" }}>
        <VStack
          align="stretch"
          gap="18px"
          flex={{ base: "1 1 auto", xl: "0 0 31.5%" }}
          minW={{ base: 0, xl: "410px" }}
        >
          <HStack gap="14px" align="center">
            <Box
              w="44px"
              h="44px"
              borderRadius="full"
              bg={colors.primarySoft}
              color={colors.primary}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <UsersRound size={23} strokeWidth={2.1} />
            </Box>

            <VStack align="flex-start" gap="6px" minW={0}>
              <Text color={colors.primaryText} fontSize="16px" fontWeight="800" lineHeight="1.1">
                Team Member Highlights
              </Text>
              <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1.35">
                A complete view of your team&apos;s health and performance.
              </Text>
            </VStack>
          </HStack>

          <TeamHealthDistribution />
        </VStack>

        <Box
          w={{ base: "full", xl: "1px" }}
          h={{ base: "1px", xl: "auto" }}
          bg={colors.lightBorder}
          flexShrink={0}
        />

        <TeamMembersTable
          activeRisk={activeRisk}
          currentPage={currentPage}
          filteredCount={filteredMembers.length}
          members={paginatedMembers}
          pageSize={pageSize}
          searchQuery={searchQuery}
          totalMembers={filteredMembers.length}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
          onPageSizeChange={setPageSize}
          onRiskChange={setActiveRisk}
          onSearchChange={setSearchQuery}
        />
      </Flex>
    </Box>
  );
}
