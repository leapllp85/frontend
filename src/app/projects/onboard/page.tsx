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
    Alert,
    Field,
    Spinner,
    Avatar,
    Flex
} from '@chakra-ui/react';
import { ArrowLeft, Save, Plus, X, Users, AlertTriangle, User, Briefcase, Target, UserPlus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { projectApi, teamApi } from '@/services';
import { Employee, EmployeeProfile, Project } from '@/types';
import { RequireProjectCreate } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';
import { UserSearchDropdown } from '@/components/common/UserSearchDropdown';

interface CreateProjectFormData {
    name: string;
    description: string;
    criticality: 'High' | 'Medium' | 'Low' | '';
    startDate: string;
    goLiveDate: string;
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
        criticality: '',
        startDate: '',
        goLiveDate: ''
    });

    // Contributors State
    const [contributors, setContributors] = useState<ProjectContributor[]>([]);
    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

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

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.goLiveDate) {
            newErrors.goLiveDate = 'Go live date is required';
        }

        // Validate that go live date is after start date
        if (formData.startDate && formData.goLiveDate && formData.goLiveDate <= formData.startDate) {
            newErrors.goLiveDate = 'Go live date must be after start date';
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

    // Add contributor via UserSearchDropdown
    const handleAddUser = (user: any) => {
        const newContributor: ProjectContributor = {
            id: parseInt(user.id),
            name: (user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}` : user.username,
            email: user.email,
            role: user.role || 'Team Member',
            allocationPercentage: 0,
            employeeCriticality: 'Medium'
        };

        setContributors(prev => [...prev, newContributor]);

        // Clear contributor error
        if (errors.contributor) {
            setErrors(prev => ({
                ...prev,
                contributor: ''
            }));
        }
    };

    // Handle allocation change with range slider
    const handleAllocationChange = (contributorId: number, percentage: number) => {
        setContributors(prev => prev.map(contributor =>
            contributor.id === contributorId
                ? { ...contributor, allocationPercentage: percentage }
                : contributor
        ));
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

            // Create project data matching backend API structure
            const projectData = {
                title: formData.name,
                description: formData.description,
                criticality: formData.criticality as 'High' | 'Medium' | 'Low',
                status: 'Active' as 'Active' | 'Inactive',
                start_date: formData.startDate,
                go_live_date: formData.goLiveDate,
                source: 'https://internal.project'
            };

            console.log('Creating project with data:', projectData);
            const response = await projectApi.createProject(projectData);
            console.log('Project created successfully:', response);

            // TODO: After project creation, assign team members using separate API calls
            // This would require additional API endpoints for project team management
            if (contributors.length > 0) {
                console.log('Contributors to be assigned:', contributors);
                // Note: Team assignment would happen here with separate API calls
            }

            setErrors({ submit: '' });
            router.push('/projects');
        } catch (error) {
            console.error('Failed to create project:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create project. Please try again.';
            setErrors({ submit: errorMessage });
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
                {/* Back Button */}
                <Box p={4}>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        color="gray.600"
                        _hover={{ bg: "gray.100" }}
                    >
                        <ArrowLeft size={20} />
                        Back to Projects
                    </Button>
                </Box>

                <Box px={{ base: 4, md: 6, lg: 8 }} pb={8}>
                    <VStack gap={8} align="stretch">

                        {/* Error Alert */}
                        {errors.submit && (
                            <Box p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="xl">
                                <HStack gap={2}>
                                    <AlertTriangle size={16} color="red" />
                                    <VStack align="start" gap={1}>
                                        <Text color="red.600" fontWeight="semibold">Error creating project</Text>
                                        <Text color="red.500" fontSize="sm">{errors.submit}</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )}

                        {/* Main Form */}
                        <VStack gap={6} align="stretch">
                            {/* Project Details Card */}
                            <Card.Root
                                bg="white"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="xl"
                                shadow="lg"
                                _hover={{ shadow: "xl" }}
                                transition="all 0.3s ease"
                            >
                                <Card.Header bg="gray.50" borderTopRadius="xl">
                                    <HStack gap={3}>
                                        <Target size={24} color="#a5489f" />
                                        <Heading size="md" color="gray.800">Project Details</Heading>
                                    </HStack>
                                </Card.Header>
                                <Card.Body p={6}>
                                    <VStack gap={6} align="stretch">
                                        <Field.Root invalid={!!errors.name}>
                                            <Field.Label color="gray.700" fontWeight="semibold" fontSize="sm">
                                                Project Name *
                                            </Field.Label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Enter project name"
                                                bg="white"
                                                border="1px solid"
                                                borderColor={errors.name ? "red.300" : "gray.300"}
                                                color="gray.800"
                                                _placeholder={{ color: "gray.400" }}
                                                _focus={{
                                                    borderColor: errors.name ? "red.400" : "#a5489f",
                                                    bg: "white",
                                                    boxShadow: errors.name ? "0 0 0 1px #fc8181" : "0 0 0 1px #a5489f"
                                                }}
                                                size="lg"
                                            />
                                            {errors.name && (
                                                <Field.ErrorText>{errors.name}</Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.description}>
                                            <Field.Label color="gray.700" fontWeight="semibold" fontSize="sm">
                                                Description *
                                            </Field.Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Describe the project goals, scope, and key deliverables"
                                                rows={4}
                                                bg="white"
                                                border="1px solid"
                                                borderColor={errors.description ? "red.300" : "gray.300"}
                                                color="gray.800"
                                                _placeholder={{ color: "gray.400" }}
                                                _focus={{
                                                    borderColor: errors.description ? "red.400" : "#a5489f",
                                                    bg: "white",
                                                    boxShadow: errors.description ? "0 0 0 1px #fc8181" : "0 0 0 1px #a5489f"
                                                }}
                                                resize="vertical"
                                            />
                                            {errors.description && (
                                                <Field.ErrorText>{errors.description}</Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.criticality}>
                                            <Field.Label color="gray.700" fontWeight="semibold" fontSize="sm">
                                                Priority Level *
                                            </Field.Label>
                                            <select
                                                value={formData.criticality}
                                                onChange={(e) => handleInputChange('criticality', e.target.value as any)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: errors.criticality ? '1px solid #fc8181' : '1px solid #d2d6dc',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    backgroundColor: 'white',
                                                    color: '#2d3748',
                                                    outline: 'none'
                                                }}
                                            >
                                                <option value="">Select priority level</option>
                                                <option value="High">🔴 High Priority</option>
                                                <option value="Medium">🟡 Medium Priority</option>
                                                <option value="Low">🟢 Low Priority</option>
                                            </select>
                                            {errors.criticality && (
                                                <Field.ErrorText>{errors.criticality}</Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        <HStack gap={6} align="start">
                                            <Field.Root flex="1" invalid={!!errors.startDate} w="full">
                                                <Field.Label color="gray.700" fontWeight="semibold" fontSize="sm">
                                                    Start Date *
                                                </Field.Label>
                                                <Box position="relative" w="full">
                                                    <Input
                                                        type="date"
                                                        value={formData.startDate}
                                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                        bg="white"
                                                        border="1px solid"
                                                        borderColor={errors.startDate ? "red.300" : "gray.300"}
                                                        color="gray.800"
                                                        _focus={{
                                                            borderColor: errors.startDate ? "red.400" : "#a5489f",
                                                            bg: "white",
                                                            boxShadow: errors.startDate ? "0 0 0 1px #fc8181" : "0 0 0 1px #a5489f"
                                                        }}
                                                        size="lg"
                                                        placeholder="Select start date"
                                                        css={{
                                                            '&::-webkit-calendar-picker-indicator': {
                                                                background: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23000000\'%3e%3cpath fill-rule=\'evenodd\' d=\'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z\' clip-rule=\'evenodd\'/%3e%3c/svg%3e")',
                                                                backgroundSize: 'contain',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundPosition: 'center',
                                                                cursor: 'pointer',
                                                                position: 'absolute',
                                                                right: '8px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                width: '20px',
                                                                height: '20px',
                                                                opacity: 1
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                {errors.startDate && (
                                                    <Field.ErrorText>{errors.startDate}</Field.ErrorText>
                                                )}
                                            </Field.Root>

                                            <Field.Root flex="1" invalid={!!errors.goLiveDate} w="full">
                                                <Field.Label color="gray.700" fontWeight="semibold" fontSize="sm">
                                                    Go Live Date *
                                                </Field.Label>
                                                <Box position="relative" w="full">
                                                    <Input
                                                        type="date"
                                                        value={formData.goLiveDate}
                                                        onChange={(e) => handleInputChange('goLiveDate', e.target.value)}
                                                        bg="white"
                                                        border="1px solid"
                                                        borderColor={errors.goLiveDate ? "red.300" : "gray.300"}
                                                        color="gray.800"
                                                        _focus={{
                                                            borderColor: errors.goLiveDate ? "red.400" : "#a5489f",
                                                            bg: "white",
                                                            boxShadow: errors.goLiveDate ? "0 0 0 1px #fc8181" : "0 0 0 1px #a5489f"
                                                        }}
                                                        size="lg"
                                                        placeholder="Select go live date"
                                                        min={formData.startDate || undefined}
                                                        css={{
                                                            '&::-webkit-calendar-picker-indicator': {
                                                                background: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23000000\'%3e%3cpath fill-rule=\'evenodd\' d=\'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z\' clip-rule=\'evenodd\'/%3e%3c/svg%3e")',
                                                                backgroundSize: 'contain',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundPosition: 'center',
                                                                cursor: 'pointer',
                                                                position: 'absolute',
                                                                right: '8px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                width: '20px',
                                                                height: '20px',
                                                                opacity: 1
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                {errors.goLiveDate && (
                                                    <Field.ErrorText>{errors.goLiveDate}</Field.ErrorText>
                                                )}
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
                                shadow="lg"
                                _hover={{ shadow: "xl" }}
                                transition="all 0.3s ease"
                            >
                                <Card.Header bg="gray.50" borderTopRadius="xl">
                                    <HStack gap={3}>
                                        <UserPlus size={24} color="#a5489f" />
                                        <Heading size="md" color="gray.800">Add Team Member</Heading>
                                    </HStack>
                                </Card.Header>
                                <Card.Body p={6}>
                                    <VStack gap={4} align="stretch">
                                        <Text color="gray.600" fontSize="sm">
                                            Search and add users from your organization to this project.
                                        </Text>
                                        <UserSearchDropdown
                                            currentTeamMembers={contributors.map(c => ({
                                                id: c.id,
                                                username: c.name,
                                                first_name: c.name.split(' ')[0] || '',
                                                last_name: c.name.split(' ').slice(1).join(' ') || '',
                                                email: c.email
                                            }))}
                                            onAddUser={handleAddUser}
                                            placeholder="Search users to add to project..."
                                        />
                                    </VStack>
                                </Card.Body>
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
                                        <HStack gap={3}>
                                            <Users size={24} color="white" />
                                            <Heading size="md" color="white">Team Allocation</Heading>
                                        </HStack>
                                        <Badge
                                            colorPalette={getTotalAllocation() > 100 ? 'red' : getTotalAllocation() === 100 ? 'green' : 'orange'}
                                            variant="solid"
                                            fontSize="md"
                                            px={3}
                                            py={1}
                                        >
                                            Total: {getTotalAllocation()}%
                                        </Badge>
                                    </HStack>
                                </Card.Header>
                                <Card.Body p={6}>
                                    <VStack gap={4} align="stretch">
                                        {contributors.length === 0 ? (
                                            <Text color="whiteAlpha.700" textAlign="center" py={8}>
                                                No team members added yet. Use the search above to add team members.
                                            </Text>
                                        ) : (
                                            <>
                                                {/* Table Header */}
                                                <HStack gap={4} p={3} bg="whiteAlpha.200" borderRadius="md" fontWeight="semibold">
                                                    <Box flex="2" color="white">Team Member</Box>
                                                    <Box flex="1" color="white">Criticality</Box>
                                                    <Box flex="1" color="white">Allocation %</Box>
                                                    <Box flex="2" color="white">Allocation Control</Box>
                                                    <Box flex="0.5" color="white">Actions</Box>
                                                </HStack>

                                                {/* Table Rows */}
                                                {contributors.map((contributor) => (
                                                    <HStack key={contributor.id} gap={4} p={3} border="1px solid" borderColor="whiteAlpha.300" borderRadius="md" bg="whiteAlpha.100" w="full">
                                                        {/* Team Member */}
                                                        <Box flex="2" w="30%">
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
                                                                <VStack align="start" gap={0} w="full">
                                                                    <Text fontWeight="medium" color="white">{contributor.name}</Text>
                                                                    <Text fontSize="sm" color="whiteAlpha.700">
                                                                        {contributor.email.split('@')[0]}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </Box>

                                                        {/* Criticality */}
                                                        <Box flex="1" w="20%">
                                                            <Badge
                                                                colorPalette={getCriticalityColor(contributor.employeeCriticality)}
                                                                variant="solid"
                                                                size="sm"
                                                            >
                                                                {contributor.employeeCriticality}
                                                            </Badge>
                                                        </Box>

                                                        {/* Allocation % */}
                                                        <Box flex="1" w="20%">
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
                                                        <Box flex="2" w="20%">
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
                                                                onClick={() => removeContributor(contributor.id)}
                                                                _hover={{ bg: "whiteAlpha.200" }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </Box>
                                                    </HStack>
                                                ))}
                                            </>
                                        )}

                                        {getTotalAllocation() !== 100 && contributors.length > 0 && (
                                            <Box mt={4} p={4} bg={getTotalAllocation() > 100 ? "red.50" : "orange.50"} borderRadius="md">
                                                <Text color={getTotalAllocation() > 100 ? "red.600" : "orange.600"} fontWeight="medium">
                                                    {getTotalAllocation() > 100
                                                        ? `⚠️ Over-allocated by ${getTotalAllocation() - 100}%. Please adjust team member allocations.`
                                                        : `⚠️ Under-allocated by ${100 - getTotalAllocation()}%. Consider adding more team members or increasing allocations.`
                                                    }
                                                </Text>
                                            </Box>
                                        )}

                                        {/* Validation Errors */}
                                        {errors.contributors && (
                                            <Text color="red.200" fontSize="sm">{errors.contributors}</Text>
                                        )}
                                        {errors.allocation && (
                                            <Text color="red.200" fontSize="sm">{errors.allocation}</Text>
                                        )}
                                        {errors.contributor && (
                                            <Text color="red.200" fontSize="sm">{errors.contributor}</Text>
                                        )}
                                    </VStack>
                                </Card.Body>
                            </Card.Root>

                            {/* Action Buttons */}
                            <HStack gap={4}>
                                <Button
                                    w="50%"
                                    size="lg"
                                    onClick={handleSubmit}
                                    loading={loading}
                                    disabled={loading}
                                    colorPalette="purple"
                                    _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                                    transition="all 0.2s ease"
                                >
                                    {loading ? <Spinner size="sm" /> : <Save size={20} />}
                                    {loading ? 'Creating Project...' : 'Create Project'}
                                </Button>
                                <Button
                                    w="50%"
                                    size="lg"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                    borderColor="gray.300"
                                    color="gray.600"
                                    _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                                >
                                    Cancel
                                </Button>
                            </HStack>
                        </VStack>
                    </VStack>
                </Box>
            </AppLayout>
        </RequireProjectCreate>
    );
}
