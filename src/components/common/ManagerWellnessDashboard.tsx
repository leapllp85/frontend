'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Button,
    SimpleGrid,
    Badge,
    Card,
    Spinner
} from '@chakra-ui/react';
import { X, TrendingUp, TrendingDown, Minus, Users, AlertTriangle, CheckCircle, Battery, Briefcase } from 'lucide-react';

interface EmployeeCheckIn {
    employeeId: string;
    employeeName: string;
    date: string;
    energy: 'high' | 'medium' | 'low';
    workload: 'yes' | 'no';
    timestamp: string;
}

interface AggregatedData {
    totalEmployees: number;
    respondedToday: number;
    energyDistribution: {
        high: number;
        medium: number;
        low: number;
    };
    workloadDistribution: {
        manageable: number;
        overwhelming: number;
    };
    trends: {
        energyTrend: 'improving' | 'stable' | 'declining';
        workloadTrend: 'improving' | 'stable' | 'worsening';
    };
    atRiskEmployees: Array<{
        id: string;
        name: string;
        reason: string;
    }>;
}

interface ManagerWellnessDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ManagerWellnessDashboard: React.FC<ManagerWellnessDashboardProps> = ({ isOpen, onClose }) => {
    const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
    const [last7DaysData, setLast7DaysData] = useState<EmployeeCheckIn[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('ManagerWellnessDashboard isOpen:', isOpen);
        if (isOpen) {
            loadTeamWellnessData();
        }
    }, [isOpen]);

    const loadTeamWellnessData = () => {
        console.log('Loading team wellness data...');
        setIsLoading(true);
        
        try {
            // Load actual check-in data from localStorage
            const historyStr = localStorage.getItem('checkInHistory');
            let actualData: EmployeeCheckIn[] = [];
            
            if (historyStr) {
                const history = JSON.parse(historyStr);
                console.log('Found check-in history:', history);
                
                // Convert to EmployeeCheckIn format
                actualData = history.map((entry: any) => ({
                    employeeId: entry.employeeId || 'current-user',
                    employeeName: entry.employeeName || 'Current User',
                    date: entry.date,
                    energy: entry.energy,
                    workload: entry.workload,
                    timestamp: entry.timestamp
                }));
            }
            
            // If no data, use mock data
            if (actualData.length === 0) {
                console.log('No check-in data found, using mock data');
                actualData = generateMockTeamData();
            }
            
            const aggregated = calculateAggregatedData(actualData);
            console.log('Aggregated data:', aggregated);
            setAggregatedData(aggregated);
            setLast7DaysData(actualData);
        } catch (error) {
            console.error('Error loading wellness data:', error);
            // Fallback to mock data on error
            const mockData = generateMockTeamData();
            const aggregated = calculateAggregatedData(mockData);
            setAggregatedData(aggregated);
            setLast7DaysData(mockData);
        }
        
        setIsLoading(false);
    };

    const generateMockTeamData = (): EmployeeCheckIn[] => {
        // Mock data - in production, fetch from API
        const employees = [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Mike Johnson' },
            { id: '4', name: 'Sarah Williams' },
            { id: '5', name: 'Tom Brown' },
            { id: '6', name: 'Emily Davis' },
            { id: '7', name: 'David Wilson' },
            { id: '8', name: 'Lisa Anderson' }
        ];

        const data: EmployeeCheckIn[] = [];
        const today = new Date();

        employees.forEach(emp => {
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                const energyOptions: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
                const workloadOptions: ('yes' | 'no')[] = ['yes', 'no'];
                
                data.push({
                    employeeId: emp.id,
                    employeeName: emp.name,
                    date: date.toISOString().split('T')[0],
                    energy: energyOptions[Math.floor(Math.random() * energyOptions.length)],
                    workload: workloadOptions[Math.floor(Math.random() * workloadOptions.length)],
                    timestamp: date.toISOString()
                });
            }
        });

        return data;
    };

    const calculateAggregatedData = (data: EmployeeCheckIn[]): AggregatedData => {
        const today = new Date().toISOString().split('T')[0];
        const todayData = data.filter(d => d.date === today);
        
        const uniqueEmployees = new Set(data.map(d => d.employeeId));
        const totalEmployees = uniqueEmployees.size;
        const respondedToday = new Set(todayData.map(d => d.employeeId)).size;

        // Energy distribution (today)
        const energyHigh = todayData.filter(d => d.energy === 'high').length;
        const energyMedium = todayData.filter(d => d.energy === 'medium').length;
        const energyLow = todayData.filter(d => d.energy === 'low').length;

        // Workload distribution (today)
        const workloadManageable = todayData.filter(d => d.workload === 'yes').length;
        const workloadOverwhelming = todayData.filter(d => d.workload === 'no').length;

        // Calculate trends (last 7 days)
        const last7Days = data.filter(d => {
            const date = new Date(d.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        });

        const energyValues = last7Days.map(d => d.energy === 'high' ? 3 : d.energy === 'medium' ? 2 : 1);
        const avgEnergy = energyValues.reduce((a, b) => a + b, 0) / energyValues.length;
        
        const workloadYes = last7Days.filter(d => d.workload === 'yes').length;
        const workloadPercentage = (workloadYes / last7Days.length) * 100;

        // Identify at-risk employees (low energy or overwhelming workload for 3+ days)
        const atRiskEmployees: Array<{ id: string; name: string; reason: string }> = [];
        uniqueEmployees.forEach(empId => {
            const empData = last7Days.filter(d => d.employeeId === empId).slice(0, 5);
            const lowEnergyCount = empData.filter(d => d.energy === 'low').length;
            const overwhelmedCount = empData.filter(d => d.workload === 'no').length;
            
            const empName = data.find(d => d.employeeId === empId)?.employeeName || 'Unknown';
            
            if (lowEnergyCount >= 3) {
                atRiskEmployees.push({
                    id: empId,
                    name: empName,
                    reason: `Low energy for ${lowEnergyCount} days`
                });
            } else if (overwhelmedCount >= 3) {
                atRiskEmployees.push({
                    id: empId,
                    name: empName,
                    reason: `Overwhelmed for ${overwhelmedCount} days`
                });
            }
        });

        return {
            totalEmployees,
            respondedToday,
            energyDistribution: {
                high: energyHigh,
                medium: energyMedium,
                low: energyLow
            },
            workloadDistribution: {
                manageable: workloadManageable,
                overwhelming: workloadOverwhelming
            },
            trends: {
                energyTrend: avgEnergy >= 2.5 ? 'improving' : avgEnergy >= 1.8 ? 'stable' : 'declining',
                workloadTrend: workloadPercentage >= 70 ? 'improving' : workloadPercentage >= 40 ? 'stable' : 'worsening'
            },
            atRiskEmployees
        };
    };

    if (!isOpen) return null;

    const responseRate = aggregatedData ? ((aggregatedData.respondedToday / aggregatedData.totalEmployees) * 100).toFixed(0) : '0';

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.4)"
            backdropFilter="blur(4px)"
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <Box
                bg="white"
                borderRadius="xl"
                shadow="xl"
                maxW="1200px"
                w="95%"
                maxH="90vh"
                p={3}
                position="relative"
                m={2}
                overflow="auto"
            >
                {/* Action Buttons */}
                <HStack
                    position="absolute"
                    top={4}
                    right={4}
                    gap={2}
                    zIndex={10}
                >
                    {/* Open Application Button */}
                    <Box
                        cursor="pointer"
                        onClick={() => {
                            console.log('Open Application clicked - opening new browser window');
                            // Always open main application in a new browser window/tab
                            const baseUrl = window.location.origin;
                            window.open(baseUrl + '/', '_blank');
                        }}
                        p={2}
                        borderRadius="full"
                        bg="blue.100"
                        _hover={{ bg: 'blue.200', transform: 'scale(1.1)' }}
                        transition="all 0.2s"
                        title="Open Application"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </Box>
                    
                    {/* Close Button */}
                    <Box
                        cursor="pointer"
                        onClick={onClose}
                        p={2}
                        borderRadius="full"
                        bg="gray.100"
                        _hover={{ bg: 'gray.200', transform: 'scale(1.1)' }}
                        transition="all 0.2s"
                        title="Close Dashboard"
                    >
                        <X size={24} color="#64748b" />
                    </Box>
                </HStack>

                {/* Header */}
                <VStack gap={1} mb={2} align="start">
                    <HStack gap={3}>
                        <Box
                            p={2}
                            bg="blue.50"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="blue.200"
                        >
                            <Users size={22} color="#3b82f6" />
                        </Box>
                        <VStack align="start" gap={0}>
                            <Heading size="md" color="gray.700" fontWeight="500">
                                Team Wellness Dashboard
                            </Heading>
                            <Text color="gray.600" fontSize="xs">
                                Real-time insights into your team's wellbeing
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>

                {/* Loading State */}
                {(isLoading || !aggregatedData) && (
                    <Box textAlign="center" py={20}>
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4} color="gray.600" fontSize="lg">Loading team wellness data...</Text>
                    </Box>
                )}

                {/* Content - Only show when data is loaded */}
                {!isLoading && aggregatedData && (
                <>
                {/* Key Metrics */}
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={2} mb={2}>
                    {/* Total Employees */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={1}>
                                <HStack justify="space-between" w="full">
                                    <Text fontSize="xs" color="gray.600" fontWeight="500">Total Team</Text>
                                    <Users size={16} color="#3b82f6" />
                                </HStack>
                                <Text fontSize="xl" fontWeight="600" color="blue.600">
                                    {aggregatedData.totalEmployees}
                                </Text>
                                <Text fontSize="2xs" color="gray.500">employees</Text>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Response Rate */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={1}>
                                <HStack justify="space-between" w="full">
                                    <Text fontSize="xs" color="gray.600" fontWeight="500">Response</Text>
                                    <CheckCircle size={16} color="#10b981" />
                                </HStack>
                                <Text fontSize="xl" fontWeight="600" color="green.600">
                                    {responseRate}%
                                </Text>
                                <Text fontSize="2xs" color="gray.500">
                                    {aggregatedData.respondedToday} of {aggregatedData.totalEmployees} responded
                                </Text>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Energy Trend */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                        </Card.Body>
                    </Card.Root>

                    {/* At Risk */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={1}>
                                <HStack justify="space-between" w="full">
                                    <Text fontSize="xs" color="gray.600" fontWeight="500">At Risk</Text>
                                    <AlertTriangle size={16} color="#ef4444" />
                                </HStack>
                                <Text fontSize="xl" fontWeight="600" color="red.600">
                                    {aggregatedData.atRiskEmployees.length}
                                </Text>
                                <Text fontSize="2xs" color="gray.500">need attention</Text>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* 7-Day Trend Graphs */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={2} mb={2}>
                    {/* Energy Level Trend Graph */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={2}>
                                <HStack gap={1.5}>
                                    <Battery size={16} color="#6366f1" />
                                    <Heading size="xs" color="gray.700" fontWeight="500">Energy Levels (7 Days)</Heading>
                                </HStack>
                                
                                <Box position="relative" h="80px" w="full">
                                    {/* Energy Line Graph */}
                                    {(() => {
                                        // Get last 7 days of data grouped by date
                                        const last7Days = [];
                                        for (let i = 6; i >= 0; i--) {
                                            const date = new Date();
                                            date.setDate(date.getDate() - i);
                                            const dateStr = date.toISOString().split('T')[0];
                                            
                                            // Get all check-ins for this date
                                            const dayData = last7DaysData.filter(d => d.date === dateStr);
                                            
                                            // Calculate average energy for the day
                                            let avgEnergy = 'medium';
                                            if (dayData.length > 0) {
                                                const energyValues = dayData.map(d => 
                                                    d.energy === 'high' ? 3 : d.energy === 'medium' ? 2 : 1
                                                );
                                                const avg = energyValues.reduce((a, b) => a + b, 0) / energyValues.length;
                                                avgEnergy = avg >= 2.5 ? 'high' : avg >= 1.5 ? 'medium' : 'low';
                                            }
                                            
                                            last7Days.push({
                                                date: dateStr,
                                                energy: avgEnergy,
                                                dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' })
                                            });
                                        }
                                        
                                        return (
                                            <>
                                                {/* Data Points with Emojis */}
                                                <HStack gap={1} h="80px" justify="space-between" position="relative">
                                                    {last7Days.map((day, index) => {
                                                        const topPosition = day.energy === 'high' ? '8px' : day.energy === 'medium' ? '32px' : '56px';
                                                        const emoji = day.energy === 'high' ? '🚀' : day.energy === 'medium' ? '😊' : '😴';
                                                        const color = day.energy === 'high' ? '#10b981' : day.energy === 'medium' ? '#f59e0b' : '#ef4444';
                                                        
                                                        return (
                                                            <Box key={index} flex={1} position="relative" h="full">
                                                                <Box
                                                                    position="absolute"
                                                                    top={topPosition}
                                                                    left="50%"
                                                                    transform="translateX(-50%)"
                                                                >
                                                                    <Box
                                                                        bg={color}
                                                                        borderRadius="full"
                                                                        p={1}
                                                                        boxShadow="0 1px 3px rgba(0,0,0,0.08)"
                                                                        border="2px solid white"
                                                                    >
                                                                        <Text fontSize="14px">{emoji}</Text>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        );
                                                    })}
                                                </HStack>
                                                
                                                {/* Connecting Lines */}
                                                <svg width="100%" height="80" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                                                    {last7Days.map((day, index) => {
                                                        if (index === last7Days.length - 1) return null;
                                                        
                                                        const getYPosition = (energy: string) => {
                                                            if (energy === 'high') return 18;
                                                            if (energy === 'medium') return 42;
                                                            return 66;
                                                        };
                                                        
                                                        const currentY = getYPosition(day.energy);
                                                        const nextY = getYPosition(last7Days[index + 1].energy);
                                                        
                                                        const currentColor = day.energy === 'high' ? '#6ee7b7' : day.energy === 'medium' ? '#fbbf24' : '#fca5a5';
                                                        const nextColor = last7Days[index + 1].energy === 'high' ? '#6ee7b7' : last7Days[index + 1].energy === 'medium' ? '#fbbf24' : '#fca5a5';
                                                        
                                                        const columnWidth = 100 / last7Days.length;
                                                        const x1 = `${(index * columnWidth) + (columnWidth / 2)}%`;
                                                        const x2 = `${((index + 1) * columnWidth) + (columnWidth / 2)}%`;
                                                        
                                                        const strokeColor = currentY === nextY ? currentColor : `url(#energy-gradient-${index})`;
                                                        
                                                        return (
                                                            <line
                                                                key={index}
                                                                x1={x1}
                                                                y1={currentY}
                                                                x2={x2}
                                                                y2={nextY}
                                                                stroke={strokeColor}
                                                                strokeWidth="2.5"
                                                                strokeLinecap="round"
                                                            />
                                                        );
                                                    })}
                                                    <defs>
                                                        {last7Days.map((day, index) => {
                                                            if (index === last7Days.length - 1) return null;
                                                            const currentColor = day.energy === 'high' ? '#10b981' : day.energy === 'medium' ? '#f59e0b' : '#ef4444';
                                                            const nextColor = last7Days[index + 1].energy === 'high' ? '#10b981' : last7Days[index + 1].energy === 'medium' ? '#f59e0b' : '#ef4444';
                                                            return (
                                                                <linearGradient key={index} id={`energy-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                                    <stop offset="0%" stopColor={currentColor} />
                                                                    <stop offset="100%" stopColor={nextColor} />
                                                                </linearGradient>
                                                            );
                                                        })}
                                                    </defs>
                                                </svg>
                                                
                                                {/* Date Labels */}
                                                <HStack gap={0} justify="space-between" mt={1}>
                                                    {last7Days.map((day, index) => (
                                                        <Box key={index} flex={1} textAlign="center">
                                                            <Text fontSize="2xs" color="gray.700" fontWeight="700">
                                                                {day.dayLabel}
                                                            </Text>
                                                        </Box>
                                                    ))}
                                                </HStack>
                                            </>
                                        );
                                    })()}
                                </Box>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Workload Status Trend Graph */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={2}>
                                <HStack gap={1.5}>
                                    <Briefcase size={16} color="#6366f1" />
                                    <Heading size="xs" color="gray.700" fontWeight="500">Workload Status (7 Days)</Heading>
                                </HStack>
                                
                                <Box w="full">
                                    {(() => {
                                        // Get last 7 days of data grouped by date
                                        const last7Days = [];
                                        for (let i = 6; i >= 0; i--) {
                                            const date = new Date();
                                            date.setDate(date.getDate() - i);
                                            const dateStr = date.toISOString().split('T')[0];
                                            
                                            // Get all check-ins for this date
                                            const dayData = last7DaysData.filter(d => d.date === dateStr);
                                            
                                            // Calculate percentage manageable
                                            let manageablePercentage = 0;
                                            if (dayData.length > 0) {
                                                const manageableCount = dayData.filter(d => d.workload === 'yes').length;
                                                manageablePercentage = (manageableCount / dayData.length) * 100;
                                            }
                                            
                                            last7Days.push({
                                                date: dateStr,
                                                manageablePercentage,
                                                dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
                                                isManageable: manageablePercentage >= 50
                                            });
                                        }
                                        
                                        return (
                                            <>
                                                <HStack gap={2} align="end" h="100px">
                                                    {last7Days.map((day, index) => {
                                                        const height = day.manageablePercentage > 0 ? `${day.manageablePercentage}%` : '5%';
                                                        const emoji = day.isManageable ? '✅' : '😰';
                                                        const color = day.isManageable ? '#10b981' : '#ef4444';
                                                        
                                                        return (
                                                            <VStack key={index} flex={1} h="full" justify="end" gap={1}>
                                                                <Box
                                                                    w="full"
                                                                    h={height}
                                                                    bg={color}
                                                                    borderRadius="md"
                                                                    position="relative"
                                                                    minH="20px"
                                                                >
                                                                    <Box
                                                                        position="absolute"
                                                                        top="-25px"
                                                                        left="50%"
                                                                        transform="translateX(-50%)"
                                                                        bg="white"
                                                                        borderRadius="full"
                                                                        p={1}
                                                                        boxShadow="sm"
                                                                    >
                                                                        <Text fontSize="14px">{emoji}</Text>
                                                                    </Box>
                                                                </Box>
                                                                <Text fontSize="2xs" color="gray.600" fontWeight="500">
                                                                    {day.dayLabel}
                                                                </Text>
                                                            </VStack>
                                                        );
                                                    })}
                                                </HStack>
                                            </>
                                        );
                                    })()}
                                </Box>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* Detailed Breakdown */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={2} mb={2}>
                    {/* Energy Distribution */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={2}>
                                <HStack gap={1.5}>
                                    <Battery size={16} color="#6366f1" />
                                    <Heading size="xs" color="gray.700" fontWeight="500">Energy Levels (Today)</Heading>
                                </HStack>
                                
                                <VStack w="full" gap={3}>
                                    {/* High Energy */}
                                    <Box w="full">
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Text fontSize="lg">🚀</Text>
                                                <Text fontWeight="500" color="gray.600">High Energy</Text>
                                            </HStack>
                                            <Badge colorScheme="green" fontSize="sm" px={2} py={0.5}>
                                                {aggregatedData.energyDistribution.high}
                                            </Badge>
                                        </HStack>
<Box w="full" h="5px" bg="gray.100" borderRadius="full" overflow="hidden">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? ((aggregatedData.energyDistribution.high / aggregatedData.respondedToday) * 100) : 0}%`}
                                                h="full"
                                                bg="#6ee7b7"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Medium Energy */}
                                    <Box w="full">
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Text fontSize="lg">😊</Text>
                                                <Text fontWeight="500" color="gray.600">Medium Energy</Text>
                                            </HStack>
                                            <Badge colorScheme="orange" fontSize="sm" px={2} py={0.5}>
                                                {aggregatedData.energyDistribution.medium}
                                            </Badge>
                                        </HStack>
<Box w="full" h="5px" bg="gray.100" borderRadius="full" overflow="hidden">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? ((aggregatedData.energyDistribution.medium / aggregatedData.respondedToday) * 100) : 0}%`}
                                                h="full"
                                                bg="#fbbf24"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Low Energy */}
                                    <Box w="full">
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Text fontSize="lg">😴</Text>
                                                <Text fontWeight="500" color="gray.600">Low Energy</Text>
                                            </HStack>
                                            <Badge colorScheme="red" fontSize="sm" px={2} py={0.5}>
                                                {aggregatedData.energyDistribution.low}
                                            </Badge>
                                        </HStack>
<Box w="full" h="5px" bg="gray.100" borderRadius="full" overflow="hidden">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? ((aggregatedData.energyDistribution.low / aggregatedData.respondedToday) * 100) : 0}%`}
                                                h="full"
                                                bg="#fca5a5"
                                            />
                                        </Box>
                                    </Box>
                                </VStack>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Workload Distribution */}
                    <Card.Root bg="white" border="1px solid" borderColor="gray.200" shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={2}>
                                <HStack gap={1.5}>
                                    <Briefcase size={16} color="#6366f1" />
                                    <Heading size="xs" color="gray.700" fontWeight="500">Workload Status (Today)</Heading>
                                </HStack>
                                
                                <VStack w="full" gap={3}>
                                    {/* Manageable */}
                                    <Box w="full">
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Text fontSize="lg">✅</Text>
                                                <Text fontWeight="500" color="gray.600">Manageable</Text>
                                            </HStack>
                                            <Badge colorScheme="green" fontSize="sm" px={2} py={0.5}>
                                                {aggregatedData.workloadDistribution.manageable}
                                            </Badge>
                                        </HStack>
<Box w="full" h="5px" bg="gray.100" borderRadius="full" overflow="hidden">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? ((aggregatedData.workloadDistribution.manageable / aggregatedData.respondedToday) * 100) : 0}%`}
                                                h="full"
                                                bg="#6ee7b7"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Overwhelming */}
                                    <Box w="full">
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Text fontSize="lg">⚠️</Text>
                                                <Text fontWeight="500" color="gray.600">Overwhelming</Text>
                                            </HStack>
                                            <Badge colorScheme="red" fontSize="sm" px={2} py={0.5}>
                                                {aggregatedData.workloadDistribution.overwhelming}
                                            </Badge>
                                        </HStack>
<Box w="full" h="5px" bg="gray.100" borderRadius="full" overflow="hidden">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? ((aggregatedData.workloadDistribution.overwhelming / aggregatedData.respondedToday) * 100) : 0}%`}
                                                h="full"
                                                bg="#fca5a5"
                                            />
                                        </Box>
                                    </Box>
                                </VStack>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* At-Risk Employees */}
                {aggregatedData.atRiskEmployees.length > 0 && (
                    <Card.Root bg="white" border="1px solid" borderColor="red.300" mb={2} shadow="sm">
                        <Card.Body p={2}>
                            <VStack align="start" gap={2}>
                                <HStack gap={1.5}>
                                    <AlertTriangle size={16} color="#ef4444" />
                                    <Heading size="xs" color="red.600" fontWeight="500">Employees Needing Attention</Heading>
                                </HStack>
                                
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={2} w="full">
                                    {aggregatedData.atRiskEmployees.map((emp) => (
                                        <Box
                                            key={emp.id}
                                            p={3}
                                            bg="white"
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor="red.200"
                                        >
                                            <VStack align="start" gap={1}>
                                                <Text fontWeight="bold" color="gray.800">{emp.name}</Text>
                                                <Text fontSize="sm" color="red.600">{emp.reason}</Text>
                                            </VStack>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                )}
                </>
                )}
            </Box>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </Box>
    );
};
