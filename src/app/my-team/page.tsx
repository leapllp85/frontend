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
    SimpleGrid,
    Spinner,
    Flex
} from '@chakra-ui/react';
import { Users, AlertTriangle, Brain, Target } from 'lucide-react';
import { getRiskColor } from '@/utils/riskColors';
import { teamApi, EmployeeProfile } from '@/services';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    mentalHealth: 'High' | 'Medium' | 'Low';
    motivationFactor: 'High' | 'Medium' | 'Low';
    careerOpportunities: 'High' | 'Medium' | 'Low';
    personalReason: 'High' | 'Medium' | 'Low';
    managerAssessmentRisk: 'High' | 'Medium' | 'Low';
}

export default function MyTeam() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                setLoading(true);
                const employeeProfiles = await teamApi.getTeamMembers();
                
                // Ensure employeeProfiles is an array
                // @ts-ignore
                const profilesArray = Array.isArray(employeeProfiles.team_members) ? employeeProfiles.team_members : [];
                const transformedMembers: TeamMember[] = profilesArray.map((profile: EmployeeProfile) => ({
                    id: profile.id.toString(),
                    // @ts-ignore
                    name: `${profile.first_name} ${profile.last_name}` || profile.username,
                    // @ts-ignore
                    email: profile.email,
                    mentalHealth: profile.mental_health as 'High' | 'Medium' | 'Low',
                    motivationFactor: profile.motivation_factor as 'High' | 'Medium' | 'Low',
                    careerOpportunities: profile.career_opportunities as 'High' | 'Medium' | 'Low',
                    personalReason: profile.personal_reason as 'High' | 'Medium' | 'Low',
                    managerAssessmentRisk: profile.manager_assessment_risk as 'High' | 'Medium' | 'Low',
                }));
                
                setTeamMembers(transformedMembers);
                setError(null);
            } catch (err) {
                console.error('Error fetching team data:', err);
                setError('Failed to load team data. Please try again.');
                setTeamMembers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    const calculateSuggestedRisk = (member: TeamMember): 'High' | 'Medium' | 'Low' => {
        const riskValues = {
            'High': 3,
            'Medium': 2,
            'Low': 1
        };
        
        const total = riskValues[member.mentalHealth] + 
                     riskValues[member.motivationFactor] + 
                     riskValues[member.careerOpportunities] + 
                     riskValues[member.personalReason];
        
        const average = total / 4;
        
        if (average >= 2.5) return 'High';
        if (average >= 1.5) return 'Medium';
        return 'Low';
    };

    const handleRiskChange = (memberId: string, newRisk: 'High' | 'Medium' | 'Low') => {
        setTeamMembers(prev => prev.map(member => 
            member.id === memberId ? { ...member, managerAssessmentRisk: newRisk } : member
        ));
    };

    // Analytics data
    const attritionData = teamMembers.reduce((acc, member) => {
        acc[member.managerAssessmentRisk] = (acc[member.managerAssessmentRisk] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mentalHealthIssues = teamMembers.filter(member => member.mentalHealth === 'High').length;

    if (loading) {
        return (
            <Box minH="100vh" bg="gray.50" py={8} px={4}>
                <Flex justify="center" align="center" minH="60vh">
                    <VStack gap={4}>
                        <Spinner size="xl" color="purple.500" />
                        <Text color="gray.600" fontSize="lg">
                            Loading team data...
                        </Text>
                    </VStack>
                </Flex>
            </Box>
        );
    }

    if (error) {
        return (
            <Box minH="100vh" bg="gray.50" py={8} px={4}>
                <Flex justify="center" align="center" minH="60vh">
                    <VStack gap={4}>
                        <Text color="red.600" fontSize="lg">
                            {error}
                        </Text>
                        <Button onClick={() => window.location.reload()} colorPalette="blue">
                            Retry
                        </Button>
                    </VStack>
                </Flex>
            </Box>
        );
    }

    return (
        <Box w="full" minH="100vh" bg="gray.50" py={8} px={4}>
            <VStack gap={8} align="stretch" maxW="7xl" mx="auto">
                {/* Header */}
                <Box textAlign="center">
                    <Heading size="2xl" color="gray.800" mb={3} fontWeight="bold">
                        My Team
                    </Heading>
                    <Text color="gray.600" fontSize="lg">
                        Manage team members and assess attrition risks
                    </Text>
                </Box>

                {/* Analytics Cards */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="blue.100" borderRadius="lg">
                                    <Users size={20} color="#3182ce" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Total Team Members
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                                {teamMembers.length}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="red.100" borderRadius="lg">
                                    <AlertTriangle size={20} color="#e53e3e" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    High Risk Members
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="red.600">
                                {attritionData.High || 0}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="green.100" borderRadius="lg">
                                    <Target size={20} color="#38a169" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Low Risk Members
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="green.600">
                                {attritionData.Low || 0}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="purple.100" borderRadius="lg">
                                    <Brain size={20} color="#805ad5" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Mental Health Issues
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                                {mentalHealthIssues}
                            </Text>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* Team Members List */}
                <Card.Root bg="white" shadow="lg" borderRadius="xl">
                    <Card.Header p={6}>
                        <Heading size="lg" color="gray.800">
                            Team Members
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Individual team member risk assessments
                        </Text>
                    </Card.Header>
                    <Card.Body p={6}>
                        <VStack gap={4} align="stretch">
                            {teamMembers.map((member) => (
                                <Card.Root key={member.id} bg="gray.50" borderRadius="lg">
                                    <Card.Body p={4}>
                                        <HStack justify="space-between" align="center">
                                            <VStack align="start" gap={1} color="gray.800">
                                                <Text fontWeight="bold" fontSize="lg">
                                                    {member.name}
                                                </Text>
                                                <Text color="gray.600" fontSize="sm">
                                                    {member.email}
                                                </Text>
                                            </VStack>
                                            <HStack gap={4}>
                                                <VStack gap={1}>
                                                    <Text fontSize="xs" color="gray.500">Mental Health</Text>
                                                    <Badge colorPalette={getRiskColor(member.mentalHealth)} size="sm">
                                                        {member.mentalHealth}
                                                    </Badge>
                                                </VStack>
                                                <VStack gap={1}>
                                                    <Text fontSize="xs" color="gray.500">Motivation</Text>
                                                    <Badge colorPalette={getRiskColor(member.motivationFactor)} size="sm">
                                                        {member.motivationFactor}
                                                    </Badge>
                                                </VStack>
                                                <VStack gap={1}>
                                                    <Text fontSize="xs" color="gray.500">Career</Text>
                                                    <Badge colorPalette={getRiskColor(member.careerOpportunities)} size="sm">
                                                        {member.careerOpportunities}
                                                    </Badge>
                                                </VStack>
                                                <VStack gap={1}>
                                                    <Text fontSize="xs" color="gray.500">Personal</Text>
                                                    <Badge colorPalette={getRiskColor(member.personalReason)} size="sm">
                                                        {member.personalReason}
                                                    </Badge>
                                                </VStack>
                                                <VStack gap={1}>
                                                    <Text fontSize="xs" color="gray.500">Suggested Risk</Text>
                                                    <Badge colorPalette={getRiskColor(calculateSuggestedRisk(member))} size="sm">
                                                        {calculateSuggestedRisk(member)}
                                                    </Badge>
                                                </VStack>
                                                <VStack gap={1} color="gray.600">
                                                    <Text fontSize="xs" color="gray.500">Manager Assessment</Text>
                                                    <select
                                                        value={member.managerAssessmentRisk}
                                                        onChange={(e) => handleRiskChange(member.id, e.target.value as any)}
                                                        className="px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                                                    >
                                                        <option value="High">High</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Low">Low</option>
                                                    </select>
                                                </VStack>
                                            </HStack>
                                        </HStack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </VStack>
        </Box>
    );
}
