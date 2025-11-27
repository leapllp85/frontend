'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Card, SimpleGrid, Badge } from '@chakra-ui/react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Users, Target, Heart, Lightbulb, TrendingUp, MessageSquare, BarChart3, BookOpen, Zap, Star } from 'lucide-react';

export default function MySpace() {
    const metrics = [
        { label: 'Engagement', value: 87, icon: Users, color: '#3b82f6', trend: '+5%' },
        { label: 'Goals', value: 92, icon: Target, color: '#10b981', trend: '+8%' },
        { label: 'Satisfaction', value: 85, icon: Heart, color: '#ec4899', trend: '+3%' },
        { label: 'Innovation', value: 78, icon: Lightbulb, color: '#f59e0b', trend: '+12%' }
    ];

    const technicalRecommendations = [
        {
            skill: 'React & TypeScript',
            level: 'Advanced',
            projects: ['EWS Frontend', 'Dashboard'],
            priority: 'High',
            reason: 'Core technology in 2 active projects',
            color: 'blue'
        },
        {
            skill: 'Node.js & Express',
            level: 'Intermediate',
            projects: ['API Gateway', 'Microservices'],
            priority: 'High',
            reason: 'Backend infrastructure scaling needed',
            color: 'green'
        },
        {
            skill: 'PostgreSQL Optimization',
            level: 'Intermediate',
            projects: ['EWS Backend', 'Analytics'],
            priority: 'Medium',
            reason: 'Performance bottlenecks identified',
            color: 'purple'
        },
        {
            skill: 'Docker & Kubernetes',
            level: 'Beginner',
            projects: ['All Projects'],
            priority: 'High',
            reason: 'DevOps modernization initiative',
            color: 'orange'
        },
        {
            skill: 'AWS Cloud Services',
            level: 'Intermediate',
            projects: ['Infrastructure'],
            priority: 'Medium',
            reason: 'Cloud migration in progress',
            color: 'cyan'
        }
    ];

    const articles = [
        { 
            title: 'High-Performing Teams', 
            category: 'Team', 
            time: '8 min', 
            stats: '94% Success', 
            color: 'blue', 
            icon: Users,
            description: 'Transform your team with proven strategies for exceptional results.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80'
        },
        { 
            title: 'Effective Delegation', 
            category: 'Skills', 
            time: '6 min', 
            stats: '3x Productivity', 
            color: 'purple', 
            icon: TrendingUp,
            description: 'Empower your team and multiply your leadership impact.',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80'
        },
        { 
            title: 'Innovation & Creativity', 
            category: 'Innovation', 
            time: '10 min', 
            stats: '+45% Ideas', 
            color: 'orange', 
            icon: Lightbulb,
            description: 'Create environments where breakthrough ideas emerge.',
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80'
        },
        { 
            title: 'Emotional Intelligence', 
            category: 'Growth', 
            time: '7 min', 
            stats: '89% Engagement', 
            color: 'pink', 
            icon: Heart,
            description: 'Build stronger relationships through empathy.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
        },
        { 
            title: 'Data-Driven Decisions', 
            category: 'Strategy', 
            time: '9 min', 
            stats: '2x ROI', 
            color: 'green', 
            icon: BarChart3,
            description: 'Leverage analytics for informed decisions.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'
        },
        { 
            title: 'Clear Communication', 
            category: 'Communication', 
            time: '5 min', 
            stats: '76% Clarity', 
            color: 'teal', 
            icon: MessageSquare,
            description: 'Align your team with effective messaging.',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80'
        }
    ];

    const newsItems = [
        '🎯 Workshop: Agile Leadership',
        '📊 Q4 Survey: 94% Satisfaction!',
        '🌟 Top Managers Announced!',
        '📚 New Research Available',
        '💡 Webinar: Dec 15',
        '🏆 Excellence Awards Open!'
    ];

    return (
        <AppLayout>
            <Box w="full" h="100vh" bg="white" overflow="hidden">
                {/* Performance Header */}
                <Box 
                    bg="white"
                    borderBottom="2px solid"
                    borderColor="gray.100"
                    px={8} 
                    py={4}
                >
                    <HStack justify="space-between" align="center">
                        <Heading size="lg" color="gray.900" fontWeight="700" letterSpacing="tight">
                            My Leadership Dashboard
                        </Heading>
                        <HStack gap={8}>
                            {metrics.map((metric, idx) => {
                                const Icon = metric.icon;
                                return (
                                    <VStack key={idx} gap={0} align="center">
                                        <HStack gap={1.5}>
                                            <Icon size={14} color="#6b7280" strokeWidth={2} />
                                            <Text fontSize="2xl" fontWeight="700" color="gray.900" lineHeight="1">
                                                {metric.value}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.500" fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                                            {metric.label}
                                        </Text>
                                    </VStack>
                                );
                            })}
                        </HStack>
                    </HStack>
                </Box>

                {/* Main Layout - Two Segments */}
                <HStack gap={0} h="calc(100vh - 80px)" align="stretch">
                    {/* Left Segment: Leadership Articles */}
                    <VStack flex="1.2" h="full" bg="#fafbfc" p={6} gap={4} align="stretch" overflow="hidden">
                        <Box>
                            <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={1}>
                                Professional Development
                            </Text>
                            <Heading size="lg" color="gray.900" fontWeight="700" letterSpacing="tight">
                                Leadership Resources
                            </Heading>
                        </Box>
                        <SimpleGrid columns={2} gap={2} flex="1">
                            {articles.map((article, idx) => {
                                const Icon = article.icon;
                                return (
                                    <Card.Root
                                        key={idx}
                                        bg="white"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{ shadow: "lg", borderColor: "gray.300" }}
                                        border="1px solid"
                                        borderColor="gray.200"
                                    >
                                        {/* Thumbnail Image */}
                                        <Box
                                            h="100px"
                                            backgroundImage={`url('${article.image}')`}
                                            backgroundSize="cover"
                                            backgroundPosition="center"
                                        />

                                        {/* Content */}
                                        <Card.Body p={3}>
                                            <VStack align="stretch" gap={1.5}>
                                                <Heading size="xs" color="gray.800" fontWeight="600" lineHeight="1.3">
                                                    {article.title}
                                                </Heading>
                                                <Text fontSize="xs" color="gray.500" lineHeight="1.4"
                                                    css={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {article.description}
                                                </Text>
                                                <Text fontSize="2xs" color="gray.400" mt={0.5}>
                                                    {article.time}
                                                </Text>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                );
                            })}
                        </SimpleGrid>
                    </VStack>

                    {/* Right Segment: Technical Competency Recommendations */}
                    <VStack flex="1" h="full" bg="white" p={6} gap={4} align="stretch" overflow="hidden" borderLeft="1px solid" borderColor="gray.200">
                        <Box>
                            <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={1}>
                                Skills & Growth
                            </Text>
                            <Heading size="lg" color="gray.900" fontWeight="700" letterSpacing="tight">
                                Recommended Focus Areas
                            </Heading>
                        </Box>

                        <VStack gap={2.5} align="stretch" flex="1" overflow="hidden">
                            {technicalRecommendations.map((rec, idx) => (
                                <Box
                                    key={idx}
                                    bg="gray.50"
                                    borderRadius="lg"
                                    p={4}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                    _hover={{ 
                                        bg: "gray.100",
                                        borderColor: "gray.300"
                                    }}
                                    border="1px solid"
                                    borderColor="gray.200"
                                    position="relative"
                                >
                                    {rec.priority === 'High' && (
                                        <Box
                                            position="absolute"
                                            top={3}
                                            right={3}
                                            w={2}
                                            h={2}
                                            bg="red.500"
                                            borderRadius="full"
                                        />
                                    )}
                                    <VStack align="stretch" gap={2}>
                                        <Heading size="sm" color="gray.900" fontWeight="700" letterSpacing="tight">
                                            {rec.skill}
                                        </Heading>

                                        <HStack gap={2}>
                                            <Badge bg="white" color="gray.700" fontSize="xs" px={2} py={1} fontWeight="600" borderRadius="md">
                                                {rec.level}
                                            </Badge>
                                            <Text fontSize="xs" color="gray.500" fontWeight="500">
                                                {rec.projects.join(' • ')}
                                            </Text>
                                        </HStack>

                                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                                            {rec.reason}
                                        </Text>
                                    </VStack>
                                </Box>
                            ))}
                        </VStack>
                    </VStack>
                </HStack>

                {/* CSS */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                    `
                }} />
            </Box>
        </AppLayout>
    );
}
