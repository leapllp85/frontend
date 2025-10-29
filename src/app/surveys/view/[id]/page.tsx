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
import { surveyApi, Survey, apiService } from '@/services';
import { RequireTeamManagement } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';

interface ApiResponse {
    survey: {
        id: number;
        title: string;
        description: string;
        created_at: string;
        ui_status: string;
        completion_rate: number;
        survey_type?: string;
        end_date?: string;
    };
    statistics: {
        total_responses: number;
        completed_responses: number;
        pending_responses: number;
    };
    questions_stats: Array<{
        id: number;
        question_text: string;
        question_type: string;
        total_answers: number;
        answer_distribution: {
            [key: string]: {
                count: number;
                percentage: number;
            };
        };
    }>;
    pending_members: Array<{
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
    
    const [apiData, setApiData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                setLoading(true);
                // Fetch survey management details from API
                const response = await apiService.get<ApiResponse>(`/survey-management/${surveyId}/details/`);
                setApiData(response);
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
            case 'active': return 'green';
            case 'pending': return 'yellow';
            case 'closed': return 'gray';
            case 'completed': return 'gray';
            case 'draft': return 'yellow';
            default: return 'green';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'pending': return 'Pending';
            case 'closed': return 'Closed';
            case 'completed': return 'Completed';
            case 'draft': return 'Draft';
            default: return 'Active';
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

    if (error || !apiData) {
        return (
            <Box p={8} textAlign="center">
                <Text color="red.500" fontSize="lg">{error || 'Survey not found'}</Text>
                <Button mt={4} onClick={() => router.push('/surveys')}>
                    Back to Surveys
                </Button>
            </Box>
        );
    }

    const { survey, statistics, questions_stats, pending_members } = apiData;

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
                                        <Badge colorPalette={getStatusColor(survey.ui_status)} size="sm">
                                            {getStatusLabel(survey.ui_status)}
                                        </Badge>
                                        <HStack gap={1} color="gray.500" fontSize="sm">
                                            <Clock size={14} />
                                            <Text color="gray.500">Created: {survey.created_at ? new Date(survey.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'Unknown'}</Text>
                                        </HStack>
                                    </HStack>
                                </VStack>
                                <VStack align="end" gap={2}>
                                    <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                                        {survey.completion_rate || 
                                         (statistics.total_responses > 0 ? 
                                          Math.round((statistics.completed_responses / statistics.total_responses) * 100) : 0)
                                        }%
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
                                        {statistics.total_responses}
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
                                        {statistics.pending_responses}
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
                                        {questions_stats.length}
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
                                {questions_stats.map((questionStat, index) => (
                                    <Box key={questionStat.id || index}>
                                        <HStack justify="space-between" mb={4}>
                                            <Text fontWeight="semibold" color="gray.700">
                                                {questionStat.question_text}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {questionStat.total_answers} responses
                                            </Text>
                                        </HStack>
                                        {questionStat.question_type === 'text' ? (
                                            <Box p={6} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                                                <VStack gap={3}>
                                                    <HStack gap={2}>
                                                        <Text fontSize="sm" color="blue.700" fontWeight="medium">
                                                            📝 Text Question
                                                        </Text>
                                                        <Badge colorPalette="blue" size="sm">
                                                            {questionStat.total_answers} written responses
                                                        </Badge>
                                                    </HStack>
                                                    {questionStat.total_answers === 0 ? (
                                                        <Text fontSize="sm" color="gray.600" textAlign="center">
                                                            No responses yet. Encourage team members to share their thoughts!
                                                        </Text>
                                                    ) : (
                                                        <Text fontSize="sm" color="blue.700" textAlign="center">
                                                            {questionStat.total_answers} team member{questionStat.total_answers !== 1 ? 's' : ''} provided written feedback. 
                                                            Individual responses are available for detailed review.
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </Box>
                                        ) : (
                                            <VStack gap={3} align="stretch">
                                                {Object.entries(questionStat.answer_distribution).map(([option, data]) => (
                                                    <HStack key={option} justify="space-between">
                                                        <HStack flex="1">
                                                            <Text minW="120px" fontSize="sm" color="gray.700">
                                                                {questionStat.question_type === 'rating' ? 
                                                                    `${option} Star${option !== '1' ? 's' : ''}` : 
                                                                    option
                                                                }
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
                                                                    width={`${data.percentage}%`}
                                                                    borderRadius="full"
                                                                    transition="width 0.3s ease"
                                                                />
                                                            </Box>
                                                        </HStack>
                                                        <HStack gap={4} minW="100px" justify="end">
                                                            <Text fontSize="sm" color="gray.600">
                                                                {data.count} ({data.percentage}%)
                                                            </Text>
                                                        </HStack>
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        )}
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
                                    {pending_members.length} pending
                                </Badge>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={6}>
                            {pending_members.length === 0 ? (
                                <Box textAlign="center" py={8}>
                                    <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto' }} />
                                    <Text color="green.600" fontSize="lg" mt={4}>
                                        All team members have responded!
                                    </Text>
                                </Box>
                            ) : (
                                <VStack gap={4} align="stretch">
                                    {pending_members.map((member) => (
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
                                                    <Text fontWeight="semibold" color="gray.800">{member.name}</Text>
                                                    <Text fontSize="sm" color="gray.600">{member.email}</Text>
                                                </VStack>
                                            </HStack>
                                            <VStack align="end" gap={0}>
                                                <Text fontSize="sm" color="gray.600">{member.department}</Text>
                                                <HStack gap={1} color="orange.600">
                                                    <AlertCircle size={14} />
                                                    <Text fontSize="xs" color="orange.600">Pending</Text>
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
