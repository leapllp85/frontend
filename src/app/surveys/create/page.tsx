'use client';

import React, { useState } from 'react';
import { surveyApi, CreateSurveyRequest, SurveyQuestion } from '../../../services';
import { useRouter } from 'next/navigation';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Button,
    Badge,
    Flex,
    Input,
    Textarea,
    Card,
    SimpleGrid,
    Spinner
} from '@chakra-ui/react';
import { ArrowLeft, Plus, X, FileText, Calendar, Users, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RequireSurveyCreate } from '@/components/RoleGuard';
import { AppLayout } from '@/components/layouts/AppLayout';

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
const getNextDayDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const hours = String(tomorrow.getHours()).padStart(2, '0');
    const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

interface CreateSurveyForm {
    title: string;
    description: string;
    survey_type: string;
    start_date: string;
    end_date: string;
    targeting_option: string;
    questions: SurveyQuestion[];
}

const CreateSurveyPage = () => {
    const router = useRouter();
    // const toast = useToast(); // Temporarily disabled due to import issues
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<CreateSurveyForm>({
        title: '',
        description: '',
        survey_type: 'feedback',
        start_date: getCurrentDateTime(),
        end_date: getNextDayDateTime(),
        targeting_option: 'all_team_members',
        questions: [
            {
                question_text: '',
                question_type: 'text',
                choices: [],
                is_required: true
            }
        ]
    });

    const handleInputChange = (field: keyof CreateSurveyForm, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Auto-update end date when start date changes
        if (field === 'start_date') {
            const startDate = new Date(value);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            const endDateString = endDate.toISOString().slice(0, 16);
            setFormData(prev => ({
                ...prev,
                end_date: endDateString
            }));
        }
    };

    const handleQuestionChange = (index: number, field: keyof SurveyQuestion, value: any) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    question_text: '',
                    question_type: 'text',
                    choices: [],
                    is_required: true
                }
            ]
        }));
    };

    const removeQuestion = (index: number) => {
        if (formData.questions.length > 1) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index)
            }));
        }
    };

    const addOption = (questionIndex: number) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].choices = [
            ...(updatedQuestions[questionIndex].choices || []),
            ''
        ];
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const updatedQuestions = [...formData.questions];
        if (updatedQuestions[questionIndex].choices) {
            updatedQuestions[questionIndex].choices[optionIndex] = value;
        }
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].choices = updatedQuestions[questionIndex].choices?.filter((_: string, i: number) => i !== optionIndex) || [];
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Survey title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Survey description is required';
        }

        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }

        if (!formData.end_date) {
            newErrors.end_date = 'End date is required';
        }

        if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
            newErrors.end_date = 'End date must be after start date';
        }

        formData.questions.forEach((question, index) => {
            if (!question.question_text.trim()) {
                newErrors[`question_${index}`] = 'Question text is required';
            }

            if ((question.question_type === 'choice' || question.question_type === 'rating') && 
                (!question.choices || question.choices.length === 0)) {
                newErrors[`question_${index}_choices`] = 'At least one choice is required for this question type';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            console.error('Validation Error: Please fix the errors in the form');
            return;
        }

        try {
            setLoading(true);
            const surveyData: CreateSurveyRequest = {
                title: formData.title,
                description: formData.description,
                survey_type: formData.survey_type as 'feedback' | 'wellness' | 'satisfaction' | 'skills' | 'goals' | 'engagement' | 'leadership' | 'project_feedback',
                start_date: formData.start_date,
                end_date: formData.end_date,
                target_audience: formData.targeting_option as 'all_employees' | 'team_only' | 'by_department' | 'by_role' | 'by_risk_level' | 'custom_selection',
                questions: formData.questions
            };
            const response = await surveyApi.createSurvey(surveyData);
            
            console.log('Survey Created: Your survey has been created successfully');

            router.push('/surveys');
        } catch (error: any) {
            console.error('Error:', error.message || 'Failed to create survey');
        } finally {
            setLoading(false);
        }
    };
    return (
    <RequireSurveyCreate>
        <AppLayout>
            <Box w="full" h="100vh" bg="gradient-to-br from-purple.50 to-blue.50" overflow="auto">
                <Box p={8} maxW="5xl" mx="auto">
                    {/* Back Button */}
                    <HStack mb={6}>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/surveys')}
                            size="lg"
                            _hover={{ bg: "white", shadow: "md" }}
                        >
                            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                            Back to Surveys
                        </Button>
                    </HStack>

                    {/* Enhanced Header */}
                    <Card.Root bg="white" shadow="xl" borderRadius="2xl" border="1px solid" borderColor="gray.100" mb={8} overflow="hidden">
                        <Box bg="gradient-to-r from-purple.600 to-blue.600" p={8}>
                            <HStack justify="space-between" align="center">
                                <VStack align="start" gap={2}>
                                    <HStack gap={3}>
                                        <Box p={3} bg="white" borderRadius="xl" shadow="lg">
                                            <FileText size={32} color="#7c3aed" />
                                        </Box>
                                        <VStack align="start" gap={1}>
                                            <Heading size="2xl" color="white" fontWeight="bold">
                                                Create New Survey
                                            </Heading>
                                            <Text color="purple.100" fontSize="lg">
                                                Design and configure your team survey
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                                <Box p={4} bg="white" borderRadius="full" opacity={0.9}>
                                    <Users size={24} color="#7c3aed" />
                                </Box>
                            </HStack>
                        </Box>
                    </Card.Root>

                    <VStack gap={8} align="stretch">
                        {/* Basic Information */}
                        <Card.Root bg="white" shadow="lg" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Header bg="gradient-to-r from-purple.50 to-blue.50" borderTopRadius="xl" p={6}>
                                <HStack gap={3}>
                                    <Box p={2} bg="purple.100" borderRadius="lg">
                                        <FileText size={20} color="#7c3aed" />
                                    </Box>
                                    <Heading size="lg" color="gray.800" fontWeight="bold">Basic Information</Heading>
                                </HStack>
                            </Card.Header>
                            <Card.Body p={8}>
                                <VStack gap={6} align="stretch">
                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>Survey Title *</Text>
                                        <Input
                                            placeholder="e.g., Employee Satisfaction Survey Q4 2024"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            size="lg"
                                            bg="white"
                                            border="2px solid"
                                            borderColor={errors.title ? "red.400" : "gray.200"}
                                            color="gray.800"
                                            borderRadius="lg"
                                            _placeholder={{ color: "gray.400" }}
                                            _focus={{
                                                borderColor: "purple.400",
                                                boxShadow: "0 0 0 1px #a855f7"
                                            }}
                                            _hover={{ borderColor: "gray.300" }}
                                        />
                                        {errors.title && (
                                            <HStack gap={2} mt={2}>
                                                <AlertCircle size={16} color="#ef4444" />
                                                <Text color="red.500" fontSize="sm">{errors.title}</Text>
                                            </HStack>
                                        )}
                                    </Box>

                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>Description *</Text>
                                        <Textarea
                                            placeholder="Describe the purpose and objectives of this survey. What insights are you looking to gather?"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={4}
                                            bg="white"
                                            border="2px solid"
                                            borderColor={errors.description ? "red.400" : "gray.200"}
                                            color="gray.800"
                                            borderRadius="lg"
                                            _placeholder={{ color: "gray.400" }}
                                            _focus={{
                                                borderColor: "purple.400",
                                                boxShadow: "0 0 0 1px #a855f7"
                                            }}
                                            _hover={{ borderColor: "gray.300" }}
                                            resize="vertical"
                                        />
                                        {errors.description && (
                                            <HStack gap={2} mt={2}>
                                                <AlertCircle size={16} color="#ef4444" />
                                                <Text color="red.500" fontSize="sm">{errors.description}</Text>
                                            </HStack>
                                        )}
                                    </Box>

                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                        <Box>
                                            <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>Survey Type *</Text>
                                            <select
                                                value={formData.survey_type}
                                                onChange={(e) => handleInputChange('survey_type', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    color: '#374151',
                                                    backgroundColor: 'white',
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

                                        <Box>
                                            <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>Target Audience *</Text>
                                            <select
                                                value={formData.targeting_option}
                                                onChange={(e) => handleInputChange('targeting_option', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    color: '#374151',
                                                    backgroundColor: 'white',
                                                    outline: 'none',
                                                    appearance: 'none',
                                                    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                    backgroundPosition: 'right 12px center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: '16px'
                                                }}
                                            >
                                                <option value="all_employees">👥 All Employees</option>
                                                <option value="team_only">🏢 Team Only</option>
                                                <option value="by_department">🏛️ By Department</option>
                                                <option value="by_role">👔 By Role</option>
                                                <option value="by_risk_level">⚠️ By Risk Level</option>
                                                <option value="custom_selection">🎯 Custom Selection</option>
                                            </select>
                                        </Box>
                                    </SimpleGrid>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Schedule */}
                        <Card.Root bg="white" shadow="lg" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Header bg="gradient-to-r from-green.50 to-teal.50" borderTopRadius="xl" p={6}>
                                <HStack gap={3}>
                                    <Box p={2} bg="green.100" borderRadius="lg">
                                        <Calendar size={20} color="#059669" />
                                    </Box>
                                    <Heading size="lg" color="gray.800" fontWeight="bold">Schedule</Heading>
                                </HStack>
                            </Card.Header>
                            <Card.Body p={8}>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>Start Date & Time *</Text>
                                        <Input
                                            type="datetime-local"
                                            value={formData.start_date}
                                            onChange={(e) => handleInputChange('start_date', e.target.value)}
                                            size="lg"
                                            bg="white"
                                            border="2px solid"
                                            borderColor={errors.start_date ? "red.400" : "gray.200"}
                                            color="gray.800"
                                            borderRadius="lg"
                                            _hover={{ borderColor: "gray.300" }}
                                            _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #10b981" }}
                                        />
                                        {errors.start_date && (
                                            <HStack gap={2} mt={2}>
                                                <AlertCircle size={16} color="#ef4444" />
                                                <Text color="red.500" fontSize="sm">{errors.start_date}</Text>
                                            </HStack>
                                        )}
                                    </Box>

                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>End Date & Time *</Text>
                                        <Input
                                            type="datetime-local"
                                            value={formData.end_date}
                                            onChange={(e) => handleInputChange('end_date', e.target.value)}
                                            size="lg"
                                            bg="white"
                                            border="2px solid"
                                            borderColor={errors.end_date ? "red.400" : "gray.200"}
                                            color="gray.800"
                                            borderRadius="lg"
                                            _hover={{ borderColor: "gray.300" }}
                                            _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #10b981" }}
                                        />
                                        {errors.end_date && (
                                            <HStack gap={2} mt={2}>
                                                <AlertCircle size={16} color="#ef4444" />
                                                <Text color="red.500" fontSize="sm">{errors.end_date}</Text>
                                            </HStack>
                                        )}
                                    </Box>
                                </SimpleGrid>
                            </Card.Body>
                        </Card.Root>

                        {/* Questions */}
                        <Card.Root bg="white" shadow="lg" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Header bg="gradient-to-r from-orange.50 to-yellow.50" borderTopRadius="xl" p={6}>
                                <HStack justify="space-between">
                                    <HStack gap={3}>
                                        <Box p={2} bg="orange.100" borderRadius="lg">
                                            <Users size={20} color="#ea580c" />
                                        </Box>
                                        <Heading size="lg" color="gray.800" fontWeight="bold">Questions</Heading>
                                        <Badge colorPalette="orange" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">
                                            {formData.questions.length} question{formData.questions.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </HStack>
                                    <Button
                                        size="md"
                                        bg="orange.600"
                                        color="white"
                                        _hover={{ bg: "orange.700", transform: "translateY(-2px)", shadow: "lg" }}
                                        onClick={addQuestion}
                                        borderRadius="lg"
                                        px={6}
                                    >
                                        <Plus size={16} style={{ marginRight: '8px' }} />
                                        Add Question
                                    </Button>
                                </HStack>
                            </Card.Header>
                            <Card.Body p={8}>
                                <VStack gap={6} align="stretch">
                                    {formData.questions.map((question, index) => (
                                        <Box key={index} p={6} bg="gray.50" border="2px solid" borderColor="gray.200" borderRadius="xl" _hover={{ borderColor: "orange.300", bg: "white" }} transition="all 0.2s">
                                            <VStack gap={5} align="stretch">
                                                <HStack justify="space-between">
                                                    <HStack gap={3}>
                                                        <Box p={2} bg="orange.100" borderRadius="md">
                                                            <Text fontSize="sm" fontWeight="bold" color="orange.600">
                                                                Q{index + 1}
                                                            </Text>
                                                        </Box>
                                                        <Text fontWeight="bold" color="gray.800" fontSize="lg">
                                                            Question {index + 1}
                                                        </Text>
                                                    </HStack>
                                                    {formData.questions.length > 1 && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            borderColor="red.400"
                                                            color="red.600"
                                                            _hover={{ bg: "red.50" }}
                                                            onClick={() => removeQuestion(index)}
                                                            borderRadius="lg"
                                                        >
                                                            <X size={14} />
                                                        </Button>
                                                    )}
                                                </HStack>

                                                <Box>
                                                    <Text color="gray.700" fontSize="sm" fontWeight="semibold" mb={3}>Question Text *</Text>
                                                    <Input
                                                        placeholder="Enter your question here..."
                                                        value={question.question_text}
                                                        onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                                                        size="lg"
                                                        bg="white"
                                                        border="2px solid"
                                                        borderColor={errors[`question_${index}`] ? "red.400" : "gray.200"}
                                                        color="gray.800"
                                                        borderRadius="lg"
                                                        _placeholder={{ color: "gray.400" }}
                                                        _focus={{
                                                            borderColor: "orange.400",
                                                            boxShadow: "0 0 0 1px #ea580c"
                                                        }}
                                                        _hover={{ borderColor: "gray.300" }}
                                                    />
                                                    {errors[`question_${index}`] && (
                                                        <HStack gap={2} mt={2}>
                                                            <AlertCircle size={16} color="#ef4444" />
                                                            <Text color="red.500" fontSize="sm">{errors[`question_${index}`]}</Text>
                                                        </HStack>
                                                    )}
                                                </Box>

                                                <Box>
                                                    <Text fontSize="sm" color="gray.700" fontWeight="semibold" mb={3}>Question Type</Text>
                                                    <select
                                                        value={question.question_type}
                                                        onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            border: '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '16px',
                                                            width: '200px',
                                                            color: '#374151',
                                                            backgroundColor: 'white',
                                                            outline: 'none',
                                                            appearance: 'none',
                                                            backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                                            backgroundPosition: 'right 12px center',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundSize: '16px'
                                                        }}
                                                    >
                                                        <option value="text">📝 Text Response</option>
                                                        <option value="choice">📊 Multiple Choice</option>
                                                        <option value="rating">⭐ Rating Scale</option>
                                                    </select>
                                                </Box>

                                                {(question.question_type === 'choice' || question.question_type === 'rating') && (
                                                    <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                        <HStack justify="space-between" mb={4}>
                                                            <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                                                                {question.question_type === 'rating' ? '⭐ Rating Options' : '📊 Answer Options'}
                                                            </Text>
                                                            <Button
                                                                size="sm"
                                                                bg="orange.500"
                                                                color="white"
                                                                _hover={{ bg: "orange.600" }}
                                                                onClick={() => addOption(index)}
                                                                borderRadius="lg"
                                                            >
                                                                <Plus size={14} style={{ marginRight: '4px' }} />
                                                                Add Option
                                                            </Button>
                                                        </HStack>
                                                        <VStack gap={3} align="stretch">
                                                            {question.choices?.map((option: string, optionIndex: number) => (
                                                                <HStack key={optionIndex} gap={3}>
                                                                    <Text fontSize="sm" color="gray.500" minW="20px">
                                                                        {optionIndex + 1}.
                                                                    </Text>
                                                                    <Input
                                                                        placeholder={`Option ${optionIndex + 1}`}
                                                                        value={option}
                                                                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                                                        bg="white"
                                                                        border="1px solid"
                                                                        borderColor="gray.300"
                                                                        color="gray.800"
                                                                        borderRadius="md"
                                                                        _placeholder={{ color: "gray.400" }}
                                                                        _focus={{ borderColor: "orange.400" }}
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        borderColor="red.400"
                                                                        color="red.600"
                                                                        _hover={{ bg: "red.50" }}
                                                                        onClick={() => removeOption(index, optionIndex)}
                                                                        minW="auto"
                                                                        p={2}
                                                                    >
                                                                        <X size={12} />
                                                                    </Button>
                                                                </HStack>
                                                            ))}
                                                        </VStack>
                                                        {errors[`question_${index}_choices`] && (
                                                            <HStack gap={2} mt={3}>
                                                                <AlertCircle size={16} color="#ef4444" />
                                                                <Text color="red.500" fontSize="sm">
                                                                    {errors[`question_${index}_choices`]}
                                                                </Text>
                                                            </HStack>
                                                        )}
                                                    </Box>
                                                )}
                                            </VStack>
                                        </Box>
                                    ))}
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* Enhanced Actions */}
                        <Card.Root bg="white" shadow="lg" borderRadius="xl" border="1px solid" borderColor="gray.100">
                            <Card.Body p={6}>
                                <HStack justify="space-between" align="center">
                                    <VStack align="start" gap={1}>
                                        <Text fontWeight="bold" color="gray.800">
                                            Ready to create your survey?
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Review your settings and launch the survey to your team
                                        </Text>
                                    </VStack>
                                    <HStack gap={4}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            borderColor="gray.300"
                                            color="gray.600"
                                            _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                                            onClick={() => router.push('/surveys')}
                                            px={6}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            bg="purple.600"
                                            color="white"
                                            size="lg"
                                            _hover={{ 
                                                bg: "purple.700",
                                                transform: "translateY(-2px)",
                                                shadow: "xl"
                                            }}
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            px={8}
                                            transition="all 0.2s ease"
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" mr={2} />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={20} style={{ marginRight: '8px' }} />
                                                    Create Survey
                                                </>
                                            )}
                                        </Button>
                                    </HStack>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    </VStack>
                </Box>
            </Box>
        </AppLayout>
    </RequireSurveyCreate>
    );
};

export default CreateSurveyPage;
