import React from 'react';
import { HStack, Button } from '@chakra-ui/react';

interface ProjectActionButtonsProps {
    projectName: string;
    criticality: string;
    onCancel?: () => void;
    onCreateProject?: () => void;
}

export const ProjectActionButtons: React.FC<ProjectActionButtonsProps> = ({
    projectName,
    criticality,
    onCancel,
    onCreateProject
}) => {
    return (
        <HStack gap={4} justify="flex-end" pt={6}>
            <Button
                size="lg"
                className="bg-gray-200 !important hover:bg-gray-300 !important text-gray-700 !important"
                onClick={onCancel}
            >
                Cancel
            </Button>
            <Button
                size="lg"
                className="bg-green-600 !important hover:bg-green-700 !important text-white !important shadow-lg"
                disabled={!projectName || !criticality}
                onClick={onCreateProject}
            >
                Create Project
            </Button>
        </HStack>
    );
};
