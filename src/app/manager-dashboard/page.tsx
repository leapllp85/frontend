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
    Tabs,
} from '@chakra-ui/react';
import { 
    FileText, 
    Plus, 
    Calendar, 
    Users, 
    BarChart3, 
    Trash2, 
    X, 
    Search, 
    Filter, 
    Eye, 
    CheckCircle, 
    Clock,
    Target,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Activity,
    MessageSquare,
    User,
    Shield,
    Sparkles,
    Download,
    Share2,
    Edit,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Settings,
    Bell,
    ChevronRight,
    Zap,
    Award,
    Briefcase
} from 'lucide-react';
import { 
    surveyApi, 
    Survey, 
    SurveysPaginatedResponse, 
    SurveysQueryParams,
    actionItemApi,
    ActionItem,
    ActionItemsPaginatedResponse,
    ActionItemsQueryParams
} from '@/services';
import { RequireSurveyView, RequireSurveyCreate, ManagerOnly } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';
import { formatDate } from '@/utils/date';
import { Pagination } from '@/components/common/Pagination';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { useResponsive } from '@/hooks/useResponsive';

interface SurveyResponse {
    id: string;
    surveyTitle: string;
    submittedDate: string;
    status: 'pending_review' | 'reviewed' | 'action_taken';
    category: 'wellness' | 'feedback' | 'satisfaction' | 'skills' | 'engagement';
    associateInputs: {
        question: string;
        answer: string;
        type: 'text' | 'rating' | 'choice';
    }[];
    managerResponse?: {
        respondedBy: string;
        respondedDate: string;
        feedback: string;
        actionPlan: string;
        priority: 'low' | 'medium' | 'high';
    };
    summary: {
        concernArea: string;
        keyIssues: string[];
        remediationPlan: string;
        expectedOutcome: string;
        timeline: string;
    };
}

interface EngagementScore {
    month: string;
    associateScore: number;
    managerScore: number;
}

export default function ManagerDashboardPage() {
    const router = useRouter();
    const { itemsToShow } = useResponsive(3, 5);
    const [activeTab, setActiveTab] = useState<'surveys' | 'responses' | 'actions'>('surveys');
    
    // Surveys state
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [surveysLoading, setSurveysLoading] = useState(true);
    const [surveysError, setSurveysError] = useState<string | null>(null);
    const [surveysPage, setSurveysPage] = useState(1);
    const [surveysPageSize, setSurveysPageSize] = useState(10);
    const [surveysTotalCount, setSurveysTotalCount] = useState(0);
    const [surveysHasNext, setSurveysHasNext] = useState(false);
    const [surveysHasPrevious, setSurveysHasPrevious] = useState(false);
    const [surveysSearchQuery, setSurveysSearchQuery] = useState('');
    const [surveysStatusFilter, setSurveysStatusFilter] = useState<string>('');
    
    // Survey Responses state
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [responsesLoading, setResponsesLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [engagementData, setEngagementData] = useState<EngagementScore[]>([]);
    const [hoveredResponse, setHoveredResponse] = useState<SurveyResponse | null>(null);
    
    // Action Items state
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [actionsLoading, setActionsLoading] = useState(true);
    const [actionsError, setActionsError] = useState<string | null>(null);
    const [actionsPage, setActionsPage] = useState(1);
    const [actionsPageSize, setActionsPageSize] = useState(10);
    const [actionsTotalCount, setActionsTotalCount] = useState(0);
    const [actionsHasNext, setActionsHasNext] = useState(false);
    const [actionsHasPrevious, setActionsHasPrevious] = useState(false);
    const [actionsSearchQuery, setActionsSearchQuery] = useState('');
    const [actionsStatusFilter, setActionsStatusFilter] = useState<string>('');
    const [showCreateActionForm, setShowCreateActionForm] = useState(false);
    const [hoveredActionItem, setHoveredActionItem] = useState<ActionItem | null>(null);

    // Fetch Surveys
    const fetchSurveys = async (params?: SurveysQueryParams) => {
        try {
            setSurveysLoading(true);
            const managementData: SurveysPaginatedResponse = await surveyApi.getSurveyManagement(params);
            const surveys = Array.isArray(managementData.results) ? managementData.results : (managementData.results.surveys || []);
            setSurveys(surveys);
            setSurveysTotalCount(managementData.count);
            setSurveysHasNext(!!managementData.next);
            setSurveysHasPrevious(!!managementData.previous);
            setSurveysError(null);
        } catch (err) {
            console.error('Error fetching surveys:', err);
            setSurveysError('Failed to load surveys. Please try again.');
            setSurveys([]);
        } finally {
            setSurveysLoading(false);
        }
    };

    // Fetch Action Items
    const fetchActionItems = async (params?: ActionItemsQueryParams) => {
        try {
            setActionsLoading(true);
            const response: ActionItemsPaginatedResponse = await actionItemApi.getActionItems(params);
            setActionItems(response.results.action_items || []);
            setActionsTotalCount(response.count);
            setActionsHasNext(!!response.next);
            setActionsHasPrevious(!!response.previous);
            setActionsError(null);
        } catch (err) {
            console.error('Error fetching action items:', err);
            setActionsError('Failed to load action items. Please try again.');
            setActionItems([]);
        } finally {
            setActionsLoading(false);
        }
    };

    // Fetch Survey Responses (mock data for now)
    const fetchSurveyResponses = async () => {
        try {
            setResponsesLoading(true);
            // Simulate API call
            setTimeout(() => {
                setEngagementData([
                    { month: 'Jul', associateScore: 65, managerScore: 70 },
                    { month: 'Aug', associateScore: 68, managerScore: 72 },
                    { month: 'Sep', associateScore: 72, managerScore: 75 },
                    { month: 'Oct', associateScore: 78, managerScore: 82 },
                    { month: 'Nov', associateScore: 85, managerScore: 88 },
                ]);

                setResponses([
                    {
                        id: '1',
                        surveyTitle: 'Q4 2024 Wellness Check-in',
                        submittedDate: '2024-10-15',
                        status: 'reviewed',
                        category: 'wellness',
                        associateInputs: [
                            {
                                question: 'How would you rate your current work-life balance?',
                                answer: '2/5 - Struggling with long hours and tight deadlines',
                                type: 'rating'
                            },
                            {
                                question: 'What challenges are you facing that affect your wellbeing?',
                                answer: 'Working late nights frequently due to project deadlines. Finding it difficult to disconnect after work hours.',
                                type: 'text'
                            }
                        ],
                        managerResponse: {
                            respondedBy: 'Sarah Johnson',
                            respondedDate: '2024-10-18',
                            feedback: 'Thank you for sharing your concerns. Your wellbeing is a priority.',
                            actionPlan: '1. Redistributing tasks within the team\n2. Implementing no-meeting Fridays\n3. Stress management workshop',
                            priority: 'high'
                        },
                        summary: {
                            concernArea: 'Work-Life Balance & Stress Management',
                            keyIssues: [
                                'Extended working hours affecting personal time',
                                'High stress levels due to tight deadlines'
                            ],
                            remediationPlan: 'Immediate workload redistribution, flexible scheduling',
                            expectedOutcome: 'Improved work-life balance, reduced stress levels',
                            timeline: '2-4 weeks for initial improvements'
                        }
                    }
                ]);
                setResponsesLoading(false);
            }, 500);
        } catch (err) {
            console.error('Error fetching survey responses:', err);
            setResponsesLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        if (activeTab === 'surveys') {
            const timeoutId = setTimeout(() => {
                fetchSurveys({ 
                    page: surveysPage, 
                    page_size: surveysPageSize,
                    search: surveysSearchQuery || undefined
                });
            }, surveysSearchQuery ? 300 : 0);
            return () => clearTimeout(timeoutId);
        }
    }, [activeTab, surveysPage, surveysPageSize, surveysSearchQuery, surveysStatusFilter]);

    useEffect(() => {
        if (activeTab === 'responses') {
            fetchSurveyResponses();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'actions') {
            const params: ActionItemsQueryParams = {
                page: actionsPage,
                page_size: actionsPageSize
            };
            if (actionsStatusFilter) {
                params.status = actionsStatusFilter;
            }
            fetchActionItems(params);
        }
    }, [activeTab, actionsPage, actionsPageSize, actionsStatusFilter]);

    // Helper functions
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'yellow';
            case 'pending': return 'yellow';
            case 'closed': return 'green';
            case 'completed': return 'green';
            case 'Completed': return 'green';
            case 'Pending': return 'orange';
            case 'draft': return 'gray';
            case 'reviewed': return 'green';
            case 'action_taken': return 'blue';
            case 'pending_review': return 'orange';
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
            case 'reviewed': return 'Reviewed';
            case 'action_taken': return 'Action Taken';
            case 'pending_review': return 'Pending Review';
            default: return status;
        }
    };

    const getSurveyTypeIcon = (type: string) => {
        switch (type) {
            case 'wellness': return '🧘';
            case 'feedback': return '💬';
            case 'satisfaction': return '😊';
            case 'skills': return '🎯';
            case 'goals': return '🚀';
            case 'engagement': return '🤝';
            case 'leadership': return '👑';
            case 'project_feedback': return '📋';
            default: return '📊';
        }
    };

    const handleViewSurveyStats = (surveyId: number) => {
        router.push(`/surveys/view/${surveyId}`);
    };

    const handleDeleteSurvey = async (id: number) => {
        try {
            await surveyApi.deleteSurvey(id);
            setSurveys(prev => prev.filter(survey => survey.id !== id));
        } catch (err) {
            console.error('Error deleting survey:', err);
        }
    };

    const handleDeleteActionItem = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this action item?')) {
            try {
                await actionItemApi.deleteActionItem(id);
                setActionItems(prev => prev.filter(item => item.id !== id));
            } catch (err) {
                console.error('Error deleting action item:', err);
            }
        }
    };

    const handleStatusChange = async (id: number, newStatus: 'Pending' | 'Completed') => {
        try {
            const updatedItem = await actionItemApi.updateActionItem(id, { status: newStatus });
            setActionItems(prev => prev.map(item => 
                item.id === id ? updatedItem : item
            ));
        } catch (err) {
            console.error('Error updating action item:', err);
        }
    };

    const toggleResponseCard = (id: string) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'wellness': return 'teal';
            case 'feedback': return 'purple';
            case 'satisfaction': return 'blue';
            case 'skills': return 'indigo';
            case 'engagement': return 'pink';
            default: return 'gray';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'High': return 'red';
            case 'medium': return 'orange';
            case 'Medium': return 'orange';
            case 'low': return 'green';
            case 'Low': return 'green';
            default: return 'gray';
        }
    };

    return (
        <AppLayout>
            <ManagerOnly>
                <Box w="full" minH="100vh" bg="gray.50" display="flex" flexDirection="column">
                    {/* Professional Header with Stats */}
                    <Box bg="white" borderBottom="1px solid" borderColor="gray.200" shadow="sm" flexShrink={0}>
                        <Box px={8} py={6}>
                            <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
                                {/* Title Section */}
                                <VStack align="start" gap={1}>
                                    <HStack gap={3}>
                                        <Box p={2.5} bg="blue.50" borderRadius="lg">
                                            <BarChart3 size={24} color="#2563eb" />
                                        </Box>
                                        <VStack align="start" gap={0}>
                                            <Heading size="xl" color="gray.900" fontWeight="600">
                                                Manager Dashboard
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm">
                                                Comprehensive team insights and engagement analytics
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </VStack>

                                {/* Quick Actions */}
                                <HStack gap={2}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        borderColor="gray.300"
                                        color="gray.700"
                                        _hover={{ bg: "gray.50" }}
                                    >
                                        <RefreshCw size={14} />
                                        Refresh
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        borderColor="gray.300"
                                        color="gray.700"
                                        _hover={{ bg: "gray.50" }}
                                    >
                                        <Download size={14} />
                                        Export
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorPalette="blue"
                                        _hover={{ bg: "blue.600" }}
                                    >
                                        <Settings size={14} />
                                        Settings
                                    </Button>
                                </HStack>
                            </HStack>

                            {/* Key Metrics Row */}
                            <SimpleGrid columns={{ base: 2, md: 5 }} gap={4} mt={6}>
                                <Card.Root bg="linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)" border="1px solid" borderColor="blue.100" borderRadius="lg" shadow="sm">
                                    <Card.Body p={4}>
                                        <VStack align="start" gap={2}>
                                            <HStack justify="space-between" w="full">
                                                <Box p={2} bg="blue.100" borderRadius="md">
                                                    <FileText size={16} color="#2563eb" />
                                                </Box>
                                                <HStack gap={1}>
                                                    <TrendingUp size={14} color="#10b981" />
                                                    <Text fontSize="xs" color="green.600" fontWeight="600">+12%</Text>
                                                </HStack>
                                            </HStack>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="2xl" fontWeight="700" color="gray.900">
                                                    {surveysTotalCount}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">Survey Templates</Text>
                                            </VStack>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                <Card.Root bg="linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)" border="1px solid" borderColor="purple.100" borderRadius="lg" shadow="sm">
                                    <Card.Body p={4}>
                                        <VStack align="start" gap={2}>
                                            <HStack justify="space-between" w="full">
                                                <Box p={2} bg="purple.100" borderRadius="md">
                                                    <MessageSquare size={16} color="#9333ea" />
                                                </Box>
                                                <HStack gap={1}>
                                                    <TrendingUp size={14} color="#10b981" />
                                                    <Text fontSize="xs" color="green.600" fontWeight="600">+8%</Text>
                                                </HStack>
                                            </HStack>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="2xl" fontWeight="700" color="gray.900">
                                                    {responses.length}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">Total Responses</Text>
                                            </VStack>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                <Card.Root bg="linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 100%)" border="1px solid" borderColor="teal.100" borderRadius="lg" shadow="sm">
                                    <Card.Body p={4}>
                                        <VStack align="start" gap={2}>
                                            <HStack justify="space-between" w="full">
                                                <Box p={2} bg="teal.100" borderRadius="md">
                                                    <Target size={16} color="#14b8a6" />
                                                </Box>
                                                <HStack gap={1}>
                                                    <TrendingDown size={14} color="#ef4444" />
                                                    <Text fontSize="xs" color="red.600" fontWeight="600">-3%</Text>
                                                </HStack>
                                            </HStack>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="2xl" fontWeight="700" color="gray.900">
                                                    {actionsTotalCount}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">Action Items</Text>
                                            </VStack>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                <Card.Root bg="linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)" border="1px solid" borderColor="green.100" borderRadius="lg" shadow="sm">
                                    <Card.Body p={4}>
                                        <VStack align="start" gap={2}>
                                            <HStack justify="space-between" w="full">
                                                <Box p={2} bg="green.100" borderRadius="md">
                                                    <CheckCircle2 size={16} color="#16a34a" />
                                                </Box>
                                                <HStack gap={1}>
                                                    <Minus size={14} color="#6b7280" />
                                                    <Text fontSize="xs" color="gray.600" fontWeight="600">0%</Text>
                                                </HStack>
                                            </HStack>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="2xl" fontWeight="700" color="gray.900">
                                                    {Math.round((responses.filter(r => r.status === 'reviewed' || r.status === 'action_taken').length / Math.max(responses.length, 1)) * 100)}%
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">Response Rate</Text>
                                            </VStack>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* Manager Engagement Score Card */}
                                <Card.Root bg="linear-gradient(135deg, #fef3c7 0%, #fefce8 100%)" border="1px solid" borderColor="yellow.200" borderRadius="lg" shadow="sm">
                                    <Card.Body p={4}>
                                        <VStack align="start" gap={2}>
                                            <HStack justify="space-between" w="full">
                                                <Box p={2} bg="yellow.100" borderRadius="md">
                                                    <Award size={16} color="#ca8a04" />
                                                </Box>
                                                <HStack gap={1}>
                                                    <TrendingUp size={14} color="#10b981" />
                                                    <Text fontSize="xs" color="green.600" fontWeight="600">+5%</Text>
                                                </HStack>
                                            </HStack>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="2xl" fontWeight="700" color="gray.900">
                                                    {engagementData.length > 0 ? engagementData[engagementData.length - 1].managerScore : 88}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">Manager Engagement</Text>
                                            </VStack>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            </SimpleGrid>
                        </Box>
                    </Box>

                    {/* Main Content Area */}
                    <Box px={8} py={4} flex={1}>
                        <VStack gap={4} align="stretch" w="full">
                            {/* Tabs Navigation and Content */}
                            <Card.Root bg="white" shadow="sm" borderRadius="lg" border="1px solid" borderColor="gray.200" display="flex" flexDirection="column">
                                <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value as any)}>
                                    {/* Tabs List */}
                                    <Tabs.List px={6} borderBottom="1px solid" borderColor="gray.200">
                                        <Tabs.Trigger value="surveys" px={6} py={4}>
                                            <HStack gap={2}>
                                                <BarChart3 size={18} />
                                                <Text fontWeight="semibold">Survey Templates</Text>
                                                <Badge colorPalette="blue" size="sm">{surveysTotalCount}</Badge>
                                            </HStack>
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value="responses" px={6} py={4}>
                                            <HStack gap={2}>
                                                <MessageSquare size={18} />
                                                <Text fontWeight="semibold">Survey Responses</Text>
                                                <Badge colorPalette="purple" size="sm">{responses.length}</Badge>
                                            </HStack>
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value="actions" px={6} py={4}>
                                            <HStack gap={2}>
                                                <Target size={18} />
                                                <Text fontWeight="semibold">Action Items</Text>
                                                <Badge colorPalette="teal" size="sm">{actionsTotalCount}</Badge>
                                            </HStack>
                                        </Tabs.Trigger>
                                    </Tabs.List>

                                    {/* Tab Content */}
                                    <Box flex={1} p={4} display="flex" flexDirection="column">
                                {/* Surveys Tab */}
                                {activeTab === 'surveys' && (
                                    <VStack gap={3} align="stretch" h="full" display="flex" flexDirection="column">
                                        {/* Search and Actions */}
                                        <Box bg="gray.50" p={3} borderRadius="lg" flexShrink={0}>
                                            <HStack gap={3} flexWrap="wrap">
                                                <Box flex={1} minW="300px">
                                                    <Box position="relative">
                                                        <Input
                                                            placeholder="Search survey templates by title or description..."
                                                            value={surveysSearchQuery}
                                                            onChange={(e) => {
                                                                setSurveysSearchQuery(e.target.value);
                                                                setSurveysPage(1);
                                                            }}
                                                            pl={10}
                                                            size="md"
                                                            bg="white"
                                                            border="1px solid"
                                                            borderColor="gray.300"
                                                            borderRadius="md"
                                                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3b82f6" }}
                                                        />
                                                        <Box
                                                            position="absolute"
                                                            left={3}
                                                            top="50%"
                                                            transform="translateY(-50%)"
                                                            color="gray.400"
                                                        >
                                                            <Search size={16} />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <HStack gap={2}>
                                                    <Button 
                                                        variant="outline"
                                                        size="md"
                                                        borderColor="gray.300"
                                                        color="gray.700"
                                                        _hover={{ bg: "gray.100" }}
                                                    >
                                                        <Filter size={16} />
                                                        Filter
                                                    </Button>
                                                    <RequireSurveyCreate>
                                                        <Button 
                                                            onClick={() => router.push('/surveys/create')}
                                                            colorPalette="blue"
                                                            size="md"
                                                        >
                                                            <Plus size={16} />
                                                            New Survey
                                                        </Button>
                                                    </RequireSurveyCreate>
                                                </HStack>
                                            </HStack>
                                        </Box>

                                        {/* Survey Templates List */}
                                        {surveysLoading ? (
                                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
                                                <SkeletonLoader type="survey" count={itemsToShow} />
                                            </SimpleGrid>
                                        ) : surveysError ? (
                                            <Card.Root bg="white">
                                                <Card.Body p={8}>
                                                    <VStack gap={4}>
                                                        <Text color="red.600">{surveysError}</Text>
                                                        <Button onClick={() => fetchSurveys()} colorPalette="blue">
                                                            Retry
                                                        </Button>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        ) : surveys.length === 0 ? (
                                            <Card.Root bg="white">
                                                <Card.Body p={8}>
                                                    <VStack gap={4}>
                                                        <FileText size={48} color="#9ca3af" />
                                                        <Text color="gray.600" fontSize="md">No survey templates found</Text>
                                                        <RequireSurveyCreate>
                                                            <Button onClick={() => router.push('/surveys/create')} colorPalette="blue">
                                                                <Plus size={20} />
                                                                Create Your First Template
                                                            </Button>
                                                        </RequireSurveyCreate>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        ) : (
                                            <>
                                                {/* Scrollable Grid Area */}
                                                <Box flex={1} overflow="auto">
                                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
                                                        {surveys.map((survey) => (
                                                            <Card.Root 
                                                                key={survey.id} 
                                                                bg="white" 
                                                                borderRadius="lg" 
                                                                border="1px solid" 
                                                                borderColor="gray.200" 
                                                                _hover={{ shadow: "md", borderColor: "blue.300" }} 
                                                                transition="all 0.2s"
                                                                overflow="hidden"
                                                            >
                                                                {/* Status Bar */}
                                                                <Box 
                                                                    h="3px" 
                                                                    bg={survey.status === 'active' ? 'blue.500' : survey.status === 'closed' ? 'green.500' : 'gray.400'}
                                                                />
                                                                
                                                                <Card.Body p={4}>
                                                                    <VStack align="stretch" gap={3}>
                                                                        {/* Header */}
                                                                        <HStack justify="space-between" align="start">
                                                                            <HStack gap={2}>
                                                                                <Box p={2} bg="blue.50" borderRadius="md">
                                                                                    <Text fontSize="lg">{getSurveyTypeIcon(survey.survey_type)}</Text>
                                                                                </Box>
                                                                                <VStack align="start" gap={0}>
                                                                                    <Badge 
                                                                                        colorPalette={getStatusColor(survey.status)} 
                                                                                        size="sm"
                                                                                        variant="subtle"
                                                                                    >
                                                                                        {getStatusLabel(survey.status)}
                                                                                    </Badge>
                                                                                </VStack>
                                                                            </HStack>
                                                                            <Button
                                                                                size="xs"
                                                                                variant="ghost"
                                                                                onClick={() => handleDeleteSurvey(survey.id)}
                                                                                color="gray.400"
                                                                                _hover={{ color: "red.500", bg: "red.50" }}
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </Button>
                                                                        </HStack>
                                                                        
                                                                        {/* Content */}
                                                                        <VStack align="start" gap={2}>
                                                                            <Heading size="sm" color="gray.900" fontWeight="600" lineClamp={2}>
                                                                                {survey.title}
                                                                            </Heading>
                                                                            <Text fontSize="xs" color="gray.600" lineClamp={2} lineHeight="1.5">
                                                                                {survey.description}
                                                                            </Text>
                                                                        </VStack>

                                                                        {/* Metrics */}
                                                                        <HStack gap={3} pt={2} borderTop="1px solid" borderColor="gray.100">
                                                                            <VStack align="start" gap={0} flex={1}>
                                                                                <Text fontSize="xs" color="gray.500">Responses</Text>
                                                                                <HStack gap={1}>
                                                                                    <Users size={12} color="#6b7280" />
                                                                                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                                                                                        {survey.responses_count || 0}
                                                                                    </Text>
                                                                                </HStack>
                                                                            </VStack>
                                                                            <VStack align="start" gap={0} flex={1}>
                                                                                <Text fontSize="xs" color="gray.500">Created</Text>
                                                                                <HStack gap={1}>
                                                                                    <Calendar size={12} color="#6b7280" />
                                                                                    <Text fontSize="xs" fontWeight="500" color="gray.700">
                                                                                        {formatDate(survey.created_at)}
                                                                                    </Text>
                                                                                </HStack>
                                                                            </VStack>
                                                                        </HStack>

                                                                        {/* Action */}
                                                                        <Button
                                                                            onClick={() => handleViewSurveyStats(survey.id)}
                                                                            variant="outline"
                                                                            size="sm"
                                                                            w="full"
                                                                            borderColor="gray.300"
                                                                            color="gray.700"
                                                                            _hover={{ bg: "blue.50", borderColor: "blue.500", color: "blue.600" }}
                                                                        >
                                                                            <Eye size={14} />
                                                                            View Analytics
                                                                            <ChevronRight size={14} />
                                                                        </Button>
                                                                    </VStack>
                                                                </Card.Body>
                                                            </Card.Root>
                                                        ))}
                                                    </SimpleGrid>
                                                </Box>

                                                {/* Fixed Pagination at Bottom */}
                                                {surveysTotalCount > surveysPageSize && (
                                                    <Box pt={3} mt={3} borderTop="1px solid" borderColor="gray.200" flexShrink={0}>
                                                        <Pagination
                                                            currentPage={surveysPage}
                                                            totalPages={Math.ceil(surveysTotalCount / surveysPageSize)}
                                                            totalItems={surveysTotalCount}
                                                            itemsPerPage={surveysPageSize}
                                                            onPageChange={setSurveysPage}
                                                            onItemsPerPageChange={setSurveysPageSize}
                                                        />
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </VStack>
                                )}

                                {/* Survey Responses Tab */}
                                {activeTab === 'responses' && (
                                    <VStack gap={3} align="stretch">
                                        {responsesLoading ? (
                                            <Flex justify="center" align="center" minH="40vh">
                                                <VStack gap={4}>
                                                    <Spinner size="xl" color="blue.500" />
                                                    <Text color="gray.600" fontSize="sm">Loading responses...</Text>
                                                </VStack>
                                            </Flex>
                                        ) : (
                                            <>
                                                {/* Summary Cards */}
                                                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                                                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                                                        <Card.Body p={3}>
                                                            <HStack justify="space-between">
                                                                <VStack align="start" gap={1}>
                                                                    <Text fontSize="xs" color="gray.500" fontWeight="500">Total Responses</Text>
                                                                    <Text fontSize="2xl" fontWeight="700" color="gray.900">{responses.length}</Text>
                                                                    <Text fontSize="xs" color="gray.500">All time</Text>
                                                                </VStack>
                                                                <Box p={2.5} bg="purple.50" borderRadius="md">
                                                                    <MessageSquare size={20} color="#9333ea" />
                                                                </Box>
                                                            </HStack>
                                                        </Card.Body>
                                                    </Card.Root>

                                                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                                                        <Card.Body p={3}>
                                                            <HStack justify="space-between">
                                                                <VStack align="start" gap={1}>
                                                                    <Text fontSize="xs" color="gray.500" fontWeight="500">Reviewed</Text>
                                                                    <Text fontSize="2xl" fontWeight="700" color="green.600">
                                                                        {responses.filter(r => r.status === 'reviewed' || r.status === 'action_taken').length}
                                                                    </Text>
                                                                    <Text fontSize="xs" color="green.600">
                                                                        {Math.round((responses.filter(r => r.status === 'reviewed' || r.status === 'action_taken').length / Math.max(responses.length, 1)) * 100)}% completion
                                                                    </Text>
                                                                </VStack>
                                                                <Box p={2.5} bg="green.50" borderRadius="md">
                                                                    <CheckCircle2 size={20} color="#16a34a" />
                                                                </Box>
                                                            </HStack>
                                                        </Card.Body>
                                                    </Card.Root>

                                                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
                                                        <Card.Body p={3}>
                                                            <HStack justify="space-between">
                                                                <VStack align="start" gap={1}>
                                                                    <Text fontSize="xs" color="gray.500" fontWeight="500">Pending Review</Text>
                                                                    <Text fontSize="2xl" fontWeight="700" color="orange.600">
                                                                        {responses.filter(r => r.status === 'pending_review').length}
                                                                    </Text>
                                                                    <Text fontSize="xs" color="orange.600">Needs attention</Text>
                                                                </VStack>
                                                                <Box p={2.5} bg="orange.50" borderRadius="md">
                                                                    <AlertCircle size={20} color="#ea580c" />
                                                                </Box>
                                                            </HStack>
                                                        </Card.Body>
                                                    </Card.Root>
                                                </SimpleGrid>

                                                {/* Two Column Layout: List + Details */}
                                                <HStack gap={3} align="stretch" minH="500px">
                                                    {/* Left: Survey Responses List */}
                                                    <VStack flex="0 0 400px" gap={2} overflow="auto" pr={2}>
                                                        {responses.map((response) => (
                                                            <Box
                                                                key={response.id}
                                                                p={3}
                                                                bg="white"
                                                                borderRadius="md"
                                                                border="1px solid"
                                                                borderColor="gray.200"
                                                                cursor="pointer"
                                                                onMouseEnter={() => setHoveredResponse(response)}
                                                                _hover={{ 
                                                                    borderColor: "purple.400", 
                                                                    bg: "purple.50",
                                                                    shadow: "sm"
                                                                }}
                                                                transition="all 0.2s"
                                                                w="full"
                                                            >
                                                                <VStack align="start" gap={2}>
                                                                    <HStack justify="space-between" w="full">
                                                                        <Badge 
                                                                            colorPalette={getCategoryColor(response.category)}
                                                                            variant="subtle"
                                                                            size="sm"
                                                                        >
                                                                            {response.category}
                                                                        </Badge>
                                                                        <Badge 
                                                                            colorPalette={getStatusColor(response.status)}
                                                                            variant="solid"
                                                                            size="xs"
                                                                        >
                                                                            {getStatusLabel(response.status)}
                                                                        </Badge>
                                                                    </HStack>
                                                                    <Text fontSize="sm" fontWeight="600" color="gray.900" lineClamp={1}>
                                                                        {response.surveyTitle}
                                                                    </Text>
                                                                    <Text fontSize="xs" color="gray.600" lineClamp={2}>
                                                                        {response.summary.concernArea}
                                                                    </Text>
                                                                    <HStack gap={1} fontSize="2xs" color="gray.500">
                                                                        <Clock size={10} />
                                                                        <Text>{formatDate(response.submittedDate)}</Text>
                                                                    </HStack>
                                                                </VStack>
                                                            </Box>
                                                        ))}
                                                    </VStack>

                                                    {/* Right: Survey Response Details */}
                                                    <Card.Root flex={1} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                        <Card.Body p={6}>
                                                            {hoveredResponse ? (
                                                                <VStack align="stretch" gap={4}>
                                                                    {/* Header */}
                                                                    <VStack align="start" gap={2}>
                                                                        <Heading size="md" color="gray.900" fontWeight="600">
                                                                            {hoveredResponse.surveyTitle}
                                                                        </Heading>
                                                                        <HStack gap={2} flexWrap="wrap">
                                                                            <Badge 
                                                                                colorPalette={getCategoryColor(hoveredResponse.category)}
                                                                                variant="subtle"
                                                                                size="md"
                                                                            >
                                                                                {hoveredResponse.category}
                                                                            </Badge>
                                                                            <Badge 
                                                                                colorPalette={getStatusColor(hoveredResponse.status)}
                                                                                variant="solid"
                                                                                size="md"
                                                                            >
                                                                                {getStatusLabel(hoveredResponse.status)}
                                                                            </Badge>
                                                                        </HStack>
                                                                    </VStack>

                                                                    {/* Concern Area & Issues */}
                                                                    <Box bg="gray.50" p={4} borderRadius="lg">
                                                                        <VStack align="start" gap={3}>
                                                                            <Text fontSize="sm" fontWeight="600" color="gray.800">
                                                                                Concern Area
                                                                            </Text>
                                                                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                                                                {hoveredResponse.summary.concernArea}
                                                                            </Text>
                                                                            <Text fontSize="sm" fontWeight="600" color="gray.800" mt={2}>
                                                                                Key Issues
                                                                            </Text>
                                                                            <VStack align="start" gap={1} pl={3}>
                                                                                {hoveredResponse.summary.keyIssues.map((issue, idx) => (
                                                                                    <Text key={idx} fontSize="sm" color="gray.600">
                                                                                        • {issue}
                                                                                    </Text>
                                                                                ))}
                                                                            </VStack>
                                                                        </VStack>
                                                                    </Box>

                                                                    {/* Manager Response */}
                                                                    {hoveredResponse.managerResponse && (
                                                                        <Box bg="blue.50" p={4} borderRadius="lg" border="1px solid" borderColor="blue.200">
                                                                            <VStack align="start" gap={3}>
                                                                                <HStack justify="space-between" w="full">
                                                                                    <Text fontSize="sm" fontWeight="600" color="blue.800">
                                                                                        Manager Response
                                                                                    </Text>
                                                                                    <Badge colorPalette={getPriorityColor(hoveredResponse.managerResponse.priority)} size="sm">
                                                                                        {hoveredResponse.managerResponse.priority} priority
                                                                                    </Badge>
                                                                                </HStack>
                                                                                <Text fontSize="sm" color="gray.700">
                                                                                    {hoveredResponse.managerResponse.feedback}
                                                                                </Text>
                                                                                <Box>
                                                                                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                                                                                        Action Plan:
                                                                                    </Text>
                                                                                    <Text fontSize="sm" color="gray.600" whiteSpace="pre-line">
                                                                                        {hoveredResponse.managerResponse.actionPlan}
                                                                                    </Text>
                                                                                </Box>
                                                                            </VStack>
                                                                        </Box>
                                                                    )}

                                                                    {/* Metadata */}
                                                                    <HStack gap={2} pt={4} borderTop="1px solid" borderColor="gray.200">
                                                                        <Clock size={14} color="#6b7280" />
                                                                        <Text fontSize="xs" color="gray.600">
                                                                            Submitted: {formatDate(hoveredResponse.submittedDate)}
                                                                        </Text>
                                                                    </HStack>
                                                                </VStack>
                                                            ) : (
                                                                <VStack justify="center" align="center" h="full" gap={3}>
                                                                    <MessageSquare size={48} color="#d1d5db" />
                                                                    <Text color="gray.500" fontSize="md">
                                                                        Hover over a survey response to view details
                                                                    </Text>
                                                                </VStack>
                                                            )}
                                                        </Card.Body>
                                                    </Card.Root>
                                                </HStack>
                                            </>
                                        )}
                                    </VStack>
                                )}

                                {/* Action Items Tab */}
                                {activeTab === 'actions' && (
                                    <VStack gap={3} align="stretch" h="full" display="flex" flexDirection="column">
                                        {/* Search and Actions */}
                                        <Box bg="gray.50" p={3} borderRadius="lg" flexShrink={0}>
                                            <HStack gap={3} flexWrap="wrap">
                                                <Box flex={1} minW="300px">
                                                    <Box position="relative">
                                                        <Input
                                                            placeholder="Search action items by title or description..."
                                                            value={actionsSearchQuery}
                                                            onChange={(e) => {
                                                                setActionsSearchQuery(e.target.value);
                                                                setActionsPage(1);
                                                            }}
                                                            pl={10}
                                                            size="md"
                                                            bg="white"
                                                            border="1px solid"
                                                            borderColor="gray.300"
                                                            borderRadius="md"
                                                            _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px #14b8a6" }}
                                                        />
                                                        <Box
                                                            position="absolute"
                                                            left={3}
                                                            top="50%"
                                                            transform="translateY(-50%)"
                                                            color="gray.400"
                                                        >
                                                            <Search size={16} />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <HStack gap={2}>
                                                    <Button 
                                                        variant="outline"
                                                        size="md"
                                                        borderColor="gray.300"
                                                        color="gray.700"
                                                        _hover={{ bg: "gray.100" }}
                                                    >
                                                        <Filter size={16} />
                                                        Filter
                                                    </Button>
                                                    <Button 
                                                        onClick={() => setShowCreateActionForm(!showCreateActionForm)}
                                                        colorPalette="teal"
                                                        size="md"
                                                    >
                                                        <Plus size={16} />
                                                        New Action
                                                    </Button>
                                                </HStack>
                                            </HStack>
                                        </Box>

                                        {/* Action Items List */}
                                        {actionsLoading ? (
                                            <VStack gap={2} align="stretch">
                                                <SkeletonLoader type="action-item" count={itemsToShow} />
                                            </VStack>
                                        ) : actionsError ? (
                                            <Card.Root bg="white">
                                                <Card.Body p={8}>
                                                    <VStack gap={4}>
                                                        <Text color="red.600">{actionsError}</Text>
                                                        <Button onClick={() => fetchActionItems()} colorPalette="blue">
                                                            Retry
                                                        </Button>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        ) : actionItems.length === 0 ? (
                                            <Card.Root bg="white">
                                                <Card.Body p={8}>
                                                    <VStack gap={4}>
                                                        <Target size={48} color="#9ca3af" />
                                                        <Text color="gray.600" fontSize="lg">No action items found</Text>
                                                        <Button onClick={() => setShowCreateActionForm(true)} colorPalette="teal">
                                                            <Plus size={20} />
                                                            Create Your First Action Item
                                                        </Button>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        ) : (
                                            <>
                                                {/* Two Column Layout: List + Details */}
                                                <HStack flex={1} gap={3} align="stretch" overflow="hidden">
                                                    {/* Left: Action Items List */}
                                                    <VStack flex="0 0 400px" gap={2} overflow="auto" pr={2}>
                                                        {actionItems.map((item) => (
                                                            <Box
                                                                key={item.id}
                                                                p={3}
                                                                bg="white"
                                                                borderRadius="md"
                                                                border="1px solid"
                                                                borderColor="gray.200"
                                                                cursor="pointer"
                                                                onMouseEnter={() => setHoveredActionItem(item)}
                                                                _hover={{ 
                                                                    borderColor: "teal.400", 
                                                                    bg: "teal.50",
                                                                    shadow: "sm"
                                                                }}
                                                                transition="all 0.2s"
                                                                w="full"
                                                            >
                                                                <HStack justify="space-between" align="start" gap={2}>
                                                                    <VStack align="start" gap={1} flex={1}>
                                                                        <HStack gap={2}>
                                                                            <Box
                                                                                w="8px"
                                                                                h="8px"
                                                                                borderRadius="full"
                                                                                bg={item.status === 'Completed' ? 'green.500' : 'orange.400'}
                                                                            />
                                                                            <Text fontSize="sm" fontWeight="600" color="gray.900" lineClamp={1}>
                                                                                {item.title}
                                                                            </Text>
                                                                        </HStack>
                                                                        <Text fontSize="xs" color="gray.600" lineClamp={2}>
                                                                            {item.action}
                                                                        </Text>
                                                                        <HStack gap={1} fontSize="2xs" color="gray.500">
                                                                            <Clock size={10} />
                                                                            <Text>{formatDate(item.updated_at)}</Text>
                                                                        </HStack>
                                                                    </VStack>
                                                                    <Badge 
                                                                        colorPalette={getStatusColor(item.status)} 
                                                                        size="sm"
                                                                        variant="subtle"
                                                                    >
                                                                        {item.status}
                                                                    </Badge>
                                                                </HStack>
                                                            </Box>
                                                        ))}
                                                    </VStack>

                                                    {/* Right: Action Item Details */}
                                                    <Card.Root flex={1} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                        <Card.Body p={6}>
                                                            {hoveredActionItem ? (
                                                                <VStack align="stretch" gap={4}>
                                                                    {/* Header */}
                                                                    <HStack justify="space-between" align="start">
                                                                        <VStack align="start" gap={2} flex={1}>
                                                                            <Heading size="md" color="gray.900" fontWeight="600">
                                                                                {hoveredActionItem.title}
                                                                            </Heading>
                                                                            <Badge 
                                                                                colorPalette={getStatusColor(hoveredActionItem.status)} 
                                                                                size="md"
                                                                                variant="subtle"
                                                                            >
                                                                                {hoveredActionItem.status}
                                                                            </Badge>
                                                                        </VStack>
                                                                        <HStack gap={2}>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleStatusChange(hoveredActionItem.id, hoveredActionItem.status === 'Pending' ? 'Completed' : 'Pending')}
                                                                                colorPalette="green"
                                                                            >
                                                                                <CheckCircle2 size={16} />
                                                                                {hoveredActionItem.status === 'Pending' ? 'Complete' : 'Reopen'}
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleDeleteActionItem(hoveredActionItem.id)}
                                                                                colorPalette="red"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                                Delete
                                                                            </Button>
                                                                        </HStack>
                                                                    </HStack>

                                                                    {/* Description */}
                                                                    <Box>
                                                                        <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                                                                            Description
                                                                        </Text>
                                                                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                                                                            {hoveredActionItem.action}
                                                                        </Text>
                                                                    </Box>

                                                                    {/* Metadata */}
                                                                    <VStack align="stretch" gap={2} pt={4} borderTop="1px solid" borderColor="gray.200">
                                                                        <HStack gap={2}>
                                                                            <Clock size={14} color="#6b7280" />
                                                                            <Text fontSize="xs" color="gray.600">
                                                                                Created: {formatDate(hoveredActionItem.created_at)}
                                                                            </Text>
                                                                        </HStack>
                                                                        <HStack gap={2}>
                                                                            <Clock size={14} color="#6b7280" />
                                                                            <Text fontSize="xs" color="gray.600">
                                                                                Updated: {formatDate(hoveredActionItem.updated_at)}
                                                                            </Text>
                                                                        </HStack>
                                                                    </VStack>
                                                                </VStack>
                                                            ) : (
                                                                <VStack justify="center" align="center" h="full" gap={3}>
                                                                    <Target size={48} color="#d1d5db" />
                                                                    <Text color="gray.500" fontSize="md">
                                                                        Hover over an action item to view details
                                                                    </Text>
                                                                </VStack>
                                                            )}
                                                        </Card.Body>
                                                    </Card.Root>
                                                </HStack>

                                                {/* Fixed Pagination at Bottom */}
                                                {actionsTotalCount > actionsPageSize && (
                                                    <Box pt={3} mt={3} borderTop="1px solid" borderColor="gray.200" flexShrink={0}>
                                                        <Pagination
                                                            currentPage={actionsPage}
                                                            totalPages={Math.ceil(actionsTotalCount / actionsPageSize)}
                                                            totalItems={actionsTotalCount}
                                                            itemsPerPage={actionsPageSize}
                                                            onPageChange={setActionsPage}
                                                            onItemsPerPageChange={setActionsPageSize}
                                                        />
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </VStack>
                                )}
                                    </Box>
                                </Tabs.Root>
                            </Card.Root>
                        </VStack>
                    </Box>
                </Box>
            </ManagerOnly>
        </AppLayout>
    );
}
