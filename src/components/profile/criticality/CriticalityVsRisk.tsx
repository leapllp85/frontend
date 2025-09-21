import React, { useState, useEffect } from 'react';
import { 
  Card, 
  VStack, 
  HStack, 
  Text, 
  Box, 
  Heading,
  Spinner,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { Scatter, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { criticalityApi, CriticalityVsRiskData, RiskDistribution } from '../../../services';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CriticalityVsRiskProps {
  userId?: string;
}

export const CriticalityVsRisk: React.FC<CriticalityVsRiskProps> = ({ userId }) => {
  const [riskData, setRiskData] = useState<CriticalityVsRiskData | null>(null);
  const [distribution, setDistribution] = useState<RiskDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRiskData();
  }, [userId]);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // const [riskAnalysis, riskDistribution] = await Promise.all([
      //   criticalityApi.getCriticalityVsRisk(),
      //   criticalityApi.getRiskDistribution()
      // ]);
      const riskAnalysis= await criticalityApi.getCriticalityVsRisk();
      
      setRiskData(riskAnalysis);
      // setDistribution(riskDistribution);
    } catch (err) {
      console.error('Error fetching risk data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load risk analysis');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert categorical values to numerical
  const convertToNumeric = (value: string): number => {
    switch (value.toLowerCase()) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 2;
    }
  };

  // Helper function to determine risk level color and group data
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return {
          backgroundColor: 'rgba(245, 101, 101, 0.8)',
          borderColor: '#f56565'
        };
      case 'medium':
        return {
          backgroundColor: 'rgba(237, 137, 54, 0.8)',
          borderColor: '#ed8936'
        };
      case 'low':
        return {
          backgroundColor: 'rgba(72, 187, 120, 0.8)',
          borderColor: '#48bb78'
        };
      default:
        return {
          backgroundColor: 'rgba(237, 137, 54, 0.8)',
          borderColor: '#ed8936'
        };
    }
  };

  // Group scatter data by risk level and count occurrences at same position
  const groupedScatterData = React.useMemo(() => {
    if (!riskData?.scatter_data) return { high: [], medium: [], low: [] };

    // First, group by position to count overlapping points
    const positionCounts = new Map();
    
    riskData.scatter_data.forEach(data => {
      const key = `${data.criticality}-${data.risk}`;
      if (!positionCounts.has(key)) {
        positionCounts.set(key, {
          x: convertToNumeric(data.criticality),
          y: convertToNumeric(data.risk),
          originalCriticality: data.criticality,
          originalRisk: data.risk,
          employees: [],
          risk: data.risk
        });
      }
      positionCounts.get(key).employees.push(data.employee_name);
    });

    // Now create datasets with bubble sizes based on count
    const result = { high: [] as any[], medium: [] as any[], low: [] as any[] };
    
    positionCounts.forEach((position) => {
      const count = position.employees.length;
      const bubbleSize = Math.max(8, Math.min(20, 8 + (count - 1) * 4)); // Base size 8, grows by 4 for each additional employee, max 20
      
      const point = {
        x: position.x,
        y: position.y,
        label: count === 1 ? position.employees[0] : `${count} employees: ${position.employees.join(', ')}`,
        originalCriticality: position.originalCriticality,
        originalRisk: position.originalRisk,
        count: count,
        employees: position.employees,
        r: bubbleSize // This sets the bubble size
      };

      switch (position.risk.toLowerCase()) {
        case 'high':
          result.high.push(point);
          break;
        case 'medium':
          result.medium.push(point);
          break;
        case 'low':
          result.low.push(point);
          break;
        default:
          result.medium.push(point);
      }
    });

    return result;
  }, [riskData]);

  // Scatter plot data for criticality vs risk
  const scatterData = {
    datasets: [
      {
        label: 'High Risk',
        data: groupedScatterData.high,
        backgroundColor: 'rgba(245, 101, 101, 0.8)',
        borderColor: '#f56565',
        pointRadius: (context: any) => context.raw?.r || 8,
        pointHoverRadius: (context: any) => (context.raw?.r || 8) + 2,
      },
      {
        label: 'Medium Risk',
        data: groupedScatterData.medium,
        backgroundColor: 'rgba(237, 137, 54, 0.8)',
        borderColor: '#ed8936',
        pointRadius: (context: any) => context.raw?.r || 8,
        pointHoverRadius: (context: any) => (context.raw?.r || 8) + 2,
      },
      {
        label: 'Low Risk',
        data: groupedScatterData.low,
        backgroundColor: 'rgba(72, 187, 120, 0.8)',
        borderColor: '#48bb78',
        pointRadius: (context: any) => context.raw?.r || 8,
        pointHoverRadius: (context: any) => (context.raw?.r || 8) + 2,
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Hide Chart.js legend since we're using custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const point = context.raw;
            if (point.count === 1) {
              return `${point.label}: ${point.originalCriticality} Criticality, ${point.originalRisk} Risk`;
            } else {
              return [
                `${point.count} employees at ${point.originalCriticality} Criticality, ${point.originalRisk} Risk:`,
                ...point.employees.map((name: string) => `• ${name}`)
              ];
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Criticality Level',
          font: {
            size: 12,
          },
        },
        min: 0.5,
        max: 3.5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            switch (value) {
              case 1: return 'Low';
              case 2: return 'Medium';
              case 3: return 'High';
              default: return '';
            }
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Risk Level',
          font: {
            size: 12,
          },
        },
        min: 0.5,
        max: 3.5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            switch (value) {
              case 1: return 'Low';
              case 2: return 'Medium';
              case 3: return 'High';
              default: return '';
            }
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Bar chart for risk distribution
  // const barData = {
  //   labels: ['Mental Health', 'Motivation', 'Career Opportunities', 'Personal Factors'],
  //   datasets: [
  //     {
  //       label: 'High Risk',
  //       data: distribution ? [
  //         distribution.mental_health.high,
  //         distribution.motivation.high,
  //         distribution.career_opportunities.high,
  //         distribution.personal_factors.high
  //       ] : [0, 0, 0, 0],
  //       backgroundColor: 'rgba(245, 101, 101, 0.8)',
  //       borderColor: '#f56565',
  //       borderWidth: 1,
  //     },
  //     {
  //       label: 'Medium Risk',
  //       data: distribution ? [
  //         distribution.mental_health.medium,
  //         distribution.motivation.medium,
  //         distribution.career_opportunities.medium,
  //         distribution.personal_factors.medium
  //       ] : [0, 0, 0, 0],
  //       backgroundColor: 'rgba(237, 137, 54, 0.8)',
  //       borderColor: '#ed8936',
  //       borderWidth: 1,
  //     },
  //     {
  //       label: 'Low Risk',
  //       data: distribution ? [
  //         distribution.mental_health.low,
  //         distribution.motivation.low,
  //         distribution.career_opportunities.low,
  //         distribution.personal_factors.low
  //       ] : [0, 0, 0, 0],
  //       backgroundColor: 'rgba(72, 187, 120, 0.8)',
  //       borderColor: '#48bb78',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide Chart.js legend since we're using custom legend
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  if (loading) {
    return (
      <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.800">Criticality Vs Risk</Heading>
        </Card.Header>
        <Card.Body p={4}>
          <VStack gap={4} align="center" justify="center" minH="300px">
            <Spinner size="lg" color="purple.500" />
            <Text color="gray.500">Loading risk analysis...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
        <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
          <Heading size="md" color="gray.800">Criticality Vs Risk</Heading>
        </Card.Header>
        <Card.Body p={4}>
          <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
            <VStack gap={2} align="start">
              <Text fontSize="sm" fontWeight="semibold" color="red.800">
                Error loading risk analysis
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

  return (
    <Card.Root bg="white" shadow="sm" borderRadius="xl" h="full" display="flex" flexDirection="column">
      <Card.Header p={3} borderBottom="1px solid" borderColor="gray.100">
        <Heading size="md" color="gray.800">Criticality Vs Attrition Risk</Heading>
      </Card.Header>
      <Card.Body p={3} flex="1" minH="0">
      <Scatter data={scatterData} options={scatterOptions} />
      </Card.Body>
    </Card.Root>
  );
};