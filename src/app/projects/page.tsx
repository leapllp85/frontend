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
} from '@chakra-ui/react';
import { Search, Plus, Users, Folder, AlertTriangle, Eye, Edit, Calendar } from 'lucide-react';
import { projectApi, Project as ApiProject } from '@/services';
import { RequireProjectCreate, RequireProjectEdit } from '@/components/RoleGuard';
import { useRouter } from 'next/navigation';

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Box w="full" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <Box bg="linear-gradient(135deg, #a5489f 0%, #8a3d85 100%)" py={12} px={6}>
                <Box className="max-w-full mx-auto">
                    <VStack gap={6} align="center" textAlign="center">
                        <Box display="flex" alignItems="center" gap={4}>
                            <Box bg="whiteAlpha.200" p={3} borderRadius="xl">
                                <Folder color="white" size={40} />
                            </Box>
                            <Heading size="2xl" color="white" fontWeight="bold">
                                Project Portfolio
                            </Heading>
                        </Box>
                        <Text color="purple.100" fontSize="lg" maxW="2xl">
                            Manage, track, and collaborate on your projects with powerful tools and insights
                        </Text>
                        <HStack gap={4} mt={4}>
                            <RequireProjectCreate>
                                <Button
                                    bg="white"
                                    color="#a5489f"
                                    _hover={{ bg: "purple.50", transform: "translateY(-2px)" }}
                                    size="lg"
                                    fontWeight="semibold"
                                    boxShadow="lg"
                                    onClick={() => router.push('/projects/onboard')}
                                >
                                    <HStack gap={2}>
                                        <Plus size={20} />
                                        <Text>New Project</Text>
                                    </HStack>
                                </Button>
                            </RequireProjectCreate>
                            {/* <Button
                                bg="transparent"
                                color="white"
                                border="2px solid"
                                borderColor="white"
                                _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                                size="lg"
                                fontWeight="semibold"
                            >
                                <HStack gap={2}>
                                    <Search size={20} />
                                    <Text>Search Projects</Text>
                                </HStack>
                            </Button> */}
                        </HStack>
                    </VStack>
                </Box>
            </Box>

            {/* Main Content */}
            <Box className="max-w-full mx-auto px-6 py-12">
                <VStack gap={10} px={6} py={12} align="center" w="full">
                    {/* Stats Section */}
                    <Grid w="full" templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                        <Card.Root w="full" bg="white" boxShadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Body p={6}>
                                <VStack align="start" gap={2}>
                                    <HStack gap={3}>
                                        <Box bg="purple.100" p={2} borderRadius="lg">
                                            <Folder color="#a5489f" size={20} />
                                        </Box>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Total Projects</Text>
                                    </HStack>
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">{projects.length}</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                        <Card.Root bg="white" boxShadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Body p={6}>
                                <VStack align="start" gap={2}>
                                    <HStack gap={3}>
                                        <Box bg="green.100" p={2} borderRadius="lg">
                                            <Users color="green.600" size={20} />
                                        </Box>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Active Projects</Text>
                                    </HStack>
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">{projects.filter(p => p.project_status === 'Active').length}</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                        <Card.Root bg="white" boxShadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Body p={6}>
                                <VStack align="start" gap={2}>
                                    <HStack gap={3}>
                                        <Box bg="orange.100" p={2} borderRadius="lg">
                                            <AlertTriangle color="orange.600" size={20} />
                                        </Box>
                                        <Text fontSize="sm" color="gray.600" fontWeight="medium">High Priority</Text>
                                    </HStack>
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">{projects.filter(p => p.criticality === 'High').length}</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    </Grid>

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
                                lg: "repeat(4, 1fr)",
                            }}
                            gap={4}
                        >
                            {projects.map((project) => (
                                <GridItem key={project.id}>
                                    <Card.Root
                                        bg="linear-gradient(135deg, #a5489f 0%, #8a3d85 100%)"
                                        border="1px solid"
                                        borderColor="whiteAlpha.300"
                                        borderRadius="2xl"
                                        shadow="xl"
                                        _hover={{ transform: "translateY(-4px)", shadow: "2xl" }}
                                        transition="all 0.4s ease"
                                        h="450px"
                                    >
                                        <Card.Body className="p-6 flex flex-col h-full">
                                            <VStack align="start" gap={5} flex={1}>
                                                <VStack align="start" gap={3} w="280px">
                                                    <Heading size="lg" color="white" fontWeight="bold" lineHeight="1.2">
                                                        {project.name}
                                                    </Heading>
                                                    <Badge
                                                        colorPalette={getRiskColor(project.project_status === 'Active' ? 'Low' : 'High')}
                                                        variant="solid"
                                                        px={3}
                                                        py={1}
                                                    >
                                                        {project.project_status}
                                                    </Badge>
                                                    <Text color="purple.100" fontSize="md" maxW="full" lineHeight="1.5" fontWeight="medium" truncate={true}>
                                                        {project.description}
                                                    </Text>
                                                </VStack>

                                                {/* Project Details Grid */}
                                                <Grid templateColumns="repeat(1, 1fr)" gap={6} w="full">
                                                    {/* Criticality */}
                                                    <GridItem>
                                                        <VStack align="start" gap={1}>
                                                            <HStack gap={2} align="center">
                                                                <AlertTriangle size={14} color="white" />
                                                                <Text fontSize="sm" fontWeight="semibold" color="white" letterSpacing="0.5px">
                                                                    Criticality
                                                                </Text>
                                                            </HStack>
                                                            <Badge
                                                                colorPalette={getRiskColor(project.criticality)}
                                                                variant="solid"
                                                                px={3}
                                                                py={1}
                                                            >
                                                                {project.criticality}
                                                            </Badge>
                                                        </VStack>
                                                    </GridItem>

                                                    {/* Timeline */}
                                                    <GridItem>
                                                        <VStack align="start" gap={1}>
                                                            <HStack gap={2} align="center">
                                                                <Calendar size={14} color="white" />
                                                                <Text fontSize="sm" fontWeight="semibold" color="white" letterSpacing="0.5px">
                                                                    Timeline
                                                                </Text>
                                                            </HStack>
                                                            <Text fontSize="sm" color="purple.100" fontWeight="medium">
                                                                Due: {formatDate(project.timeline)}
                                                            </Text>
                                                        </VStack>
                                                    </GridItem>

                                                    {/* Contributors */}
                                                    <GridItem>
                                                        <VStack align="start" gap={1}>
                                                            <HStack gap={2} align="center">
                                                                <Users size={14} color="white" />
                                                                <Text fontSize="sm" fontWeight="semibold" color="white" letterSpacing="0.5px">
                                                                    Contributors ({project.contributors.length})
                                                                </Text>
                                                            </HStack>
                                                            <HStack gap={2} align="center">
                                                                 <AvatarGroup size="sm">
                                                                     {project.contributors.slice(0, 3).map((contributor) => (
                                                                         <Avatar.Root key={contributor.id} size="sm" bg="white" color="#a5489f">
                                                                             <Avatar.Fallback bg="white" color="#a5489f" fontWeight="semibold">{contributor.first_name?.[0] || contributor.username?.[0] || 'U'}{contributor.last_name?.[0] || ''}</Avatar.Fallback>
                                                                         </Avatar.Root>
                                                                     ))}
                                                                 </AvatarGroup>
                                                                {project.contributors.length > 3 && (
                                                                    <Text fontSize="sm" color="purple.200" fontWeight="medium">
                                                                        +{project.contributors.length - 3} more
                                                                    </Text>
                                                                )}
                                                            </HStack>
                                                        </VStack>
                                                    </GridItem>
                                                </Grid>

                                                {/* Action Buttons */}
                                                <HStack gap={2} mt="auto" pt={4}>
                                                    <Button
                                                        bg="transparent"
                                                        color="white"
                                                        border="1px solid"
                                                        borderColor="whiteAlpha.300"
                                                        _hover={{ bg: "whiteAlpha.200", transform: "translateY(-1px)" }}
                                                        variant="outline"
                                                        size="sm"
                                                        flex={1}
                                                        fontWeight="semibold"
                                                    >
                                                        <HStack gap={1}>
                                                            <Eye size={20} />
                                                            <Text>View</Text>
                                                        </HStack>
                                                    </Button>
                                                    <RequireProjectEdit>
                                                        <Button
                                                            bg="transparent"
                                                            color="white"
                                                            border="1px solid"
                                                            borderColor="whiteAlpha.300"
                                                            _hover={{ bg: "whiteAlpha.200", transform: "translateY(-1px)" }}
                                                            variant="outline"
                                                            size="sm"
                                                            fontWeight="semibold"
                                                            onClick={() => handleEditProject(project.id)}
                                                        >
                                                            <HStack gap={1}>
                                                                <Edit size={14} />
                                                                <Text>Edit</Text>
                                                            </HStack>
                                                        </Button>
                                                    </RequireProjectEdit>
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
        </Box>
    );
}