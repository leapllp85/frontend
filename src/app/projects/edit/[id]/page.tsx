'use client';

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
    Input,
} from '@chakra-ui/react';
import { ArrowLeft, Save, Users, AlertTriangle, User } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { projectApi, allocationApi, Project as ApiProject, ProjectAllocation } from '@/services';

// Local getRiskColor function to ensure reliability
const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        case 'Low': return 'green';
        default: return 'gray';
    }
};

interface Contributor {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    criticality: string;
    allocationPercentage: number;
}

interface Project {
    id: string;
    name: string;
    criticality: 'High' | 'Medium' | 'Low';
    isActive: boolean;
    contributors: Contributor[];
    description?: string;
    startDate?: string;
    endDate?: string;
}

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [allocations, setAllocations] = useState<ProjectAllocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch project data from API
    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);
                
                // Fetch project details and allocations in parallel
                const [projectData, projectTeam] = await Promise.all([
                    projectApi.getProject(Number(projectId)),
                    projectApi.getProjectTeam(Number(projectId))
                ]);
                
                // Transform API data to match UI expectations
                const transformedProject: Project = {
                    id: projectData.id.toString(),
                    name: projectData.title,
                    criticality: projectData.criticality,
                    isActive: projectData.project_status === 'Active',
                    description: projectData.description,
                    startDate: projectData.start_date,
                    endDate: projectData.go_live_date,
                    contributors: projectData.assigned_to.map(user => ({
                        id: user.id.toString(),
                        name: `${user.first_name} ${user.last_name}` || user.username,
                        email: user.email,
                        criticality: 'Medium', // Default, will be updated from allocations
                        allocationPercentage: 0 // Will be updated from allocations
                    }))
                };
                
                setProject(transformedProject);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch project data:', err);
                setError('Failed to load project data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    // Helper functions
    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'High': return 'red';
            case 'Medium': return 'orange';
            case 'Low': return 'green';
            default: return 'gray';
        }
    };

    const handleStatusToggle = () => {
        setProject(prev => prev ? ({ ...prev, isActive: !prev.isActive }) : null);
    };

    const handleAllocationChange = (contributorId: string, percentage: number) => {
        setProject(prev => prev ? ({
            ...prev,
            contributors: prev.contributors.map(contributor =>
                contributor.id === contributorId
                    ? { ...contributor, allocationPercentage: percentage }
                    : contributor
            )
        }) : null);
    };

    const handleSave = async () => {
        if (!project) return;
        
        setSaving(true);
        try {
            // Update project via API
            const updatedProject = await projectApi.updateProject(Number(project.id), {
                title: project.name,
                criticality: project.criticality,
                project_status: project.isActive ? 'Active' : 'Inactive',
                description: project.description,
                start_date: project.startDate,
                go_live_date: project.endDate
            });
            
            console.log('Project updated successfully:', updatedProject);
            router.push('/projects');
        } catch (error) {
            console.error('Error saving project:', error);
            setError('Failed to save project changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const totalAllocation = project?.contributors?.reduce((sum, contributor) => sum + contributor.allocationPercentage, 0) || 0;

    return (
        <Box w="full" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Box className="max-w-6xl mx-auto px-6 py-12">
                <VStack gap={10} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                        <HStack gap={4}>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/projects')}
                                size="lg"
                            >
                                <HStack gap={2}>
                                    <ArrowLeft size={20} />
                                    <Text>Back to Projects</Text>
                                </HStack>
                            </Button>
                            <Box>
                                <Heading size="xl" color="gray.800">
                                    Edit Project
                                </Heading>
                                <Text color="gray.600" mt={1}>
                                    Manage project status and team allocations
                                </Text>
                            </Box>
                        </HStack>
                        
                        <Button
                            bg="#a5489f"
                            color="white"
                            _hover={{ bg: "#8a3d85" }}
                            size="lg"
                            loading={loading}
                            onClick={handleSave}
                        >
                            <HStack gap={2}>
                                <Save size={20} />
                                <Text>Save Changes</Text>
                            </HStack>
                        </Button>
                    </HStack>

                    {/* Project Info Card */}
                    <Card.Root
                        bg="#a5479f"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        borderRadius="xl"
                        shadow="lg"
                        _hover={{ shadow: "xl" }}
                        transition="all 0.3s ease"
                    >
                        <Card.Header>
                            <HStack justify="space-between" align="center">
                                <VStack align="start" gap={1}>
                                    <Heading size="lg" color="white">{project?.name}</Heading>
                                    <HStack gap={2}>
                                        <Badge
                                            colorPalette={getCriticalityColor(project?.criticality || 'Medium')}
                                            variant="solid"
                                        >
                                            <HStack gap={1}>
                                                <AlertTriangle size={12} />
                                                <Text>{project?.criticality} Priority</Text>
                                            </HStack>
                                        </Badge>
                                        <Button
                                            onClick={handleStatusToggle}
                                            colorPalette={getRiskColor(project?.isActive ? 'Low' : 'High')}
                                            variant={project?.isActive ? 'solid' : 'outline'}
                                            size="sm"
                                        >
                                            {project?.isActive ? 'Active' : 'Inactive'}
                                        </Button>
                                    </HStack>
                                </VStack>
                                
                                <HStack gap={3}>
                                    <Text fontWeight="semibold" color="white">
                                        Project Status:
                                    </Text>
                                    <Button
                                        onClick={handleStatusToggle}
                                        colorPalette={project?.isActive ? "green" : "red"}
                                        variant={project?.isActive ? "solid" : "outline"}
                                        size="sm"
                                    >
                                        {project?.isActive ? 'Active' : 'Inactive'}
                                    </Button>
                                </HStack>
                            </HStack>
                        </Card.Header>
                    </Card.Root>

                    {/* Team Allocation Card */}
                    <Card.Root
                        bg="#a5479f"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        borderRadius="xl"
                        shadow="lg"
                        _hover={{ shadow: "xl" }}
                        transition="all 0.3s ease"
                    >
                        <Card.Header>
                            <HStack justify="space-between" align="center">
                                <HStack gap={2}>
                                    <Users size={24} color="white" />
                                    <Heading size="md" color="white">Team Allocation</Heading>
                                </HStack>
                                <Badge
                                    colorPalette={getRiskColor(totalAllocation > 100 ? 'High' : totalAllocation === 100 ? 'Low' : 'Medium')}
                                    variant="solid"
                                    fontSize="md"
                                    px={3}
                                    py={1}
                                >
                                    Total: {totalAllocation}%
                                </Badge>
                            </HStack>
                        </Card.Header>
                        <Card.Body>
                            <VStack gap={4} align="stretch">
                                {/* Table Header */}
                                <HStack gap={4} p={3} bg="whiteAlpha.200" borderRadius="md" fontWeight="semibold">
                                    <Box flex="2" color="white">Team Member</Box>
                                    <Box flex="1" color="white">Criticality</Box>
                                    <Box flex="1" color="white">Allocation %</Box>
                                    <Box flex="2" color="white">Allocation Control</Box>
                                </HStack>
                                
                                {/* Table Rows */}
                                {project?.contributors?.map((contributor) => (
                                    <HStack key={contributor.id} gap={4} p={3} border="1px solid" borderColor="whiteAlpha.300" borderRadius="md" bg="whiteAlpha.100">
                                        {/* Team Member */}
                                        <Box flex="2">
                                            <HStack gap={3}>
                                                <Box
                                                    w="32px"
                                                    h="32px"
                                                    borderRadius="full"
                                                    bg="purple.100"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="purple.600"
                                                >
                                                    {contributor.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </Box>
                                                <VStack align="start" gap={0}>
                                                    <Text fontWeight="medium" color="white">{contributor.name}</Text>
                                                    <Text fontSize="sm" color="whiteAlpha.700">
                                                        {contributor.email}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        
                                        {/* Criticality */}
                                        <Box flex="1">
                                            <Badge
                                                colorPalette={getCriticalityColor(contributor.criticality)}
                                                variant="solid"
                                                size="sm"
                                            >
                                                {contributor.criticality}
                                            </Badge>
                                        </Box>
                                        
                                        {/* Allocation % */}
                                        <Box flex="1">
                                            <Input
                                                type="number"
                                                value={contributor.allocationPercentage}
                                                onChange={(e) => handleAllocationChange(
                                                    contributor.id,
                                                    Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                                                )}
                                                min={0}
                                                max={100}
                                                w="80px"
                                                textAlign="center"
                                            />
                                        </Box>
                                        
                                        {/* Allocation Control */}
                                        <Box flex="2">
                                            <HStack gap={2}>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={100}
                                                    step={5}
                                                    value={contributor.allocationPercentage}
                                                    onChange={(e) => handleAllocationChange(contributor.id, parseInt(e.target.value))}
                                                    style={{
                                                        width: '150px',
                                                        accentColor: '#a5489f'
                                                    }}
                                                />
                                                <Text fontSize="sm" color="whiteAlpha.800" minW="30px">
                                                    {contributor.allocationPercentage}%
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </HStack>
                                ))}
                            </VStack>
                            
                            {totalAllocation !== 100 && (
                                <Box mt={4} p={4} bg={totalAllocation > 100 ? "red.50" : "orange.50"} borderRadius="md">
                                    <Text color={totalAllocation > 100 ? "red.600" : "orange.600"} fontWeight="medium">
                                        {totalAllocation > 100 
                                            ? `⚠️ Over-allocated by ${totalAllocation - 100}%. Please adjust team member allocations.`
                                            : `⚠️ Under-allocated by ${100 - totalAllocation}%. Consider adding more team members or increasing allocations.`
                                        }
                                    </Text>
                                </Box>
                            )}
                        </Card.Body>
                    </Card.Root>
                </VStack>
            </Box>
        </Box>
    );
}
