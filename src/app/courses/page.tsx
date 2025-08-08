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
    Select
} from '@chakra-ui/react';
import { BookOpen, Plus, Tag, Calendar, ExternalLink, Clock } from 'lucide-react';
import { courseApi, Course, CourseCategory } from '@/services';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [totalCourses, setTotalCourses] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await courseApi.getCourses();
                console.log('Courses API Response:', response);
                
                // Handle the API response structure
                setCourses(response.courses);
                setTotalCourses(response.total_count || response.courses.length);
                setError(null);
            } catch (err) {
                console.error('Error fetching courses data:', err);
                setError('Failed to load courses. Please try again.');
                setCourses([]);
                setTotalCourses(0);
            } finally {
                setLoading(false);
            }
        };  

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryColor = (categoryName: string) => {
        const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal'];
        const index = categoryName.length % colors.length;
        return colors[index];
    };

    // Get unique categories from all courses
    const allCategories = courses.reduce((acc: string[], course) => {
        // @ts-ignore
        course.category_names.forEach(category => {
            if (!acc.includes(category)) {
                acc.push(category);
            }
        });
        return acc;
    }, []);

    const totalCategories = allCategories.length;
    const coursesByCategory = allCategories.map(category => ({
        category: category,
        // @ts-ignore
        count: courses.filter(course => course.category_names.includes(category)).length
    }));

    // Filter courses by category
    // @ts-ignore
    const filteredCourses = selectedCategory === 'all' 
        ? courses 
        : courses.filter(course => course.category_names.includes(selectedCategory));

    if (loading) {
        return (
            <Box w="full" minH="100vh" bg="gray.50" py={8} px={4}>
                <Flex justify="center" align="center" minH="60vh">
                    <VStack gap={4}>
                        <Spinner size="xl" color="purple.500" />
                        <Text color="gray.600" fontSize="lg">
                            Loading courses...
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
        <Box w="full" minH="100vh" bg="gray.50" py={8} px={4}>
            <VStack gap={8} align="stretch" maxW="7xl" mx="auto">
                {/* Header */}
                <Box textAlign="center">
                    <Heading size="2xl" color="gray.800" mb={3} fontWeight="bold">
                        Learning Courses
                    </Heading>
                    <Text color="gray.600" fontSize="lg">
                        Discover and manage learning resources for your team
                    </Text>
                </Box>

                {/* Analytics Cards */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="blue.100" borderRadius="lg">
                                    <BookOpen size={20} color="#3182ce" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Total Courses
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                                {totalCourses}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="green.100" borderRadius="lg">
                                    <Tag size={20} color="#16a34a" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Categories
                                </Text>
                            </HStack>
                            <Text fontSize="3xl" fontWeight="bold" color="green.600">
                                {totalCategories}
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="purple.100" borderRadius="lg">
                                    <BookOpen size={20} color="#9333ea" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Most Popular Category
                                </Text>
                            </HStack>
                            <Text fontSize="lg" fontWeight="bold" color="purple.600">
                                {coursesByCategory.length > 0 
                                    ? coursesByCategory.reduce((prev, current) => 
                                        prev.count > current.count ? prev : current
                                      ).category
                                    : 'N/A'
                                }
                            </Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" shadow="lg" borderRadius="xl">
                        <Card.Body p={6}>
                            <HStack gap={3} mb={4}>
                                <Box p={2} bg="orange.100" borderRadius="lg">
                                    <Clock size={20} color="#ea580c" />
                                </Box>
                                <Text fontWeight="semibold" color="gray.700">
                                    Total Course Duration
                                </Text>
                            </HStack>
                            <Text fontSize="lg" fontWeight="bold" color="orange.600">
                                {totalCourses > 0 
                                    ? `${totalCourses * 2.5}h`
                                    : '0h'
                                }
                            </Text>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* Controls */}
                <HStack justify="space-between" wrap="wrap" gap={4} color="gray.700">
                    <HStack gap={4}>
                        <Text fontWeight="semibold">Filter by Category:</Text>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All Categories</option>
                            {allCategories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </HStack>
                </HStack>

                {/* Courses Grid */}
                <Box>
                    <Heading size="lg" color="gray.800" mb={6}>
                        {selectedCategory === 'all' ? 'All Courses' : `${selectedCategory} Courses`}
                    </Heading>
                    {filteredCourses.length === 0 ? (
                        <Card.Root bg="white" shadow="lg" borderRadius="xl">
                            <Card.Body p={8}>
                                <Box textAlign="center">
                                    <Text color="gray.500" fontSize="lg">
                                        No courses found. Add your first course to get started.
                                    </Text>
                                </Box>
                            </Card.Body>
                        </Card.Root>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                            {filteredCourses.map((course) => (
                                <Card.Root key={course.id} bg="white" shadow="lg" borderRadius="xl" _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }} transition="all 0.2s">
                                    <Card.Body p={6}>
                                        <VStack align="start" gap={4}>
                                            <HStack justify="space-between" w="full" wrap="wrap">
                                                <HStack gap={2} wrap="wrap">
                                                    {/* @ts-ignore */}
                                                    {course.category_names.map((categoryName, index) => (
                                                        <Badge key={index} colorPalette={getCategoryColor(categoryName)} size="sm">
                                                            {categoryName}
                                                        </Badge>
                                                    ))}
                                                </HStack>
                                            </HStack>
                                            <Heading size="md" color="gray.800" lineClamp={2}>
                                                {course.title}
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm" lineClamp={3}>
                                                {course.description}
                                            </Text>
                                            <HStack justify="space-between" w="full" pt={2}>
                                                <Button
                                                    size="sm"
                                                    colorPalette="purple"
                                                    variant="solid"
                                                    bg="purple.700"
                                                    _hover={{ bg: "purple.800" }}
                                                    onClick={() => window.open(course.source, '_blank')}
                                                >
                                                    <ExternalLink size={16} />
                                                    View Course
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </VStack>
        </Box>
    );
}
