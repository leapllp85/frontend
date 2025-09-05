'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Textarea
} from '@chakra-ui/react';
import { FileText, Plus, Calendar, Users, BarChart3, Trash2 } from 'lucide-react';
import { surveyApi, Survey, SurveyQuestion } from '@/services';
import { RequireSurveyView, RequireSurveyCreate, RequireSurveyDelete, ManagerOnly, AssociateOnly } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';
import { formatDate } from '@/utils/date';

export default function SurveysPage() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSurvey, setNewSurvey] = useState<{ title: string; description: string; status: 'draft' | 'active' | 'closed' }>({ 
        title: '', 
        description: '', 
        status: 'draft' 
    });
    const [summary, setSummary] = useState({
        total_available: 0,
        team_surveys: 0,
        organization_surveys: 0,
        completed: 0,
        pending: 0,
        high_priority: 0
    });

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setLoading(true);
                const surveysData = await surveyApi.getSurveys();
                // @ts-ignore
                setSurveys(surveysData.surveys);
                // @ts-ignore
                setSummary(surveysData.summary);
                setError(null);
            } catch (err) {
                console.error('Error fetching surveys:', err);
                setError('Failed to load surveys. Please try again.');
                setSurveys([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    const handleCreateSurvey = async () => {
        if (!newSurvey.title.trim() || !newSurvey.description.trim()) {
            return;
        }

        try {
            const createdSurvey = await surveyApi.createSurvey({
                title: newSurvey.title,
                description: newSurvey.description,
                status: newSurvey.status
            });
            setSurveys(prev => [createdSurvey, ...prev]);
            setNewSurvey({ title: '', description: '', status: 'draft' });
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error creating survey:', err);
        }
    };

    const handleStatusChange = async (id: number, newStatus: 'draft' | 'active' | 'closed') => {
        try {
            await surveyApi.updateSurvey(id, { status: newStatus });
            setSurveys(prev => prev.map(survey => 
                survey.id === id ? { ...survey, status: newStatus } : survey
            ));
        } catch (err) {
            console.error('Error updating survey status:', err);
        }
    };

    const handleDeleteSurvey = async (id: number) => {
        try {
            await surveyApi.deleteSurvey(id);
            setSurveys(prev => prev.filter(survey => survey.id !== id));
        } catch (err) {
            console.error('Error deleting survey:', err);
        }
    };

    // Manager: View survey statistics and non-responders
    const handleViewSurveyStats = (surveyId: number) => {
        console.log('Navigating to survey stats for survey:', surveyId);
        router.push(`/surveys/view/${surveyId}`);
    };

    // Associate: Submit survey response
    const handleSubmitSurvey = (surveyId: number) => {
        console.log('Navigating to survey submission for survey:', surveyId);
        router.push(`/surveys/submit/${surveyId}`);
    };

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

    // Analytics
    const activeSurveys = summary.total_available;
    const completedSurveys = summary.completed;
    const draftSurveys = summary.pending;
    const totalResponses = summary.high_priority;

    if (loading) {
        return (
            <AppLayout>
                <Flex justify="center" align="center" minH="60vh">
                    <VStack gap={4}>
                        <Spinner size="xl" color="purple.500" />
                        <Text color="gray.600" fontSize="lg">
                            Loading surveys...
                        </Text>
                    </VStack>
                </Flex>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
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
            </AppLayout>
        );
    }

    return (
        <AppLayout>
                {/* Header */}
                {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack align="start" gap={2}>
                        <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="bold">
                            Employee Surveys
                        </Heading>
                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                            Create and manage employee surveys and feedback
                        </Text>
                    </VStack>
                </Box> */}

                {/* Content */}
                <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack gap={8} align="stretch" w="full">

                {/* Analytics Cards */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="green.100" borderRadius="lg">
                                    <FileText size={20} color="#16a34a" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Active Surveys
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="green.600">
                                {activeSurveys}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="blue.100" borderRadius="lg">
                                    <BarChart3 size={20} color="#3182ce" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Completed
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                                {completedSurveys}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="gray.100" borderRadius="lg">
                                    <FileText size={20} color="#6b7280" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Drafts
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="gray.600">
                                {draftSurveys}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="purple.100" borderRadius="lg">
                                    <Users size={20} color="#9333ea" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Total Responses
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                                {totalResponses}
                            </Text>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* Create Survey Button */}
                <RequireSurveyCreate>
                    <Box>
                        <Button 
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            colorPalette="purple"
                            size="lg"
                        >
                            <Plus size={20} />
                            Create New Survey
                        </Button>
                    </Box>
                </RequireSurveyCreate>

                {/* Create Form */}
                <RequireSurveyCreate>
                    {showCreateForm && (
                    <Card.Root bg="white" shadow="md" borderRadius="xl">
                        <Card.Header p={6}>
                            <Heading size="lg" color="gray.800">
                                Create New Survey
                            </Heading>
                        </Card.Header>
                        <Card.Body p={6}>
                            <VStack gap={4} align="stretch">
                                <Box>
                                    <Text fontWeight="semibold" mb={2}>Survey Title</Text>
                                    <Input
                                        value={newSurvey.title}
                                        onChange={(e) => setNewSurvey(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter survey title"
                                    />
                                </Box>
                                <Box>
                                    <Text fontWeight="semibold" mb={2}>Description</Text>
                                    <Textarea
                                        value={newSurvey.description}
                                        onChange={(e) => setNewSurvey(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe the purpose of this survey"
                                        rows={4}
                                    />
                                </Box>
                                <Box>
                                    <Text fontWeight="semibold" mb={2}>Status</Text>
                                    <select
                                        value={newSurvey.status}
                                        onChange={(e) => setNewSurvey(prev => ({ ...prev, status: e.target.value as 'draft' | 'active' | 'closed' }))}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="closed">Completed</option>
                                    </select>
                                </Box>
                                <HStack gap={4}>
                                    <Button 
                                        onClick={handleCreateSurvey}
                                        colorPalette="purple"
                                        disabled={!newSurvey.title.trim() || !newSurvey.description.trim()}
                                    >
                                        Create Survey
                                    </Button>
                                    <Button 
                                        onClick={() => setShowCreateForm(false)}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </HStack>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                    )}
                </RequireSurveyCreate>

                {/* Surveys List */}
                <Card.Root bg="white" shadow="md" borderRadius="xl">
                    <Card.Header p={6}>
                        <Heading size="lg" color="gray.800">
                            All Surveys
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Manage your employee surveys and feedback
                        </Text>
                    </Card.Header>
                    <Card.Body p={6}>
                        <VStack gap={4} align="stretch">
                            {surveys.length === 0 ? (
                                <Box textAlign="center" py={8}>
                                    <Text color="gray.500" fontSize="lg">
                                        No surveys found. Create your first survey to get started.
                                    </Text>
                                </Box>
                            ) : (
                                surveys.map((survey) => (
                                    <Card.Root key={survey.id} bg="gray.50" borderRadius="lg">
                                        <Card.Body p={4}>
                                            <HStack justify="space-between" align="start">
                                                <VStack align="start" gap={2} flex="1">
                                                    <HStack gap={2}>
                                                        <Heading size="md" color="gray.800">
                                                            {survey.title}
                                                        </Heading>
                                                    </HStack>
                                                    <Text color="gray.600" fontSize="sm">
                                                        {survey.description}
                                                    </Text>
                                                    <HStack gap={4} fontSize="xs" color="gray.500">
                                                        <HStack gap={1}>
                                                            <Calendar size={14} />
                                                            <Text>Created: {formatDate(survey.created_at)}</Text>
                                                        </HStack>
                                                        <HStack gap={1}>
                                                            <Users size={14} />
                                                            <Text>{survey.responses_count} responses</Text>
                                                        </HStack>
                                                    </HStack>
                                                </VStack>
                                                <HStack gap={2}>
                                                    {/* <select
                                                        value={survey.status}
                                                        onChange={(e) => handleStatusChange(survey.id, e.target.value as 'draft' | 'active' | 'closed')}
                                                        style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #e2e8f0',
                                                            // backgroundColor: 'white',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <option value="draft">Draft</option>
                                                        <option value="active">Active</option>
                                                        <option value="closed">Completed</option>
                                                    </select> */}
                                                    {/* Role-based survey action buttons */}
                                                    <ManagerOnly>
                                                        <Button
                                                            size="sm"
                                                            colorPalette="blue"
                                                            variant="solid"
                                                            onClick={() => handleViewSurveyStats(survey.id)}
                                                        >
                                                            <BarChart3 size={16} />
                                                            View Survey
                                                        </Button>
                                                    </ManagerOnly>
                                                    <AssociateOnly>
                                                        <Button
                                                            size="sm"
                                                            colorPalette="green"
                                                            variant="solid"
                                                            onClick={() => handleSubmitSurvey(survey.id)}
                                                        >
                                                            <FileText size={16} />
                                                            Submit Survey
                                                        </Button>
                                                    </AssociateOnly>
                                                    <RequireSurveyDelete>
                                                        <Button
                                                            size="sm"
                                                            colorPalette="red"
                                                            variant="outline"
                                                            onClick={() => handleDeleteSurvey(survey.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </Button>
                                                    </RequireSurveyDelete>
                                                </HStack>
                                            </HStack>
                                        </Card.Body>
                                    </Card.Root>
                                ))
                            )}
                        </VStack>
                    </Card.Body>
                </Card.Root>
                    </VStack>
                </Box>
        </AppLayout>
    );
}
