import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { Plus, Users } from 'lucide-react';
import { EmployeeSearch } from './EmployeeSearch';
import { ContributorsList } from './ContributorsList';

import { Employee, Contributor } from '@/types';

interface ContributorsManagerProps {
    contributors: Contributor[];
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredEmployees: Employee[];
    addContributor: (employee: Employee) => void;
    updateContributorCriticality: (id: string, criticality: string) => void;
    removeContributor: (id: string) => void;
    criticalityOptions: Array<{ value: string; label: string }>;
    getCriticalityTextColor: (criticality: string) => string;
}

export const ContributorsManager: React.FC<ContributorsManagerProps> = ({
    contributors,
    showSearch,
    setShowSearch,
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    addContributor,
    updateContributorCriticality,
    removeContributor,
    criticalityOptions,
    getCriticalityTextColor
}) => {
    return (
        <Box>
            <Text className="text-gray-700 font-semibold flex items-center gap-2 mb-3">
                <Users size={18} />
                Contributors
            </Text>

            {/* Add Contributor Button */}
            <Button
                onClick={() => setShowSearch(!showSearch)}
                className="mb-4 bg-blue-600 !important hover:bg-blue-700 !important text-white !important"
                size="md"
            >
                <Plus size={16} style={{ marginRight: '8px' }} />
                Add Contributor
            </Button>

            {/* Search Interface */}
            {showSearch && (
                <EmployeeSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredEmployees={filteredEmployees}
                    addContributor={addContributor}
                />
            )}

            {/* Contributors List */}
            <ContributorsList
                contributors={contributors}
                criticalityOptions={criticalityOptions}
                updateContributorCriticality={updateContributorCriticality}
                removeContributor={removeContributor}
                getCriticalityTextColor={getCriticalityTextColor}
            />
        </Box>
    );
};
