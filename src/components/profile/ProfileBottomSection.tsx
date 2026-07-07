'use client';

import React from 'react';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { ArrowLeftRight } from 'lucide-react';
import { CriticalTeamMembers } from './criticality/CriticalTeamMembers';
import { ProjectRisks } from './ProjectRisks';
import type { ProjectRisksResponse } from '../../services';

interface ProfileBottomSectionProps {
  userId: string | undefined;
  projectRisks: ProjectRisksResponse | null;
  onMappingClick: () => void;
}

export const ProfileBottomSection: React.FC<ProfileBottomSectionProps> = ({
  userId,
  projectRisks,
  onMappingClick,
}) => {
  return (
    <Box w="full" position="relative">
      <HStack 
        gap={5} 
        w="full"
        align="stretch"
      >
        {/* Critical Team Members */}
        <Box
          flex={1}
          bg="white"
          borderRadius="2xl"
          p={5}
          shadow="0 2px 12px rgba(0,0,0,0.06)"
          border="1px solid"
          borderColor="gray.100"
        >
          <CriticalTeamMembers userId={userId} />
        </Box>

        {/* Project Risks */}
        <Box
          flex={1}
          bg="white"
          borderRadius="2xl"
          p={5}
          shadow="0 2px 12px rgba(0,0,0,0.06)"
          border="1px solid"
          borderColor="gray.100"
        >
          <ProjectRisks projects={projectRisks?.projects} />
        </Box>
      </HStack>

      {/* Overlapping Button */}
      <IconButton
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        size="sm"
        borderRadius="full"
        bg="white"
        border="2px solid"
        borderColor="gray.300"
        shadow="lg"
        _hover={{
          bg: 'blue.50',
          borderColor: 'blue.400',
          shadow: 'xl',
          transform: 'translate(-50%, -50%) scale(1.1)',
        }}
        transition="all 0.2s ease"
        zIndex={10}
        aria-label="View member-project mapping"
        onClick={onMappingClick}
      >
        <ArrowLeftRight size={16} color="#3B82F6" />
      </IconButton>
    </Box>
  );
};
