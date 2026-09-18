'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Grid,
    Spinner
} from '@chakra-ui/react';
import { X, Users, AlertTriangle, CheckCircle, MessageCircle, LayoutDashboard } from 'lucide-react';

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

const theme = {
    surface: '#FFFFFF',
    page: '#FAFBFD',
    primary: '#1D7FE3',
    primarySoft: '#E7F0FC',
    primaryText: '#0B0C1C',
    secondaryText: '#3D4B68',
    mutedText: '#71809B',
    border: '#E6EAF0',
    lightBorder: '#EEF1F5',
    success: '#39BA85',
    danger: '#E2493A',
    warning: '#FDB83F',
};

const cardBorder = '1px solid #E6EAF0';

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
            bg={standalone ? theme.page : "rgba(15, 27, 46, 0.58)"}
            backdropFilter={standalone ? "none" : "blur(8px)"}
            zIndex={standalone ? 1 : 9999}
            display="flex"
            alignItems={standalone ? "flex-start" : "center"}
            justifyContent="center"
            p={standalone ? 0 : { base: "12px", md: "24px" }}
            onClick={(e) => {
                if (!standalone && e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <Box
                bg={theme.surface}
                borderRadius={standalone ? "none" : { base: "18px", md: "20px" }}
                border={standalone ? "0" : cardBorder}
                boxShadow={standalone ? "none" : "0 24px 70px rgba(11, 12, 28, 0.14)"}
                maxW={standalone ? "100%" : "1180px"}
                w={standalone ? "100%" : "100%"}
                h={showChat ? "100vh" : standalone ? "100vh" : "auto"}
                maxH={showChat ? "100vh" : standalone ? "100vh" : "calc(100vh - 48px)"}
                p={showChat ? 0 : { base: "18px", md: "22px", xl: "26px" }}
                position="relative"
                overflow="hidden"
                display={showChat ? "flex" : "block"}
                flexDirection={showChat ? "column" : undefined}
            >
                {/* Header */}
                {!showChat && (
                    <HStack justify="space-between" align="start" gap={4} mb={{ base: "18px", md: "22px" }}>
                        <HStack gap={3} minW={0} align="start">
                            <Box
                                w={{ base: "42px", md: "48px" }}
                                h={{ base: "42px", md: "48px" }}
                                borderRadius="14px"
                                bg={theme.primarySoft}
                                color={theme.primary}
                                border={cardBorder}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <MessageCircle size={22} />
                            </Box>
                            <Box minW={0}>
                                <Heading fontSize={{ base: "20px", md: "24px" }} lineHeight="1.15" color={theme.primaryText} fontWeight="800" letterSpacing="0">
                                    Team Wellness Dashboard
                                </Heading>
                                <Text color={theme.mutedText} fontSize={{ base: "13px", md: "14px" }} fontWeight="600" mt="4px">
                                    Real-time insights into your team's wellbeing
                                </Text>
                            </Box>
                        </HStack>

                        <HStack gap={2} flexShrink={0}>
                            <Box
                                as="button"
                                cursor="pointer"
                                onClick={() => setShowChat(!showChat)}
                                w="40px"
                                h="40px"
                                borderRadius="10px"
                                bg={showChat ? theme.primarySoft : theme.primary}
                                color={showChat ? theme.primary : theme.surface}
                                border={cardBorder}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                boxShadow={showChat ? "none" : "0 12px 24px rgba(29,127,227,0.18)"}
                                _hover={{ bg: showChat ? "#D9E9FB" : "#176FC7" }}
                                transition="all 0.2s"
                                title={showChat ? "Back to Wellness Dashboard" : "Open AI Chat Assistant"}
                            >
                                {showChat ? <LayoutDashboard size={19} /> : <MessageCircle size={19} />}
                            </Box>
                            <Box
                                as="button"
                                cursor="pointer"
                                onClick={onClose}
                                w="40px"
                                h="40px"
                                borderRadius="10px"
                                color={theme.secondaryText}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ bg: "#F3F7FD", color: theme.primary }}
                                transition="all 0.2s"
                                title="Close Dashboard"
                            >
                                <X size={21} />
                            </Box>
                        </HStack>
                    </HStack>
                )}

                {/* Chat Interface */}
                {showChat && (
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} overflow="hidden" m={0} p={0} zIndex={5}>
                        <HStack position="absolute" top="14px" right="14px" zIndex={6} gap={2}>
                            <Box
                                as="button"
                                onClick={() => setShowChat(false)}
                                w="40px"
                                h="40px"
                                borderRadius="10px"
                                bg={theme.surface}
                                color={theme.primary}
                                border={cardBorder}
                                boxShadow="0 12px 28px rgba(11,12,28,0.10)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ bg: theme.primarySoft }}
                                title="Back to wellness dashboard"
                            >
                                <LayoutDashboard size={19} />
                            </Box>
                            <Box
                                as="button"
                                onClick={onClose}
                                w="40px"
                                h="40px"
                                borderRadius="10px"
                                bg={theme.surface}
                                color={theme.secondaryText}
                                border={cardBorder}
                                boxShadow="0 12px 28px rgba(11,12,28,0.10)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ bg: "#F3F7FD", color: theme.primary }}
                                title="Close Dashboard"
                            >
                                <X size={20} />
                            </Box>
                        </HStack>
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
                    <VStack gap={{ base: 3, md: 4 }} align="stretch" maxH={standalone ? "calc(100vh - 118px)" : "calc(100vh - 158px)"} overflow="hidden">
                        {/* Top Metrics */}
                        <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }} flexShrink={0}>
                            {/* Total Team */}
                            <Box bg={theme.surface} borderRadius="12px" p={{ base: 4, md: 5 }} border={cardBorder} boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)">
                                <HStack justify="space-between" mb={3}>
                                    <Text fontSize="13px" color={theme.secondaryText} fontWeight="800">Total Team</Text>
                                    <Box w="34px" h="34px" borderRadius="10px" bg={theme.primarySoft} color={theme.primary} display="flex" alignItems="center" justifyContent="center">
                                        <Users size={18} />
                                    </Box>
                                </HStack>
                                <Text fontSize={{ base: "28px", md: "34px" }} lineHeight="1" fontWeight="800" color={theme.primaryText} mb={2}>
                                    {aggregatedData.totalEmployees}
                                </Text>
                                <Text fontSize="12px" color={theme.mutedText} fontWeight="700">employees</Text>
                            </Box>

                            {/* Response */}
                            <Box bg={theme.surface} borderRadius="12px" p={{ base: 4, md: 5 }} border={cardBorder} boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)">
                                <HStack justify="space-between" mb={3}>
                                    <Text fontSize="13px" color={theme.secondaryText} fontWeight="800">Response</Text>
                                    <Box w="34px" h="34px" borderRadius="10px" bg="#E8F8F0" color={theme.success} display="flex" alignItems="center" justifyContent="center">
                                        <CheckCircle size={18} />
                                    </Box>
                                </HStack>
                                <Text fontSize={{ base: "28px", md: "34px" }} lineHeight="1" fontWeight="800" color={theme.primaryText} mb={2}>
                                    {responseRate}%
                                </Text>
                                <Text fontSize="12px" color={theme.mutedText} fontWeight="700">
                                    {aggregatedData.respondedToday} of {aggregatedData.totalEmployees} responded
                                </Text>
                            </Box>

                            {/* At Risk */}
                            <Box bg={theme.surface} borderRadius="12px" p={{ base: 4, md: 5 }} border={cardBorder} boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)">
                                <HStack justify="space-between" mb={3}>
                                    <Text fontSize="13px" color={theme.secondaryText} fontWeight="800">At Risk</Text>
                                    <Box w="34px" h="34px" borderRadius="10px" bg="#FDEDEA" color={theme.danger} display="flex" alignItems="center" justifyContent="center">
                                        <AlertTriangle size={18} />
                                    </Box>
                                </HStack>
                                <Text fontSize={{ base: "28px", md: "34px" }} lineHeight="1" fontWeight="800" color={theme.primaryText} mb={2}>
                                    {aggregatedData.atRiskEmployees.length}
                                </Text>
                                <Text fontSize="12px" color={theme.mutedText} fontWeight="700">need attention</Text>
                            </Box>
                        </Grid>

                        {/* Today's Status Row - Employees on left, Projects at Risk on right */}
                        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 3, md: 4 }} flex="1" minH={0} overflow={{ base: "auto", lg: "hidden" }} css={{ '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { background: '#D8DEE9', borderRadius: '999px' } }}>
                            {/* Employees Requiring Attention - LEFT */}
                            <Box bg={theme.surface} borderRadius="12px" p={{ base: 4, md: 5 }} border={cardBorder} boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)" display="flex" flexDirection="column" minH={{ base: "360px", lg: 0 }} overflow="hidden">
                                <HStack gap={3} mb={4} flexShrink={0}>
                                    <Box w="32px" h="32px" borderRadius="10px" bg="#FDEDEA" color={theme.danger} display="flex" alignItems="center" justifyContent="center">
                                        <AlertTriangle size={16} />
                                    </Box>
                                    <Text fontSize="15px" color={theme.primaryText} fontWeight="800">Employees Requiring Attention</Text>
                                </HStack>
                                {aggregatedData.atRiskEmployees.length > 0 ? (
                                    <Box
                                        flex="1"
                                        overflowY="auto"
                                        css={{
                                            '&::-webkit-scrollbar': { width: '6px' },
                                            '&::-webkit-scrollbar-thumb': { background: '#D8DEE9', borderRadius: '999px' },
                                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                                        }}
                                    >
                                        <Grid
                                            templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}
                                            gap="12px"
                                            pr="2px"
                                        >
                                            {aggregatedData.atRiskEmployees.map((emp, index) => {
                                                const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];
                                                const avatarColor = colors[emp.name.charCodeAt(0) % colors.length];
                                                const photoUrl = `https://i.pravatar.cc/120?u=${encodeURIComponent(emp.id)}`;
                                                return (
                                                    <Box
                                                        key={index}
                                                        bg="#FAFBFD"
                                                        borderRadius="10px"
                                                        p="14px"
                                                        border={cardBorder}
                                                        transition="all 0.2s"
                                                        display="flex"
                                                        flexDirection="column"
                                                        justifyContent="center"
                                                        minH="148px"
                                                        _hover={{ borderColor: "#CFE0F7", boxShadow: "0 10px 24px rgba(29,127,227,0.08)" }}
                                                    >
                                                        <VStack gap={2.5} align="center" textAlign="center">
                                                            <Box
                                                                w="50px"
                                                                h="50px"
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
                                                                boxShadow="0 8px 18px rgba(11,12,28,0.12)"
                                                            >
                                                                <Text fontSize="14px" fontWeight="800" color="white" position="absolute">
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
                                                                <Text fontSize="13px" fontWeight="800" color={theme.primaryText} lineClamp={1}>
                                                                    {emp.name}
                                                                </Text>
                                                                <Text fontSize="12px" color={theme.secondaryText} fontWeight="600" lineClamp={1}>
                                                                    {emp.reason} · {emp.daysAffected}d
                                                                </Text>
                                                                <Text fontSize="12px" color={theme.primary} fontWeight="800" lineClamp={1}>
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
                            <Box bg={theme.surface} borderRadius="12px" p={{ base: 4, md: 5 }} border={cardBorder} boxShadow="0 10px 30px rgba(11, 12, 28, 0.035)" display="flex" flexDirection="column" minH={{ base: "360px", lg: 0 }} overflow="hidden">
                                <HStack gap={3} mb={4} flexShrink={0}>
                                    <Box w="32px" h="32px" borderRadius="10px" bg="#FDEDEA" color={theme.danger} display="flex" alignItems="center" justifyContent="center">
                                        <AlertTriangle size={16} />
                                    </Box>
                                    <Text fontSize="15px" color={theme.primaryText} fontWeight="800">Projects at Risk</Text>
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
                                        <Box flex="1" overflowY="auto" pr="2px" css={{ '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { background: '#D8DEE9', borderRadius: '999px' }, '&::-webkit-scrollbar-track': { background: 'transparent' } }}>
                                            <VStack gap="12px" align="stretch">
                                                {projectsAtRisk.map((p, idx) => {
                                                    const riskMap: Record<string, { bg: string; color: string; border: string; dot: string }> = {
                                                        High: { bg: '#FDEDEA', color: '#B42318', border: '#F7C9C3', dot: theme.danger },
                                                        Medium: { bg: '#FFF3DE', color: '#9A4B0B', border: '#FFD7A8', dot: theme.warning },
                                                        Low: { bg: '#E8F8F0', color: '#247A5B', border: '#BFEBD7', dot: theme.success },
                                                    };
                                                    const c = riskMap[p.risk];
                                                    return (
                                                        <Box
                                                            key={idx}
                                                            bg="#FAFBFD"
                                                            borderRadius="10px"
                                                            p="14px"
                                                            border={cardBorder}
                                                            transition="all 0.2s"
                                                            _hover={{ borderColor: '#CFE0F7', boxShadow: '0 10px 24px rgba(29,127,227,0.08)' }}
                                                        >
                                                            <HStack justify="space-between" align="start" mb="8px" gap={3}>
                                                                <Box flex="1" minW={0}>
                                                                    <Text fontSize="14px" fontWeight="800" color={theme.primaryText} lineClamp={1}>{p.project}</Text>
                                                                    <Text fontSize="12px" color={theme.mutedText} fontWeight="700" lineClamp={1}>{p.client}</Text>
                                                                </Box>
                                                                <Box px="10px" py="4px" borderRadius="8px" bg={c.bg} border="1px solid" borderColor={c.border} flexShrink={0}>
                                                                    <Text fontSize="10px" fontWeight="800" color={c.color} textTransform="uppercase">{p.risk}</Text>
                                                                </Box>
                                                            </HStack>
                                                            <HStack gap={2} align="center" mb="6px" flexWrap="wrap">
                                                                <Box w="6px" h="6px" borderRadius="full" bg={c.dot} />
                                                                <Text fontSize="12px" color={theme.secondaryText} fontWeight="800">{p.associate}</Text>
                                                                <Text fontSize="12px" color={theme.mutedText}>·</Text>
                                                                <Text fontSize="12px" color={theme.mutedText} fontWeight="700">{p.role}</Text>
                                                            </HStack>
                                                            <Text fontSize="12px" color={theme.secondaryText} fontWeight="600" lineClamp={2}>{p.note}</Text>
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
