import React from 'react';
import { Box, Button, VStack, Text, Card } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export const ManagerTest: React.FC = () => {
    const { login, logout } = useAuth();

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    const testManagerUser: User = {
        id: 35,
        username: "manager_user",
        first_name: "Manager",
        last_name: "User",
        email: "manager_user@company.com",
        role: "Manager",
        is_manager: true,
    };

    const testAssociateUser: User = {
        id: 36,
        username: "associate_user",
        first_name: "Associate",
        last_name: "User",
        email: "associate_user@company.com",
        role: "Associate",
        is_manager: false,
    };

    const handleLoginAsManager = () => {
        login(testManagerUser);
    };

    const handleLoginAsAssociate = () => {
        login(testAssociateUser);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Card.Root 
            position="fixed" 
            bottom="10px" 
            right="10px" 
            bg="blue.50" 
            borderColor="blue.200" 
            borderWidth="1px"
            zIndex={9999}
            maxW="250px"
        >
            <Card.Body p={3}>
                <VStack align="start" gap={2}>
                    <Text fontWeight="bold" fontSize="sm" color="blue.800">
                        🧪 Manager Test
                    </Text>
                    
                    <Button 
                        size="xs" 
                        colorScheme="purple" 
                        onClick={handleLoginAsManager}
                        w="full"
                    >
                        Login as Manager
                    </Button>
                    
                    <Button 
                        size="xs" 
                        colorScheme="blue" 
                        onClick={handleLoginAsAssociate}
                        w="full"
                    >
                        Login as Associate
                    </Button>
                    
                    <Button 
                        size="xs" 
                        variant="outline" 
                        onClick={handleLogout}
                        w="full"
                    >
                        Logout
                    </Button>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default ManagerTest;
