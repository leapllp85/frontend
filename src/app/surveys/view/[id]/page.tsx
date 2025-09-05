'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    Progress,

    Flex
} from '@chakra-ui/react';
import { ArrowLeft, Users, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { surveyApi, Survey } from '@/services';
import { RequireTeamManagement } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';

interface SurveyStats {
    total_responses: number;
    completion_rate: number;
    question_stats: Array<{
        question: string;
        responses: Array<{
            option: string;
            count: number;
            percentage: number;
        }>;
    }>;
    non_responders: Array<{
        id: number;
        name: string;
        email: string;
        department: string;
    }>;
}

export default function ViewSurveyPage() {
    const params = useParams();
    const router = useRouter();
    const surveyId = parseInt(params.id as string);
    
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [stats, setStats] = useState<SurveyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                setLoading(true);
                // Fetch survey details
                const surveyData = await surveyApi.getSurvey(surveyId);
                setSurvey(surveyData);
                
                // TODO: Fetch survey statistics from API
                // For now, using mock data
                const mockStats: SurveyStats = {
                    total_responses: 12,
                    completion_rate: 75,
                    question_stats: [
                        {
                            question: "How satisfied are you with your current role?",
                            responses: [
                                { option: "Very Satisfied", count: 5, percentage: 42 },
                                { option: "Satisfied", count: 4, percentage: 33 },
                                { option: "Neutral", count: 2, percentage: 17 },
                                { option: "Dissatisfied", count: 1, percentage: 8 }
                            ]
                        },
                        {
                            question: "How would you rate work-life balance?",
                            responses: [
                                { option: "Excellent", count: 3, percentage: 25 },
                                { option: "Good", count: 6, percentage: 50 },
                                { option: "Fair", count: 2, percentage: 17 },
                                { option: "Poor", count: 1, percentage: 8 }
                            ]
                        }
                    ],
                    non_responders: [
                        { id: 1, name: "John Smith", email: "john@company.com", department: "Engineering" },
                        { id: 2, name: "Sarah Wilson", email: "sarah@company.com", department: "Design" },
                        { id: 3, name: "Mike Johnson", email: "mike@company.com", department: "Marketing" },
                        { id: 4, name: "Lisa Brown", email: "lisa@company.com", department: "Sales" }
                    ]
                };
                setStats(mockStats);
                setError(null);
            } catch (err) {
                console.error('Error fetching survey data:', err);
                setError('Failed to load survey data');
            } finally {
                setLoading(false);
            }
        };

        if (surveyId) {
            fetchSurveyData();
        }
    }, [surveyId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'yellow';
            case 'pending': return 'yellow';
            case 'closed': return 'green';
            case 'completed': return 'green';
            case 'draft': return 'gray';
            default: return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'pending': return 'Active';
            case 'closed': return 'Completed';
            case 'completed': return 'Completed';
            case 'draft': return 'Draft';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <Box p={8} textAlign="center">
                <Spinner size="xl" color="purple.500" />
                <Text mt={4} color="gray.600">Loading survey data...</Text>
            </Box>
        );
    }

    if (error || !survey || !stats) {
        return (
            <Box p={8} textAlign="center">
                <Text color="red.500" fontSize="lg">{error || 'Survey not found'}</Text>
                <Button mt={4} onClick={() => router.push('/surveys')}>
                    Back to Surveys
                </Button>
            </Box>
        );
    }

    return (
        <RequireTeamManagement>
            <AppLayout>
                <Box py={8} px={4} maxW="1200px" mx="auto">
                {/* Header */}
                <VStack align="stretch" gap={6}>
                    <HStack justify="space-between" align="start">
                        <HStack gap={4}>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/surveys')}
                                size="sm"
                            >
                                <ArrowLeft size={16} />
                                Back to Surveys
                            </Button>
                        </HStack>
                    </HStack>

                    {/* Survey Info */}
                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Header p={6}>
                            <HStack justify="space-between" align="start">
                                <VStack align="start" gap={2}>
                                    <Heading size="xl" color="gray.800">
                                        {survey.title}
                                    </Heading>
                                    <Text color="gray.600" fontSize="lg">
                                        {survey.description}
                                    </Text>
                                    <HStack gap={4}>
                                        <Badge colorPalette={getStatusColor(survey.status)} size="sm">
                                            {getStatusLabel(survey.status)}
                                        </Badge>
                                        <HStack gap={1} color="gray.500" fontSize="sm">
                                            <Clock size={14} />
                                            <Text>Created: {new Date(survey.created_at).toLocaleDateString()}</Text>
                                        </HStack>
                                    </HStack>
                                </VStack>
                                <VStack align="end" gap={2}>
                                    <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                                        {stats.completion_rate}%
                                    </Text>
                                    <Text color="gray.600" fontSize="sm">Completion Rate</Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                    </Card.Root>

                    {/* Statistics Overview */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                        <Card.Root bg="white" shadow="md" borderRadius="lg">
                            <Card.Body p={6} textAlign="center">
                                <VStack gap={2}>
                                    <CheckCircle size={32} color="#10B981" />
                                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                        {stats.total_responses}
                                    </Text>
                                    <Text color="gray.600">Total Responses</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root bg="white" shadow="md" borderRadius="lg">
                            <Card.Body p={6} textAlign="center">
                                <VStack gap={2}>
                                    <Users size={32} color="#6366F1" />
                                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                                        {stats.non_responders.length}
                                    </Text>
                                    <Text color="gray.600">Pending Responses</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root bg="white" shadow="md" borderRadius="lg">
                            <Card.Body p={6} textAlign="center">
                                <VStack gap={2}>
                                    <BarChart3 size={32} color="#F59E0B" />
                                    <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                                        {stats.question_stats.length}
                                    </Text>
                                    <Text color="gray.600">Questions</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    </SimpleGrid>

                    {/* Question Statistics */}
                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Header p={6}>
                            <Heading size="lg" color="gray.800">Question Statistics</Heading>
                        </Card.Header>
                        <Card.Body p={6}>
                            <VStack gap={8} align="stretch">
                                {stats.question_stats.map((questionStat, index) => (
                                    <Box key={index}>
                                        <Text fontWeight="semibold" mb={4} color="gray.700">
                                            {questionStat.question}
                                        </Text>
                                        <VStack gap={3} align="stretch">
                                            {questionStat.responses.map((response, responseIndex) => (
                                                <HStack key={responseIndex} justify="space-between">
                                                    <HStack flex="1">
                                                        <Text minW="120px" fontSize="sm">
                                                            {response.option}
                                                        </Text>
                                                        <Box
                                                            flex="1"
                                                            bg="gray.200"
                                                            borderRadius="full"
                                                            height="8px"
                                                            overflow="hidden"
                                                        >
                                                            <Box
                                                                bg="purple.500"
                                                                height="100%"
                                                                width={`${response.percentage}%`}
                                                                borderRadius="full"
                                                                transition="width 0.3s ease"
                                                            />
                                                        </Box>
                                                    </HStack>
                                                    <HStack gap={4} minW="100px" justify="end">
                                                        <Text fontSize="sm" color="gray.600">
                                                            {response.count} ({response.percentage}%)
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Box>
                                ))}
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Non-Responders */}
                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Header p={6}>
                            <HStack justify="space-between" align="center">
                                <Heading size="lg" color="gray.800">Team Members - Pending Response</Heading>
                                <Badge colorPalette="orange" size="sm">
                                    {stats.non_responders.length} pending
                                </Badge>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={6}>
                            {stats.non_responders.length === 0 ? (
                                <Box textAlign="center" py={8}>
                                    <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto' }} />
                                    <Text color="green.600" fontSize="lg" mt={4}>
                                        All team members have responded!
                                    </Text>
                                </Box>
                            ) : (
                                <VStack gap={4} align="stretch">
                                    {stats.non_responders.map((member) => (
                                        <HStack key={member.id} p={4} bg="orange.50" borderRadius="lg" justify="space-between">
                                            <HStack gap={3}>
                                                <Box
                                                    width="32px"
                                                    height="32px"
                                                    borderRadius="full"
                                                    bg="purple.500"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    color="white"
                                                    fontSize="sm"
                                                    fontWeight="semibold"
                                                >
                                                    {member.name.charAt(0).toUpperCase()}
                                                </Box>
                                                <VStack align="start" gap={0}>
                                                    <Text fontWeight="semibold">{member.name}</Text>
                                                    <Text fontSize="sm" color="gray.600">{member.email}</Text>
                                                </VStack>
                                            </HStack>
                                            <VStack align="end" gap={0}>
                                                <Text fontSize="sm" color="gray.600">{member.department}</Text>
                                                <HStack gap={1} color="orange.600">
                                                    <AlertCircle size={14} />
                                                    <Text fontSize="xs">Pending</Text>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                    ))}
                                </VStack>
                            )}
                        </Card.Body>
                    </Card.Root>
                </VStack>
                </Box>
            </AppLayout>
        </RequireTeamManagement>
    );
}
