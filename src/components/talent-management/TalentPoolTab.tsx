"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  MoreVertical,
  Search,
  SquarePen,
  X,
} from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { colors } from "@/types/styles";
import {
  talentPoolMembers,
  talentValidationLevelLabels,
  type TalentAvailability,
  type TalentDepartment,
  type TalentPoolMember,
  type TalentValidationLevel,
} from "./talentManagementData";

const pageSize = 6;
const skillPreviewCount = 4;
const validationOrder: Record<TalentValidationLevel, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const validationStyles: Record<TalentValidationLevel, { bg: string; color: string; border: string }> = {
  High: { bg: "#E8F8F0", color: colors.success, border: "#CBEFDE" },
  Medium: { bg: "#FFF3DE", color: "#D97706", border: "#FCE2B7" },
  Low: { bg: colors.primarySoft, color: colors.primary, border: "#D8E7FA" },
};

function getUniqueValues<T extends string>(values: readonly T[]) {
  return Array.from(new Set(values));
}

function TalentAvatar({ member }: { member: TalentPoolMember }) {
  return (
    <Box
      w="52px"
      h="52px"
      borderRadius="full"
      bg={member.avatarBg}
      overflow="hidden"
      flexShrink={0}
      border="1px solid"
      borderColor={colors.lightBorder}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Text color={colors.surface} fontSize="14px" fontWeight="800">
          {member.initials}
        </Text>
      )}
    </Box>
  );
}

function SkillPill({
  skill,
  onClick,
}: {
  skill: TalentPoolMember["skills"][number];
  onClick?: () => void;
}) {
  const style = validationStyles[skill.validation];

  if (onClick) {
    return (
      <Button
        type="button"
        px="12px"
        h="28px"
        minW="auto"
        borderRadius="6px"
        bg={style.bg}
        color={style.color}
        border="1px solid"
        borderColor={style.border}
        fontSize="11px"
        fontWeight="800"
        lineHeight="1"
        whiteSpace="nowrap"
        _hover={{ bg: style.bg, borderColor: style.color }}
        onClick={onClick}
      >
        {skill.name}
      </Button>
    );
  }

  return (
    <Box
      as="span"
      px="12px"
      h="28px"
      borderRadius="6px"
      bg={style.bg}
      color={style.color}
      border="1px solid"
      borderColor={style.border}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      fontSize="11px"
      fontWeight="800"
      lineHeight="1"
      whiteSpace="nowrap"
    >
      {skill.name}
    </Box>
  );
}

function TalentCard({
  member,
  isExpanded,
  onExpandSkills,
  onValidateSkills,
}: {
  member: TalentPoolMember;
  isExpanded: boolean;
  onExpandSkills: () => void;
  onValidateSkills: () => void;
}) {
  const visibleSkills = isExpanded ? member.skills : member.skills.slice(0, skillPreviewCount);
  const hiddenSkillCount = Math.max(member.skills.length - skillPreviewCount, 0);

  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="12px"
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)"
      p={{ base: "16px", md: "18px" }}
      minH="222px"
      display="flex"
      flexDirection="column"
    >
      <HStack align="flex-start" justify="space-between" gap={4}>
        <HStack align="flex-start" gap={4} minW={0}>
          <TalentAvatar member={member} />
          <VStack align="flex-start" gap="6px" minW={0}>
            <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.1">
              {member.name}
            </Text>
            <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1">
              {member.role}
            </Text>
            <HStack gap={2}>
              <Box
                w="7px"
                h="7px"
                borderRadius="full"
                bg={member.availability === "Available" ? colors.success : "#F97316"}
              />
              <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                {member.availability}
              </Text>
            </HStack>
            {member.workingOn && (
              <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                Working on: {member.workingOn}
              </Text>
            )}
          </VStack>
        </HStack>

        <IconButton
          aria-label={`More options for ${member.name}`}
          variant="ghost"
          color={colors.secondaryText}
          w="28px"
          minW="28px"
          h="28px"
          _hover={{ bg: colors.primarySoft }}
        >
          <MoreVertical size={17} />
        </IconButton>
      </HStack>

      <Box mt="22px">
        <Text color={colors.secondaryText} fontSize="12px" fontWeight="800" mb="10px">
          Top Skills
        </Text>
        <HStack gap="8px" flexWrap="wrap">
          {visibleSkills.map((skill) => (
            <SkillPill key={skill.name} skill={skill} />
          ))}
          {!isExpanded && hiddenSkillCount > 0 && (
            <SkillPill
              skill={{ name: `+${hiddenSkillCount} more`, validation: "Low" }}
              onClick={onExpandSkills}
            />
          )}
        </HStack>
      </Box>

      <HStack
        mt="auto"
        pt="24px"
        justify="space-between"
        gap={4}
        align="flex-end"
        flexWrap={{ base: "wrap", md: "nowrap" }}
      >
        <HStack gap={0} flex="1" minW="210px">
          <VStack align="flex-start" gap="5px" minW="84px" pr="18px">
            <Text color={colors.mutedText} fontSize="11px" fontWeight="800">
              Experience
            </Text>
            <Text color={colors.primaryText} fontSize="13px" fontWeight="800">
              {member.experience}
            </Text>
          </VStack>
          <VStack
            align="flex-start"
            gap="5px"
            borderLeft="1px solid"
            borderColor={colors.lightBorder}
            pl="18px"
            minW={0}
          >
            <Text color={colors.mutedText} fontSize="11px" fontWeight="800">
              Current Role
            </Text>
            <Text color={colors.secondaryText} fontSize="13px" fontWeight="800" lineClamp={1}>
              {member.currentRole}
            </Text>
          </VStack>
        </HStack>

        <Button
          h="38px"
          px="14px"
          borderRadius="6px"
          bg={colors.surface}
          color={colors.primary}
          border="1px solid"
          borderColor="#D8E7FA"
          fontSize="12px"
          fontWeight="800"
          _hover={{ bg: colors.primarySoft }}
          onClick={onValidateSkills}
        >
          <SquarePen size={15} />
          Validate Skills
        </Button>
      </HStack>
    </Box>
  );
}

function TalentValidationDrawer({
  member,
  draftLevels,
  hasChanges,
  onClose,
  onDraftChange,
  onSave,
}: {
  member: TalentPoolMember | null;
  draftLevels: Record<string, TalentValidationLevel>;
  hasChanges: boolean;
  onClose: () => void;
  onDraftChange: (skillName: string, level: TalentValidationLevel) => void;
  onSave: () => void;
}) {
  if (!member) return null;

  return (
    <Portal>
      <Flex
        position="fixed"
        inset={0}
        bg="rgba(11, 12, 28, 0.38)"
        zIndex={1400}
        justify="flex-end"
        onClick={onClose}
      >
        <Box
          w={{ base: "100%", md: "520px" }}
          h="100%"
          bg={colors.surface}
          boxShadow="-18px 0 60px rgba(11, 12, 28, 0.18)"
          borderLeft="1px solid"
          borderColor={colors.border}
          display="flex"
          flexDirection="column"
          onClick={(event) => event.stopPropagation()}
        >
          <HStack
            justify="space-between"
            gap={4}
            px={{ base: "18px", md: "24px" }}
            py="20px"
            borderBottom="1px solid"
            borderColor={colors.lightBorder}
          >
            <HStack gap={4} minW={0}>
              <TalentAvatar member={member} />
              <VStack align="flex-start" gap="5px" minW={0}>
                <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1.1">
                  Validate Skills
                </Text>
                <Text color={colors.secondaryText} fontSize="13px" fontWeight="700" lineClamp={1}>
                  {member.name} - {member.role}
                </Text>
              </VStack>
            </HStack>

            <IconButton
              aria-label="Close validation drawer"
              variant="ghost"
              color={colors.secondaryText}
              _hover={{ bg: colors.primarySoft }}
              onClick={onClose}
            >
              <X size={18} />
            </IconButton>
          </HStack>

          <Box px={{ base: "18px", md: "24px" }} py="18px" borderBottom="1px solid" borderColor={colors.lightBorder}>
            <Text color={colors.primaryText} fontSize="14px" fontWeight="800" mb="10px">
              Validation levels
            </Text>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap="8px">
              {Object.entries(talentValidationLevelLabels).map(([level, label]) => {
                const style = validationStyles[level as TalentValidationLevel];

                return (
                  <Box
                    key={level}
                    border="1px solid"
                    borderColor={style.border}
                    bg={style.bg}
                    borderRadius="8px"
                    px="10px"
                    py="9px"
                  >
                    <Text color={style.color} fontSize="12px" fontWeight="800" lineHeight="1">
                      {level}
                    </Text>
                    <Text color={colors.secondaryText} fontSize="11px" fontWeight="700" lineHeight="1.25" mt="5px">
                      {label}
                    </Text>
                  </Box>
                );
              })}
            </Grid>
          </Box>

          <VStack
            align="stretch"
            gap="12px"
            flex="1"
            overflowY="auto"
            px={{ base: "18px", md: "24px" }}
            py="18px"
          >
            {member.skills.map((skill) => {
              const selectedLevel = draftLevels[skill.name] ?? skill.validation;
              const style = validationStyles[selectedLevel];

              return (
                <Box
                  key={skill.name}
                  border="1px solid"
                  borderColor={colors.border}
                  borderRadius="12px"
                  p="14px"
                  bg={colors.surface}
                >
                  <HStack justify="space-between" align={{ base: "stretch", sm: "center" }} gap={4} flexWrap={{ base: "wrap", sm: "nowrap" }}>
                    <VStack align="flex-start" gap="7px" minW={0}>
                      <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                        {skill.name}
                      </Text>
                      <Box
                        px="9px"
                        h="24px"
                        borderRadius="999px"
                        bg={style.bg}
                        color={style.color}
                        border="1px solid"
                        borderColor={style.border}
                        display="inline-flex"
                        alignItems="center"
                        fontSize="11px"
                        fontWeight="800"
                      >
                        {talentValidationLevelLabels[selectedLevel]}
                      </Box>
                    </VStack>

                    <NativeSelect.Root w={{ base: "full", sm: "190px" }}>
                      <NativeSelect.Field
                        value={selectedLevel}
                        onChange={(event) =>
                          onDraftChange(skill.name, event.target.value as TalentValidationLevel)
                        }
                      >
                        {Object.entries(talentValidationLevelLabels).map(([level, label]) => (
                          <option key={level} value={level}>
                            {level} - {label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </HStack>
                </Box>
              );
            })}
          </VStack>

          <HStack
            justify="flex-end"
            gap="10px"
            px={{ base: "18px", md: "24px" }}
            py="16px"
            borderTop="1px solid"
            borderColor={colors.lightBorder}
          >
            <Button
              h="40px"
              px="18px"
              borderRadius="6px"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              color={colors.secondaryText}
              fontSize="13px"
              fontWeight="800"
              _hover={{ bg: "#F8FAFD" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              h="40px"
              px="18px"
              borderRadius="6px"
              bg={colors.primary}
              color={colors.surface}
              fontSize="13px"
              fontWeight="800"
              disabled={!hasChanges}
              _hover={{ bg: "#1668BA" }}
              onClick={onSave}
            >
              Save Changes
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Portal>
  );
}

export function TalentPoolTab() {
  const [members, setMembers] = useState<TalentPoolMember[]>(() => [...talentPoolMembers]);
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<TalentAvailability | "All">("All");
  const [skill, setSkill] = useState("All");
  const [validation, setValidation] = useState<TalentValidationLevel | "All">("All");
  const [department, setDepartment] = useState<TalentDepartment | "All">("All");
  const [sortBy, setSortBy] = useState("Best match");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [expandedTalentIds, setExpandedTalentIds] = useState<Set<string>>(new Set());
  const [validatingMemberId, setValidatingMemberId] = useState<string | null>(null);
  const [draftValidationLevels, setDraftValidationLevels] = useState<Record<string, TalentValidationLevel>>({});
  const validatingMember = members.find((member) => member.id === validatingMemberId) ?? null;

  const skillOptions = useMemo(
    () => getUniqueValues(members.flatMap((member) => member.skills.map((memberSkill) => memberSkill.name))).sort(),
    [members],
  );
  const departmentOptions = useMemo(
    () => getUniqueValues(members.map((member) => member.department)).sort(),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return members
      .filter((member) => {
        const matchesQuery =
          !normalizedQuery ||
          member.name.toLowerCase().includes(normalizedQuery) ||
          member.role.toLowerCase().includes(normalizedQuery) ||
          member.skills.some((memberSkill) => memberSkill.name.toLowerCase().includes(normalizedQuery));
        const matchesAvailability = availability === "All" || member.availability === availability;
        const matchesSkill = skill === "All" || member.skills.some((memberSkill) => memberSkill.name === skill);
        const matchesValidation =
          validation === "All" || member.skills.some((memberSkill) => memberSkill.validation === validation);
        const matchesDepartment = department === "All" || member.department === department;

        return matchesQuery && matchesAvailability && matchesSkill && matchesValidation && matchesDepartment;
      })
      .sort((firstMember, secondMember) => {
        if (sortBy === "Experience") {
          return Number.parseFloat(secondMember.experience) - Number.parseFloat(firstMember.experience);
        }

        if (sortBy === "Availability") {
          return firstMember.availability.localeCompare(secondMember.availability);
        }

        const firstBestValidation = Math.min(...firstMember.skills.map((memberSkill) => validationOrder[memberSkill.validation]));
        const secondBestValidation = Math.min(...secondMember.skills.map((memberSkill) => validationOrder[memberSkill.validation]));
        return firstBestValidation - secondBestValidation;
      });
  }, [availability, department, members, query, skill, sortBy, validation]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleIndex = filteredMembers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleIndex = Math.min(currentPage * pageSize, filteredMembers.length);

  const clearFilters = () => {
    setQuery("");
    setAvailability("All");
    setSkill("All");
    setValidation("All");
    setDepartment("All");
    setSortBy("Best match");
    setPage(1);
  };

  const toggleExpandedSkills = (memberId: string) => {
    setExpandedTalentIds((current) => {
      const next = new Set(current);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const openValidationDrawer = (member: TalentPoolMember) => {
    setValidatingMemberId(member.id);
    setDraftValidationLevels(
      Object.fromEntries(member.skills.map((memberSkill) => [memberSkill.name, memberSkill.validation])),
    );
  };

  const closeValidationDrawer = () => {
    setValidatingMemberId(null);
    setDraftValidationLevels({});
  };

  const updateDraftValidationLevel = (skillName: string, level: TalentValidationLevel) => {
    setDraftValidationLevels((current) => ({
      ...current,
      [skillName]: level,
    }));
  };

  const hasValidationChanges = Boolean(
    validatingMember?.skills.some(
      (memberSkill) => draftValidationLevels[memberSkill.name] && draftValidationLevels[memberSkill.name] !== memberSkill.validation,
    ),
  );

  const saveValidationChanges = () => {
    if (!validatingMember) return;

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === validatingMember.id
          ? {
              ...member,
              skills: member.skills.map((memberSkill) => ({
                ...memberSkill,
                validation: draftValidationLevels[memberSkill.name] ?? memberSkill.validation,
              })),
            }
          : member,
      ),
    );
    toaster.success({
      title: "Skills validated",
      description: `${validatingMember.name}'s skill validation levels were saved.`,
      duration: 2500,
      closable: true,
    });
    closeValidationDrawer();
  };

  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="12px"
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)"
      overflow="hidden"
    >
      <Toaster
        width={{ base: "calc(100vw - 32px)", md: "330px" }}
        rootProps={(toast) => ({
          bg: toast.type === "success" ? "#E8F8F0" : colors.surface,
          color: colors.primaryText,
          border: "1px solid",
          borderColor: toast.type === "success" ? "#CBEFDE" : colors.border,
          borderRadius: "18px",
          boxShadow: "0 18px 44px rgba(11, 12, 28, 0.14)",
          px: "14px",
          py: "12px",
        })}
      />

      <Grid
        templateColumns={{
          base: "1fr",
          md: "minmax(260px, 1.3fr) repeat(2, minmax(170px, 0.55fr))",
          xl: "minmax(320px, 1.4fr) repeat(4, minmax(160px, 0.55fr)) auto auto",
        }}
        gap="12px"
        p={{ base: "14px", md: "16px" }}
        borderBottom="1px solid"
        borderColor={colors.lightBorder}
        alignItems="center"
      >
        <Box position="relative">
          <Search
            size={17}
            color={colors.mutedText}
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
          />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            h="42px"
            pl="42px"
            borderRadius="6px"
            borderColor={colors.border}
            color={colors.primaryText}
            fontSize="13px"
            fontWeight="700"
            placeholder="Search by name, role or skill"
            _placeholder={{ color: colors.mutedText }}
          />
        </Box>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={availability}
            onChange={(event) => {
              setAvailability(event.target.value as TalentAvailability | "All");
              setPage(1);
            }}
          >
            <option value="All">Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={skill}
            onChange={(event) => {
              setSkill(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">Filter by skill</option>
            {skillOptions.map((skillOption) => (
              <option key={skillOption} value={skillOption}>
                {skillOption}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={validation}
            onChange={(event) => {
              setValidation(event.target.value as TalentValidationLevel | "All");
              setPage(1);
            }}
          >
            <option value="All">Validation level</option>
            {Object.entries(talentValidationLevelLabels).map(([level, label]) => (
              <option key={level} value={level}>
                {level} - {label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value as TalentDepartment | "All");
              setPage(1);
            }}
          >
            <option value="All">Department / Role</option>
            {departmentOptions.map((departmentOption) => (
              <option key={departmentOption} value={departmentOption}>
                {departmentOption}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <Button
          variant="ghost"
          color={colors.primary}
          fontSize="13px"
          fontWeight="800"
          onClick={clearFilters}
          _hover={{ bg: colors.primarySoft }}
        >
          Clear
        </Button>

        {/* <Button
          h="42px"
          px="14px"
          borderRadius="6px"
          bg={colors.surface}
          color={colors.secondaryText}
          border="1px solid"
          borderColor={colors.border}
          fontSize="13px"
          fontWeight="800"
          _hover={{ bg: colors.primarySoft }}
        >
          <Bookmark size={16} />
          Save View
        </Button> */}
      </Grid>

      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        gap={4}
        px={{ base: "14px", md: "18px" }}
        py="14px"
        flexDir={{ base: "column", md: "row" }}
      >
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
          Showing {firstVisibleIndex}-{lastVisibleIndex} of 128 talents
        </Text>

        <HStack gap="10px" justify={{ base: "space-between", md: "flex-end" }}>
          <NativeSelect.Root w={{ base: "full", md: "210px" }}>
            <NativeSelect.Field
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
            >
              <option value="Best match">Sort by: Best match</option>
              <option value="Experience">Sort by: Experience</option>
              <option value="Availability">Sort by: Availability</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <HStack gap="0" border="1px solid" borderColor={colors.border} borderRadius="6px" overflow="hidden">
            <IconButton
              aria-label="Grid view"
              h="38px"
              w="42px"
              minW="42px"
              borderRadius="0"
              bg={viewMode === "grid" ? colors.primarySoft : colors.surface}
              color={viewMode === "grid" ? colors.primary : colors.secondaryText}
              _hover={{ bg: colors.primarySoft }}
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 size={17} />
            </IconButton>
            <IconButton
              aria-label="List view"
              h="38px"
              w="42px"
              minW="42px"
              borderRadius="0"
              bg={viewMode === "list" ? colors.primarySoft : colors.surface}
              color={viewMode === "list" ? colors.primary : colors.secondaryText}
              _hover={{ bg: colors.primarySoft }}
              onClick={() => setViewMode("list")}
            >
              <List size={17} />
            </IconButton>
          </HStack>
        </HStack>
      </Flex>

      <Grid
        templateColumns={viewMode === "grid" ? { base: "1fr", lg: "repeat(2, minmax(0, 1fr))", "2xl": "repeat(3, minmax(0, 1fr))" } : "1fr"}
        gap="14px"
        px={{ base: "14px", md: "18px" }}
        pb="18px"
      >
        {paginatedMembers.map((member) => (
          <TalentCard
            key={member.id}
            member={member}
            isExpanded={expandedTalentIds.has(member.id)}
            onExpandSkills={() => toggleExpandedSkills(member.id)}
            onValidateSkills={() => openValidationDrawer(member)}
          />
        ))}
      </Grid>

      <Flex
        align="center"
        justify="center"
        gap={2}
        px={{ base: "14px", md: "18px" }}
        py="16px"
        borderTop="1px solid"
        borderColor={colors.lightBorder}
      >
        <IconButton
          aria-label="Previous page"
          h="36px"
          w="36px"
          minW="36px"
          borderRadius="6px"
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          disabled={currentPage === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          <ChevronLeft size={16} />
        </IconButton>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <Button
            key={pageNumber}
            h="36px"
            minW="36px"
            px="10px"
            borderRadius="6px"
            bg={pageNumber === currentPage ? colors.primary : colors.surface}
            color={pageNumber === currentPage ? colors.surface : colors.primaryText}
            border="1px solid"
            borderColor={pageNumber === currentPage ? colors.primary : colors.border}
            fontSize="13px"
            fontWeight="800"
            _hover={{ bg: pageNumber === currentPage ? colors.primary : colors.primarySoft }}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}

        <IconButton
          aria-label="Next page"
          h="36px"
          w="36px"
          minW="36px"
          borderRadius="6px"
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          disabled={currentPage === totalPages}
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
        >
          <ChevronRight size={16} />
        </IconButton>
      </Flex>

      <TalentValidationDrawer
        member={validatingMember}
        draftLevels={draftValidationLevels}
        hasChanges={hasValidationChanges}
        onClose={closeValidationDrawer}
        onDraftChange={updateDraftValidationLevel}
        onSave={saveValidationChanges}
      />
    </Box>
  );
}
