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
import { Pagination } from '@/components/common/Pagination';
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
    Edit, 
    MoreVertical,
    TrendingUp,
    Clock,
    Target,
    Activity,
    CheckCircle2,
    AlertCircle,
    Star,
    Download,
    Share2
} from 'lucide-react';
import { surveyApi, Survey, SurveyQuestion, SurveysPaginatedResponse, SurveysQueryParams } from '@/services';
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
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'status' | 'responses'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [selectedSurveys, setSelectedSurveys] = useState<number[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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

    // Fetch surveys with pagination
    const fetchSurveys = async (params?: SurveysQueryParams, isSearch = false) => {
        try {
            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }
            
            // Try to get survey management data for managers first
            try {
                const managementData: SurveysPaginatedResponse = await surveyApi.getSurveyManagement(params);
                const surveys = Array.isArray(managementData.results) ? managementData.results : (managementData.results.surveys || []);
                setSurveys(surveys);
                setSummary(managementData.results.summary || {
                    total_available: managementData.count || 0,
                    team_surveys: 0,
                    organization_surveys: 0,
                    completed: 0,
                    pending: 0,
                    high_priority: 0
                });
                setTotalCount(managementData.count);
                setFilteredCount(managementData.results.total_results || managementData.count);
                setHasNext(!!managementData.next);
                setHasPrevious(!!managementData.previous);
                setIsManager(true);
            } catch (managementErr) {
                // If survey management fails (not a manager), fall back to regular surveys
                console.log('Not a manager, fetching regular surveys');
                const surveysData: SurveysPaginatedResponse = await surveyApi.getSurveys(params);
                const surveys = Array.isArray(surveysData.results) ? surveysData.results : (surveysData.results.surveys || []);
                setSurveys(surveys);
                setSummary(surveysData.results.summary || {
                    total_available: surveysData.count || 0,
                    team_surveys: 0,
                    organization_surveys: 0,
                    completed: 0,
                    pending: 0,
                    high_priority: 0
                });
                setTotalCount(surveysData.count);
                setFilteredCount(surveysData.results.total_results || surveysData.count);
                setHasNext(!!surveysData.next);
                setHasPrevious(!!surveysData.previous);
                setIsManager(false);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error fetching surveys:', err);
            setError('Failed to load surveys. Please try again.');
            setSurveys([]);
        } finally {
            if (isSearch) {
                setSearchLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const isInitialLoad = currentPage === 1 && pageSize === 10 && !searchQuery;
        const timeoutId = setTimeout(() => {
            fetchSurveys({ 
                page: currentPage, 
                page_size: pageSize,
                search: searchQuery || undefined
            }, !isInitialLoad);
        }, searchQuery ? 300 : 0); // 300ms debounce for search

        return () => clearTimeout(timeoutId);
    }, [currentPage, pageSize, searchQuery]);

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
            fetchSurveys({ page: currentPage, page_size: pageSize });
            
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

    // Helper functions for enhanced UI
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

    const getSurveyPriority = (survey: Survey) => {
        const now = new Date();
        const endDate = new Date(survey.end_date);
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 1) return 'high';
        if (daysLeft <= 3) return 'medium';
        return 'low';
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const sortSurveys = (surveys: Survey[]) => {
        return [...surveys].sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'responses':
                    aValue = a.responses_count || 0;
                    bValue = b.responses_count || 0;
                    break;
                default:
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    };

    const filteredAndSortedSurveys = sortSurveys(
        surveys.filter(survey => {
            const matchesStatus = !statusFilter || survey.status === statusFilter;
            const matchesType = !typeFilter || survey.survey_type === typeFilter;
            return matchesStatus && matchesType;
        })
    );

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
            <Box w="full" h="100vh" bg="gradient-to-br from-blue.50 to-purple.50" overflow="auto">
                {/* Enhanced Header Section */}
                <Box px={8} py={6}>
                    <VStack gap={8} align="stretch" w="full">
                        {/* Modern Header with Gradient Background */}
                        {!loading && !error && (
                            <Card.Root 
                                bg="white" 
                                shadow="sm" 
                                borderRadius="2xl"
                                border="1px solid"
                                borderColor="gray.100"
                                overflow="hidden"
                            >
                                <Box bg="gradient-to-r from-blue.600 to-purple.600" p={6}>
                                    <HStack justify="space-between" flexWrap="wrap">
                                        <VStack align="start" gap={2}>
                                            <HStack gap={3}>
                                                <Box p={3} bg="white" borderRadius="xl" shadow="lg">
                                                    <BarChart3 size={32} color="#3182ce" />
                                                </Box>
                                                <VStack align="start" gap={1}>
                                                    <Heading size="2xl" color="white" fontWeight="bold">
                                                        Employee Surveys
                                                    </Heading>
                                                    <Text color="blue.500" fontSize="lg">
                                                        Gather insights and drive engagement
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            <Text fontSize="sm" color="blue.500">
                                                {searchQuery ? (
                                                    `${filteredAndSortedSurveys.length} of ${totalCount} surveys matching "${searchQuery}"`
                                                ) : (
                                                    `Managing ${totalCount} surveys across your organization`
                                                )}
                                            </Text>
                                        </VStack>

                                        {/* Enhanced Action Buttons */}
                                        <VStack gap={3} align="end">
                                            <RequireSurveyCreate>
                                                <Button 
                                                    onClick={() => router.push('/surveys/create')}
                                                    bg="white"
                                                    color="blue.600"
                                                    _hover={{ 
                                                        bg: "blue.50",
                                                        transform: "translateY(-2px)",
                                                        shadow: "xl"
                                                    }}
                                                    size="lg"
                                                    borderRadius="xl"
                                                    fontWeight="bold"
                                                    px={6}
                                                    transition="all 0.3s ease"
                                                >
                                                    <Plus size={20} />
                                                    Create New Survey
                                                </Button>
                                            </RequireSurveyCreate>
                                            <HStack gap={2}>
                                                <Button
                                                    aria-label="Export surveys data"
                                                    bg="white"
                                                    color="blue.600"
                                                    _hover={{ bg: "blue.50" }}
                                                    borderRadius="lg"
                                                    size="sm"
                                                    p={2}
                                                    minW="auto"
                                                >
                                                    <Download size={16} />
                                                </Button>
                                                <Button
                                                    aria-label="Share dashboard"
                                                    bg="white"
                                                    color="blue.600"
                                                    _hover={{ bg: "blue.50" }}
                                                    borderRadius="lg"
                                                    size="sm"
                                                    p={2}
                                                    minW="auto"
                                                >
                                                    <Share2 size={16} />
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>
                                
                                {/* Enhanced Search and Filter Section */}
                                <Box p={6} bg="gray.50">
                                    <VStack gap={4} align="stretch">
                                        <HStack gap={4} flexWrap="wrap">
                                            {/* Advanced Search */}
                                            <Box flex={1} minW="300px">
                                                <Box position="relative">
                                                    <Input
                                                        placeholder="Search surveys by title, description, or status..."
                                                        value={searchQuery}
                                                        onChange={(e) => {
                                                            setSearchQuery(e.target.value);
                                                            setCurrentPage(1);
                                                        }}
                                                        pl={12}
                                                        pr={searchQuery ? 12 : 4}
                                                        size="lg"
                                                        bg="white"
                                                        border="2px solid"
                                                        borderColor="gray.200"
                                                        color="gray.900"
                                                        borderRadius="xl"
                                                        _placeholder={{ color: "gray.600" }}
                                                        _focus={{
                                                            borderColor: "blue.400",
                                                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                                                        }}
                                                        _hover={{ borderColor: "gray.300" }}
                                                    />
                                                    <Box
                                                        position="absolute"
                                                        left={4}
                                                        top="50%"
                                                        transform="translateY(-50%)"
                                                        color="gray.400"
                                                    >
                                                        <Search size={20} />
                                                    </Box>
                                                    {searchQuery && (
                                                        <Button
                                                            aria-label="Clear search"
                                                            position="absolute"
                                                            right={2}
                                                            top="50%"
                                                            transform="translateY(-50%)"
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setCurrentPage(1);
                                                            }}
                                                            color="gray.400"
                                                            _hover={{ color: "gray.600", bg: "gray.100" }}
                                                            p={1}
                                                            minW="auto"
                                                        >
                                                            <X size={16} />
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>

                                            {/* Filter Button */}
                                            <Button
                                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                                variant="outline"
                                                size="lg"
                                                borderColor="gray.300"
                                                color="gray.700"
                                                bg="white"
                                                _hover={{ 
                                                    bg: "gray.50",
                                                    borderColor: "gray.400"
                                                }}
                                                borderRadius="xl"
                                                px={6}
                                            >
                                                <Filter size={20} />
                                                Filters
                                                {(statusFilter || typeFilter) && (
                                                    <Badge colorPalette="blue" ml={2} borderRadius="full">
                                                        {[statusFilter, typeFilter].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>

                                            {/* View Mode Toggle */}
                                            <HStack bg="white" borderRadius="xl" p={1} border="2px solid" borderColor="gray.200">
                                                <Button
                                                    size="sm"
                                                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                                                    colorPalette={viewMode === 'grid' ? 'blue' : 'gray'}
                                                    onClick={() => setViewMode('grid')}
                                                    borderRadius="lg"
                                                >
                                                    Grid
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                                                    colorPalette={viewMode === 'list' ? 'blue' : 'gray'}
                                                    onClick={() => setViewMode('list')}
                                                    borderRadius="lg"
                                                >
                                                    List
                                                </Button>
                                            </HStack>
                                        </HStack>

                                        {/* Advanced Filters Panel */}
                                        {isFilterOpen && (
                                            <Card.Root bg="white" borderRadius="xl" shadow="md">
                                                <Card.Body p={6}>
                                                    <VStack gap={4} align="stretch">
                                                        <HStack justify="space-between">
                                                            <Heading size="md" color="gray.900">
                                                                Advanced Filters
                                                            </Heading>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setStatusFilter('');
                                                                    setTypeFilter('');
                                                                }}
                                                                color="gray.600"
                                                            >
                                                                Clear All
                                                            </Button>
                                                        </HStack>
                                                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                                                            {/* Status Filter */}
                                                            <VStack align="start" gap={2}>
                                                                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                                                    Status
                                                                </Text>
                                                                <VStack align="start" gap={2}>
                                                                    {['active', 'draft', 'closed'].map(status => (
                                                                        <Button
                                                                            key={status}
                                                                            size="sm"
                                                                            variant={statusFilter === status ? 'solid' : 'outline'}
                                                                            colorPalette={statusFilter === status ? 'blue' : 'gray'}
                                                                            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                                                                            justifyContent="start"
                                                                            w="full"
                                                                        >
                                                                            {getStatusLabel(status)}
                                                                        </Button>
                                                                    ))}
                                                                </VStack>
                                                            </VStack>

                                                            {/* Type Filter */}
                                                            <VStack align="start" gap={2}>
                                                                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                                                    Survey Type
                                                                </Text>
                                                                <VStack align="start" gap={2}>
                                                                    {['wellness', 'satisfaction', 'feedback', 'engagement'].map(type => (
                                                                        <Button
                                                                            key={type}
                                                                            size="sm"
                                                                            variant={typeFilter === type ? 'solid' : 'outline'}
                                                                            colorPalette={typeFilter === type ? 'blue' : 'gray'}
                                                                            onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
                                                                            justifyContent="start"
                                                                            w="full"
                                                                        >
                                                                            {getSurveyTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                        </Button>
                                                                    ))}
                                                                </VStack>
                                                            </VStack>

                                                            {/* Sort Options */}
                                                            <VStack align="start" gap={2}>
                                                                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                                                    Sort By
                                                                </Text>
                                                                <VStack align="start" gap={2}>
                                                                    {[
                                                                        { value: 'created_at', label: 'Date Created' },
                                                                        { value: 'title', label: 'Title' },
                                                                        { value: 'status', label: 'Status' },
                                                                        { value: 'responses', label: 'Response Count' }
                                                                    ].map(option => (
                                                                        <Button
                                                                            key={option.value}
                                                                            size="sm"
                                                                            variant={sortBy === option.value ? 'solid' : 'outline'}
                                                                            colorPalette={sortBy === option.value ? 'blue' : 'gray'}
                                                                            onClick={() => setSortBy(option.value as any)}
                                                                            justifyContent="start"
                                                                            w="full"
                                                                        >
                                                                            {option.label}
                                                                        </Button>
                                                                    ))}
                                                                    <HStack gap={2} mt={2}>
                                                                        <Button
                                                                            size="xs"
                                                                            variant={sortOrder === 'asc' ? 'solid' : 'outline'}
                                                                            colorPalette="blue"
                                                                            onClick={() => setSortOrder('asc')}
                                                                        >
                                                                            Ascending
                                                                        </Button>
                                                                        <Button
                                                                            size="xs"
                                                                            variant={sortOrder === 'desc' ? 'solid' : 'outline'}
                                                                            colorPalette="blue"
                                                                            onClick={() => setSortOrder('desc')}
                                                                        >
                                                                            Descending
                                                                        </Button>
                                                                    </HStack>
                                                                </VStack>
                                                            </VStack>
                                                        </SimpleGrid>
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </VStack>
                                </Box>
                            </Card.Root>
                        )}

                        {/* Search Results Info */}
                        {searchQuery && (
                            <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                                <Text fontSize="sm" color="blue.700">
                                    <strong>{filteredAndSortedSurveys.length}</strong> surveys found matching <strong>"{searchQuery}"</strong>
                                    {filteredAndSortedSurveys.length !== totalCount && (
                                        <span> (filtered from {totalCount} total surveys)</span>
                                    )}
                                </Text>
                            </Box>
                        )}

                        {/* Stats Section - Compact Design */}
                        {!loading && !error && (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} maxW="1000px">
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="green.100" p={2} borderRadius="lg">
                                            <FileText color="#16a34a" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                                Active Surveys
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                                                {activeSurveys}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="blue.100" p={2} borderRadius="lg">
                                            <BarChart3 color="#3182ce" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                                Completed
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                                                {completedSurveys}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="gray.100" p={2} borderRadius="lg">
                                            <FileText color="#6b7280" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                                Drafts
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                                                {draftSurveys}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="purple.100" p={2} borderRadius="lg">
                                            <Users color="#9333ea" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                                Total Responses
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                                                {totalResponses}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                        </SimpleGrid>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <Box textAlign="center" py={12}>
                                <Spinner size="xl" color="blue.500" mb={4} />
                                <Text fontSize="lg" color="gray.700">Loading surveys...</Text>
                            </Box>
                        )}

                        {/* Error State */}
                        {error && (
                            <Box textAlign="center" py={12}>
                                <Text fontSize="lg" color="red.600" mb={4}>{error}</Text>
                                <Button onClick={() => window.location.reload()} bg="blue.600" color="white" _hover={{ bg: "blue.700" }}>
                                    Retry
                                </Button>
                            </Box>
                        )}

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
                        {!loading && !error && (
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Header p={6}>
                                    <HStack justify="space-between">
                                        <VStack align="start" gap={1}>
                                            <Heading size="lg" color="gray.800">
                                                {isManager ? 'Survey Management' : 'Available Surveys'}
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm">
                                                {isManager ? 'Manage your employee surveys and feedback' : 'Complete assigned surveys'}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Header>
                                <Card.Body p={6}>
                                    <Box position="relative">
                                        {searchLoading && (
                                            <Box
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                bottom={0}
                                                bg="white"
                                                opacity={0.8}
                                                zIndex={1}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                borderRadius="xl"
                                            >
                                                <VStack gap={2}>
                                                    <Spinner size="lg" color="blue.500" />
                                                    <Text fontSize="sm" color="gray.600">Searching surveys...</Text>
                                                </VStack>
                                            </Box>
                                        )}
                                        {/* Enhanced Surveys Display */}
                                        {filteredAndSortedSurveys.length === 0 ? (
                                            <Card.Root bg="white" borderRadius="xl" shadow="md">
                                                <Card.Body p={12}>
                                                    <VStack gap={4}>
                                                        <Box p={4} bg="gray.100" borderRadius="full">
                                                            <FileText size={48} color="#6b7280" />
                                                        </Box>
                                                        <VStack gap={2}>
                                                            <Heading size="lg" color="gray.700">
                                                                {searchQuery ? 'No surveys found' : 'No surveys yet'}
                                                            </Heading>
                                                            <Text color="gray.500" textAlign="center" maxW="400px">
                                                                {searchQuery ? 
                                                                    `No surveys match your search for "${searchQuery}". Try adjusting your filters or search terms.` : 
                                                                    isManager ? 'Create your first survey to start gathering valuable employee feedback and insights.' : 'No surveys are available at this time. Check back later for new surveys.'}
                                                            </Text>
                                                        </VStack>
                                                        {!searchQuery && isManager && (
                                                            <Button
                                                                onClick={() => router.push('/surveys/create')}
                                                                bg="blue.600"
                                                                color="white"
                                                                _hover={{ bg: "blue.700" }}
                                                                size="lg"
                                                                mt={4}
                                                            >
                                                                <Plus size={20} />
                                                                Create Your First Survey
                                                            </Button>
                                                        )}
                                                    </VStack>
                                                </Card.Body>
                                            </Card.Root>
                                        ) : viewMode === 'grid' ? (
                                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                                                {filteredAndSortedSurveys.map((survey) => {
                                                    const priority = getSurveyPriority(survey);
                                                    const priorityColor = getPriorityColor(priority);
                                                    
                                                    return (
                                                        <Card.Root 
                                                            key={survey.id} 
                                                            bg="white" 
                                                            borderRadius="xl" 
                                                            border="1px solid" 
                                                            borderColor="gray.200" 
                                                            shadow="md"
                                                            _hover={{ 
                                                                transform: "translateY(-4px)", 
                                                                shadow: "xl",
                                                                borderColor: "blue.300"
                                                            }}
                                                            transition="all 0.3s ease"
                                                            position="relative"
                                                            overflow="hidden"
                                                        >
                                                            {/* Priority Indicator */}
                                                            <Box
                                                                position="absolute"
                                                                top={0}
                                                                right={0}
                                                                w={3}
                                                                h={12}
                                                                bg={`${priorityColor}.500`}
                                                            />
                                                            
                                                            <Card.Body p={6}>
                                                                <VStack align="start" gap={4} h="full">
                                                                    {/* Header */}
                                                                    <VStack align="start" gap={2} w="full">
                                                                        <HStack justify="space-between" w="full">
                                                                            <Text fontSize="2xl">
                                                                                {getSurveyTypeIcon(survey.survey_type)}
                                                                            </Text>
                                                                            <Badge
                                                                                colorPalette={getStatusColor(survey.status)}
                                                                                variant="solid"
                                                                                px={3}
                                                                                py={1}
                                                                                borderRadius="full"
                                                                                fontSize="xs"
                                                                                fontWeight="bold"
                                                                            >
                                                                                {getStatusLabel(survey.status)}
                                                                            </Badge>
                                                                        </HStack>
                                                                        <Heading size="md" color="gray.800" lineHeight="1.3">
                                                                            {survey.title}
                                                                        </Heading>
                                                                        <Text color="gray.600" fontSize="sm" lineHeight="1.5" 
                                                                              style={{ 
                                                                                  display: '-webkit-box',
                                                                                  WebkitLineClamp: 2,
                                                                                  WebkitBoxOrient: 'vertical',
                                                                                  overflow: 'hidden'
                                                                              }}>
                                                                            {survey.description}
                                                                        </Text>
                                                                    </VStack>

                                                                    {/* Progress Bar */}
                                                                    <Box w="full">
                                                                        <HStack justify="space-between" mb={2}>
                                                                            <Text fontSize="xs" color="gray.500">
                                                                                Responses
                                                                            </Text>
                                                                            <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                                                                                {survey.responses_count || 0}
                                                                            </Text>
                                                                        </HStack>
                                                                        <Box w="full" h="2" bg="gray.200" borderRadius="full" overflow="hidden">
                                                                            <Box 
                                                                                h="full" 
                                                                                bg="blue.500" 
                                                                                borderRadius="full"
                                                                                width={`${Math.min((survey.responses_count || 0) * 10, 100)}%`}
                                                                                transition="width 0.3s ease"
                                                                            />
                                                                        </Box>
                                                                    </Box>

                                                                    {/* Footer */}
                                                                    <VStack align="start" gap={2} w="full" mt="auto">
                                                                        <HStack gap={4} fontSize="xs" color="gray.500" w="full">
                                                                            <HStack gap={1}>
                                                                                <Calendar size={12} />
                                                                                <Text>{formatDate(survey.created_at)}</Text>
                                                                            </HStack>
                                                                            {survey.end_date && (
                                                                                <HStack gap={1}>
                                                                                    <Clock size={12} />
                                                                                    <Text>Ends {formatDate(survey.end_date)}</Text>
                                                                                </HStack>
                                                                            )}
                                                                        </HStack>
                                                                        
                                                                        {/* Action Buttons */}
                                                                        <HStack gap={2} w="full" pt={2}>
                                                                            <ManagerOnly>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    colorPalette="blue"
                                                                                    onClick={() => handleViewSurveyStats(survey.id)}
                                                                                    flex={1}
                                                                                >
                                                                                    <Eye size={14} />
                                                                                    View Stats
                                                                                </Button>
                                                                            </ManagerOnly>
                                                                            <AssociateOnly>
                                                                                <Button
                                                                                    size="sm"
                                                                                    bg="blue.600"
                                                                                    color="white"
                                                                                    _hover={{ bg: "blue.700" }}
                                                                                    onClick={() => handleSubmitSurvey(survey.id)}
                                                                                    flex={1}
                                                                                >
                                                                                    <Edit size={14} />
                                                                                    Take Survey
                                                                                </Button>
                                                                            </AssociateOnly>
                                                                        </HStack>
                                                                    </VStack>
                                                                </VStack>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    );
                                                })}
                                            </SimpleGrid>
                                        ) : (
                                            <VStack gap={4} align="stretch">
                                                {filteredAndSortedSurveys.map((survey) => {
                                                    const priority = getSurveyPriority(survey);
                                                    const priorityColor = getPriorityColor(priority);
                                                    
                                                    return (
                                                    <Card.Root key={survey.id} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm"
                                                        _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                                                        transition="all 0.3s ease"
                                                    >
                                                        <Card.Body p={6}>
                                                            <HStack justify="space-between" align="start">
                                                                <VStack align="start" gap={3} flex="1">
                                                                    <HStack justify="space-between" w="full" align="start">
                                                                        <VStack align="start" gap={2}>
                                                                            <HStack gap={3} align="center">
                                                                                <Heading size="md" color="gray.800">
                                                                                    {survey.title}
                                                                                </Heading>
                                                                                <Badge
                                                                                    colorPalette={
                                                                                        survey.status === 'active' ? 'green' :
                                                                                        survey.status === 'draft' ? 'yellow' :
                                                                                        survey.status === 'closed' ? 'gray' : 'blue'
                                                                                    }
                                                                                    variant="solid"
                                                                                    px={3}
                                                                                    py={1}
                                                                                    borderRadius="full"
                                                                                    fontSize="xs"
                                                                                >
                                                                                    {survey.status === 'active' ? 'Active' :
                                                                                     survey.status === 'draft' ? 'Draft' :
                                                                                     survey.status === 'closed' ? 'Closed' : 'Active'}
                                                                                </Badge>
                                                                                {survey.survey_type && (
                                                                                    <Badge
                                                                                        colorPalette="purple"
                                                                                        variant="outline"
                                                                                        px={2}
                                                                                        py={1}
                                                                                        borderRadius="md"
                                                                                        fontSize="xs"
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
                                                                                    </Badge>
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
                                                                    <ManagerOnly>
                                                                        <Button
                                                                            size="sm"
                                                                            bg="blue.600"
                                                                            color="white"
                                                                            _hover={{ bg: "blue.700" }}
                                                                            onClick={() => handleViewSurveyStats(survey.id)}
                                                                        >
                                                                            <BarChart3 size={16} />
                                                                            View Survey
                                                                        </Button>
                                                                    </ManagerOnly>
                                                                    <AssociateOnly>
                                                                        <Button
                                                                            size="sm"
                                                                            bg="green.600"
                                                                            color="white"
                                                                            _hover={{ bg: "green.700" }}
                                                                            onClick={() => handleSubmitSurvey(survey.id)}
                                                                        >
                                                                            <FileText size={16} />
                                                                            Submit Survey
                                                                        </Button>
                                                                    </AssociateOnly>
                                                                    <RequireSurveyDelete>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            borderColor="red.600"
                                                                            color="red.600"
                                                                            _hover={{ bg: "red.50" }}
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
                                                    );
                                                })}
                                            </VStack>
                                        )}
                                    </Box>
                                </Card.Body>
                            </Card.Root>
                        )}

                        {/* Pagination Footer */}
                        {!loading && !error && surveys.length > 0 && (
                            <Box mt={8}>
                                <HStack justify="center" gap={4} flexWrap="wrap" w="full">
                                    <HStack gap={2}>
                                        <Text fontSize="sm" color="gray.600">Page size:</Text>
                                        <select
                                            value={pageSize}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setPageSize(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                backgroundColor: 'white',
                                                color: '#4a5568',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value={5}>5 per page</option>
                                            <option value={10}>10 per page</option>
                                            <option value={20}>20 per page</option>
                                            <option value={50}>50 per page</option>
                                        </select>
                                    </HStack>
                                    
                                    <HStack gap={2}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={!hasPrevious || loading}
                                            borderColor="blue.600"
                                            color="blue.600"
                                            _hover={{ bg: "blue.50" }}
                                        >
                                            Previous
                                        </Button>
                                        <Text fontSize="sm" color="gray.600" px={2}>
                                            Page {currentPage}
                                        </Text>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={!hasNext || loading}
                                            borderColor="blue.600"
                                            color="blue.600"
                                            _hover={{ bg: "blue.50" }}
                                        >
                                            Next
                                        </Button>
                                    </HStack>
                                </HStack>
                            </Box>
                        )}
                    </VStack>
                </Box>
            </Box>
        </AppLayout>
    );
}
