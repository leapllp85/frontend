"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Card,
    Button,
    Badge,
    Avatar,
    AvatarGroup,
    SimpleGrid,
    Spinner,
    Input
} from '@chakra-ui/react';
import { Pagination } from '@/components/common/Pagination';
import { Search, Plus, Users, Folder, AlertTriangle, Calendar, Edit } from 'lucide-react';
import { projectApi, Project as ApiProject } from '@/services';
import { RequireProjectCreate } from '@/components/RoleGuard';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layouts/AppLayout';
import { getRiskColor } from '@/utils/riskColors';

type Project = ApiProject & {
    name: string;
    timeline: string;
    contributors: any[];
    business_unit?: string;
};

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        businessUnit: '',
        criticality: '',
        status: 'Active'
    });
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getProjects({
                page: currentPage,
                page_size: pageSize,
                search: searchQuery || undefined
            });

            const businessUnits = ['Supply Chain', 'Merchandising', 'Digital', 'Operations', 'Finance'];
            const transformedProjects: Project[] = response.results.projects.map((project, index) => ({
                ...project,
                name: project.title,
                timeline: project.go_live_date,
                contributors: project.assigned_to || [],
                business_unit: project.business_unit || businessUnits[index % businessUnits.length]
            }));
            
            setProjects(transformedProjects);
            setTotalCount(response.count);
            setFilteredCount(response.results.total_results || response.count);
            setError(null);
        } catch (err) {
            setError('Failed to load projects. Please try again.');
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProjects();
        }, searchQuery ? 300 : 0);

        return () => clearTimeout(timeoutId);
    }, [currentPage, pageSize, searchQuery]);

    const filteredProjects = projects.filter(project => {
        if (filters.businessUnit && !(project.business_unit || '').toLowerCase().includes(filters.businessUnit.toLowerCase())) return false;
        if (filters.criticality && project.criticality !== filters.criticality) return false;
        if (filters.status && project.status !== filters.status) return false;
        return true;
    });

    // Set first project as default selection
    useEffect(() => {
        if (filteredProjects.length > 0 && !hoveredProject) {
            setHoveredProject(filteredProjects[0]);
        }
    }, [filteredProjects]);

    return (
        <AppLayout>
            <Box w="full" minH="100vh" bg="gray.50" overflow="auto">
                <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 2, md: 2 }} maxW="1920px" mx="auto">
                    <VStack gap={4} align="stretch" w="full">
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
                                            <Box p={3} bg="blue.50" borderRadius="lg">
                                                <Folder size={24} color="#3B82F6" />
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

                        {/* Projects Management Section - 70/30 Split */}
                        {!loading && !error && (
                            <HStack align="stretch" gap={4} h="calc(100vh - 300px)">
                                <Card.Root bg="white" shadow="sm" borderRadius="3xl" w="70%" h="120%" display="flex" flexDirection="column">
                                    <Card.Header p={3}>
                                        <HStack justify="space-between">
                                            <VStack align="start" gap={1}>
                                                <Text fontSize="lg" fontWeight="600" color="gray.900">Projects</Text>
                                                <Text fontSize="sm" color="gray.500">Manage and track all projects</Text>
                                            </VStack>
                                            <RequireProjectCreate>
                                                <Button 
                                                    onClick={() => router.push('/projects/onboard')}
                                                    colorPalette="blue"
                                                    size="sm"
                                                >
                                                    <Plus size={16} />
                                                    New Project
                                                </Button>
                                            </RequireProjectCreate>
                                        </HStack>
                                        
                                        {/* Search and Filters */}
                                        <VStack gap={3} mt={3} align="stretch">
                                            <Input
                                                placeholder="Search projects..."
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                size="md"
                                            />
                                            <HStack gap={3} flexWrap="wrap">
                                                <Text fontSize="sm" fontWeight="600" color="gray.700">Filters:</Text>
                                                <select
                                                    value={filters.businessUnit}
                                                    onChange={(e) => {
                                                        setFilters({...filters, businessUnit: e.target.value});
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
                                                        cursor: 'pointer',
                                                        minWidth: '140px'
                                                    }}
                                                >
                                                    <option value="">All Business Units</option>
                                                    <option value="Supply Chain">Supply Chain</option>
                                                    <option value="Merchandising">Merchandising</option>
                                                    <option value="Digital">Digital</option>
                                                    <option value="Operations">Operations</option>
                                                    <option value="Finance">Finance</option>
                                                </select>
                                                <select
                                                    value={filters.criticality}
                                                    onChange={(e) => {
                                                        setFilters({...filters, criticality: e.target.value});
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
                                                        cursor: 'pointer',
                                                        minWidth: '140px'
                                                    }}
                                                >
                                                    <option value="">All Criticality</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                                <select
                                                    value={filters.status}
                                                    onChange={(e) => {
                                                        setFilters({...filters, status: e.target.value});
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
                                                        cursor: 'pointer',
                                                        minWidth: '140px'
                                                    }}
                                                >
                                                    <option value="">All Status</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </HStack>
                                        </VStack>
                                    </Card.Header>
                                    
                                    <Card.Body p={3} py={0} flex="1" minH="0">
                                        <Box overflowX="auto" h="120%" css={{
                                            '&::-webkit-scrollbar': { width: '6px' },
                                            '&::-webkit-scrollbar-track': { background: '#f1f5f9', borderRadius: '10px' },
                                            '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '10px' },
                                            '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
                                        }}>
                                            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'separate', borderSpacing: 0 }}>
                                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Unit</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Name</th>
                                                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Criticality</th>
                                                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredProjects.map((project, index) => (
                                                        <tr 
                                                            key={project.id}
                                                            onMouseEnter={() => setHoveredProject(project)}
                                                            style={{ 
                                                                borderBottom: '1px solid #e5e7eb',
                                                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <td style={{ padding: '16px 12px' }}>
                                                                <Text fontSize="sm" fontWeight="500" color="gray.900">
                                                                    {project.business_unit || 'N/A'}
                                                                </Text>
                                                            </td>
                                                            <td style={{ padding: '16px 12px' }}>
                                                                <Text fontSize="sm" fontWeight="600" color="blue.700">
                                                                    {project.name}
                                                                </Text>
                                                            </td>
                                                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                                <VStack align="center" gap={0}>
                                                                    <Text fontSize="xs" color="gray.700" fontWeight="500">
                                                                        {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </Text>
                                                                    <Text fontSize="2xs" color="gray.400">↓</Text>
                                                                    <Text fontSize="xs" color="gray.700" fontWeight="500">
                                                                        {new Date(project.go_live_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </Text>
                                                                </VStack>
                                                            </td>
                                                            <td style={{ padding: '16px 12px' }}>
                                                                <Badge colorPalette={getRiskColor(project.criticality)} size="sm">
                                                                    {project.criticality}
                                                                </Badge>
                                                            </td>
                                                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                                <Badge colorPalette={project.status === 'Active' ? 'green' : 'gray'} size="sm">
                                                                    {project.status}
                                                                </Badge>
                                                            </td>
                                                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                                <Button
                                                                    size="xs"
                                                                    variant="ghost"
                                                                    colorPalette="blue"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        router.push(`/projects/edit/${project.id}`);
                                                                    }}
                                                                    _hover={{ bg: 'blue.50' }}
                                                                >
                                                                    <Edit size={14} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Box>
                                    </Card.Body>
                                    
                                    <Card.Footer p={4} borderTop="1px solid" borderColor="gray.200">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(filteredCount / pageSize)}
                                            totalItems={filteredCount}
                                            itemsPerPage={pageSize}
                                            onPageChange={setCurrentPage}
                                            loading={loading}
                                            showFirstLast={true}
                                            showPageNumbers={true}
                                            hideItemCount={true}
                                        />
                                    </Card.Footer>
                                </Card.Root>

                                {/* Side Card - Always Visible */}
                                <Card.Root 
                                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    shadow="sm" 
                                    borderRadius="3xl"
                                    w="30%" 
                                    h="120%"
                                    overflow="auto"
                                    css={{
                                        '&::-webkit-scrollbar': { width: '6px' },
                                        '&::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' },
                                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.3)', borderRadius: '10px' },
                                        '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255, 255, 255, 0.5)' },
                                    }}
                                >
                                    <Card.Body p={5}>
                                        <VStack align="stretch" gap={4}>
                                            <VStack align="center" gap={1}>
                                                <Text fontSize="xl" fontWeight="bold" color="white" textAlign="center">
                                                    {hoveredProject ? 'Project Details' : 'Select a Project'}
                                                </Text>
                                            </VStack>

                                            {hoveredProject ? (
                                                <>
                                                    <VStack align="start" gap={1} bg="whiteAlpha.200" p={3} borderRadius="lg">
                                                        <Text fontSize="md" fontWeight="bold" color="white">
                                                            {hoveredProject.name}
                                                        </Text>
                                                        <Badge 
                                                            colorPalette={hoveredProject.status === 'Active' ? 'green' : 'gray'} 
                                                            size="sm"
                                                        >
                                                            {hoveredProject.status}
                                                        </Badge>
                                                    </VStack>

                                                    <VStack align="stretch" gap={2}>
                                                        <HStack justify="space-between" align="center">
                                                            <Text fontSize="sm" color="white" fontWeight="500">Business Unit:</Text>
                                                            <Text fontSize="sm" fontWeight="600" color="white">
                                                                {hoveredProject.business_unit || 'N/A'}
                                                            </Text>
                                                        </HStack>
                                                        <HStack justify="space-between" align="center">
                                                            <Text fontSize="sm" color="white" fontWeight="500">Criticality:</Text>
                                                            <Badge colorPalette={getRiskColor(hoveredProject.criticality)} size="sm">
                                                                {hoveredProject.criticality}
                                                            </Badge>
                                                        </HStack>
                                                        
                                                        <VStack align="start" gap={1} mt={2}>
                                                            <Text fontSize="sm" color="white" fontWeight="500">Description:</Text>
                                                            <Text fontSize="xs" color="whiteAlpha.900" lineHeight="1.5">
                                                                {hoveredProject.description}
                                                            </Text>
                                                        </VStack>
                                                        
                                                        <VStack align="start" gap={1} mt={2}>
                                                            <Text fontSize="sm" color="white" fontWeight="500">Timeline:</Text>
                                                            <HStack gap={2} w="full">
                                                                <VStack align="start" gap={0} flex="1">
                                                                    <Text fontSize="xs" color="whiteAlpha.800">Start:</Text>
                                                                    <Text fontSize="xs" fontWeight="500" color="white">
                                                                        {new Date(hoveredProject.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </Text>
                                                                </VStack>
                                                                <Text fontSize="lg" color="whiteAlpha.600">→</Text>
                                                                <VStack align="start" gap={0} flex="1">
                                                                    <Text fontSize="xs" color="whiteAlpha.800">Go Live:</Text>
                                                                    <Text fontSize="xs" fontWeight="500" color="white">
                                                                        {new Date(hoveredProject.go_live_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </VStack>
                                                        
                                                        <VStack align="start" gap={2} mt={2}>
                                                            <Text fontSize="sm" color="white" fontWeight="500">Contributors:</Text>
                                                            {hoveredProject.contributors.length > 0 ? (
                                                                <>
                                                                    <AvatarGroup size="sm">
                                                                        {hoveredProject.contributors.slice(0, 5).map((contributor: any, idx: number) => (
                                                                            <Avatar.Root key={contributor.id || idx} size="sm" bg="whiteAlpha.300" color="white" border="2px solid" borderColor="white">
                                                                                <Avatar.Fallback fontSize="xs" fontWeight="600">
                                                                                    {(contributor.first_name?.[0] || contributor.username?.[0] || 'U')}{(contributor.last_name?.[0] || '')}
                                                                                </Avatar.Fallback>
                                                                            </Avatar.Root>
                                                                        ))}
                                                                    </AvatarGroup>
                                                                    <VStack align="start" gap={0}>
                                                                        {hoveredProject.contributors.slice(0, 3).map((c: any, idx: number) => (
                                                                            <Text key={idx} fontSize="xs" color="whiteAlpha.900">
                                                                                • {`${c.first_name || c.username || 'User'} ${c.last_name || ''}`.trim()}
                                                                            </Text>
                                                                        ))}
                                                                        {hoveredProject.contributors.length > 3 && (
                                                                            <Text fontSize="xs" color="whiteAlpha.800">
                                                                                +{hoveredProject.contributors.length - 3} more
                                                                            </Text>
                                                                        )}
                                                                    </VStack>
                                                                </>
                                                            ) : (
                                                                <Text fontSize="xs" color="whiteAlpha.800">No contributors assigned</Text>
                                                            )}
                                                        </VStack>
                                                    </VStack>
                                                </>
                                            ) : (
                                                <VStack align="center" justify="center" h="200px" gap={3}>
                                                    <Text fontSize="lg" color="whiteAlpha.800" textAlign="center">
                                                        Hover over a project to see details
                                                    </Text>
                                                </VStack>
                                            )}
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            </HStack>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <Box textAlign="center" py={12}>
                                <Spinner size="xl" color="blue.500" />
                                <Text mt={4} color="gray.600">Loading projects...</Text>
                            </Box>
                        )}

                        {/* Error State */}
                        {error && (
                            <Box textAlign="center" py={12}>
                                <Text fontSize="lg" color="red.500" mb={4}>{error}</Text>
                                <Button onClick={() => window.location.reload()} colorPalette="blue">
                                    Retry
                                </Button>
                            </Box>
                        )}
                    </VStack>
                </Box>
            </Box>
        </AppLayout>
    );
}
