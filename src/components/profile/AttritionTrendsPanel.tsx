'use client';

import React from "react";
import { Box, Text, HStack, VStack, Card, Heading } from "@chakra-ui/react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AttritionTrend {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info';
}

interface AttritionData {
  id: number;
  year: number;
  month: number;
  high: number;
  medium: number;
  low: number;
  manager: number;
}

interface AttritionTrendsPanelProps {
  trends?: AttritionTrend[];
  data?: AttritionData[];
}

const defaultTrends: AttritionTrend[] = [
  {
    id: '1',
    title: 'High Attrition Risk',
    description: '5 team members show high risk of attrition',
    timestamp: '10 min ago',
    type: 'error'
  },
  {
    id: '2',
    title: 'Project Deadline',
    description: 'Project Alpha milestone due in 3 days',
    timestamp: '2 hours ago',
    type: 'warning'
  },
  {
    id: '3',
    title: 'New Team Member',
    description: 'Alex Johnson has joined Project Beta',
    timestamp: '1 day ago',
    type: 'info'
  }
];

const getTrendColor = (type: AttritionTrend['type']) => {
  switch (type) {
    case 'error': return 'red.500';
    case 'warning': return 'yellow.600';
    case 'info': return 'blue.500';
    default: return 'gray.500';
  }
};

export const AttritionTrendsPanel: React.FC<AttritionTrendsPanelProps> = ({
  trends = defaultTrends,
  data
}) => {
  // Show only the first 3 trends
  const topTrends = trends.slice(0, 3);

  // Default data if none provided
  const defaultData: AttritionData[] = [
    {
      id: 1,
      year: 2025,
      month: 6,
      high: 280,
      medium: 320,
      low: 290,
      manager: 1
    },
    {
      id: 2,
      year: 2025,
      month: 7,
      high: 295,
      medium: 335,
      low: 305,
      manager: 1
    },
    {
      id: 3,
      year: 2025,
      month: 8,
      high: 310,
      medium: 350,
      low: 295,
      manager: 1
    },
    {
      id: 4,
      year: 2025,
      month: 9,
      high: 318,
      medium: 360,
      low: 302,
      manager: 1
    },
    {
      id: 5,
      year: 2025,
      month: 10,
      high: 326,
      medium: 368,
      low: 310,
      manager: 1
    },
    {
      id: 6,
      year: 2025,
      month: 11,
      high: 340,
      medium: 375,
      low: 315,
      manager: 1
    }
  ];

  const attritionData = data || defaultData;

  // Prepare chart data
  const chartData = {
    labels: attritionData.map(item => `${item.year}-${String(item.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'High Attrition Risk',
        data: attritionData.map(item => item.high),
        borderColor: '#FF4757',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: '#FF4757',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 3,
        fill: false,
        tension: 0.5,
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'transparent',
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          font: {
            size: 11,
            weight: 'bold' as const
          },
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#4A5568'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FF4757',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return `Month: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} employees`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        },
        ticks: {
          color: '#4A5568',
          font: {
            size: 11,
            weight: 'normal' as const
          },
          padding: 8
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        min: 250,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        },
        ticks: {
          color: '#4A5568',
          font: {
            size: 11,
            weight: 'normal' as const
          },
          padding: 8
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#FFFFFF',
        hoverBorderWidth: 4
      },
      line: {
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutCubic' as const
    },
    interaction: {
      intersect: false,
      mode: 'nearest' as const
    },
    hover: {
      mode: 'nearest' as const,
      intersect: false
    }
  };

  return (
    <Card.Root 
      bg="#e6fffa" 
      shadow="sm" 
      borderRadius="2xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
      maxH="320px"
      minH="280px"
      _hover={{ 
        transform: "translateY(-2px)", 
        shadow: "md",
        transition: "all 0.1s ease"
      }}
      transition="all 0.2s ease"
    >
      <Card.Header p={3} pb={0} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between" align="center">
          <Heading size="sm" color="gray.800" textAlign="center">High Attrition Risk Trends</Heading>
          <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
        </HStack>
      </Card.Header>
      
      <Card.Body p={4} flex="1" display="flex" flexDirection="column">
        {/* Line Chart Only */}
        <Box w="full" h="full" flex="1">
         
          <Box 
            w="full" 
            h="full" 
            bg="transparent" 
            borderRadius="xl" 
            p={6}
            position="relative"
          >
            <Line data={chartData} options={chartOptions} />
          </Box>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
