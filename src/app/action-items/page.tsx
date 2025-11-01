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
    Textarea
} from '@chakra-ui/react';
import { 
    CheckCircle, 
    Clock, 
    Plus, 
    User, 
    Calendar, 
    Target,
    AlertCircle,
    TrendingUp,
    Filter,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Star,
    Flag,
    Users,
    Activity,
    CheckCircle2,
    X
} from 'lucide-react';
import { actionItemApi, ActionItem, ActionItemsPaginatedResponse, ActionItemsQueryParams } from '@/services';
import { formatDate } from '@/utils/date';
import { AppLayout } from '@/components/layouts/AppLayout';

export default function ActionItemsPage() {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'created_at' | 'priority' | 'status' | 'title'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [newActionItem, setNewActionItem] = useState({
        title: '',
        action: '',
        status: 'Pending' as 'Pending' | 'Completed',
        priority: 'Medium' as 'Low' | 'Medium' | 'High',
        assignedTo: '',
        assignedToEmail: '',
        dueDate: '',
        hrAccess: false,
        employeeAccess: false,
        department: '',
        tags: [] as string[]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    // Fetch action items with pagination
    const fetchActionItems = async (params?: ActionItemsQueryParams) => {
        try {
            setLoading(true);
            const response: ActionItemsPaginatedResponse = await actionItemApi.getActionItems(params);
            setActionItems(response.results.action_items || []);
            setTotalCount(response.count);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
            setError(null);
        } catch (err) {
            console.error('Error fetching action items:', err);
            setError('Failed to load action items. Please try again.');
            setActionItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params: ActionItemsQueryParams = {
            page: currentPage,
            page_size: pageSize
        };
        if (statusFilter) {
            params.status = statusFilter;
        }
        fetchActionItems(params);
    }, [currentPage, pageSize, statusFilter]);

    // Helper functions
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'red';
            case 'Medium': return 'orange';
            case 'Low': return 'green';
            default: return 'gray';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'High': return <AlertCircle size={16} />;
            case 'Medium': return <Clock size={16} />;
            case 'Low': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const sortActionItems = (items: ActionItem[]) => {
        return [...items].sort((a, b) => {
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
                case 'priority':
                    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    aValue = priorityOrder[(a.priority || 'Medium') as keyof typeof priorityOrder] || 0;
                    bValue = priorityOrder[(b.priority || 'Medium') as keyof typeof priorityOrder] || 0;
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

    const filteredAndSortedItems = sortActionItems(
        actionItems.filter(item => {
            const matchesSearch = !searchQuery || 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.action.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = !statusFilter || item.status === statusFilter;
            const matchesPriority = !priorityFilter || (item.priority || 'Medium') === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        })
    );

    const handleCreateActionItem = async () => {
        if (!newActionItem.title.trim() || !newActionItem.action.trim()) {
            return;
        }

        try {
            const createdItem = await actionItemApi.createActionItem({
                title: newActionItem.title,
                action: newActionItem.action,
                status: newActionItem.status,
                assigned_to: { id: 1, username: 'current_user', email: 'user@example.com', first_name: 'Current', last_name: 'User' }
            });
            setActionItems(prev => [createdItem, ...prev]);
            setNewActionItem({ 
                title: '', 
                action: '', 
                status: 'Pending', 
                priority: 'Medium',
                assignedTo: '',
                assignedToEmail: '',
                dueDate: '',
                hrAccess: false,
                employeeAccess: false,
                department: '',
                tags: []
            });
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error creating action item:', err);
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

    const handleDeleteActionItem = async (id: number) => {
        try {
            await actionItemApi.deleteActionItem(id);
            setActionItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting action item:', err);
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Completed' ? 'green' : 'orange';
    };

    // Analytics
    const completedItems = actionItems.filter(item => item.status === 'Completed').length;
    const pendingItems = actionItems.filter(item => item.status === 'Pending').length;
    const completionRate = actionItems.length > 0 ? Math.round((completedItems / actionItems.length) * 100) : 0;

    if (loading) {
        return (
            <AppLayout>
                <Flex justify="center" align="center" minH="60vh">
                    <VStack gap={4}>
                        <Spinner size="xl" color="purple.500" />
                        <Text color="gray.600" fontSize="lg">
                            Loading action items...
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
            <Box w="full" h="100vh" bg="gradient-to-br from-teal.50 to-blue.50" overflow="auto">
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
                                <Box bg="gradient-to-r from-teal.600 to-blue.600" p={6}>
                                    <HStack justify="space-between" flexWrap="wrap">
                                        <VStack align="start" gap={2}>
                                            <HStack gap={3}>
                                                <Box p={3} bg="white" borderRadius="xl" shadow="sm">
                                                    <Target size={32} color="#0d9488" />
                                                </Box>
                                                <VStack align="start" gap={1}>
                                                    <Heading size="2xl" color="white" fontWeight="bold">
                                                        Action Items
                                                    </Heading>
                                                    <Text color="teal.600" fontSize="lg">
                                                        Track progress and drive results
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            <Text fontSize="sm" color="teal.600">
                                                {searchQuery ? (
                                                    `${filteredAndSortedItems.length} of ${totalCount} items matching "${searchQuery}"`
                                                ) : (
                                                    `Managing ${totalCount} action items across your team`
                                                )}
                                            </Text>
                                        </VStack>

                                        {/* Enhanced Action Buttons */}
                                        <VStack gap={3} align="end">
                                            <Button 
                                                onClick={() => setShowCreateForm(!showCreateForm)}
                                                bg="white"
                                                color="teal.600"
                                                _hover={{ 
                                                    bg: "teal.50",
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
                                                Create Action Plan
                                            </Button>
                                            <HStack gap={2}>
                                                <Button
                                                    aria-label="Export action items"
                                                    bg="white"
                                                    color="teal.600"
                                                    _hover={{ bg: "teal.50" }}
                                                    borderRadius="lg"
                                                    size="sm"
                                                    p={2}
                                                    minW="auto"
                                                >
                                                    <Activity size={16} />
                                                </Button>
                                                <Button
                                                    aria-label="Analytics"
                                                    bg="white"
                                                    color="teal.600"
                                                    _hover={{ bg: "teal.50" }}
                                                    borderRadius="lg"
                                                    size="sm"
                                                    p={2}
                                                    minW="auto"
                                                >
                                                    <TrendingUp size={16} />
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
                                                        placeholder="Search action items by title or description..."
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
                                                            borderColor: "teal.400",
                                                            boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)"
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
                                                {(statusFilter || priorityFilter) && (
                                                    <Badge colorPalette="teal" ml={2} borderRadius="full">
                                                        {[statusFilter, priorityFilter].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>

                                            {/* View Mode Toggle */}
                                            <HStack bg="white" borderRadius="xl" p={1} border="2px solid" borderColor="gray.200">
                                                <Button
                                                    size="sm"
                                                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                                                    colorPalette={viewMode === 'grid' ? 'teal' : 'gray'}
                                                    onClick={() => setViewMode('grid')}
                                                    borderRadius="lg"
                                                >
                                                    Grid
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                                                    colorPalette={viewMode === 'list' ? 'teal' : 'gray'}
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
                                                                    setPriorityFilter('');
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
                                                                    {['Pending', 'Completed'].map(status => (
                                                                        <Button
                                                                            key={status}
                                                                            size="sm"
                                                                            variant={statusFilter === status ? 'solid' : 'outline'}
                                                                            colorPalette={statusFilter === status ? 'teal' : 'gray'}
                                                                            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                                                                            justifyContent="start"
                                                                            w="full"
                                                                        >
                                                                            {status === 'Pending' ? '🕒' : '✅'} {status}
                                                                        </Button>
                                                                    ))}
                                                                </VStack>
                                                            </VStack>

                                                            {/* Priority Filter */}
                                                            <VStack align="start" gap={2}>
                                                                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                                                    Priority
                                                                </Text>
                                                                <VStack align="start" gap={2}>
                                                                    {['High', 'Medium', 'Low'].map(priority => (
                                                                        <Button
                                                                            key={priority}
                                                                            size="sm"
                                                                            variant={priorityFilter === priority ? 'solid' : 'outline'}
                                                                            colorPalette={priorityFilter === priority ? 'teal' : 'gray'}
                                                                            onClick={() => setPriorityFilter(priorityFilter === priority ? '' : priority)}
                                                                            justifyContent="start"
                                                                            w="full"
                                                                        >
                                                                            {getPriorityIcon(priority)} {priority}
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
                                                                        { value: 'priority', label: 'Priority' },
                                                                        { value: 'status', label: 'Status' },
                                                                        { value: 'title', label: 'Title' }
                                                                    ].map(option => (
                                                                        <Button
                                                                            key={option.value}
                                                                            size="sm"
                                                                            variant={sortBy === option.value ? 'solid' : 'outline'}
                                                                            colorPalette={sortBy === option.value ? 'teal' : 'gray'}
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
                                                                            colorPalette="teal"
                                                                            onClick={() => setSortOrder('asc')}
                                                                        >
                                                                            Ascending
                                                                        </Button>
                                                                        <Button
                                                                            size="xs"
                                                                            variant={sortOrder === 'desc' ? 'solid' : 'outline'}
                                                                            colorPalette="teal"
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

                        {/* Loading State */}
                        {loading && (
                            <Box textAlign="center" py={12}>
                                <Spinner size="xl" color="blue.500" mb={4} />
                                <Text fontSize="lg" color="gray.600">Loading action items...</Text>
                            </Box>
                        )}

                        {/* Error State */}
                        {error && (
                            <Box textAlign="center" py={12}>
                                <Text fontSize="lg" color="red.500" mb={4}>{error}</Text>
                                <Button onClick={() => window.location.reload()} bg="blue.600" color="white" _hover={{ bg: "blue.700" }}>
                                    Retry
                                </Button>
                            </Box>
                        )}

                        {/* Stats Section - Compact Design */}
                        {!loading && !error && (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} maxW="1000px">
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="blue.100" p={2} borderRadius="lg">
                                            <Clock color="#3182ce" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                Total Items
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                                {actionItems.length}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="orange.100" p={2} borderRadius="lg">
                                            <Clock color="#ea580c" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                Pending
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                                {pendingItems}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="green.100" p={2} borderRadius="lg">
                                            <CheckCircle color="#16a34a" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                Completed
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                                {completedItems}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Body p={4}>
                                    <HStack gap={3} align="center">
                                        <Box bg="purple.100" p={2} borderRadius="lg">
                                            <CheckCircle color="#9333ea" size={20} />
                                        </Box>
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                Completion Rate
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                                {completionRate}%
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                        </SimpleGrid>
                        )}

                        {/* Create Form */}
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
                                <Card.Header bg="gradient-to-r from-blue.50 to-purple.50" borderTopRadius="xl" px={6}>
                                    <HStack justify="space-between" align="center">
                                        <VStack align="start" gap={1}>
                                            <Heading size="lg" color="gray.800" fontWeight="bold">
                                                Create Plan of Action
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm">
                                                Define actionable steps and assign responsibilities
                                            </Text>
                                        </VStack>
                                        <Box p={3} bg="blue.100" borderRadius="full">
                                            <Plus size={24} color="#3182ce" />
                                        </Box>
                                    </HStack>
                                </Card.Header>
                                <Card.Body p={8}>
                                    <VStack gap={6} align="stretch">
                                        <Box>
                                            <Text fontWeight="semibold" mb={3} color="gray.700" fontSize="sm">
                                                Action Title *
                                            </Text>
                                            <Input
                                                value={newActionItem.title}
                                                onChange={(e) => setNewActionItem(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g., Improve Team Communication Process"
                                                size="lg"
                                                bg="white"
                                                color="gray.800"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "blue.400",
                                                    boxShadow: "0 0 0 1px #3182ce"
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                _placeholder={{ color: "gray.400" }}
                                                borderRadius="lg"
                                            />
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold" mb={3} color="gray.700" fontSize="sm">
                                                Action Details *
                                            </Text>
                                            <Textarea
                                                value={newActionItem.action}
                                                onChange={(e) => setNewActionItem(prev => ({ ...prev, action: e.target.value }))}
                                                placeholder="Describe the specific steps, timeline, and expected outcomes..."
                                                rows={4}
                                                bg="white"
                                                color="gray.800"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "blue.400",
                                                    boxShadow: "0 0 0 1px #3182ce"
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                _placeholder={{ color: "gray.400" }}
                                                borderRadius="lg"
                                                resize="vertical"
                                            />
                                        </Box>
                                        {/* Assignment Section */}
                                        <Box p={4} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                            <Text fontWeight="bold" mb={4} color="gray.800" fontSize="md">
                                                📋 Assignment Details
                                            </Text>
                                            <VStack gap={4} align="stretch">
                                                {/* Assignee Information */}
                                                <HStack gap={4} align="start">
                                                    <Box flex="1">
                                                        <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                                                            Assign To *
                                                        </Text>
                                                        <Input
                                                            value={newActionItem.assignedTo}
                                                            onChange={(e) => setNewActionItem(prev => ({ ...prev, assignedTo: e.target.value }))}
                                                            placeholder="Enter team member name"
                                                            size="md"
                                                            bg="white"
                                                            color="gray.800"
                                                            border="2px solid"
                                                            borderColor="gray.200"
                                                            _focus={{
                                                                borderColor: "teal.400",
                                                                boxShadow: "0 0 0 1px #14b8a6"
                                                            }}
                                                            _hover={{ borderColor: "gray.300" }}
                                                            _placeholder={{ color: "gray.400" }}
                                                            borderRadius="lg"
                                                        />
                                                    </Box>
                                                    <Box flex="1">
                                                        <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                                                            Email Address
                                                        </Text>
                                                        <Input
                                                            value={newActionItem.assignedToEmail}
                                                            onChange={(e) => setNewActionItem(prev => ({ ...prev, assignedToEmail: e.target.value }))}
                                                            placeholder="assignee@company.com"
                                                            type="email"
                                                            size="md"
                                                            bg="white"
                                                            color="gray.800"
                                                            border="2px solid"
                                                            borderColor="gray.200"
                                                            _focus={{
                                                                borderColor: "teal.400",
                                                                boxShadow: "0 0 0 1px #14b8a6"
                                                            }}
                                                            _hover={{ borderColor: "gray.300" }}
                                                            _placeholder={{ color: "gray.400" }}
                                                            borderRadius="lg"
                                                        />
                                                    </Box>
                                                </HStack>

                                                {/* Priority and Due Date */}
                                                <HStack gap={4} align="start">
                                                    <Box flex="1">
                                                        <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                                                            Priority Level
                                                        </Text>
                                                        <select
                                                            value={newActionItem.priority}
                                                            onChange={(e) => setNewActionItem(prev => ({ ...prev, priority: e.target.value as any }))}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 14px',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e2e8f0',
                                                                backgroundColor: 'white',
                                                                fontSize: '14px',
                                                                color: '#374151',
                                                                outline: 'none',
                                                                appearance: 'none',
                                                                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                                backgroundPosition: 'right 12px center',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundSize: '16px'
                                                            }}
                                                        >
                                                            <option value="Low">🟢 Low - Can be done later</option>
                                                            <option value="Medium">🟡 Medium - Normal priority</option>
                                                            <option value="High">🔴 High - Urgent attention needed</option>
                                                        </select>
                                                    </Box>
                                                    <Box flex="1">
                                                        <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                                                            Due Date
                                                        </Text>
                                                        <Input
                                                            value={newActionItem.dueDate}
                                                            onChange={(e) => setNewActionItem(prev => ({ ...prev, dueDate: e.target.value }))}
                                                            type="date"
                                                            size="md"
                                                            bg="white"
                                                            color="gray.800"
                                                            border="2px solid"
                                                            borderColor="gray.200"
                                                            _focus={{
                                                                borderColor: "teal.400",
                                                                boxShadow: "0 0 0 1px #14b8a6"
                                                            }}
                                                            _hover={{ borderColor: "gray.300" }}
                                                            borderRadius="lg"
                                                        />
                                                    </Box>
                                                </HStack>

                                                {/* Department and Status */}
                                                <HStack gap={4} align="start">
                                                    <Box flex="1">
                                                        <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                                                            Department
                                                        </Text>
                                                        <select
                                                            value={newActionItem.department}
                                                            onChange={(e) => setNewActionItem(prev => ({ ...prev, department: e.target.value }))}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 14px',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e2e8f0',
                                                                backgroundColor: 'white',
                                                                fontSize: '14px',
                                                                color: '#374151',
                                                                outline: 'none',
                                                                appearance: 'none',
                                                                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                                backgroundPosition: 'right 12px center',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundSize: '16px'
                                                            }}
                                                        >
                                                            <option value="">Select Department</option>
                                                            <option value="HR">👥 Human Resources</option>
                                                            <option value="IT">💻 Information Technology</option>
                                                            <option value="Finance">💰 Finance</option>
                                                            <option value="Marketing">📢 Marketing</option>
                                                            <option value="Operations">⚙️ Operations</option>
                                                            <option value="Sales">💼 Sales</option>
                                                            <option value="Management">🎯 Management</option>
                                                        </select>
                                                    </Box>
                                                    <Box flex="1">
                                                        <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                                                            Initial Status
                                                        </Text>
                                                        <select
                                                            value={newActionItem.status}
                                                            onChange={(e) => setNewActionItem(prev => ({ ...prev, status: e.target.value as any }))}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 14px',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e2e8f0',
                                                                backgroundColor: 'white',
                                                                fontSize: '14px',
                                                                color: '#374151',
                                                                outline: 'none',
                                                                appearance: 'none',
                                                                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                                backgroundPosition: 'right 12px center',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundSize: '16px'
                                                            }}
                                                        >
                                                            <option value="Pending">🕒 Pending - Ready to start</option>
                                                            <option value="Completed">✅ Completed - Already done</option>
                                                        </select>
                                                    </Box>
                                                </HStack>
                                            </VStack>
                                        </Box>

                                        {/* Permission Controls */}
                                        <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                                            <Text fontWeight="bold" mb={3} color="gray.800" fontSize="md">
                                                🔐 Access Permissions
                                            </Text>
                                            <VStack gap={3} align="stretch">
                                                <HStack gap={4}>
                                                    <Box>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={newActionItem.hrAccess}
                                                                onChange={(e) => setNewActionItem(prev => ({ ...prev, hrAccess: e.target.checked }))}
                                                                style={{
                                                                    width: '16px',
                                                                    height: '16px',
                                                                    accentColor: '#14b8a6'
                                                                }}
                                                            />
                                                            <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                                👥 HR Team Access
                                                            </Text>
                                                        </label>
                                                        <Text fontSize="xs" color="gray.600" ml={6}>
                                                            Allow HR team to view this action plan
                                                        </Text>
                                                    </Box>
                                                    <Box>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={newActionItem.employeeAccess}
                                                                onChange={(e) => setNewActionItem(prev => ({ ...prev, employeeAccess: e.target.checked }))}
                                                                style={{
                                                                    width: '16px',
                                                                    height: '16px',
                                                                    accentColor: '#14b8a6'
                                                                }}
                                                            />
                                                            <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                                👤 Employee Access
                                                            </Text>
                                                        </label>
                                                        <Text fontSize="xs" color="gray.600" ml={6}>
                                                            Allow employees to view this action plan
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                                <Box p={3} bg="blue.100" borderRadius="md">
                                                    <Text fontSize="xs" color="blue.800">
                                                        💡 <strong>Note:</strong> Managers always have full access to all action plans. These settings control additional visibility for HR team and general employees.
                                                    </Text>
                                                </Box>
                                            </VStack>
                                        </Box>
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
                                                    onClick={handleCreateActionItem}
                                                    bg="blue.600"
                                                    color="white"
                                                    size="lg"
                                                    disabled={!newActionItem.title.trim() || !newActionItem.action.trim() || !newActionItem.assignedTo.trim()}
                                                    _hover={{ 
                                                        bg: "blue.700",
                                                        transform: "translateY(-2px)", 
                                                        shadow: "lg" 
                                                    }}
                                                    transition="all 0.2s ease"
                                                    px={8}
                                                >
                                                    <Plus size={20} />
                                                    Create Action Plan
                                                </Button>
                                            </HStack>
                                        </Box>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        )}

                        {/* Action Items List */}
                        {!loading && !error && (
                            <Card.Root bg="white" shadow="sm" borderRadius="xl">
                                <Card.Header p={6}>
                                    <HStack justify="space-between">
                                        <VStack align="start" gap={1}>
                                            <Heading size="lg" color="gray.800">
                                                Action Items Management
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm">
                                                {statusFilter ? `Filtered by: ${statusFilter}` : 'Track and manage all action items'}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Card.Header>
                                <Card.Body p={6}>
                                    <VStack gap={4} align="stretch">
                                        {actionItems.length === 0 ? (
                                            <Box textAlign="center" py={8}>
                                                <Text color="gray.500" fontSize="lg">
                                                    {statusFilter ? `No ${statusFilter.toLowerCase()} action items found.` : 'No action items found. Create your first plan of action to get started.'}
                                                </Text>
                                            </Box>
                                        ) : (
                                            actionItems.map((item) => (
                                                <Card.Root key={item.id} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm"
                                                    _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                                                    transition="all 0.3s ease"
                                                >
                                                    <Card.Body p={6}>
                                                        <HStack justify="space-between" align="start">
                                                            <VStack align="start" gap={3} flex="1">
                                                                <HStack gap={3} align="center">
                                                                    <Heading size="md" color="gray.800">
                                                                        {item.title}
                                                                    </Heading>
                                                                    <Badge
                                                                        colorPalette={getStatusColor(item.status)}
                                                                        variant="solid"
                                                                        px={3}
                                                                        py={1}
                                                                        borderRadius="full"
                                                                        fontSize="xs"
                                                                    >
                                                                        {item.status}
                                                                    </Badge>
                                                                </HStack>
                                                                <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                                                                    {item.action}
                                                                </Text>
                                                                <HStack gap={6} fontSize="sm" color="gray.500" wrap="wrap">
                                                                    <HStack gap={2}>
                                                                        <User size={16} />
                                                                        <Text>Assigned: {(item.assigned_to?.first_name && item.assigned_to?.last_name) ? `${item.assigned_to.first_name} ${item.assigned_to.last_name}` : item.assigned_to?.username || 'Unassigned'}</Text>
                                                                    </HStack>
                                                                    <HStack gap={2}>
                                                                        <Calendar size={16} />
                                                                        <Text>Created: {formatDate(item.created_at)}</Text>
                                                                    </HStack>
                                                                </HStack>
                                                            </VStack>
                                                            <HStack gap={2}>
                                                                <select
                                                                    value={item.status}
                                                                    onChange={(e) => handleStatusChange(item.id, e.target.value as 'Pending' | 'Completed')}
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
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Completed">Completed</option>
                                                                </select>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    borderColor="red.600"
                                                                    color="red.600"
                                                                    _hover={{ bg: "red.50" }}
                                                                    onClick={() => handleDeleteActionItem(item.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </HStack>
                                                        </HStack>
                                                    </Card.Body>
                                                </Card.Root>
                                            ))
                                        )}
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        )}

                        {/* Pagination Footer */}
                        {!loading && !error && actionItems.length > 0 && (
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
                                            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
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
