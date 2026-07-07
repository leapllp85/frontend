'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Heading, Flex, Grid } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalysisDonutChartProps {
  data: any;
  title?: string;
  centerText?: string;
  centerSubtext?: string;
}

export const AnalysisDonutChart: React.FC<AnalysisDonutChartProps> = ({
  data,
  title = 'Analysis',
  centerText = '145',
  centerSubtext = 'Total'
}) => {
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
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
    cutout: '65%'
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea: { width, height } } = chart;
      ctx.save();
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(centerText, centerX, centerY - 8);
      
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(centerSubtext, centerX, centerY + 12);
      
      ctx.restore();
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
        <Box w="180px" h="180px">
          <Doughnut 
            data={data} 
            options={chartOptions} 
            plugins={[centerTextPlugin]}
          />
        </Box>
      </Flex>

      {/* Legend */}
      <VStack align="center" gap={1} w="full" maxW="200px" mx="auto">
        <Grid templateColumns="repeat(2, 1fr)" gap={1} w="full">
          <Flex align="center" gap={1} minH="18px">
            <Box w="6px" h="6px" borderRadius="full" bg="#7EC8E3" flexShrink={0} />
            <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>
              Mental Health
            </Text>
          </Flex>
          <Flex align="center" gap={1} minH="18px">
            <Box w="6px" h="6px" borderRadius="full" bg="#87CEEB" flexShrink={0} />
            <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>
              Motivation
            </Text>
          </Flex>
          <Flex align="center" gap={1} minH="18px">
            <Box w="6px" h="6px" borderRadius="full" bg="#9DD9D2" flexShrink={0} />
            <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>
              Career Opp.
            </Text>
          </Flex>
          <Flex align="center" gap={1} minH="18px">
            <Box w="6px" h="6px" borderRadius="full" bg="#A8E6CF" flexShrink={0} />
            <Text fontSize="xs" fontWeight="500" color="gray.700" lineClamp={1}>
              Personal
            </Text>
          </Flex>
        </Grid>
      </VStack>
    </VStack>
  );
};
