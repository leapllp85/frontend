"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  Heart,
  MoreHorizontal,
  Search,
  TrendingUp,
  UsersRound,
  Zap,
} from "lucide-react";
import {
  teamRiskFilters,
  teamRiskStyles,
  type TeamMemberHighlight,
  type TeamRiskLevel,
} from "./teamsInfoData";
import { colors } from "@/types/styles";

export type TeamRiskFilterValue = "all" | TeamRiskLevel;

type TeamMembersTableProps = {
  activeRisk: TeamRiskFilterValue;
  currentPage: number;
  filteredCount: number;
  getEffectiveRisk: (memberInitials: string, fallback: TeamRiskLevel) => TeamRiskLevel;
  isSaving: boolean;
  members: readonly TeamMemberHighlight[];
  pageSize: number;
  pendingChangesCount: number;
  riskFilterCounts: Record<TeamRiskFilterValue, number>;
  searchQuery: string;
  totalMembers: number;
  totalPages: number;
  isPendingRiskChange: (memberInitials: string) => boolean;
  onDiscardChanges: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRiskLevelChange: (member: TeamMemberHighlight, risk: TeamRiskLevel) => void;
  onRiskChange: (risk: TeamRiskFilterValue) => void;
  onSaveChanges: () => void;
  onSearchChange: (query: string) => void;
};

const tableColumns =
  "minmax(188px, 1.35fr) 92px 96px 116px 108px 122px 108px 46px";

function getPageNumbers(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

function ScoreRing({ score, riskLevel }: { score: number; riskLevel: TeamRiskLevel }) {
  const style = teamRiskStyles[riskLevel];

  return (
    <Box
      w="42px"
      h="42px"
      borderRadius="full"
      p="2px"
      bg={`conic-gradient(${style.color} ${score * 3.6}deg, ${colors.lightBorder} 0deg)`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="34px"
        h="34px"
        borderRadius="full"
        bg={colors.surface}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={colors.primaryText} fontSize="10px" fontWeight="800">
          {score}%
        </Text>
      </Box>
    </Box>
  );
}

function SignalDots({
  color,
  kind,
  value,
}: {
  color: string;
  kind: "heart" | "dot" | "square";
  value: number;
}) {
  return (
    <HStack gap="7px">
      {Array.from({ length: 5 }, (_, index) => {
        const isActive = index < value;

        if (kind === "heart") {
          return (
            <Heart
              key={index}
              size={10}
              color={isActive ? color : "#9AA7BD"}
              fill={isActive ? color : "none"}
              strokeWidth={2}
            />
          );
        }

        return (
          <Box
            key={index}
            w={kind === "square" ? "7px" : "8px"}
            h={kind === "square" ? "7px" : "8px"}
            borderRadius={kind === "square" ? "2px" : "full"}
            bg={isActive ? color : colors.surface}
            border="1px solid"
            borderColor={isActive ? color : "#9AA7BD"}
          />
        );
      })}
    </HStack>
  );
}

function HeaderCell({
  children,
  icon,
}: {
  children: string;
  icon?: "sort" | "help" | "heart" | "motivation" | "career" | "workLife";
}) {
  const icons = {
    sort: <ChevronsUpDown size={12} color={colors.primaryText} />,
    help: <CircleHelp size={12} color={colors.primaryText} />,
    heart: <Heart size={12} color={colors.primaryText} />,
    motivation: <Zap size={12} color={colors.primaryText} />,
    career: <TrendingUp size={12} color={colors.primaryText} />,
    workLife: <UsersRound size={12} color={colors.primaryText} />,
  };

  return (
    <HStack gap="6px" minW={0} justify={children === "Actions" ? "center" : "flex-start"}>
      {icon && icons[icon]}
      <Text
        color={colors.primaryText}
        fontSize="11px"
        fontWeight="800"
        lineHeight="1"
        whiteSpace="nowrap"
      >
        {children}
      </Text>
    </HStack>
  );
}

function MemberRow({
  effectiveRisk,
  hasPendingChange,
  member,
  onRiskLevelChange,
}: {
  effectiveRisk: TeamRiskLevel;
  hasPendingChange: boolean;
  member: TeamMemberHighlight;
  onRiskLevelChange: (member: TeamMemberHighlight, risk: TeamRiskLevel) => void;
}) {
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const riskDropdownRef = useRef<HTMLDivElement | null>(null);
  const style = teamRiskStyles[effectiveRisk];

  useEffect(() => {
    setIsRiskOpen(false);
  }, [member.initials]);

  useEffect(() => {
    if (!isRiskOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        riskDropdownRef.current &&
        !riskDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRiskOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isRiskOpen]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={tableColumns}
      alignItems="center"
      minW="900px"
      minH="58px"
      px="8px"
      bg={hasPendingChange ? "#F8FAFD" : "transparent"}
      borderBottom="1px solid"
      borderColor={colors.lightBorder}
    >
      <HStack gap="12px" minW={0}>
        <Box
          w="38px"
          h="38px"
          borderRadius="full"
          bg={style.bg}
          color={style.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="13px"
          fontWeight="800"
          flexShrink={0}
        >
          {member.initials}
        </Box>
        <VStack align="flex-start" gap="3px" minW={0}>
          <Text
            color={colors.primaryText}
            fontSize="12px"
            fontWeight="800"
            lineHeight="1.15"
            truncate
          >
            {member.name}
          </Text>
          <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1.15" truncate>
            {member.role}
          </Text>
        </VStack>
      </HStack>

      <Box position="relative" ref={riskDropdownRef}>
        <HStack
          as="button"
          gap="6px"
          p="0"
          bg="transparent"
          border="0"
          appearance="none"
          cursor="pointer"
          onClick={() => setIsRiskOpen((isOpen) => !isOpen)}
        >
          <Text color={style.color} fontSize="12px" fontWeight="800">
            {effectiveRisk}
          </Text>
          <ChevronDown size={12} color={style.color} />
        </HStack>

        {isRiskOpen && (
          <VStack
            align="stretch"
            gap="2px"
            position="absolute"
            top="22px"
            left="-8px"
            zIndex={20}
            minW="92px"
            p="5px"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="6px"
            boxShadow="0 12px 28px rgba(11, 12, 28, 0.12)"
          >
            {(["High", "Medium", "Low"] as const).map((risk) => {
              const riskStyle = teamRiskStyles[risk];

              return (
                <Box
                  key={risk}
                  as="button"
                  w="full"
                  px="8px"
                  py="6px"
                  border="0"
                  borderRadius="5px"
                  bg={effectiveRisk === risk ? riskStyle.bg : colors.surface}
                  color={riskStyle.color}
                  textAlign="left"
                  fontSize="12px"
                  fontWeight="800"
                  cursor="pointer"
                  _hover={{ bg: riskStyle.bg }}
                  onClick={() => {
                    onRiskLevelChange(member, risk);
                    setIsRiskOpen(false);
                  }}
                >
                  {risk}
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>

      <ScoreRing score={member.healthScore} riskLevel={effectiveRisk} />

      <SignalDots color="#F23D4F" kind="heart" value={member.mentalHealth} />
      <SignalDots color="#F58220" kind="dot" value={member.motivation} />
      <SignalDots color={colors.success} kind="square" value={member.careerGrowth} />
      <SignalDots color="#5F5CE6" kind="dot" value={member.workLife} />

      <HStack justify="center">
        <MoreHorizontal size={18} color={colors.primaryText} />
      </HStack>
    </Box>
  );
}

export function TeamMembersTable({
  activeRisk,
  currentPage,
  filteredCount,
  getEffectiveRisk,
  isSaving,
  members,
  pageSize,
  pendingChangesCount,
  riskFilterCounts,
  searchQuery,
  totalMembers,
  totalPages,
  isPendingRiskChange,
  onDiscardChanges,
  onPageChange,
  onPageSizeChange,
  onRiskLevelChange,
  onRiskChange,
  onSaveChanges,
  onSearchChange,
}: TeamMembersTableProps) {
  const resultStart = filteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const resultEnd = Math.min(currentPage * pageSize, filteredCount);
  const pageNumbers = getPageNumbers(totalPages);

  return (
    <VStack align="stretch" gap="16px" minW={0} flex="1">
      <Flex justify="space-between" gap="18px" align="center" wrap={{ base: "wrap", xl: "nowrap" }}>
        <HStack gap={{xl: "0px","2xl":'18px'}} wrap="wrap">
          {teamRiskFilters.map((filter) => {
            const isActive = activeRisk === filter.value;
            const filterColor = filter.value === "all" ? colors.primary : teamRiskStyles[filter.value].color;
            const count = riskFilterCounts[filter.value];

            return (
              <Button
                key={filter.value}
                h="38px"
                px="18px"
                borderRadius="6px"
                bg={isActive ? colors.primarySoft : "transparent"}
                color={isActive ? colors.primary : filterColor}
                border="1px solid"
                borderColor={isActive ? colors.primaryLight : "transparent"}
                fontSize="13px"
                fontWeight="700"
                _hover={{ bg: isActive ? colors.primarySoft : "#F8FAFD" }}
                onClick={() => onRiskChange(filter.value)}
              >
                {filter.label} ({count})
              </Button>
            );
          })}
        </HStack>

        <HStack gap="16px" flex={{ base: "1 1 100%", xl: "0 0 auto" }} justify="flex-end">
          <Box position="relative" w={{ base: "full", md: "250px" }}>
            <Box
              position="absolute"
              left="14px"
              top="50%"
              transform="translateY(-50%)"
              color={colors.secondaryText}
              zIndex={1}
            >
              <Search size={16} />
            </Box>
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search team members..."
              h="38px"
              pl="42px"
              pr="14px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="6px"
              color={colors.primaryText}
              fontSize="12px"
              fontWeight="600"
              _placeholder={{ color: colors.mutedText }}
              _focus={{ borderColor: colors.primaryLight, boxShadow: `0 0 0 1px ${colors.primaryLight}` }}
            />
          </Box>

          <Box position="relative" flexShrink={0}>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              style={{
                appearance: "none",
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                color: colors.primaryText,
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                height: "38px",
                paddingLeft: "15px",
                paddingRight: "34px",
                width: "124px",
              }}
            >
              <option value={8}>8 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
            <Box
              position="absolute"
              right="12px"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
              color={colors.secondaryText}
            >
              <ChevronDown size={14} />
            </Box>
          </Box>
        </HStack>
      </Flex>

      <Box border="1px solid" borderColor={colors.border} borderRadius="8px" overflow="hidden">
        <Box overflowX="auto">
          <Box
            display="grid"
            gridTemplateColumns={tableColumns}
            alignItems="center"
            minW="900px"
            h="42px"
            px="8px"
            bg="#FBFCFE"
            borderBottom="1px solid"
            borderColor={colors.lightBorder}
          >
            <HeaderCell>Member</HeaderCell>
            <HeaderCell icon="sort">Risk Level</HeaderCell>
            <HeaderCell icon="help">Health Score</HeaderCell>
            <HeaderCell icon="heart">Mental Health</HeaderCell>
            <HeaderCell icon="motivation">Motivation</HeaderCell>
            <HeaderCell icon="career">Career Growth</HeaderCell>
            <HeaderCell icon="workLife">Work-Life</HeaderCell>
            <HeaderCell>Actions</HeaderCell>
          </Box>

          {members.length > 0 ? (
            members.map((member) => (
              <MemberRow
                key={member.name}
                effectiveRisk={getEffectiveRisk(member.initials, member.riskLevel)}
                hasPendingChange={isPendingRiskChange(member.initials)}
                member={member}
                onRiskLevelChange={onRiskLevelChange}
              />
            ))
          ) : (
            <Box
              minW="900px"
              h="160px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={colors.secondaryText}
              fontSize="13px"
              fontWeight="700"
            >
              No team members found.
            </Box>
          )}
        </Box>
      </Box>

      <Flex align="center" justify="space-between" gap="16px" wrap="wrap">
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">
          Showing {resultStart} to {resultEnd} of {totalMembers} members
        </Text>

        {pendingChangesCount > 0 && (
          <HStack gap="10px" wrap="wrap">
            <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
              {pendingChangesCount} unsaved changes
            </Text>
            <Button
              h="32px"
              px="12px"
              borderRadius="6px"
              bg={colors.surface}
              color={colors.primaryText}
              border="1px solid"
              borderColor={colors.border}
              disabled={isSaving}
              fontSize="12px"
              fontWeight="800"
              _hover={{ bg: "#F8FAFD" }}
              _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
              onClick={onDiscardChanges}
            >
              Discard Changes
            </Button>
            <Button
              h="32px"
              px="12px"
              borderRadius="6px"
              bg={colors.primary}
              color={colors.surface}
              border="1px solid"
              borderColor={colors.primary}
              disabled={isSaving}
              fontSize="12px"
              fontWeight="800"
              _hover={{ bg: "#176CC1" }}
              _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
              onClick={onSaveChanges}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </HStack>
        )}

        <HStack gap="9px">
          <Button
            h="32px"
            w="32px"
            minW="32px"
            p={0}
            borderRadius="6px"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            disabled={currentPage === 1}
            _hover={{ bg: "#F8FAFD" }}
            _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={15} color={colors.primaryText} />
          </Button>

          {pageNumbers.map((page) => {
            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                h="32px"
                w="32px"
                minW="32px"
                p={0}
                borderRadius="6px"
                bg={isActive ? colors.primary : colors.surface}
                color={isActive ? colors.surface : colors.primaryText}
                border="1px solid"
                borderColor={isActive ? colors.primary : colors.border}
                fontSize="12px"
                fontWeight="800"
                _hover={{ bg: isActive ? colors.primary : "#F8FAFD" }}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            h="32px"
            w="32px"
            minW="32px"
            p={0}
            borderRadius="6px"
            bg={colors.surface}
            border="1px solid"
            borderColor={colors.border}
            disabled={currentPage === totalPages}
            _hover={{ bg: "#F8FAFD" }}
            _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight size={15} color={colors.primaryText} />
          </Button>
        </HStack>
      </Flex>
    </VStack>
  );
}
