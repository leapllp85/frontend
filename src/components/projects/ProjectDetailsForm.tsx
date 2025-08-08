import React from 'react';
import { VStack, Box, Text, Input, Badge } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';

interface ProjectDetailsFormProps {
    projectName: string;
    setProjectName: (name: string) => void;
    criticality: string;
    setCriticality: (criticality: string) => void;
    criticalityOptions: Array<{ value: string; label: string }>;
    getCriticalityColor: (criticality: string) => string;
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
    projectName,
    setProjectName,
    criticality,
    setCriticality,
    criticalityOptions,
    getCriticalityColor
}) => {
    return (
        <VStack gap={6} align="stretch">
            {/* Project Name */}
            <Box>
                <Text className="text-gray-700 font-semibold mb-2">
                    Project Name
                </Text>
                <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    size="lg"
                    borderColor="gray.300"
                    _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                />
            </Box>

            {/* Project Criticality */}
            <Box>
                <Text className="text-gray-700 font-semibold mb-2">
                    Project Criticality
                </Text>
                <select
                    value={criticality}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCriticality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ height: '48px', fontSize: '16px' }}
                >
                    {criticalityOptions.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.value === ''}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {criticality && (
                    <Badge
                        className={`mt-2 ${getCriticalityColor(criticality)} text-white`}
                        variant="solid"
                        display="flex"
                        alignItems="center"
                        gap={1}
                        w="fit-content"
                    >
                        <AlertTriangle size={14} />
                        {criticality} Priority
                    </Badge>
                )}
            </Box>
        </VStack>
    );
};
