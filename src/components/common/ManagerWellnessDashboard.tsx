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
import { X, TrendingUp, Users, AlertTriangle, CheckCircle, ExternalLink, Check, MessageCircle, LayoutDashboard } from 'lucide-react';

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
    standalone?: boolean;
}

export const ManagerWellnessDashboard: React.FC<ManagerWellnessDashboardProps> = ({ isOpen, onClose, standalone = false }) => {
    const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
    const [last7DaysData, setLast7DaysData] = useState<EmployeeCheckIn[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);

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
            
            // Always include the mock team so the dashboard shows a realistic team view.
            // Real user check-ins (if any) are merged on top, replacing the matching mock employee id.
            const mockTeam = generateMockTeamData();
            const realIds = new Set(actualData.map(d => d.employeeId));
            const mergedData: EmployeeCheckIn[] = [
                ...actualData,
                ...mockTeam.filter(d => !realIds.has(d.employeeId)),
            ];

            const aggregated = calculateAggregatedData(mergedData);
            setAggregatedData(aggregated);
            setLast7DaysData(mergedData);
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
        // Deterministic patterns so the dashboard always reflects realistic at-risk employees.
        // Pattern is per day index 0..6 (0 = today, 6 = 6 days ago).
        const employees: Array<{
            id: string;
            name: string;
            energyPattern: ('high' | 'medium' | 'low')[];
            workloadPattern: ('yes' | 'no')[];
        }> = [
            // At-risk: 4 low-energy days
            { id: '1', name: 'John Smith', energyPattern: ['low', 'low', 'medium', 'low', 'low', 'medium', 'high'], workloadPattern: ['no', 'yes', 'yes', 'no', 'yes', 'yes', 'yes'] },
            // At-risk: 4 overwhelmed days
            { id: '2', name: 'Alice Brown', energyPattern: ['medium', 'high', 'medium', 'medium', 'high', 'high', 'medium'], workloadPattern: ['no', 'no', 'yes', 'no', 'no', 'yes', 'yes'] },
            // At-risk: 3 low-energy days
            { id: '3', name: 'Rahul Verma', energyPattern: ['low', 'medium', 'low', 'low', 'medium', 'high', 'medium'], workloadPattern: ['yes', 'no', 'yes', 'yes', 'no', 'yes', 'yes'] },
            // At-risk: 3 overwhelmed days
            { id: '4', name: 'David Park', energyPattern: ['medium', 'medium', 'high', 'medium', 'medium', 'high', 'high'], workloadPattern: ['no', 'no', 'yes', 'no', 'yes', 'yes', 'yes'] },
            // Healthy
            { id: '5', name: 'Sara Lee', energyPattern: ['high', 'high', 'medium', 'high', 'high', 'medium', 'high'], workloadPattern: ['yes', 'yes', 'yes', 'yes', 'no', 'yes', 'yes'] },
            { id: '6', name: 'Meera Iyer', energyPattern: ['medium', 'high', 'high', 'medium', 'high', 'high', 'medium'], workloadPattern: ['yes', 'yes', 'no', 'yes', 'yes', 'yes', 'yes'] },
            { id: '7', name: 'Tom Brown', energyPattern: ['high', 'medium', 'high', 'high', 'medium', 'high', 'medium'], workloadPattern: ['yes', 'yes', 'yes', 'yes', 'yes', 'no', 'yes'] },
            { id: '8', name: 'Emily Davis', energyPattern: ['medium', 'high', 'medium', 'high', 'high', 'medium', 'high'], workloadPattern: ['yes', 'no', 'yes', 'yes', 'yes', 'yes', 'no'] },
        ];

        const data: EmployeeCheckIn[] = [];
        const today = new Date();

        employees.forEach(emp => {
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);

                data.push({
                    employeeId: emp.id,
                    employeeName: emp.name,
                    date: date.toISOString().split('T')[0],
                    energy: emp.energyPattern[i],
                    workload: emp.workloadPattern[i],
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
            position={standalone ? "relative" : "fixed"}
            top={standalone ? 0 : 0}
            left={standalone ? 0 : 0}
            right={standalone ? 0 : 0}
            bottom={standalone ? 0 : 0}
            bg={standalone ? "white" : "rgba(0, 0, 0, 0.4)"}
            backdropFilter={standalone ? "none" : "blur(4px)"}
            zIndex={standalone ? 1 : 9999}
            display="flex"
            alignItems={standalone ? "flex-start" : "center"}
            justifyContent="center"
            onClick={(e) => {
                if (!standalone && e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <Box
                bg={standalone ? "white" : "white"}
                borderRadius={standalone ? "none" : "xl"}
                shadow={standalone ? "none" : "xl"}
                maxW={standalone ? "100%" : "1000px"}
                w={standalone ? "100%" : "95%"}
                h={standalone ? "100vh" : "auto"}
                maxH={standalone ? "100vh" : "90vh"}
                p={standalone && showChat ? 0 : standalone ? 4 : 6}
                position="relative"
                overflow="hidden"
                display={showChat ? "flex" : "block"}
                flexDirection={showChat ? "column" : undefined}
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
                        onClick={() => setShowChat(!showChat)}
                        w="40px"
                        h="40px"
                        borderRadius="full"
                        bg={showChat ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" : "linear-gradient(135deg, #c4b5fd 0%, #a855f7 100%)"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow={showChat ? "0 4px 12px rgba(20, 184, 166, 0.35)" : "0 4px 12px rgba(168, 85, 247, 0.3)"}
                        _hover={{ transform: "translateY(-2px)", boxShadow: showChat ? "0 6px 16px rgba(20, 184, 166, 0.5)" : "0 6px 16px rgba(168, 85, 247, 0.45)" }}
                        transition="all 0.2s"
                        title={showChat ? "Back to Wellness Dashboard" : "Open AI Chat Assistant"}
                    >
                        {showChat ? <LayoutDashboard size={20} color="white" /> : <MessageCircle size={20} color="white" />}
                    </Box>
                    
                    <Box
                        cursor="pointer"
                        onClick={() => {
                            const baseUrl = window.location.origin;
                            window.open(baseUrl + '/', '_blank');
                        }}
                        w="40px"
                        h="40px"
                        borderRadius="full"
                        bg="linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 4px 12px rgba(37, 99, 235, 0.3)"
                        _hover={{ transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(37, 99, 235, 0.45)" }}
                        transition="all 0.2s"
                        title="Open Full Application"
                    >
                        <ExternalLink size={20} color="white" />
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
                {!showChat && (
                    <VStack gap={0} mb={5} align="start">
                        <Heading size="lg" color="gray.800" fontWeight="600">
                            Team Wellness Dashboard
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                            Real-time insights into your team's wellbeing
                        </Text>
                    </VStack>
                )}

                {/* Chat Interface */}
                {showChat && (
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} overflow="hidden" m={0} p={0} zIndex={5}>
                        <iframe
                            src="/chat?embed=true"
                            width="100%"
                            height="100%"
                            style={{ 
                                border: 'none',
                                display: 'block',
                                margin: 0,
                                padding: 0,
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            }}
                            title="AI Chat"
                        />
                    </Box>
                )}

                {/* Loading State */}
                {!showChat && (isLoading || !aggregatedData) && (
                    <Box textAlign="center" py={20}>
                        <Spinner size="xl" color="blue.500" />
                        <Text mt={4} color="gray.600">Loading team wellness data...</Text>
                    </Box>
                )}

                {/* Content */}
                {!showChat && !isLoading && aggregatedData && (
                    <VStack gap={4} align="stretch" h="calc(100vh - 120px)">
                        {/* Top Metrics */}
                        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            {/* Total Team */}
                            <Box bg="white" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200" boxShadow="0 4px 12px rgba(59, 130, 246, 0.08), 0 2px 4px rgba(0,0,0,0.04)" transition="all 0.2s" _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(59, 130, 246, 0.12), 0 3px 6px rgba(0,0,0,0.06)" }}>
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
                            <Box bg="white" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200" boxShadow="0 4px 12px rgba(16, 185, 129, 0.10), 0 2px 4px rgba(0,0,0,0.04)" transition="all 0.2s" _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15), 0 3px 6px rgba(0,0,0,0.06)" }}>
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
                            <Box bg="white" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200" boxShadow="0 4px 12px rgba(239, 68, 68, 0.10), 0 2px 4px rgba(0,0,0,0.04)" transition="all 0.2s" _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(239, 68, 68, 0.15), 0 3px 6px rgba(0,0,0,0.06)" }}>
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

                        {/* Today's Status Row - Employees on left, Projects at Risk on right */}
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} flex="1" minH={0}>
                            {/* Employees Requiring Attention - LEFT */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200" display="flex" flexDirection="column" minH={0} overflow="hidden">
                                <HStack gap={2} mb={3} flexShrink={0}>
                                    <AlertTriangle size={16} color="#ef4444" />
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Employees Requiring Attention</Text>
                                </HStack>
                                {aggregatedData.atRiskEmployees.length > 0 ? (
                                    <Box
                                        flex="1"
                                        overflowY="auto"
                                        css={{
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                            '&::-webkit-scrollbar': {
                                                display: 'none',
                                                width: 0,
                                                height: 0,
                                            },
                                        }}
                                    >
                                        <Grid
                                            templateColumns="repeat(2, 1fr)"
                                            gap={3}
                                            h="100%"
                                            style={{ gridAutoRows: 'calc((100% - 0.75rem) / 2)' }}
                                        >
                                            {aggregatedData.atRiskEmployees.map((emp, index) => {
                                                const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];
                                                const avatarColor = colors[emp.name.charCodeAt(0) % colors.length];
                                                const photoUrl = `https://i.pravatar.cc/120?u=${encodeURIComponent(emp.id)}`;
                                                return (
                                                    <Box
                                                        key={index}
                                                        bg="white"
                                                        borderRadius="lg"
                                                        p={3}
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                                                        transition="all 0.2s"
                                                        display="flex"
                                                        flexDirection="column"
                                                        justifyContent="center"
                                                        _hover={{ borderColor: "blue.300", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                                                    >
                                                        <VStack gap={2} align="center" textAlign="center">
                                                            <Box
                                                                w="56px"
                                                                h="56px"
                                                                borderRadius="full"
                                                                overflow="hidden"
                                                                flexShrink={0}
                                                                bg={avatarColor}
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                position="relative"
                                                                border="2px solid"
                                                                borderColor="white"
                                                                boxShadow="0 2px 6px rgba(0,0,0,0.1)"
                                                            >
                                                                <Text fontSize="md" fontWeight="700" color="white" position="absolute">
                                                                    {initials}
                                                                </Text>
                                                                <img
                                                                    src={photoUrl}
                                                                    alt={emp.name}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        position: 'relative',
                                                                        zIndex: 1,
                                                                    }}
                                                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                                                />
                                                            </Box>
                                                            <Box w="full" minW={0}>
                                                                <Text fontSize="sm" fontWeight="600" color="gray.900" lineClamp={1}>
                                                                    {emp.name}
                                                                </Text>
                                                                <Text fontSize="xs" color="gray.600" lineClamp={1}>
                                                                    {emp.reason} · {emp.daysAffected}d
                                                                </Text>
                                                                <Text fontSize="xs" color="blue.600" fontWeight="500" lineClamp={1}>
                                                                    {emp.reason === 'Low energy' ? 'Recommend recovery' : 'Assist workload'}
                                                                </Text>
                                                            </Box>
                                                        </VStack>
                                                    </Box>
                                                );
                                            })}
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Text fontSize="sm" color="gray.500">No employees requiring attention right now.</Text>
                                )}
                            </Box>

                            {/* Right column: Projects at Risk */}
                            <Box bg="gray.50" borderRadius="lg" p={4} border="1px solid" borderColor="gray.200" display="flex" flexDirection="column" minH={0} overflow="hidden">
                                <HStack gap={2} mb={3} flexShrink={0}>
                                    <AlertTriangle size={16} color="#ef4444" />
                                    <Text fontSize="sm" color="gray.700" fontWeight="600">Projects at Risk</Text>
                                </HStack>
                                {(() => {
                                    const projectsAtRisk = [
                                        { project: 'Atlas CRM Migration', client: 'Globex Corp', risk: 'High', associate: 'John Smith', role: 'Tech Lead', note: 'Tech Lead at high attrition risk; KT pending.' },
                                        { project: 'Phoenix Data Platform', client: 'Initech', risk: 'High', associate: 'Alice Brown', role: 'Senior Data Engineer', note: 'Comp review pending; on-call rotation needs adjustment.' },
                                        { project: 'Nimbus Cloud Re-platform', client: 'Cyberdyne Systems', risk: 'High', associate: 'David Park', role: 'Cloud Architect', note: 'Overloaded across parallel projects.' },
                                        { project: 'Helix Mobile App', client: 'Stark Industries', risk: 'Medium', associate: 'Rahul Verma', role: 'Mobile Engineer', note: 'Growth path unclear; engagement dropping.' },
                                        { project: 'Orion Analytics Suite', client: 'Wayne Enterprises', risk: 'Medium', associate: 'Sara Lee', role: 'BI Analyst', note: 'Single-point-of-failure; cross-train backup.' },
                                        { project: 'Vega Reporting Refresh', client: 'Umbrella Group', risk: 'Low', associate: 'Meera Iyer', role: 'Frontend Engineer', note: 'Stable; involve in design system to retain.' },
                                    ];
                                    return (
                                        <Box flex="1" overflowY="auto" css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                                            <VStack gap={2} align="stretch">
                                                {projectsAtRisk.map((p, idx) => {
                                                    const riskMap: Record<string, { bg: string; color: string; border: string }> = {
                                                        High: { bg: 'red.50', color: 'red.700', border: 'red.200' },
                                                        Medium: { bg: 'orange.50', color: 'orange.700', border: 'orange.200' },
                                                        Low: { bg: 'yellow.50', color: 'yellow.700', border: 'yellow.200' },
                                                    };
                                                    const c = riskMap[p.risk];
                                                    return (
                                                        <Box
                                                            key={idx}
                                                            bg="white"
                                                            borderRadius="lg"
                                                            p={3}
                                                            border="1px solid"
                                                            borderColor="gray.200"
                                                            boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                                                            transition="all 0.2s"
                                                            _hover={{ borderColor: 'blue.300', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                                        >
                                                            <HStack justify="space-between" align="start" mb={1.5} gap={2}>
                                                                <Box flex="1" minW={0}>
                                                                    <Text fontSize="sm" fontWeight="600" color="gray.900" lineClamp={1}>{p.project}</Text>
                                                                    <Text fontSize="xs" color="gray.500" lineClamp={1}>{p.client}</Text>
                                                                </Box>
                                                                <Box px={2} py={0.5} borderRadius="md" bg={c.bg} border="1px solid" borderColor={c.border} flexShrink={0}>
                                                                    <Text fontSize="2xs" fontWeight="700" color={c.color} textTransform="uppercase">{p.risk}</Text>
                                                                </Box>
                                                            </HStack>
                                                            <HStack gap={2} align="center" mb={1}>
                                                                <Box w="6px" h="6px" borderRadius="full" bg="red.400" />
                                                                <Text fontSize="xs" color="gray.700" fontWeight="500">{p.associate}</Text>
                                                                <Text fontSize="xs" color="gray.400">·</Text>
                                                                <Text fontSize="xs" color="gray.500">{p.role}</Text>
                                                            </HStack>
                                                            <Text fontSize="xs" color="gray.600" lineClamp={2}>{p.note}</Text>
                                                        </Box>
                                                    );
                                                })}
                                            </VStack>
                                        </Box>
                                    );
                                })()}
                            </Box>
                        </Grid>
                    </VStack>
                )}
            </Box>
        </Box>
    );
};
