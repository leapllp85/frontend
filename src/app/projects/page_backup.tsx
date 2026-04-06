"use client";

import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Badge, Card, Flex, Avatar, AvatarGroup } from '@chakra-ui/react';
import { Folder, Users, AlertTriangle, Edit, Calendar } from 'lucide-react';
import { projectApi, Project as ApiProject, ProjectsPaginatedResponse, ProjectsQueryParams } from '@/services';
import { RequireProjectCreate } from '@/components/RoleGuard';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable, TableColumn } from '@/components/common/DataTable';
import { StatsTile } from '@/components/common/StatsTile';
import { StatsGrid } from '@/components/common/StatsGrid';
import { FilterPanel, FilterConfig } from '@/components/common/FilterPanel';
import { useScreenSize } from '@/hooks/useScreenSize';
import { getResponsivePadding } from '@/utils/typography';
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
    const [pageSize, setPageSize] = useState(12);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        businessUnit: '',
        criticality: '',
        status: ''
    });
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

    const screenSize = useScreenSize();
    const padding = getResponsivePadding(screenSize);

    const fetchProjects = async (params?: ProjectsQueryParams) => {
        try {
            setLoading(true);
            const response: ProjectsPaginatedResponse = await projectApi.getProjects(params);

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
            fetchProjects({ 
                page: currentPage, 
                page_size: pageSize,
                search: searchQuery || undefined
            });
        }, searchQuery ? 300 : 0);

        return () => clearTimeout(timeoutId);
    }, [currentPage, pageSize, searchQuery]);

    const filteredProjects = projects.filter(project => {
        if (filters.businessUnit && !(project.business_unit || '').toLowerCase().includes(filters.businessUnit.toLowerCase())) return false;
        if (filters.criticality && project.criticality !== filters.criticality) return false;
        if (filters.status && project.status !== filters.status) return false;
        return true;
    });

    const filterConfigs: FilterConfig[] = [
        {
            key: 'businessUnit',
            label: 'Business Unit',
            type: 'text',
            placeholder: 'Filter by unit...'
        },
        {
            key: 'criticality',
            label: 'Criticality',
            type: 'select',
            options: [
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' }
            ],
            placeholder: 'All'
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
            ],
            placeholder: 'All'
        }
    ];

    const columns: TableColumn<Project>[] = [
        {
            key: 'business_unit',
            header: 'Business Unit',
            width: '15%',
            align: 'left',
            priority: 'medium',
            render: (value) => (
                <Text fontSize="sm" fontWeight="500" color="gray.900">
                    {value || 'N/A'}
                </Text>
            )
        },
        {
            key: 'name',
            header: 'Project Name',
            width: '20%',
            align: 'left',
            priority: 'high',
            render: (value) => (
                <Text fontSize="sm" fontWeight="600" color="teal.700">
                    {value}
                </Text>
            )
        },
        {
            key: 'description',
            header: 'Description',
            width: '25%',
            align: 'left',
            priority: 'low',
            truncate: true,
            maxLength: 100,
            render: (value) => (
                <Text fontSize="xs" color="gray.600" lineHeight="1.4">
                    {value}
                </Text>
            )
        },
        {
            key: 'criticality',
            header: 'Criticality',
            width: '12%',
            align: 'center',
            priority: 'high',
            render: (value) => (
                <Badge colorPalette={getRiskColor(value)} variant="solid" size="md" borderRadius="full" fontWeight="600">
                    {value}
                </Badge>
            )
        },
        {
            key: 'timeline',
            header: 'Timeline',
            width: '13%',
            align: 'center',
            priority: 'medium',
            render: (_, row) => (
                <VStack align="center" gap={0}>
                    <Text fontSize="xs" color="gray.700" fontWeight="500">
                        {new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </Text>
                    <Text fontSize="2xs" color="gray.400">↓</Text>
                    <Text fontSize="xs" color="gray.700" fontWeight="500">
                        {new Date(row.go_live_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </Text>
                </VStack>
            )
        },
        {
            key: 'status',
            header: 'Status',
            width: '10%',
            align: 'center',
            priority: 'medium',
            render: (value) => (
                <Badge colorPalette={value === 'Active' ? 'green' : 'gray'} variant="subtle" size="sm">
                    {value}
                </Badge>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '10%',
            align: 'center',
            priority: 'high',
            render: (_, row) => (
                <HStack gap={2} justify="center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/projects/edit/${row.id}`);
                        }}
                        style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#0f766e',
                            border: '1px solid #0f766e',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Edit size={12} />
                        Edit
                    </button>
                </HStack>
            )
        }
    ];

    return (
        <AppLayout>
            <Box w="full" h="100vh" bg="gray.50" overflow="auto">
                <Box px={padding.px} py={padding.py} maxW="1920px" mx="auto">
                    <VStack gap={4} align="stretch" w="full">
                        {/* Stats Grid */}
                        <StatsGrid columns={{ base: 1, sm: 2, md: 3 }}>
                            <StatsTile
                                icon={Folder}
                                iconColor="#0f766e"
                                iconBgColor="teal.50"
                                label="Total Projects"
                                value={totalCount}
                                valueColor="teal.600"
                                loading={loading}
                            />
                            <StatsTile
                                icon={Users}
                                iconColor="#16a34a"
                                iconBgColor="green.50"
                                label="Active"
                                value={projects.filter(p => p.status === 'Active').length}
                                valueColor="green.600"
                                loading={loading}
                            />
                            <StatsTile
                                icon={AlertTriangle}
                                iconColor="#dc2626"
                                iconBgColor="red.50"
                                label="High Priority"
                                value={projects.filter(p => p.criticality === 'High').length}
                                valueColor="red.600"
                                loading={loading}
                            />
                        </StatsGrid>

                        {/* Data Table with Side Card */}
                        <Flex gap={4} position="relative">
                            <Box flex="1">
                                <DataTable
                                    data={filteredProjects}
                                    columns={columns}
                                    title="Projects"
                                    description="Manage and track all projects"
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredCount / pageSize)}
                                    totalItems={totalCount}
                                    itemsPerPage={pageSize}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setPageSize}
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    searchPlaceholder="Search projects..."
                                    filteredCount={filteredCount}
                                    filterPanel={
                                        <FilterPanel
                                            filters={filterConfigs}
                                            values={filters}
                                            onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
                                            onReset={() => setFilters({ businessUnit: '', criticality: '', status: '' })}
                                        />
                                    }
                                    loading={loading}
                                    emptyMessage="No projects found"
                                    rowHeight="60px"
                                    onRowHover={setHoveredProject}
                                />
                            </Box>

                            {/* Side Display Card */}
                            {hoveredProject && (
                                <Box
                                    w="300px"
                                    position="sticky"
                                    top={4}
                                    alignSelf="flex-start"
                                    transition="all 0.3s ease"
                                >
                                    <Card.Root 
                                        bg="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" 
                                        shadow="2xl" 
                                        borderRadius="2xl"
                                        overflow="hidden"
                                    >
                                        <Card.Body p={5}>
                                            <VStack align="stretch" gap={4}>
                                                <VStack align="center" gap={1}>
                                                    <Text fontSize="xl" fontWeight="bold" color="white" textAlign="center">
                                                        Project Details
                                                    </Text>
                                                </VStack>

                                                <VStack align="start" gap={1} bg="whiteAlpha.200" p={3} borderRadius="lg">
                                                    <Text fontSize="md" fontWeight="bold" color="white">
                                                        {hoveredProject.name}
                                                    </Text>
                                                    <Badge 
                                                        colorPalette={hoveredProject.status === 'Active' ? 'green' : 'gray'} 
                                                        size="sm"
                                                        bg={hoveredProject.status === 'Active' ? '#166534' : '#4b5563'}
                                                        color="white"
                                                        px={3}
                                                        py={1}
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
                                                        <Badge 
                                                            colorPalette={getRiskColor(hoveredProject.criticality)}
                                                            size="sm" 
                                                            borderRadius="full"
                                                            bg={hoveredProject.criticality === 'Low' ? '#166534' : hoveredProject.criticality === 'High' ? '#991b1b' : '#854d0e'}
                                                            color="white"
                                                            px={3}
                                                            py={1}
                                                        >
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
                                                                    {new Date(hoveredProject.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                                </Text>
                                                            </VStack>
                                                            <Text fontSize="lg" color="whiteAlpha.600">→</Text>
                                                            <VStack align="start" gap={0} flex="1">
                                                                <Text fontSize="xs" color="whiteAlpha.800">Go Live:</Text>
                                                                <Text fontSize="xs" fontWeight="500" color="white">
                                                                    {new Date(hoveredProject.go_live_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
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
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                </Box>
                            )}
                        </Flex>
                    </VStack>
                </Box>
            </Box>
        </AppLayout>
    );
}
