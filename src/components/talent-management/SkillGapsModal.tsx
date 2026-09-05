"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import { colors } from "@/types/styles";
import type { SkillDemandStatus } from "./talentManagementData";

type SkillGap = {
  skill: string;
  required: number;
  available: number;
  gap: number;
  coverage: number;
  status: SkillDemandStatus;
};

const statusStyle: Record<SkillDemandStatus, { bg: string; color: string; bar: string }> = {
  High: { bg: "#FDEDEA", color: colors.danger, bar: colors.danger },
  Medium: { bg: "#FFF3DE", color: "#F97316", bar: "#F97316" },
  Low: { bg: "#FFF3DE", color: "#C77800", bar: colors.warning },
  Good: { bg: "#E8F8F0", color: colors.success, bar: colors.success },
};

function CoverageBar({ value, status }: { value: number; status: SkillDemandStatus }) {
  return (
    <HStack gap="10px" minW={{ base: "120px", md: "160px" }}>
      <Box flex="1" h="6px" borderRadius="full" bg={colors.lightBorder} overflow="hidden">
        <Box h="full" w={`${value}%`} bg={statusStyle[status].bar} borderRadius="full" />
      </Box>
      <Text color={colors.secondaryText} fontSize="12px" fontWeight="800" minW="38px" textAlign="right">
        {value}%
      </Text>
    </HStack>
  );
}

export function SkillGapsModal({
  isOpen,
  skills,
  onClose,
}: {
  isOpen: boolean;
  skills: readonly SkillGap[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const filteredSkills = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return skills;

    return skills.filter((skill) => skill.skill.toLowerCase().includes(normalizedQuery));
  }, [query, skills]);

  if (!isOpen) return null;

  return (
    <Portal>
      <Flex
        position="fixed"
        inset={0}
        bg="rgba(11, 12, 28, 0.38)"
        zIndex={1500}
        align="center"
        justify="center"
        p={{ base: "16px", md: "24px" }}
        onClick={onClose}
      >
        <Box
          w="full"
          maxW="860px"
          maxH="82vh"
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          borderRadius="16px"
          boxShadow="0 28px 80px rgba(11, 12, 28, 0.18)"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          onClick={(event) => event.stopPropagation()}
        >
          <HStack
            justify="space-between"
            gap="16px"
            px={{ base: "18px", md: "24px" }}
            py="18px"
            borderBottom="1px solid"
            borderColor={colors.lightBorder}
          >
            <Box>
              <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1.1">
                All Skill Gaps
              </Text>
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="6px">
                Search and review required skills across active projects.
              </Text>
            </Box>
            <IconButton
              aria-label="Close skill gaps"
              variant="ghost"
              color={colors.secondaryText}
              _hover={{ bg: colors.primarySoft }}
              onClick={onClose}
            >
              <X size={18} />
            </IconButton>
          </HStack>

          <Box px={{ base: "18px", md: "24px" }} py="16px" borderBottom="1px solid" borderColor={colors.lightBorder}>
            <Box position="relative">
              <Search
                size={17}
                color={colors.mutedText}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                h="42px"
                pl="42px"
                borderRadius="6px"
                borderColor={colors.border}
                color={colors.primaryText}
                fontSize="13px"
                fontWeight="700"
                placeholder="Search skills..."
                _placeholder={{ color: colors.mutedText }}
              />
            </Box>
          </Box>

          <Box overflowY="auto" px={{ base: "18px", md: "24px" }} py="18px">
            <VStack align="stretch" gap="10px">
              {filteredSkills.map((skill) => {
                const style = statusStyle[skill.status];

                return (
                  <Grid
                    key={skill.skill}
                    templateColumns={{ base: "1fr", md: "1.2fr 90px 96px 76px 1.2fr" }}
                    gap={{ base: "10px", md: "14px" }}
                    alignItems="center"
                    p="14px"
                    border="1px solid"
                    borderColor={colors.border}
                    borderRadius="12px"
                    bg={colors.surface}
                  >
                    <Box>
                      <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                        {skill.skill}
                      </Text>
                      <Box
                        display="inline-flex"
                        mt="8px"
                        px="9px"
                        h="24px"
                        alignItems="center"
                        borderRadius="6px"
                        bg={style.bg}
                        color={style.color}
                        fontSize="11px"
                        fontWeight="800"
                      >
                        {skill.status}
                      </Box>
                    </Box>

                    <Box>
                      <Text color={colors.mutedText} fontSize="11px" fontWeight="800">
                        Required
                      </Text>
                      <Text color={colors.primaryText} fontSize="14px" fontWeight="800" mt="4px">
                        {skill.required}
                      </Text>
                    </Box>

                    <Box>
                      <Text color={colors.mutedText} fontSize="11px" fontWeight="800">
                        Available
                      </Text>
                      <Text color={colors.primaryText} fontSize="14px" fontWeight="800" mt="4px">
                        {skill.available}
                      </Text>
                    </Box>

                    <Box>
                      <Text color={colors.mutedText} fontSize="11px" fontWeight="800">
                        Gap
                      </Text>
                      <Text color={colors.primaryText} fontSize="14px" fontWeight="800" mt="4px">
                        {skill.gap}
                      </Text>
                    </Box>

                    <Box>
                      <Text color={colors.mutedText} fontSize="11px" fontWeight="800" mb="8px">
                        Coverage
                      </Text>
                      <CoverageBar value={skill.coverage} status={skill.status} />
                    </Box>
                  </Grid>
                );
              })}

              {filteredSkills.length === 0 && (
                <Flex
                  minH="180px"
                  align="center"
                  justify="center"
                  border="1px dashed"
                  borderColor={colors.border}
                  borderRadius="12px"
                  bg="#FCFDFE"
                >
                  <Text color={colors.mutedText} fontSize="13px" fontWeight="700">
                    No skills match your search.
                  </Text>
                </Flex>
              )}
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Portal>
  );
}
