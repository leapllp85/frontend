'use client';

import React, { useState } from 'react';
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
    criticality: string;
    allocationPercentage: number;
}

interface Project {
    id: string;
    name: string;
    criticality: 'High' | 'Medium' | 'Low';
    isActive: boolean;
    contributors: Contributor[];
}

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    // State
    const [project, setProject] = useState<Project>({
        id: projectId,
        name: 'Sample Project',
        criticality: 'High',
        isActive: true,
        contributors: [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                criticality: 'High',
                allocationPercentage: 80
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                criticality: 'Medium',
                allocationPercentage: 60
            },
            {
                id: '3',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                criticality: 'Low',
                allocationPercentage: 40
            }
        ]
    });

    const [loading, setLoading] = useState(false);

    // Helper functions
    const getCriticalityColor = getRiskColor;

    const handleStatusToggle = () => {
        setProject(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleAllocationChange = (contributorId: string, percentage: number) => {
        setProject(prev => ({
            ...prev,
            contributors: prev.contributors.map(contributor =>
                contributor.id === contributorId
                    ? { ...contributor, allocationPercentage: percentage }
                    : contributor
            )
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            console.log('Saving project:', project);
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/projects');
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalAllocation = project.contributors.reduce((sum, contributor) => sum + contributor.allocationPercentage, 0);

    return (
        <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <Box className="max-w-6xl mx-auto">
                <VStack gap={8} align="stretch">
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
                        bg="linear-gradient(135deg, #a5489f 0%, #8a3d85 100%)"
                        border="1px solid" 
                        borderColor="whiteAlpha.300"
                        borderRadius="2xl"
                        shadow="2xl"
                    >
                        <Card.Header p={6}>
                            <HStack gap={3}>
                                <Box p={2} bg="whiteAlpha.200" borderRadius="lg">
                                    <ArrowLeft size={20} color="white" />
                                </Box>
                                <Heading size="lg" color="white" fontWeight="bold">Edit Project</Heading>
                            </HStack>
                        </Card.Header>
                        <Card.Header>
                            <HStack justify="space-between" align="center">
                                <VStack align="start" gap={1}>
                                    <Heading size="lg" color="white">{project.name}</Heading>
                                    <HStack gap={2}>
                                        <Badge
                                            colorPalette={getCriticalityColor(project.criticality)}
                                            variant="solid"
                                        >
                                            <HStack gap={1}>
                                                <AlertTriangle size={12} />
                                                <Text>{project.criticality} Priority</Text>
                                            </HStack>
                                        </Badge>
                                        <Badge
                                            colorPalette={project.isActive ? 'green' : 'red'}
                                            variant="solid"
                                        >
                                            {project.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </HStack>
                                </VStack>
                                
                                <Box>
                                    <Text mb={2} fontWeight="medium" color="white">Project Status:</Text>
                                    <Button
                                        onClick={handleStatusToggle}
                                        colorPalette={project.isActive ? 'green' : 'red'}
                                        variant={project.isActive ? 'solid' : 'outline'}
                                        size="sm"
                                    >
                                        {project.isActive ? 'Active' : 'Inactive'}
                                    </Button>
                                </Box>
                            </HStack>
                        </Card.Header>
                    </Card.Root>

                    {/* Team Allocation Card */}
                    <Card.Root bg="#a5489f" border="1px solid" borderColor="white">
                        <Card.Header>
                            <HStack justify="space-between" align="center">
                                <HStack gap={2}>
                                    <Users size={24} />
                                    <Heading size="md" color="white">Team Allocation</Heading>
                                </HStack>
                                <Badge
                                    colorPalette={totalAllocation > 100 ? 'red' : totalAllocation === 100 ? 'green' : 'orange'}
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
                                {project.contributors.map((contributor) => (
                                    <Card.Root key={contributor.id} bg="whiteAlpha.200" border="1px solid" borderColor="whiteAlpha.300">
                                        <Card.Body>
                                            <HStack justify="space-between" align="center">
                                                <HStack gap={3}>
                                                    <Box
                                                        w={10}
                                                        h={10}
                                                        borderRadius="full"
                                                        bg="#a5489f"
                                                        color="white"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        fontWeight="bold"
                                                    >
                                                        <User size={16} />
                                                    </Box>
                                                    <VStack align="start" gap={0}>
                                                        <Text fontWeight="medium" color="white">{contributor.name}</Text>
                                                        <Text fontSize="sm" color="whiteAlpha.700">
                                                            {contributor.email}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                                
                                                <HStack gap={4}>
                                                    <VStack align="center" gap={1}>
                                                        <Text fontSize="xs" color="whiteAlpha.700">Criticality</Text>
                                                        <Badge
                                                            colorPalette={getCriticalityColor(contributor.criticality)}
                                                            variant="solid"
                                                            size="sm"
                                                        >
                                                            {contributor.criticality}
                                                        </Badge>
                                                    </VStack>
                                                    
                                                    <VStack align="center" gap={1}>
                                                        <Text fontSize="xs" color="whiteAlpha.700">Allocation %</Text>
                                                        <HStack gap={2}>
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
                                                                size="sm"
                                                            />
                                                            <Text fontSize="sm" color="whiteAlpha.700">%</Text>
                                                        </HStack>
                                                    </VStack>
                                                </HStack>
                                            </HStack>
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                            </VStack>
                            
                            {totalAllocation !== 100 && (
                                <Box mt={4} p={4} bg={totalAllocation > 100 ? "red.50" : "orange.50"} borderRadius="md">
                                    <Text color="white" fontWeight="medium">
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
