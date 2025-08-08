import React from 'react';
import { Box, VStack, Input, Text, Flex, Spacer, IconButton, Card } from '@chakra-ui/react';
import { Search, Plus } from 'lucide-react';
import { Employee } from '@/types';

interface EmployeeSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredEmployees: Employee[];
    addContributor: (employee: Employee) => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    addContributor
}) => {
    return (
        <Card.Root className="mb-4 bg-gray-50 !important border border-gray-200 !important">
            <Card.Body className="bg-gray-50 !important">
                <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                        <Search className="text-gray-400" size={20} />
                    </Box>
                    <Input
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        placeholder="Search employees..."
                        pl={10}
                        bg="white"
                        borderColor="gray.300"
                    />
                </Box>

                {searchTerm && (
                    <VStack gap={2} mt={3} align="stretch">
                        {filteredEmployees.map(employee => (
                            <Box
                                key={employee.id}
                                p={3}
                                className="bg-white !important border border-gray-200 !important rounded-lg cursor-pointer hover:bg-blue-50 !important transition-colors"
                                onClick={() => addContributor(employee)}
                            >
                                <Flex align="center">
                                    <Box>
                                        <Text className="font-semibold text-gray-800 !important">
                                            {employee.name}
                                        </Text>
                                        <Text className="text-sm text-gray-600 !important">
                                            {employee.role} • {employee.department}
                                        </Text>
                                    </Box>
                                    <Spacer />
                                    <IconButton
                                        size="sm"
                                        className="bg-blue-100 !important hover:bg-blue-200 !important text-blue-600 !important"
                                    >
                                        <Plus size={16} />
                                    </IconButton>
                                </Flex>
                            </Box>
                        ))}
                        {filteredEmployees.length === 0 && (
                            <Text className="text-center text-gray-500 !important py-4">
                                No employees found
                            </Text>
                        )}
                    </VStack>
                )}
            </Card.Body>
        </Card.Root>
    );
};
