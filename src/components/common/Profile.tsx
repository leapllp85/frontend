'use client';

import React, { useState, useEffect } from "react";
import { Box, Grid, VStack, Card, Text, Spinner, GridItem, HStack, Heading } from "@chakra-ui/react";
import { User } from "lucide-react";
import { userApi, actionItemApi, projectApi, teamApi, metricsApi, notificationsApi } from '../../services';
import type { TeamStats, ProjectStats, ProjectRisksResponse, ProjectMetrics, NotificationsResponse } from '../../services';
import type { UserProfile } from "../../services/userApi";
import { CriticalityVsRisk } from "../profile/criticality/CriticalityVsRisk";
import { AttritionRisk } from "../profile/criticality/AttritionRisk";
import { CriticalTeamMembers } from "../profile/criticality/CriticalTeamMembers";
import { StatsRow } from "../profile/StatsRow";
import { AttritionTrendsPanel } from "../profile/AttritionTrendsPanel";
import { HealthMetrics } from "../profile/HealthMetrics";
import { ProjectRisks } from "../profile/ProjectRisks";

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
    return (
      <Box 
        w={width} 
        h="full" 
        bg="#d4f1f4"
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
              <Box
                w="16"
                h="16"
                borderRadius="full"
                border="4px solid"
                bg="#d4f1f4"
                borderTopColor="transparent"
                animation="spin 1s linear infinite"
              />
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Loading your profile...
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

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
      h="full" 
      bg="#ffffff"
      position="relative"
      gap={0}
      p={0}
      overflow="hidden"
    >
      {/* Main Content */}
      <Box position="relative" h="99%" overflow="hidden" w="99%">
        {/* Dashboard Content */}
        <Box h="full" p={1} position="relative">
          <VStack h="full" align="center" gap={2} w="99%">
            {/* Portfolio Health + Stats Row - Separate Entities */}
            <HStack gap={0} w="100%" flexShrink={0}>
              {/* Portfolio Health Section - 25% width */}
              <Card.Root
                bg="#ffffff"
                shadow="sm"
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.50"
                borderRight="none"
                h="80px"
                display="flex"
                flexDirection="column"
                transition="all 0.2s ease"
                w="25%"
              >
                <VStack h="full" justify="center" px={2} py={2}>
                  <VStack gap={0}>
                    <Heading 
                      size="sm" 
                      color="gray.900" 
                      textAlign="center"
                      fontWeight="normal"
                    >
                      Portfolio Health
                    </Heading>
                    <Box 
                      w="100%" 
                      h="1px" 
                      bg="linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)"
                    />
                  </VStack>
                  
                  <VStack gap={1} align="center" w="full">
                    <Text fontSize="md" fontWeight="bold" color="#ef4444">
                      Average
                    </Text>
                    <Box w="full" bg="gray.200" borderRadius="full" h="2">
                      <Box 
                        w="76%" 
                        bg="linear-gradient(90deg, #fef3c7 0%, #fbbf24 25%, #f59e0b 50%, #ef4444 100%)" 
                        borderRadius="full" 
                        h="2" 
                        transition="all 0.3s ease"
                      />
                    </Box>
                  </VStack>
                </VStack>
              </Card.Root>
              
              {/* Stats Row Section - 75% width */}
              <Box flex="1" w="75%">
                <StatsRow 
                  activeProjects={projectStats?.active_projects ?? projects?.length ?? 150}
                  teamMembers={teamStats?.team_members_count}
                  avgUtilization={teamStats?.utilization_percentage}
                  highRiskProjects={projectStats?.high_risk_projects}
                />
              </Box>
            </HStack>

            {/* Main Content Grid - Full Screen Layout */}
            <HStack 
              flex="1"
              w="full"
              gap={2}
              h="full"
              align="stretch"
              minH="0"
            >
              <VStack h="full" w="280px" flexShrink={0} gap={2} align="stretch">
                {/* Health Metrics - Moved Up */}
                <Box h="full" minH="0">
                  <HealthMetrics 
                    metrics={metrics ? [
                      { label: 'Mental Health', value: metrics.data?.mental_health, color: '#60a5fa', type: 'mental_health' as const },
                      { label: 'Attrition Risk', value: metrics.data?.attrition_risk, color: '#4ade80', type: 'attrition_risk' as const },
                      { label: 'Project Health', value: metrics.data?.project_health, color: '#fb923c', type: 'project_health' as const }
                    ] : []}
                  />
                </Box>
              </VStack>

              <VStack flex="1" h="full" gap={2} align="stretch" minH="0">
                {/* Top - Criticality vs Attrition Risk */}
                <HStack w="full" h="58%" gap={2} minH="0" align="stretch">
                  <Box w="25%" h="full" minW="0">
                    <CriticalityVsRisk userId={user?.id?.toString()} />
                  </Box>
                  <Box w="30%" h="full" minW="0">
                    <AttritionRisk userId={user?.id?.toString()} />
                  </Box>
                  <Box w="45%" h="full" minW="0">
                    <CriticalTeamMembers userId={user?.id?.toString()} />
                  </Box>
                </HStack>
                                
                {/* Bottom Row - Notifications and Project Risks */}
                <HStack gap={2} align="stretch" w="full" h="42%" minH="0">
                  <Box flex="1" h="full" minH="0">
                    <AttritionTrendsPanel 
                      trends={notifications?.notifications}
                    />
                  </Box>
                  <Box flex="1" h="full" minH="0">
                    <ProjectRisks 
                      projects={projectRisks?.projects}
                    />
                  </Box>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};