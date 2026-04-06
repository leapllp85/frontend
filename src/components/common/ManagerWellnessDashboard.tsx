'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Grid,
    Badge,
    Spinner
} from '@chakra-ui/react';
import { X, TrendingUp, Users, AlertTriangle, CheckCircle, ExternalLink, Check } from 'lucide-react';

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
    atRiskEmployees: Array<{
        id: string;
        name: string;
        reason: string;
        daysAffected: number;
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
        if (isOpen) {
            loadTeamWellnessData();
        }
    }, [isOpen]);

    const loadTeamWellnessData = () => {
        setIsLoading(true);
        
        try {
            const historyStr = localStorage.getItem('checkInHistory');
            let actualData: EmployeeCheckIn[] = [];
            
            if (historyStr) {
                const history = JSON.parse(historyStr);
                actualData = history.map((entry: any) => ({
                    employeeId: entry.employeeId || 'current-user',
                    employeeName: entry.employeeName || 'Current User',
                    date: entry.date,
                    energy: entry.energy,
                    workload: entry.workload,
                    timestamp: entry.timestamp
                }));
            }
            
            if (actualData.length === 0) {
                actualData = generateMockTeamData();
            }
            
            const aggregated = calculateAggregatedData(actualData);
            setAggregatedData(aggregated);
            setLast7DaysData(actualData);
        } catch (error) {
            console.error('Error loading wellness data:', error);
            const mockData = generateMockTeamData();
            const aggregated = calculateAggregatedData(mockData);
            setAggregatedData(aggregated);
            setLast7DaysData(mockData);
        }
        
        setIsLoading(false);
    };

    const generateMockTeamData = (): EmployeeCheckIn[] => {
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

        const energyHigh = todayData.filter(d => d.energy === 'high').length;
        const energyMedium = todayData.filter(d => d.energy === 'medium').length;
        const energyLow = todayData.filter(d => d.energy === 'low').length;

        const workloadManageable = todayData.filter(d => d.workload === 'yes').length;
        const workloadOverwhelming = todayData.filter(d => d.workload === 'no').length;

        const last7Days = data.filter(d => {
            const date = new Date(d.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        });

        const atRiskEmployees: Array<{ id: string; name: string; reason: string; daysAffected: number }> = [];
        uniqueEmployees.forEach(empId => {
            const empData = last7Days.filter(d => d.employeeId === empId).slice(0, 5);
            const lowEnergyCount = empData.filter(d => d.energy === 'low').length;
            const overwhelmedCount = empData.filter(d => d.workload === 'no').length;
            
            const empName = data.find(d => d.employeeId === empId)?.employeeName || 'Unknown';
            
            if (lowEnergyCount >= 3) {
                atRiskEmployees.push({
                    id: empId,
                    name: empName,
                    reason: 'Low energy',
                    daysAffected: lowEnergyCount
                });
            } else if (overwhelmedCount >= 3) {
                atRiskEmployees.push({
                    id: empId,
                    name: empName,
                    reason: 'Overwhelmed',
                    daysAffected: overwhelmedCount
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
            atRiskEmployees
        };
    };

    const getLast7DaysChartData = () => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayData = last7DaysData.filter(d => d.date === dateStr);
            
            let avgEnergyValue = 0;
            if (dayData.length > 0) {
                const energyValues = dayData.map(d => 
                    d.energy === 'high' ? 5 : d.energy === 'medium' ? 3 : 1
                );
                avgEnergyValue = energyValues.reduce((a, b) => a + b, 0) / energyValues.length;
            }
            
            const manageableCount = dayData.filter(d => d.workload === 'yes').length;
            const isManageable = dayData.length > 0 && (manageableCount / dayData.length) >= 0.5;
            
            last7Days.push({
                date: dateStr,
                dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
                energyValue: avgEnergyValue,
                isManageable
            });
        }
        return last7Days;
    };

    if (!isOpen) return null;

    const responseRate = aggregatedData ? ((aggregatedData.respondedToday / aggregatedData.totalEmployees) * 100).toFixed(0) : '0';
    const chartData = getLast7DaysChartData();

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
                maxW="1000px"
                w="95%"
                maxH="90vh"
                p={6}
                position="relative"
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
                    <Box
                        cursor="pointer"
                        onClick={() => {
                            const baseUrl = window.location.origin;
                            window.open(baseUrl + '/', '_blank');
                        }}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                        transition="all 0.2s"
                        title="Open Application"
                    >
                        <ExternalLink size={20} color="#6b7280" />
                    </Box>
                    
                    <Box
                        cursor="pointer"
                        onClick={onClose}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                        transition="all 0.2s"
                        title="Close Dashboard"
                    >
                        <X size={20} color="#6b7280" />
                    </Box>
                </HStack>

                {/* Header */}
                <VStack gap={0} mb={5} align="start">
                    <Heading size="lg" color="gray.800" fontWeight="600">
                        Team Wellness Dashboard
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                        Real-time insights into your team's wellbeing
                    </Text>
                </VStack>

                {/* Loading State */}
                {(isLoading || !aggregatedData) && (
                    <Box textAlign="center" py={20}>
                        <Spinner size="xl" color="blue.500" />
                        <Text mt={4} color="gray.600">Loading team wellness data...</Text>
                    </Box>
                )}

                {/* Content */}
                {!isLoading && aggregatedData && (
                    <VStack gap={4} align="stretch">
                        {/* Top Metrics */}
                        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            {/* Total Team */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" color="gray.600" fontWeight="500">Total Team</Text>
                                    <Users size={18} color="#6b7280" />
                                </HStack>
                                <Text fontSize="3xl" fontWeight="700" color="gray.900" mb={1}>
                                    {aggregatedData.totalEmployees}
                                </Text>
                                <Text fontSize="xs" color="gray.500">employees</Text>
                            </Box>

                            {/* Response */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" color="gray.600" fontWeight="500">Response</Text>
                                    <CheckCircle size={18} color="#10b981" />
                                </HStack>
                                <Text fontSize="3xl" fontWeight="700" color="gray.900" mb={1}>
                                    {responseRate}%
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {aggregatedData.respondedToday} of {aggregatedData.totalEmployees} responded
                                </Text>
                            </Box>

                            {/* At Risk */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" color="gray.600" fontWeight="500">At Risk</Text>
                                    <AlertTriangle size={18} color="#ef4444" />
                                </HStack>
                                <Text fontSize="3xl" fontWeight="700" color="gray.900" mb={1}>
                                    {aggregatedData.atRiskEmployees.length}
                                </Text>
                                <Text fontSize="xs" color="gray.500">need attention</Text>
                            </Box>
                        </Grid>

                        {/* Charts Row */}
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            {/* Energy Trend (7 Days) */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack gap={2} mb={4}>
                                    <TrendingUp size={16} color="#6b7280" />
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Energy Trend (7 Days)</Text>
                                </HStack>
                                
                                <Box position="relative" h="120px" w="full">
                                    {/* Chart area with y-axis labels */}
                                    <HStack gap={2} h="90px" align="stretch">
                                        {/* Y-axis labels */}
                                        <VStack justify="space-between" h="full" py={1}>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">High</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Medium</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Low</Text>
                                        </VStack>
                                        
                                        {/* Chart */}
                                        <Box flex={1} h="full">
                                            <svg width="100%" height="100%" viewBox="0 0 100 90" preserveAspectRatio="none">
                                                {/* Grid lines */}
                                                <line x1="0" y1="10" x2="100" y2="10" stroke="#e5e7eb" strokeWidth="0.5" />
                                                <line x1="0" y1="40" x2="100" y2="40" stroke="#e5e7eb" strokeWidth="0.5" />
                                                <line x1="0" y1="70" x2="100" y2="70" stroke="#e5e7eb" strokeWidth="0.5" />
                                                <line x1="0" y1="85" x2="100" y2="85" stroke="#e5e7eb" strokeWidth="1" />
                                                
                                                {/* Line chart */}
                                                <polyline
                                                    points={chartData.map((d, i) => {
                                                        const x = (i / (chartData.length - 1)) * 100;
                                                        const y = 85 - (d.energyValue / 5) * 70;
                                                        return `${x},${y}`;
                                                    }).join(' ')}
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                                
                                                {/* Data points */}
                                                {chartData.map((d, i) => {
                                                    const x = (i / (chartData.length - 1)) * 100;
                                                    const y = 85 - (d.energyValue / 5) * 70;
                                                    return (
                                                        <circle
                                                            key={i}
                                                            cx={x}
                                                            cy={y}
                                                            r="1.5"
                                                            fill="#3b82f6"
                                                            stroke="white"
                                                            strokeWidth="1"
                                                            vectorEffect="non-scaling-stroke"
                                                        />
                                                    );
                                                })}
                                            </svg>
                                        </Box>
                                    </HStack>
                                    
                                    {/* Day labels */}
                                    <HStack gap={0} justify="space-between" w="full" mt={1}>
                                        {chartData.map((d, i) => (
                                            <Text key={i} fontSize="xs" color="gray.600" fontWeight="500" flex={1} textAlign="center">
                                                {d.dayLabel}
                                            </Text>
                                        ))}
                                    </HStack>
                                </Box>
                            </Box>

                            {/* Workload Status (7 Days) */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack gap={2} mb={4}>
                                    <Box w="16px" h="16px" borderRadius="sm" bg="teal.500" display="flex" alignItems="center" justifyContent="center">
                                        <Check size={12} color="white" />
                                    </Box>
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Workload Status (7 Days)</Text>
                                </HStack>
                                
                                <Box position="relative" h="120px" w="full">
                                    {/* Chart area with y-axis labels */}
                                    <HStack gap={2} h="90px" align="stretch">
                                        {/* Y-axis labels */}
                                        <VStack justify="space-between" h="full" py={1}>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Good</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Fair</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Poor</Text>
                                        </VStack>
                                        
                                        {/* Bar Chart */}
                                        <Box flex={1} h="full" position="relative">
                                            <HStack gap={0} justify="space-between" h="full" align="end" position="relative">
                                                {/* Grid lines */}
                                                <Box position="absolute" top={0} left={0} right={0} bottom={0} pointerEvents="none">
                                                    <Box position="absolute" top="10%" left={0} right={0} h="1px" bg="gray.200" />
                                                    <Box position="absolute" top="40%" left={0} right={0} h="1px" bg="gray.200" />
                                                    <Box position="absolute" top="70%" left={0} right={0} h="1px" bg="gray.200" />
                                                    <Box position="absolute" bottom="5%" left={0} right={0} h="1px" bg="gray.300" />
                                                </Box>
                                                
                                                {chartData.map((d, i) => {
                                                    const height = d.isManageable ? '70%' : '30%';
                                                    const color = d.isManageable ? 'teal.500' : 'red.500';
                                                    
                                                    return (
                                                        <Box key={i} flex={1} h="full" display="flex" alignItems="end" justifyContent="center" pb="5%">
                                                            <Box
                                                                w="60%"
                                                                h={height}
                                                                bg={color}
                                                                borderRadius="sm"
                                                                transition="all 0.3s ease"
                                                            />
                                                        </Box>
                                                    );
                                                })}
                                            </HStack>
                                        </Box>
                                    </HStack>
                                    
                                    {/* Day labels */}
                                    <HStack gap={0} justify="space-between" w="full" mt={1}>
                                        {chartData.map((d, i) => (
                                            <Text key={i} fontSize="xs" color="gray.600" fontWeight="500" flex={1} textAlign="center">
                                                {d.dayLabel}
                                            </Text>
                                        ))}
                                    </HStack>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Today's Status Row */}
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            {/* Energy Levels (Today) */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack gap={2} mb={4}>
                                    <TrendingUp size={16} color="#6b7280" />
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Energy Levels (Today)</Text>
                                </HStack>
                                
                                <VStack gap={3} align="stretch">
                                    {/* High Energy */}
                                    <Box>
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Box w="8px" h="8px" borderRadius="full" bg="green.500" />
                                                <Text fontSize="sm" color="gray.700">High Energy</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                                                {aggregatedData.energyDistribution.high}
                                            </Text>
                                        </HStack>
                                        <Box w="full" h="6px" bg="gray.200" borderRadius="full">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? (aggregatedData.energyDistribution.high / aggregatedData.respondedToday) * 100 : 0}%`}
                                                h="full"
                                                bg="green.500"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Medium Energy */}
                                    <Box>
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
                                                <Text fontSize="sm" color="gray.700">Medium Energy</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                                                {aggregatedData.energyDistribution.medium}
                                            </Text>
                                        </HStack>
                                        <Box w="full" h="6px" bg="gray.200" borderRadius="full">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? (aggregatedData.energyDistribution.medium / aggregatedData.respondedToday) * 100 : 0}%`}
                                                h="full"
                                                bg="orange.400"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Low Energy */}
                                    <Box>
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Box w="8px" h="8px" borderRadius="full" bg="red.500" />
                                                <Text fontSize="sm" color="gray.700">Low Energy</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                                                {aggregatedData.energyDistribution.low}
                                            </Text>
                                        </HStack>
                                        <Box w="full" h="6px" bg="gray.200" borderRadius="full">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? (aggregatedData.energyDistribution.low / aggregatedData.respondedToday) * 100 : 0}%`}
                                                h="full"
                                                bg="red.500"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Box>
                                </VStack>
                            </Box>

                            {/* Workload Status (Today) */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200">
                                <HStack gap={2} mb={4}>
                                    <Box w="16px" h="16px" borderRadius="sm" bg="teal.500" display="flex" alignItems="center" justifyContent="center">
                                        <Check size={12} color="white" />
                                    </Box>
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Workload Status (Today)</Text>
                                </HStack>
                                
                                <VStack gap={4} align="stretch">
                                    {/* Manageable */}
                                    <Box>
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Box w="8px" h="8px" borderRadius="full" bg="teal.500" />
                                                <Text fontSize="sm" color="gray.700">Manageable</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                                                {aggregatedData.workloadDistribution.manageable}
                                            </Text>
                                        </HStack>
                                        <Box w="full" h="6px" bg="gray.200" borderRadius="full">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? (aggregatedData.workloadDistribution.manageable / aggregatedData.respondedToday) * 100 : 0}%`}
                                                h="full"
                                                bg="teal.500"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Overwhelming */}
                                    <Box>
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={2}>
                                                <Box w="8px" h="8px" borderRadius="full" bg="red.500" />
                                                <Text fontSize="sm" color="gray.700">Overwhelming</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                                                {aggregatedData.workloadDistribution.overwhelming}
                                            </Text>
                                        </HStack>
                                        <Box w="full" h="6px" bg="gray.200" borderRadius="full">
                                            <Box
                                                w={`${aggregatedData.respondedToday > 0 ? (aggregatedData.workloadDistribution.overwhelming / aggregatedData.respondedToday) * 100 : 0}%`}
                                                h="full"
                                                bg="red.500"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Box>
                                </VStack>
                            </Box>
                        </Grid>

                        {/* Employees Requiring Attention */}
                        {aggregatedData.atRiskEmployees.length > 0 && (
                            <Box>
                                <HStack gap={2} mb={3}>
                                    <AlertTriangle size={16} color="#ef4444" />
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Employees Requiring Attention</Text>
                                </HStack>
                                
                                <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                                    {aggregatedData.atRiskEmployees.map((emp, index) => (
                                        <Box
                                            key={index}
                                            bg="white"
                                            borderRadius="lg"
                                            p={4}
                                            border="1px solid"
                                            borderColor="gray.200"
                                        >
                                            <Text fontSize="sm" fontWeight="600" color="gray.900" mb={1}>
                                                {emp.name}
                                            </Text>
                                            <Text fontSize="xs" color="gray.600" mb={2}>
                                                {emp.reason} for {emp.daysAffected} days
                                            </Text>
                                            <Text fontSize="xs" color="blue.600" fontWeight="500">
                                                Recommend: {emp.reason === 'Low energy' ? 'recovery' : 'assist with workload'}
                                            </Text>
                                        </Box>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </VStack>
                )}
            </Box>
        </Box>
    );
};
