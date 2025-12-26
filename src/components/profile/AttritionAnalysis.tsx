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

  // Distribution pie chart data
  const distributionData = [
    { label: 'High Risk', value: 25, color: '#EF4444', percentage: 17.2 },
    { label: 'Medium Risk', value: 45, color: '#F59E0B', percentage: 31.0 },
    { label: 'Low Risk', value: 75, color: '#22C55E', percentage: 51.7 }
  ];

  // Analysis donut chart data
  const analysisDonutData = {
    labels: [
      'Concerns with Manager', 'Concerns with peers', 'Unrealistic Expectations',
      'Return to Office', 'Rewards and Recognition',
      'Lack Of role clarity', 'No growth', 'Onsite Opportunity',
      'Health Issues', 'Higher Education'
    ],
    datasets: [
      // Outer ring - Sub-categories (detailed triggers)
      {
        label: 'Top Triggers',
        data: [66, 61, 68, 69, 64, 61, 61, 63, 58, 63],
        backgroundColor: [
          '#E53E3E', '#F56565', '#FC8181', // Mental Health - red gradient
          '#2B6CB0', '#4299E1', // Motivation - blue gradient
          '#D69E2E', '#ECC94B', '#F6E05E', // Career - yellow gradient
          '#38A169', '#48BB78' // Personal - green gradient
        ],
        borderWidth: 0,
        cutout: '40%',
        hoverOffset: 6
      },
      // Inner ring - Main categories
      {
        label: 'Main Categories',
        data: [
          Object.values(riskData["Mental Health"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Motivation"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Career Opportunities"]).reduce((a, b) => a + b, 0),
          Object.values(riskData["Personal"]).reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [
          '#F56565', // Mental Health
          '#4299E1', // Motivation  
          '#ECC94B', // Career Opportunities
          '#48BB78'  // Personal
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
          gap={3}
          flex="1"
          minH="0"
        >
          {/* Left Side - Risk Distribution */}
          <VStack 
            align="center" 
            justify="center" 
            h="full" 
            flex="1"
            gap={3}
            minH="0"
            px={4}
            py={3}
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
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">
              Risk Distribution
            </Text>
            
            {/* Distribution Pie Chart */}
            <Box 
              position="relative" 
              w="200px"
              h="200px"
              flex="none"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="200px"
                height="200px"
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
            <HStack justify="center" gap={2} w="full" flexWrap="nowrap">
              {distributionData.map((item, index) => (
                <Flex key={index} align="center" gap={1} minH="20px">
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg={item.color}
                    flexShrink={0}
                  />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" whiteSpace="nowrap">
                    {item.label}
                  </Text>
                  <Text fontSize="xs" fontWeight="700" color="gray.700" flexShrink={0}>
                    {item.value}
                  </Text>
                </Flex>
              ))}
            </HStack>
          </VStack>

          {/* Right Side - Risk Analysis */}
          <VStack 
            align="center" 
            justify="center" 
            h="full" 
            flex="1"
            gap={3}
            minH="0"
            px={4}
            py={3}
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
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">
              Risk Analysis
            </Text>
            
            {/* Analysis Donut Chart */}
            <Box
              w="200px"
              h="200px"
              transition="all 0.2s ease"
            >
              <Doughnut data={analysisDonutData} options={donutOptions} />
            </Box>

            {/* Analysis Legend */}
            <VStack align="center" gap={1} w="full" maxW="200px">
              <Grid templateColumns="repeat(2, 1fr)" gap={1} w="full">
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#F56565" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Mental Health</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#4299E1" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Motivation</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#ECC94B" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Career Opp.</Text>
                </Flex>
                <Flex align="center" gap={1} minH="18px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#48BB78" flexShrink={0} />
                  <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>Personal</Text>
                </Flex>
              </Grid>
            </VStack>
          </VStack>

          {/* Attrition Trends Section */}
          <VStack 
            flex="1" 
            h="full" 
            minW="0" 
            px={4}
            py={3}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="lg"
            transition="all 0.3s ease"
            cursor="pointer"
            align="stretch"
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
          <Grid templateColumns="repeat(2, 1fr)" gap={2} h="full" p={2}>
            {/* Left Column - Key Insights */}
            <VStack gap={2} align="stretch">
              {/* Skill Gap Summary */}
              <Box p={2} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200" flex="1">
                <HStack gap={1.5} mb={1}>
                  <Box w="2px" h="2px" borderRadius="full" bg="blue.600" />
                  <Heading size="xs" color="gray.800" fontWeight="600">Skill Gap</Heading>
                </HStack>
                <Text fontSize="2xs" color="gray.700" lineHeight="1.3">
                  3 members need development. Focus: React, System Design, Cloud. Gap: 35%.
                </Text>
              </Box>

              {/* Mental Health Summary */}
              <Box p={2} bg="pink.50" borderRadius="md" border="1px solid" borderColor="pink.200" flex="1">
                <HStack gap={1.5} mb={1}>
                  <Box w="2px" h="2px" borderRadius="full" bg="pink.600" />
                  <Heading size="xs" color="gray.800" fontWeight="600">Mental Health</Heading>
                </HStack>
                <Text fontSize="2xs" color="gray.700" lineHeight="1.3">
                  2 high-risk members. Action: 1-on-1s, workload review, wellness enrollment.
                </Text>
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
            </VStack>

            {/* Right Column - Survey Sentiment & Engagement */}
            <VStack gap={2} align="stretch">
              {/* Survey Sentiment */}
              <Box p={2} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200" flex="1">
                <HStack gap={1.5} mb={1}>
                  <Box w="2px" h="2px" borderRadius="full" bg="blue.600" />
                  <Heading size="xs" color="gray.800" fontWeight="600">Survey Sentiment</Heading>
                </HStack>
                <VStack align="stretch" gap={1}>
                  <HStack gap={1}>
                    <Text fontSize="xs">•</Text>
                    <Text fontSize="2xs" color="gray.700">68% employees report increased workload stress</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Text fontSize="xs">•</Text>
                    <Text fontSize="2xs" color="gray.700">45% seeking better work-life balance options</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Overall Engagement */}
              <Box p={2} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200" flex="1" display="flex" flexDirection="column">
                <HStack gap={1.5} mb={1}>
                  <Box w="2px" h="2px" borderRadius="full" bg="green.600" />
                  <Heading size="xs" color="gray.800" fontWeight="600">Overall Content Engagement </Heading>
                </HStack>
                <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                  <HStack gap={'24'}>
                    <VStack gap={0}>
                      <Text fontSize="xx-large" fontWeight="bold" color="green.600">78%</Text>
                      <Text fontSize="2xs" color="gray.600" textAlign="center">Articles</Text>
                    </VStack>
                    <VStack gap={0}>
                      <Text fontSize="xx-large" fontWeight="bold" color="blue.600">65%</Text>
                      <Text fontSize="2xs" color="gray.600" textAlign="center">Videos</Text>
                    </VStack>
                    <VStack gap={0}>
                      <Text fontSize="xx-large" fontWeight="bold" color="purple.600">82%</Text>
                      <Text fontSize="2xs" color="gray.600" textAlign="center">Chat</Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>
            </VStack>
          </Grid>
        )}

        {/* Tab 2: Recommendations */}
        {activeTab === 2 && (
          <HStack h="full" p={4} gap={6} align="center" justify="center" bg="white">
            {/* Sticky Note 1 - Action Items */}
            <VStack 
              flex="1" 
              bg="linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" 
              p={5} 
              pt={7}
              borderRadius="3px" 
              boxShadow="8px 8px 20px rgba(0,0,0,0.35), 4px 4px 10px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(0,0,0,0.1)" 
              align="stretch"
              position="relative"
              top="-10px"
              left="-8px"
              transition="all 0.3s"
              _hover={{ top: "-14px", boxShadow: "10px 12px 25px rgba(0,0,0,0.4)" }}
              _before={{
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                bg: 'radial-gradient(circle, #ef4444 0%, #dc2626 100%)',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
                border: '2px solid #b91c1c',
              }}
              _after={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '8px',
                bg: 'linear-gradient(to bottom, #6b7280, transparent)',
              }}
            >
              {/* Sticky Note Header */}
              <HStack justify="center" mb={2}>
                <Text fontSize="lg" fontWeight="700" color="gray.900">🎯 Action Items</Text>
              </HStack>

              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                {/* Survey Sentiment Actions */}
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.900" mb={1}>📋 Survey Sentiment</Text>
                  <VStack align="stretch" gap={1} pl={3}>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Conduct immediate 1-on-1 meetings with high-stress employees</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Review and redistribute workload across team members</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Implement flexible work arrangements and remote options</Text>
                  </VStack>
                </Box>

                {/* Mental Health Actions */}
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.900" mb={1}>💚 Mental Health</Text>
                  <VStack align="stretch" gap={1} pl={3}>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Schedule wellness check-ins with at-risk team members</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Enroll team in mental health support programs</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Promote work-life balance initiatives and time-off policies</Text>
                  </VStack>
                </Box>

                {/* Skill Gap Actions */}
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.900" mb={1}>📚 Skill Gap</Text>
                  <VStack align="stretch" gap={1} pl={3}>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Create personalized learning paths for each team member</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Allocate budget for technical training and certifications</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Pair junior developers with senior mentors for knowledge transfer</Text>
                  </VStack>
                </Box>
              </Grid>
            </VStack>

            {/* Sticky Note 2 - Recommendations */}
            <VStack 
              flex="1" 
              bg="linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)" 
              p={5} 
              pt={7}
              borderRadius="3px" 
              boxShadow="8px 8px 20px rgba(0,0,0,0.35), 4px 4px 10px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(0,0,0,0.1)" 
              align="stretch"
              position="relative"
              top="10px"
              right="-8px"
              transition="all 0.3s"
              _hover={{ top: "6px", boxShadow: "10px 12px 25px rgba(0,0,0,0.4)" }}
              _before={{
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                bg: 'radial-gradient(circle, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
                border: '2px solid #1d4ed8',
              }}
              _after={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '8px',
                bg: 'linear-gradient(to bottom, #6b7280, transparent)',
              }}
            >
              {/* Sticky Note Header */}
              <HStack justify="center" mb={2}>
                <Text fontSize="lg" fontWeight="700" color="gray.900">💡 Recommendations</Text>
              </HStack>

              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                {/* Project Management */}
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.900" mb={1}>📅 Project Management</Text>
                  <VStack align="stretch" gap={1} pl={3}>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Reassess project timelines and reduce unrealistic deadlines</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Implement agile methodologies for better sprint planning</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Prioritize critical projects and defer non-essential tasks</Text>
                  </VStack>
                </Box>

                {/* Resource Allocation */}
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.900" mb={1}>👨‍💼 Resource Allocation</Text>
                  <VStack align="stretch" gap={1} pl={3}>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Balance workload distribution based on skill levels</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Hire additional resources for high-priority initiatives</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Cross-train team members to improve resource flexibility</Text>
                  </VStack>
                </Box>

                {/* Impact Management */}
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.900" mb={1}>📊 Impact Management</Text>
                  <VStack align="stretch" gap={1} pl={3}>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Monitor team morale through regular pulse surveys</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Establish clear communication channels for feedback</Text>
                    <Text fontSize="2xs" color="gray.800" fontWeight="500">• Track retention metrics and adjust strategies accordingly</Text>
                  </VStack>
                </Box>
              </Grid>
            </VStack>
          </HStack>
        )}
      </Card.Body>
    </Card.Root>
  );
};
