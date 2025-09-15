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
      // Attach realistic avatar URL for this employee using randomuser.me
      function hashString(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
      }
      const hash = hashString(data.employee_name);
      const gender = hash % 2 === 0 ? 'men' : 'women';
      const idx = (hash % 99) + 1; // randomuser.me supports 1-99
      const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${idx}.jpg`;
      positionCounts.get(key).employees.push({ name: data.employee_name, image: avatarUrl });
    });

    // Now create datasets with bubble sizes based on count
    const result = { high: [] as any[], medium: [] as any[], low: [] as any[] };
    
    positionCounts.forEach((position) => {
      const count = position.employees.length;
      const bubbleSize = Math.max(8, Math.min(20, 8 + (count - 1) * 4)); // Base size 8, grows by 4 for each additional employee, max 20
      
      // For quadrant chart, create a point for each employee with unique image
      const points = position.employees.map((emp: any) => ({
        x: position.x,
        y: position.y,
        label: emp.name,
        image: emp.image,
        originalCriticality: position.originalCriticality,
        originalRisk: position.originalRisk,
        count: 1,
        employees: [emp.name],
        r: bubbleSize
      }));
      switch (position.risk.toLowerCase()) {
        case 'high':
          result.high.push(...points);
          break;
        case 'medium':
          result.medium.push(...points);
          break;
        case 'low':
          result.low.push(...points);
          break;
        default:
          result.medium.push(...points);
      }

    });

    return result;
  }, [riskData]);

  // Scatter plot data for criticality vs risk
  const scatterData = {
    datasets: [
      {
        label: 'High Risk',
        data: groupedScatterData.high || [],
        backgroundColor: 'rgba(245, 101, 101, 0.8)',
        borderColor: '#f56565',
        pointRadius: (context: any) => context.raw?.r || 8,
        pointHoverRadius: (context: any) => (context.raw?.r || 8) + 2,
      },
      {
        label: 'Medium Risk',
        data: groupedScatterData.medium || [],
        backgroundColor: 'rgba(237, 137, 54, 0.8)',
        borderColor: '#ed8936',
        pointRadius: (context: any) => context.raw?.r || 8,
        pointHoverRadius: (context: any) => (context.raw?.r || 8) + 2,
      },
      {
        label: 'Low Risk',
        data: groupedScatterData.low || [],
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
            const user = context.raw;
            return `${user.label}: ${user.originalCriticality} Criticality, ${user.originalRisk} Risk`;
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

  // Grouped Bar Chart Data: Criticality vs Attrition Risk
  const barData = React.useMemo(() => {
    // Initialize count matrix
    const criticalityLevels = ['Low', 'Medium', 'High'];
    const riskLevels = ['Low', 'Medium', 'High'];
    const counts: Record<string, Record<string, number>> = {};
    criticalityLevels.forEach(c => {
      counts[c] = {};
      riskLevels.forEach(r => {
        counts[c][r] = 0;
      });
    });

    if (riskData?.scatter_data) {
      riskData.scatter_data.forEach(item => {
        const crit = item.criticality.charAt(0).toUpperCase() + item.criticality.slice(1).toLowerCase();
        const risk = item.risk.charAt(0).toUpperCase() + item.risk.slice(1).toLowerCase();
        if (counts[crit] && counts[crit][risk] !== undefined) {
          counts[crit][risk] += 1;
        }
      });
    }

    return {
      labels: criticalityLevels,
      datasets: [
        {
          label: 'Low Risk',
          data: criticalityLevels.map(c => counts[c]['Low']),
          backgroundColor: 'rgba(72, 187, 120, 0.8)',
        },
        {
          label: 'Medium Risk',
          data: criticalityLevels.map(c => counts[c]['Medium']),
          backgroundColor: 'rgba(237, 137, 54, 0.8)',
        },
        {
          label: 'High Risk',
          data: criticalityLevels.map(c => counts[c]['High']),
          backgroundColor: 'rgba(245, 101, 101, 0.8)',
        },
      ],
    };
  }, [riskData]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 18,
          boxHeight: 18,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold',
            family: 'inherit',
          },
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#333',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value: number) => (value > 0 ? value : ''),
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const val = context.parsed.y;
            return `${label}: ${val}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 15,
            weight: 'bold',
          },
          color: '#6b7280',
        },
        stacked: false,
        categoryPercentage: 0.6,
        barPercentage: 0.7,
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.07)',
        },
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
          },
          color: '#9ca3af',
          stepSize: 1,
        },
        stacked: false,
        border: {
          display: false
        }
      },
    },
    elements: {
      bar: {
        borderRadius: 12,
        borderSkipped: false,
      },
    },
  };


  if (loading) {
    return (
      <Card.Root bg="white" shadow="lg" border="1px solid" borderColor="gray.200">
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
      <Card.Root bg="white" shadow="lg" border="1px solid" borderColor="gray.200">
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
    <Card.Root bg="white" shadow="lg" borderRadius="xl" h="full" display="flex" flexDirection="column">
      <Card.Header p={3} borderBottom="1px solid" borderColor="gray.100">
        <Heading size="md" color="gray.800">Criticality Vs Attrition Risk</Heading>
      </Card.Header>
      <Card.Body p={3} flex="1" minH="0">
      {/* Quadrant Scatter Chart with User Images */}
      <Scatter
        data={scatterData}
        options={scatterOptions}
        plugins={[{
          id: 'userImagePlugin',
          afterDatasetsDraw: (chart: any) => {
            const { ctx, data, chartArea, scales } = chart;
            if (!chartArea) return;
            data.datasets.forEach((dataset: any, datasetIndex: number) => {
              dataset.data.forEach((point: any, i: number) => {
                const meta = chart.getDatasetMeta(datasetIndex).data[i];
                if (!meta) return;
                const x = meta.x;
                const y = meta.y;
                const img = new window.Image();
                img.src = point.image || '/avatar.png';
                ctx.save();
                const radius = 24; // Increased from 18
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
                ctx.restore();

              });
            });
          }
        }]}
      />
      </Card.Body>
    </Card.Root>
  );
};