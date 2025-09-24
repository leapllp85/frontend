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
    Flex,
    Input,
    Select
} from '@chakra-ui/react';
import { Pagination } from '@/components/common/Pagination';
import { Users, AlertTriangle, Brain, Target } from 'lucide-react';
import { getRiskColor } from '@/utils/riskColors';
import { teamApi, EmployeeProfile, TeamMembersPaginatedResponse, TeamMembersQueryParams } from '@/services';
import { AppLayout } from '@/components/layouts/AppLayout';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const fetchTeamData = async (params?: TeamMembersQueryParams) => {
        try {
            setLoading(true);
            const response: TeamMembersPaginatedResponse = await teamApi.getTeamMembers(params);
            
            const profilesArray = response.results.team_members || [];
            const transformedMembers: TeamMember[] = profilesArray.map((profile: EmployeeProfile) => ({
                id: profile.id.toString(),
                // @ts-ignore
                name: `${profile.first_name} ${profile.last_name}` || profile.username,
                email: profile.email || `${profile.first_name?.toLowerCase()}.${profile.last_name?.toLowerCase()}@company.com`,
                mentalHealth: profile.mental_health as 'High' | 'Medium' | 'Low',
                motivationFactor: profile.motivation_factor as 'High' | 'Medium' | 'Low',
                careerOpportunities: profile.career_opportunities as 'High' | 'Medium' | 'Low',
                personalReason: profile.personal_reason as 'High' | 'Medium' | 'Low',
                managerAssessmentRisk: profile.manager_assessment_risk as 'High' | 'Medium' | 'Low',
            }));
            
            setTeamMembers(transformedMembers);
            setTotalCount(response.count);
            setFilteredCount(response.results.filtered_count);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
            setError(null);
        } catch (err) {
            console.error('Error fetching team data:', err);
            setError('Failed to load team data. Please try again.');
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamData({ page: currentPage, page_size: pageSize, search: searchQuery || undefined });
    }, [currentPage, pageSize, searchQuery]);

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
            <Box w="full" minH="100vh" bg="gray.50" py={8} px={4}>
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
            <Box w="full" minH="100vh" bg="gray.50" py={8} px={4}>
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
        <AppLayout>
                {/* Header */}
                {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack align="start" gap={2}>
                        <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="bold">
                            My Team
                        </Heading>
                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                            Manage team members and assess attrition risks
                        </Text>
                    </VStack>
                </Box> */}

                {/* Content */}
                <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack gap={{ base: 6, md: 8 }} align="stretch" w="full">

                        {/* Analytics Cards */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 4, md: 6 }}>
                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <HStack gap={{ base: 2, md: 3 }} mb={4}>
                                <Box p={{ base: 1.5, md: 2 }} bg="blue.100" borderRadius="lg">
                                    <Users size={20} color="#3182ce" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                                    Total Team Members
                                </Text>
                            </HStack>
                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="blue.600">
                                {teamMembers.length}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <HStack gap={{ base: 2, md: 3 }} mb={4}>
                                <Box p={{ base: 1.5, md: 2 }} bg="red.100" borderRadius="lg">
                                    <AlertTriangle size={20} color="#e53e3e" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                                    High Risk Members
                                </Text>
                            </HStack>
                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="red.600">
                                {attritionData.High || 0}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <HStack gap={{ base: 2, md: 3 }} mb={4}>
                                <Box p={{ base: 1.5, md: 2 }} bg="green.100" borderRadius="lg">
                                    <Target size={20} color="#38a169" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                                    Low Risk Members
                                </Text>
                            </HStack>
                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="green.600">
                                {attritionData.Low || 0}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <HStack gap={{ base: 2, md: 3 }} mb={4}>
                                <Box p={{ base: 1.5, md: 2 }} bg="purple.100" borderRadius="lg">
                                    <Brain size={20} color="#805ad5" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                                    Mental Health Issues
                                </Text>
                            </HStack>
                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="purple.600">
                                {mentalHealthIssues}
                            </Text>
                        </Card.Body>
                    </Card.Root>
                        </SimpleGrid>

                        {/* Team Members Table */}
                        <Card.Root bg="white" shadow="md" borderRadius="xl">
                            <Card.Header p={6}>
                                <VStack align="stretch" gap={4}>
                                    <Box>
                                        <Heading size="lg" color="gray.800">
                                            Team Members
                                        </Heading>
                                        <Text color="gray.600" fontSize="sm">
                                            Individual team member risk assessments
                                        </Text>
                                    </Box>
                                    
                                    {/* Search and Filters */}
                                    <HStack gap={4} flexWrap="wrap">
                                        <Box flex={1} minW="200px">
                                            <Input
                                                placeholder="Search by name, email, or username..."
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setCurrentPage(1); // Reset to first page on search
                                                }}
                                                size="sm"
                                            />
                                        </Box>
                                        <Box>
                                            <select
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value));
                                                    setCurrentPage(1); // Reset to first page on page size change
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
                                                    minWidth: '120px'
                                                }}
                                            >
                                                <option value={5}>5 per page</option>
                                                <option value={10}>10 per page</option>
                                                <option value={20}>20 per page</option>
                                                <option value={50}>50 per page</option>
                                            </select>
                                        </Box>
                                    </HStack>
                                    
                                    {/* Results Info and Search Status */}
                                    {searchQuery && (
                                        <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                                            <Text fontSize="sm" color="blue.700">
                                                <strong>{filteredCount}</strong> members found matching <strong>"{searchQuery}"</strong>
                                                {filteredCount !== totalCount && (
                                                    <span> (filtered from {totalCount} total members)</span>
                                                )}
                                            </Text>
                                        </Box>
                                    )}
                                </VStack>
                            </Card.Header>
                            <Card.Body p={0}>
                                <Box overflowX="auto">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Member
                                                </th>
                                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Mental Health
                                                </th>
                                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Motivation
                                                </th>
                                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Career
                                                </th>
                                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Personal
                                                </th>
                                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Suggested Risk
                                                </th>
                                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                                    Manager Assessment
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamMembers.map((member, index) => (
                                                <tr 
                                                    key={member.id}
                                                    style={{ 
                                                        borderBottom: '1px solid #e2e8f0',
                                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                                                    }}
                                                >
                                                    <td style={{ padding: '16px' }}>
                                                        <VStack align="start" gap={1}>
                                                            <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                                                {member.name}
                                                            </Text>
                                                            <Text color="gray.600" fontSize="xs">
                                                                {member.email}
                                                            </Text>
                                                        </VStack>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <Badge colorPalette={getRiskColor(member.mentalHealth)} size="sm" borderRadius="full">
                                                            {member.mentalHealth}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <Badge colorPalette={getRiskColor(member.motivationFactor)} size="sm" borderRadius="full">
                                                            {member.motivationFactor}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <Badge colorPalette={getRiskColor(member.careerOpportunities)} size="sm" borderRadius="full">
                                                            {member.careerOpportunities}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <Badge colorPalette={getRiskColor(member.personalReason)} size="sm" borderRadius="full">
                                                            {member.personalReason}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <Badge colorPalette={getRiskColor(calculateSuggestedRisk(member))} size="sm" borderRadius="full">
                                                            {calculateSuggestedRisk(member)}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <select
                                                            value={member.managerAssessmentRisk}
                                                            onChange={(e) => handleRiskChange(member.id, e.target.value as any)}
                                                            style={{
                                                                color: '#4a5568',
                                                                padding: '6px 12px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '9999px',
                                                                fontSize: '12px',
                                                                backgroundColor: 'white',
                                                                fontWeight: '500',
                                                                outline: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="High">High Risk</option>
                                                            <option value="Medium">Medium Risk</option>
                                                            <option value="Low">Low Risk</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                            </Card.Body>
                            
                            {/* Enhanced Pagination Footer */}
                            <Card.Footer p={4} borderTop="1px solid" borderColor="gray.200">
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
                            </Card.Footer>
                        </Card.Root>
                    </VStack>
                </Box>
        </AppLayout>
    );
}
