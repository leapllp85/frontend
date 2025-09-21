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
    Select
} from '@chakra-ui/react';
import { ArrowLeft, Plus, X, FileText, Calendar, Users } from 'lucide-react';
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
            <Box p={8} maxW="4xl" mx="auto">
                {/* Back Button */}
                <HStack mb={6}>
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/surveys')}
                    >
                        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                        Back to Surveys
                    </Button>
                </HStack>

                {/* Header Box */}
                <Box bg="white" shadow="md" borderRadius="lg" border="1px solid" borderColor="gray.200" mb={8}>
                    <Box p={6}>
                        <VStack align="start" gap={2}>
                            <Heading size="xl" color="gray.800">Create New Survey</Heading>
                            <Text color="gray.600" fontSize="lg">Design and configure your team survey</Text>
                        </VStack>
                    </Box>
                </Box>

                <VStack gap={8} align="stretch">
                    {/* Basic Information */}
                    <Box bg="white" shadow="md" borderRadius="lg" border="1px solid" borderColor="gray.200">
                        <Box p={4} borderBottom="1px solid" borderColor="gray.200">
                            <HStack gap={2}>
                                <FileText size={20} color="#6366F1" />
                                <Heading size="md" color="gray.800">Basic Information</Heading>
                            </HStack>
                        </Box>
                        <Box p={6}>
                                <VStack gap={6} align="stretch">
                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="medium" mb={2}>Survey Title</Text>
                                        <Input
                                            placeholder="Enter survey title..."
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            borderColor={errors.title ? "red.500" : "gray.300"}
                                            color="gray.800"
                                            _placeholder={{ color: "gray.400" }}
                                        />
                                        {errors.title && <Text color="red.500" fontSize="sm" mt={1}>{errors.title}</Text>}
                                    </Box>

                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="medium" mb={2}>Description</Text>
                                        <Textarea
                                            placeholder="Describe the purpose of this survey..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={4}
                                            borderColor={errors.description ? "red.500" : "gray.300"}
                                            color="gray.800"
                                            _placeholder={{ color: "gray.400" }}
                                        />
                                        {errors.description && <Text color="red.500" fontSize="sm" mt={1}>{errors.description}</Text>}
                                    </Box>

                                    <HStack gap={6}>
                                        <Box flex="1">
                                            <Text color="gray.700" fontSize="sm" fontWeight="medium" mb={2}>Survey Type</Text>
                                            <select
                                                value={formData.survey_type}
                                                onChange={(e) => handleInputChange('survey_type', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    color: '#374151'
                                                }}
                                            >
                                                <option value="feedback">Feedback</option>
                                                <option value="evaluation">Evaluation</option>
                                                <option value="assessment">Assessment</option>
                                                <option value="poll">Poll</option>
                                            </select>
                                        </Box>

                                        <Box flex="1">
                                            <Text color="gray.700" fontSize="sm" fontWeight="medium" mb={2}>Target Audience</Text>
                                            <select
                                                value={formData.targeting_option}
                                                onChange={(e) => handleInputChange('targeting_option', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    color: '#374151'
                                                }}
                                            >
                                                <option value="all_team_members">All Team Members</option>
                                                <option value="managers_only">Managers Only</option>
                                                <option value="associates_only">Associates Only</option>
                                            </select>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </Box>
                        </Box>

                        {/* Schedule */}
                        <Box bg="white" shadow="md" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Box p={4} borderBottom="1px solid" borderColor="gray.200">
                                <HStack gap={2}>
                                    <Calendar size={20} color="#10B981" />
                                    <Heading size="md" color="gray.800">Schedule</Heading>
                                </HStack>
                            </Box>
                            <Box p={6}>
                                <HStack gap={6}>
                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="medium" mb={2}>Start Date & Time</Text>
                                        <Input
                                            type="datetime-local"
                                            value={formData.start_date}
                                            onChange={(e) => handleInputChange('start_date', e.target.value)}
                                            bg="white"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            color="gray.800"
                                            _hover={{ borderColor: "gray.400" }}
                                            _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #6366F1" }}
                                        />
                                        {errors.start_date && <Text color="red.500" fontSize="sm" mt={1}>{errors.start_date}</Text>}
                                    </Box>

                                    <Box>
                                        <Text color="gray.700" fontSize="sm" fontWeight="medium" mb={2}>End Date & Time</Text>
                                        <Input
                                            type="datetime-local"
                                            value={formData.end_date}
                                            onChange={(e) => handleInputChange('end_date', e.target.value)}
                                            bg="white"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            color="gray.800"
                                            _hover={{ borderColor: "gray.400" }}
                                            _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #6366F1" }}
                                        />
                                        {errors.end_date && <Text color="red.500" fontSize="sm" mt={1}>{errors.end_date}</Text>}
                                    </Box>
                                </HStack>
                            </Box>
                        </Box>

                        {/* Questions */}
                        <Box bg="white" shadow="md" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Box p={4} borderBottom="1px solid" borderColor="gray.200">
                                <HStack justify="space-between">
                                    <HStack gap={2}>
                                        <Users size={20} color="#F59E0B" />
                                        <Heading size="md" color="gray.800">Questions</Heading>
                                        <Badge colorPalette="blue" size="sm">
                                            {formData.questions.length} question{formData.questions.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </HStack>
                                    <Button
                                        size="sm"
                                        colorPalette="purple"
                                        // leftIcon={<Plus size={16} />}
                                        onClick={addQuestion}
                                    >
                                        Add Question
                                    </Button>
                                </HStack>
                            </Box>
                            <Box p={6}>
                                <VStack gap={6} align="stretch">
                                    {formData.questions.map((question, index) => (
                                        <Box key={index} p={4} border="1px solid" borderColor="gray.200" borderRadius="lg">
                                            <VStack gap={4} align="stretch">
                                                <HStack justify="space-between">
                                                    <Text fontWeight="semibold" color="gray.700">
                                                        Question {index + 1}
                                                    </Text>
                                                    {formData.questions.length > 1 && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            colorPalette="red"
                                                            onClick={() => removeQuestion(index)}
                                                        >
                                                            <X size={14} />
                                                        </Button>
                                                    )}
                                                </HStack>

                                                <Box>
                                                    <Input
                                                        placeholder="Enter your question..."
                                                        value={question.question_text}
                                                        onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                                                        color="gray.800"
                                                        _placeholder={{ color: "gray.400" }}
                                                    />
                                                    {errors[`question_${index}`] && <Text color="red.500" fontSize="sm" mt={1}>{errors[`question_${index}`]}</Text>}
                                                </Box>

                                                <HStack gap={4}>
                                                    <Box>
                                                        <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={2}>Question Type</Text>
                                                        <select
                                                            value={question.question_type}
                                                            onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                                                            style={{
                                                                padding: '6px 10px',
                                                                border: '1px solid #D1D5DB',
                                                                borderRadius: '4px',
                                                                fontSize: '14px',
                                                                width: '150px',
                                                                color: '#374151'
                                                            }}
                                                        >
                                                            <option value="text">Text Response</option>
                                                            <option value="choice">Multiple Choice</option>
                                                            <option value="rating">Rating Scale</option>
                                                        </select>
                                                    </Box>
                                                </HStack>

                                                {(question.question_type === 'choice' || question.question_type === 'rating') && (
                                                    <Box>
                                                        <HStack justify="space-between" mb={3}>
                                                            <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                                                {question.question_type === 'rating' ? 'Rating Options' : 'Answer Options'}
                                                            </Text>
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                onClick={() => addOption(index)}
                                                            >
                                                                Add Option
                                                            </Button>
                                                        </HStack>
                                                        <VStack gap={2} align="stretch">
                                                            {question.choices?.map((option: string, optionIndex: number) => (
                                                                <HStack key={optionIndex}>
                                                                    <Input
                                                                        size="sm"
                                                                        placeholder={`Option ${optionIndex + 1}`}
                                                                        value={option}
                                                                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                                                        color="gray.800"
                                                                        _placeholder={{ color: "gray.400" }}
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        colorPalette="red"
                                                                        onClick={() => removeOption(index, optionIndex)}
                                                                    >
                                                                        <X size={12} />
                                                                    </Button>
                                                                </HStack>
                                                            ))}
                                                        </VStack>
                                                        {errors[`question_${index}_choices`] && (
                                                            <Text color="red.500" fontSize="sm" mt={2}>
                                                                {errors[`question_${index}_choices`]}
                                                            </Text>
                                                        )}
                                                    </Box>
                                                )}
                                            </VStack>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        </Box>

                        {/* Actions */}
                        <HStack justify="end" gap={4}>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/surveys')}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorPalette="purple"
                                onClick={handleSubmit}
                                loading={loading}
                            >
                                Create Survey
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </AppLayout>
        </RequireSurveyCreate>
    );
};

export default CreateSurveyPage;
