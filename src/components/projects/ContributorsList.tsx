import React from 'react';
import { Box, VStack, Text, Card } from '@chakra-ui/react';
import { Users } from 'lucide-react';
import { ContributorCard } from './ContributorCard';
import { Contributor } from '@/types';

interface ContributorsListProps {
    contributors: Contributor[];
    criticalityOptions: Array<{ value: string; label: string }>;
    updateContributorCriticality: (id: string, criticality: string) => void;
    removeContributor: (id: string) => void;
    getCriticalityTextColor: (criticality: string) => string;
}

export const ContributorsList: React.FC<ContributorsListProps> = ({
    contributors,
    criticalityOptions,
    updateContributorCriticality,
    removeContributor,
    getCriticalityTextColor
}) => {
    if (contributors.length === 0) {
        return (
            <Box
                p={8}
                className="text-center bg-gray-100 !important border-2 border-dashed border-gray-300 !important rounded-lg"
            >
                <Users className="mx-auto text-gray-400 !important mb-3" size={48} />
                <Text className="text-gray-600 !important">
                    No contributors added yet. Click "Add Contributor" to get started.
                </Text>
            </Box>
        );
    }

    return (
        <Card.Root className="bg-gradient-to-br from-gray-50 to-blue-50 !important border border-gray-200 !important">
            <Card.Header className="bg-gradient-to-r from-blue-100 to-indigo-100 !important">
                <Text className="font-semibold text-gray-800 !important">
                    Project Contributors ({contributors.length})
                </Text>
            </Card.Header>
            <Card.Body className="bg-white !important">
                <VStack gap={4} align="stretch">
                    {contributors.map(contributor => (
                        <ContributorCard
                            key={contributor.id}
                            contributor={contributor}
                            criticalityOptions={criticalityOptions}
                            updateContributorCriticality={updateContributorCriticality}
                            removeContributor={removeContributor}
                            getCriticalityTextColor={getCriticalityTextColor}
                        />
                    ))}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};
