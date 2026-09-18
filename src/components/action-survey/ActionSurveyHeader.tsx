"use client";

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Download, RefreshCw, Settings } from "lucide-react";
import { colors } from "@/types/styles";
import { actionSurveyCopy } from "./actionSurveyData";

const headerActions = [
  { label: "Refresh", icon: RefreshCw },
  { label: "Export", icon: Download },
  { label: "Settings", icon: Settings },
] as const;

export function ActionSurveyHeader() {
  return (
    <HStack justify="space-between" align={{ base: "flex-start", md: "center" }} gap="18px" flexWrap={{ base: "wrap", md: "nowrap" }}>
      <VStack align="flex-start" gap="7px" minW={0}>
        <Text as="h1" color={colors.primaryText} fontSize={{ base: "22px", md: "24px" }} fontWeight="800" lineHeight="1.1">
          {actionSurveyCopy.title}
        </Text>
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.4">
          {actionSurveyCopy.subtitle}
        </Text>
      </VStack>

      <HStack gap="12px" flexWrap="wrap">
        {headerActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button key={action.label} h="42px" px="20px" bg={colors.surface} border="1px solid" borderColor={colors.border} borderRadius="6px" color={colors.primaryText} fontSize="13px" fontWeight="800" _hover={{ bg: "#F8FAFD" }}>
              <HStack gap="9px">
                <Icon size={16} strokeWidth={2.2} />
                <Text>{action.label}</Text>
              </HStack>
            </Button>
          );
        })}
      </HStack>
    </HStack>
  );
}
