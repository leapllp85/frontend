'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Card, SimpleGrid, Badge } from '@chakra-ui/react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DASHBOARD_METRICS, TECHNICAL_RECOMMENDATIONS, LEADERSHIP_ARTICLES } from '@/constants';

export default function MySpace() {
    const metrics = DASHBOARD_METRICS;
    const technicalRecommendations = TECHNICAL_RECOMMENDATIONS;
    const articles = LEADERSHIP_ARTICLES.slice(0, 6); // Use first 6 articles

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
                                            <Text fontSize="1.5rem" fontWeight="700" color="gray.900" lineHeight="1">
                                                {metric.value}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="0.75rem" color="gray.500" fontWeight="500" textTransform="uppercase" letterSpacing="wide">
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
                            <Text fontSize="0.75rem" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={1}>
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
                                                <Text fontSize="0.75rem" color="gray.500" lineHeight="1.4"
                                                    css={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {article.description}
                                                </Text>
                                                <Text fontSize="0.6875rem" color="gray.400" mt={0.5}>
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
                            <Text fontSize="0.75rem" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={1}>
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
                                            <Badge bg="white" color="gray.700" fontSize="0.75rem" px={2} py={1} fontWeight="600" borderRadius="md">
                                                {rec.level}
                                            </Badge>
                                            <Text fontSize="0.75rem" color="gray.500" fontWeight="500">
                                                {rec.projects.join(' • ')}
                                            </Text>
                                        </HStack>

                                        <Text fontSize="0.875rem" color="gray.600" lineHeight="1.6">
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
