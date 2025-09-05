"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Card,
    Button,
    Badge,
    Avatar,
    AvatarGroup,
    Table,
    Grid,
    GridItem,
    Flex,
    SimpleGrid,
} from '@chakra-ui/react';
import { Search, Plus, Users, Folder, AlertTriangle, Eye, Edit, Calendar } from 'lucide-react';
import { projectApi, Project as ApiProject } from '@/services';
import { RequireProjectCreate, RequireProjectEdit } from '@/components/RoleGuard';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layouts/AppLayout';

// Local getRiskColor function to ensure reliability
const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        case 'Low': return 'green';
        default: return 'gray';
    }
};

// Use API types
type Project = ApiProject & {
    name: string; // Map title to name for UI compatibility
    timeline: string; // Map go_live_date to timeline for UI compatibility
    contributors: any[]; // Will be populated from assigned_to
};

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const apiProjects = await projectApi.getProjects();

                // Transform API data to match UI expectations
                // @ts-ignore
                const transformedProjects: Project[] = apiProjects.projects.map(project => ({
                    ...project,
                    name: project.title, // Map title to name
                    timeline: project.go_live_date, // Map go_live_date to timeline
                    contributors: project.assigned_to || [] // Use assigned_to as contributors
                }));
                
                setProjects(transformedProjects);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects. Please try again.');
                // Fallback to empty array on error
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getCriticalityColor = (level: 'High' | 'Medium' | 'Low') => {
        switch (level) {
            case 'High': return 'red';
            case 'Medium': return 'yellow';
            case 'Low': return 'green';
            default: return 'gray';
        }
    };

    const getStatusColor = (status: 'Active' | 'Inactive') => {
        return status === 'Active' ? 'green' : 'gray';
    };

    const handleViewProject = (projectId: number) => {
        console.log('View project:', projectId);
        // Navigate to project details page
    };

    const handleEditProject = (projectId: number) => {
        console.log('Edit project:', projectId);
        // Navigate to project edit page
        router.push(`/projects/edit/${projectId}`);
    };

    return (
        <AppLayout>
                {/* Header */}
                {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack align="start" gap={2}>
                        <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="bold">
                            Projects
                        </Heading>
                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                            Manage and track all your projects
                        </Text>
                    </VStack>
                </Box>

                {/* Content */}
                <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack gap={8} align="stretch" w="full">
                    {/* Stats Section */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                        <Card.Root bg="white" shadow="lg" borderRadius="xl">
                            <Card.Body p={6}>
                                <HStack gap={3} mb={4}>
                                    <Box bg="purple.100" p={2} borderRadius="lg">
                                        <Folder color="#a5489f" size={20} />
                                    </Box>
                                    <Text fontWeight="semibold" color="gray.700">
                                        Total Projects
                                    </Text>
                                </HStack>
                                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                                    {projects.length}
                                </Text>
                            </Card.Body>
                        </Card.Root>
                        <Card.Root bg="white" boxShadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Body p={6}>
                                <VStack align="start" gap={2}>
                                    <HStack gap={3}>
                                        <Box bg="green.100" p={2} borderRadius="lg">
                                            <Users color="#a5489f" size={20} />
                                        </Box>
                                        <Text fontWeight="semibold" color="gray.700">
                                            Active Projects
                                        </Text>
                                    </HStack>
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                                        {projects.filter(p => p.status === 'Active').length}
                                    </Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                        <Card.Root bg="white" boxShadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Body p={6}>
                                <VStack align="start" gap={2}>
                                    <HStack gap={3}>
                                        <Box bg="orange.100" p={2} borderRadius="lg">
                                            <AlertTriangle color="#a5489f" size={20} />
                                        </Box>
                                        <Text fontWeight="semibold" color="gray.700">
                                            High Priority
                                        </Text>
                                    </HStack>
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                                        {projects.filter(p => p.criticality === 'High').length}
                                    </Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    </SimpleGrid>

                    {/* Loading State */}
                    {loading && (
                        <Box textAlign="center" py={12}>
                            <Text fontSize="lg" color="gray.600">Loading projects...</Text>
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Box textAlign="center" py={12}>
                            <Text fontSize="lg" color="red.500" mb={4}>{error}</Text>
                            <Button onClick={() => window.location.reload()} colorScheme="purple">
                                Retry
                            </Button>
                        </Box>
                    )}

                    {/* Projects Grid */}
                    {!loading && !error && (
                        <Grid 
                            templateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)",
                            }}
                            gap={{ base: 3, md: 4 }}
                        >
                            {projects.map((project) => (
                                <GridItem key={project.id}>
                                    <Card.Root
                                        bg="white"
                                        shadow="lg"
                                        borderRadius="xl"
                                        _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                                        transition="all 0.3s ease"
                                        overflow="hidden"
                                    >
                                        {/* Header with gradient */}
                                        <Box 
                                            bg="linear-gradient(135deg, #a5489f 0%, #8a3d85 100%)"
                                            p={6}
                                            position="relative"
                                        >
                                            <VStack align="start" gap={3} w="full">
                                                <HStack justify="space-between" w="full">
                                                    <Heading size="lg" color="white" fontWeight="bold" lineHeight="1.2">
                                                        {project.name}
                                                    </Heading>
                                                    <Badge
                                                        colorPalette={getRiskColor(project.status === 'Active' ? 'Low' : 'High')}
                                                        variant="solid"
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        {project.status}
                                                    </Badge>
                                                </HStack>
                                                <Text 
                                                    color="purple.100" 
                                                    fontSize="md" 
                                                    lineHeight="1.5" 
                                                    fontWeight="medium"
                                                    overflow="hidden"
                                                    textOverflow="ellipsis"
                                                    display="-webkit-box"
                                                    css={{
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {project.description}
                                                </Text>
                                            </VStack>
                                        </Box>
                                        
                                        <Card.Body p={6} display="flex" flexDirection="column" flex={1}>

                                            {/* Project Details */}
                                            <VStack gap={4} w="full" flex={1}>
                                                <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                                                    {/* Criticality */}
                                                    <GridItem>
                                                        <Box bg="gray.50" p={4} borderRadius="lg" w="full">
                                                            <VStack align="start" gap={2}>
                                                                <HStack gap={2} align="center">
                                                                    <Box p={1} bg="purple.100" borderRadius="md">
                                                                        <AlertTriangle size={12} color="#a5489f" />
                                                                    </Box>
                                                                    <Text fontSize="xs" fontWeight="semibold" color="gray.600" letterSpacing="0.5px">
                                                                        CRITICALITY
                                                                    </Text>
                                                                </HStack>
                                                                <Badge
                                                                    colorPalette={getRiskColor(project.criticality)}
                                                                    variant="solid"
                                                                    px={2}
                                                                    py={1}
                                                                    borderRadius="full"
                                                                    fontSize="xs"
                                                                >
                                                                    {project.criticality}
                                                                </Badge>
                                                            </VStack>
                                                        </Box>
                                                    </GridItem>

                                                    {/* Timeline */}
                                                    <GridItem>
                                                        <Box bg="gray.50" p={4} borderRadius="lg" w="full">
                                                            <VStack align="start" gap={2}>
                                                                <HStack gap={2} align="center">
                                                                    <Box p={1} bg="blue.100" borderRadius="md">
                                                                        <Calendar size={12} color="#3182ce" />
                                                                    </Box>
                                                                    <Text fontSize="xs" fontWeight="semibold" color="gray.600" letterSpacing="0.5px">
                                                                        TIMELINE
                                                                    </Text>
                                                                </HStack>
                                                                <Text fontSize="xs" color="gray.700" fontWeight="medium">
                                                                    {new Date(project.start_date).toLocaleDateString()} - {new Date(project.go_live_date).toLocaleDateString()}
                                                                </Text>
                                                            </VStack>
                                                        </Box>
                                                    </GridItem>

                                                    {/* Contributors */}
                                                    <GridItem colSpan={2}>
                                                        <Box bg="gray.50" p={4} borderRadius="lg" w="full">
                                                            <VStack align="start" gap={2}>
                                                                <HStack gap={2} align="center">
                                                                    <Box p={1} bg="green.100" borderRadius="md">
                                                                        <Users size={12} color="#38a169" />
                                                                    </Box>
                                                                    <Text fontSize="xs" fontWeight="semibold" color="gray.600" letterSpacing="0.5px">
                                                                        CONTRIBUTORS ({project.contributors.length})
                                                                    </Text>
                                                                </HStack>
                                                                <HStack gap={2} align="center">
                                                                     <AvatarGroup size="sm">
                                                                         {project.contributors.slice(0, 4).map((contributor) => (
                                                                             <Avatar.Root key={contributor.id} size="sm" bg="purple.500" color="white">
                                                                                 <Avatar.Fallback bg="purple.500" color="white" fontWeight="semibold" fontSize="xs">{(contributor.first_name?.[0] || contributor.username?.[0] || 'U')}{(contributor.last_name?.[0] || '')}</Avatar.Fallback>
                                                                             </Avatar.Root>
                                                                         ))}
                                                                     </AvatarGroup>
                                                                    {project.contributors.length > 4 && (
                                                                        <Text fontSize="xs" color="gray.600" fontWeight="medium">
                                                                            +{project.contributors.length - 4} more
                                                                        </Text>
                                                                    )}
                                                                </HStack>
                                                            </VStack>
                                                        </Box>
                                                    </GridItem>
                                                </Grid>

                                                {/* Action Buttons */}
                                                <HStack gap={2} mt="auto" pt={4} w="full">
                                                    <Button
                                                        size="sm"
                                                        bg="purple.500"
                                                        color="white"
                                                        _hover={{ bg: "purple.600" }}
                                                        borderRadius="full"
                                                        px={4}
                                                        flex={1}
                                                        onClick={() => router.push(`/projects/edit/${project.id}`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        borderColor="purple.500"
                                                        color="purple.500"
                                                        _hover={{ bg: "purple.50" }}
                                                        borderRadius="full"
                                                        px={4}
                                                        flex={1}
                                                        onClick={() => router.push(`/projects/${project.id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </HStack>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                </GridItem>
                            ))}
                        </Grid>
                    )}
                    </VStack>
                </Box>
        </AppLayout>
    );
}