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
import { FileText, Plus, Calendar, Users, BarChart3, Trash2, X } from 'lucide-react';
import { surveyApi, Survey, SurveyQuestion } from '@/services';
import { RequireSurveyView, RequireSurveyCreate, RequireSurveyDelete, ManagerOnly, AssociateOnly } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';
import { formatDate } from '@/utils/date';

// Helper function to get current datetime in datetime-local format
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to get next day same time
const getNextDayDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function SurveysPage() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const currentDateTime = getCurrentDateTime();
    const [newSurvey, setNewSurvey] = useState({
        title: '',
        description: '',
        survey_type: 'satisfaction' as 'wellness' | 'feedback' | 'satisfaction' | 'skills' | 'goals' | 'engagement' | 'leadership' | 'project_feedback',
        start_date: currentDateTime,
        end_date: getNextDayDateTime(currentDateTime),
        target_audience: 'team_only' as 'all_employees' | 'team_only' | 'by_department' | 'by_role' | 'by_risk_level' | 'custom_selection',
        target_roles: [] as string[],
        target_risk_levels: [] as string[],
        target_employees: [] as number[],
        target_departments: [] as string[],
        is_anonymous: false,
        questions: [] as { question_text: string; question_type: 'text' | 'rating' | 'choice' | 'boolean' | 'scale'; choices?: string[]; is_required: boolean }[]
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
                
                // Try to get survey management data for managers first
                try {
                    const managementData = await surveyApi.getSurveyManagement();
                    // @ts-ignore
                    setSurveys(managementData.surveys || managementData);
                    // @ts-ignore
                    setSummary(managementData.summary || {
                        total_available: managementData.length || 0,
                        team_surveys: 0,
                        organization_surveys: 0,
                        completed: 0,
                        pending: 0,
                        high_priority: 0
                    });
                } catch (managementErr) {
                    // If survey management fails (not a manager), fall back to regular surveys
                    console.log('Not a manager, fetching regular surveys');
                    const surveysData = await surveyApi.getSurveys();
                    // @ts-ignore
                    setSurveys(surveysData.surveys || surveysData);
                    // @ts-ignore
                    setSummary(surveysData.summary || {
                        total_available: Array.isArray(surveysData) ? surveysData.length : 0,
                        team_surveys: 0,
                        organization_surveys: 0,
                        completed: 0,
                        pending: 0,
                        high_priority: 0
                    });
                }
                
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
        if (!newSurvey.title.trim() || !newSurvey.description.trim() || !newSurvey.start_date || !newSurvey.end_date || newSurvey.questions.length === 0) {
            return;
        }

        try {
            const surveyData = {
                title: newSurvey.title,
                description: newSurvey.description,
                survey_type: newSurvey.survey_type,
                start_date: new Date(newSurvey.start_date).toISOString(),
                end_date: new Date(newSurvey.end_date).toISOString(),
                target_audience: newSurvey.target_audience,
                ...(newSurvey.target_roles.length > 0 && { target_roles: newSurvey.target_roles }),
                ...(newSurvey.target_risk_levels.length > 0 && { target_risk_levels: newSurvey.target_risk_levels }),
                ...(newSurvey.target_employees.length > 0 && { target_employees: newSurvey.target_employees }),
                ...(newSurvey.target_departments.length > 0 && { target_departments: newSurvey.target_departments }),
                is_anonymous: newSurvey.is_anonymous,
                questions: newSurvey.questions
            };

            const response = await surveyApi.createSurvey(surveyData);
            console.log('Survey created successfully:', response);
            
            // Refresh surveys list
            try {
                const managementData = await surveyApi.getSurveyManagement();
                // @ts-ignore
                setSurveys(managementData.surveys || managementData);
            } catch (managementErr) {
                const surveysData = await surveyApi.getSurveys();
                // @ts-ignore
                setSurveys(surveysData.surveys || surveysData);
            }
            
            // Reset form
            const resetDateTime = getCurrentDateTime();
            setNewSurvey({
                title: '',
                description: '',
                survey_type: 'satisfaction',
                start_date: resetDateTime,
                end_date: getNextDayDateTime(resetDateTime),
                target_audience: 'team_only',
                target_roles: [],
                target_risk_levels: [],
                target_employees: [],
                target_departments: [],
                is_anonymous: false,
                questions: []
            });
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
                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
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

                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
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

                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
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

                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
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
                            onClick={() => router.push('/surveys/create')}
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
                    <Card.Root 
                        bg="white" 
                        shadow="xl" 
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="gray.200"
                        _hover={{ shadow: "2xl" }}
                        transition="all 0.3s ease"
                    >
                        <Card.Header bg="gradient-to-r from-purple.50 to-blue.50" borderTopRadius="xl" px={6}>
                            <HStack justify="space-between" align="center">
                                <VStack align="start" gap={1}>
                                    <Heading size="lg" color="gray.800" fontWeight="bold">
                                        Create New Survey
                                    </Heading>
                                    <Text color="gray.600" fontSize="sm">
                                        Design and deploy employee feedback surveys
                                    </Text>
                                </VStack>
                                <Box p={3} bg="purple.100" borderRadius="full">
                                    <FileText size={24} color="#9333ea" />
                                </Box>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={8}>
                            <VStack gap={6} align="stretch">
                                {/* Survey Title */}
                                <Box>
                                    <Text 
                                        fontWeight="semibold" 
                                        mb={3} 
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Survey Title *
                                    </Text>
                                    <Input
                                        value={newSurvey.title}
                                        onChange={(e) => setNewSurvey(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g., Employee Satisfaction Survey Q4 2024"
                                        size="lg"
                                        bg="white"
                                        color="gray.800"
                                        border="2px solid"
                                        borderColor="gray.200"
                                        _focus={{
                                            borderColor: "purple.400",
                                            boxShadow: "0 0 0 1px #9333ea"
                                        }}
                                        _hover={{ borderColor: "gray.300" }}
                                        _placeholder={{ color: "gray.400" }}
                                        borderRadius="lg"
                                    />
                                </Box>

                                {/* Description */}
                                <Box>
                                    <Text 
                                        fontWeight="semibold" 
                                        mb={3} 
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Description *
                                    </Text>
                                    <Textarea
                                        value={newSurvey.description}
                                        onChange={(e) => setNewSurvey(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe the purpose and objectives of this survey. What insights are you looking to gather?"
                                        rows={4}
                                        bg="white"
                                        color="gray.800"
                                        border="2px solid"
                                        borderColor="gray.200"
                                        _focus={{
                                            borderColor: "purple.400",
                                            boxShadow: "0 0 0 1px #9333ea"
                                        }}
                                        _hover={{ borderColor: "gray.300" }}
                                        _placeholder={{ color: "gray.400" }}
                                        borderRadius="lg"
                                        resize="vertical"
                                    />
                                </Box>

                                {/* Survey Type */}
                                <Box>
                                    <Text 
                                        fontWeight="semibold" 
                                        mb={3} 
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Survey Type *
                                    </Text>
                                    <Box position="relative">
                                        <select
                                            value={newSurvey.survey_type}
                                            onChange={(e) => setNewSurvey(prev => ({ ...prev, survey_type: e.target.value as any }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '2px solid #e2e8f0',
                                                backgroundColor: 'white',
                                                fontSize: '16px',
                                                color: '#374151',
                                                outline: 'none',
                                                appearance: 'none',
                                                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                backgroundPosition: 'right 12px center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '16px'
                                            }}
                                        >
                                            <option value="wellness">🧘 Wellness - Mental health & wellbeing</option>
                                            <option value="feedback">💬 Feedback - General feedback collection</option>
                                            <option value="satisfaction">😊 Satisfaction - Employee satisfaction</option>
                                            <option value="skills">🎯 Skills - Skills assessment & development</option>
                                            <option value="goals">🚀 Goals - Career goals & aspirations</option>
                                            <option value="engagement">🤝 Engagement - Employee engagement</option>
                                            <option value="leadership">👑 Leadership - Leadership assessment</option>
                                            <option value="project_feedback">📋 Project Feedback - Project-specific feedback</option>
                                        </select>
                                    </Box>
                                </Box>

                                {/* Date Range */}
                                <HStack gap={6} align="start">
                                    <Box flex="1">
                                        <Text 
                                            color="gray.700" 
                                            fontWeight="semibold" 
                                            fontSize="sm"
                                            mb={3}
                                        >
                                            Start Date & Time *
                                        </Text>
                                        <Box position="relative" w="full">
                                            <Input
                                                type="datetime-local"
                                                value={newSurvey.start_date}
                                                onChange={(e) => setNewSurvey(prev => ({ 
                                                    ...prev, 
                                                    start_date: e.target.value,
                                                    end_date: getNextDayDateTime(e.target.value)
                                                }))}
                                                bg="white"
                                                border="1px solid"
                                                borderColor="gray.300"
                                                color="gray.800"
                                                _focus={{
                                                    borderColor: "#a5489f",
                                                    bg: "white",
                                                    boxShadow: "0 0 0 1px #a5489f"
                                                }}
                                                size="lg"
                                                placeholder="Select start date and time"
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
                                    </Box>
                                    <Box flex="1">
                                        <Text 
                                            color="gray.700" 
                                            fontWeight="semibold" 
                                            fontSize="sm"
                                            mb={3}
                                        >
                                            End Date & Time *
                                        </Text>
                                        <Box position="relative" w="full">
                                            <Input
                                                type="datetime-local"
                                                value={newSurvey.end_date}
                                                onChange={(e) => setNewSurvey(prev => ({ ...prev, end_date: e.target.value }))}
                                                bg="white"
                                                border="1px solid"
                                                borderColor="gray.300"
                                                color="gray.800"
                                                _focus={{
                                                    borderColor: "#a5489f",
                                                    bg: "white",
                                                    boxShadow: "0 0 0 1px #a5489f"
                                                }}
                                                size="lg"
                                                placeholder="Select end date and time"
                                                min={newSurvey.start_date || undefined}
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
                                    </Box>
                                </HStack>

                                {/* Target Audience */}
                                <Box>
                                    <Text 
                                        fontWeight="semibold" 
                                        mb={3} 
                                        color="gray.700"
                                        fontSize="sm"
                                    >
                                        Target Audience *
                                    </Text>
                                    <Box position="relative">
                                        <select
                                            value={newSurvey.target_audience}
                                            onChange={(e) => setNewSurvey(prev => ({ ...prev, target_audience: e.target.value as any }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '2px solid #e2e8f0',
                                                backgroundColor: 'white',
                                                fontSize: '16px',
                                                color: '#374151',
                                                outline: 'none',
                                                appearance: 'none',
                                                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                backgroundPosition: 'right 12px center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '16px'
                                            }}
                                        >
                                            <option value="team_only">👥 My Team - Direct team members only</option>
                                            <option value="all_employees">🌐 All Employees - Company-wide survey</option>
                                            <option value="by_role">🎭 By Role - Target specific roles</option>
                                            <option value="by_risk_level">⚠️ By Risk Level - Target by employee risk</option>
                                            <option value="by_department">🏢 By Department - Target departments</option>
                                            <option value="custom_selection">🎯 Custom - Select specific employees</option>
                                        </select>
                                    </Box>
                                </Box>

                                {/* Anonymous Option */}
                                <Box>
                                    <HStack gap={3}>
                                        <input
                                            type="checkbox"
                                            checked={newSurvey.is_anonymous}
                                            onChange={(e) => setNewSurvey(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                                            Anonymous Survey
                                        </Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500" mt={2}>
                                        Anonymous surveys encourage honest feedback but limit follow-up capabilities
                                    </Text>
                                </Box>

                                {/* Questions Section */}
                                <Box>
                                    <HStack justify="space-between" align="center" mb={4}>
                                        <Text 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                        >
                                            Survey Questions * ({newSurvey.questions.length})
                                        </Text>
                                        <Button
                                            size="sm"
                                            colorPalette="blue"
                                            variant="outline"
                                            onClick={() => {
                                                setNewSurvey(prev => ({
                                                    ...prev,
                                                    questions: [...prev.questions, {
                                                        question_text: '',
                                                        question_type: 'text',
                                                        is_required: true,
                                                        choices: []
                                                    }]
                                                }));
                                            }}
                                        >
                                            <Plus size={16} />
                                            Add Question
                                        </Button>
                                    </HStack>

                                    {newSurvey.questions.length === 0 ? (
                                        <Box 
                                            p={6} 
                                            border="2px dashed" 
                                            borderColor="gray.300" 
                                            borderRadius="lg" 
                                            textAlign="center"
                                            bg="gray.50"
                                        >
                                            <Text color="gray.500" fontSize="sm">
                                                No questions added yet. Click "Add Question" to start building your survey.
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack gap={4} align="stretch">
                                            {newSurvey.questions.map((question, index) => (
                                                <Box 
                                                    key={index}
                                                    p={4} 
                                                    border="1px solid" 
                                                    borderColor="gray.200" 
                                                    borderRadius="lg"
                                                    bg="gray.50"
                                                >
                                                    <VStack gap={3} align="stretch">
                                                        <HStack justify="space-between" align="start">
                                                            <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                                                                Question {index + 1}
                                                            </Text>
                                                            <Button
                                                                size="xs"
                                                                colorPalette="red"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setNewSurvey(prev => ({
                                                                        ...prev,
                                                                        questions: prev.questions.filter((_, i) => i !== index)
                                                                    }));
                                                                }}
                                                            >
                                                                <X size={14} />
                                                            </Button>
                                                        </HStack>

                                                        <Input
                                                            placeholder="Enter your question..."
                                                            value={question.question_text}
                                                            onChange={(e) => {
                                                                setNewSurvey(prev => ({
                                                                    ...prev,
                                                                    questions: prev.questions.map((q, i) => 
                                                                        i === index ? { ...q, question_text: e.target.value } : q
                                                                    )
                                                                }));
                                                            }}
                                                            bg="white"
                                                            color="gray.800"
                                                            _placeholder={{ color: "gray.400" }}
                                                        />

                                                        <HStack gap={4}>
                                                            <Box flex="1">
                                                                <select
                                                                    value={question.question_type}
                                                                    onChange={(e) => {
                                                                        setNewSurvey(prev => ({
                                                                            ...prev,
                                                                            questions: prev.questions.map((q, i) => 
                                                                                i === index ? { 
                                                                                    ...q, 
                                                                                    question_type: e.target.value as any,
                                                                                    choices: e.target.value === 'choice' ? [''] : []
                                                                                } : q
                                                                            )
                                                                        }));
                                                                    }}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px 12px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #e2e8f0',
                                                                        backgroundColor: 'white',
                                                                        fontSize: '14px'
                                                                    }}
                                                                >
                                                                    <option value="text">📝 Text Response</option>
                                                                    <option value="rating">⭐ Rating (1-5)</option>
                                                                    <option value="choice">☑️ Multiple Choice</option>
                                                                    <option value="boolean">✅ Yes/No</option>
                                                                    <option value="scale">📊 Scale (1-10)</option>
                                                                </select>
                                                            </Box>
                                                            <HStack gap={2}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={question.is_required}
                                                                    onChange={(e) => {
                                                                        setNewSurvey(prev => ({
                                                                            ...prev,
                                                                            questions: prev.questions.map((q, i) => 
                                                                                i === index ? { ...q, is_required: e.target.checked } : q
                                                                            )
                                                                        }));
                                                                    }}
                                                                />
                                                                <Text fontSize="sm" color="gray.600">Required</Text>
                                                            </HStack>
                                                        </HStack>

                                                        {question.question_type === 'choice' && (
                                                            <Box>
                                                                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                                                    Answer Choices:
                                                                </Text>
                                                                <VStack gap={2} align="stretch">
                                                                    {question.choices?.map((choice, choiceIndex) => (
                                                                        <HStack key={choiceIndex} gap={2}>
                                                                            <Input
                                                                                placeholder={`Choice ${choiceIndex + 1}`}
                                                                                value={choice}
                                                                                onChange={(e) => {
                                                                                    setNewSurvey(prev => ({
                                                                                        ...prev,
                                                                                        questions: prev.questions.map((q, i) => 
                                                                                            i === index ? {
                                                                                                ...q,
                                                                                                choices: q.choices?.map((c, ci) => 
                                                                                                    ci === choiceIndex ? e.target.value : c
                                                                                                )
                                                                                            } : q
                                                                                        )
                                                                                    }));
                                                                                }}
                                                                                bg="white"
                                                                                color="gray.800"
                                                                                _placeholder={{ color: "gray.400" }}
                                                                                size="sm"
                                                                            />
                                                                            <Button
                                                                                size="sm"
                                                                                colorPalette="red"
                                                                                variant="ghost"
                                                                                onClick={() => {
                                                                                    setNewSurvey(prev => ({
                                                                                        ...prev,
                                                                                        questions: prev.questions.map((q, i) => 
                                                                                            i === index ? {
                                                                                                ...q,
                                                                                                choices: q.choices?.filter((_, ci) => ci !== choiceIndex)
                                                                                            } : q
                                                                                        )
                                                                                    }));
                                                                                }}
                                                                            >
                                                                                <X size={14} />
                                                                            </Button>
                                                                        </HStack>
                                                                    ))}
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setNewSurvey(prev => ({
                                                                                ...prev,
                                                                                questions: prev.questions.map((q, i) => 
                                                                                    i === index ? {
                                                                                        ...q,
                                                                                        choices: [...(q.choices || []), '']
                                                                                    } : q
                                                                                )
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <Plus size={14} />
                                                                        Add Choice
                                                                    </Button>
                                                                </VStack>
                                                            </Box>
                                                        )}
                                                    </VStack>
                                                </Box>
                                            ))}
                                        </VStack>
                                    )}
                                </Box>

                                {/* Action Buttons */}
                                <Box pt={4} borderTop="1px solid" borderColor="gray.100">
                                    <HStack gap={4} justify="end">
                                        <Button 
                                            onClick={() => setShowCreateForm(false)}
                                            variant="outline"
                                            size="lg"
                                            borderColor="gray.300"
                                            color="gray.600"
                                            _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                                            px={6}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleCreateSurvey}
                                            colorPalette="purple"
                                            size="lg"
                                            disabled={!newSurvey.title.trim() || !newSurvey.description.trim() || !newSurvey.start_date || !newSurvey.end_date || newSurvey.questions.length === 0}
                                            _hover={{ 
                                                transform: "translateY(-2px)", 
                                                shadow: "lg" 
                                            }}
                                            transition="all 0.2s ease"
                                            px={8}
                                        >
                                            <Plus size={20} />
                                            Publish Survey
                                        </Button>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                    )}
                </RequireSurveyCreate>

                {/* Surveys List */}
                <Card.Root bg="white" shadow="sm" borderRadius="xl">
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
                                    <Card.Root key={survey.id} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm">
                                        <Card.Body p={6}>
                                            <HStack justify="space-between" align="start">
                                                <VStack align="start" gap={3} flex="1">
                                                    <HStack justify="space-between" w="full" align="start">
                                                        <VStack align="start" gap={2}>
                                                            <HStack gap={3} align="center">
                                                                <Heading size="md" color="gray.800">
                                                                    {survey.title}
                                                                </Heading>
                                                                <Box
                                                                    px={3}
                                                                    py={1}
                                                                    borderRadius="full"
                                                                    fontSize="xs"
                                                                    fontWeight="semibold"
                                                                    bg={
                                                                        survey.status === 'active' ? 'green.100' :
                                                                        survey.status === 'draft' ? 'yellow.100' :
                                                                        survey.status === 'closed' ? 'gray.100' : 'blue.100'
                                                                    }
                                                                    color={
                                                                        survey.status === 'active' ? 'green.700' :
                                                                        survey.status === 'draft' ? 'yellow.700' :
                                                                        survey.status === 'closed' ? 'gray.700' : 'blue.700'
                                                                    }
                                                                >
                                                                    {survey.status === 'active' ? 'Active' :
                                                                     survey.status === 'draft' ? 'Draft' :
                                                                     survey.status === 'closed' ? 'Closed' : 'Active'}
                                                                </Box>
                                                                {survey.survey_type && (
                                                                    <Box
                                                                        px={2}
                                                                        py={1}
                                                                        borderRadius="md"
                                                                        fontSize="xs"
                                                                        fontWeight="medium"
                                                                        bg="purple.50"
                                                                        color="purple.700"
                                                                        border="1px solid"
                                                                        borderColor="purple.200"
                                                                    >
                                                                        {survey.survey_type === 'wellness' ? '🧘 Wellness' :
                                                                         survey.survey_type === 'feedback' ? '💬 Feedback' :
                                                                         survey.survey_type === 'satisfaction' ? '😊 Satisfaction' :
                                                                         survey.survey_type === 'skills' ? '🎯 Skills' :
                                                                         survey.survey_type === 'goals' ? '🚀 Goals' :
                                                                         survey.survey_type === 'engagement' ? '🤝 Engagement' :
                                                                         survey.survey_type === 'leadership' ? '👑 Leadership' :
                                                                         survey.survey_type === 'project_feedback' ? '📋 Project Feedback' :
                                                                         '📊 Survey'}
                                                                    </Box>
                                                                )}
                                                            </HStack>
                                                            <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                                                                {survey.description}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                    <HStack gap={6} fontSize="sm" color="gray.500" wrap="wrap">
                                                        <HStack gap={2}>
                                                            <Calendar size={16} />
                                                            <Text>Created: {survey.created_at ? new Date(survey.created_at).toLocaleDateString('en-US', { 
                                                                year: 'numeric', 
                                                                month: 'short', 
                                                                day: 'numeric' 
                                                            }) : 'Unknown'}</Text>
                                                        </HStack>
                                                        <HStack gap={2}>
                                                            <Users size={16} />
                                                            <Text>{survey.responses_count || 0} responses</Text>
                                                        </HStack>
                                                        {survey.end_date && (
                                                            <HStack gap={2}>
                                                                <Calendar size={16} />
                                                                <Text>Ends: {new Date(survey.end_date).toLocaleDateString('en-US', { 
                                                                    year: 'numeric', 
                                                                    month: 'short', 
                                                                    day: 'numeric' 
                                                                })}</Text>
                                                            </HStack>
                                                        )}
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
