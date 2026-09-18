"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { organizationScopes, type OrganizationScope } from "./organizationInfoData";
import { colors } from "@/types/styles";

type OrganizationScopeTabsProps = {
  activeScope: OrganizationScope["value"];
  onScopeChange: (scope: OrganizationScope["value"]) => void;
};

export function OrganizationScopeTabs({ activeScope, onScopeChange }: OrganizationScopeTabsProps) {
  return (
    <HStack
      h="50px"
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="8px"
      overflow="hidden"
      gap={0}
      flexShrink={0}
      w={{ base: "full", lg: "430px" }}
    >
      {organizationScopes.map((scope, index) => {
        const isActive = activeScope === scope.value;

        return (
          <Box
            key={scope.value}
            as="button"
            flex="1"
            h="full"
            px={{ base: "14px", md: "20px" }}
            bg={isActive ? colors.surface : "transparent"}
            border="0"
            borderRight={index === organizationScopes.length - 1 ? "0" : "1px solid"}
            borderColor={colors.lightBorder}
            boxShadow={isActive ? `inset 0 0 0 2px ${colors.primarySoft}` : "none"}
            cursor="pointer"
            onClick={() => onScopeChange(scope.value)}
          >
            <Text
              color={isActive ? colors.primary : colors.secondaryText}
              fontSize="13px"
              fontWeight="800"
              whiteSpace="nowrap"
            >
              {scope.label}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
}
