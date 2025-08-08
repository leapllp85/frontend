import React from 'react';
import { Box, Text, VStack, HStack, Badge, Card } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthDebug: React.FC = () => {
    const { user, role, permissions, isAuthenticated, isLoading } = useAuth();

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <Card.Root 
            position="fixed" 
            top="10px" 
            right="10px" 
            bg="yellow.50" 
            borderColor="yellow.200" 
            borderWidth="1px"
            zIndex={9999}
            maxW="300px"
        >
            <Card.Body p={3}>
                <VStack align="start" gap={2}>
                    <Text fontWeight="bold" fontSize="sm" color="yellow.800">
                        🐛 Auth Debug
                    </Text>
                    
                    <HStack>
                        <Text fontSize="xs" color="gray.600">Status:</Text>
                        <Badge colorScheme={isAuthenticated ? 'green' : 'red'}>
                            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                        </Badge>
                    </HStack>

                    <HStack>
                        <Text fontSize="xs" color="gray.600">Loading:</Text>
                        <Badge colorScheme={isLoading ? 'yellow' : 'green'}>
                            {isLoading ? 'Loading' : 'Ready'}
                        </Badge>
                    </HStack>

                    <HStack>
                        <Text fontSize="xs" color="gray.600">Role:</Text>
                        <Badge colorScheme={role === 'Manager' ? 'purple' : 'blue'}>
                            {role || 'None'}
                        </Badge>
                    </HStack>

                    <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">User Info:</Text>
                        {user ? (
                            <>
                                <Text fontSize="xs">ID: {user.id}</Text>
                                <Text fontSize="xs">Username: {user.username}</Text>
                                <Text fontSize="xs">Name: {user.first_name} {user.last_name}</Text>
                                <Text fontSize="xs">Email: {user.email}</Text>
                                <Text fontSize="xs">is_manager: {user.is_manager ? 'true' : 'false'}</Text>
                                <Text fontSize="xs">Role Field: {user.role || 'undefined'}</Text>
                            </>
                        ) : (
                            <Text fontSize="xs" color="red.500">No user data found</Text>
                        )}
                        
                        <Text fontSize="xs" color="gray.600">LocalStorage:</Text>
                        <Text fontSize="xs">userData: {localStorage.getItem('userData') ? 'exists' : 'missing'}</Text>
                        <Text fontSize="xs">accessToken: {localStorage.getItem('accessToken') ? 'exists' : 'missing'}</Text>
                    </VStack>

                    {permissions && (
                        <VStack align="start" gap={1}>
                            <Text fontSize="xs" color="gray.600">Key Permissions:</Text>
                            <Text fontSize="xs">Dashboard: {permissions.canViewDashboard ? '✅' : '❌'}</Text>
                            <Text fontSize="xs">Team Projects: {permissions.canViewTeamProjects ? '✅' : '❌'}</Text>
                            <Text fontSize="xs">My Team: {permissions.canViewMyTeam ? '✅' : '❌'}</Text>
                            <Text fontSize="xs">Create Projects: {permissions.canCreateProjects ? '✅' : '❌'}</Text>
                        </VStack>
                    )}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default AuthDebug;
