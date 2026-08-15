"use client";

import { Box, Flex, Grid, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { CalendarDays, ChevronRight, MoreVertical } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { projectDoughnutData, projectDoughnutOptions } from "../../config/chartConfig";
import { criticalMembers, projectStatuses, upcomingDeadlines } from "./data";
import { DetailCard, Sparkline } from "./shared";
import { colors, sectionGap, threeColumnTemplate } from "../../types/styles";

function TopCriticalMembersCard() {
  return (
    <DetailCard title="Top Critical Members" actionLabel="View All">
      <VStack align="stretch" justify={"space-between"} gap={0} flex="1">
        {criticalMembers.map((member, index) => (
          <HStack
            key={member.name}
            h="52px"
            justify="space-between"
            gap="12px"
            borderBottom={index === criticalMembers.length - 1 ? "0" : "1px solid"}
            borderColor={colors.lightBorder}
          >
            <HStack gap="12px" minW={0} flex="1">
              <Box
                h="34px"
                w="34px"
                borderRadius="full"
                bg={member.avatar}
                border="1px solid"
                borderColor={colors.lightBorder}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text color={colors.surface} fontSize="11px" fontWeight="800">
                  {member.initials}
                </Text>
              </Box>
              <VStack align="flex-start" gap={0.5} minW={0}>
                <Text
                  color={colors.primaryText}
                  fontSize="13px"
                  fontWeight="800"
                  lineHeight="1.1"
                  maxW="140px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {member.name}
                </Text>
                <Text color={member.color} fontSize="12px" fontWeight="700" lineHeight="1">
                  {member.risk}
                </Text>
              </VStack>
            </HStack>

            <HStack gap={{ base: "8px", md: "12px" }} flexShrink={0}>
              <Box
                minW="44px"
                h="26px"
                px="8px"
                borderRadius="6px"
                bg={member.risk === "Medium Risk" ? "#FFF3DE" : "#FFE9E8"}
                color={member.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="13px"
                fontWeight="800"
              >
                {member.score}
              </Box>
              <Sparkline points={member.sparkline} color={member.color} />
              <IconButton
                aria-label={`More options for ${member.name}`}
                variant="ghost"
                w="28px"
                minW="28px"
                h="28px"
                color={colors.secondaryText}
                _hover={{ bg: colors.primarySoft }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </HStack>
          </HStack>
        ))}
      </VStack>
    </DetailCard>
  );
}

function ProjectsOverviewCard() {
  return (
    <DetailCard title="Projects Overview" actionLabel="View All">
      <Flex
        flex="1"
        align="center"
        justify="space-between"
        gap={{ base: 5, md: 6 }}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Box
          position="relative"
          w={{ base: "178px", md: "188px" }}
          h={{ base: "178px", md: "188px" }}
          flexShrink={0}
        >
          <Doughnut data={projectDoughnutData} options={projectDoughnutOptions} />
          <VStack
            position="absolute"
            inset="0"
            align="center"
            justify="center"
            gap={1}
            pointerEvents="none"
          >
            <Text
              color={colors.primaryText}
              fontSize={{ base: "30px", md: "34px" }}
              fontWeight="800"
              lineHeight="1"
            >
              20
            </Text>
            <Text color={colors.secondaryText} fontSize="13px" fontWeight="600">
              Total Projects
            </Text>
          </VStack>
        </Box>

        <VStack align="stretch" gap="18px" minW={{ base: "full", sm: "184px" }}>
          {projectStatuses.map((status) => (
            <HStack key={status.label} justify="space-between" gap={4}>
              <HStack gap={3}>
                <Box w="12px" h="12px" borderRadius="full" bg={status.color} />
                <Text color={colors.secondaryText} fontSize="14px" fontWeight="600">
                  {status.label}
                </Text>
              </HStack>
              <HStack gap={1.5}>
                <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                  {status.value}
                </Text>
                <Text color={colors.mutedText} fontSize="13px" fontWeight="600">
                  ({status.percentage}%)
                </Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </Flex>

      <HStack
        mt="16px"
        h="46px"
        px="12px"
        borderRadius="8px"
        bg="#F4F8FE"
        color={colors.secondaryText}
        justify="space-between"
      >
        <HStack gap={3}>
          <CalendarDays size={17} color={colors.secondaryText} />
          <Text fontSize="13px" fontWeight="600">
            2 projects are nearing their deadlines
          </Text>
        </HStack>
        <ChevronRight size={18} color={colors.secondaryText} />
      </HStack>
    </DetailCard>
  );
}

function UpcomingDeadlinesCard() {
  return (
    <DetailCard title="Upcoming Deadlines" actionLabel="View Calendar">
      <VStack align="stretch" gap={0} flex="1">
        {upcomingDeadlines.map((deadline, index) => (
          <HStack
            key={deadline.title}
            minH="58px"
            gap={4}
            py={2.5}
            borderBottom={index === upcomingDeadlines.length - 1 ? "0" : "1px solid"}
            borderColor={colors.lightBorder}
          >
            <VStack
              w="48px"
              h="48px"
              borderRadius="8px"
              bg={deadline.dateBg}
              align="center"
              justify="center"
              gap={0}
              flexShrink={0}
            >
              <Text color={deadline.dateColor} fontSize="11px" fontWeight="800" lineHeight="1">
                {deadline.month}
              </Text>
              <Text
                color={colors.primaryText}
                fontSize="16px"
                fontWeight="800"
                lineHeight="1.15"
              >
                {deadline.day}
              </Text>
            </VStack>

            <VStack align="flex-start" gap={1} minW={0} flex="1">
              <Text
                color={colors.primaryText}
                fontSize="13px"
                fontWeight="800"
                lineHeight="1.15"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                maxW="100%"
              >
                {deadline.title}
              </Text>
              <Text color={deadline.riskColor} fontSize="12px" fontWeight="700" lineHeight="1">
                {deadline.risk}
              </Text>
            </VStack>

            <Box
              px={2.5}
              h="27px"
              borderRadius="6px"
              bg={`${deadline.badgeColor}14`}
              color={deadline.badgeColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="12px"
              fontWeight="800"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {deadline.daysLeft}
            </Box>
          </HStack>
        ))}
      </VStack>
    </DetailCard>
  );
}

export function DetailsSection() {
  return (
    <Grid
      templateColumns={threeColumnTemplate}
      gap={sectionGap}
      mt={{ base: "18px", md: "18px" }}
    >
      <TopCriticalMembersCard />
      <ProjectsOverviewCard />
      <UpcomingDeadlinesCard />
    </Grid>
  );
}
