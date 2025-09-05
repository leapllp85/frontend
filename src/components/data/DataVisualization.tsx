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

  console.log('DataVisualization - primaryData:', primaryData);
  console.log('DataVisualization - dataset:', dataset);
  
  if (!primaryData || !primaryData.data || primaryData.data.length === 0) {
    return (
      <Card.Root bg="gray.50" borderColor="gray.200" borderWidth="1px">
        <Card.Body p={6}>
          <VStack gap={2} align="center" justify="center" minH="200px">
            <Text color="gray.500" fontSize="lg" fontWeight="medium">No data available</Text>
            <Text color="gray.400" fontSize="sm">
              {primaryData ? `Dataset has ${primaryData.data?.length || 0} rows` : 'No dataset provided'}
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'black'
        }
      },
      x: {
        ticks: {
          color: 'black'
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'black',
          padding: 20
        }
      },
      title: {
        display: true,
        text: config.title,
        color: 'black'
      },
    }
  };

  const renderChart = () => {
    const { type, properties } = config;
    const { data_field, aggregation, colors, x_axis, y_axis } = properties;

    // For pie charts, we need to aggregate data by the specified field
    if (type.includes('pie')) {
      const fieldToAggregate = data_field || 'mental_health';
      
      // Count occurrences of each value in the field
      const aggregatedData: Record<string, number> = {};
      primaryData.data.forEach(row => {
        const value = row[fieldToAggregate];
        if (value) {
          aggregatedData[value] = (aggregatedData[value] || 0) + 1;
        }
      });

      const labels = Object.keys(aggregatedData);
      const values = Object.values(aggregatedData);
      
      // Use colors from properties if available
      const backgroundColors = labels.map(label => 
        colors?.[label] || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`
      );

      const pieChartData = {
        labels,
        datasets: [{
          label: config.title,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        }],
      };

      return <Pie data={pieChartData} options={pieChartOptions} />;
    }

    // For other chart types, use original logic
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
          backgroundColor: config.type.includes('bar') 
            ? 'rgba(59, 130, 246, 0.8)'
            : config.type.includes('line')
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
          fill: config.type.includes('line') ? true : false,
        },
      ],
    };

    // Chart rendering logic
    if (config.type.includes('line')) {
      return <Line data={chartData} options={chartOptions} />;
    } else {
      return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <Box w="full" h="full" p={4}>
      <VStack align="start" gap={3} w="full" h="full">
        <Box w="full" pb={3} borderBottom="1px solid" borderColor="gray.200">
          <HStack justify="space-between" w="full">
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="gray.800">
                {config.title}
              </Text>
              {config.description && (
                <Text fontSize="xs" color="gray.600" mt={1}>
                  {config.description}
                </Text>
              )}
            </Box>
            <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
              CHART
            </Badge>
          </HStack>
        </Box>
        
        <Box h="300px" w="full">
          {renderChart()}
        </Box>
        
        <Box w="full" p={3} bg="gray.50" borderRadius="lg">
          <Text fontSize="xs" color="gray.700">
            <strong>Data Points:</strong> {primaryData.row_count} | 
            <strong> Source:</strong> {primaryData.description}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
