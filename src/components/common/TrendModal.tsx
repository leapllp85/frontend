'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Button } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Minus, X, Battery, Briefcase } from 'lucide-react';

interface TrendData {
    date: string;
    energy: string;
    workload: string;
}

interface TrendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TrendModal: React.FC<TrendModalProps> = ({ isOpen, onClose }) => {
    console.log('📊 TrendModal render - isOpen:', isOpen);
    
    if (!isOpen) return null;

    // Get historical data
    const historyStr = localStorage.getItem('checkInHistory');
    const history: TrendData[] = historyStr ? JSON.parse(historyStr) : [];
    const last7Days = history.slice(-7);
    
    console.log('📊 TrendModal showing with', last7Days.length, 'days of data');

    // Calculate trends
    const calculateEnergyTrend = (data: TrendData[]) => {
        const values = data.map(d => d.energy === 'high' ? 3 : d.energy === 'medium' ? 2 : 1);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        
        if (avg >= 2.5) return { status: 'Improving', emoji: '📈', color: '#10b981', icon: TrendingUp };
        if (avg >= 1.8) return { status: 'Stable', emoji: '➡️', color: '#f59e0b', icon: Minus };
        return { status: 'Declining', emoji: '📉', color: '#ef4444', icon: TrendingDown };
    };

    const calculateWorkloadTrend = (data: TrendData[]) => {
        const yesCount = data.filter(d => d.workload === 'yes').length;
        const percentage = (yesCount / data.length) * 100;
        
        if (percentage >= 70) return { status: 'Manageable', emoji: '✅', color: '#10b981', icon: TrendingUp };
        if (percentage >= 40) return { status: 'Moderate', emoji: '⚠️', color: '#f59e0b', icon: Minus };
        return { status: 'Overwhelming', emoji: '🔴', color: '#ef4444', icon: TrendingDown };
    };

    const energyTrend = last7Days.length > 0 ? calculateEnergyTrend(last7Days) : null;
    const workloadTrend = last7Days.length > 0 ? calculateWorkloadTrend(last7Days) : null;

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get energy color
    const getEnergyColor = (energy: string) => {
        if (energy === 'high') return '#10b981';
        if (energy === 'medium') return '#f59e0b';
        return '#ef4444';
    };

    // Get workload color
    const getWorkloadColor = (workload: string) => {
        return workload === 'yes' ? '#10b981' : '#ef4444';
    };

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            backdropFilter="blur(8px)"
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
                borderRadius="2xl"
                shadow="2xl"
                maxW="1200px"
                w="98%"
                maxH="95vh"
                p={6}
                position="relative"
                m={2}
            >
                {/* Close Button - Top Right */}
                <Box
                    position="absolute"
                    top={4}
                    right={4}
                    cursor="pointer"
                    onClick={onClose}
                    p={2}
                    borderRadius="full"
                    bg="gray.100"
                    _hover={{ bg: 'gray.200', transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                    zIndex={10}
                >
                    <X size={24} color="#64748b" />
                </Box>

                {/* Header */}
                <VStack gap={1} mb={4}>
                    <Box
                        fontSize="36px"
                        style={{
                            animation: 'bounce 1s ease-in-out infinite'
                        }}
                    >
                        📊
                    </Box>
                    <Heading size="lg" color="gray.800">
                        Your 7-Day Wellness Trend
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                        Track your energy and workload patterns
                    </Text>
                </VStack>

                {last7Days.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Text color="gray.500" fontSize="lg">
                            No data available yet. Complete your daily check-ins to see trends!
                        </Text>
                    </Box>
                ) : (
                    <VStack gap={4} align="stretch">
                        {/* Trend Summary Cards */}
                        <HStack gap={4}>
                            {/* Energy Trend */}
                            {energyTrend && (
                                <Box
                                    flex={1}
                                    p={4}
                                    borderRadius="xl"
                                    bg={`${energyTrend.color}15`}
                                    border="2px solid"
                                    borderColor={energyTrend.color}
                                >
                                    <HStack justify="space-between" mb={2}>
                                        <HStack gap={2}>
                                            <Battery size={24} color={energyTrend.color} />
                                            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                                Energy Level
                                            </Text>
                                        </HStack>
                                        <Text fontSize="32px">{energyTrend.emoji}</Text>
                                    </HStack>
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={energyTrend.color}
                                    >
                                        {energyTrend.status}
                                    </Text>
                                </Box>
                            )}

                            {/* Workload Trend */}
                            {workloadTrend && (
                                <Box
                                    flex={1}
                                    p={4}
                                    borderRadius="xl"
                                    bg={`${workloadTrend.color}15`}
                                    border="2px solid"
                                    borderColor={workloadTrend.color}
                                >
                                    <HStack justify="space-between" mb={2}>
                                        <HStack gap={2}>
                                            <Briefcase size={24} color={workloadTrend.color} />
                                            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                                Workload
                                            </Text>
                                        </HStack>
                                        <Text fontSize="32px">{workloadTrend.emoji}</Text>
                                    </HStack>
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={workloadTrend.color}
                                    >
                                        {workloadTrend.status}
                                    </Text>
                                </Box>
                            )}
                        </HStack>

                        {/* Bar Graph Visualization */}
                        <Box>
                            <Text fontWeight="bold" fontSize="lg" color="gray.800" mb={4}>
                                7-Day Trend Graph
                            </Text>
                            
                            {/* Energy Line Graph */}
                            <Box mb={3} p={4} bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" borderRadius="xl" border="1px solid" borderColor="blue.200" position="relative">
                                <HStack gap={2} mb={3}>
                                    <Text fontSize="24px">⚡</Text>
                                    <Text fontWeight="700" color="gray.800" fontSize="md">Energy Levels</Text>
                                </HStack>
                                <Box position="relative" h="120px">
                                    {/* Data Points with Emojis at different heights */}
                                    <HStack gap={2} h="120px" justify="space-between" position="relative">
                                        {last7Days.map((day, index) => {
                                            // High at TOP (10px), Medium at MIDDLE (55px), Low at BOTTOM (100px)
                                            const topPosition = day.energy === 'high' ? '10px' : day.energy === 'medium' ? '55px' : '100px';
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
                                                            p={2}
                                                            boxShadow="0 4px 12px rgba(0,0,0,0.2)"
                                                            border="3px solid white"
                                                            transition="all 0.3s"
                                                            _hover={{
                                                                transform: 'scale(1.3)',
                                                                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                                                            }}
                                                            style={{
                                                                animation: `popIn 0.4s ease-out ${index * 0.2 + 0.3}s both`
                                                            }}
                                                        >
                                                            <Text fontSize="20px">
                                                                {emoji}
                                                            </Text>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </HStack>
                                    
                                    {/* Connecting Lines passing through emojis */}
                                    <svg width="100%" height="120" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                                        {last7Days.map((day, index) => {
                                            if (index === last7Days.length - 1) return null;
                                            
                                            // Match emoji positions: High=TOP (30), Medium=MIDDLE (75), Low=BOTTOM (120)
                                            const getYPosition = (energy: string) => {
                                                if (energy === 'high') return 30; // top
                                                if (energy === 'medium') return 75; // middle
                                                return 120; // bottom
                                            };
                                            
                                            const currentY = getYPosition(day.energy);
                                            const nextY = getYPosition(last7Days[index + 1].energy);
                                            
                                            const currentColor = day.energy === 'high' ? '#10b981' : day.energy === 'medium' ? '#f59e0b' : '#ef4444';
                                            const nextColor = last7Days[index + 1].energy === 'high' ? '#10b981' : last7Days[index + 1].energy === 'medium' ? '#f59e0b' : '#ef4444';
                                            
                                            // Calculate X positions to match emoji centers
                                            const columnWidth = 100 / last7Days.length;
                                            const x1 = `${(index * columnWidth) + (columnWidth / 2)}%`;
                                            const x2 = `${((index + 1) * columnWidth) + (columnWidth / 2)}%`;
                                            
                                            // Use solid color if same energy level, gradient if different
                                            const strokeColor = currentY === nextY ? currentColor : `url(#gradient-${index})`;
                                            
                                            return (
                                                <line
                                                    key={index}
                                                    x1={x1}
                                                    y1={currentY}
                                                    x2={x2}
                                                    y2={nextY}
                                                    stroke={strokeColor}
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    style={{
                                                        animation: `drawLine 0.5s ease-out ${index * 0.2}s both`
                                                    }}
                                                />
                                            );
                                        })}
                                        <defs>
                                            {last7Days.map((day, index) => {
                                                if (index === last7Days.length - 1) return null;
                                                const currentColor = day.energy === 'high' ? '#10b981' : day.energy === 'medium' ? '#f59e0b' : '#ef4444';
                                                const nextColor = last7Days[index + 1].energy === 'high' ? '#10b981' : last7Days[index + 1].energy === 'medium' ? '#f59e0b' : '#ef4444';
                                                return (
                                                    <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor={currentColor} />
                                                        <stop offset="100%" stopColor={nextColor} />
                                                    </linearGradient>
                                                );
                                            })}
                                        </defs>
                                    </svg>
                                </Box>
                                {/* Date Labels */}
                                <HStack gap={0} justify="space-between" mt={2}>
                                    {last7Days.map((day, index) => (
                                        <Box key={index} flex={1} textAlign="center">
                                            <Text fontSize="2xs" color="gray.700" fontWeight="700">
                                                {formatDate(day.date).split(' ')[1]}
                                            </Text>
                                        </Box>
                                    ))}
                                </HStack>
                            </Box>

                            {/* Workload Bar Graph */}
                            <Box p={4} bg="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" borderRadius="xl" border="1px solid" borderColor="yellow.300">
                                <HStack gap={2} mb={3}>
                                    <Text fontSize="24px">💼</Text>
                                    <Text fontWeight="700" color="gray.800" fontSize="md">Workload Status</Text>
                                </HStack>
                                <HStack gap={2} align="end" h="120px">
                                    {last7Days.map((day, index) => {
                                        const isManageable = day.workload === 'yes';
                                        const height = isManageable ? '100%' : '50%';
                                        const emoji = isManageable ? '✅' : '😰';
                                        const gradient = isManageable
                                            ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                                            : 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)';
                                        
                                        return (
                                            <VStack key={index} flex={1} gap={1} justify="end" h="full" align="center">
                                                <Box
                                                    w="60%"
                                                    maxW="40px"
                                                    h={height}
                                                    bg={gradient}
                                                    borderRadius="xl"
                                                    position="relative"
                                                    transition="all 0.3s"
                                                    boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                                                    _hover={{
                                                        transform: 'translateY(-6px) scale(1.05)',
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                                                    }}
                                                    display="flex"
                                                    flexDirection="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    border="2px solid"
                                                    borderColor="whiteAlpha.400"
                                                    style={{
                                                        animation: `growBar 1s ease-out ${(index + 7) * 0.2}s both`
                                                    }}
                                                >
                                                    <Text fontSize="24px" mb={1}>
                                                        {emoji}
                                                    </Text>
                                                    <Text
                                                        color="white"
                                                        fontSize="2xs"
                                                        fontWeight="bold"
                                                        textTransform="uppercase"
                                                        letterSpacing="wide"
                                                        textShadow="0 1px 2px rgba(0,0,0,0.3)"
                                                    >
                                                        {isManageable ? 'OK' : 'HIGH'}
                                                    </Text>
                                                </Box>
                                                <Text fontSize="2xs" color="gray.700" fontWeight="700">
                                                    {formatDate(day.date).split(' ')[1]}
                                                </Text>
                                            </VStack>
                                        );
                                    })}
                                </HStack>
                            </Box>
                        </Box>

                        {/* Encouragement Message */}
                        <Box
                            p={3}
                            borderRadius="xl"
                            bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                            color="white"
                            textAlign="center"
                        >
                            <Text fontSize="md" fontWeight="600">
                                💪 Keep tracking your wellbeing!
                            </Text>
                        </Box>

                        {/* Close Button - Bottom */}
                        <HStack justify="center" mt={3}>
                            <Button
                                size="md"
                                onClick={onClose}
                                bg="gray.800"
                                color="white"
                                px={6}
                                py={3}
                                fontSize="md"
                                fontWeight="bold"
                                borderRadius="lg"
                                _hover={{
                                    bg: 'gray.700',
                                    transform: 'translateY(-2px)',
                                    shadow: 'xl'
                                }}
                                _active={{
                                    transform: 'translateY(0)'
                                }}
                                transition="all 0.2s"
                            >
                                <HStack gap={2}>
                                    <X size={20} />
                                    <Text>Close</Text>
                                </HStack>
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </Box>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes growBar {
                    0% {
                        transform: scaleY(0);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
                
                @keyframes drawLine {
                    0% {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 1000;
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }
                
                @keyframes popIn {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </Box>
    );
};
