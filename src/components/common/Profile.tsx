'use client';

import React, { useState, useEffect } from "react";
import { Box, Grid, VStack, Card, Text, Spinner, GridItem, HStack, Heading, SimpleGrid, IconButton, Badge, Flex, Dialog, Button } from "@chakra-ui/react";
import { User, Users, UsersRound, FolderKanban, AlertTriangle, TrendingUp, ArrowLeftRight, X, Calendar, TrendingDown } from "lucide-react";
import { userApi, actionItemApi, projectApi, teamApi, metricsApi, notificationsApi } from '../../services';
import type { TeamStats, ProjectStats, ProjectRisksResponse, ProjectMetrics, NotificationsResponse } from '../../services';
import type { UserProfile } from "../../services/userApi";
import { AttritionAnalysis } from "../profile/AttritionAnalysis";
import { CriticalTeamMembers } from "../profile/criticality/CriticalTeamMembers";
import { StatsRow } from "../profile/StatsRow";
import { AttritionTrendsPanel } from "../profile/AttritionTrendsPanel";
import { HealthMetrics } from "../profile/HealthMetrics";
import { ProjectRisks } from "../profile/ProjectRisks";
import { LoadingScreen } from "./LoadingScreen";

type ProfileData = UserProfile;

export const Profile = ({
  width = "full",
}: {
  width: string;
}) => {
  const username = localStorage.getItem("username");
  const [user, setUser] = useState<any>(null);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [projectRisks, setProjectRisks] = useState<ProjectRisksResponse | null>(null);
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting Profile data fetch...');
      
      const [
        userResponse,
        actionItemsResponse,
        projectsResponse,
        teamStatsResponse,
        projectStatsResponse,
        projectRisksResponse,
        metricsResponse,
        notificationsResponse
      ] = await Promise.all([
        userApi.getCurrentUserProfile(),
        actionItemApi.getActionItems(),
        projectApi.getMyProjects(),
        teamApi.getTeamStats().catch(() => null),
        projectApi.getProjectStats().catch(() => null),
        projectApi.getProjectRisks().catch(() => null),
        metricsApi.getProjectMetrics().catch(() => null),
        notificationsApi.getNotifications().catch(() => null)
      ]);
      
      console.log('API Responses received:');
      console.log('- userResponse:', userResponse);
      console.log('- actionItemsResponse:', actionItemsResponse);
      console.log('- projectsResponse:', projectsResponse);
      console.log('- teamStatsResponse:', teamStatsResponse);
      console.log('- projectStatsResponse:', projectStatsResponse);
      console.log('- projectRisksResponse:', projectRisksResponse);
      console.log('- metricsResponse:', metricsResponse);
      console.log('- notificationsResponse:', notificationsResponse);
      
      setUser(userResponse);
      
      // Handle paginated responses properly
      if (actionItemsResponse?.results?.action_items) {
        setActionItems(actionItemsResponse.results.action_items);
      } else if (Array.isArray(actionItemsResponse)) {
        setActionItems(actionItemsResponse);
      } else {
        setActionItems([]);
      }
      
      if (projectsResponse?.results?.projects) {
        setProjects(projectsResponse.results.projects);
      } else if (Array.isArray(projectsResponse)) {
        setProjects(projectsResponse);
      } else {
        setProjects([]);
      }
      
      setTeamStats(teamStatsResponse);
      setProjectStats(projectStatsResponse);
      setProjectRisks(projectRisksResponse);
      setMetrics(metricsResponse);
      setNotifications(notificationsResponse);
      
      console.log('State updated successfully');
    } catch (err) {
      console.error('Error fetching profile data:', err);
      console.error('Full error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      });
      setError(err instanceof Error ? err.message : 'Failed to load profile data');
    } finally {
      console.log('Profile data fetch completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // Mock data for at-risk projects with critical members
  const atRiskProjectsWithCriticalMembers = [
    {
      projectName: 'Website Redesign',
      riskLevel: 'High Risk',
      progress: 11,
      dueDate: 'Dec 25, 2024',
      criticalMembers: [
        { name: 'Alice Brown', criticality: 'High', attritionRisk: 'High' },
        { name: 'Maya Patel', criticality: 'High', attritionRisk: 'High' }
      ]
    },
    {
      projectName: '6-month design retainer',
      riskLevel: 'High Risk',
      progress: 100,
      dueDate: 'Nov 25, 2024',
      criticalMembers: [
        { name: 'David Martinez', criticality: 'High', attritionRisk: 'High' }
      ]
    },
    {
      projectName: 'Email Marketing Services',
      riskLevel: 'Medium Risk',
      progress: 33,
      dueDate: 'Nov 25, 2024',
      criticalMembers: [
        { name: 'Alice Brown', criticality: 'High', attritionRisk: 'High' },
        { name: 'Jane Smith', criticality: 'High', attritionRisk: 'Medium' }
      ]
    },
    {
      projectName: 'Strategy Workshop',
      riskLevel: 'Medium Risk',
      progress: 25,
      dueDate: 'Nov 25, 2024',
      criticalMembers: [
        { name: 'Maya Patel', criticality: 'High', attritionRisk: 'High' },
        { name: 'Marcus Thompson', criticality: 'High', attritionRisk: 'High' }
      ]
    }
  ];

  if (error) {
    return (
      <Box 
        w={width} 
        h="full" 
        bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={6}
        overflow="hidden"
      >
        <Card.Root
          bg="whiteAlpha.900"
          backdropFilter="blur(10px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
          shadow="sm"
          p={8}
        >
          <Card.Body>
            <VStack gap={0}>
              <Box p={3} bg="red.100" borderRadius="full" color="red.600">
                <User size={24} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="red.600" textAlign="center">
                Error loading profile: {error}
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box 
      w="full"
      h="100vh" 
      bg="#f5f5f5"
      overflow="hidden"
    >
      {/* Main Dashboard */}
      <Box h="full" w="full" p={0}>
        <VStack flex={1} minW={0} h="full" gap={3} align="stretch" w="full" p={3} pt={3}>
            {/* Metric Cards Row */}
            <SimpleGrid columns={4} gap={3} w="full">
              {/* Team Members Card */}
              <Box 
                bg="linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 100%)" 
                borderRadius="xl" 
                p={4} 
                transform="translateY(-4px)"
                boxShadow="0 8px 20px rgba(20, 184, 166, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(20, 184, 166, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium">
                      Team Members
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {teamStats?.team_members_count || 0}
                    </Text>
                  </VStack>
                  <Box p={2} bg="teal.100" borderRadius="lg">
                    <UsersRound size={20} color="#14b8a6" />
                  </Box>
                </HStack>
              </Box>

              {/* Total Projects Card */}
              <Box 
                bg="linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)" 
                borderRadius="xl" 
                p={4} 
                transform="translateY(-4px)"
                boxShadow="0 8px 20px rgba(99, 102, 241, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(99, 102, 241, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium">
                      Total Projects
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {projectStats?.total_projects || 0}
                    </Text>
                  </VStack>
                  <Box p={2} bg="indigo.100" borderRadius="lg">
                    <FolderKanban size={20} color="#6366f1" />
                  </Box>
                </HStack>
              </Box>

              {/* Attrition Risk Card */}
              <Box 
                bg="linear-gradient(135deg, #fef3c7 0%, #fefce8 100%)" 
                borderRadius="xl" 
                p={4} 
                transform="translateY(-4px)"
                boxShadow="0 8px 20px rgba(245, 158, 11, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(245, 158, 11, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium">
                      Attrition Risk
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                      {metrics?.data?.attrition_risk || 0}%
                    </Text>
                  </VStack>
                  <Box p={2} bg="amber.100" borderRadius="lg">
                    <TrendingUp size={20} color="#f59e0b" />
                  </Box>
                </HStack>
              </Box>

              {/* Projects at Risk Card */}
              <Box 
                bg="linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%)" 
                borderRadius="xl" 
                p={4} 
                transform="translateY(-4px)"
                boxShadow="0 8px 20px rgba(244, 63, 94, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(244, 63, 94, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium">
                      Projects at Risk
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="red.600">
                      {projectRisks?.projects?.filter(p => p.risk_level === 'high' || p.risk_level === 'critical').length || 0}
                    </Text>
                  </VStack>
                  <Box p={2} bg="rose.100" borderRadius="lg">
                    <AlertTriangle size={20} color="#f43f5e" />
                  </Box>
                </HStack>
              </Box>
            </SimpleGrid>

            {/* Attrition Risk Analysis (with integrated Trends) */}
            <Box h="450px" flexShrink={0} overflow="hidden" w="full">
              <AttritionAnalysis userId={user?.id?.toString()} />
            </Box>

            {/* Bottom Row - Critical Members and Project Risks */}
            <Box flex={1} minH="0" w="full" position="relative">
              <HStack flex={1} h="full" gap={3} w="full">
                {/* Critical Team Members */}
                <Box flex={1} h="full" bg="white" borderRadius="xl" p={4} shadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
                  <CriticalTeamMembers userId={user?.id?.toString()} />
                </Box>
                
                {/* Project Risks */}
                <Box flex={1} h="full" bg="white" borderRadius="xl" p={4} shadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
                  <ProjectRisks 
                    projects={projectRisks?.projects}
                  />
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
                  bg: "blue.50",
                  borderColor: "blue.400",
                  shadow: "xl",
                  transform: "translate(-50%, -50%) scale(1.1)"
                }}
                transition="all 0.2s ease"
                zIndex={10}
                aria-label="View member-project mapping"
                onClick={() => setIsMappingModalOpen(true)}
              >
                <ArrowLeftRight size={16} color="#3B82F6" />
              </IconButton>
            </Box>

            {/* Member-Project Mapping Modal - Updated with gradients and borders */}
            <Dialog.Root open={isMappingModalOpen} onOpenChange={(e) => setIsMappingModalOpen(e.open)}>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content maxW="1200px" maxH="90vh">
                  <Dialog.Header bg="linear-gradient(to right, #DBEAFE, #bdfbfaff)" borderBottom="3px solid" borderColor="#93C5FD" p={4}>
                    <HStack justify="space-between" w="full">
                      <HStack gap={2}>
                        <Box p={2} bg="white" borderRadius="lg" shadow="sm">
                          <ArrowLeftRight size={20} color="#3B82F6" />
                        </Box>
                        <VStack align="start" gap={0}>
                          <Dialog.Title fontSize="xl" fontWeight="medium" color="gray.900">
                            Projects At Risk - Critical Members
                          </Dialog.Title>
                          <Text fontSize="sm" color="gray.700" fontWeight="normal">
                            At-risk projects with critical team members assigned
                          </Text>
                        </VStack>
                      </HStack>
                      <Dialog.CloseTrigger asChild>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          aria-label="Close"
                        >
                          <X size={18} />
                        </IconButton>
                      </Dialog.CloseTrigger>
                    </HStack>
                  </Dialog.Header>

                  <Dialog.Body overflowY="auto" maxH="calc(90vh - 180px)" p={6}>
                    <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden">
                      <Box as="table" w="full" css={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        {/* Table Header */}
                        <Box as="thead">
                          <Box as="tr" bg="linear-gradient(to right, #e4eaf6ff, #dff6efff)" borderBottom="3px solid" borderColor="#93C5FD">
                            <Box as="th" py={5} px={6} textAlign="left" fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="wide">
                              PROJECT NAME
                            </Box>
                            <Box as="th" py={5} px={6} textAlign="center" fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="wide">
                              PROJECT RISK
                            </Box>
                            <Box as="th" py={5} px={6} textAlign="center" fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="wide">
                              PROGRESS
                            </Box>
                            <Box as="th" py={5} px={6} textAlign="center" fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="wide">
                              DELIVERY DATE
                            </Box>
                            <Box as="th" py={5} px={6} textAlign="left" fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="wide">
                              CRITICAL MEMBER
                            </Box>
                            <Box as="th" py={5} px={6} textAlign="center" fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="wide">
                              ATTRITION RISK
                            </Box>
                          </Box>
                        </Box>

                        {/* Table Body */}
                        <Box as="tbody">
                          {atRiskProjectsWithCriticalMembers.map((project, pIndex) => {
                            const getRiskColor = (level: string) => {
                              if (level === 'High Risk') return 'red';
                              if (level === 'Medium Risk') return 'orange';
                              return 'green';
                            };

                            const getAttritionColor = (level: string) => {
                              if (level === 'High') return 'red';
                              if (level === 'Medium') return 'orange';
                              return 'green';
                            };

                            return project.criticalMembers.map((member, mIndex) => {
                              const isLastMemberOfProject = mIndex === project.criticalMembers.length - 1;
                              
                              return (
                              <Box
                                as="tr"
                                key={`${pIndex}-${mIndex}`}
                                bg="white"
                                borderBottom={isLastMemberOfProject ? "4px solid" : "2px solid"}
                                borderColor={isLastMemberOfProject ? "gray.400" : "gray.200"}
                                _hover={{ bg: 'gray.50' }}
                                transition="all 0.2s"
                              >
                                {/* Project Name - only show for first member */}
                                {mIndex === 0 ? (
                                  <Box
                                    as="td"
                                    py={5}
                                    px={6}
                                    rowSpan={project.criticalMembers.length}
                                    borderRight="2px solid"
                                    borderColor="gray.300"
                                    verticalAlign="top"
                                  >
                                    <Text fontSize="sm" fontWeight="light" color="gray.800">
                                      {project.projectName}
                                    </Text>
                                  </Box>
                                ) : null}

                                {/* Project Risk - only show for first member */}
                                {mIndex === 0 ? (
                                  <Box
                                    as="td"
                                    py={5}
                                    px={6}
                                    rowSpan={project.criticalMembers.length}
                                    textAlign="center"
                                    borderRight="2px solid"
                                    borderColor="gray.300"
                                    verticalAlign="top"
                                    bg={project.riskLevel === 'High Risk' ? 'red.50' : project.riskLevel === 'Medium Risk' ? 'orange.50' : 'green.50'}
                                  >
                                    <Badge 
                                      colorScheme={getRiskColor(project.riskLevel)} 
                                      fontSize="md" 
                                      px={4} 
                                      py={1.5}
                                      fontWeight="bold"
                                      shadow="sm"
                                    >
                                      {project.riskLevel}
                                    </Badge>
                                  </Box>
                                ) : null}

                                {/* Progress - only show for first member */}
                                {mIndex === 0 ? (
                                  <Box
                                    as="td"
                                    py={5}
                                    px={6}
                                    rowSpan={project.criticalMembers.length}
                                    textAlign="center"
                                    borderRight="2px solid"
                                    borderColor="gray.300"
                                    verticalAlign="top"
                                  >
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                      {project.progress}%
                                    </Text>
                                  </Box>
                                ) : null}

                                {/* Delivery Date - only show for first member */}
                                {mIndex === 0 ? (
                                  <Box
                                    as="td"
                                    py={5}
                                    px={6}
                                    rowSpan={project.criticalMembers.length}
                                    textAlign="center"
                                    borderRight="2px solid"
                                    borderColor="gray.300"
                                    verticalAlign="top"
                                  >
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                      {project.dueDate}
                                    </Text>
                                  </Box>
                                ) : null}

                                {/* Critical Member Name */}
                                <Box as="td" py={5} px={6} borderRight="2px solid" borderColor="gray.300" borderTop={mIndex > 0 ? "2px solid" : "none"} borderTopColor="gray.300">
                                  <Text fontSize="md" fontWeight="semibold" color="gray.800">
                                    {member.name}
                                  </Text>
                                </Box>

                                {/* Attrition Risk */}
                                <Box 
                                  as="td" 
                                  py={5} 
                                  px={6} 
                                  textAlign="center"
                                  borderTop={mIndex > 0 ? "2px solid" : "none"} 
                                  borderTopColor="gray.300"
                                  bg={member.attritionRisk === 'High' ? 'red.50' : 'transparent'}
                                >
                                  {member.attritionRisk === 'High' ? (
                                    <Text fontSize="md" fontWeight="bold" color="red.600">
                                      {member.attritionRisk}
                                    </Text>
                                  ) : (
                                    <Badge 
                                      colorScheme={getAttritionColor(member.attritionRisk)} 
                                      fontSize="md" 
                                      px={3} 
                                      py={1}
                                      fontWeight="medium"
                                    >
                                      {member.attritionRisk}
                                    </Badge>
                                  )}
                                </Box>
                              </Box>
                              );
                            });
                          })}
                        </Box>
                      </Box>
                    </Box>
                  </Dialog.Body>

                  <Dialog.Footer>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">
                        Showing {atRiskProjectsWithCriticalMembers.length} at-risk projects with critical members
                      </Text>
                      <Dialog.CloseTrigger asChild>
                        <Button variant="outline" size="sm">
                          Close
                        </Button>
                      </Dialog.CloseTrigger>
                    </HStack>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Dialog.Root>
          </VStack>
      </Box>
    </Box>
  );
};