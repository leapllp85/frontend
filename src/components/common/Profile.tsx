import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge, Box, Heading, Stack, Text, Flex, HStack, VStack, Avatar, Card } from "@chakra-ui/react";
import { User, Briefcase, CheckCircle, Calendar } from "lucide-react";
import { ProgressBar } from "../ui/progress";
import ProfileListComponent from "./ProfileListComponent";
import ProjectListingItem from "./ProjectListingItem";
import ActionListingItem from "./ActionListingItem";
import TeamCriticality from "./TeamCriticality";
import TeamCriticalityGraph from "./TeamCriticalityGraph";
import { userApi, actionItemApi, projectApi } from "../../services";
import type { UserProfile } from "../../services/userApi";

// Import types from services to avoid conflicts
import type { ActionItem as ServiceActionItem, Project as ServiceProject } from "../../services";

// Type definitions - use service types directly
type Project = ServiceProject;
type ActionItem = ServiceActionItem;
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
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
      console.log(data);
      const sortedItems = data.sort(
        (a: ActionItem, b: ActionItem) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
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
      const data = (await projectApi.getMyProjects()).projects;
      const sortedItems = data.sort(
        (a: ServiceProject, b: ServiceProject) => new Date(b.go_live_date).getTime() - new Date(a.go_live_date).getTime()
      );
      setProjectCount(data.length);
      const latestItems = sortedItems.slice(0, 3);
      console.log(latestItems)
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  return (
    <Box 
      w={width} 
      h="full" 
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      overflow="hidden"
    >
      {/* Header Section */}
      <Box 
        bg="linear-gradient(135deg, #4d3384 0%, #9557d1 100%)"
        p={4}
        pb={6}
        position="relative"
        overflow="hidden"
      >
        {/* Background decoration */}
        <Box 
          position="absolute" 
          top="-20" 
          right="-20" 
          w="40" 
          h="40" 
          bg="whiteAlpha.200" 
          borderRadius="full" 
        />
        <Box 
          position="absolute" 
          bottom="-10" 
          left="-10" 
          w="32" 
          h="32" 
          bg="whiteAlpha.100" 
          borderRadius="full" 
        />
        
        <Box maxW="6xl" mx="auto" position="relative">
          <Card.Root
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.300"
            shadow="xl"
            p={4}
          >
            <Card.Body>
              <Flex direction={{ base: "column", md: "row" }} align="center" gap={6}>
                <Box position="relative">
                  <Avatar.Root size="2xl" shadow="xl">
                    <Avatar.Image 
                      src={profileData?.user?.profile_pic || profileData?.profile?.profile_pic} 
                    />
                    <Avatar.Fallback bg="white" color="purple.600" fontSize="2xl" fontWeight="bold">
                      {profileData?.user ? 
                        `${profileData.user.first_name?.[0] || ''}${profileData.user.last_name?.[0] || ''}` : 
                        'U'
                      }
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Box 
                    position="absolute"
                    bottom="-2"
                    right="-2"
                    w="6"
                    h="6"
                    bg="green.400"
                    borderRadius="full"
                    border="3px solid"
                    borderColor="white"
                  />
                </Box>
                
                <VStack align={{ base: "center", md: "start" }} gap={3} flex="1">
                  <VStack align={{ base: "center", md: "start" }} gap={1}>
                    <Heading 
                      size="2xl" 
                      color="white" 
                      fontWeight="black" 
                      letterSpacing="tight"
                      textAlign={{ base: "center", md: "left" }}
                    >
                      {profileData?.user ? `${profileData.user.first_name} ${profileData.user.last_name}` : 'Unknown User'}
                    </Heading>
                    <HStack gap={2}>
                      <Badge 
                        bg="whiteAlpha.300" 
                        color="white" 
                        variant="solid" 
                        px={3} 
                        py={1} 
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        <User size={14} style={{ marginRight: '6px' }} />
                        {toTitleCase(profileData?.user?.role || "Employee")}
                      </Badge>
                    </HStack>
                  </VStack>
                  
                  <HStack gap={6} mt={2}>
                    <VStack gap={0}>
                      <Text fontSize="2xl" fontWeight="black" color="white">
                        {actionItemsCount}
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.800" fontWeight="medium">
                        Action Items
                      </Text>
                    </VStack>
                    <VStack gap={0}>
                      <Text fontSize="2xl" fontWeight="black" color="white">
                        {projectCount}
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.800" fontWeight="medium">
                        Projects
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Flex>
            </Card.Body>
          </Card.Root>
        </Box>
      </Box>

      {/* Content Section */}
      <Box w="full" h="full" mx="auto" my="auto" p={12} mt="-6" position="relative" flex="1" overflow="hidden">
        <Box
          display={{ base: "block", lg: "grid" }}
          gridTemplateColumns={{ lg: "1fr 1fr" }}
          gap={8}
        >
          {/* Action Items Section */}
          <Card.Root
            bg="white"
            borderRadius="2xl"
            shadow="xl"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ transform: "translateY(-2px)", shadow: "2xl" }}
            transition="all 0.3s ease"
            overflow="hidden"
          >
            <Card.Header 
              p={6} 
              pb={4}
              bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
              color="white"
            >
              <HStack gap={3}>
                <Box 
                  p={2} 
                  bg="whiteAlpha.200" 
                  borderRadius="lg"
                  backdropFilter="blur(10px)"
                >
                  <CheckCircle size={24} />
                </Box>
                <VStack align="start" gap={0}>
                  <Heading size="lg" fontWeight="black" letterSpacing="tight">
                    Latest Action Items
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.900">
                    {actionItemsCount} Action Items
                  </Text>
                </VStack>
              </HStack>
            </Card.Header>
            <Card.Body p={6}>
              <VStack gap={4} w="full">
                {actionItems.length > 0 ? (
                  actionItems.slice(0, 2).map((item, index) => (
                    <ActionListingItem
                      key={item.id || index}
                      title={item.title}
                      status={item.status}
                      action={item.action}
                      actionUrl={item.action}
                      createdAt={formatDate(item.created_at)}
                      updatedAt={formatDate(item.updated_at)}
                    />
                  ))
                ) : (
                  <VStack gap={3} py={8}>
                    <Box p={3} bg="gray.100" borderRadius="full" color="gray.500">
                      <CheckCircle size={32} />
                    </Box>
                    <Text color="gray.500" textAlign="center">
                      No Action Items found
                    </Text>
                  </VStack>
                )}
                {actionItems.length > 2 && (
                  <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                    +{actionItems.length - 2} more Action Items
                  </Text>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Projects Section */}
          <Card.Root
            bg="white"
            borderRadius="2xl"
            shadow="xl"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ transform: "translateY(-2px)", shadow: "2xl" }}
            transition="all 0.3s ease"
            overflow="hidden"
          >
            <Card.Header 
              p={6} 
              pb={4}
              bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              color="white"
            >
              <HStack justify="space-between" w="full">
                <HStack gap={3}>
                  <Box 
                    p={2} 
                    bg="whiteAlpha.200" 
                    borderRadius="lg"
                    backdropFilter="blur(10px)"
                  >
                    <Briefcase size={24} />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Heading size="lg" fontWeight="black" letterSpacing="tight">
                      My Projects
                    </Heading>
                    <Text fontSize="sm" color="whiteAlpha.900">
                      {projectCount} Projects
                    </Text>
                  </VStack>
                </HStack>
                <Link href="/projects">
                  <Box 
                    p={2} 
                    bg="whiteAlpha.200" 
                    borderRadius="lg"
                    _hover={{ bg: "whiteAlpha.300" }}
                    transition="all 0.2s ease"
                    cursor="pointer"
                  >
                    <Calendar size={20} />
                  </Box>
                </Link>
              </HStack>
            </Card.Header>
            <Card.Body p={6}>
              <VStack gap={4} w="full">
                {projects.length > 0 ? (
                  projects.slice(0, 2).map((project, index) => (
                    <ProjectListingItem
                      key={index}
                      name={project.title}
                      description={project.description}
                      source={project.source || '#'}
                      timeline={`${formatDate(project.start_date)} - ${formatDate(project.go_live_date)}`}
                      progress={0}
                      status={project.project_status}
                    />
                  ))
                ) : (
                  <VStack gap={3} py={8}>
                    <Box p={3} bg="gray.100" borderRadius="full" color="gray.500">
                      <Briefcase size={32} />
                    </Box>
                    <Text color="gray.500" textAlign="center">
                      No Projects found
                    </Text>
                  </VStack>
                )}
                {projects.length > 2 && (
                  <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                    +{projects.length - 2} more Projects
                  </Text>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
        </Box>

      </Box>
    </Box>
  );
};