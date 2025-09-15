import React from 'react';
import { Box, Text, Flex, HStack, Button } from '@chakra-ui/react';
import { Contributor } from '@/types';

interface ContributorCardProps {
    contributor: Contributor;
    criticalityOptions: Array<{ value: string; label: string }>;
    updateContributorCriticality: (id: string, criticality: string) => void;
    removeContributor: (id: string) => void;
    getCriticalityTextColor: (criticality: string) => string;
}

export const ContributorCard: React.FC<ContributorCardProps> = ({
    contributor,
    criticalityOptions,
    updateContributorCriticality,
    removeContributor,
    getCriticalityTextColor
}) => {
    return (
        <Box
            p={4}
            className="bg-white !important rounded-lg shadow-sm"
        >
            <Flex align="center" justify="space-between">
                <Box flex="1">
                    <Text className="font-semibold text-gray-800 !important mb-1">
                        {contributor.name}
                    </Text>
                    <Text className="text-sm text-gray-600 !important">
                        {contributor.role} • {contributor.department}
                    </Text>
                </Box>

                <HStack gap={3}>
                    <Box>
                        <Text className="text-xs font-medium text-gray-600 !important mb-1">
                            Project Criticality
                        </Text>
                        <select
                            value={contributor.projectCriticality}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateContributorCriticality(contributor.id, e.target.value)}
                            className={`${getCriticalityTextColor(contributor.projectCriticality)} font-medium border-2 px-2 py-1 rounded`}
                        >
                            {criticalityOptions.slice(1).map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Box>

                    <Button
                        size="sm"
                        className="bg-red-100 !important hover:bg-red-200 !important text-red-600 !important"
                        onClick={() => removeContributor(contributor.id)}
                    >
                        Remove
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
};
