import React, { useState, useEffect } from "react";
import { Box, Grid, VStack, Card, Text, Spinner } from "@chakra-ui/react";
import { User } from "lucide-react";
import { userApi, actionItemApi, projectApi } from "../../services";
import type { UserProfile } from "../../services/userApi";
import { CriticalityVsRisk } from "../profile/criticality/CriticalityVsRisk";
import { StatsRow } from "../profile/StatsRow";
import { NotificationsPanel } from "../profile/NotificationsPanel";
import { ProjectMetricsOverview } from "../profile/ProjectMetricsOverview";
import { ProjectRisks } from "../profile/ProjectRisks";

// Import types from services to avoid conflicts
import type { ActionItem, Project } from "../../services";

type ProfileData = UserProfile;

export const Profile = ({
  width = "full",
}: {
  width: string;
}) => {
  const username = localStorage.getItem("username");
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [actionItemsCount, setActionItemsCount] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getCurrentUserProfile();
      setProfileData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchActionItems = async () => {
    try {
      // @ts-ignore
      const data = (await actionItemApi.getActionItems()).action_items;
      // Pending Items should be at the top
      const sortedItems = data.sort(
        (a: ActionItem, b: ActionItem) => {
          if (a.status === 'Pending' && b.status !== 'Pending') return -1;
          if (a.status !== 'Pending' && b.status === 'Pending') return 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
      );
      setActionItemsCount(data.length);
      const latestItems = sortedItems.slice(0, 3);
      setActionItems(latestItems);
    } catch (err) {
      console.error("Error fetching action items:", err);
      setActionItems([]);
      setActionItemsCount(0);
    }
  };
  const fetchProjects = async () => {
    try {
      // @ts-ignore
      const data = (await projectApi.getProjects()).projects;
      // Active Projects should be at the top
      const sortedItems = data.sort(
        (a: Project, b: Project) => {
          if (a.status === 'Active' && b.status !== 'Active') return -1;
          if (a.status !== 'Active' && b.status === 'Active') return 1;
          return new Date(b.go_live_date).getTime() - new Date(a.go_live_date).getTime();
        }
      );
      setProjectCount(data.length);
      const latestItems = sortedItems.slice(0, 3);
      setProjects(latestItems);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
      setProjectCount(0);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchActionItems();
    fetchProjects();
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
                activeProjects={projects.filter(p => p.status === 'Active').length}
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
                <CriticalityVsRisk userId={profileData?.user?.id?.toString()} />
              </Box>
              
              {/* Top Right - Project Metrics Overview */}
              <Box h="full">
                <ProjectMetricsOverview />
              </Box>
              
              {/* Bottom Left - Notifications */}
              <Box h="full">
                <NotificationsPanel />
              </Box>
              
              {/* Bottom Right - Project Risks */}
              <Box h="full">
                <ProjectRisks />
              </Box>
            </Grid>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};