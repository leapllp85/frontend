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
            <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                <VStack align="start" gap={2}>
                    <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="bold">
                        My Team
                    </Heading>
                    <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                        Manage team members and assess attrition risks
                    </Text>
                </VStack>
            </Box>
            
            <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                <VStack gap={{ base: 6, md: 8 }} align="stretch" w="full">
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
                        <Heading size="lg" color="gray.800">
                            Team Members
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Individual team member risk assessments
                        </Text>
                    </Card.Header>
                    <Card.Body p={0}>
                        <Box overflowX="auto">
                            <Box as="table" w="full" borderCollapse="separate" borderSpacing="0">
                                <Box as="thead">
                                    <Box as="tr" bg="gray.50">
                                        <Box 
                                            as="th" 
                                            px={5} 
                                            py={3.5} 
                                            textAlign="left" 
                                            fontWeight="600" 
                                            color="gray.700" 
                                            fontSize="xs" 
                                            textTransform="uppercase" 
                                            letterSpacing="wider"
                                            borderBottomWidth="1px"
                                            borderColor="gray.200"
                                            whiteSpace="nowrap"
                                        >
                                            TEAM MEMBER
                                        </Box>
                                        {['MENTAL HEALTH', 'MOTIVATION', 'CAREER', 'PERSONAL'].map((header) => (
                                            <Box 
                                                key={header} 
                                                as="th" 
                                                px={5} 
                                                py={3.5} 
                                                textAlign="center" 
                                                fontWeight="600" 
                                                color="gray.700" 
                                                fontSize="xs" 
                                                textTransform="uppercase" 
                                                letterSpacing="wider"
                                                borderBottomWidth="1px"
                                                borderColor="gray.200"
                                                whiteSpace="nowrap"
                                            >
                                                {header}
                                            </Box>
                                        ))}
                                        <Box 
                                            as="th" 
                                            px={5} 
                                            py={3.5} 
                                            textAlign="center" 
                                            fontWeight="600" 
                                            color="gray.700" 
                                            fontSize="xs" 
                                            textTransform="uppercase" 
                                            letterSpacing="wider"
                                            borderBottomWidth="1px"
                                            borderColor="gray.200"
                                        >
                                            RISK ASSESSMENT
                                        </Box>
                                        <Box 
                                            as="th" 
                                            px={5} 
                                            py={3.5} 
                                            textAlign="center" 
                                            fontWeight="600" 
                                            color="gray.700" 
                                            fontSize="xs" 
                                            textTransform="uppercase" 
                                            letterSpacing="wider"
                                            borderBottomWidth="1px"
                                            borderColor="gray.200"
                                            whiteSpace="nowrap"
                                        >
                                            YOUR ASSESSMENT
                                        </Box>
                                    </Box>
                                </Box>
                                <Box as="tbody" bg="white">
                                    {teamMembers.map((member, index) => {
                                        const suggestedRisk = calculateSuggestedRisk(member);
                                        const borderColor = index < teamMembers.length - 1 ? 'gray.100' : 'transparent';
                                        
                                        return (
                                            <Box 
                                                as="tr" 
                                                key={member.id}
                                                _hover={{ bg: 'gray.50' }}
                                                transition="background-color 0.2s"
                                                borderBottomWidth="1px"
                                                borderColor={borderColor}
                                            >
                                                {/* Member Info */}
                                                <Box as="td" px={5} py={4} borderRightWidth="1px" borderColor="gray.100">
                                                    <VStack align="start" spacing={0.5}>
                                                        <Text 
                                                            fontWeight="500" 
                                                            color="gray.800" 
                                                            fontSize="sm"
                                                            lineHeight="shorter"
                                                        >
                                                            {member.name}
                                                        </Text>
                                                        <Text 
                                                            color="gray.500" 
                                                            fontSize="xs"
                                                            lineHeight="shorter"
                                                        >
                                                            {member.email}
                                                        </Text>
                                                    </VStack>
                                                </Box>
                                                
                                                {/* Risk Factors */}
                                                {[
                                                    member.mentalHealth, 
                                                    member.motivationFactor, 
                                                    member.careerOpportunities, 
                                                    member.personalReason
                                                ].map((factor, idx) => (
                                                    <Box 
                                                        key={idx} 
                                                        as="td" 
                                                        px={5} 
                                                        py={4}
                                                        textAlign="center"
                                                        borderRightWidth={idx < 3 ? "1px" : "0"}
                                                        borderColor="gray.100"
                                                    >
                                                        <Box 
                                                            display="inline-block"
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            fontSize="xs"
                                                            fontWeight="medium"
                                                            color={`${getRiskColor(factor)}.700`}
                                                            bg={`${getRiskColor(factor)}.50`}
                                                            borderWidth="1px"
                                                            borderColor={`${getRiskColor(factor)}.100`}
                                                        >
                                                            {factor}
                                                        </Box>
                                                    </Box>
                                                ))}
                                                
                                                {/* Suggested Risk */}
                                                <Box 
                                                    as="td" 
                                                    px={5} 
                                                    py={4}
                                                    textAlign="center"
                                                    borderRightWidth="1px"
                                                    borderColor="gray.100"
                                                >
                                                    <Box 
                                                        display="inline-flex"
                                                        alignItems="center"
                                                        px={3}
                                                        py={1.5}
                                                        borderRadius="md"
                                                        fontSize="xs"
                                                        fontWeight="semibold"
                                                        color={`${getRiskColor(suggestedRisk)}.700`}
                                                        bg={`${getRiskColor(suggestedRisk)}.50`}
                                                        borderWidth="1px"
                                                        borderColor={`${getRiskColor(suggestedRisk)}.200`}
                                                        boxShadow="xs"
                                                    >
                                                        {suggestedRisk} Risk
                                                    </Box>
                                                </Box>
                                            
                                                {/* Manager Assessment */}
                                                <Box 
                                                    as="td" 
                                                    px={5} 
                                                    py={4}
                                                    textAlign="center"
                                                >
                                                    <Box
                                                        as="select"
                                                        value={member.managerAssessmentRisk}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                                                            handleRiskChange(member.id, e.target.value as 'High' | 'Medium' | 'Low')
                                                        }
                                                        sx={{
                                                            appearance: 'none',
                                                            WebkitAppearance: 'none',
                                                            MozAppearance: 'none',
                                                            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234a5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'right 0.7rem top 50%',
                                                            backgroundSize: '0.65rem auto',
                                                            padding: '0.5rem 2.5rem 0.5rem 1rem',
                                                            fontSize: '0.8125rem',
                                                            lineHeight: '1.25rem',
                                                            color: 'gray.700',
                                                            backgroundColor: 'white',
                                                            border: '1px solid',
                                                            borderColor: 'gray.200',
                                                            borderRadius: '0.375rem',
                                                            transition: 'all 0.2s',
                                                            cursor: 'pointer',
                                                            outline: 'none',
                                                            width: '100%',
                                                            maxWidth: '160px',
                                                            minWidth: '120px',
                                                            _focus: {
                                                                ring: '0 0 0 2px',
                                                                ringColor: 'purple.200',
                                                                borderColor: 'purple.400',
                                                                boxShadow: 'none'
                                                            },
                                                            _hover: {
                                                                borderColor: 'gray.300'
                                                            },
                                                            '& option[value="High"]': {
                                                                color: 'red.600',
                                                                backgroundColor: 'white'
                                                            },
                                                            '& option[value="Medium"]': {
                                                                color: 'yellow.700',
                                                                backgroundColor: 'white'
                                                            },
                                                            '& option[value="Low"]': {
                                                                color: 'green.600',
                                                                backgroundColor: 'white'
                                                            }
                                                        }}
                                                    >
                                                        <option value="High">High Risk</option>
                                                        <option value="Medium">Medium Risk</option>
                                                        <option value="Low">Low Risk</option>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Box>
                    </Card.Body>
                </Card.Root>
            </VStack>
        </Box>
    </AppLayout>
    );
}
