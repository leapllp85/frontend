"use client";

import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { ArrowRight, Code2, Folder, Smartphone } from "lucide-react";
import { organizationActiveProjects, type OrganizationActiveProject } from "./organizationInfoData";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

const projectAccentStyles: Record<
  OrganizationActiveProject["accent"],
  { bg: string; color: string; icon: typeof Code2 }
> = {
  purple: {
    bg: "#F1EDFF",
    color: "#7B61FF",
    icon: Code2,
  },
  green: {
    bg: "#E8F8F0",
    color: colors.success,
    icon: Smartphone,
  },
};

function AvatarStack({ urls, extraMembers }: { urls: readonly string[]; extraMembers: number }) {
  return (
    <HStack gap={0}>
      {urls.map((url, index) => (
        <Box
          key={url}
          w="24px"
          h="24px"
          ml={index === 0 ? 0 : "-7px"}
          borderRadius="full"
          bg={colors.primarySoft}
          bgImage={`url(${url})`}
          bgSize="cover"
          backgroundPosition="center"
          border="2px solid"
          borderColor={colors.surface}
          boxShadow="0 2px 8px rgba(11, 12, 28, 0.08)"
        />
      ))}
      {extraMembers > 0 && (
        <Box
          w="28px"
          h="24px"
          ml="-7px"
          borderRadius="999px"
          bg="#F3F6FA"
          border="2px solid"
          borderColor={colors.surface}
          color={colors.secondaryText}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="10px"
          fontWeight="800"
          lineHeight="1"
        >
          +{extraMembers}
        </Box>
      )}
    </HStack>
  );
}

function ProjectCard({ project }: { project: OrganizationActiveProject }) {
  const accent = projectAccentStyles[project.accent];
  const Icon = accent.icon;

  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="10px"
      p="16px"
      minH="108px"
      boxShadow="0 8px 22px rgba(11, 12, 28, 0.025)"
    >
      <HStack gap="13px" align="flex-start">
        <Box
          w="44px"
          h="44px"
          borderRadius="8px"
          bg={accent.bg}
          color={accent.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon size={20} strokeWidth={2.1} />
        </Box>

        <VStack align="stretch" gap="13px" minW={0} flex="1">
          <VStack align="flex-start" gap="5px" minW={0}>
            <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.2" truncate>
              {project.name}
            </Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1.2">
              {project.memberCount} team members
            </Text>
          </VStack>

          <HStack justify="space-between" gap="16px" align="center">
            <AvatarStack urls={project.avatarUrls} extraMembers={project.extraMembers} />
            <VStack align="flex-end" gap="6px" minW="90px">
              <Text color={colors.primaryText} fontSize="12px" fontWeight="800" lineHeight="1">
                {project.progress}%
              </Text>
              <Box w="82px" h="3px" bg={colors.lightBorder} borderRadius="999px" overflow="hidden">
                <Box
                  w={`${project.progress}%`}
                  h="full"
                  bg={colors.success}
                  borderRadius="999px"
                />
              </Box>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

function ViewAllProjectsCard() {
  return (
    <Box
      as="button"
      h="108px"
      minH="108px"
      bg={colors.surface}
      border="1px dashed"
      borderColor="#C9D6E6"
      borderRadius="10px"
      color={colors.secondaryText}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="18px"
      _hover={{ bg: "#F8FAFD", borderColor: colors.primaryLight, color: colors.primary }}
    >
      <HStack gap="16px">
        <Text fontSize="12px" fontWeight="700" lineHeight="1">
          View all projects
        </Text>
        <ArrowRight size={17} />
      </HStack>
    </Box>
  );
}

export function OrganizationActiveProjects() {
  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      p={{ base: "14px", md: "16px" }}
      overflow="hidden"
    >
      <VStack align="stretch" gap="16px">
        <HStack gap="12px">
          <Box color={colors.secondaryText} display="flex" alignItems="center">
            <Folder size={18} strokeWidth={2} />
          </Box>
          <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.2">
            Active Projects
          </Text>
        </HStack>

        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          gap={{ base: "12px", md: "14px", xl: "16px" }}
          templateColumns={{
            base: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "minmax(0, 1fr) minmax(0, 1fr) 180px",
          }}
        >
          {organizationActiveProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <ViewAllProjectsCard />
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
