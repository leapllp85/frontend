import React, { useState, useEffect } from 'react';
import { 
  Card, 
  VStack, 
  Box, 
  Heading,
  Spinner,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { criticalityApi, CriticalityMetrics as CriticalityMetricsType, CriticalityTrend } from '../../../services';
import { RiskLevel } from '../../../services';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CriticalityMetricsProps {
  userId?: string;
}

export const CriticalityMetrics: React.FC<CriticalityMetricsProps> = ({ userId }) => {
  const [metrics, setMetrics] = useState<CriticalityMetricsType | null>(null);
  // const [trends, setTrends] = useState<CriticalityTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCriticalityData();
  }, [userId]);

  const fetchCriticalityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // const [metricsData, trendsData] = await Promise.all([
      //   criticalityApi.getCriticalityMetrics(),
      //   criticalityApi.getCriticalityTrends(30)
      // ]);
      const metricsData = await criticalityApi.getCriticalityMetrics();
      // const trendsData = await criticalityApi.getCriticalityTrends(30);
      
      setMetrics(metricsData);
      // setTrends(trendsData);
    } catch (err) {
      console.error('Error fetching criticality data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load criticality data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskScore = (riskLevel: RiskLevel | undefined) => {
    switch (riskLevel) {
      case 'High':
        return 100;
      case 'Medium':
        return 50;
      case 'Low':
        return 25;
      default:
        return 0;
    }
  }

  // Responsive labels based on screen size
  const useShortLabels = useBreakpointValue({ base: true, md: true, lg: true, xl: true, '2xl': false });
  
  const fullLabels = ['Mental Health', 'Attrition Risk', 'Projects at Risk', 'Avg Utilization'];
  const shortLabels = ['MH', 'AR', 'PAR', 'AU'];
  
  const barData = {
    labels: useShortLabels ? shortLabels : fullLabels,
    datasets: [
      {
        label: 'Criticality Metrics',
        data: [
          getRiskScore(metrics?.mental_health_risk) || 0,
          getRiskScore(metrics?.attrition_risk) || 0,
          metrics?.projects_at_risk || 0,
          metrics?.avg_utilization || 0,
        ],
        backgroundColor: ['#68D391', '#F56565', '#4299E1', '#ED8936'],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            // Show full label in tooltip when using short labels
            if (useShortLabels) {
              const index = context[0]?.dataIndex;
              return fullLabels[index] || context[0]?.label;
            }
            return context[0]?.label;
          },
          label: (context: any) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
      },
      x: {
        ticks: {
          maxRotation: useShortLabels ? 0 : 45,
          minRotation: 0,
        },
      },
    },
  };

  // const lineData = {
  //   labels: trends.map(trend => new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
  //   datasets: [
  //     {
  //       label: 'Overall Score',
  //       data: trends.map(trend => trend.overall_score),
  //       borderColor: '#667eea',
  //       backgroundColor: 'rgba(102, 126, 234, 0.1)',
  //       tension: 0.4,
  //     },
  //     {
  //       label: 'Mental Health',
  //       data: trends.map(trend => trend.mental_health),
  //       borderColor: '#f56565',
  //       backgroundColor: 'rgba(245, 101, 101, 0.1)',
  //       tension: 0.4,
  //     },
  //     {
  //       label: 'Utilization',
  //       data: trends.map(trend => trend.utilization),
  //       borderColor: '#48bb78',
  //       backgroundColor: 'rgba(72, 187, 120, 0.1)',
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const lineOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: 'bottom' as const },
  //   },
  //   scales: {
  //     y: { beginAtZero: true, max: 100 },
  //   },
  // };

  if (loading) {
    return (
      <Card.Root bg="white" shadow="lg" border="1px solid" borderColor="gray.200">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.800">Criticality Metrics</Heading>
        </Card.Header>
        <Card.Body p={4}>
          <VStack gap={4} align="center" justify="center" minH="300px">
            <Spinner size="lg" color="purple.500" />
            <Text color="gray.500">Loading metrics...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root bg="white" shadow="lg" border="1px solid" borderColor="gray.200">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.800">Criticality Metrics</Heading>
        </Card.Header>
        <Card.Body p={4}>
          <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
            <Text fontSize="sm" fontWeight="semibold" color="red.800">
              Error loading metrics
            </Text>
            <Text fontSize="sm" color="red.600">
              {error}
            </Text>
          </Box>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root bg="white" shadow="lg" border="1px solid" borderColor="gray.200">
      <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
        <Heading size="md" color="gray.800">Criticality Metrics</Heading>
      </Card.Header>
      <Card.Body p={4} h="full" display="flex" flexDirection="column">
        <VStack gap={6} h="full" flex="1">
          {/* Bar Chart */}
          <Box w="full" flex="1" minH="200px">
            <Bar data={barData} options={barOptions} />
          </Box>

          {/* Trends Chart */}
          {/* {trends.length > 0 && (
            <Box w="full">
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                30-Day Trends
              </Text>
              <Box w="full" h="200px">
                <Line data={lineData} options={lineOptions} />
              </Box>
            </Box>
          )} */}

          {/* Last Updated */}
          {/* {metrics?.last_updated && (
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Last updated: {new Date(metrics.last_updated).toLocaleString()}
            </Text>
          )} */}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
