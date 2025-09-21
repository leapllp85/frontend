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
    Textarea,
    Field,
    Spinner,
} from '@chakra-ui/react';
import { ArrowLeft, Save, Users, AlertTriangle, Calendar, Edit3, UserPlus, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { projectApi, allocationApi, Project as ApiProject, ProjectAllocation } from '@/services';
import { userApi } from '@/services/userApi';
import { AppLayout } from '@/components/layouts/AppLayout';
import { UserSearchDropdown } from '@/components/common/UserSearchDropdown';

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

interface ProjectFormData {
    name: string;
    description: string;
    criticality: 'High' | 'Medium' | 'Low';
    status: 'Active' | 'Inactive';
    startDate: string;
    endDate: string;
}

interface TeamMember {
    allocation_id: number;
    employee_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email?: string;
    allocation_percentage: number;
    start_date: string;
    end_date: string | null;
    profile_pic?: string;
    mental_health: string;
    suggested_risk: string;
}

interface ProjectTeamResponse {
    project: {
        id: number;
        title: string;
        status: 'Active' | 'Inactive';
        criticality: 'High' | 'Medium' | 'Low';
        description?: string;
        start_date?: string;
        end_date?: string;
        go_live_date?: string;
    };
    team_members: TeamMember[];
    total_allocation: number;
}

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [allocations, setAllocations] = useState<ProjectAllocation[]>([]);
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        criticality: 'Medium',
        status: 'Active',
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [addingUser, setAddingUser] = useState(false);

    // Fetch project data from API
    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);
                
                // Check if user is authenticated
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setError('Please log in to access this page.');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                    return;
                }

                console.log('Fetching project data for ID:', projectId);
                
                // Fetch project details (which includes team data)
                let projectResponse: ProjectTeamResponse;
                try {
                    projectResponse = await projectApi.getProject(Number(projectId)) as unknown as ProjectTeamResponse;
                    console.log('Project response fetched:', projectResponse);
                } catch (error) {
                    console.error('Failed to fetch project:', error);
                    throw new Error(`Failed to fetch project: ${error}`);
                }

                // Extract project and team data from the response
                const projectData = projectResponse.project;
                const teamMembers = projectResponse.team_members || [];
                
                console.log('Extracted project data:', projectData);
                console.log('Extracted team members:', teamMembers);
                
                // Transform API data to match UI expectations
                const transformedProject: Project = {
                    id: projectData.id.toString(),
                    name: projectData.title,
                    criticality: projectData.criticality,
                    isActive: projectData.status === 'Active',
                    description: projectData.description || '',
                    startDate: projectData.start_date || '',
                    endDate: projectData.go_live_date || projectData.end_date || '',
                    contributors: teamMembers.map((member: TeamMember) => {
                        return {
                            id: member.employee_id.toString(),
                            name: (member.first_name && member.last_name) ? `${member.first_name} ${member.last_name}` : member.username || 'Unknown User',
                            email: member.email || '',
                            criticality: member.suggested_risk as 'High' | 'Medium' | 'Low' || 'Medium',
                            allocationPercentage: member.allocation_percentage || 0
                        };
                    })
                };
                
                // Set form data with proper date formatting
                setFormData({
                    name: projectData.title,
                    description: projectData.description || '',
                    criticality: projectData.criticality,
                    status: projectData.status,
                    startDate: projectData.start_date ? projectData.start_date.split('T')[0] : '',
                    endDate: projectData.go_live_date ? projectData.go_live_date.split('T')[0] : (projectData.end_date ? projectData.end_date.split('T')[0] : '')
                });
                
                setProject(transformedProject);
                // Convert team members to allocation format for compatibility
                const mockAllocations = teamMembers.map((member: TeamMember) => ({
                    id: member.allocation_id,
                    employee: { id: member.employee_id },
                    project: { id: Number(projectId) },
                    allocation_percentage: member.allocation_percentage,
                    start_date: member.start_date,
                    end_date: member.end_date,
                    is_active: true
                }));
                setAllocations(mockAllocations as any);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch project data:', err);
                
                // Provide more specific error messages
                let errorMessage = 'Failed to load project data. ';
                if (err instanceof Error) {
                    if (err.message.includes('401')) {
                        errorMessage += 'Please log in again.';
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    } else if (err.message.includes('404')) {
                        errorMessage += 'Project not found.';
                    } else if (err.message.includes('Network')) {
                        errorMessage += 'Please check your internet connection and ensure the backend server is running.';
                    } else {
                        errorMessage += err.message;
                    }
                } else {
                    errorMessage += 'Please try again.';
                }
                
                setError(errorMessage);
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

    const handleFormChange = (field: keyof ProjectFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setProject(prev => prev ? ({ 
            ...prev, 
            name: field === 'name' ? value : prev.name,
            description: field === 'description' ? value : prev.description,
            criticality: field === 'criticality' ? value as 'High' | 'Medium' | 'Low' : prev.criticality,
            isActive: field === 'status' ? value === 'Active' : prev.isActive,
            startDate: field === 'startDate' ? value : prev.startDate,
            endDate: field === 'endDate' ? value : prev.endDate
        }) : null);
    };

    const handleAddUser = async (user: any) => {
        setAddingUser(true);
        try {
            // Get current project dates for the new user
            const startDate = project?.startDate || new Date().toISOString().split('T')[0];
            const endDate = project?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            // Add user to project via API with proper parameters
            await userApi.addUserToProject(Number(projectId), user.id, 0, startDate, endDate);
            
            // Add to local state
            const newContributor = {
                id: user.id.toString(),
                name: (user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}` : user.username,
                email: user.email,
                criticality: 'Medium' as 'High' | 'Medium' | 'Low',
                allocationPercentage: 0
            };
            
            setProject(prev => prev ? ({
                ...prev,
                contributors: [...prev.contributors, newContributor]
            }) : null);
            
            setSuccess(`${newContributor.name} added to project successfully!`);
        } catch (error) {
            console.error('Failed to add user to project:', error);
            setError('Failed to add user to project. Please try again.');
        } finally {
            setAddingUser(false);
        }
    };

    const handleRemoveUser = async (contributorId: string) => {
        try {
            // Remove user from project via API
            await userApi.removeUserFromProject(Number(projectId), Number(contributorId));
            
            // Remove from local state
            setProject(prev => prev ? ({
                ...prev,
                contributors: prev.contributors.filter(c => c.id !== contributorId)
            }) : null);
            
            setSuccess('User removed from project successfully!');
        } catch (error) {
            console.error('Failed to remove user from project:', error);
            setError('Failed to remove user from project. Please try again.');
        }
    };

    const handleAllocationChange = async (contributorId: string, percentage: number) => {
        // Update local state immediately
        setProject(prev => prev ? ({
            ...prev,
            contributors: prev.contributors.map(contributor =>
                contributor.id === contributorId
                    ? { ...contributor, allocationPercentage: percentage }
                    : contributor
            )
        }) : null);

        // Update allocation in backend
        try {
            const existingAllocation = allocations.find(alloc => alloc.employee.id === Number(contributorId));
            if (existingAllocation) {
                await allocationApi.updateAllocation(existingAllocation.id, {
                    allocation_percentage: percentage
                });
                console.log(`Updated allocation for contributor ${contributorId} to ${percentage}%`);
            } else {
                // Create new allocation if it doesn't exist
                const newAllocation = await allocationApi.createAllocation({
                    employee: { id: Number(contributorId) } as any,
                    project: { id: Number(projectId) } as any,
                    allocation_percentage: percentage,
                    start_date: new Date().toISOString().split('T')[0],
                    is_active: true
                });
                console.log(`Created new allocation for contributor ${contributorId}:`, newAllocation);
            }
        } catch (error) {
            console.error('Failed to update allocation:', error);
            setError('Failed to update team allocation. Please try again.');
            
            // Revert local state on error
            setProject(prev => prev ? ({
                ...prev,
                contributors: prev.contributors.map(contributor =>
                    contributor.id === contributorId
                        ? { ...contributor, allocationPercentage: contributor.allocationPercentage }
                        : contributor
                )
            }) : null);
        }
    };

    const handleSave = async () => {
        if (!project) return;
        
        setSaving(true);
        setError(null);
        setSuccess(null);
        
        try {
            // Note: The current API endpoint returns project team data, not individual project update
            // For now, we'll show success but the actual project update might need a different endpoint
            console.log('Saving project data:', {
                title: formData.name,
                criticality: formData.criticality,
                status: formData.status,
                description: formData.description,
                start_date: formData.startDate,
                go_live_date: formData.endDate
            });
            
            // TODO: Use correct project update endpoint when available
            // const updatedProject = await projectApi.updateProject(Number(project.id), {
            //     title: formData.name,
            //     criticality: formData.criticality,
            //     status: formData.status,
            //     description: formData.description,
            //     start_date: formData.startDate,
            //     go_live_date: formData.endDate
            // });
            
            setSuccess('Project changes saved locally! Note: Backend project update endpoint may need to be configured.');
            
            // Update local state with form data
            setProject(prev => prev ? ({
                ...prev,
                name: formData.name,
                description: formData.description,
                criticality: formData.criticality,
                isActive: formData.status === 'Active',
                startDate: formData.startDate,
                endDate: formData.endDate
            }) : null);
            
        } catch (error) {
            console.error('Error saving project:', error);
            setError('Failed to save project changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const totalAllocation = project?.contributors?.reduce((sum, contributor) => sum + contributor.allocationPercentage, 0) || 0;

    if (loading) {
        return (
            <AppLayout>
                <Box py={8} px={4} bg="gradient-to-br from-gray-50 to-blue-50">
                    <Box className="max-w-6xl mx-auto px-6 py-12">
                        <VStack gap={4} align="center" justify="center" minH="400px">
                            <Spinner size="xl" color="#a5489f" />
                            <Text color="gray.600">Loading project data...</Text>
                        </VStack>
                    </Box>
                </Box>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Box py={8} px={4} bg="gradient-to-br from-gray-50 to-blue-50">
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
                                        Manage project details and team allocations
                                    </Text>
                                </Box>
                            </HStack>
                            
                            <Button
                                bg="#a5489f"
                                color="white"
                                _hover={{ bg: "#8a3d85" }}
                                size="lg"
                                loading={saving}
                                onClick={handleSave}
                                disabled={!project}
                            >
                                <HStack gap={2}>
                                    {saving ? <Spinner size="sm" /> : <Save size={20} />}
                                    <Text>{saving ? 'Saving...' : 'Save Changes'}</Text>
                                </HStack>
                            </Button>
                        </HStack>

                        {/* Success/Error Messages */}
                        {error && (
                            <Box bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md" p={4}>
                                <Text color="red.600" fontWeight="medium">{error}</Text>
                                <Text color="red.500" fontSize="sm" mt={2}>
                                    Debug info: API Base URL is {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
                                </Text>
                            </Box>
                        )}
                        
                        {success && (
                            <Box bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md" p={4}>
                                <Text color="green.600" fontWeight="medium">{success}</Text>
                            </Box>
                        )}

                        {/* Project Details Form */}
                        <Card.Root
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            shadow="sm"
                            _hover={{ shadow: "md" }}
                            transition="all 0.3s ease"
                        >
                            <Card.Header>
                                <HStack gap={2}>
                                    <Edit3 size={24} color="#a5489f" />
                                    <Heading size="md" color="gray.800">Project Details</Heading>
                                </HStack>
                            </Card.Header>
                            <Card.Body>
                                <VStack gap={6} align="stretch">
                                    <HStack gap={6} align="start">
                                        <Field.Root flex="2">
                                            <Field.Label color="gray.700" fontWeight="semibold">Project Name</Field.Label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('name', e.target.value)}
                                                placeholder="Enter project name"
                                                bg="white"
                                                border="1px solid"
                                                borderColor="gray.300"
                                                color="gray.800"
                                                _placeholder={{ color: "gray.400" }}
                                                _focus={{ borderColor: "#a5489f", bg: "white", boxShadow: "0 0 0 1px #a5489f" }}
                                            />
                                        </Field.Root>
                                        
                                        <Field.Root flex="1">
                                            <Field.Label color="gray.700" fontWeight="semibold">Priority</Field.Label>
                                            <select
                                                value={formData.criticality}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('criticality', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #d2d6dc',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    color: '#2d3748',
                                                    outline: 'none'
                                                }}
                                            >
                                                <option value="High">High Priority</option>
                                                <option value="Medium">Medium Priority</option>
                                                <option value="Low">Low Priority</option>
                                            </select>
                                        </Field.Root>
                                        
                                        <Field.Root flex="1">
                                            <Field.Label color="gray.700" fontWeight="semibold">Status</Field.Label>
                                            <select
                                                value={formData.status}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('status', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #d2d6dc',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    color: '#2d3748',
                                                    outline: 'none'
                                                }}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </Field.Root>
                                    </HStack>
                                    
                                    <Field.Root>
                                        <Field.Label color="gray.700" fontWeight="semibold">Description</Field.Label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFormChange('description', e.target.value)}
                                            placeholder="Enter project description"
                                            rows={4}
                                            bg="white"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            color="gray.800"
                                            _placeholder={{ color: "gray.400" }}
                                            _focus={{ borderColor: "#a5489f", bg: "white", boxShadow: "0 0 0 1px #a5489f" }}
                                        />
                                    </Field.Root>
                                    
                                    <HStack gap={6} align="start">
                                        <Field.Root flex="1">
                                            <Field.Label color="gray.700" fontWeight="semibold">Start Date</Field.Label>
                                            <Input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('startDate', e.target.value)}
                                                bg="white"
                                                border="1px solid"
                                                borderColor="gray.300"
                                                color="gray.800"
                                                _focus={{ borderColor: "#a5489f", bg: "white", boxShadow: "0 0 0 1px #a5489f" }}
                                            />
                                        </Field.Root>
                                        
                                        <Field.Root flex="1">
                                            <Field.Label color="gray.700" fontWeight="semibold">Go Live Date</Field.Label>
                                            <Input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('endDate', e.target.value)}
                                                bg="white"
                                                border="1px solid"
                                                borderColor="gray.300"
                                                color="gray.800"
                                                _focus={{ borderColor: "#a5489f", bg: "white", boxShadow: "0 0 0 1px #a5489f" }}
                                            />
                                        </Field.Root>
                                    </HStack>
                                </VStack>
                            </Card.Body>
                        </Card.Root>


                        {/* Add User Section */}
                        <Card.Root
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            shadow="sm"
                            _hover={{ shadow: "md" }}
                            transition="all 0.3s ease"
                        >
                            <Card.Header>
                                <HStack gap={2}>
                                    <UserPlus size={24} color="#a5489f" />
                                    <Heading size="md" color="gray.800">Add Team Member</Heading>
                                </HStack>
                            </Card.Header>
                            <Card.Body>
                                <VStack gap={4} align="stretch">
                                    <Text color="gray.600" fontSize="sm">
                                        Search and add users from your organization to this project. Current team members are shown by default.
                                    </Text>
                                    <UserSearchDropdown
                                        currentTeamMembers={project?.contributors.map(c => ({
                                            id: Number(c.id),
                                            username: c.name,
                                            first_name: c.name.split(' ')[0] || '',
                                            last_name: c.name.split(' ').slice(1).join(' ') || '',
                                            email: c.email
                                        })) || []}
                                        onAddUser={handleAddUser}
                                        placeholder="Search users to add to project..."
                                    />
                                    {addingUser && (
                                        <HStack gap={2}>
                                            <Spinner size="sm" color="#a5489f" />
                                            <Text fontSize="sm" color="gray.600">Adding user to project...</Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Team Allocation Card */}
                        <Card.Root
                            bg="#a5479f"
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                            borderRadius="xl"
                            shadow="sm"
                            _hover={{ shadow: "md" }}
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
                                        <Box flex="0.5" color="white">Actions</Box>
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
                                                    bg="white"
                                                    color="gray.800"
                                                    border="1px solid"
                                                    borderColor="whiteAlpha.400"
                                                    _focus={{ borderColor: "white", bg: "whiteAlpha.200" }}
                                                />
                                            </Box>
                                            
                                            {/* Allocation Control */}
                                            <Box flex="2">
                                                <HStack gap={2}>
                                                    <Box position="relative" w="150px">
                                                        <input
                                                            type="range"
                                                            min={0}
                                                            max={100}
                                                            step={5}
                                                            value={contributor.allocationPercentage}
                                                            onChange={(e) => handleAllocationChange(contributor.id, parseInt(e.target.value))}
                                                            style={{
                                                                width: '100%',
                                                                height: '6px',
                                                                borderRadius: '3px',
                                                                background: 'rgba(255, 255, 255, 0.3)',
                                                                outline: 'none',
                                                                appearance: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                        <style jsx>{`
                                                            input[type="range"]::-webkit-slider-thumb {
                                                                appearance: none;
                                                                width: 16px;
                                                                height: 16px;
                                                                border-radius: 50%;
                                                                background: white;
                                                                cursor: pointer;
                                                                border: 2px solid #a5489f;
                                                            }
                                                            input[type="range"]::-moz-range-thumb {
                                                                width: 16px;
                                                                height: 16px;
                                                                border-radius: 50%;
                                                                background: white;
                                                                cursor: pointer;
                                                                border: 2px solid #a5489f;
                                                            }
                                                        `}</style>
                                                    </Box>
                                                    <Text fontSize="sm" color="white" minW="35px" fontWeight="medium">
                                                        {contributor.allocationPercentage}%
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            
                                            {/* Actions */}
                                            <Box flex="0.5">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    onClick={() => handleRemoveUser(contributor.id)}
                                                    _hover={{ bg: "whiteAlpha.200" }}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
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
        </AppLayout>
    );
}
