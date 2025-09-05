import React, { useState, useEffect } from "react";
import { Badge, Box, Heading, Text, Flex, HStack, VStack, Avatar, Card, Grid, GridItem } from "@chakra-ui/react";
import { User, CheckCircle, Users, FileText, BarChart3 } from "lucide-react";
import { userApi, actionItemApi, projectApi } from "../../services";
import type { UserProfile } from "../../services/userApi";
import { CriticalityMetrics } from "../profile/criticality/CriticalityMetrics";
import { CriticalityVsRisk } from "../profile/criticality/CriticalityVsRisk";
import { Projects } from "../profile/Projects";
import { ActionItems } from "../profile/ActionItems";
import { StatsCard } from "../profile/stats/StatsCard";

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
          shadow="2xl"
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
          shadow="2xl"
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
    <Box w={width} h="100vh" display="flex" bg="gray.50">
      {/* Sidebar */}
      {/* Main Content */}
      <Box flex="1" h="full" overflow="auto">
        {/* Welcome Header */}
        {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.200" p={{ base: 4, md: 6 }}>
          <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 0 }}>
            <HStack gap={4}>
              <Heading size={{ base: "md", md: "lg" }} color="gray.800" textAlign={{ base: "center", md: "left" }}>
                Welcome, {profileData?.user && profileData.user.first_name && profileData.user.last_name ? `${profileData.user.first_name} ${profileData.user.last_name}` : profileData?.user?.username || 'Manager User'} 👋
              </Heading>
            </HStack>
            <Avatar.Root size={{ base: "lg", md: "md" }}>
              <Avatar.Image src={profileData?.user?.profile_pic || profileData?.profile?.profile_pic} />
              <Avatar.Fallback bg="purple.100" color="purple.600" fontWeight="bold">
                {profileData?.user && profileData.user.first_name && profileData.user.last_name ? 
                  `${profileData.user.first_name[0]}${profileData.user.last_name[0]}` : 
                  profileData?.user?.username?.[0]?.toUpperCase() || 'MU'
                }
              </Avatar.Fallback>
            </Avatar.Root>
          </Flex>
        </Box>
         */}
        {/* Dashboard Content */}
        <Box p={{ base: 4, md: 6 }}>
          <Grid templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }} gap={{ base: 4, md: 6 }} h="full">
            {/* Left Column - Stats and Action Items */}
            <GridItem colSpan={{ base: 1, lg: 8 }}>
              <VStack gap={6} align="stretch">
                {/* Stats Cards */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  <StatsCard title="Total Projects" count={projectCount} icon={{ bgColor: "orange.100", node: <CheckCircle size={16} color="#ea580c" /> }} />
                  <StatsCard title="Active Projects" count={projects.filter(p => p.status === 'Active').length} icon={{ bgColor: "green.100", node: <Users size={16} color="#16a34a" /> }} />
                  <StatsCard title="At Risk" count={2} icon={{ bgColor: "red.100", node: <FileText size={16} color="#dc2626" /> }} />
                </Grid>

                {/* Action Items */}
                <ActionItems actionItems={actionItems} />
                
                {/* Projects */}
                <Projects projects={projects} />
              </VStack>
            </GridItem>
            
            {/* Right Column - Criticality Analytics */}
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <VStack gap={6} align="stretch">
                <CriticalityMetrics userId={profileData?.user?.id?.toString()} />
                <CriticalityVsRisk userId={profileData?.user?.id?.toString()} />
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};