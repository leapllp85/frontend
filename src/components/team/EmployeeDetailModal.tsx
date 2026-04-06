'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  Badge,
  SimpleGrid,
  Spinner,
  IconButton,
  Dialog,
  Button
} from '@chakra-ui/react';
import { X, Users, FolderKanban, TrendingUp, AlertTriangle } from 'lucide-react';
import { teamApi, projectApi, metricsApi, notificationsApi } from '@/services';
import type { TeamStats, ProjectStats, ProjectRisksResponse, ProjectMetrics, NotificationsResponse } from '@/services';
import { TeamMember } from '@/types';
import { AttritionAnalysis } from '../profile/AttritionAnalysis';
import { ProfileMetricsGrid } from '../profile/ProfileMetricsGrid';
import { ProfileBottomSection } from '../profile/ProfileBottomSection';
import { CriticalMembersDialog } from '../profile/CriticalMembersDialog';
import { MOCK_AT_RISK_PROJECTS } from '@/constants/index';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: TeamMember | null;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [projectRisks, setProjectRisks] = useState<ProjectRisksResponse | null>(null);
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

  useEffect(() => {
    console.log('EmployeeDetailModal - isOpen:', isOpen, 'employee:', employee);
    if (isOpen && employee) {
      console.log('Fetching employee data for:', employee.name);
      fetchEmployeeData();
    }
  }, [isOpen, employee]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      
      const [
        teamStatsResponse,
        projectStatsResponse,
        projectRisksResponse,
        metricsResponse,
        notificationsResponse
      ] = await Promise.all([
        teamApi.getTeamStats().catch(() => null),
        projectApi.getProjectStats().catch(() => null),
        projectApi.getProjectRisks().catch(() => null),
        metricsApi.getProjectMetrics().catch(() => null),
        notificationsApi.getNotifications().catch(() => null)
      ]);
      
      setTeamStats(teamStatsResponse);
      setProjectStats(projectStatsResponse);
      setProjectRisks(projectRisksResponse);
      setMetrics(metricsResponse);
      setNotifications(notificationsResponse);
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!employee) {
    console.log('EmployeeDetailModal - No employee, returning null');
    return null;
  }

  console.log('EmployeeDetailModal - Rendering modal. Loading:', loading, 'Stats:', { teamStats, projectStats, projectRisks, metrics });
  console.log('ProfileMetricsGrid props:', { teamStats, projectStats, projectRisks, metrics });
  console.log('AttritionAnalysis userId:', employee.id);
  console.log('ProfileBottomSection userId:', employee.id, 'projectRisks:', projectRisks);

  return (
    <Dialog.Root 
      open={isOpen} 
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
    >
      <Dialog.Backdrop 
        bg="blackAlpha.600" 
        backdropFilter="blur(4px)"
        zIndex={9998}
      />
      <Dialog.Positioner zIndex={9999}>
        <Dialog.Content
          maxW="80vw"
          maxH="90vh"
          bg="#f4f6f9"
          borderRadius="2xl"
          overflow="hidden"
          shadow="2xl"
          p={0}
        >
          <Box
            h="90vh"
            display="flex"
            flexDirection="column"
          >
            {/* Header */}
            <Box
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              p={6}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack gap={4}>
                <Box
                  w="60px"
                  h="60px"
                  borderRadius="full"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                  shadow="lg"
                >
                  {employee.name.charAt(0).toUpperCase()}
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="xl" color="gray.800" fontWeight="700">
                    {employee.name}
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    {employee.email}
                  </Text>
                </VStack>
                <Badge
                  colorScheme={
                    employee.attritionRisk === 'High' ? 'red' :
                    employee.attritionRisk === 'Medium' ? 'orange' : 'green'
                  }
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontWeight="600"
                >
                  {employee.attritionRisk} Risk
                </Badge>
              </HStack>
              <IconButton
                aria-label="Close modal"
                onClick={onClose}
                variant="ghost"
                size="lg"
                colorScheme="gray"
              >
                <X size={24} />
              </IconButton>
            </Box>

            {/* Content */}
            <Box
              flex="1"
              overflow="auto"
              p={6}
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555'
                }
              }}
            >
              <VStack gap={6} align="stretch" w="full" maxW="1920px" mx="auto">
                {/* Test Box - Remove after debugging */}
                <Box bg="blue.100" p={4} borderRadius="md" border="2px solid" borderColor="blue.500">
                  <Text fontSize="md" fontWeight="bold" color="blue.800">
                    ✅ Modal Content Area is Rendering
                  </Text>
                  <Text fontSize="sm" color="blue.700">
                    Employee: {employee.name} | ID: {employee.id} | Loading: {loading ? 'Yes' : 'No'}
                  </Text>
                </Box>

                {loading && (
                  <Box 
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    zIndex={10}
                    bg="whiteAlpha.900"
                    p={6}
                    borderRadius="xl"
                    shadow="xl"
                  >
                    <VStack gap={4}>
                      <Spinner size="xl" color="purple.500" />
                      <Text fontSize="lg" color="gray.600" fontWeight="600">Loading employee data...</Text>
                    </VStack>
                  </Box>
                )}
                
                {/* Metric Cards Row */}
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={2} fontWeight="600">📊 Metric Cards</Text>
                  <ProfileMetricsGrid
                    teamStats={teamStats}
                    projectStats={projectStats}
                    projectRisks={projectRisks}
                    metrics={metrics}
                  />
                </Box>

                {/* Attrition Risk Analysis */}
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={2} fontWeight="600">📈 Attrition Risk Analysis</Text>
                  <Box h="460px" flexShrink={0} overflow="hidden" w="full">
                    <AttritionAnalysis userId={employee.id} />
                  </Box>
                </Box>

                {/* Bottom Row - Critical Members and Project Risks */}
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={2} fontWeight="600">👥 Critical Members & Project Risks</Text>
                  <ProfileBottomSection
                    userId={employee.id}
                    projectRisks={projectRisks}
                    onMappingClick={() => setIsMappingModalOpen(true)}
                  />
                </Box>

                {/* Member-Project Mapping Modal */}
                <CriticalMembersDialog
                  isOpen={isMappingModalOpen}
                  onClose={() => setIsMappingModalOpen(false)}
                  projects={MOCK_AT_RISK_PROJECTS as any}
                />
              </VStack>
            </Box>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
