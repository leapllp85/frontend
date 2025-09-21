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
    Textarea,
    Select,
    Link
} from '@chakra-ui/react';
import { CheckCircle, Clock, Plus, User, Calendar } from 'lucide-react';
import { actionItemApi, ActionItem } from '@/services';
import { formatDate } from '@/utils/date';
import { AppLayout } from '@/components/layouts/AppLayout';

export default function ActionItemsPage() {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newActionItem, setNewActionItem] = useState({
        title: '',
        action: '',
        status: 'Pending' as 'Pending' | 'Completed'
    });

    useEffect(() => {
        const fetchActionItems = async () => {
            try {
                setLoading(true);
                const items = await actionItemApi.getActionItems();
                // @ts-ignore
                setActionItems(items.action_items);
                setError(null);
            } catch (err) {
                console.error('Error fetching action items:', err);
                setError('Failed to load action items. Please try again.');
                setActionItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActionItems();
    }, []);

    const handleCreateActionItem = async () => {
        if (!newActionItem.title.trim() || !newActionItem.action.trim()) {
            return;
        }

        try {
            const createdItem = await actionItemApi.createActionItem({
                title: newActionItem.title,
                action: newActionItem.action,
                status: newActionItem.status,
                assigned_to: { id: 1, username: 'current_user', email: 'user@example.com', first_name: 'Current', last_name: 'User' } // This should come from auth context
            });
            setActionItems(prev => [createdItem, ...prev]);
            setNewActionItem({ title: '', action: '', status: 'Pending' });
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
                {/* Header */}
                {/* <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6 }}>
                    <VStack align="start" gap={2}>
                        <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="bold">
                            Action Items
                        </Heading>
                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                            Track and manage your action items
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
                                <Box p={2} bg="blue.100" borderRadius="lg">
                                    <Clock size={20} color="#3182ce" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Total Items
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                                {actionItems.length}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="orange.100" borderRadius="lg">
                                    <Clock size={20} color="#ea580c" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Pending
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                                {pendingItems}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="green.100" borderRadius="lg">
                                    <CheckCircle size={20} color="#16a34a" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Completed
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="green.600">
                                {completedItems}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="purple.100" borderRadius="lg">
                                    <CheckCircle size={20} color="#9333ea" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Completion Rate
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                                {completionRate}%
                            </Text>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* Action Items List */}
                <Card.Root bg="white" shadow="sm" borderRadius="xl">
                    <Card.Header p={6}>
                        <Heading size="lg" color="gray.800">
                            Action Items
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Track action items
                        </Text>
                    </Card.Header>
                    <Card.Body p={6}>
                        <VStack gap={4} align="stretch">
                            {actionItems.length === 0 ? (
                                <Box textAlign="center" py={8}>
                                    <Text color="gray.500" fontSize="lg">
                                        No action items found.
                                    </Text>
                                </Box>
                            ) : (
                                actionItems.map((item) => (
                                    <Card.Root key={item.id} bg="gray.50" borderRadius="lg">
                                        <Card.Body p={4}>
                                            <HStack justify="space-between" align="start">
                                                <VStack align="start" gap={2} flex="1">
                                                    <HStack gap={2}>
                                                        <Heading size="md" color="gray.800">
                                                            {item.title}
                                                        </Heading>
                                                        <Badge colorPalette={getStatusColor(item.status)} size="sm">
                                                            {item.status}
                                                        </Badge>
                                                    </HStack>
                                                    <HStack gap={4} fontSize="xs" color="gray.500">
                                                        <HStack gap={1}>
                                                            <User size={14} />
                                                            <Text>{(item.assigned_to?.first_name && item.assigned_to?.last_name) ? `${item.assigned_to.first_name} ${item.assigned_to.last_name}` : item.assigned_to?.username || 'Unknown User'}</Text>
                                                        </HStack>
                                                        <HStack gap={1}>
                                                            <Calendar size={14} />
                                                            <Text>Created: {formatDate(item.created_at)}</Text>
                                                        </HStack>
                                                    </HStack>
                                                </VStack>
                                                <HStack gap={2}>
                                                    <Link
                                                        href={item.action}
                                                        borderColor="blue"
                                                        bg="blue"
                                                        color="white"
                                                        borderWidth="1px"
                                                        borderRadius="lg"
                                                        px={2}
                                                        py={1}
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
                                                        View
                                                    </Link>
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
