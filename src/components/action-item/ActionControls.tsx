"use client";

import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { BarChart3, ChevronDown, Search } from "lucide-react";
import { colors } from "@/types/styles";
import { actionItemTabs, priorities, sources, type ActionItemPriority, type ActionItemSource, type ActionItemTab } from "./actionItemData";

type ActionControlsProps = {
  activeTab: ActionItemTab;
  priority: "All priorities" | ActionItemPriority;
  search: string;
  source: "All sources" | ActionItemSource;
  viewMode: "Timeline" | "Overview";
  onActiveTabChange: (tab: ActionItemTab) => void;
  onPriorityChange: (priority: "All priorities" | ActionItemPriority) => void;
  onSearchChange: (value: string) => void;
  onSourceChange: (source: "All sources" | ActionItemSource) => void;
  onViewModeChange: (mode: "Timeline" | "Overview") => void;
};

function SelectButton<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      style={{
        height: "32px",
        minWidth: "108px",
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
        background: colors.surface,
        color: colors.primaryText,
        fontSize: "11px",
        fontWeight: 700,
        padding: "0 28px 0 10px",
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function ActionControls({
  activeTab,
  priority,
  search,
  source,
  viewMode,
  onActiveTabChange,
  onPriorityChange,
  onSearchChange,
  onSourceChange,
  onViewModeChange,
}: ActionControlsProps) {
  return (
    <>
      <HStack align="center" gap="8px" flexWrap="wrap">
        <Text color={colors.primaryText} fontSize="13px" fontWeight="800">
          View:
        </Text>
        {(["Timeline", "Overview"] as const).map((mode) => (
          <Button
            key={mode}
            h="32px"
            px="14px"
            bg={viewMode === mode ? colors.primarySoft : colors.surface}
            border="1px solid"
            borderColor={viewMode === mode ? colors.primary : colors.border}
            borderRadius="6px"
            color={viewMode === mode ? colors.primary : colors.secondaryText}
            fontSize="11px"
            fontWeight="800"
            _hover={{ bg: colors.primarySoft }}
            onClick={() => onViewModeChange(mode)}
          >
            {mode === "Timeline" && <BarChart3 size={13} />}
            <Text ml={mode === "Timeline" ? "6px" : "0"}>{mode}</Text>
          </Button>
        ))}
      </HStack>

      <HStack mt="16px" gap={{ base: "18px", md: "30px" }} overflowX="auto" borderBottom="1px solid" borderColor={colors.lightBorder}>
        {actionItemTabs.map((tab) => (
          <Button
            key={tab}
            h="36px"
            px="0"
            bg="transparent"
            borderRadius="0"
            color={activeTab === tab ? colors.primary : colors.secondaryText}
            fontSize="12px"
            fontWeight={activeTab === tab ? "800" : "700"}
            borderBottom="2px solid"
            borderInline='none'
            borderTop='none'
            borderColor={activeTab === tab ? colors.primary : "transparent"}
            _hover={{ color: colors.primary }}
            onClick={() => onActiveTabChange(tab)}
          >
            {tab}
          </Button>
        ))}
      </HStack>

      <HStack justify="flex-end" gap="8px" mt="14px" flexWrap="wrap">
        <HStack
          w={{ base: "full", md: "230px" }}
          h="32px"
          px="10px"
          border="1px solid"
          borderColor={colors.border}
          borderRadius="6px"
          bg={colors.surface}
        >
          <Search size={14} color={colors.secondaryText} />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search actions..."
            border="0"
            p="0"
            h="full"
            color={colors.primaryText}
            fontSize="11px"
            _focus={{ boxShadow: "none" }}
            _placeholder={{ color: colors.mutedText }}
          />
        </HStack>
        <SelectButton label="Source" options={sources} value={source} onChange={onSourceChange} />
        <SelectButton label="Priority" options={priorities} value={priority} onChange={onPriorityChange} />
        <Button h="32px" px="11px" bg={colors.surface} border="1px solid" borderColor={colors.border} borderRadius="6px" fontSize="11px" fontWeight="800" color={colors.primaryText} _hover={{ bg: "#F8FAFD" }}>
          <HStack gap="7px">
            <Text>Sort by: Due Date</Text>
            <ChevronDown size={14} />
          </HStack>
        </Button>
        <Box display={{ base: "none", xl: "block" }} w="0" />
      </HStack>
    </>
  );
}
