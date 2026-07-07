'use client';

import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  HStack, 
  Text, 
  Box, 
  Heading,
  Spinner,
  Grid,
  GridItem,
  Flex,
  Card,
  Tabs,
  Badge
} from '@chakra-ui/react';
import { ProgressBar } from '../ui/progress';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { AttritionTrendsPanel } from './AttritionTrendsPanel';
import { TeamHealthCompact } from './TeamHealthCompact';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface AttritionAnalysisProps {
  userId?: string;
}

export const AttritionAnalysis: React.FC<AttritionAnalysisProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  // Risk distribution data from API
  const riskData = {
    "Mental Health": {
      "Concerns with Manager": 66,
      "Concerns with peers": 61,
      "Unrealistic Expectations": 68
    },
    "Motivation": {
      "Return to Office": 69,
      "Rewards and Recognition": 64
    },
    "Career Opportunities": {
      "Lack Of role clarity": 61,
      "No growth": 61,
      "Onsite Opportunity": 63
    },
    "Personal": {
      "Health Issues": 58,
      "Higher Education": 63
    }
  };

  // Distribution pie chart data - colors matching the attached image
  const distributionData = [
    { label: 'High', value: 25, color: '#FF6B6B', percentage: 17.2 },
    { label: 'Weak Performer', value: 30, color: '#FFB088', percentage: 20.7 },
    { label: 'Current Opportunity', value: 35, color: '#87CEEB', percentage: 24.1 },
    { label: 'Managed Expectations', value: 55, color: '#7EC8E3', percentage: 37.9 }
  ];

  // Analysis donut chart data - colors matching the attached image (purple/lavender outer, teal/cyan inner)
  const analysisDonutData = {
    labels: [
      'Concerns with Manager', 'Concerns with peers', 'Unrealistic Expectations',
      'Return to Office', 'Rewards and Recognition',
      'Lack Of role clarity', 'No growth', 'Onsite Opportunity',
      'Health Issues', 'Higher Education'
    ],
    datasets: [
      // Outer ring - Sub-categories (purple/lavender gradient)
      {
        label: 'Top Triggers',
        data: [66, 61, 68, 69, 64, 61, 61, 63, 58, 63],
        backgroundColor: [
          '#9B8FD9', '#A89EDD', '#B5ADE1', // Mental Health - purple gradient
          '#7EC8E3', '#87CEEB', // Motivation - cyan gradient
          '#FFD89C', '#FFE4B3', '#FFF0CC', // Career - soft yellow gradient
          '#A8D5BA', '#B8DFC8' // Personal - soft green gradient
        ],
        borderWidth: 0,
        cutout: '40%',
        hoverOffset: 6
      },
      // Inner ring - Main categories (teal/cyan)
      {
        label: 'Main Categories',
        data: [
          Object.values(riskData["Mental Health"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Motivation"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Career Opportunities"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Personal"]).reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [
          '#7EC8E3', // Mental Health - teal
          '#87CEEB', // Motivation - cyan
          '#9DD9D2', // Career Opportunities - mint
          '#A8E6CF'  // Personal - light green
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        cutout: '70%',
        hoverOffset: 4
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed || 0;
            return `${context.label}: ${Math.round(value)}`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      duration: 1500,
      easing: 'easeOutQuart' as const
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  // Calculate total for percentage calculation
  const total = distributionData.reduce((sum, item) => sum + item.value, 0);

  // Team member data for Summary and Insights tabs
  const teamMembers = [
    { 
      name: 'John Doe', 
      skillGap: 'High', 
      skillGapDesc: 'Needs advanced React patterns and TypeScript',
      mentalHealth: 'High risk',
      mentalHealthDesc: 'Schedule immediate 1-on-1, high workload',
      learningPlan: ['Advanced React Patterns', 'TypeScript Deep Dive', 'System Design Basics'],
      progress: [65, 40, 20],
      overallProgress: 42
    },
    { 
      name: 'Jane Smith', 
      skillGap: 'Medium', 
      skillGapDesc: 'System Design and Cloud Architecture focus needed',
      mentalHealth: 'Good',
      mentalHealthDesc: 'Stable, good work-life balance',
      learningPlan: ['System Design Fundamentals', 'AWS Solutions Architect', 'Microservices Architecture'],
      progress: [80, 55, 30],
      overallProgress: 55
    },
    { 
      name: 'Mike Johnson', 
      skillGap: 'Low', 
      skillGapDesc: 'On track with current skill development',
      mentalHealth: 'Medium',
      mentalHealthDesc: 'Monitor workload, recent project stress',
      learningPlan: ['Advanced Kubernetes', 'DevOps Best Practices', 'Performance Optimization'],
      progress: [90, 75, 60],
      overallProgress: 75
    },
    { 
      name: 'Sarah Williams', 
      skillGap: 'Low', 
      skillGapDesc: 'Exceeding expectations, mentor potential',
      mentalHealth: 'Good',
      mentalHealthDesc: 'Excellent well-being, team motivator',
      learningPlan: ['Leadership Skills', 'Technical Mentoring', 'Architecture Patterns'],
      progress: [85, 70, 95],
      overallProgress: 83
    }
  ];

  // Generate SVG path for pie slice
  const createPieSlice = (startAngle: number, endAngle: number, radius: number, innerRadius: number = 0) => {
    const x1 = Math.cos(startAngle) * radius;
    const y1 = Math.sin(startAngle) * radius;
    const x2 = Math.cos(endAngle) * radius;
    const y2 = Math.sin(endAngle) * radius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    if (innerRadius > 0) {
      // Donut chart
      const x3 = Math.cos(endAngle) * innerRadius;
      const y3 = Math.sin(endAngle) * innerRadius;
      const x4 = Math.cos(startAngle) * innerRadius;
      const y4 = Math.sin(startAngle) * innerRadius;

      return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    } else {
      // Full pie chart
      return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }
  };

  if (loading) {
    return (
      <Card.Root bg="#ffffff" shadow="sm" borderRadius="3xl" h="full" display="flex" flexDirection="column">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="center" align="center">
            <Heading size="md" color="gray.100" textAlign="center">Attrition Analysis</Heading>
          </HStack>
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <VStack gap={4} align="center" justify="center" minH="200px">
            <Spinner size="lg" color="teal.500" />
            <Text color="gray.500" fontSize="sm">Loading data...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root bg="white" shadow="lg" borderRadius="2xl" h="full" display="flex" flexDirection="column" border="1px solid" borderColor="gray.200">
        <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.100" textAlign="center">Attrition Analysis</Heading>
        </Card.Header>
        <Card.Body p={3} flex="1" minH="0" overflow="hidden">
          <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
            <VStack gap={2} align="start">
              <Text fontSize="sm" fontWeight="normal" color="red.800">
                Error loading chart
              </Text>
              <Text fontSize="sm" color="red.600">
                {error}
              </Text>
            </VStack>
          </Box>
        </Card.Body>
      </Card.Root>
    );
  }

  const tabs = ['Attrition Analysis', 'Your Attention', 'Recommendations'];

  return (
    <Card.Root
      w="100%"
      bg="#ffffff"
      shadow="xs" 
      borderRadius="3xl" 
      h="full"
      display="flex" 
      flexDirection="column"  
      borderColor="gray.100"
      p={2}
    >
      <Card.Header px={4} pt={2} pb={4} borderBottom="none">
        <VStack gap={0} w="full" align="stretch" position="relative">
          {/* Tabs - Overlapping Parallelogram Shape */}
          <Box w="full" position="relative" mb={0} display="flex">
            {tabs.map((tab, index) => (
              <Box
                key={index}
                flex={1}
                px={6}
                py={2.5}
                ml={index > 0 ? "-30px" : "0"}
                bg={activeTab === index ? "rgba(224, 255, 255, 0.5)" : "rgba(245, 245, 245, 0.3)"}
                color={activeTab === index ? "cyan.700" : "gray.500"}
                cursor="pointer"
                fontSize="sm"
                fontWeight={activeTab === index ? "bold" : "medium"}
                textAlign="center"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="visible"
                borderRadius="12px"
                border="none"
                zIndex={activeTab === index ? 10 : index}
                onMouseEnter={() => setActiveTab(index)}
                _hover={{
                  bg: activeTab === index ? "rgba(224, 255, 255, 0.6)" : "rgba(245, 245, 245, 0.5)",
                  zIndex: activeTab === index ? 10 : 5
                }}
_before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "calc(100% - 2px)",
                  borderTop: "2px solid",
                  borderLeft: (activeTab === index && (index === 1 || index === 2)) ? "2px solid" : "none",
                  borderRight: (activeTab === index && (index === 0 || index === 1)) ? "2px solid" : "none",
                  borderColor: activeTab === index ? "cyan.400" : "gray.300",
                  borderTopLeftRadius: (activeTab === index && (index === 1 || index === 2)) ? "12px" : "0px",
                  borderTopRightRadius: (activeTab === index && (index === 0 || index === 1)) ? "12px" : "0px",
                  pointerEvents: "none",
                  zIndex: 1
                }}
              >
                <Text position="relative" zIndex={3}>
                  {tab}
                </Text>
              </Box>
            ))}
          </Box>
          
          {/* Extended Border Lines Based on Active Tab */}
          {isMounted && (
            <>
              <style jsx global>{`
                @keyframes expandRight {
                  0% { transform: scaleX(0); }
                  100% { transform: scaleX(1); }
                }
                @keyframes expandLeft {
                  0% { transform: scaleX(0); }
                  100% { transform: scaleX(1); }
                }
              `}</style>
              
              {/* Right side line for tab 0 and 1 */}
              {(activeTab === 0 || activeTab === 1) && (
                <Box
                  key={`right-${animationKey}`}
                  position="absolute"
left={`calc(${(activeTab + 1) * (100 / tabs.length)}% - 2px)`}
                  bottom={0}
                  right={0}
                  h="2px"
                  bg="cyan.400"
                  zIndex={4}
                  style={{
                    transformOrigin: 'left',
                    animation: 'expandRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}
                />
              )}
              
              {/* Left side line for tab 1 and 2 */}
              {(activeTab === 1 || activeTab === 2) && (
                <Box
                  key={`left-${animationKey}`}
                  position="absolute"
                  left={0}
right={`calc(${(tabs.length - activeTab) * (100 / tabs.length)}% - 2px)`}
                  bottom={0}
                  h="2px"
                  bg="cyan.400"
                  zIndex={4}
                  style={{
                    transformOrigin: 'right',
                    animation: 'expandLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}
                />
              )}
            </>
          )}
        </VStack>
      </Card.Header>
      
      <Card.Body h="full" display="flex" flexDirection="column" w="full" p={2} overflow="hidden" bg="rgba(224, 255, 255, 0.5)">
        {/* Tab 0: Attrition Analysis */}
        {activeTab === 0 && (
        <HStack 
          align="stretch" 
          justify="space-between" 
          h="full" 
          w="100%"
          gap={2}
          flex="1"
          minH="0"
        >
          {/* Team Health Dashboard */}
          <VStack 
            align="stretch" 
            justify="flex-start" 
            h="full" 
            flex="1"
            minW="0"
            maxW="25%"
            gap={2}
            minH="0"
            px={2}
            py={2}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="lg"
            transition="all 0.3s ease"
            cursor="pointer"
            _hover={{
              shadow: "lg",
              transform: "scale(1.05)",
              borderColor: "teal.300",
              zIndex: 10
            }}
          >
            <TeamHealthCompact />
          </VStack>

          {/* Risk Distribution */}
          <VStack 
            align="stretch" 
            justify="flex-start" 
            h="full" 
            flex="1"
            minW="0"
            maxW="25%"
            gap={2}
            minH="0"
            px={2}
            py={2}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="lg"
            transition="all 0.3s ease"
            cursor="pointer"
            _hover={{
              shadow: "lg",
              transform: "scale(1.05)",
              borderColor: "blue.300",
              zIndex: 10
            }}
          >
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center" flexShrink={0}>
              Risk BreakDown
            </Text>
            
            <VStack flex={1} justify="center" align="center" w="full">
            {/* Distribution Pie Chart */}
            <Box 
              position="relative" 
              w="150px"
              h="150px"
              flex="none"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="150px"
                height="150px"
                viewBox="-70 -70 140 140"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))",
                  maxWidth: "240px",
                  maxHeight: "240px"
                }}
              >
                {/* Pie slices */}
                {(() => {
                  let currentAngle = -Math.PI / 2; // Start from top
                  return distributionData.map((item, index) => {
                    const sliceAngle = (item.value / total) * 2 * Math.PI;
                    const endAngle = currentAngle + sliceAngle;
                    const path = createPieSlice(currentAngle, endAngle, 70, 45);
                    
                    const slice = (
                      <g key={index}>
                        <path
                          d={path}
                          fill={item.color}
                          stroke="white"
                          strokeWidth="3"
                          style={{
                            transition: "all 0.2s ease",
                            cursor: "pointer"
                          }}
                        />
                      </g>
                    );
                    
                    currentAngle = endAngle;
                    return slice;
                  });
                })()}
                
                {/* Center circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill="white"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              </svg>
            </Box>

            {/* Distribution Legend */}
            <VStack align="center" gap={1} w="full" maxW="200px">
              <Grid templateColumns="repeat(2, 1fr)" gap={1} w="full">
                {distributionData.map((item, index) => (
                  <Flex key={index} align="center" gap={1} minH="18px">
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg={item.color}
                      flexShrink={0}
                    />
                    <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>
                      {item.label}
                    </Text>
                  </Flex>
                ))}
              </Grid>
            </VStack>
            </VStack>
          </VStack>

          {/* Risk Analysis */}
          <VStack 
            align="stretch" 
            justify="flex-start" 
            h="full" 
            flex="1"
            minW="0"
            maxW="25%"
            gap={2}
            minH="0"
            px={2}
            py={2}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="lg"
            transition="all 0.3s ease"
            cursor="pointer"
            _hover={{
              shadow: "lg",
              transform: "scale(1.05)",
              borderColor: "purple.300",
              zIndex: 10
            }}
          >
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center" flexShrink={0}>
              Attrition Drivers
            </Text>
            
            <VStack flex={1} justify="center" align="center" w="full">
            {/* Analysis Donut Chart */}
            <Box
              w="150px"
              h="150px"
              transition="all 0.2s ease"
            >
              <Doughnut data={analysisDonutData} options={donutOptions} />
            </Box>

            {/* Analysis Legend */}
            <VStack align="center" gap={1} w="full" maxW="200px">
              <Grid templateColumns="repeat(2, 1fr)" gap={1} w="full">
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#7EC8E3" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Mental Health</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#87CEEB" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Motivation</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#9DD9D2" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Career Opp.</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#A8E6CF" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Personal</Text>
                </Flex>
              </Grid>
            </VStack>
            </VStack>
          </VStack>

          {/* Attrition Trends */}
          <VStack 
            align="stretch" 
            justify="flex-start" 
            h="full" 
            flex="1"
            minW="0"
            maxW="25%"
            gap={2}
            minH="0"
            px={2}
            py={2}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="lg"
            transition="all 0.3s ease"
            cursor="pointer"
            _hover={{
              shadow: "lg",
              transform: "scale(1.05)",
              borderColor: "orange.300",
              zIndex: 10
            }}
          >
            <AttritionTrendsPanel trends={undefined} />
          </VStack>
        </HStack>
        )}

        {/* Tab 1: Summary */}
        {activeTab === 1 && (
          <VStack gap={2} h="full" p={2} align="stretch">
            {/* Top Row - Skill Gap, Mental Health, and Quick Stats */}
            <Grid templateColumns="1fr 1fr 0.8fr" gap={2}>
              {/* Skill Gap Summary */}
              <Box p={2} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                <Text fontSize="xs" color="gray.800" fontWeight="600" mb={1.5}>Skill Gap</Text>
                
                <HStack gap={3} mb={1.5} flexWrap="wrap">
                  <HStack gap={1}>
                    <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
                    <Text fontSize="2xs" color="gray.700">Members need development: 3</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
                    <Text fontSize="2xs" color="gray.700">Gap: 35%</Text>
                  </HStack>
                </HStack>
                
                <Text fontSize="2xs" color="gray.800" fontWeight="600" mb={0.5}>Focus Areas</Text>
                <VStack align="stretch" gap={0.5}>
                  <HStack gap={1}>
                    <Text fontSize="2xs" color="gray.700">•</Text>
                    <Text fontSize="2xs" color="gray.700">React</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Text fontSize="2xs" color="gray.700">•</Text>
                    <Text fontSize="2xs" color="gray.700">System Design</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Text fontSize="2xs" color="gray.700">•</Text>
                    <Text fontSize="2xs" color="gray.700">Cloud</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Mental Health Summary */}
              <Box p={2} bg="pink.50" borderRadius="md" border="1px solid" borderColor="pink.200">
                <Text fontSize="xs" color="gray.800" fontWeight="600" mb={1.5}>Mental Health — Action Required</Text>
                
                <HStack gap={3} mb={1.5} flexWrap="wrap">
                  <HStack gap={1}>
                    <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
                    <Text fontSize="2xs" color="gray.700">High-risk members: 2</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" />
                    <Text fontSize="2xs" color="gray.700">Avg duration: 4 days</Text>
                  </HStack>
                </HStack>
                
                <Text fontSize="2xs" color="gray.800" fontWeight="600" mb={0.5}>Recommended Actions</Text>
                <VStack align="stretch" gap={0.5}>
                  <HStack gap={1}>
                    <Text fontSize="2xs" color="gray.700">•</Text>
                    <Text fontSize="2xs" color="gray.700">1:1 check-ins</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Text fontSize="2xs" color="gray.700">•</Text>
                    <Text fontSize="2xs" color="gray.700">Workload redistribution</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Text fontSize="2xs" color="gray.700">•</Text>
                    <Text fontSize="2xs" color="gray.700">Wellness program enrollment</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Quick Stats Grid */}
              <Grid templateColumns="repeat(2, 1fr)" gap={1.5}>
                <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" textAlign="center">
                  <Text fontSize="md" fontWeight="bold" color="red.600">5/12</Text>
                  <Text fontSize="2xs" color="gray.600">High Critical + Risk</Text>
                </Box>
                <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" textAlign="center">
                  <Text fontSize="md" fontWeight="bold" color="pink.600">2/12</Text>
                  <Text fontSize="2xs" color="gray.600">Mental Health</Text>
                </Box>
                <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" textAlign="center">
                  <Text fontSize="md" fontWeight="bold" color="purple.600">2/12</Text>
                  <Text fontSize="2xs" color="gray.600">Career Concerns</Text>
                </Box>
                <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" textAlign="center">
                  <Text fontSize="md" fontWeight="bold" color="teal.600">3/12</Text>
                  <Text fontSize="2xs" color="gray.600">Personal Reasons</Text>
                </Box>
              </Grid>
            </Grid>

            {/* Bottom Row - Survey Sentiment & Engagement */}
            <Grid templateColumns="repeat(2, 1fr)" gap={2} flex={1}>
              <VStack gap={2} align="stretch">
              {/* Survey Sentiment - Horizontal Bars with Dots */}
              <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200" display="flex" flexDirection="column" h="full">
                <HStack gap={1.5} mb={2}>
                  <Box w="2px" h="2px" borderRadius="full" bg="blue.600" />
                  <Heading size="xs" color="gray.800" fontWeight="600">Survey Sentiment</Heading>
                </HStack>
                <VStack align="stretch" gap={2} flex="1" justify="center">
                  <HStack justify="space-between" align="center">
                    <HStack gap={2} flex="0 0 100px">
                      <Box w="8px" h="8px" borderRadius="full" bg="#ef4444" />
                      <Text fontSize="2xs" color="gray.700" fontWeight="500">Workload Stress</Text>
                    </HStack>
                    <Box flex="1" h="6px" bg="gray.200" borderRadius="full" mx={2}>
                      <Box w="68%" h="full" bg="#ef4444" borderRadius="full" />
                    </Box>
                    <Text fontSize="2xs" fontWeight="600" color="gray.900" w="30px" textAlign="right">68%</Text>
                  </HStack>
                  <HStack justify="space-between" align="center">
                    <HStack gap={2} flex="0 0 100px">
                      <Box w="8px" h="8px" borderRadius="full" bg="#f97316" />
                      <Text fontSize="2xs" color="gray.700" fontWeight="500">Work-Life Balance</Text>
                    </HStack>
                    <Box flex="1" h="6px" bg="gray.200" borderRadius="full" mx={2}>
                      <Box w="45%" h="full" bg="#f97316" borderRadius="full" />
                    </Box>
                    <Text fontSize="2xs" fontWeight="600" color="gray.900" w="30px" textAlign="right">45%</Text>
                  </HStack>
                </VStack>
              </Box>

              </VStack>

              <VStack gap={2} align="stretch">
              {/* Overall Engagement - Horizontal Bars with Dots */}
              <Box p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200" display="flex" flexDirection="column" h="full">
                <HStack gap={1.5} mb={2}>
                  <Box w="2px" h="2px" borderRadius="full" bg="green.600" />
                  <Heading size="xs" color="gray.800" fontWeight="600">Content Consumption</Heading>
                </HStack>
                <VStack align="stretch" gap={2} flex="1" justify="center">
                  <HStack justify="space-between" align="center">
                    <HStack gap={2} flex="0 0 60px">
                      <Box w="8px" h="8px" borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="2xs" color="gray.700" fontWeight="500">Articles</Text>
                    </HStack>
                    <Box flex="1" h="6px" bg="gray.200" borderRadius="full" mx={2}>
                      <Box w="78%" h="full" bg="#3b82f6" borderRadius="full" />
                    </Box>
                    <Text fontSize="2xs" fontWeight="600" color="gray.900" w="30px" textAlign="right">78%</Text>
                  </HStack>
                  <HStack justify="space-between" align="center">
                    <HStack gap={2} flex="0 0 60px">
                      <Box w="8px" h="8px" borderRadius="full" bg="#10b981" />
                      <Text fontSize="2xs" color="gray.700" fontWeight="500">Videos</Text>
                    </HStack>
                    <Box flex="1" h="6px" bg="gray.200" borderRadius="full" mx={2}>
                      <Box w="65%" h="full" bg="#10b981" borderRadius="full" />
                    </Box>
                    <Text fontSize="2xs" fontWeight="600" color="gray.900" w="30px" textAlign="right">65%</Text>
                  </HStack>
                  <HStack justify="space-between" align="center">
                    <HStack gap={2} flex="0 0 60px">
                      <Box w="8px" h="8px" borderRadius="full" bg="#8b5cf6" />
                      <Text fontSize="2xs" color="gray.700" fontWeight="500">Chat</Text>
                    </HStack>
                    <Box flex="1" h="6px" bg="gray.200" borderRadius="full" mx={2}>
                      <Box w="82%" h="full" bg="#8b5cf6" borderRadius="full" />
                    </Box>
                    <Text fontSize="2xs" fontWeight="600" color="gray.900" w="30px" textAlign="right">82%</Text>
                  </HStack>
                </VStack>
              </Box>
              </VStack>
            </Grid>
          </VStack>
        )}

        {/* Tab 2: Recommendations */}
        {activeTab === 2 && (
          <HStack h="full" p={4} gap={4} align="stretch" justify="center" bg="white">
            <Card.Root
              flex="1"
              bg="white"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              shadow="sm"
              // overflow="hidden"
            >
              <Card.Body py={2} px={4}>
                <VStack align="stretch" gap={2}>
                  <HStack gap={3} align="center" justify="center">
                    <Box
                      w="28px"
                      h="28px"
                      borderRadius="full"
                      bg="cyan.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      // flexShrink={0}
                    >
                      <Text fontSize="sm" lineHeight="1">🎯</Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.800">
                      Action Items
                    </Text>
                  </HStack>

                  <Grid templateRows={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>📋 Survey Sentiment</Text>
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="xs" color="gray.700">• Conduct immediate 1-on-1 meetings with high-stress employees</Text>
                        <Text fontSize="xs" color="gray.700">• Review and redistribute workload across team members</Text>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>💚 Mental Health</Text>
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="xs" color="gray.700">• Schedule wellness check-ins with at-risk team members</Text>
                        <Text fontSize="xs" color="gray.700">• Enroll team in mental health support programs</Text>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>📚 Skill Gap</Text>
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="xs" color="gray.700">• Create personalized learning paths for each team member</Text>
                        <Text fontSize="xs" color="gray.700">• Allocate budget for technical training and certifications</Text>
                      </VStack>
                    </Box>
                  </Grid>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              flex="1"
              bg="white"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              shadow="sm"
              overflow="hidden"
            >
              <Card.Body py={2} px={4}>
                <VStack align="stretch" gap={1}>
                  <HStack gap={3} align="center" justify="center">
                    <Box
                      w="28px"
                      h="28px"
                      borderRadius="full"
                      bg="cyan.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      // flexShrink={0}
                    >
                      <Text fontSize="sm" lineHeight="1">💡</Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.800">
                      Recommendations
                    </Text>
                  </HStack>

                  <Grid templateRows={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>📅 Project Management</Text>
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="xs" color="gray.700">• Reassess project timelines and reduce unrealistic deadlines</Text>
                        <Text fontSize="xs" color="gray.700">• Implement agile methodologies for better sprint planning</Text>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>👨‍💼 Resource Allocation</Text>
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="xs" color="gray.700">• Balance workload distribution based on skill levels</Text>
                        <Text fontSize="xs" color="gray.700">• Hire additional resources for high-priority initiatives</Text>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="700" color="blue.700" mb={2}>📊 Impact Management</Text>
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="xs" color="gray.700">• Monitor team morale through regular pulse surveys</Text>
                        <Text fontSize="xs" color="gray.700">• Establish clear communication channels for feedback</Text>
                      </VStack>
                    </Box>
                  </Grid>
                </VStack>
              </Card.Body>
            </Card.Root>
          </HStack>
        )}
      </Card.Body>
    </Card.Root>
  );
};
