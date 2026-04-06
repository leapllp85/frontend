'use client';

import React, { useState, useEffect } from 'react';

// Add keyframes for animations
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    if (!document.head.querySelector('style[data-survey-animations]')) {
        style.setAttribute('data-survey-animations', 'true');
        document.head.appendChild(style);
    }
}
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
    Accordion,
    IconButton,
} from '@chakra-ui/react';
import { 
    FileText, 
    Calendar, 
    MessageSquare, 
    CheckCircle, 
    AlertCircle,
    ChevronDown,
    ChevronUp,
    User,
    Shield,
    TrendingUp,
    TrendingDown,
    Activity,
    Sparkles
} from 'lucide-react';

interface EngagementScore {
    month: string;
    associateScore: number;
    managerScore: number;
}

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

export default function SurveyResponsesPage() {
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [engagementData, setEngagementData] = useState<EngagementScore[]>([]);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            // Set engagement data
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
                            answer: 'Working late nights frequently due to project deadlines. Finding it difficult to disconnect after work hours. Feeling stressed about meeting expectations.',
                            type: 'text'
                        },
                        {
                            question: 'What support would help you most?',
                            answer: 'Better workload distribution, flexible hours, and access to stress management resources',
                            type: 'text'
                        }
                    ],
                    managerResponse: {
                        respondedBy: 'Sarah Johnson',
                        respondedDate: '2024-10-18',
                        feedback: 'Thank you for sharing your concerns. I understand the pressure you\'ve been under with the recent project deadlines. Your wellbeing is a priority, and we need to address this immediately.',
                        actionPlan: '1. Redistributing tasks within the team to balance workload\n2. Implementing no-meeting Fridays for focused work\n3. Enrolling you in our stress management workshop\n4. Setting up bi-weekly 1-on-1 check-ins',
                        priority: 'high'
                    },
                    summary: {
                        concernArea: 'Work-Life Balance & Stress Management',
                        keyIssues: [
                            'Extended working hours affecting personal time',
                            'High stress levels due to tight deadlines',
                            'Difficulty disconnecting from work',
                            'Need for better workload management'
                        ],
                        remediationPlan: 'Immediate workload redistribution, flexible scheduling implementation, stress management resources, and regular check-ins to monitor progress',
                        expectedOutcome: 'Improved work-life balance, reduced stress levels, better team collaboration, and sustainable work patterns',
                        timeline: '2-4 weeks for initial improvements, ongoing monitoring'
                    }
                },
                {
                    id: '2',
                    surveyTitle: 'Employee Engagement Survey - October',
                    submittedDate: '2024-10-20',
                    status: 'reviewed',
                    category: 'engagement',
                    associateInputs: [
                        {
                            question: 'How engaged do you feel with your current projects?',
                            answer: '4/5 - Generally engaged but seeking more challenging work',
                            type: 'rating'
                        },
                        {
                            question: 'What would increase your engagement at work?',
                            answer: 'Opportunities to work on innovative projects, learning new technologies, and taking on leadership responsibilities in smaller initiatives.',
                            type: 'text'
                        },
                        {
                            question: 'Do you feel your skills are being utilized effectively?',
                            answer: 'Mostly yes, but I have expertise in areas that aren\'t currently being leveraged',
                            type: 'text'
                        }
                    ],
                    managerResponse: {
                        respondedBy: 'Sarah Johnson',
                        respondedDate: '2024-10-22',
                        feedback: 'Great to hear you\'re engaged! Your desire for growth and new challenges is exactly what we need. Let\'s explore opportunities to leverage your full skill set.',
                        actionPlan: '1. Assigning you as technical lead for the upcoming AI integration project\n2. Sponsoring your enrollment in advanced cloud architecture certification\n3. Involving you in architecture review meetings\n4. Mentoring junior team members',
                        priority: 'medium'
                    },
                    summary: {
                        concernArea: 'Career Growth & Skill Utilization',
                        keyIssues: [
                            'Seeking more challenging and innovative work',
                            'Underutilized technical expertise',
                            'Interest in leadership opportunities',
                            'Desire for continuous learning'
                        ],
                        remediationPlan: 'Provide technical leadership opportunities, advanced training, involvement in strategic projects, and mentorship responsibilities',
                        expectedOutcome: 'Enhanced engagement, skill development, leadership experience, and increased job satisfaction',
                        timeline: 'Immediate assignment to new project, 3-6 months for certification completion'
                    }
                },
                {
                    id: '3',
                    surveyTitle: 'Team Feedback Survey - September',
                    submittedDate: '2024-09-28',
                    status: 'action_taken',
                    category: 'feedback',
                    associateInputs: [
                        {
                            question: 'How would you rate team collaboration?',
                            answer: '3/5 - Good but could be improved with better communication tools',
                            type: 'rating'
                        },
                        {
                            question: 'What improvements would enhance team productivity?',
                            answer: 'Better project management tools, clearer documentation standards, and more structured sprint planning sessions.',
                            type: 'text'
                        }
                    ],
                    managerResponse: {
                        respondedBy: 'Sarah Johnson',
                        respondedDate: '2024-10-01',
                        feedback: 'Your feedback aligns with what several team members have mentioned. We\'re taking action to improve our collaboration infrastructure.',
                        actionPlan: '1. Implemented new project management platform (Jira)\n2. Created team documentation guidelines\n3. Restructured sprint planning with dedicated time blocks\n4. Set up team collaboration training',
                        priority: 'medium'
                    },
                    summary: {
                        concernArea: 'Team Collaboration & Communication',
                        keyIssues: [
                            'Need for better project management tools',
                            'Lack of standardized documentation',
                            'Inefficient sprint planning processes',
                            'Communication gaps in distributed team'
                        ],
                        remediationPlan: 'Implement modern collaboration tools, establish documentation standards, restructure agile ceremonies, and provide team training',
                        expectedOutcome: 'Improved team productivity, better communication, standardized processes, and enhanced collaboration',
                        timeline: 'Completed - Tools deployed, training ongoing'
                    }
                },
                {
                    id: '4',
                    surveyTitle: 'Skills Assessment Survey - Q3',
                    submittedDate: '2024-09-15',
                    status: 'pending_review',
                    category: 'skills',
                    associateInputs: [
                        {
                            question: 'What skills would you like to develop?',
                            answer: 'Machine Learning, Cloud Architecture (AWS/Azure), and System Design',
                            type: 'text'
                        },
                        {
                            question: 'How confident are you with current tech stack?',
                            answer: '4/5 - Comfortable but want to deepen expertise',
                            type: 'rating'
                        },
                        {
                            question: 'What learning resources would be most helpful?',
                            answer: 'Online courses, hands-on projects, and mentorship from senior architects',
                            type: 'text'
                        }
                    ],
                    summary: {
                        concernArea: 'Professional Development & Skill Enhancement',
                        keyIssues: [
                            'Interest in emerging technologies (ML/AI)',
                            'Need for cloud architecture expertise',
                            'Desire for system design knowledge',
                            'Seeking mentorship opportunities'
                        ],
                        remediationPlan: 'Pending manager review and action plan',
                        expectedOutcome: 'To be determined after manager review',
                        timeline: 'Awaiting response'
                    }
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const toggleCard = (id: string) => {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reviewed': return 'green';
            case 'action_taken': return 'blue';
            case 'pending_review': return 'orange';
            default: return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'reviewed': return 'Reviewed';
            case 'action_taken': return 'Action Taken';
            case 'pending_review': return 'Pending Review';
            default: return 'Unknown';
        }
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
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const currentAssociateScore = engagementData.length > 0 ? engagementData[engagementData.length - 1].associateScore : 0;
    const currentManagerScore = engagementData.length > 0 ? engagementData[engagementData.length - 1].managerScore : 0;
    const previousAssociateScore = engagementData.length > 1 ? engagementData[engagementData.length - 2].associateScore : 0;
    const previousManagerScore = engagementData.length > 1 ? engagementData[engagementData.length - 2].managerScore : 0;
    const associateChange = currentAssociateScore - previousAssociateScore;
    const managerChange = currentManagerScore - previousManagerScore;

    if (loading) {
        return (
            <Box 
                minH="100vh" 
                w="100vw" 
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                position="relative"
                overflow="hidden"
            >
                {/* Animated background circles */}
                <Box
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    style={{ animation: 'pulse 3s ease-in-out infinite' }}
                />
                <Box
                    position="absolute"
                    bottom="-15%"
                    left="-15%"
                    w="500px"
                    h="500px"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                    style={{ animation: 'pulse 4s ease-in-out infinite' }}
                />
                
                <Flex justify="center" align="center" minH="100vh" position="relative" zIndex={1}>
                    <VStack gap={6}>
                        {/* Animated spinner container */}
                        <Box position="relative">
                            {/* Outer ring */}
                            <Box
                                w="120px"
                                h="120px"
                                border="4px solid"
                                borderColor="whiteAlpha.300"
                                borderRadius="full"
                                position="absolute"
                                top="-10px"
                                left="-10px"
                                style={{ animation: 'spin 3s linear infinite' }}
                            />
                            {/* Inner spinner */}
                            <Box
                                w="100px"
                                h="100px"
                                border="6px solid"
                                borderColor="white"
                                borderTopColor="transparent"
                                borderRadius="full"
                                style={{ animation: 'spin 1s linear infinite' }}
                            />
                            {/* Center icon */}
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                style={{ animation: 'bounce 2s ease-in-out infinite' }}
                            >
                                <Sparkles size={32} color="white" />
                            </Box>
                        </Box>
                        
                        {/* Loading text */}
                        <VStack gap={2} style={{ animation: 'fadeIn 1s ease-out' }}>
                            <Text color="white" fontSize="xl" fontWeight="bold">
                                Loading your survey responses...
                            </Text>
                            <Text color="whiteAlpha.800" fontSize="sm">
                                Preparing your feedback and insights
                            </Text>
                        </VStack>
                        
                        {/* Loading dots */}
                        <HStack gap={2}>
                            <Box
                                w={3}
                                h={3}
                                bg="white"
                                borderRadius="full"
                                style={{ animation: 'bounce 1.4s ease-in-out infinite' }}
                            />
                            <Box
                                w={3}
                                h={3}
                                bg="white"
                                borderRadius="full"
                                style={{ animation: 'bounce 1.4s ease-in-out 0.2s infinite' }}
                            />
                            <Box
                                w={3}
                                h={3}
                                bg="white"
                                borderRadius="full"
                                style={{ animation: 'bounce 1.4s ease-in-out 0.4s infinite' }}
                            />
                        </HStack>
                    </VStack>
                </Flex>
            </Box>
        );
    }

    return (
        <Box 
            h="100vh" 
            w="100%" 
            bg="gray.50" 
            overflow="hidden" 
            display="flex" 
            flexDirection="column"
            style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
            {/* Header */}
            <Box 
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                color="white" 
                py={3} 
                px={6}
                style={{ animation: 'fadeInUp 0.6s ease-out' }}
            >
                <HStack gap={2}>
                    <Box p={1.5} bg="whiteAlpha.200" borderRadius="lg">
                        <FileText size={20} />
                    </Box>
                    <VStack align="start" gap={0}>
                        <Heading size="md">My Survey Responses</Heading>
                        <Text fontSize="xs" opacity={0.9}>
                            View surveys, feedback, and engagement metrics
                        </Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Content */}
            <Box 
                w="full" 
                px={4} 
                py={3} 
                flex={1} 
                overflow="hidden"
                style={{ animation: 'fadeInUp 0.7s ease-out' }}
            >
                <HStack gap={3} align="stretch" w="full" h="full">
                    {/* Left Side: Summary Cards Stacked */}
                    <VStack gap={2} w="220px" flexShrink={0}>
                        <Card.Root bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" w="full">
                            <Card.Body p={2.5}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={0}>
                                        <Text fontSize="10px" color="gray.500" fontWeight="normal">Total Surveys</Text>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">{responses.length}</Text>
                                    </VStack>
                                    <Box p={1.5} bg="purple.50" borderRadius="md">
                                        <FileText size={16} color="#9333ea" />
                                    </Box>
                                </HStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" w="full">
                            <Card.Body p={2.5}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={0}>
                                        <Text fontSize="10px" color="gray.500" fontWeight="normal">Reviewed</Text>
                                        <Text fontSize="xl" fontWeight="bold" color="green.600">
                                            {responses.filter(r => r.status === 'reviewed' || r.status === 'action_taken').length}
                                        </Text>
                                    </VStack>
                                    <Box p={1.5} bg="green.50" borderRadius="md">
                                        <CheckCircle size={16} color="#16a34a" />
                                    </Box>
                                </HStack>
                            </Card.Body>
                        </Card.Root>

                        <Card.Root bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" w="full">
                            <Card.Body p={2.5}>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={0}>
                                        <Text fontSize="10px" color="gray.500" fontWeight="normal">Pending</Text>
                                        <Text fontSize="xl" fontWeight="bold" color="orange.600">
                                            {responses.filter(r => r.status === 'pending_review').length}
                                        </Text>
                                    </VStack>
                                    <Box p={1.5} bg="orange.50" borderRadius="md">
                                        <AlertCircle size={16} color="#ea580c" />
                                    </Box>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    </VStack>

                    {/* Right Side: Graph and Survey Cards */}
                    <VStack gap={3} flex={1} align="stretch" h="full">
                        {/* Engagement Score Graph */}
                        <Card.Root bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                            <Card.Body p={3}>
                                <VStack align="stretch" gap={2}>
                                    <HStack gap={1.5}>
                                        <Box p={1} bg="purple.50" borderRadius="md">
                                            <Activity size={14} color="#9333ea" />
                                        </Box>
                                        <VStack align="start" gap={0}>
                                            <Heading size="xs" color="gray.800" fontSize="sm">Engagement Trends</Heading>
                                            <Text fontSize="9px" color="gray.500">Last 5 months</Text>
                                        </VStack>
                                    </HStack>

                                    {/* Graph Container */}
                                    <Box position="relative" h="120px" w="full">
                                        {/* Y-axis labels */}
                                        <VStack 
                                            position="absolute" 
                                            left="0" 
                                            top="0" 
                                            h="full" 
                                            justify="space-between"
                                            fontSize="10px"
                                            color="gray.500"
                                            pr={1}
                                            w="20px"
                                        >
                                            <Text>100</Text>
                                            <Text>75</Text>
                                            <Text>50</Text>
                                            <Text>25</Text>
                                            <Text>0</Text>
                                        </VStack>

                                        {/* Graph Area */}
                                        <Box ml="25px" h="full" position="relative">
                                            {/* Grid lines */}
                                            <Box position="absolute" w="full" h="full" top="0" left="0">
                                                {[0, 25, 50, 75, 100].map((val) => (
                                                    <Box
                                                        key={val}
                                                        position="absolute"
                                                        w="full"
                                                        h="1px"
                                                        bg="gray.200"
                                                        bottom={`${val}%`}
                                                    />
                                                ))}
                                            </Box>

                                            {/* Data visualization */}
                                            <HStack h="full" align="end" justify="space-around" gap={2} position="relative" pt={5}>
                                                {engagementData.map((data, idx) => (
                                                    <VStack key={idx} h="full" justify="end" gap={1} align="center">
                                                        <HStack gap={1.5} h="full" align="end">
                                                            {/* Associate Bar */}
                                                            <Box
                                                                w="22px"
                                                                h={`${data.associateScore * 1.1}px`}
                                                                bg="linear-gradient(to top, #8b5cf6, #a78bfa)"
                                                                borderRadius="md"
                                                                transition="all 0.3s"
                                                                _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                                                                position="relative"
                                                                title={`Associate: ${data.associateScore}%`}
                                                            >
                                                                <Text
                                                                    position="absolute"
                                                                    top="-14px"
                                                                    left="50%"
                                                                    transform="translateX(-50%)"
                                                                    fontSize="9px"
                                                                    fontWeight="bold"
                                                                    color="purple.600"
                                                                    whiteSpace="nowrap"
                                                                >
                                                                    {data.associateScore}
                                                                </Text>
                                                            </Box>
                                                            {/* Manager Bar */}
                                                            <Box
                                                                w="22px"
                                                                h={`${data.managerScore * 1.1}px`}
                                                                bg="linear-gradient(to top, #14b8a6, #5eead4)"
                                                                borderRadius="md"
                                                                transition="all 0.3s"
                                                                _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                                                                position="relative"
                                                                title={`Manager: ${data.managerScore}%`}
                                                            >
                                                                <Text
                                                                    position="absolute"
                                                                    top="-14px"
                                                                    left="50%"
                                                                    transform="translateX(-50%)"
                                                                    fontSize="9px"
                                                                    fontWeight="bold"
                                                                    color="teal.600"
                                                                    whiteSpace="nowrap"
                                                                >
                                                                    {data.managerScore}
                                                                </Text>
                                                            </Box>
                                                        </HStack>
                                                        {/* Month label */}
                                                        <Text fontSize="10px" color="gray.600" fontWeight="medium">
                                                            {data.month}
                                                        </Text>
                                                    </VStack>
                                                ))}
                                            </HStack>
                                        </Box>
                                    </Box>

                                    {/* Legend and Current Scores */}
                                    <SimpleGrid columns={2} gap={3} mt={1}>
                                        <Box bg="purple.50" p={2} borderRadius="md" border="1px solid" borderColor="purple.100">
                                            <HStack justify="space-between">
                                                <VStack align="start" gap={0}>
                                                    <HStack gap={1}>
                                                        <Box w={2} h={2} bg="purple.500" borderRadius="sm" />
                                                        <Text fontSize="10px" color="gray.600" fontWeight="medium">Associate</Text>
                                                    </HStack>
                                                    <Text fontSize="xl" fontWeight="bold" color="purple.600">
                                                        {currentAssociateScore}%
                                                    </Text>
                                                </VStack>
                                                <HStack gap={0.5}>
                                                    {associateChange >= 0 ? (
                                                        <TrendingUp size={12} color="#16a34a" />
                                                    ) : (
                                                        <TrendingDown size={12} color="#dc2626" />
                                                    )}
                                                    <Text 
                                                        fontSize="xs" 
                                                        fontWeight="semibold"
                                                        color={associateChange >= 0 ? 'green.600' : 'red.600'}
                                                    >
                                                        {associateChange >= 0 ? '+' : ''}{associateChange}%
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                        </Box>

                                        <Box bg="teal.50" p={2} borderRadius="md" border="1px solid" borderColor="teal.100">
                                            <HStack justify="space-between">
                                                <VStack align="start" gap={0}>
                                                    <HStack gap={1}>
                                                        <Box w={2} h={2} bg="teal.500" borderRadius="sm" />
                                                        <Text fontSize="10px" color="gray.600" fontWeight="medium">Manager</Text>
                                                    </HStack>
                                                    <Text fontSize="xl" fontWeight="bold" color="teal.600">
                                                        {currentManagerScore}%
                                                    </Text>
                                                </VStack>
                                                <HStack gap={0.5}>
                                                    {managerChange >= 0 ? (
                                                        <TrendingUp size={12} color="#16a34a" />
                                                    ) : (
                                                        <TrendingDown size={12} color="#dc2626" />
                                                    )}
                                                    <Text 
                                                        fontSize="xs" 
                                                        fontWeight="semibold"
                                                        color={managerChange >= 0 ? 'green.600' : 'red.600'}
                                                    >
                                                        {managerChange >= 0 ? '+' : ''}{managerChange}%
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                        </Box>
                                    </SimpleGrid>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Survey Response Cards - Scrollable */}
                        <Box flex={1} overflow="auto" pr={2}>
                            <VStack gap={3} align="stretch">
                            {responses.map((response) => {
                            const isExpanded = expandedCards.has(response.id);
                            const categoryColor = getCategoryColor(response.category);

                            return (
                                <Card.Root
                                    key={response.id}
                                    bg="white"
                                    borderRadius="xl"
                                    border="1.5px solid"
                                    borderColor="gray.200"
                                    overflow="hidden"
                                    transition="all 0.2s"
                                    _hover={{ shadow: 'md', borderColor: 'gray.300' }}
                                >
                                    {/* Card Header */}
                                    <Box
                                        bg={`${categoryColor}.50`}
                                        borderBottom="1px solid"
                                        borderColor={`${categoryColor}.100`}
                                        p={5}
                                        cursor="pointer"
                                        onClick={() => toggleCard(response.id)}
                                        transition="all 0.2s"
                                        _hover={{ bg: `${categoryColor}.100` }}
                                    >
                                        <Flex justify="space-between" align="start">
                                            <VStack align="start" gap={2} flex={1}>
                                                <HStack gap={3} flexWrap="wrap">
                                                    <Heading size="md" color="gray.800" fontWeight="semibold">
                                                        {response.surveyTitle}
                                                    </Heading>
                                                    <Badge
                                                        bg={`${getStatusColor(response.status)}.100`}
                                                        color={`${getStatusColor(response.status)}.700`}
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                        border="1px solid"
                                                        borderColor={`${getStatusColor(response.status)}.200`}
                                                    >
                                                        {getStatusLabel(response.status)}
                                                    </Badge>
                                                </HStack>
                                                <HStack gap={4} fontSize="sm" color="gray.600">
                                                    <HStack gap={1}>
                                                        <Calendar size={14} />
                                                        <Text>Submitted: {new Date(response.submittedDate).toLocaleDateString()}</Text>
                                                    </HStack>
                                                    <Badge
                                                        bg={`${categoryColor}.100`}
                                                        color={`${categoryColor}.700`}
                                                        px={2}
                                                        py={0.5}
                                                        borderRadius="md"
                                                        fontSize="xs"
                                                        textTransform="capitalize"
                                                    >
                                                        {response.category}
                                                    </Badge>
                                                </HStack>
                                            </VStack>
                                            <IconButton
                                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                                size="sm"
                                                variant="ghost"
                                                color={`${categoryColor}.600`}
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </IconButton>
                                        </Flex>
                                    </Box>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <Card.Body p={6}>
                                            <VStack gap={6} align="stretch">
                                                {/* Summary Section */}
                                                <Box
                                                    bg="blue.50"
                                                    borderRadius="lg"
                                                    p={5}
                                                    border="1px solid"
                                                    borderColor="blue.100"
                                                >
                                                    <VStack align="stretch" gap={4}>
                                                        <HStack gap={2}>
                                                            <Box p={1.5} bg="blue.100" borderRadius="md">
                                                                <FileText size={16} color="#2563eb" />
                                                            </Box>
                                                            <Heading size="sm" color="blue.800">Survey Summary</Heading>
                                                        </HStack>
                                                        
                                                        <VStack align="stretch" gap={3}>
                                                            <Box>
                                                                <Text fontSize="xs" color="blue.600" fontWeight="medium" mb={1}>
                                                                    CONCERN AREA
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                                    {response.summary.concernArea}
                                                                </Text>
                                                            </Box>

                                                            <Box>
                                                                <Text fontSize="xs" color="blue.600" fontWeight="medium" mb={2}>
                                                                    KEY ISSUES IDENTIFIED
                                                                </Text>
                                                                <VStack align="stretch" gap={1}>
                                                                    {response.summary.keyIssues.map((issue, idx) => (
                                                                        <HStack key={idx} gap={2} align="start">
                                                                            <Box mt={1.5} w={1.5} h={1.5} bg="blue.500" borderRadius="full" flexShrink={0} />
                                                                            <Text fontSize="sm" color="gray.700">{issue}</Text>
                                                                        </HStack>
                                                                    ))}
                                                                </VStack>
                                                            </Box>

                                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                                                                <Box>
                                                                    <Text fontSize="xs" color="blue.600" fontWeight="medium" mb={1}>
                                                                        EXPECTED OUTCOME
                                                                    </Text>
                                                                    <Text fontSize="sm" color="gray.700">
                                                                        {response.summary.expectedOutcome}
                                                                    </Text>
                                                                </Box>
                                                                <Box>
                                                                    <Text fontSize="xs" color="blue.600" fontWeight="medium" mb={1}>
                                                                        TIMELINE
                                                                    </Text>
                                                                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                                        {response.summary.timeline}
                                                                    </Text>
                                                                </Box>
                                                            </SimpleGrid>
                                                        </VStack>
                                                    </VStack>
                                                </Box>

                                                {/* Your Inputs */}
                                                <Box>
                                                    <HStack gap={2} mb={4}>
                                                        <Box p={1.5} bg="purple.100" borderRadius="md">
                                                            <User size={16} color="#9333ea" />
                                                        </Box>
                                                        <Heading size="sm" color="gray.800">Your Inputs</Heading>
                                                    </HStack>
                                                    <VStack gap={4} align="stretch">
                                                        {response.associateInputs.map((input, idx) => (
                                                            <Box
                                                                key={idx}
                                                                bg="gray.50"
                                                                borderRadius="lg"
                                                                p={4}
                                                                border="1px solid"
                                                                borderColor="gray.200"
                                                            >
                                                                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                                                                    {input.question}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.600">
                                                                    {input.answer}
                                                                </Text>
                                                            </Box>
                                                        ))}
                                                    </VStack>
                                                </Box>

                                                {/* Manager Response */}
                                                {response.managerResponse && (
                                                    <Box
                                                        bg="green.50"
                                                        borderRadius="lg"
                                                        p={5}
                                                        border="1px solid"
                                                        borderColor="green.100"
                                                    >
                                                        <VStack align="stretch" gap={4}>
                                                            <HStack justify="space-between" flexWrap="wrap">
                                                                <HStack gap={2}>
                                                                    <Box p={1.5} bg="green.100" borderRadius="md">
                                                                        <Shield size={16} color="#16a34a" />
                                                                    </Box>
                                                                    <Heading size="sm" color="green.800">Manager Response</Heading>
                                                                </HStack>
                                                                <Badge
                                                                    bg={`${getPriorityColor(response.managerResponse.priority)}.100`}
                                                                    color={`${getPriorityColor(response.managerResponse.priority)}.700`}
                                                                    px={3}
                                                                    py={1}
                                                                    borderRadius="full"
                                                                    fontSize="xs"
                                                                    fontWeight="medium"
                                                                    textTransform="uppercase"
                                                                >
                                                                    {response.managerResponse.priority} Priority
                                                                </Badge>
                                                            </HStack>

                                                            <HStack gap={4} fontSize="xs" color="green.700">
                                                                <Text>
                                                                    <strong>Responded by:</strong> {response.managerResponse.respondedBy}
                                                                </Text>
                                                                <Text>
                                                                    <strong>Date:</strong> {new Date(response.managerResponse.respondedDate).toLocaleDateString()}
                                                                </Text>
                                                            </HStack>

                                                            <Box>
                                                                <Text fontSize="xs" color="green.700" fontWeight="medium" mb={2}>
                                                                    FEEDBACK
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                                                                    {response.managerResponse.feedback}
                                                                </Text>
                                                            </Box>

                                                            <Box>
                                                                <Text fontSize="xs" color="green.700" fontWeight="medium" mb={2}>
                                                                    ACTION PLAN
                                                                </Text>
                                                                <Box
                                                                    bg="white"
                                                                    p={4}
                                                                    borderRadius="md"
                                                                    border="1px solid"
                                                                    borderColor="green.200"
                                                                >
                                                                    <Text fontSize="sm" color="gray.700" whiteSpace="pre-line" lineHeight="1.8">
                                                                        {response.managerResponse.actionPlan}
                                                                    </Text>
                                                                </Box>
                                                            </Box>
                                                        </VStack>
                                                    </Box>
                                                )}

                                                {/* Remediation Plan */}
                                                <Box
                                                    bg="indigo.50"
                                                    borderRadius="lg"
                                                    p={5}
                                                    border="1px solid"
                                                    borderColor="indigo.100"
                                                >
                                                    <VStack align="stretch" gap={3}>
                                                        <HStack gap={2}>
                                                            <Box p={1.5} bg="indigo.100" borderRadius="md">
                                                                <CheckCircle size={16} color="#4f46e5" />
                                                            </Box>
                                                            <Heading size="sm" color="indigo.800">Remediation Plan</Heading>
                                                        </HStack>
                                                        <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                                                            {response.summary.remediationPlan}
                                                        </Text>
                                                    </VStack>
                                                </Box>
                                            </VStack>
                                        </Card.Body>
                                    )}
                                </Card.Root>
                            );
                        })}

                            {/* Empty State */}
                            {responses.length === 0 && (
                                <Card.Root bg="white" borderRadius="xl" p={12}>
                                    <VStack gap={4}>
                                        <Box p={4} bg="gray.100" borderRadius="full">
                                            <FileText size={48} color="#9ca3af" />
                                        </Box>
                                        <Heading size="lg" color="gray.600">No Survey Responses Yet</Heading>
                                        <Text color="gray.500" textAlign="center">
                                            Your submitted survey responses will appear here
                                        </Text>
                                    </VStack>
                                </Card.Root>
                            )}
                            </VStack>
                        </Box>
                    </VStack>
                </HStack>
            </Box>
        </Box>
    );
}
