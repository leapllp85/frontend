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
    Input,
    Textarea,
    Badge,
    Grid,
    GridItem,
    Alert
} from '@chakra-ui/react';
import { ArrowLeft, Save, Plus, X, Users, AlertTriangle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { projectApi, teamApi } from '@/services';
import { Employee, EmployeeProfile, Project } from '@/types';
import { RequireProjectCreate } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';

interface CreateProjectFormData {
    name: string;
    description: string;
    criticality: 'High' | 'Medium' | 'Low' | '';
}

interface ProjectContributor {
    id: number;
    name: string;
    email: string;
    role: string;
    allocationPercentage: number;
    employeeCriticality: 'High' | 'Medium' | 'Low';
}

export default function CreateProject() {
    const router = useRouter();
    
    // Form State
    const [formData, setFormData] = useState<CreateProjectFormData>({
        name: '',
        description: '',
        criticality: ''
    });
    
    // Contributors State
    const [contributors, setContributors] = useState<ProjectContributor[]>([]);
    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
    const [showAddContributor, setShowAddContributor] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [newContributorAllocation, setNewContributorAllocation] = useState(0);
    const [newContributorCriticality, setNewContributorCriticality] = useState<'High' | 'Medium' | 'Low'>('Medium');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [employeesLoading, setEmployeesLoading] = useState(true);

    // Load available employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setEmployeesLoading(true);
                const teamMembersResponse = await teamApi.getTeamMembers();
                // @ts-ignore - API response has nested structure
                const teamMembers = Array.isArray(teamMembersResponse.team_members) ? teamMembersResponse.team_members : [];
                
                // Transform EmployeeProfile to Employee format
                const employees: Employee[] = teamMembers.map((member: any) => ({
                    id: member.id.toString(),
                    name: (member.first_name && member.last_name) ? `${member.first_name} ${member.last_name}` : member.username || 'Unknown User',
                    email: member.email || '',
                    role: member.role || 'Associate',
                    avatar: member.profile_pic || undefined,
                    department: 'General'
                }));
                setAvailableEmployees(employees);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
            } finally {
                setEmployeesLoading(false);
            }
        };
        
        fetchEmployees();
    }, []);

    // Calculate total allocation percentage
    const getTotalAllocation = () => {
        return contributors.reduce((total, contributor) => total + contributor.allocationPercentage, 0);
    };

    // Validation
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
        }

        if (!formData.criticality) {
            newErrors.criticality = 'Project criticality is required';
        }

        const totalAllocation = getTotalAllocation();
        if (contributors.length === 0) {
            newErrors.contributors = 'At least one contributor is required';
        } else if (totalAllocation !== 100) {
            newErrors.allocation = `Total allocation must be 100%. Current: ${totalAllocation}%`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form input changes
    const handleInputChange = (field: keyof CreateProjectFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Add contributor
    const addContributor = () => {
        if (!selectedEmployee) {
            setErrors(prev => ({
                ...prev,
                contributor: 'Please select an employee'
            }));
            return;
        }

        const newContributor: ProjectContributor = {
            id: parseInt(selectedEmployee.id),
            name: selectedEmployee.name,
            email: selectedEmployee.email,
            role: selectedEmployee.role,
            allocationPercentage: newContributorAllocation,
            employeeCriticality: newContributorCriticality
        };

        setContributors(prev => [...prev, newContributor]);
        setSelectedEmployee(null);
        setNewContributorAllocation(0);
        setNewContributorCriticality('Medium');
        setShowAddContributor(false);
        
        // Clear contributor error
        if (errors.contributor) {
            setErrors(prev => ({
                ...prev,
                contributor: ''
            }));
        }
    };

    // Remove contributor
    const removeContributor = (contributorId: number) => {
        setContributors(prev => prev.filter((c: ProjectContributor) => c.id !== contributorId));
        
        // Clear allocation error if removing contributor fixes it
        if (errors.allocation) {
            setErrors(prev => ({
                ...prev,
                allocation: ''
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            const projectData = {
                title: formData.name,
                description: formData.description,
                criticality: formData.criticality as 'High' | 'Medium' | 'Low',
                status: 'Active' as 'Active' | 'Inactive',
                start_date: new Date().toISOString().split('T')[0],
                go_live_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                source: 'Internal',
                assigned_to: contributors.map(c => ({
                    id: c.id,
                    username: c.email.split('@')[0], // Generate username from email
                    email: c.email,
                    first_name: c.name?.split(' ')[0] || c.name || 'Unknown',
                    last_name: c.name?.split(' ').slice(1).join(' ') || '',
                    role: c.role
                }))
            };

            await projectApi.createProject(projectData);
            router.push('/projects');
        } catch (error) {
            console.error('Failed to create project:', error);
            setErrors({ submit: 'Failed to create project. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'High': return 'red';
            case 'Medium': return 'yellow';
            case 'Low': return 'green';
            default: return 'gray';
        }
    };

    return (
        <RequireProjectCreate>
            <AppLayout>
                <Box py={8} px={4}>
                <VStack gap={6} align="stretch">
                    {/* Header */}
                    <HStack gap={4}>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Button>
                        <Heading size="lg">Create New Project</Heading>
                    </HStack>

                    {/* Error Alert */}
                    {errors.submit && (
                        <Box p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md">
                            <HStack gap={2}>
                                <AlertTriangle size={16} color="red" />
                                <Text color="red.600">{errors.submit}</Text>
                            </HStack>
                        </Box>
                    )}

                    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                        {/* Main Form */}
                        <VStack gap={6} align="stretch">
                            {/* Project Details Card */}
                            <Card.Root>
                                <Card.Header>
                                    <Heading size="md">Project Details</Heading>
                                </Card.Header>
                                <Card.Body>
                                    <VStack gap={4} align="stretch">
                                        <Box>
                                            <Text mb={2} fontWeight="medium">Project Name *</Text>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Enter project name"
                                                style={{
                                                    borderColor: errors.name ? '#E53E3E' : undefined,
                                                    borderWidth: errors.name ? '2px' : undefined
                                                }}
                                            />
                                            {errors.name && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.name}
                                                </Text>
                                            )}
                                        </Box>

                                        <Box>
                                            <Text mb={2} fontWeight="medium">Description *</Text>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Enter project description"
                                                rows={4}
                                                style={{
                                                    borderColor: errors.description ? '#E53E3E' : undefined,
                                                    borderWidth: errors.description ? '2px' : undefined
                                                }}
                                            />
                                            {errors.description && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.description}
                                                </Text>
                                            )}
                                        </Box>

                                        <Box>
                                            <Text mb={2} fontWeight="medium">Criticality *</Text>
                                            <select
                                                value={formData.criticality}
                                                onChange={(e) => handleInputChange('criticality', e.target.value as any)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: errors.criticality ? '2px solid #E53E3E' : '1px solid #E2E8F0',
                                                    borderRadius: '6px',
                                                    fontSize: '16px'
                                                }}
                                            >
                                                <option value="">Select criticality</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                            {errors.criticality && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.criticality}
                                                </Text>
                                            )}
                                        </Box>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>

                            {/* Contributors Card */}
                            <Card.Root>
                                <Card.Header>
                                    <HStack justify="space-between">
                                        <Heading size="md">Team Contributors</Heading>
                                        <Button
                                            size="sm"
                                            onClick={() => setShowAddContributor(true)}
                                            disabled={employeesLoading}
                                        >
                                            <Plus size={16} />
                                            Add Contributor
                                        </Button>
                                    </HStack>
                                </Card.Header>
                                <Card.Body>
                                    <VStack gap={4} align="stretch">
                                        {/* Total Allocation Display */}
                                        <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                                            <Text fontWeight="medium">Total Allocation:</Text>
                                            <Badge
                                                colorScheme={getTotalAllocation() === 100 ? 'green' : 'red'}
                                                fontSize="sm"
                                            >
                                                {getTotalAllocation()}%
                                            </Badge>
                                        </HStack>

                                        {/* Contributors List */}
                                        {contributors.length === 0 ? (
                                            <Text color="gray.500" textAlign="center" py={4}>
                                                No contributors added yet
                                            </Text>
                                        ) : (
                                            contributors.map((contributor) => (
                                                <HStack
                                                    key={contributor.id}
                                                    p={3}
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    borderRadius="md"
                                                    justify="space-between"
                                                >
                                                    <HStack gap={3}>
                                                        <User size={20} />
                                                        <VStack align="start" gap={0}>
                                                            <Text fontWeight="medium">{contributor.name}</Text>
                                                            <Text fontSize="sm" color="gray.600">
                                                                {contributor.role} • {contributor.allocationPercentage}%
                                                            </Text>
                                                        </VStack>
                                                        <Badge
                                                            colorScheme={getCriticalityColor(contributor.employeeCriticality)}
                                                            size="sm"
                                                        >
                                                            {contributor.employeeCriticality}
                                                        </Badge>
                                                    </HStack>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        onClick={() => removeContributor(contributor.id)}
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </HStack>
                                            ))
                                        )}

                                        {/* Add Contributor Form */}
                                        {showAddContributor && (
                                            <Box p={4} border="2px dashed" borderColor="gray.300" borderRadius="md">
                                                <VStack gap={3} align="stretch">
                                                    <Text fontWeight="medium">Add New Contributor</Text>
                                                    
                                                    <Box>
                                                        <Text mb={2} fontSize="sm">Select Employee</Text>
                                                        <select
                                                            value={selectedEmployee?.id || ''}
                                                            onChange={(e) => {
                                                                const employee = availableEmployees.find(emp => emp.id === e.target.value);
                                                                setSelectedEmployee(employee || null);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px 12px',
                                                                border: '1px solid #E2E8F0',
                                                                borderRadius: '6px'
                                                            }}
                                                        >
                                                            <option value="">Select an employee</option>
                                                            {availableEmployees
                                                                .filter(emp => !contributors.some(c => c.id.toString() === emp.id))
                                                                .map(employee => (
                                                                    <option key={employee.id} value={employee.id}>
                                                                        {employee.name} ({employee.role})
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </Box>

                                                    <HStack gap={3}>
                                                        <Box flex={1}>
                                                            <Text mb={2} fontSize="sm">Allocation %</Text>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={newContributorAllocation}
                                                                onChange={(e) => setNewContributorAllocation(parseInt(e.target.value) || 0)}
                                                                placeholder="0"
                                                            />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Text mb={2} fontSize="sm">Employee Criticality</Text>
                                                            <select
                                                                value={newContributorCriticality}
                                                                onChange={(e) => setNewContributorCriticality(e.target.value as any)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: '1px solid #E2E8F0',
                                                                    borderRadius: '6px'
                                                                }}
                                                            >
                                                                <option value="High">High</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="Low">Low</option>
                                                            </select>
                                                        </Box>
                                                    </HStack>

                                                    <HStack gap={2}>
                                                        <Button size="sm" onClick={addContributor}>
                                                            Add
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setShowAddContributor(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </HStack>
                                                </VStack>
                                            </Box>
                                        )}

                                        {/* Validation Errors */}
                                        {errors.contributors && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.contributors}
                                            </Text>
                                        )}
                                        {errors.allocation && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.allocation}
                                            </Text>
                                        )}
                                        {errors.contributor && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.contributor}
                                            </Text>
                                        )}
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        </VStack>

                        {/* Summary Sidebar */}
                        <VStack gap={6} align="stretch">
                            <Card.Root>
                                <Card.Header>
                                    <Heading size="md">Project Summary</Heading>
                                </Card.Header>
                                <Card.Body>
                                    <VStack gap={3} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Name:</Text>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {formData.name || 'Not set'}
                                            </Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Criticality:</Text>
                                            {formData.criticality ? (
                                                <Badge colorScheme={getCriticalityColor(formData.criticality)} size="sm">
                                                    {formData.criticality}
                                                </Badge>
                                            ) : (
                                                <Text fontSize="sm">Not set</Text>
                                            )}
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Contributors:</Text>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {contributors.length}
                                            </Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Total Allocation:</Text>
                                            <Badge
                                                colorScheme={getTotalAllocation() === 100 ? 'green' : 'red'}
                                                size="sm"
                                            >
                                                {getTotalAllocation()}%
                                            </Badge>
                                        </HStack>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>

                            {/* Action Buttons */}
                            <VStack gap={3}>
                                <Button
                                    w="full"
                                    onClick={handleSubmit}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    <Save size={16} />
                                    {loading ? 'Creating...' : 'Create Project'}
                                </Button>
                                <Button
                                    w="full"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </VStack>
                        </VStack>
                    </Grid>
                </VStack>
                </Box>
            </AppLayout>
        </RequireProjectCreate>
    );
}
