import React from 'react';
import { Box, Card, Text, VStack, HStack, Badge, Heading } from '@chakra-ui/react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ComponentConfig, DatasetResult } from '../../types/ragApi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DataVisualizationProps {
  config: ComponentConfig;
  dataset: DatasetResult[];
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ config, dataset }) => {
  const primaryData = dataset[0];

  if (!primaryData || !primaryData.data || primaryData.data.length === 0) {
    return (
      <Card.Root bg="red.50" borderColor="red.200" borderWidth="1px">
        <Card.Body p={6}>
          <Text color="red.600">No data available for visualization</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  const renderChart = () => {
    const { type, properties } = config;
    const { x_axis, y_axis, aggregation } = properties;

    // Prepare chart data
    const labels = primaryData.data.map(row => row[x_axis || primaryData.columns[0]]);
    const values = primaryData.data.map(row => {
      const value = row[y_axis || primaryData.columns[1]];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: config.title,
          data: values,
          backgroundColor: type.includes('bar') 
            ? 'rgba(59, 130, 246, 0.8)'
            : type.includes('line')
            ? 'rgba(59, 130, 246, 0.2)'
            : [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)',
              ],
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          fill: type.includes('line') ? true : false,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: 'black'
          }
        },
        title: {
          display: true,
          text: config.title,
          color: 'black'
        },
      },
      scales: type.includes('pie') ? {} : {
        x: {
          ticks: {
            color: 'black'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: 'black'
          }
        },
      },
    };

    switch (type) {
      case 'bar_chart':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line_chart':
        return <Line data={chartData} options={chartOptions} />;
      case 'pie_chart':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <Card.Root bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="xl" shadow="lg">
      <Card.Header p={6} pb={4}>
        <VStack align="start" gap={2}>
          <HStack justify="space-between" w="full">
            <Heading size="lg" color="black">
              {config.title}
            </Heading>
            <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
              {config.type.replace('_', ' ').toUpperCase()}
            </Badge>
          </HStack>
          {config.description && (
            <Text color="black" fontSize="sm">
              {config.description}
            </Text>
          )}
        </VStack>
      </Card.Header>
      <Card.Body p={6} pt={0}>
        <Box h="400px" w="full">
          {renderChart()}
        </Box>
        <Box mt={4} p={4} bg="white" border="1px solid" borderColor="gray.100" borderRadius="lg">
          <Text fontSize="sm" color="black">
            <strong>Data Points:</strong> {primaryData.row_count} | 
            <strong> Source:</strong> {primaryData.description}
          </Text>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
