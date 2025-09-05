'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Card,
    Badge,
    SimpleGrid,
    Button,
    Flex,
} from '@chakra-ui/react';
import { 
    Icon,
    Users, 
    TrendingUp, 
    Star, 
    AlertTriangle,
    Target
} from 'lucide-react';
import { getRiskColor } from '@/utils/riskColors';
import { dashboardApi, teamApi, DashboardQuickData } from '@/services';
import { AppLayout } from '@/components/layouts/AppLayout';
import { insights } from './constants';
import { TeamMember } from '@/types';

export default function Dashboard() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardQuickData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // Fetch dashboard quick data and team members in parallel
                const [quickData, teamData] = await Promise.all([
                    dashboardApi.getDashboardQuickData(),
                    teamApi.getTeamMembers()
                ]);
                
                setDashboardData(quickData);
                console.log('Dashboard Quick Data:', quickData);
                
                // Transform team data to match UI expectations
                // Add validation to ensure teamData is an array
                // @ts-ignore
                const teamArray = Array.isArray(teamData.team_members) ? teamData.team_members : [];
                
                console.log('Team API Response:', teamArray);
                
                // @ts-ignore
                const transformedTeamMembers: TeamMember[] = teamArray.map(member => ({
                    id: member.id.toString(),
                    name: (member.first_name && member.last_name) ? `${member.first_name} ${member.last_name}` : member.username || 'Unknown User',
                    email: member.email || `${member.username}@company.com`,
                    age: member.age || 0,
                    mentalHealth: member.mental_health || 'Medium',
                    motivationFactor: member.motivation_factor || 'Medium',
                    careerOpportunities: member.career_opportunities || 'Medium',
                    personalReason: member.personal_reason || 'Medium',
                    managerAssessmentRisk: member.manager_assessment_risk || 'Medium',
                    utilization: Math.floor(Math.random() * 30) + 70, // TODO: Get from allocations API
                    projectCriticality: member.manager_assessment_risk || 'Medium',
                    attritionRisk: member.manager_assessment_risk || 'Medium',
                    primaryTrigger: member.primary_trigger || 'MH',
                    triggers: {
                        mentalHealth: member.mental_health === 'Low',
                        motivation: member.motivation_factor === 'Low',
                        career: member.career_opportunities === 'Low',
                        personal: member.personal_reason === 'Low'
                    }
                }));
                
                setTeamMembers(transformedTeamMembers);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
                // Fallback to empty data on error
                setTeamMembers([]);
                setDashboardData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calculate analytics using API data or fallback to calculated values
    const teamAttritionRisk = () => {
        if (dashboardData) {
            return dashboardData.team_attrition_risk;
        }
        if (teamMembers.length === 0) return 0;
        const riskCounts = teamMembers.reduce((acc, member) => {
            const risk = member.attritionRisk || 'Medium';
            acc[risk] = (acc[risk] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const highRisk = riskCounts['High'] || 0;
        const total = teamMembers.length;
        return Math.round((highRisk / total) * 100);
    };

    const teamMentalHealth = () => {
        if (dashboardData) {
            return dashboardData.team_mental_health;
        }
        if (teamMembers.length === 0) return 0;
        const scores = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const avgScore = teamMembers.reduce((sum, member) => 
            sum + scores[member.mentalHealth], 0) / teamMembers.length;
        return Math.round(avgScore * 100 / 3);
    };

    const avgUtilization = () => {
        if (dashboardData) {
            return dashboardData.avg_utilization;
        }
        if (teamMembers.length === 0) return 0;
        return Math.round(teamMembers.reduce((sum, member) => 
            sum + (member.utilization || 0), 0) / teamMembers.length);
    };

    const topTalent = () => {
        if (dashboardData && dashboardData.top_talent) {
            return dashboardData.top_talent.slice(0, 3).map((talent: any) => ({
                id: talent.id.toString(),
                name: `${talent.first_name || ''} ${talent.last_name || ''}`.trim() || talent.username || 'Unknown User',
                email: talent.email || 'unknown@company.com',
                age: talent.age || 0,
                mentalHealth: talent.mental_health || 'Medium',
                motivationFactor: talent.motivation_factor || 'High',
                careerOpportunities: talent.career_opportunities || 'High',
                personalReason: talent.personal_reason || 'Medium',
                managerAssessmentRisk: talent.manager_assessment_risk || 'Medium',
                utilization: Math.floor(Math.random() * 30) + 70,
                projectCriticality: talent.project_criticality || 'Medium',
                attritionRisk: talent.manager_assessment_risk || 'Medium',
                primaryTrigger: talent.primary_trigger || 'MT',
                triggers: {
                    mentalHealth: talent.mental_health === 'Low',
                    motivation: talent.motivation_factor === 'Low',
                    career: talent.career_opportunities === 'Low',
                    personal: talent.personal_reason === 'Low'
                }
            }));
        }
        return teamMembers
            .filter(member => member.projectCriticality === 'High')
            .slice(0, 3);
    };

    const averageAge = () => {
        if (dashboardData) {
            return dashboardData.average_age;
        }
        if (teamMembers.length === 0) return 0;
        return Math.round(teamMembers.reduce((sum, member) => 
            sum + member.age, 0) / teamMembers.length);
    };



    return (
        <AppLayout>
                {/* Header */}
                {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack align="start" gap={2}>
                        <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="bold">
                            Team Dashboard
                        </Heading>
                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                            Quick insights and analytics for your team performance
                        </Text>
                    </VStack>
                </Box> */}

                {/* Content */}
                <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack gap={8} align="stretch" w="full">

                    {/* Loading State */}
                    {loading && (
                        <Box textAlign="center" py={12}>
                            <Text fontSize="lg" color="gray.600">Loading dashboard data...</Text>
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Box textAlign="center" py={12}>
                            <Text fontSize="lg" color="red.500" mb={4}>{error}</Text>
                            <Button onClick={() => window.location.reload()} colorScheme="purple">
                                Retry
                            </Button>
                        </Box>
                    )}

                    {/* Quick Data Widgets */}
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} gap={{ base: 2, md: 4 }}>
                        {insights({
                            teamAttritionRisk,
                            teamMentalHealth,
                            avgUtilization,
                            topTalent,
                            averageAge
                        }).map((insight, index) => (
                            <Card.Root 
                                key={index}
                                bg={insight.bg}
                                border="none"
                                borderRadius="2xl"
                                shadow="xl"
                                _hover={{ transform: "translateY(-4px)", shadow: "2xl" }}
                                transition="all 0.3s ease"
                                w="full"
                            >
                                <Card.Body p={{ base: 2, md: 4 }}>
                                    <VStack gap={4} align="start" w="full">
                                        <HStack justify="space-between" w="full">
                                            <Box p={{ base: 2, md: 3 }} bg="whiteAlpha.200" borderRadius="xl" backdropFilter="blur(10px)">
                                                {React.createElement(insight.icon, { size: 20, color: "white" })}
                                            </Box>
                                            <Badge
                                                bg="whiteAlpha.300"
                                                color="white"
                                                variant="solid"
                                                fontSize={{ base: "2xs", md: "xs" }}
                                                px={{ base: 2, md: 3 }}
                                                py={{ base: 1, md: 2 }}
                                                borderRadius="full"
                                            >
                                                {insight.badge}
                                            </Badge>
                                        </HStack>
                                        <VStack gap={1} align="start" w="full">
                                            <Text fontSize={{ base: "md", md: "xl" }} fontWeight="black" color="white" lineHeight="1" letterSpacing="tight">
                                                {insight.value}
                                            </Text>
                                            <Text fontSize={{ base: "sm", md: "md" }} color="white" fontWeight="semibold" letterSpacing="wide">
                                                {insight.title}
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </SimpleGrid>

                    {/* Top Talent Details */}
                    <Card.Root 
                        bg="linear-gradient(135deg, #a5489f 0%, #8a3d85 100%)"
                        border="1px solid" 
                        borderColor="whiteAlpha.300"
                        borderRadius="2xl"
                        shadow="2xl"
                        _hover={{ transform: "translateY(-4px)", shadow: "3xl" }}
                        transition="all 0.4s ease"
                    >
                        <Card.Header p={6} pb={4}>
                            <HStack gap={3}>
                                <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                                    <Star size={24} color="white" />
                                </Box>
                                <Heading size={{ base: "lg", md: "xl" }} color="white" fontWeight="black" letterSpacing="tight">Top 3 Talent</Heading>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={6} pt={2}>
                            <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 4, md: 6 }}>
                                {topTalent().map((member, index) => (
                                    <Card.Root 
                                        key={member.id} 
                                        bg="white" 
                                        border="1px solid" 
                                        borderColor="gray.200"
                                        borderRadius="xl"
                                        shadow="md"
                                        _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                                        transition="all 0.3s ease"
                                        position="relative"
                                    >
                                        <Badge 
                                            colorPalette={"white"} 
                                            variant="solid" 
                                            fontWeight="bold"
                                            size="lg"
                                            fontSize="6xl"
                                            px={4}
                                            py={2}
                                            borderRadius="full"
                                            position="absolute"
                                            left={4}
                                            top={3}
                                            zIndex={1}
                                        >
                                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                        </Badge>
                                        <Card.Body w="full" p={{ base: 2, md: 4 }}>
                                            <VStack gap={4}>
                                                <HStack justify="flex-end" w="full">
                                                    <Badge 
                                                        colorPalette={getRiskColor(member.attritionRisk || 'Medium')} 
                                                        size="md" 
                                                        fontWeight="semibold"
                                                        variant="solid"
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        {member.attritionRisk} Risk
                                                    </Badge>
                                                </HStack>
                                                <VStack gap={1} align="center">
                                                    <Text fontWeight="black" fontSize={{ base: "lg", md: "xl" }} color="gray.900" letterSpacing="tight">
                                                        {member.name}
                                                    </Text>
                                                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.700" fontWeight="medium">
                                                        {member.age} years old
                                                    </Text>
                                                </VStack>
                                                <HStack justify="space-between" w="full">
                                                    <VStack gap={0} align="center">
                                                        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="black" color="#a5489f" letterSpacing="tight">
                                                            {member.utilization}%
                                                        </Text>
                                                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                                                            Utilization
                                                        </Text>
                                                    </VStack>
                                                    <VStack gap={0} align="center">
                                                        <Badge 
                                                            colorPalette={
                                                                member.mentalHealth === 'High' ? 'green' :
                                                                member.mentalHealth === 'Medium' ? 'blue' :
                                                                'red'
                                                            }
                                                            size="md" 
                                                            fontWeight="semibold"
                                                            variant="solid"
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                        >
                                                            {member.mentalHealth === 'High' ? '😊 ' + member.mentalHealth :
                                                             member.mentalHealth === 'Medium' ? '😐 ' + member.mentalHealth :
                                                             '😟 ' + member.mentalHealth}
                                                        </Badge>
                                                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                                                            Mental Health
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                            </SimpleGrid>
                        </Card.Body>
                    </Card.Root>

                    {/* Team Overview */}
                    {/* <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} gap={{ base: 2, md: 4 }}
                        // bg="gray.50"
                        // border="none"
                        // borderRadius="2xl"
                        // shadow="2xl"
                        // _hover={{ transform: "translateY(-4px)", shadow: "3xl" }}
                        // transition="all 0.4s ease"
                    > */}
                        {/* <Card.Header p={6} pb={4}>
                            <HStack gap={3}>
                                <Box p={3} bg="whiteAlpha.200" borderRadius="xl" backdropFilter="blur(10px)">
                                    <Users size={24} color="white" />
                                </Box>
                                <Heading size="xl" color="white" fontWeight="black" letterSpacing="tight">Team Overview</Heading>
                            </HStack>
                        </Card.Header> */}
                        {/* <Card.Body p={6} pt={2}> */}
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={{ base: 4, md: 6 }}>
                                {/* Total Team Members */}
                                <Card.Root 
                                    bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                    border="none"
                                    borderRadius="xl"
                                    shadow="md"
                                    _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                                    transition="all 0.3s ease"
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Box 
                                        position="absolute" 
                                        top="0" 
                                        right="0" 
                                        w="16" 
                                        h="16" 
                                        bg="whiteAlpha.200" 
                                        borderRadius="full" 
                                        transform="translate(6px, -6px)"
                                    />
                                    <Card.Body p={{ base: 3, md: 5 }}>
                                        <VStack gap={3} align="center">
                                            <Box p={2} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                                                <Users size={20} color="white" />
                                            </Box>
                                            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="black" color="white" lineHeight="1" letterSpacing="tight">
                                                {teamMembers.length}
                                            </Text>
                                            <Text fontSize={{ base: "xs", md: "sm" }} color="white" textAlign="center" fontWeight="semibold" letterSpacing="wide">
                                                Total Team Members
                                            </Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* Low Risk Members */}
                                <Card.Root 
                                    bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                    border="none"
                                    borderRadius="xl"
                                    shadow="md"
                                    _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                                    transition="all 0.3s ease"
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Box 
                                        position="absolute" 
                                        top="0" 
                                        right="0" 
                                        w="16" 
                                        h="16" 
                                        bg="whiteAlpha.200" 
                                        borderRadius="full" 
                                        transform="translate(6px, -6px)"
                                    />
                                    <Card.Body p={5}>
                                        <VStack gap={3} align="center">
                                            <Box p={2} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                                                <Target size={20} color="white" />
                                            </Box>
                                            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="black" color="white" lineHeight="1" letterSpacing="tight">
                                                {teamMembers.filter(m => m.attritionRisk === 'Low').length}
                                            </Text>
                                            <Text fontSize={{ base: "xs", md: "sm" }} color="white" textAlign="center" fontWeight="semibold" letterSpacing="wide">
                                                Low Risk Members
                                            </Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* Medium Risk Members */}
                                <Card.Root 
                                    bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                    border="none"
                                    borderRadius="xl"
                                    shadow="md"
                                    _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                                    transition="all 0.3s ease"
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Box 
                                        position="absolute" 
                                        top="0" 
                                        right="0" 
                                        w="16" 
                                        h="16" 
                                        bg="whiteAlpha.200" 
                                        borderRadius="full" 
                                        transform="translate(6px, -6px)"
                                    />
                                    <Card.Body p={5}>
                                        <VStack gap={3} align="center">
                                            <Box p={2} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                                                <TrendingUp size={20} color="white" />
                                            </Box>
                                            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="black" color="white" lineHeight="1" letterSpacing="tight">
                                                {teamMembers.filter(m => m.attritionRisk === 'Medium').length}
                                            </Text>
                                            <Text fontSize={{ base: "xs", md: "sm" }} color="white" textAlign="center" fontWeight="semibold" letterSpacing="wide">
                                                Medium Risk Members
                                            </Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* High Risk Members */}
                                <Card.Root 
                                    bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                    border="none"
                                    borderRadius="xl"
                                    shadow="md"
                                    _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                                    transition="all 0.3s ease"
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Box 
                                        position="absolute" 
                                        top="0" 
                                        right="0" 
                                        w="16" 
                                        h="16" 
                                        bg="whiteAlpha.200" 
                                        borderRadius="full" 
                                        transform="translate(6px, -6px)"
                                    />
                                    <Card.Body p={5}>
                                        <VStack gap={3} align="center">
                                            <Box p={2} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                                                <AlertTriangle size={20} color="white" />
                                            </Box>
                                            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="black" color="white" lineHeight="1" letterSpacing="tight">
                                                {teamMembers.filter(m => m.attritionRisk === 'High').length}
                                            </Text>
                                            <Text fontSize={{ base: "xs", md: "sm" }} color="white" textAlign="center" fontWeight="semibold" letterSpacing="wide">
                                                High Risk Members
                                            </Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            </SimpleGrid>
                    </VStack>
                </Box>
        </AppLayout>
    );
}
