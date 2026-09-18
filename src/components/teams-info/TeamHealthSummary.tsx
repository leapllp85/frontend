"use client";

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import {
  healthPillars,
  needsAttentionItems,
  teamHealthSummary,
} from "./teamsInfoData";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

const roomyDesktopQuery = "@media (min-width: 1650px)";

function OverallTeamHealth() {
  return (
    <Flex
      align="center"
      gap={{ base: "22px", md: "28px", lg: "12px", xl: "14px" }}
      minW={{ base: "full", lg: "244px", xl: "262px" }}
      justify={{ base: "flex-start", lg: "center" }}
      css={{
        [roomyDesktopQuery]: {
          gap: "28px",
          minWidth: "340px",
        },
      }}
    >
      <Box
        position="relative"
        w={{ base: "190px", lg: "124px", xl: "136px" }}
        h={{ base: "150px", lg: "102px", xl: "112px" }}
        flexShrink={0}
        css={{
          [roomyDesktopQuery]: {
            width: "190px",
            height: "150px",
          },
        }}
      >
        <svg viewBox="0 0 180 140" width="100%" height="100%" aria-hidden="true">
          <path
            d="M35 118 A70 70 0 0 1 145 35"
            fill="none"
            stroke={colors.lightBorder}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M35 118 A70 70 0 0 1 145 35"
            fill="none"
            stroke={colors.success}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="172 230"
          />
          <path
            d="M145 35 A70 70 0 0 1 158 118"
            fill="none"
            stroke="#EEF1F5"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        <VStack
          position="absolute"
          left="0"
          right="0"
          top={{ base: "54px", lg: "36px", xl: "40px" }}
          align="center"
          gap="2px"
          pointerEvents="none"
          css={{
            [roomyDesktopQuery]: {
              top: "54px",
            },
          }}
        >
          <Text
            color={colors.primaryText}
            fontSize={{ base: "50px", lg: "35px", xl: "38px" }}
            fontWeight="800"
            lineHeight="0.95"
            css={{
              [roomyDesktopQuery]: {
                fontSize: "50px",
              },
            }}
          >
            {teamHealthSummary.score}
          </Text>
          <Text
            color={colors.secondaryText}
            fontSize={{ base: "20px", lg: "15px", xl: "16px" }}
            fontWeight="700"
            lineHeight="1"
            css={{
              [roomyDesktopQuery]: {
                fontSize: "20px",
              },
            }}
          >
            /{teamHealthSummary.total}
          </Text>
        </VStack>
      </Box>

      <VStack
        align="flex-start"
        gap={{ base: "14px", lg: "9px", xl: "10px" }}
        minW={0}
        css={{
          [roomyDesktopQuery]: {
            gap: "14px",
          },
        }}
      >
        <Text
          color={colors.primaryText}
          fontSize={{ base: "15px", lg: "13px", xl: "14px" }}
          fontWeight="800"
          lineHeight="1"
          whiteSpace="nowrap"
          css={{
            [roomyDesktopQuery]: {
              fontSize: "15px",
            },
          }}
        >
          Overall Team Health
        </Text>
        <HStack
          gap={{ base: "9px", lg: "5px", xl: "6px" }}
          whiteSpace="nowrap"
          css={{
            [roomyDesktopQuery]: {
              gap: "9px",
            },
          }}
        >
          <ArrowUp size={16} color={colors.success} strokeWidth={2.4} />
          <Text
            color={colors.success}
            fontSize={{ base: "14px", lg: "12px", xl: "13px" }}
            fontWeight="800"
            css={{
              [roomyDesktopQuery]: {
                fontSize: "14px",
              },
            }}
          >
            {teamHealthSummary.change}
          </Text>
          <Text
            color={colors.secondaryText}
            fontSize={{ base: "13px", lg: "11px", xl: "12px" }}
            fontWeight="600"
            css={{
              [roomyDesktopQuery]: {
                fontSize: "13px",
              },
            }}
          >
            vs last month
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
}

function HealthPillars() {
  return (
    <Box flex="1" minW={0}>
      <Text
        color={colors.primaryText}
        fontSize={{ base: "15px", lg: "14px" }}
        fontWeight="800"
        mb={{ base: "26px", lg: "20px", xl: "22px" }}
        css={{
          [roomyDesktopQuery]: {
            marginBottom: "26px",
            fontSize: "15px",
          },
        }}
      >
        Health Pillars
      </Text>
      <Flex
        align="stretch"
        justify="space-between"
        gap={{ base: "18px", lg: 0 }}
        flexDir={{ base: "column", md: "row" }}
        flexWrap={{ base: "nowrap", md: "wrap", lg: "nowrap" }}
      >
        {healthPillars.map((pillar, index) => {
          const Icon = pillar.icon;
          const isDown = pillar.trend === "down";
          const TrendIcon = isDown ? ArrowDown : ArrowUp;

          return (
            <VStack
              key={pillar.label}
              align="center"
              gap={{ base: "13px", lg: "8px", xl: "9px" }}
              flex="1"
              flexBasis={{ base: "full", md: "calc(50% - 9px)", lg: 0 }}
              minW={{ base: "full", md: "220px", lg: 0 }}
              px={{ base: 0, md: "18px", lg: "5px", xl: "8px" }}
              py={{ base: 0, md: "4px", lg: 0 }}
              borderLeft={index === 0 ? "0" : { base: "0", lg: "1px solid" }}
              borderTop={index < 2 ? "0" : { base: "0", md: "1px solid", lg: "0" }}
              borderColor={colors.lightBorder}
              css={{
                [roomyDesktopQuery]: {
                  gap: "13px",
                  paddingInline: "18px",
                },
              }}
            >
              <Box
                w={{ base: "54px", lg: "44px", xl: "48px" }}
                h={{ base: "54px", lg: "44px", xl: "48px" }}
                borderRadius="full"
                bg={pillar.iconBg}
                color={pillar.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
                css={{
                  [roomyDesktopQuery]: {
                    width: "54px",
                    height: "54px",
                  },
                }}
              >
                <Icon size={25} strokeWidth={2.2} />
              </Box>
              <Text
                color={colors.primaryText}
                fontSize={{ base: "30px", lg: "25px", xl: "27px" }}
                fontWeight={{ base: "800", lg: "700" }}
                lineHeight="1"
                css={{
                  [roomyDesktopQuery]: {
                    fontSize: "30px",
                    fontWeight: 800,
                  },
                }}
              >
                {pillar.score}
              </Text>
              <Text
                color={colors.secondaryText}
                fontSize={{ base: "13px", lg: "11px", xl: "12px" }}
                fontWeight={{ base: "700", lg: "600" }}
                lineHeight="1.25"
                textAlign="center"
                whiteSpace="nowrap"
                css={{
                  [roomyDesktopQuery]: {
                    fontSize: "13px",
                    fontWeight: 700,
                  },
                }}
              >
                {pillar.label}
              </Text>
              <HStack
                gap={{ base: "8px", lg: "3px", xl: "4px" }}
                whiteSpace="nowrap"
                css={{
                  [roomyDesktopQuery]: {
                    gap: "8px",
                  },
                }}
              >
                <Box
                  color={isDown ? colors.danger : colors.success}
                  display="flex"
                  transform={{ base: "none", lg: "scale(0.8)", xl: "scale(0.86)" }}
                  css={{
                    [roomyDesktopQuery]: {
                      transform: "none",
                    },
                  }}
                >
                  <TrendIcon size={14} />
                </Box>
                <Text
                  color={isDown ? colors.danger : colors.success}
                  fontSize={{ base: "12px", lg: "10px", xl: "11px" }}
                  fontWeight={{ base: "800", lg: "700" }}
                  whiteSpace="nowrap"
                  css={{
                    [roomyDesktopQuery]: {
                      fontSize: "12px",
                      fontWeight: 800,
                    },
                  }}
                >
                  {pillar.change}
                </Text>
                <Text
                  color={colors.secondaryText}
                  fontSize={{ base: "12px", lg: "10px", xl: "11px" }}
                  fontWeight={{ base: "600", lg: "500" }}
                  whiteSpace="nowrap"
                  css={{
                    [roomyDesktopQuery]: {
                      fontSize: "12px",
                      fontWeight: 600,
                    },
                  }}
                >
                  vs last month
                </Text>
              </HStack>
            </VStack>
          );
        })}
      </Flex>
    </Box>
  );
}

function NeedsAttention() {
  return (
    <VStack
      align="stretch"
      gap={{ base: "19px", lg: "15px", xl: "17px" }}
      minW={{ base: "full", lg: "260px", xl: "286px" }}
      css={{
        [roomyDesktopQuery]: {
          gap: "19px",
          minWidth: "360px",
        },
      }}
    >
      <Text color={colors.primaryText} fontSize="15px" fontWeight="800">
        Needs Attention
      </Text>

      <VStack
        align="stretch"
        gap={{ base: "16px", lg: "13px", xl: "14px" }}
        css={{
          [roomyDesktopQuery]: {
            gap: "16px",
          },
        }}
      >
        {needsAttentionItems.map((item) => (
          <HStack key={item.name} justify="space-between" gap={{ base: "16px", lg: "10px", xl: "16px" }}>
            <HStack gap={{ base: "14px", lg: "10px", xl: "14px" }} minW={0}>
              <Box
                w="44px"
                h="44px"
                borderRadius="full"
                bg={item.avatarBg}
                color={item.statusColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="14px"
                fontWeight="800"
                flexShrink={0}
              >
                {item.initials}
              </Box>
              <VStack align="flex-start" gap="3px" minW={0}>
                <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.2">
                  {item.name}
                </Text>
                <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.2">
                  {item.detail}
                </Text>
              </VStack>
            </HStack>

            <Box
              px="13px"
              h="28px"
              borderRadius="6px"
              bg={`${item.statusColor}14`}
              color={item.statusColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="12px"
              fontWeight="800"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {item.status}
            </Box>
          </HStack>
        ))}
      </VStack>

      <HStack color={colors.primary} gap="10px" pt="2px">
        <Text fontSize="14px" fontWeight="800">
          View all priorities
        </Text>
        <ChevronRight size={17} />
      </HStack>
    </VStack>
  );
}

export function TeamHealthSummary() {
  return (
    <Flex
      mt={{ base: "26px", md: "28px" }}
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      px={{ base: "22px", md: "28px", xl: "34px" }}
      py={{ base: "24px", md: "28px" }}
      gap={{ base: "28px", lg: "12px", xl: "14px" }}
      align="stretch"
      flexDir={{ base: "column", lg: "row" }}
      css={{
        [roomyDesktopQuery]: {
          gap: "34px",
        },
      }}
    >
      <OverallTeamHealth />

      <Box
        w={{ base: "full", lg: "1px" }}
        h={{ base: "1px", lg: "auto" }}
        bg={colors.lightBorder}
        flexShrink={0}
      />

      <HealthPillars />

      <Box
        w={{ base: "full", lg: "1px" }}
        h={{ base: "1px", lg: "auto" }}
        bg={colors.lightBorder}
        flexShrink={0}
      />

      <NeedsAttention />
    </Flex>
  );
}
