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
  Badge,
  SimpleGrid,
  IconButton,
  Popover,
  Dialog,
  Portal
} from '@chakra-ui/react';
import { ProgressBar } from '../ui/progress';
import { Doughnut } from 'react-chartjs-2';
import { Info } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { AttritionTrendsPanel } from './AttritionTrendsPanel';
import { TeamHealthCompact } from './TeamHealthCompact';
import { TabNavigation, Tab1Content, Tab2Content, AnalysisCard } from './attrition';
import { ATTRITION_TAB_LABELS } from '@/constants';

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
  const [selectedSlice, setSelectedSlice] = useState<{ label: string; value: number; color: string; percentage: number } | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<{ label: string; value: number; color: string; percentage: number; x: number; y: number } | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<{ label: string; value: number; color: string; percentage: number } | null>(null);

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

  // Drivers data with percentages
  const driversData = [
    { label: 'Mental Health', value: 66, color: '#7EC8E3', percentage: 28.8 },
    { label: 'Motivation', value: 64, color: '#87CEEB', percentage: 27.9 },
    { label: 'Career Opportunities', value: 61, color: '#9DD9D2', percentage: 26.6 },
    { label: 'Personal', value: 38, color: '#A8E6CF', percentage: 16.6 }
  ];

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

  const tabs = [...ATTRITION_TAB_LABELS];

  return (
    <Card.Root
      w="100%"
      bg="#ffffff"
      shadow="0 2px 12px rgba(0,0,0,0.06)" 
      borderRadius="2xl" 
      h="full"
      display="flex" 
      flexDirection="column"  
      border="1px solid"
      borderColor="gray.100"
      p={3}
    >
      <Card.Header px={0} pt={0} pb={0} borderBottom="none">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </Card.Header>
      
      <Card.Body h="full" display="flex" flexDirection="column" w="full" p={3} overflow="hidden" bg="white" borderRadius="xl" mt={3}>
        {/* Tab 0: Attrition Analysis */}
        {activeTab === 0 && (
        <HStack 
          align="stretch" 
          justify="space-between" 
          h="full" 
          w="100%"
          gap={4}
          flex="1"
          minH="0"
        >
          {/* Team Health Dashboard */}
          <AnalysisCard title="Team Health" hoverBorderColor="teal.200">
            <TeamHealthCompact />
          </AnalysisCard>

          {/* Risk Distribution */}
          <AnalysisCard title="Risk Breakdown" hoverBorderColor="blue.200">
            <VStack gap={4} justify="center" align="center" w="full" h="full" position="relative">
              {/* Distribution Pie Chart */}
              <Box 
                w="70%"
                h="70%"
                flex="none"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="-70 -70 140 140"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))"
                  }}
                >
                  {/* Pie slices */}
                  {(() => {
                    let currentAngle = -Math.PI / 2; // Start from top
                    return distributionData.map((item, index) => {
                      const sliceAngle = (item.value / total) * 2 * Math.PI;
                      const endAngle = currentAngle + sliceAngle;
                      const path = createPieSlice(currentAngle, endAngle, 70, 45);
                      const isMajor = item.percentage >= 20; // Major if >= 20%
                      
                      const slice = (
                        <g key={index}>
                          <path
                            d={path}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="3"
                            style={{
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                              opacity: hoveredSlice?.label === item.label ? 0.8 : 1
                            }}
                            onClick={() => isMajor && setSelectedSlice(item)}
                            onMouseMove={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                              if (svgRect) {
                                setHoveredSlice({ 
                                  ...item, 
                                  x: svgRect.left + svgRect.width / 2, 
                                  y: svgRect.top 
                                });
                              }
                            }}
                            onMouseLeave={() => setHoveredSlice(null)}
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

              {/* Legend for Major Partitions */}
              <SimpleGrid columns={2} gap={2} w="full" px={4}>
                {distributionData
                  .filter(item => item.percentage >= 20)
                  .slice(0, 4)
                  .map((item, index) => (
                    <Flex 
                      key={index} 
                      align="center" 
                      gap={2}
                      borderRadius="md"
                      transition="all 0.2s"
                      cursor="pointer"
                      _hover={{ bg: "gray.50" }}
                    >
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="full"
                        bg={item.color}
                        flexShrink={0}
                        shadow="sm"
                      />
                      <Text 
                        fontSize="0.75rem"
                        fontWeight="500" 
                        color="gray.700"
                        letterSpacing="0.01em"
                        lineClamp={1}
                      >
                        {item.label}
                      </Text>
                    </Flex>
                  ))}
              </SimpleGrid>
            </VStack>
          </AnalysisCard>

          
          {/* Hover Tooltip for Small Slices */}
          {hoveredSlice && (
            <Portal>
              <Box
                position="fixed"
                left={`${hoveredSlice.x}px`}
                top={`${hoveredSlice.y - 80}px`}
                transform="translateX(-50%)"
                bg="gray.800"
                color="white"
                px={3}
                py={2}
                borderRadius="md"
                shadow="lg"
                zIndex={9999}
                pointerEvents="none"
                _after={{
                  content: '""',
                  position: "absolute",
                  bottom: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid",
                  borderTopColor: "gray.800"
                }}
              >
                <VStack align="stretch" gap={1}>
                  <Flex align="center" gap={2}>
                    <Box
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={hoveredSlice.color}
                      flexShrink={0}
                    />
                    <Text fontSize="0.75rem" fontWeight="600">
                      {hoveredSlice.label}
                    </Text>
                  </Flex>
                  <Text fontSize="0.6875rem" opacity={0.9}>
                    {hoveredSlice.value} ({hoveredSlice.percentage}%)
                  </Text>
                </VStack>
              </Box>
            </Portal>
          )}

          {/* Risk Analysis */}
          <AnalysisCard title="Attrition Drivers" hoverBorderColor="purple.200">
            <VStack gap={4} justify="center" align="center" w="full" h="full" position="relative">
              {/* Analysis Donut Chart */}
              <Box
                w="75%"
                h="75%"
                flex="none"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Doughnut 
                  data={analysisDonutData} 
                  options={{
                    ...donutOptions
                  }} 
                />
              </Box>

              {/* Legend for Major Drivers */}
              <SimpleGrid columns={2} gap={2} w="full" px={4}>
                {driversData
                  .filter(item => item.percentage >= 20)
                  .slice(0, 4)
                  .map((item, index) => (
                    <Flex 
                      key={index} 
                      align="center" 
                      gap={2}
                      borderRadius="md"
                      transition="all 0.2s"
                      _hover={{ bg: "gray.50" }}
                    >
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="full"
                        bg={item.color}
                        flexShrink={0}
                        shadow="sm"
                      />
                      <Text 
                        fontSize="0.75rem"
                        fontWeight="500" 
                        color="gray.700"
                        letterSpacing="0.01em"
                        lineClamp={1}
                      >
                        {item.label}
                      </Text>
                    </Flex>
                  ))}
              </SimpleGrid>
            </VStack>
          </AnalysisCard>

          {/* Dialog for Major Drivers */}
          <Dialog.Root open={!!selectedDriver} onOpenChange={(e) => !e.open && setSelectedDriver(null)}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="400px">
                <Dialog.Header>
                  <Dialog.Title fontSize="1rem" fontWeight="700" color="gray.800">
                    {selectedDriver?.label}
                  </Dialog.Title>
                  <Dialog.CloseTrigger />
                </Dialog.Header>
                <Dialog.Body>
                  <VStack align="stretch" gap={3}>
                    <Flex align="center" gap={3}>
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={selectedDriver?.color}
                        flexShrink={0}
                        shadow="md"
                      />
                      <VStack align="start" gap={0.5}>
                        <Text fontSize="0.875rem" fontWeight="600" color="gray.700">
                          Attrition Driver
                        </Text>
                        <Text fontSize="0.75rem" color="gray.500">
                          {selectedDriver?.label}
                        </Text>
                      </VStack>
                    </Flex>
                    
                    <Box p={3} bg="gray.50" borderRadius="md">
                      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                        <VStack align="start" gap={1}>
                          <Text fontSize="0.6875rem" color="gray.500" fontWeight="600" textTransform="uppercase">
                            Count
                          </Text>
                          <Text fontSize="1.25rem" fontWeight="700" color="gray.800">
                            {selectedDriver?.value}
                          </Text>
                        </VStack>
                        <VStack align="start" gap={1}>
                          <Text fontSize="0.6875rem" color="gray.500" fontWeight="600" textTransform="uppercase">
                            Percentage
                          </Text>
                          <Text fontSize="1.25rem" fontWeight="700" color="gray.800">
                            {selectedDriver?.percentage}%
                          </Text>
                        </VStack>
                      </Grid>
                    </Box>

                    <Text fontSize="0.75rem" color="gray.600" lineHeight="1.6">
                      This driver represents {selectedDriver?.percentage}% of the total attrition factors with {selectedDriver?.value} identified cases.
                    </Text>
                  </VStack>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>

          {/* Attrition Trends */}
          <AnalysisCard title="Attrition Trends" hoverBorderColor="orange.200">
            <AttritionTrendsPanel trends={undefined} />
          </AnalysisCard>
        </HStack>
        )}

        {/* Tab 1: Your Attention */}
        {activeTab === 1 && <Tab1Content />}

        {/* Tab 2: Recommendations */}
        {activeTab === 2 && <Tab2Content />}
      </Card.Body>
    </Card.Root>
  );
};
