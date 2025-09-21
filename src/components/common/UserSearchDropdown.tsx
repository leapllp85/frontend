'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Button,
    Spinner,
    Badge,
} from '@chakra-ui/react';
import { Search, Plus, X } from 'lucide-react';
import { userApi } from '@/services/userApi';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_pic?: string;
}

interface UserSearchDropdownProps {
    currentTeamMembers: User[];
    onAddUser: (user: User) => void;
    placeholder?: string;
}

export const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
    currentTeamMembers,
    onAddUser,
    placeholder = "Search users to add to project..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get current team member IDs for filtering
    const currentMemberIds = currentTeamMembers.map(member => member.id);

    // Load all users on component mount
    useEffect(() => {
        const loadAllUsers = async () => {
            try {
                console.log('Loading all users...');
                const users = await userApi.getAllUsers();
                console.log('Loaded users:', users);
                
                // Ensure users is an array
                if (Array.isArray(users)) {
                    setAllUsers(users);
                } else {
                    console.warn('getAllUsers returned non-array:', users);
                    setAllUsers([]);
                }
                
                // Show current team members by default
                setSearchResults(currentTeamMembers);
            } catch (error) {
                console.error('Failed to load users:', error);
                
                // Check if it's a server/database error
                const errorMessage = error instanceof Error ? error.message : String(error);
                if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
                    setError('Backend server is temporarily unavailable. Some features may be limited.');
                } else {
                    setError('Failed to load users');
                }
                setAllUsers([]);
            }
        };

        loadAllUsers();
    }, [currentTeamMembers]);

    // Handle search
    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery.trim()) {
                // Show current team members when no search query
                setSearchResults(currentTeamMembers);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // First try API search
                console.log('Searching for:', searchQuery);
                let results = await userApi.searchUsers(searchQuery);
                console.log('API search results:', results);
                
                // Ensure results is an array
                if (!Array.isArray(results)) {
                    console.warn('API returned non-array results:', results);
                    results = [];
                }
                
                // If API search returns no results, fall back to local filtering
                if (results.length === 0) {
                    console.log('No API results, falling back to local search');
                    results = allUsers.filter(user => 
                        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    console.log('Local search results:', results);
                }

                setSearchResults(results);
            } catch (error) {
                console.error('Search failed:', error);
                
                // Check if it's a server/database error
                const errorMessage = error instanceof Error ? error.message : String(error);
                if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
                    setError('Backend server is temporarily unavailable. Showing cached results.');
                } else {
                    setError('Search failed. Showing local results.');
                }
                
                // Fall back to local search
                const localResults = allUsers.filter(user => 
                    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                console.log('Fallback local search results:', localResults);
                setSearchResults(localResults);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, allUsers, currentTeamMembers]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddUser = (user: User) => {
        onAddUser(user);
        setSearchQuery('');
        setIsOpen(false);
        setSearchResults(currentTeamMembers);
    };

    const getUserDisplayName = (user: User) => {
        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return user.username;
    };

    return (
        <Box position="relative" ref={dropdownRef}>
            <Box position="relative">
                <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="gray.800"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{ borderColor: "#a5489f", bg: "white", boxShadow: "0 0 0 1px #a5489f" }}
                    pl={10}
                />
                <Search 
                    size={16} 
                    style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                    }} 
                />
            </Box>

            {isOpen && (
                <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    shadow="sm"
                    zIndex={1000}
                    maxH="300px"
                    overflowY="auto"
                    mt={1}
                >
                    {loading && (
                        <Box p={4} textAlign="center">
                            <Spinner size="sm" color="#a5489f" />
                            <Text fontSize="sm" color="gray.600" mt={2}>Searching users...</Text>
                        </Box>
                    )}

                    {error && (
                        <Box p={4} textAlign="center">
                            <Text fontSize="sm" color="red.600">{error}</Text>
                        </Box>
                    )}

                    {!loading && !error && searchResults.length === 0 && (
                        <Box p={4} textAlign="center">
                            <Text fontSize="sm" color="gray.600">No users found</Text>
                        </Box>
                    )}

                    {!loading && !error && searchResults.length > 0 && (
                        <VStack gap={0} align="stretch">
                            {searchResults.map((user) => {
                                const isCurrentMember = currentMemberIds.includes(user.id);
                                
                                return (
                                    <HStack
                                        key={user.id}
                                        p={3}
                                        _hover={{ bg: "gray.50" }}
                                        cursor={isCurrentMember ? "default" : "pointer"}
                                        onClick={() => !isCurrentMember && handleAddUser(user)}
                                        justify="space-between"
                                        opacity={isCurrentMember ? 0.6 : 1}
                                    >
                                        <HStack gap={3}>
                                            <Box
                                                w="32px"
                                                h="32px"
                                                borderRadius="full"
                                                bg="purple.100"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="sm"
                                                fontWeight="bold"
                                                color="purple.600"
                                            >
                                                {getUserDisplayName(user).charAt(0).toUpperCase()}
                                            </Box>
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="medium" color="gray.800">
                                                    {getUserDisplayName(user)}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    {user.email}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        
                                        {isCurrentMember ? (
                                            <Badge colorScheme="green" size="sm">
                                                Current Member
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                colorScheme="purple"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddUser(user);
                                                }}
                                            >
                                                <Plus size={16} />
                                            </Button>
                                        )}
                                    </HStack>
                                );
                            })}
                        </VStack>
                    )}
                </Box>
            )}
        </Box>
    );
};
