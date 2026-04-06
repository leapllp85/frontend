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
import { getRiskColor } from '@/utils/riskColors';

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
    business_unit?: string; // Business unit for the project
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
    const [filters, setFilters] = useState({
        businessUnit: '',
        criticality: '',
        status: ''
    });

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
            const businessUnits = ['Supply Chain', 'Merchandising', 'Digital', 'Operations', 'Finance'];
            const transformedProjects: Project[] = response.results.projects.map((project, index) => ({
                ...project,
                name: project.title, // Map title to name
                timeline: project.go_live_date, // Map go_live_date to timeline
                contributors: project.assigned_to || [], // Use assigned_to as contributors
                business_unit: project.business_unit || businessUnits[index % businessUnits.length] // Add dummy business unit
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
            <Box w="full" h="100vh" bg="gray.50" overflow="auto">
                {/* Content */}
                <Box px={8} py={6}>
                    <VStack gap={6} align="stretch" w="full">
                    {/* Stats Cards */}
                    {!loading && !error && (
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Card.Body p={5}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="500">Total Projects</Text>
                                        <Text fontSize="3xl" fontWeight="700" color="gray.900">{totalCount}</Text>
                                    </VStack>
                                    <Box p={3} bg="teal.50" borderRadius="lg">
                                        <Folder size={24} color="#0f766e" />
                                    </Box>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                        <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Card.Body p={5}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="500">Active</Text>
                                        <Text fontSize="3xl" fontWeight="700" color="green.600">{projects.filter(p => p.status === 'Active').length}</Text>
                                    </VStack>
                                    <Box p={3} bg="green.50" borderRadius="lg">
                                        <Users size={24} color="#16a34a" />
                                    </Box>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                        <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Card.Body p={5}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={1}>
                                        <Text fontSize="sm" color="gray.600" fontWeight="500">High Priority</Text>
                                        <Text fontSize="3xl" fontWeight="700" color="red.600">{projects.filter(p => p.criticality === 'High').length}</Text>
                                    </VStack>
                                    <Box p={3} bg="red.50" borderRadius="lg">
                                        <AlertTriangle size={24} color="#dc2626" />
                                    </Box>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    </SimpleGrid>
                    )}

                    {/* Search Bar and New Project Button */}
                    {!loading && !error && (
                        <HStack gap={4} flexWrap="wrap">
                            <Box position="relative" flex={1} minW="300px">
                                <Input
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    pl={10}
                                    size="lg"
                                    bg="white"
                                    border="2px solid"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    _focus={{
                                        borderColor: "teal.500",
                                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)"
                                    }}
                                />
                                <Box
                                    position="absolute"
                                    left={4}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    color="gray.400"
                                >
                                    <Search size={18} />
                                </Box>
                            </Box>
                            <RequireProjectCreate>
                                <Button 
                                    onClick={() => router.push('/projects/onboard')}
                                    colorPalette="teal"
                                    size="lg"
                                    fontWeight="600"
                                >
                                    <Plus size={20} />
                                    New Project
                                </Button>
                            </RequireProjectCreate>
                        </HStack>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <Flex justify="center" align="center" minH="400px">
                            <VStack gap={4}>
                                <Spinner size="xl" color="teal.500" />
                                <Text color="gray.600">Loading projects...</Text>
                            </VStack>
                        </Flex>
                    )}

                    {/* Error State */}
                    {error && (
                        <Card.Root bg="white" borderRadius="lg">
                            <Card.Body p={8}>
                                <VStack gap={4}>
                                    <Text color="red.600">{error}</Text>
                                    <Button onClick={() => window.location.reload()} colorPalette="teal">
                                        Retry
                                    </Button>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    )}

                    {/* Projects Table */}
                    {!loading && !error && (
                        <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Card.Body p={0}>
                                <Box overflowX="auto">
                                    <Table.Root size="sm" variant="line">
                                        <Table.Header>
                                            <Table.Row bg="linear-gradient(to bottom, #e5e7eb 0%, #d1d5db 100%)" borderBottom="2px solid" borderColor="gray.300">
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" verticalAlign="top">
                                                    <VStack align="start" gap={2} h="70px">
                                                        <Text fontSize="sm">Business Unit</Text>
                                                        <Input
                                                            size="sm"
                                                            placeholder="Filter..."
                                                            value={filters.businessUnit}
                                                            onChange={(e) => setFilters({...filters, businessUnit: e.target.value})}
                                                            bg="white"
                                                            fontSize="xs"
                                                        />
                                                    </VStack>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" verticalAlign="top">
                                                    <Box h="70px" display="flex" alignItems="start">
                                                        <Text fontSize="sm">Project Name</Text>
                                                    </Box>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" w="250px" verticalAlign="top">
                                                    <Box h="70px" display="flex" alignItems="start">
                                                        <Text fontSize="sm">Description</Text>
                                                    </Box>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" verticalAlign="top">
                                                    <VStack align="start" gap={2} h="70px">
                                                        <Text fontSize="sm">Criticality</Text>
                                                        <select
                                                            value={filters.criticality}
                                                            onChange={(e) => setFilters({...filters, criticality: e.target.value})}
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '12px',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '4px',
                                                                backgroundColor: 'white',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <option value="">All</option>
                                                            <option value="High">High</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="Low">Low</option>
                                                        </select>
                                                    </VStack>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" verticalAlign="top">
                                                    <Box h="70px" display="flex" alignItems="start">
                                                        <Text fontSize="sm">Timeline</Text>
                                                    </Box>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" verticalAlign="top">
                                                    <Box h="70px" display="flex" alignItems="start">
                                                        <Text fontSize="sm">Contributors</Text>
                                                    </Box>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" verticalAlign="top">
                                                    <VStack align="start" gap={2} h="70px">
                                                        <Text fontSize="sm">Status</Text>
                                                        <select
                                                            value={filters.status}
                                                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '12px',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '4px',
                                                                backgroundColor: 'white',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <option value="">All</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </VStack>
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader p={3} fontWeight="600" color="gray.800" textAlign="center" verticalAlign="top">
                                                    <Box h="70px" display="flex" alignItems="start" justifyContent="center">
                                                        <Text fontSize="sm">Actions</Text>
                                                    </Box>
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {projects
                                                .filter(p => !filters.businessUnit || (p.business_unit || '').toLowerCase().includes(filters.businessUnit.toLowerCase()))
                                                .filter(p => !filters.criticality || p.criticality === filters.criticality)
                                                .filter(p => !filters.status || p.status === filters.status)
                                                .map((project) => (
                                                    <Table.Row key={project.id} _hover={{ bg: "teal.50" }} h="60px">
                                                        <Table.Cell p={3}>
                                                            <Text fontSize="sm" fontWeight="500" color="gray.900">
                                                                {project.business_unit || 'N/A'}
                                                            </Text>
                                                        </Table.Cell>
                                                        <Table.Cell p={3}>
                                                            <Text fontSize="sm" fontWeight="600" color="teal.700">
                                                                {project.name}
                                                            </Text>
                                                        </Table.Cell>
                                                        <Table.Cell p={3} w="250px">
                                                            <Box maxH="45px" overflowY="auto" pr={2}
                                                                css={{
                                                                    '&::-webkit-scrollbar': {
                                                                        width: '4px',
                                                                    },
                                                                    '&::-webkit-scrollbar-track': {
                                                                        background: '#f1f1f1',
                                                                    },
                                                                    '&::-webkit-scrollbar-thumb': {
                                                                        background: '#14b8a6',
                                                                        borderRadius: '2px',
                                                                    },
                                                                }}
                                                            >
                                                                <Text fontSize="xs" color="gray.600" lineHeight="1.4">
                                                                    {project.description}
                                                                </Text>
                                                            </Box>
                                                        </Table.Cell>
                                                        <Table.Cell p={3}>
                                                            <Badge
                                                                colorPalette={getRiskColor(project.criticality)}
                                                                variant="solid"
                                                                size="sm"
                                                            >
                                                                {project.criticality}
                                                            </Badge>
                                                        </Table.Cell>
                                                        <Table.Cell p={3}>
                                                            <VStack align="start" gap={0}>
                                                                <Text fontSize="xs" color="gray.700" fontWeight="500">
                                                                    {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                                </Text>
                                                                <Text fontSize="2xs" color="gray.400">↓</Text>
                                                                <Text fontSize="xs" color="gray.700" fontWeight="500">
                                                                    {new Date(project.go_live_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                                </Text>
                                                            </VStack>
                                                        </Table.Cell>
                                                        <Table.Cell p={3}>
                                                            <VStack align="start" gap={1}>
                                                                <HStack gap={1}>
                                                                    <AvatarGroup size="xs">
                                                                        {project.contributors.slice(0, 2).map((contributor: any, idx: number) => (
                                                                            <Avatar.Root key={contributor.id || idx} size="xs" bg="teal.600" color="white">
                                                                                <Avatar.Fallback fontSize="2xs" fontWeight="600">
                                                                                    {(contributor.first_name?.[0] || contributor.username?.[0] || 'U')}{(contributor.last_name?.[0] || '')}
                                                                                </Avatar.Fallback>
                                                                            </Avatar.Root>
                                                                        ))}
                                                                    </AvatarGroup>
                                                                    {project.contributors.length > 2 && (
                                                                        <Text fontSize="2xs" color="gray.600">
                                                                            +{project.contributors.length - 2}
                                                                        </Text>
                                                                    )}
                                                                </HStack>
                                                                {project.contributors.length > 0 && (
                                                                    <Text fontSize="2xs" color="gray.600" lineClamp={1}>
                                                                        {project.contributors.slice(0, 2).map((c: any) => 
                                                                            `${c.first_name || c.username || 'User'} ${c.last_name || ''}`.trim()
                                                                        ).join(', ')}
                                                                        {project.contributors.length > 2 && '...'}
                                                                    </Text>
                                                                )}
                                                            </VStack>
                                                        </Table.Cell>
                                                        <Table.Cell p={3}>
                                                            <Badge
                                                                colorPalette={getStatusColor(project.status)}
                                                                variant="subtle"
                                                                size="sm"
                                                            >
                                                                {project.status}
                                                            </Badge>
                                                        </Table.Cell>
                                                        <Table.Cell p={3}>
                                                            <HStack gap={2} justify="center">
                                                                <Button
                                                                    size="xs"
                                                                    colorPalette="teal"
                                                                    variant="outline"
                                                                    onClick={() => router.push(`/projects/edit/${project.id}`)}
                                                                >
                                                                    <Edit size={12} />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="xs"
                                                                    colorPalette="blue"
                                                                    variant="ghost"
                                                                    onClick={() => router.push(`/projects/${project.id}`)}
                                                                >
                                                                    <Eye size={12} />
                                                                    View
                                                                </Button>
                                                            </HStack>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                    </Box>
                                </Card.Body>
                            </Card.Root>
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
            </Box>
        </AppLayout>
    );
}