import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge, Box, Heading, Stack, Text, Flex, HStack, VStack, Avatar, Card, Grid, GridItem, Button, Input, Textarea } from "@chakra-ui/react";
import { User, Briefcase, CheckCircle, Calendar, Home, FolderOpen, FileText, Users, BarChart3, Settings, LogOut, Send, MessageCircle } from "lucide-react";
import { ProgressBar } from "../ui/progress";
import ProfileListComponent from "./ProfileListComponent";
import ProjectListingItem from "./ProjectListingItem";
import ActionListingItem from "./ActionListingItem";
import TeamCriticality from "./TeamCriticality";
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
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

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

  const navigationItems = [
    { icon: Home, label: "Home", href: "/dashboard", active: true },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: FileText, label: "Surveys", href: "/surveys" },
    { icon: CheckCircle, label: "Action Items", href: "/action-items" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "My Team", href: "/my-team" },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
      setChatMessage("");
      // Add AI response simulation
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'assistant', content: 'I can help you with that. What specific information are you looking for?' }]);
      }, 1000);
    }
  };

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
        <Box bg="white" borderBottom="1px solid" borderColor="gray.200" p={{ base: 4, md: 6 }}>
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
        
        {/* Dashboard Content */}
        <Box p={{ base: 4, md: 6 }}>
          <Grid templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }} gap={{ base: 4, md: 6 }} h="full">
            {/* Left Column - Stats and Action Items */}
            <GridItem colSpan={{ base: 1, lg: 8 }}>
              <VStack gap={6} align="stretch">
                {/* Stats Cards */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                    <Card.Body p={4}>
                      <VStack align="start" gap={2}>
                        <HStack gap={2}>
                          <Box p={{ base: 1.5, md: 2 }} bg="orange.100" borderRadius="md">
                            <CheckCircle size={16} color="#ea580c" />
                          </Box>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">Total Projects</Text>
                        </HStack>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">{projectCount}</Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                  
                  <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                    <Card.Body p={4}>
                      <VStack align="start" gap={2}>
                        <HStack gap={2}>
                          <Box p={2} bg="green.100" borderRadius="md">
                            <Users size={16} color="#16a34a" />
                          </Box>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">Active Projects</Text>
                        </HStack>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">{projects.filter(p => p.project_status === 'Active').length}</Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                  
                  <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                    <Card.Body p={4}>
                      <VStack align="start" gap={2}>
                        <HStack gap={2}>
                          <Box p={2} bg="red.100" borderRadius="md">
                            <FileText size={16} color="#dc2626" />
                          </Box>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">At Risk</Text>
                        </HStack>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">2</Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </Grid>
                
                {/* Action Items */}
                <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
                    <Heading size="md" color="gray.800">Action Items</Heading>
                  </Card.Header>
                  <Card.Body p={4}>
                    <VStack gap={3} align="stretch">
                      {actionItems.length > 0 ? (
                        actionItems.map((item, index) => (
                          <Box key={index} p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                            <HStack justify="space-between">
                              <VStack align="start" gap={1}>
                                <Text fontWeight="medium" color="gray.800">{item.title}</Text>
                                <Text fontSize="sm" color="gray.600">{item.action}</Text>
                              </VStack>
                              <Badge 
                                colorPalette={item.status === 'Completed' ? 'green' : item.status === 'Pending' ? 'orange' : 'gray'}
                                variant="solid"
                                size="sm"
                              >
                                {item.status}
                              </Badge>
                            </HStack>
                          </Box>
                        ))
                      ) : (
                        <Text color="gray.500" textAlign="center" py={8}>
                          No action items found
                        </Text>
                      )}
                    </VStack>
                  </Card.Body>
                </Card.Root>
                
                {/* Projects */}
                <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
                    <Heading size="md" color="gray.800">Projects</Heading>
                  </Card.Header>
                  <Card.Body p={4}>
                    <VStack gap={3} align="stretch">
                      {projects.length > 0 ? (
                        projects.map((project, index) => (
                          <Box key={index} p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                            <HStack justify="space-between">
                              <VStack align="start" gap={1}>
                                <Text fontWeight="medium" color="gray.800">{project.title}</Text>
                                <Text fontSize="sm" color="gray.600">{project.description}</Text>
                              </VStack>
                              <VStack align="end" gap={1}>
                                <Badge 
                                  colorPalette={project.project_status === 'Active' ? 'green' : 'gray'}
                                  variant="solid"
                                  size="sm"
                                >
                                  {project.project_status}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  {formatDate(project.go_live_date)}
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>
                        ))
                      ) : (
                        <Text color="gray.500" textAlign="center" py={8}>
                          No projects found
                        </Text>
                      )}
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            </GridItem>
            
            {/* Right Column - Projects */}
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <VStack gap={6} align="stretch">
                <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
                    <Heading size="md" color="gray.800">Criticality Metrics</Heading>
                  </Card.Header>
                  <Card.Body p={4}>
                    <VStack gap={4}>
                      {/* Placeholder for charts - you can add actual chart components here */}
                      <Box w="full" h="200px" bg="gray.50" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                        <VStack gap={2}>
                          <BarChart3 size={32} color="#6b7280" />
                          <Text color="gray.500" fontSize="sm">Chart visualization</Text>
                        </VStack>
                      </Box>
                      
                      <VStack gap={3} w="full">
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Mental Health</Text>
                          <Badge colorPalette="red" variant="solid" size="sm">High Risk</Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Attrition Risk</Text>
                          <Badge colorPalette="orange" variant="solid" size="sm">Medium</Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Projects at Risk</Text>
                          <Badge colorPalette="blue" variant="solid" size="sm">Low</Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Avg Utilization</Text>
                          <Badge colorPalette="yellow" variant="solid" size="sm">High</Badge>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
                
                <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
                    <Heading size="md" color="gray.800">Criticality Vs Risk</Heading>
                  </Card.Header>
                  <Card.Body p={4}>
                    <VStack gap={3}>
                      <Box w="full" h="150px" bg="gray.50" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                        <VStack gap={2}>
                          <BarChart3 size={24} color="#6b7280" />
                          <Text color="gray.500" fontSize="xs">Risk analysis chart</Text>
                        </VStack>
                      </Box>
                      
                      <VStack gap={2} w="full">
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box w="3" h="3" bg="red.500" borderRadius="full" />
                            <Text fontSize="xs" color="gray.600">High Risk</Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box w="3" h="3" bg="green.500" borderRadius="full" />
                            <Text fontSize="xs" color="gray.600">Work Wellness</Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box w="3" h="3" bg="yellow.500" borderRadius="full" />
                            <Text fontSize="xs" color="gray.600">Medium</Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box w="3" h="3" bg="orange.500" borderRadius="full" />
                            <Text fontSize="xs" color="gray.600">Career Growth</Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <HStack gap={2}>
                            <Box w="3" h="3" bg="gray.400" borderRadius="full" />
                            <Text fontSize="xs" color="gray.600">Low Risk</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};