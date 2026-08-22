"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import {
  CalendarDays,
  ChevronRight,
  ChevronUp,
  X,
} from "lucide-react";
import {
  projectCriticalityStyles,
  projectStatusStyles,
  type ProjectContributor,
  type ProjectInfo,
} from "./projectsInfoData";
import { colors } from "@/types/styles";

type ProjectDetailsPanelProps = {
  project: ProjectInfo;
  onClose: () => void;
};

function DetailBadge({
  label,
  style,
}: {
  label: string;
  style: { color: string; bg: string };
}) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      h="23px"
      px="9px"
      borderRadius="5px"
      bg={style.bg}
      color={style.color}
      fontSize="12px"
      fontWeight="700"
      lineHeight="1"
      whiteSpace="nowrap"
    >
      {label}
    </Box>
  );
}

function ProjectHeroIcon({ project }: { project: ProjectInfo }) {
  const Icon = project.icon;

  return (
    <Box
      w="64px"
      h="64px"
      borderRadius="10px"
      bg={project.iconBg}
      color={project.iconColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Icon size={31} strokeWidth={2.1} />
    </Box>
  );
}

function ContributorInitial({ contributor }: { contributor: ProjectContributor }) {
  return (
    <Box
      w="32px"
      h="32px"
      borderRadius="full"
      bg={contributor.bg}
      color={contributor.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="12px"
      fontWeight="800"
      lineHeight="1"
    >
      {contributor.initials}
    </Box>
  );
}

function ContributorRow({ contributor }: { contributor: ProjectContributor }) {
  return (
    <HStack gap="12px" py="12px" borderBottom="1px solid" borderColor={colors.lightBorder}>
      <Box
        w="32px"
        h="32px"
        borderRadius="full"
        bg={contributor.bg}
        bgImage={`url(${contributor.avatarUrl})`}
        bgSize="cover"
        backgroundPosition="center"
        flexShrink={0}
      />
      <VStack align="flex-start" gap="3px" minW={0}>
        <Text color={colors.primaryText} fontSize="12px" fontWeight="800" lineHeight="1.15" truncate>
          {contributor.name}
        </Text>
        <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1.15" truncate>
          {contributor.role}
        </Text>
      </VStack>
    </HStack>
  );
}

export function ProjectDetailsPanel({ project, onClose }: ProjectDetailsPanelProps) {
  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="12px"
      boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)"
      overflow="hidden"
      minW={0}
      h="full"
    >
      <VStack align="stretch" gap="0">
        <Flex align="center" justify="space-between" px="24px" pt="24px" pb="18px">
          <Text color={colors.primaryText} fontSize="16px" fontWeight="800" lineHeight="1">
            Project Details
          </Text>
          <HStack gap="18px">
            <ChevronUp size={16} color={colors.secondaryText} />
            <Box
              as="button"
              aria-label="Close project details"
              w="18px"
              h="18px"
              color={colors.secondaryText}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="transparent"
              border="0"
              cursor="pointer"
              onClick={onClose}
            >
              <X size={16} />
            </Box>
          </HStack>
        </Flex>

        <Box px={{ base: "18px", md: "22px" }} pb={{ base: "18px", md: "22px" }}>
          <Box border="1px solid" borderColor={colors.border} borderRadius="9px" overflow="hidden">
            <Box
              p={{ base: "18px", md: "22px" }}
              bg="linear-gradient(135deg, #F7FAFF 0%, #FFFFFF 68%)"
            >
              <HStack gap="18px" align="center">
                <ProjectHeroIcon project={project} />
                <VStack align="flex-start" gap="8px" minW={0}>
                  <Text color={colors.primary} fontSize="15px" fontWeight="800" lineHeight="1.2" truncate>
                    {project.name}
                  </Text>
                  <DetailBadge label={project.status} style={projectStatusStyles[project.status]} />
                  <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1">
                    Project ID: {project.projectId}
                  </Text>
                </VStack>
              </HStack>
            </Box>

            <Flex borderTop="1px solid" borderColor={colors.lightBorder}>
              <VStack align="flex-start" gap="8px" flex="1" p="20px">
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                  Business Unit
                </Text>
                <Text color={colors.secondaryText} fontSize="13px" fontWeight="600">
                  {project.businessUnit}
                </Text>
              </VStack>
              <Box w="1px" bg={colors.lightBorder} />
              <VStack align="flex-start" gap="8px" flex="1" p="20px">
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
                  Criticality
                </Text>
                <DetailBadge
                  label={project.criticality}
                  style={projectCriticalityStyles[project.criticality]}
                />
              </VStack>
            </Flex>

            <VStack
              align="stretch"
              gap="12px"
              p="20px"
              borderTop="1px solid"
              borderColor={colors.lightBorder}
            >
              <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
                Description
              </Text>
              <Text color={colors.secondaryText} fontSize="12px" fontWeight="500" lineHeight="1.55">
                {project.description}
              </Text>
            </VStack>

            <VStack
              align="stretch"
              gap="16px"
              p="20px"
              borderTop="1px solid"
              borderColor={colors.lightBorder}
            >
              <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
                Timeline
              </Text>
              <Flex align="center" gap="14px">
                <VStack align="flex-start" gap="8px" flex="1">
                  <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
                    Start Date
                  </Text>
                  <HStack gap="8px">
                    <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">
                      {project.startDate}
                    </Text>
                    <CalendarDays size={15} color={colors.primary} />
                  </HStack>
                </VStack>
                <ChevronRight size={17} color={colors.secondaryText} />
                <VStack align="flex-start" gap="8px" flex="1">
                  <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
                    Go Live
                  </Text>
                  <HStack gap="8px">
                    <Text color={colors.secondaryText} fontSize="12px" fontWeight="600">
                      {project.goLiveDate}
                    </Text>
                    <CalendarDays size={15} color={colors.primary} />
                  </HStack>
                </VStack>
              </Flex>
            </VStack>

            <VStack
              align="stretch"
              gap="16px"
              p="20px"
              borderTop="1px solid"
              borderColor={colors.lightBorder}
            >
              <Flex justify="space-between" align="center" gap="16px">
                <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
                  Contributors ({project.contributors.length})
                </Text>
                <Button
                  h="34px"
                  px="14px"
                  borderRadius="6px"
                  bg={colors.surface}
                  border="1px solid"
                  borderColor={colors.border}
                  color={colors.primary}
                  fontSize="12px"
                  fontWeight="800"
                  _hover={{ bg: colors.primarySoft }}
                >
                  View all
                </Button>
              </Flex>

              <HStack gap="10px">
                {project.contributors.map((contributor) => (
                  <ContributorInitial key={contributor.initials} contributor={contributor} />
                ))}
              </HStack>

              <VStack align="stretch" gap="0">
                {project.contributors.map((contributor) => (
                  <ContributorRow key={contributor.initials} contributor={contributor} />
                ))}
              </VStack>
            </VStack>
          </Box>

        </Box>
      </VStack>
    </Box>
  );
}
