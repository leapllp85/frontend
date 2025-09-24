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
    Spinner,
    Input
} from '@chakra-ui/react';
import { Pagination } from '@/components/common/Pagination';
import { Search, Plus, Users, Folder, AlertTriangle, Eye, Edit, Calendar } from 'lucide-react';
import { projectApi, Project as ApiProject, ProjectsPaginatedResponse, ProjectsQueryParams } from '@/services';
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
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentRequestId, setCurrentRequestId] = useState(0);

    // Fetch projects from API with pagination
    const fetchProjects = async (params?: ProjectsQueryParams, isSearch = false) => {
        const requestId = Date.now();
        setCurrentRequestId(requestId);
        try {
            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }
            
            console.log('Fetching projects with params:', params);
            const response: ProjectsPaginatedResponse = await projectApi.getProjects(params);

            console.log('API Response:', response);
            console.log('Search Query:', params?.search);
            console.log('Projects returned:', response.results.projects.length);
            console.log('Current projects state before update:', projects.length);

            // Transform API data to match UI expectations
            const transformedProjects: Project[] = response.results.projects.map(project => ({
                ...project,
                name: project.title, // Map title to name
                timeline: project.go_live_date, // Map go_live_date to timeline
                contributors: project.assigned_to || [] // Use assigned_to as contributors
            }));
            
            console.log('Transformed projects:', transformedProjects.length);
            console.log('Setting projects state with:', transformedProjects.map(p => ({ id: p.id, name: p.name })));
            
            // Always update state with the latest response (remove race condition check for now)
            setProjects(transformedProjects);
            setTotalCount(response.count);
            setFilteredCount(response.results.total_results || response.count);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
            setError(null);
            console.log('State updated with projects:', transformedProjects.length);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            setError('Failed to load projects. Please try again.');
            setProjects([]);
        } finally {
            if (isSearch) {
                setSearchLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const isInitialLoad = currentPage === 1 && pageSize === 12 && !searchQuery;
        console.log('useEffect triggered:', { currentPage, pageSize, searchQuery, isInitialLoad });
        
        // Add a small delay to prevent rapid API calls during typing
        const timeoutId = setTimeout(() => {
            fetchProjects({ 
                page: currentPage, 
                page_size: pageSize,
                search: searchQuery || undefined
            }, !isInitialLoad);
        }, searchQuery ? 300 : 0); // 300ms debounce for search, immediate for other changes

        return () => clearTimeout(timeoutId);
    }, [currentPage, pageSize, searchQuery]);

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
                    {/* Header with Search and Pagination Info */}
                    {!loading && !error && (
                        <VStack align="stretch" gap={4}>
                            <HStack justify="space-between" flexWrap="wrap">
                                <VStack align="start" gap={1}>
                                    <Heading size="xl" color="gray.800">
                                        Projects
                                    </Heading>
                                    <Text fontSize="sm" color="gray.600">
                                        {searchQuery ? (
                                            `Showing ${filteredCount} of ${totalCount} projects matching "${searchQuery}"`
                                        ) : (
                                            `Showing ${projects.length} of ${totalCount} projects`
                                        )}
                                    </Text>
                                </VStack>
                                
                                <RequireProjectCreate>
                                    <Button 
                                        onClick={() => router.push('/projects/onboard')}
                                        colorPalette="purple"
                                        size="lg"
                                    >
                                        <Plus size={20} />
                                        Create New Project
                                    </Button>
                                </RequireProjectCreate>
                            </HStack>
                            
                            {/* Search and Filters */}
                            <HStack gap={4} flexWrap="wrap">
                                <Box flex={1} minW="300px">
                                    <Box position="relative">
                                        <Input
                                            placeholder="Search projects by title, description, or criticality..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1); // Reset to first page on search
                                            }}
                                            pl={10}
                                            size="md"
                                            bg="white"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            color="gray.800"
                                            _placeholder={{ color: "gray.500" }}
                                            _focus={{
                                                borderColor: "purple.500",
                                                boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)"
                                            }}
                                        />
                                        <Box
                                            position="absolute"
                                            left={3}
                                            top="50%"
                                            transform="translateY(-50%)"
                                            color="gray.400"
                                        >
                                            <Search size={16} />
                                        </Box>
                                    </Box>
                                </Box>
                                <HStack gap={2}>
                                    <Text fontSize="sm" color="gray.600">Page size:</Text>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPageSize(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            backgroundColor: 'white',
                                            color: '#4a5568',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value={6}>6 per page</option>
                                        <option value={12}>12 per page</option>
                                        <option value={24}>24 per page</option>
                                        <option value={48}>48 per page</option>
                                    </select>
                                </HStack>
                            </HStack>
                            
                            {/* Search Results Info */}
                            {searchQuery && (
                                <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                                    <Text fontSize="sm" color="blue.700">
                                        <strong>{filteredCount}</strong> projects found matching <strong>"{searchQuery}"</strong>
                                        {filteredCount !== totalCount && (
                                            <span> (filtered from {totalCount} total projects)</span>
                                        )}
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    )}

                    {/* Stats Section */}
                    {!loading && !error && (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                        <Card.Root bg="white" shadow="sm" borderRadius="xl">
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
                    )}
                    
                    {/* {!loading && !error && (
                        <Box>
                            <Button 
                                onClick={() => router.push('/projects/onboard')}
                                colorPalette="purple"
                                size="lg"
                            >
                                <Plus size={20} />
                                Create New Project
                            </Button>
                        </Box>
                    )} */}

                    {/* Loading State */}
                    {loading && (
                        <Box textAlign="center" py={12}>
                            <Spinner size="xl" color="purple.500" mb={4} />
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
                        <Box position="relative">
                            {searchLoading && (
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    right={0}
                                    bottom={0}
                                    bg="white"
                                    opacity={0.8}
                                    zIndex={1}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius="xl"
                                >
                                    <VStack gap={2}>
                                        <Spinner size="lg" color="purple.500" />
                                        <Text fontSize="sm" color="gray.600">Searching projects...</Text>
                                    </VStack>
                                </Box>
                            )}
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
                                        shadow="sm"
                                        borderRadius="xl"
                                        _hover={{ transform: "translateY(-2px)", shadow: "md" }}
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
                        </Box>
                    )}
                    
                    {/* Pagination Footer */}
                    {!loading && !error && projects.length > 0 && (
                        <Box mt={8}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil((searchQuery ? filteredCount : totalCount) / pageSize)}
                                totalItems={searchQuery ? filteredCount : totalCount}
                                itemsPerPage={pageSize}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(newPageSize) => {
                                    setPageSize(newPageSize);
                                    setCurrentPage(1);
                                }}
                                loading={loading}
                                showFirstLast={true}
                                showPageNumbers={true}
                            />
                        </Box>
                    )}
                    </VStack>
                </Box>
        </AppLayout>
    );
}