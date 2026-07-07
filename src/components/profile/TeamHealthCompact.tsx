'use client';

import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

interface MetricData {
  label: string;
  value: number;
  color: string;
  type?: 'portfolio' | 'other';
}

interface TeamHealthCompactProps {
  metrics?: MetricData[];
}

const defaultMetrics: MetricData[] = [
  { label: 'Portfolio Health', value: 76, color: '#ef4444', type: 'portfolio' },
  { label: 'Mental Health', value: 70, color: '#f97316', type: 'other' },
  { label: 'Attrition Risk', value: 47, color: '#eab308', type: 'other' },
  { label: 'Project Health', value: 67.5, color: '#84cc16', type: 'other' }
];

// Function to get color based on value for Portfolio Health (reversed: green=100, red=0)
const getPortfolioColor = (value: number): string => {
  if (value >= 75) return '#10b981'; // green
  if (value >= 50) return '#eab308'; // yellow
  if (value >= 25) return '#f97316'; // orange
  return '#ef4444'; // red
};

export const TeamHealthCompact: React.FC<TeamHealthCompactProps> = ({
  metrics = defaultMetrics
}) => {
  return (
    <VStack align="stretch" justify="flex-start" gap={3} w="full" h="full">
      <VStack gap={2.5} w="full" flex={1} justify="center">
        {metrics.map((metric, index) => {
          const isPortfolio = metric.type === 'portfolio';
          const barColor = isPortfolio ? getPortfolioColor(metric.value) : metric.color;
          const barHeight = isPortfolio ? "14px" : "8px";
          
          return (
            <Box key={index} w="full" mb={isPortfolio ? 2 : 0}>
              <Text 
                fontSize={isPortfolio ? "0.75rem" : "0.6875rem"} 
                fontWeight={isPortfolio ? "700" : "600"} 
                color={isPortfolio ? "gray.800" : "gray.600"} 
                mb={0.5}
                letterSpacing="0.01em"
              >
                {metric.label}
              </Text>
              <Box 
                position="relative" 
                w="full" 
                h={barHeight} 
                bg="gray.200" 
                borderRadius="full" 
                overflow="visible"
                boxShadow={isPortfolio ? "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 -2px 4px rgba(0, 0, 0, 0.1)" : "none"}
              >
                <Box
                  h="full"
                  w={`${metric.value}%`}
                  bg={barColor}
                  borderRadius="full"
                  transition="width 1s ease-out"
                  boxShadow={isPortfolio 
                    ? `0 4px 8px ${barColor}40, 0 2px 4px ${barColor}30, inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.15)` 
                    : "none"
                  }
                  position="relative"
                  _before={isPortfolio ? {
                    content: '""',
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    height: "40%",
                    bg: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                    borderRadius: "full"
                  } : undefined}
                />
              </Box>
              <Text 
                fontSize={isPortfolio ? "0.75rem" : "0.6875rem"} 
                fontWeight="700" 
                color={barColor} 
                mt={0.5}
              >
                {metric.value}%
              </Text>
            </Box>
          );
        })}
      </VStack>
    </VStack>
  );
};
