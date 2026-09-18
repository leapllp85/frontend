"use client";

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { teamMembers, teamRiskStyles, type TeamRiskLevel } from "./teamsInfoData";
import { colors } from "@/types/styles";

const quadrantLabels = [
  { label: "Low Risk\nHigh Health", left: "18%", top: "10%", risk: "Low" },
  { label: "High Risk\nHigh Health", left: "86%", top: "10%", risk: "High" },
  { label: "Low Risk\nLow Health", left: "18%", top: "84%", risk: "Low" },
  { label: "High Risk\nLow Health", left: "86%", top: "84%", risk: "High" },
] as const;

const legendItems: readonly { level: TeamRiskLevel; count: number }[] = [
  { level: "Low", count: 6 },
  { level: "Medium", count: 5 },
  { level: "High", count: 4 },
];

export function TeamHealthDistribution() {
  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      borderRadius="8px"
      bg={colors.surface}
      px={{ base: "18px", md: "22px" }}
      py={{ base: "18px", md: "20px" }}
      h="full"
    >
      <Text color={colors.primaryText} fontSize="14px" fontWeight="800" lineHeight="1.2">
        Team Health Distribution
      </Text>
      <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" mt="7px">
        Team members mapped by Risk Level and Health Score.
      </Text>

      <Box mt="24px" pl="26px" pr="4px">
        <Box position="relative" h={{ base: "300px", md: "330px", xl: "350px" }}>
          <Box
            position="absolute"
            left="0"
            bottom="28px"
            w="100%"
            h="1px"
            bg={colors.lightBorder}
          />
          <Box
            position="absolute"
            left="50%"
            top="0"
            bottom="28px"
            w="1px"
            bg={colors.lightBorder}
          />
          <Box
            position="absolute"
            left="0"
            top="0"
            bottom="28px"
            w="1px"
            bg="#9CA8BD"
          />
          <Box
            position="absolute"
            left="0"
            right="0"
            bottom="28px"
            h="1px"
            bg="#9CA8BD"
          />
          <Box
            position="absolute"
            left="-4px"
            top="-8px"
            w="0"
            h="0"
            borderLeft="5px solid transparent"
            borderRight="5px solid transparent"
            borderBottom="8px solid #9CA8BD"
          />
          <Box
            position="absolute"
            right="-7px"
            bottom="24px"
            w="0"
            h="0"
            borderTop="5px solid transparent"
            borderBottom="5px solid transparent"
            borderLeft="8px solid #9CA8BD"
          />

          <VStack
            position="absolute"
            left="-27px"
            top="0"
            bottom="28px"
            justify="space-between"
            align="flex-start"
          >
            <Text color={colors.primaryText} fontSize="10px" fontWeight="800">
              High
            </Text>
            <Text color={colors.primaryText} fontSize="10px" fontWeight="800">
              Low
            </Text>
          </VStack>
          <Text
            position="absolute"
            left="-39px"
            top="47%"
            color={colors.primaryText}
            fontSize="10px"
            fontWeight="800"
            transform="rotate(-90deg)"
            whiteSpace="nowrap"
          >
            Score
          </Text>

          {quadrantLabels.map((quadrant) => {
            const style = teamRiskStyles[quadrant.risk];

            return (
              <Box
                key={`${quadrant.label}-${quadrant.left}`}
                position="absolute"
                left={quadrant.left}
                top={quadrant.top}
                transform="translate(-50%, -50%)"
                px="13px"
                py="10px"
                borderRadius="6px"
                bg={style.bg}
                textAlign="center"
                minW="76px"
              >
                {quadrant.label.split("\n").map((line) => (
                  <Text
                    key={line}
                    color={style.color}
                    fontSize="10px"
                    fontWeight="800"
                    lineHeight="1.2"
                  >
                    {line}
                  </Text>
                ))}
              </Box>
            );
          })}

          {teamMembers.map((member) => {
            const style = teamRiskStyles[member.riskLevel];

            return (
              <Box
                key={member.initials}
                position="absolute"
                left={`${member.distribution.risk}%`}
                top={`${100 - member.distribution.health}%`}
                transform="translate(-50%, -50%)"
                w="25px"
                h="25px"
                borderRadius="full"
                bg={colors.surface}
                color={style.color}
                border="1.5px solid"
                borderColor={style.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="10px"
                fontWeight="800"
                boxShadow="0 6px 16px rgba(11, 12, 28, 0.08)"
                zIndex={2}
              >
                {member.initials}
              </Box>
            );
          })}

          <Flex
            position="absolute"
            left="0"
            right="0"
            bottom="-2px"
            justify="space-between"
            align="center"
          >
            <Text color={colors.primaryText} fontSize="10px" fontWeight="800">
              Low
            </Text>
            <Text color={colors.primaryText} fontSize="10px" fontWeight="800">
              Risk Level
            </Text>
            <Text color={colors.primaryText} fontSize="10px" fontWeight="800">
              High
            </Text>
          </Flex>
        </Box>
      </Box>

      <Flex
        mt="18px"
        justify={{ base: "flex-start", md: "center", xl: "space-between" }}
        gap="18px"
        wrap="wrap"
      >
        {legendItems.map((item) => {
          const style = teamRiskStyles[item.level];

          return (
            <HStack key={item.level} gap="8px">
              <Box w="10px" h="10px" borderRadius="full" bg={style.color} />
              <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                {style.label} ({item.count})
              </Text>
            </HStack>
          );
        })}
      </Flex>
    </Box>
  );
}
