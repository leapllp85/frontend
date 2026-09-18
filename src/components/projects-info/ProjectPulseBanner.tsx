"use client";

import { useState } from "react";
import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { projectPulseData, type ProjectPulseMetric } from "./projectsInfoData";
import { colors } from "@/types/styles";

function PulseMetric({ metric, isLast }: { metric: ProjectPulseMetric; isLast: boolean }) {
  return (
    <Flex
      align="center"
      gap={{ base: "10px", md: "12px", "2xl": "14px" }}
      h={{ base: "auto", xl: "70px" }}
      pr={{ base: 0, xl: isLast ? 0 : "18px", "2xl": isLast ? 0 : "28px" }}
      borderRight={{ base: "0", xl: isLast ? "0" : "1px solid" }}
      borderColor={colors.border}
      minW={0}
      w="full"
      justify={{ base: "flex-start", xl: "center" }}
    >
      {metric.dotColor && (
        <Box w="10px" h="10px" borderRadius="full" bg={metric.dotColor} flexShrink={0} />
      )}

      <VStack align="flex-start" gap="7px" minW={0}>
        <Text color={colors.primaryText} fontSize={{ base: "24px", md: "28px" }} fontWeight="800" lineHeight="1">
          {metric.value}
        </Text>
        <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.15" whiteSpace="nowrap">
          {metric.label}
        </Text>
      </VStack>
    </Flex>
  );
}

function PulseTrend() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <Box
      position="relative"
      h={{ base: "92px", md: "78px" }}
      minW={0}
      w="full"
      maxW={{ xl: "300px", "2xl": "360px" }}
      overflow="hidden"
    >
      <Box w="full" h="full">
        <svg
          viewBox="0 0 340 96"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
        <path
          d="M12 78 C36 68 44 52 72 60 C94 66 94 46 122 46 C150 46 147 18 177 18 C207 18 202 7 231 7 C258 7 274 11 297 19 C314 25 322 32 332 39"
          fill="none"
          stroke="#1D7FE3"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M231 7 C258 7 274 11 297 19 C314 25 322 32 332 39"
          fill="none"
          stroke="#BFD8F7"
          strokeWidth="2"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <path
          d="M12 78 C36 68 44 52 72 60 C94 66 94 46 122 46 C150 46 147 18 177 18 C207 18 202 7 231 7 L231 96 L12 96 Z"
          fill="url(#pulseFill)"
        />
        <circle cx="231" cy="7" r="6" fill="#1D7FE3" />
        <defs>
          <linearGradient id="pulseFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1D7FE3" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#1D7FE3" stopOpacity="0" />
          </linearGradient>
        </defs>
        </svg>
      </Box>

      <Box
        as="button"
        aria-label={`${projectPulseData.trendLabel}: ${projectPulseData.trendValue}`}
        position="absolute"
        left="68%"
        top="7%"
        w="30px"
        h="30px"
        transform="translate(-50%, -50%)"
        borderRadius="full"
        bg="transparent"
        cursor="pointer"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onFocus={() => setIsTooltipOpen(true)}
        onBlur={() => setIsTooltipOpen(false)}
      />

      <HStack
        position="absolute"
        top={{ base: "14px", md: "6px" }}
        left="68%"
        transform="translateX(-50%)"
        h="38px"
        px="16px"
        gap="34px"
        bg={colors.surface}
        border="1px solid"
        borderColor={colors.lightBorder}
        borderRadius="6px"
        boxShadow="0 8px 22px rgba(11, 12, 28, 0.08)"
        opacity={isTooltipOpen ? 1 : 0}
        pointerEvents="none"
        transition="opacity 140ms ease, transform 140ms ease"
        zIndex={2}
      >
        <Text color={colors.primary} fontSize="13px" fontWeight="800" whiteSpace="nowrap">
          {projectPulseData.trendLabel}
        </Text>
        <Text color={colors.primary} fontSize="13px" fontWeight="800" whiteSpace="nowrap">
          {projectPulseData.trendValue}
        </Text>
      </HStack>
    </Box>
  );
}

export function ProjectPulseBanner() {
  const Icon = projectPulseData.icon;

  return (
    <Box
      w="full"
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="16px"
      boxShadow="0 12px 34px rgba(11, 12, 28, 0.045)"
      overflow="hidden"
    >
      <Grid
        alignItems={{ base: "stretch", xl: "center" }}
        templateColumns={{
          base: "1fr",
          xl: "210px minmax(560px, 1fr) minmax(250px, 300px)",
          "2xl": "230px minmax(710px, 1fr) 360px",
        }}
        gap={{ base: "18px", xl: "20px", "2xl": "28px" }}
        minH={{ base: "auto", xl: "112px" }}
        p={{ base: "20px", md: "22px 26px", xl: "0 32px" }}
        bg="linear-gradient(90deg, #F5F8FF 0%, #FFFFFF 18%, #FFFFFF 67%, #F7FAFF 100%)"
      >
        <VStack
          align="flex-start"
          justify="center"
          gap="12px"
          minW={{ base: "auto", xl: "230px" }}
          flexShrink={0}
        >
          <HStack gap="12px">
            <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1">
              {projectPulseData.title}
            </Text>
            <Box color="#7B61FF" display="flex" alignItems="center">
              <Icon size={17} fill="#7B61FF" />
            </Box>
          </HStack>
          <Text color={colors.secondaryText} fontSize="14px" fontWeight="600" lineHeight="1.2">
            {projectPulseData.subtitle}
          </Text>
        </VStack>

        <Grid
          alignItems="center"
          templateColumns={{
            base: "repeat(auto-fit, minmax(118px, 1fr))",
            md: "repeat(5, minmax(108px, 1fr))",
          }}
          columnGap={{ base: "18px", md: "14px", "2xl": "18px" }}
          rowGap="18px"
          minW={0}
        >
          {projectPulseData.metrics.map((metric, index) => (
            <PulseMetric
              key={metric.label}
              metric={metric}
              isLast={index === projectPulseData.metrics.length - 1}
            />
          ))}
        </Grid>

        <PulseTrend />
      </Grid>
    </Box>
  );
}
