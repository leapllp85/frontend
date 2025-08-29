'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Card,
    Button,
    Badge,
    Spinner,
    Input,
    Textarea,

    Flex
} from '@chakra-ui/react';
import { ArrowLeft, FileText, Send, CheckCircle, Clock } from 'lucide-react';
import { surveyApi, Survey } from '@/services';
import { AssociateOnly } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';

interface SurveyQuestion {
    id: number;
    question_text: string;
    question_type: 'text' | 'multiple_choice' | 'rating' | 'boolean' | 'scale';
    choices?: string[];
    is_required: boolean;
    order: number;
}

interface SurveyResponse {
    [questionId: number]: string | number;
}

export default function SubmitSurveyPage() {
    const params = useParams();
    const router = useRouter();
    const surveyId = parseInt(params.id as string);
    
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const [responses, setResponses] = useState<SurveyResponse>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                setLoading(true);
                // Fetch survey details
                const surveyData = await surveyApi.getSurvey(surveyId);
                
                // @ts-ignore
                setSurvey(surveyData.survey);
                
                // @ts-ignore
                setQuestions(surveyData.questions);
                setError(null);
            } catch (err) {
                console.error('Error fetching survey data:', err);
                setError('Failed to load survey data');
            } finally {
                setLoading(false);
            }
        };

        if (surveyId) {
            fetchSurveyData();
        }
    }, [surveyId]);

    const handleResponseChange = (questionId: number, value: string | number) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const validateResponses = () => {
        const requiredQuestions = questions.filter(q => q.is_required);
        for (const question of requiredQuestions) {
            if (!responses[question.id] || responses[question.id] === '') {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateResponses()) {
            setError('Please answer all required questions');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            
            // TODO: Submit responses to API
            console.log('Submitting survey responses:', responses);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting survey:', err);
            setError('Failed to submit survey. Please try again.');
        } finally {
            setSubmitting(false);
        }
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

    const renderQuestion = (question: SurveyQuestion) => {
        const value = responses[question.id] || '';

        switch (question.question_type) {
            case 'multiple_choice':
                return (
                    <VStack align="start" gap={2}>
                        {question.choices?.map((option, index) => (
                            <HStack key={index} gap={3}>
                                <input
                                    type="radio"
                                    id={`q${question.id}_${index}`}
                                    name={`question_${question.id}`}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    style={{ accentColor: '#6366F1' }}
                                />
                                <label htmlFor={`q${question.id}_${index}`} style={{ cursor: 'pointer', color: 'gray' }}>
                                    {option}
                                </label>
                            </HStack>
                        ))}
                    </VStack>
                );

            case 'boolean':
                return (
                    <HStack gap={4} wrap="wrap">
                        <HStack gap={2}>
                            <input
                                type="radio"
                                id={`q${question.id}_true`}
                                name={`question_${question.id}`}
                                value="true"
                                checked={value === 'true'}
                                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                style={{ accentColor: '#6366F1' }}
                            />
                            <label htmlFor={`q${question.id}_true`} style={{ cursor: 'pointer', color: 'gray' }}>
                                True
                            </label>
                        </HStack>
                        <HStack gap={2}>
                            <input
                                type="radio"
                                id={`q${question.id}_false`}
                                name={`question_${question.id}`}
                                value="false"
                                checked={value === 'false'}
                                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                style={{ accentColor: '#6366F1' }}
                            />
                            <label htmlFor={`q${question.id}_false`} style={{ cursor: 'pointer', color: 'gray' }}>
                                False
                            </label>
                        </HStack>
                    </HStack>
                )

            case 'rating':
                return (
                    <HStack gap={4} wrap="wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                            <HStack key={rating} gap={2}>
                                <input
                                    type="radio"
                                    id={`q${question.id}_${rating}`}
                                    name={`question_${question.id}`}
                                    value={rating.toString()}
                                    checked={value === rating}
                                    onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                                    style={{ accentColor: '#6366F1' }}
                                />
                                <label htmlFor={`q${question.id}_${rating}`} style={{ cursor: 'pointer', color: 'gray' }}>
                                    {rating}
                                </label>
                            </HStack>
                        ))}
                    </HStack>
                );

            case 'text':
                return (
                    <Textarea
                        value={value as string}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        placeholder="Enter your response..."
                        rows={4}
                    />
                );

            case 'scale':
                return (
                    <HStack gap={4} wrap="wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                            <HStack key={rating} gap={2}>
                                <input
                                    type="radio"
                                    id={`q${question.id}_${rating}`}
                                    name={`question_${question.id}`}
                                    value={rating.toString()}
                                    checked={value === rating}
                                    onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                                    style={{ accentColor: '#6366F1' }}
                                />
                                <label htmlFor={`q${question.id}_${rating}`} style={{ cursor: 'pointer', color: 'gray' }}>
                                    {rating}
                                </label>
                            </HStack>
                        ))}
                    </HStack>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box p={8} textAlign="center">
                <Spinner size="xl" color="purple.500" />
                <Text mt={4} color="gray.600">Loading survey...</Text>
            </Box>
        );
    }

    if (error && !survey) {
        return (
            <Box p={8} textAlign="center">
                <Text color="red.500" fontSize="lg">{error}</Text>
                <Button mt={4} onClick={() => router.push('/surveys')}>
                    Back to Surveys
                </Button>
            </Box>
        );
    }

    if (submitted) {
        return (
            <Box p={8} maxW="600px" mx="auto" textAlign="center">
                <Card.Root bg="white" shadow="lg" borderRadius="xl">
                    <Card.Body p={8}>
                        <VStack gap={6}>
                            <CheckCircle size={64} color="#10B981" />
                            <Heading size="xl" color="green.600">
                                Survey Submitted Successfully!
                            </Heading>
                            <Text color="gray.600" fontSize="lg" textAlign="center">
                                Thank you for taking the time to complete this survey. 
                                Your feedback is valuable and will help improve our workplace.
                            </Text>
                            <Button
                                colorPalette="purple"
                                size="lg"
                                onClick={() => router.push('/surveys')}
                            >
                                Back to Surveys
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Box>
        );
    }

    return (
        <Box w="full" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <AssociateOnly showAccessDenied={true}>
                <Box p={8} maxW="800px" mx="auto">
                    <VStack align="stretch" gap={6}>
                        {/* Survey Info */}
                        {survey && (
                            <Card.Root bg="white" shadow="lg" borderRadius="xl">
                                <Card.Header p={6}>
                                    <VStack align="start" gap={3}>
                                        <HStack gap={3}>
                                            <FileText size={24} color="#6366F1" />
                                            <Heading size="xl" color="gray.800">
                                                {survey.title}
                                            </Heading>
                                        </HStack>
                                        <Text color="gray.600" fontSize="lg">
                                            {survey.description}
                                        </Text>
                                        <HStack gap={4}>
                                            <HStack gap={1} color="gray.500" fontSize="sm">
                                                <Clock size={14} />
                                                <Text>End Date: {new Date(survey.end_date).toLocaleDateString()}</Text>
                                            </HStack>
                                        </HStack>
                                    </VStack>
                                </Card.Header>
                            </Card.Root>
                        )}

                        {/* Questions */}
                        <Card.Root bg="white" shadow="lg" borderRadius="xl">
                            <Card.Header p={6}>
                                <Heading size="lg" color="gray.800">Survey Questions</Heading>
                                <Text color="gray.600" fontSize="sm">
                                    Please answer all questions marked with * (required)
                                </Text>
                            </Card.Header>
                            <Card.Body p={6}>
                                <VStack gap={8} align="stretch">
                                    {questions.map((question, index) => (
                                        <Box key={question.id}>
                                            <VStack align="start" gap={4}>
                                                <HStack gap={2}>
                                                    <Text fontWeight="semibold" color="gray.700">
                                                        {index + 1}. {question.question_text}
                                                    </Text>
                                                    {question.is_required && (
                                                        <Text color="red.500" fontSize="sm">*</Text>
                                                    )}
                                                </HStack>
                                                {renderQuestion(question)}
                                            </VStack>
                                            {index < questions.length - 1 && (
                                                <Box mt={6} borderBottom="1px solid" borderColor="gray.200" />
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Error Message */}
                        {error && (
                            <Card.Root bg="red.50" borderColor="red.200" borderWidth="1px">
                                <Card.Body p={4}>
                                    <Text color="red.600" fontSize="sm">{error}</Text>
                                </Card.Body>
                            </Card.Root>
                        )}

                        {/* Submit Button */}
                        <Card.Root bg="white" shadow="md" borderRadius="lg">
                            <Card.Body p={6}>
                                <Flex justify="space-between" align="center">
                                    <VStack align="start" gap={1}>
                                        <Text fontWeight="semibold" color="gray.700">
                                            Ready to submit?
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Please review your answers before submitting
                                        </Text>
                                    </VStack>
                                    <Button
                                        colorPalette="green"
                                        size="lg"
                                        onClick={handleSubmit}
                                        loading={submitting}
                                        disabled={submitting}
                                    >
                                        <Send size={16} />
                                        {submitting ? 'Submitting...' : 'Submit Survey'}
                                    </Button>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </VStack>
                </Box>
            </AssociateOnly>
        </Box>
    );
}
