import React, { useState, useEffect } from "react";
import { Box, Grid, VStack, Card, Text, Spinner } from "@chakra-ui/react";
import { User } from "lucide-react";
import { userApi, actionItemApi, projectApi, teamApi, metricsApi, notificationsApi } from '../../services';
import type { TeamStats, ProjectStats, ProjectRisksResponse, ProjectMetrics, NotificationsResponse } from '../../services';
import type { UserProfile } from "../../services/userApi";
import { CriticalityVsRisk } from "../profile/criticality/CriticalityVsRisk";
import { StatsRow } from "../profile/StatsRow";
import { NotificationsPanel } from "../profile/NotificationsPanel";
import { ProjectMetricsOverview } from "../profile/ProjectMetricsOverview";
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
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
            <VStack gap={4}>
              <Box
                w="16"
                h="16"
                borderRadius="full"
                border="4px solid"
                borderColor="purple.500"
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
            <VStack gap={4}>
              <Box p={3} bg="red.100" borderRadius="full" color="red.600">
                <User size={32} />
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

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box 
      w={width} 
      h="100vh" 
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      position="relative"
    >
      {/* Main Content */}
      <Box position="relative" zIndex={1} h="full" overflow="auto">
        {/* Dashboard Content */}
        <Box p={{ base: 3, md: 4 }} position="relative" zIndex={2}>
          <VStack gap={{base:3, "2xl":3}} align="stretch" h="full">
            {/* Top Stats Row */}
            <Box flexShrink={0}>
              <StatsRow 
                activeProjects={projectStats?.active_projects ?? projects?.length ?? 0}
                teamMembers={teamStats?.team_members_count}
                avgUtilization={teamStats?.utilization_percentage}
                highRiskProjects={projectStats?.high_risk_projects}
              />
            </Box>

            {/* Main Content Grid - 2x2 Equal Layout */}
            <Grid 
              templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
              // templateRows={{ base: "1fr", md: "1fr 1fr" }}
              gap={{base:4, "2xl":6}}
              minH="0"
            >
              {/* Top Left - Criticality vs Attrition Risk */}
              <Box h="full">
                <CriticalityVsRisk userId={user?.id?.toString()} />
              </Box>
              
              {/* Top Right - Project Metrics Overview */}
              <Box h="full">
                <ProjectMetricsOverview 
              metrics={metrics ? [
                { label: 'Mental Health', value: metrics.data?.mental_health, color: '#60a5fa', type: 'mental_health' as const },
                { label: 'Attrition Risk', value: metrics.data?.attrition_risk, color: '#4ade80', type: 'attrition_risk' as const },
                { label: 'Project Health', value: metrics.data?.project_health, color: '#fb923c', type: 'project_health' as const }
              ] : undefined}
            />
              </Box>
              
              {/* Bottom Left - Notifications */}
              <Box h="full">
                <NotificationsPanel 
              notifications={notifications?.notifications}
            />
              </Box>
              
              {/* Bottom Right - Project Risks */}
              <Box h="full">
                <ProjectRisks 
              projects={projectRisks?.projects}
            />
              </Box>
            </Grid>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};