import React, { useState, useEffect } from 'react';
import { Box, Card, Text, VStack, HStack, Badge, Button, SimpleGrid } from '@chakra-ui/react';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { teamApi, dashboardApi } from '../../services';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import { X, BarChart3, PieChart } from 'lucide-react';

interface TeamCriticalityGraphProps {
  graphData: {
    barData: any;
    doughnutData: any;
  };
  onClose: () => void;
}
interface TeamCriticalityProps {
  onShowGraph: (graphData: any) => void;
}

interface CriticalityData {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export const TeamCriticality: React.FC<TeamCriticalityProps> = ({ onShowGraph }) => {
  const [criticalityData, setCriticalityData] = useState<CriticalityData>({
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<any>(null);

  const fetchCriticalityData = async () => {
    try {
      setLoading(true);
      const teamMembers = await teamApi.getTeamMembers();
      
      // @ts-ignore
      const members = Array.isArray(teamMembers.team_members) ? teamMembers.team_members : [];
      
      const criticalityCounts = members.reduce((acc: any, member: any) => {
        const risk = member.manager_assessment_risk?.toLowerCase() || 'low';
        acc[risk] = (acc[risk] || 0) + 1;
        acc.total = (acc.total || 0) + 1;
        return acc;
      }, { high: 0, medium: 0, low: 0, total: 0 });

      setCriticalityData(criticalityCounts);
      console.log('Criticality data:', criticalityCounts);
      
      // Generate graph data after criticality data is set
      const newGraphData = generateGraphData(criticalityCounts);
      setGraphData(newGraphData);
      console.log('Graph data generated:', newGraphData);
    } catch (error) {
      console.error('Error fetching team criticality data:', error);
      setCriticalityData({ high: 0, medium: 0, low: 0, total: 0 });
      setGraphData(null);
    } finally {
      setLoading(false);
    }
  };

  const getCriticalityPercentage = (count: number) => {
    return criticalityData.total > 0 ? Math.round((count / criticalityData.total) * 100) : 0;
  };

  const generateGraphData = (data: CriticalityData) => {
    const barData = {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [
        {
          label: 'Team Members',
          data: [data.high, data.medium, data.low],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    const doughnutData = {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [
        {
          data: [data.high, data.medium, data.low],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    return { barData, doughnutData };
  };

  useEffect(() => {
    fetchCriticalityData();
  }, []);


  if (loading) {
    return (
      <Box
        w="full"
        h="full"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="2xl"
        shadow="sm"
      >
        <Card.Root
          w="full"
          h="full"
          bg="whiteAlpha.900"
          backdropFilter="blur(10px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
        >
          <Card.Body p={8} display="flex" alignItems="center" justifyContent="center">
            <VStack gap={4}>
              <Box
                w="12"
                h="12"
                borderRadius="full"
                border="4px solid"
                borderColor="purple.500"
                borderTopColor="transparent"
                animation="spin 1s linear infinite"
              />
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Loading team criticality analytics...
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: false,
        // text: 'Team Risk Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
            weight: 'normal' as const,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: false,
        // text: 'Risk Level Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      duration: 1200,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <Box 
      w="full" 
      h="100vh" 
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      overflow="hidden"
    >
      <Card.Root
        w="full"
        h="full"
        bg="transparent"
        borderRadius="0"
        shadow="none"
        border="none"
        onClick={(e) => e.stopPropagation()}
        overflow="visible"
      >
        {/* Header Section */}
        <Box 
          bg="linear-gradient(135deg, #4d3384 0%, #9557d1 100%)"
          p={{ base: 4, md: 6, lg: 8 }}
          pb={{ base: 8, md: 10, lg: 12 }}
          position="relative"
          overflow="hidden"
        >
          {/* Background decoration */}
          <Box 
            position="absolute" 
            top="-20" 
            right="-20" 
            w="40" 
            h="40" 
            bg="whiteAlpha.200" 
            borderRadius="full" 
          />
          <Box 
            position="absolute" 
            bottom="-10" 
            left="-10" 
            w="32" 
            h="32" 
            bg="whiteAlpha.100" 
            borderRadius="full" 
          />
          
          <Box maxW="6xl" mx="auto" position="relative">
            <Card.Root
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="2xl"
              border="1px solid"
              borderColor="whiteAlpha.300"
              shadow="sm"
              p={{ base: 1, md: 2 }}
            >
              <Card.Body>
                <HStack gap={{ base: 2, md: 3 }} align="center">
                  <Box 
                    p={{ base: 1.5, md: 2 }} 
                    bg="whiteAlpha.200" 
                    borderRadius="xl"
                    backdropFilter="blur(10px)"
                  >
                    <AlertTriangle size={24} color="white" />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="black" letterSpacing="tight" color="white">
                      Team Criticality Analytics
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="whiteAlpha.900" fontWeight="medium" display={{ base: "none", md: "block" }}>
                      Comprehensive risk analysis and distribution insights
                    </Text>
                  </VStack>
                </HStack>
              </Card.Body>
            </Card.Root>
          </Box>
        </Box>

        {/* Content Section */}
        <Box w="full" mx="auto" p={{ base: 4, md: 6 }} position="relative" flex="1" overflow="hidden">
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 4, md: 6 }} h="fit-content">
            {/* Bar Chart */}
            <Card.Root 
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              shadow="sm"
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.3s ease"
              overflow="hidden"
            >
              <Card.Header 
                p={{ base: 3, md: 4 }} 
                bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                color="white"
              >
                <HStack gap={{ base: 2, md: 3 }}>
                  <Box 
                    p={{ base: 1.5, md: 2 }} 
                    bg="whiteAlpha.200" 
                    borderRadius="lg"
                    backdropFilter="blur(10px)"
                  >
                    <BarChart3 size={20} />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="black" letterSpacing="tight">
                      Risk Level Breakdown
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="whiteAlpha.900" display={{ base: "none", md: "block" }}>
                      Individual risk category analysis
                    </Text>
                  </VStack>
                </HStack>
              </Card.Header>
              <Card.Body p={{ base: 3, md: 4 }} pt={2}>
                <Box w="full" h={{ base: "240px", md: "280px" }} bg="white" borderRadius="xl" p={{ base: 2, md: 4 }}>
                  {graphData ? (
                    <Bar data={graphData.barData} options={chartOptions} />
                  ) : (
                    <VStack justify="center" h="full">
                      <Box
                        w="8"
                        h="8"
                        borderRadius="full"
                        border="3px solid"
                        borderColor="blue.500"
                        borderTopColor="transparent"
                        animation="spin 1s linear infinite"
                      />
                      <Text fontSize="sm" color="gray.500">Loading chart data...</Text>
                    </VStack>
                  )}
                </Box>
              </Card.Body>
            </Card.Root>

            {/* Doughnut Chart */}
            <Card.Root 
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              shadow="sm"
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.3s ease"
              overflow="hidden"
            >
              <Card.Header 
                p={{ base: 3, md: 4 }} 
                bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                color="white"
              >
                <HStack gap={{ base: 2, md: 3 }}>
                  <Box 
                    p={{ base: 1.5, md: 2 }} 
                    bg="whiteAlpha.200" 
                    borderRadius="lg"
                    backdropFilter="blur(10px)"
                  >
                    <PieChart size={20} />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="black" letterSpacing="tight">
                      Risk Distribution
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="whiteAlpha.900" display={{ base: "none", md: "block" }}>
                      Proportional risk overview
                    </Text>
                  </VStack>
                </HStack>
              </Card.Header>
              <Card.Body p={{ base: 3, md: 6 }} pt={2}>
                <Box w="full" h={{ base: "240px", md: "280px" }} bg="white" borderRadius="xl" p={{ base: 2, md: 4 }} display="flex" alignItems="center" justifyContent="center">
                  {graphData ? (
                    <Box w={{ base: "200px", md: "240px" }} h={{ base: "200px", md: "240px" }}>
                      <Doughnut data={graphData.doughnutData} options={doughnutOptions} />
                    </Box>
                  ) : (
                    <VStack justify="center">
                      <Box
                        w="8"
                        h="8"
                        borderRadius="full"
                        border="3px solid"
                        borderColor="purple.500"
                        borderTopColor="transparent"
                        animation="spin 1s linear infinite"
                      />
                      <Text fontSize="sm" color="gray.500">Loading chart data...</Text>
                    </VStack>
                  )}
                </Box>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Summary Statistics */}
          <Box mt={{ base: 4, md: 6 }}>
            <Card.Root 
              bg="white"
              borderRadius="2xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.3s ease"
              overflow="hidden"
            >
              <Card.Header 
                p={{ base: 3, md: 4 }}
                bg="linear-gradient(135deg, #4d3384 0%, #9557d1 100%)"
                color="white"
              >
                <HStack gap={{ base: 2, md: 3 }}>
                  <Box 
                    p={{ base: 1.5, md: 2 }} 
                    bg="whiteAlpha.200" 
                    borderRadius="lg"
                    backdropFilter="blur(10px)"
                  >
                    <TrendingUp size={20} />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="black" letterSpacing="tight">
                      Key Insights
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="whiteAlpha.900" display={{ base: "none", md: "block" }}>
                      Critical team risk metrics at a glance
                    </Text>
                  </VStack>
                </HStack>
              </Card.Header>
              <Card.Body p={{ base: 2, md: 3 }}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 2, md: 3 }}>
                  <Card.Root 
                    bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                    borderRadius="xl"
                    shadow="sm"
                    _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                    transition="all 0.3s ease"
                  >
                    <Card.Body p={{ base: 3, md: 4 }} textAlign="center">
                      <VStack gap={1}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="black" color="white" lineHeight="1">
                          {criticalityData.high}
                        </Text>
                        <Text fontSize={{ base: "2xs", md: "xs" }} color="whiteAlpha.900" fontWeight="semibold" letterSpacing="wide">
                          HIGH RISK MEMBERS
                        </Text>
                        <Text fontSize={{ base: "3xs", md: "2xs" }} color="whiteAlpha.700">
                          {getCriticalityPercentage(criticalityData.high)}% of team
                        </Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                  
                  <Card.Root 
                    bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    borderRadius="xl"
                    shadow="sm"
                    _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                    transition="all 0.3s ease"
                  >
                    <Card.Body p={{ base: 3, md: 4 }} textAlign="center">
                      <VStack gap={1}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="black" color="white" lineHeight="1">
                          {criticalityData.medium}
                        </Text>
                        <Text fontSize={{ base: "2xs", md: "xs" }} color="whiteAlpha.900" fontWeight="semibold" letterSpacing="wide">
                          MEDIUM RISK MEMBERS
                        </Text>
                        <Text fontSize={{ base: "3xs", md: "2xs" }} color="whiteAlpha.700">
                          {getCriticalityPercentage(criticalityData.medium)}% of team
                        </Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                  
                  <Card.Root 
                    bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    borderRadius="xl"
                    shadow="sm"
                    _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                    transition="all 0.3s ease"
                  >
                    <Card.Body p={{ base: 3, md: 4 }} textAlign="center">
                      <VStack gap={1}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="black" color="white" lineHeight="1">
                          {criticalityData.low}
                        </Text>
                        <Text fontSize={{ base: "2xs", md: "xs" }} color="whiteAlpha.900" fontWeight="semibold" letterSpacing="wide">
                          LOW RISK MEMBERS
                        </Text>
                        <Text fontSize={{ base: "3xs", md: "2xs" }} color="whiteAlpha.700">
                          {getCriticalityPercentage(criticalityData.low)}% of team
                        </Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>
          </Box>
        </Box>
      </Card.Root>
    </Box>
  );
};

export default TeamCriticality;
