import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Folder } from 'lucide-react';

export const ProjectOnboardHeader: React.FC = () => {
    return (
        <Box textAlign="center" mb={8}>
            <Heading
                size="xl"
                className="text-gray-800 !important mb-2"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={3}
            >
                <Folder className="text-blue-600 !important" size={32} />
                Onboard New Project
            </Heading>
            <Text className="text-gray-600 !important">
                Set up your project and assign team members with their criticality levels
            </Text>
        </Box>
    );
};
