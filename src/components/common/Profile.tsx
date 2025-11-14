'use client';

import React, { useState, useEffect } from "react";
import { Box, Grid, VStack, Card, Text, Spinner, GridItem, HStack, Heading } from "@chakra-ui/react";
import { User } from "lucide-react";
import { userApi, actionItemApi, projectApi, teamApi, metricsApi, notificationsApi } from '../../services';
import type { TeamStats, ProjectStats, ProjectRisksResponse, ProjectMetrics, NotificationsResponse } from '../../services';
import type { UserProfile } from "../../services/userApi";
import { AttritionAnalysis } from "../profile/AttritionAnalysis";
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
          // border="1px solid"
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
                // border="4px solid"
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
      h="98%" 
      bg="#ffffff"
      position="relative"
      gap={2}
      p={2}
      overflow="hidden"
    >
      {/* Main Content */}
      <Box h="auto" w="auto" p={2} overflow="hidden">
        {/* Dashboard Content Grid */}
        <HStack h="auto" w="auto" gap={2} align="stretch" minH="0">
          {/* Left Side - Health Metrics */}
          <Box w="220px" h="auto" flexShrink={0} borderRadius="3xl">
            <HealthMetrics 
              metrics={metrics ? [
                { label: 'Portfolio Health', value: 76, color: '#ef4444', type: 'portfolio_health' as const, isLarge: true },
                { label: 'Mental Health', value: metrics.data?.mental_health, color: '#60a5fa', type: 'mental_health' as const },
                { label: 'Attrition Risk', value: metrics.data?.attrition_risk, color: '#4ade80', type: 'attrition_risk' as const },
                { label: 'Project Health', value: metrics.data?.project_health, color: '#fb923c', type: 'project_health' as const }
              ] : []}
            />
          </Box>

          {/* Main Content Area */}
          <VStack flex="1" h="full" gap={1} align="stretch" minH="0">
            {/* Top Row - Stats Row + Critical Members */}
            <HStack w="full" gap={2} align="stretch" h="130px" flexShrink={5}>
              {/* Stats Row */}
              <Box flex="1.5" h="full">
                <StatsRow 
                  activeProjects={projectStats?.active_projects ?? projects?.length ?? 150}
                  teamMembers={teamStats?.team_members_count}
                  avgUtilization={teamStats?.utilization_percentage}
                  highRiskProjects={projectStats?.high_risk_projects}
                />
              </Box>
              
              {/* Critical Team Members - Top Part */}
              <Box flex="1.2" h="full">
                <CriticalTeamMembers userId={user?.id?.toString()} />
              </Box>
            </HStack>

            {/* Middle Row - Attrition Analysis + Critical Members Extension */}
            <HStack flex="2" w="full" gap={2} align="stretch" minH="0">
              {/* Attrition Analysis */}
              <Box flex="1.5" h="full">
                <AttritionAnalysis userId={user?.id?.toString()} />
              </Box>
              
              {/* Critical Members Extension */}
              <Box flex="1.2" h="full">
                {/* Visual continuation of Critical Members */}
              </Box>
            </HStack>
            
            {/* Bottom Row - AttritionTrends + ProjectRisks */}
            <HStack w="full" gap={2} align="stretch" h="220px" flexShrink={0}>
              <Box flex="0.8" h="full">
                <AttritionTrendsPanel 
                  trends={notifications?.notifications}
                />
              </Box>
              <Box flex="1.2" h="full">
                <ProjectRisks 
                  projects={projectRisks?.projects}
                />
              </Box>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};