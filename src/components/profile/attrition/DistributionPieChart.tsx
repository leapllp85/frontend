'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Flex } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DistributionDataItem {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface DistributionPieChartProps {
  data: DistributionDataItem[];
  title?: string;
}

export const DistributionPieChart: React.FC<DistributionPieChartProps> = ({
  data,
  title = 'Distribution'
}) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderWidth: 0,
        cutout: '60%'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const item = data[context.dataIndex];
            return `${item.label}: ${item.percentage}%`;
          }
        }
      }
    }
  };

  return (
    <VStack align="stretch" gap={3} h="full">
      <HStack gap={1.5}>
        <Box w="2px" h="2px" borderRadius="full" bg="blue.600" />
        <Heading size="xs" color="gray.800" fontWeight="600">
          {title}
        </Heading>
      </HStack>

      <Flex justify="center" align="center" flex="1" position="relative">
        <Box w="140px" h="140px">
          <Doughnut data={chartData} options={chartOptions} />
        </Box>
      </Flex>

      <VStack align="stretch" gap={1.5}>
        {data.map((item, idx) => (
          <HStack key={idx} justify="space-between">
            <HStack gap={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={item.color} flexShrink={0} />
              <Text fontSize="xs" color="gray.700" fontWeight="500">
                {item.label}
              </Text>
            </HStack>
            <Text fontSize="xs" fontWeight="600" color="gray.900">
              {item.percentage}%
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};
