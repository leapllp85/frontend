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
    Select,
    IconButton
} from '@chakra-ui/react';
import { Pagination } from '@/components/common/Pagination';
import { Users, AlertTriangle, Brain, Target, BookOpen, Video, MessageCircle, TrendingUp, TrendingDown, XIcon, CheckCircle, AlertCircleIcon } from 'lucide-react';
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
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isEngagementModalOpen, setIsEngagementModalOpen] = useState(false);

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
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={{ base: 4, md: 6 }}>
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

                    <Card.Root bg="white" shadow="md" borderRadius="xl" cursor="pointer" _hover={{ shadow: "lg", transform: "translateY(-2px)" }} transition="all 0.3s">
                        <Card.Body p={{ base: 4, md: 6 }}>
                            <HStack gap={{ base: 2, md: 3 }} mb={3}>
                                <Box p={{ base: 1.5, md: 2 }} bg="orange.100" borderRadius="lg">
                                    <BookOpen size={20} color="#dd6b20" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                                    Wellness Engagement
                                </Text>
                            </HStack>
                            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="orange.600" mb={2}>
                                78%
                            </Text>
                            <HStack gap={2} fontSize="xs" color="gray.600">
                                <HStack gap={1}>
                                    <BookOpen size={12} />
                                    <Text>24 articles</Text>
                                </HStack>
                                <Text>•</Text>
                                <HStack gap={1}>
                                    <Video size={12} />
                                    <Text>18 videos</Text>
                                </HStack>
                            </HStack>
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
                                                    Wellness Engagement
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
                                                        <Badge 
                                                            colorPalette={getRiskColor(member.mentalHealth)} 
                                                            size="sm" 
                                                            borderRadius="full"
                                                            cursor="pointer"
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setIsEngagementModalOpen(true);
                                                            }}
                                                            _hover={{ transform: 'scale(1.1)', shadow: 'md' }}
                                                            transition="all 0.2s"
                                                        >
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
                                                        <VStack gap={1}>
                                                            <HStack gap={2} justify="center">
                                                                <HStack gap={1}>
                                                                    <BookOpen size={14} color="#dd6b20" />
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.700">{Math.floor(Math.random() * 15) + 5}</Text>
                                                                </HStack>
                                                                <HStack gap={1}>
                                                                    <Video size={14} color="#9333ea" />
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.700">{Math.floor(Math.random() * 10) + 3}</Text>
                                                                </HStack>
                                                                <HStack gap={1}>
                                                                    <MessageCircle size={14} color="#3b82f6" />
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.700">{Math.floor(Math.random() * 5) + 1}</Text>
                                                                </HStack>
                                                            </HStack>
                                                            <Badge colorPalette="orange" size="xs" borderRadius="full">
                                                                {Math.floor(Math.random() * 30) + 60}% Active
                                                            </Badge>
                                                        </VStack>
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

                {/* Engagement Details Modal */}
                {isEngagementModalOpen && selectedMember && (
                    <Box
                        position="fixed"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="blackAlpha.600"
                        backdropFilter="blur(4px)"
                        zIndex={1000}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => setIsEngagementModalOpen(false)}
                    >
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            boxShadow="2xl"
                            maxW="900px"
                            w="90%"
                            maxH="90vh"
                            overflow="hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <Box p={6} bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
                                <HStack justify="space-between" mb={2}>
                                    <VStack align="start" gap={1}>
                                        <Heading size="lg">{selectedMember.name}</Heading>
                                        <Text fontSize="sm" opacity={0.9}>{selectedMember.email}</Text>
                                    </VStack>
                                    <IconButton
                                        aria-label="Close"
                                        onClick={() => setIsEngagementModalOpen(false)}
                                        variant="ghost"
                                        color="white"
                                        _hover={{ bg: 'whiteAlpha.300' }}
                                        size="lg"
                                    >
                                        <XIcon size={24} />
                                    </IconButton>
                                </HStack>
                                <HStack gap={3} mt={3}>
                                    <Badge colorScheme="white" variant="solid" px={3} py={1}>
                                        Mental Health: {selectedMember.mentalHealth}
                                    </Badge>
                                    <Badge colorScheme="white" variant="outline" px={3} py={1}>
                                        Risk Level: {calculateSuggestedRisk(selectedMember)}
                                    </Badge>
                                </HStack>
                            </Box>

                            {/* Modal Body */}
                            <Box p={6} overflowY="auto" maxH="calc(90vh - 200px)">
                                <VStack gap={6} align="stretch">
                                    {/* Engagement Overview */}
                                    <Box>
                                        <Heading size="md" color="gray.800" mb={4}>Wellness Engagement Summary</Heading>
                                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                            <Card.Root bg="orange.50" border="2px solid" borderColor="orange.200">
                                                <Card.Body p={4}>
                                                    <HStack gap={3} mb={2}>
                                                        <Box p={2} bg="orange.100" borderRadius="lg">
                                                            <BookOpen size={20} color="#dd6b20" />
                                                        </Box>
                                                        <VStack align="start" gap={0}>
                                                            <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                                                                {Math.floor(Math.random() * 15) + 8}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.600">Articles Read</Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Text fontSize="xs" color="gray.600">Last 30 days</Text>
                                                </Card.Body>
                                            </Card.Root>

                                            <Card.Root bg="purple.50" border="2px solid" borderColor="purple.200">
                                                <Card.Body p={4}>
                                                    <HStack gap={3} mb={2}>
                                                        <Box p={2} bg="purple.100" borderRadius="lg">
                                                            <Video size={20} color="#9333ea" />
                                                        </Box>
                                                        <VStack align="start" gap={0}>
                                                            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                                                                {Math.floor(Math.random() * 10) + 4}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.600">Videos Watched</Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Text fontSize="xs" color="gray.600">Last 30 days</Text>
                                                </Card.Body>
                                            </Card.Root>

                                            <Card.Root bg="blue.50" border="2px solid" borderColor="blue.200">
                                                <Card.Body p={4}>
                                                    <HStack gap={3} mb={2}>
                                                        <Box p={2} bg="blue.100" borderRadius="lg">
                                                            <MessageCircle size={20} color="#3b82f6" />
                                                        </Box>
                                                        <VStack align="start" gap={0}>
                                                            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                                                {Math.floor(Math.random() * 5) + 2}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.600">Chat Sessions</Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Text fontSize="xs" color="gray.600">Last 30 days</Text>
                                                </Card.Body>
                                            </Card.Root>
                                        </SimpleGrid>
                                    </Box>

                                    {/* Content Trends */}
                                    <Box p={5} bg="gray.50" borderRadius="xl">
                                        <HStack justify="space-between" mb={4}>
                                            <Heading size="sm" color="gray.800">Content Engagement Trends</Heading>
                                            <Badge colorScheme="green" fontSize="xs">
                                                <HStack gap={1}>
                                                    <TrendingUp size={12} />
                                                    <Text>+25% this month</Text>
                                                </HStack>
                                            </Badge>
                                        </HStack>
                                        <VStack gap={3} align="stretch">
                                            <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                                                        🧘 Stress Management Articles
                                                    </Text>
                                                    <Badge colorScheme="orange">High Interest</Badge>
                                                </HStack>
                                                <Text fontSize="xs" color="gray.600" mb={2}>
                                                    Accessed 8 times in the last 2 weeks
                                                </Text>
                                                <Box w="full" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="75%" h="full" bg="orange.400" />
                                                </Box>
                                            </Box>

                                            <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                                                        💤 Work-Life Balance Videos
                                                    </Text>
                                                    <Badge colorScheme="purple">Moderate</Badge>
                                                </HStack>
                                                <Text fontSize="xs" color="gray.600" mb={2}>
                                                    Watched 5 videos in the last month
                                                </Text>
                                                <Box w="full" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="55%" h="full" bg="purple.400" />
                                                </Box>
                                            </Box>

                                            <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                                                        💬 Anonymous Chat Support
                                                    </Text>
                                                    <Badge colorScheme="blue">Recent</Badge>
                                                </HStack>
                                                <Text fontSize="xs" color="gray.600" mb={2}>
                                                    3 sessions in the past week
                                                </Text>
                                                <Box w="full" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="40%" h="full" bg="blue.400" />
                                                </Box>
                                            </Box>
                                        </VStack>
                                    </Box>

                                    {/* AI-Powered Insights & Recommendations */}
                                    <Box p={5} bg="gradient-to-br from-purple-50 to-blue-50" borderRadius="xl" border="2px solid" borderColor="purple.200">
                                        <HStack gap={2} mb={4}>
                                            <Box p={2} bg="purple.100" borderRadius="lg">
                                                <Brain size={20} color="#9333ea" />
                                            </Box>
                                            <Heading size="sm" color="gray.800">AI-Powered Insights</Heading>
                                        </HStack>
                                        
                                        <VStack gap={3} align="stretch">
                                            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
                                                <HStack gap={2} mb={2}>
                                                    <AlertCircleIcon size={16} color="#f59e0b" />
                                                    <Text fontSize="sm" fontWeight="600" color="gray.800">Pattern Detected</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                                                    {selectedMember.name.split(' ')[0]} shows a consistent pattern of accessing <strong>stress-related content</strong>, 
                                                    particularly during <strong>Monday mornings and late evenings</strong>. This suggests potential work-related 
                                                    stress and difficulty with work-life boundaries.
                                                </Text>
                                            </Box>

                                            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
                                                <HStack gap={2} mb={2}>
                                                    <CheckCircle size={16} color="#22c55e" />
                                                    <Text fontSize="sm" fontWeight="600" color="gray.800">Positive Engagement</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                                                    Actively seeking help through multiple channels (articles, videos, chat). 
                                                    This proactive behavior is a positive indicator of self-awareness and willingness to improve.
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </Box>

                                    {/* Recommended Actions */}
                                    <Box p={5} bg="green.50" borderRadius="xl" border="2px solid" borderColor="green.200">
                                        <HStack gap={2} mb={4}>
                                            <Box p={2} bg="green.100" borderRadius="lg">
                                                <Target size={20} color="#22c55e" />
                                            </Box>
                                            <Heading size="sm" color="gray.800">Recommended Actions</Heading>
                                        </HStack>
                                        
                                        <VStack gap={2} align="stretch">
                                            <HStack gap={3} p={3} bg="white" borderRadius="lg">
                                                <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1} />
                                                <Text fontSize="sm" color="gray.700">
                                                    <strong>Schedule a 1-on-1 check-in</strong> to discuss workload and stress management strategies
                                                </Text>
                                            </HStack>
                                            <HStack gap={3} p={3} bg="white" borderRadius="lg">
                                                <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1} />
                                                <Text fontSize="sm" color="gray.700">
                                                    <strong>Recommend stress management workshop</strong> enrollment (next session: Dec 5, 2025)
                                                </Text>
                                            </HStack>
                                            <HStack gap={3} p={3} bg="white" borderRadius="lg">
                                                <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1} />
                                                <Text fontSize="sm" color="gray.700">
                                                    <strong>Review current project assignments</strong> to identify potential workload redistribution
                                                </Text>
                                            </HStack>
                                            <HStack gap={3} p={3} bg="white" borderRadius="lg">
                                                <Box w="6px" h="6px" bg="green.500" borderRadius="full" flexShrink={0} mt={1} />
                                                <Text fontSize="sm" color="gray.700">
                                                    <strong>Connect with EAP counselor</strong> for professional mental health support
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </VStack>
                            </Box>

                            {/* Modal Footer */}
                            <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
                                <HStack justify="flex-end" gap={3}>
                                    <Button variant="outline" onClick={() => setIsEngagementModalOpen(false)}>
                                        Close
                                    </Button>
                                    <Button colorScheme="purple">
                                        Schedule Follow-up
                                    </Button>
                                </HStack>
                            </Box>
                        </Box>
                    </Box>
                )}
        </AppLayout>
    );
}
