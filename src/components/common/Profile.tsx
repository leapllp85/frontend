import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge, Box, Heading, Stack, Text, Flex, HStack, VStack } from "@chakra-ui/react";
import { Avator } from "../ui/avator";
import { ProgressBar } from "../ui/progress";
import ProfileListComponent from "./ProfileListComponent";
import ProjectListingItem from "./ProjectListingItem";
import ActionListingItem from "./ActionListingItem";
import { userApi, actionItemApi, projectApi } from "../../services";
import type { UserProfile } from "../../services/userApi";

// Import types from services to avoid conflicts
import type { ActionItem as ServiceActionItem, Project as ServiceProject } from "../../services";
import { data } from "framer-motion/client";

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

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const fetchUserProfile = async (username: string) => {
    try {
      setLoading(true);
      const data = await userApi.getUserProfile(username);
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
      console.log(data);
      const sortedItems = data.sort(
        (a: ServiceProject, b: ServiceProject) => new Date(b.go_live_date).getTime() - new Date(a.go_live_date).getTime()
      );
      setProjectCount(data.length);
      const latestItems = sortedItems.slice(0, 3);
      setProjects(latestItems);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserProfile(username);
    }
    fetchActionItems();
    fetchProjects();
  }, [username]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "N/A";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  if (loading) {
    return (
      <Box width={width} p={6} className="bg-white text-gray-800">
        <Box maxW="3xl" mx="auto" gap={8}>
          <Flex direction="column" align="center" gap={2}>
            <Text className="text-gray-800">Loading profile...</Text>
          </Flex>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width={width} p={6} className="bg-white text-gray-800">
        <Box maxW="3xl" mx="auto" gap={8}>
          <Flex direction="column" align="center" gap={2}>
            <Text className="text-red-500">
              Error loading profile: {error}
            </Text>
          </Flex>
        </Box>
      </Box>
    );
  }

  return (
    <Box width={width} p={6} className="!bg-white !text-gray-800">
      <Box maxW="3xl" mx="auto" gap={8}>
        <Flex direction="column" align="center" gap={2}>
          <Avator />
          <Heading size="md">
            <HStack>
              {profileData?.fullname || (username ? toTitleCase(username) : 'Unknown User')}
              <Box
                className={`!text-sm !px-3 !py-1 !font-medium !${
                  profileData?.is_verified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profileData?.is_verified ? "Verified" : "Not Verified"}
              </Box>
            </HStack>
          </Heading>
          <Text className="!text-gray-600">
            {profileData?.employee_designation || "Employee"}
          </Text>
        </Flex>

        <Box
          display={{ base: "block", md: "grid" }}
          gridTemplateColumns={{ md: "1fr 1fr" }}
          gap={8}
          mt={10}
        >
          <ProfileListComponent
            heading={`Latest Action Items (${actionItemsCount})`}
          >
            {actionItems.map((item, index) => (
              <ActionListingItem
                key={item.id || index}
                title={item.title}
                status={item.status}
                action={item.action}
                actionUrl={item.action}
                createdAt={formatDate(item.created_at)}
                updatedAt={formatDate(item.updated_at)}
              />
            ))}
          </ProfileListComponent>

          <VStack gap={2}>
            <Box w="full" alignItems="left">
              <Link href="/projects">
                <Heading size="md" _hover={{ color: "blue.500", cursor: "pointer" }}>
                  Projects ({projectCount})
                </Heading>
              </Link>
            </Box>
            <VStack gap={4} overflowY={"scroll"} scrollBehavior={"smooth"}>
              {projects.map((project, index) => (
                <ProjectListingItem
                  key={index}
                  name={project.title}
                  description={project.description}
                  source={project.source || '#'}
                  timeline={`${formatDate(project.start_date)} - ${formatDate(project.go_live_date)}`}
                  progress={0} // Default progress since service API doesn't provide this
                  status={project.status}
                />
              ))}
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};