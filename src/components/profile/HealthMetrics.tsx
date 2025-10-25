'use client';

import React from "react";
import { Box, Text, VStack, HStack, Card, Heading } from "@chakra-ui/react";

interface MetricData {
  label: string;
  value: number;
  color: string;
  type?: 'mental_health' | 'attrition_risk' | 'project_health';
}

interface HealthMetricsProps {
  metrics?: MetricData[];
}

const defaultMetrics: MetricData[] = [
  { label: 'Mental Health', value: 70, color: '#f97316', type: 'mental_health' },
  { label: 'Attrition Risk', value: 47, color: '#eab308', type: 'attrition_risk' },
  { label: 'Project Health', value: 67.5, color: '#84cc16', type: 'project_health' }
];

// Helper function to interpolate between two colors
const interpolateColor = (color1: [number, number, number], color2: [number, number, number], factor: number): [number, number, number] => {
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * factor),
    Math.round(color1[1] + (color2[1] - color1[1]) * factor),
    Math.round(color1[2] + (color2[2] - color1[2]) * factor)
  ];
};

// Helper function to convert RGB array to hex
const rgbToHex = (rgb: [number, number, number]): string => {
  return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
};

const getColorByValue = (value: number, type: MetricData['type']): { color: string; gradientId: string } => {
  // Define more vibrant RGB values for smoother transitions
  const red: [number, number, number] = [220, 38, 127];     // #dc267f - vibrant magenta-red
  const orange: [number, number, number] = [255, 102, 51];  // #ff6633 - vibrant orange
  const yellow: [number, number, number] = [255, 193, 7];   // #ffc107 - bright yellow
  const lime: [number, number, number] = [139, 195, 74];    // #8bc34a - lime green
  const green: [number, number, number] = [76, 175, 80];    // #4caf50 - vibrant green
  
  let color: [number, number, number];
  
  if (type === 'project_health') {
    // Project Health: Red (0) → Orange (25) → Yellow (50) → Lime (75) → Green (100)
    if (value <= 25) {
      const factor = value / 25;
      color = interpolateColor(red, orange, factor);
    } else if (value <= 50) {
      const factor = (value - 25) / 25;
      color = interpolateColor(orange, yellow, factor);
    } else if (value <= 75) {
      const factor = (value - 50) / 25;
      color = interpolateColor(yellow, lime, factor);
    } else {
      const factor = (value - 75) / 25;
      color = interpolateColor(lime, green, factor);
    }
  } else {
    // Mental Health & Attrition Risk: Green (0) → Lime (25) → Yellow (50) → Orange (75) → Red (100)
    if (value <= 25) {
      const factor = value / 25;
      color = interpolateColor(green, lime, factor);
    } else if (value <= 50) {
      const factor = (value - 25) / 25;
      color = interpolateColor(lime, yellow, factor);
    } else if (value <= 75) {
      const factor = (value - 50) / 25;
      color = interpolateColor(yellow, orange, factor);
    } else {
      const factor = (value - 75) / 25;
      color = interpolateColor(orange, red, factor);
    }
  }
  
  return { 
    color: rgbToHex(color), 
    gradientId: `gradient-${value}-${type}` 
  };
};

const CircularProgress: React.FC<{ value: number; color: string; label: string; type?: MetricData['type'] }> = ({ 
  value, 
  color, 
  label,
  type
}) => {
  const { color: dynamicColor, gradientId } = getColorByValue(value, type);
  
  // Create a darker shade for the gradient end
  const createDarkerShade = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken by 20%
    const darkerR = Math.round(r * 0.8);
    const darkerG = Math.round(g * 0.8);
    const darkerB = Math.round(b * 0.8);
    
    return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
  };
  
  const darkerColor = createDarkerShade(dynamicColor);
  
  return (
    <VStack gap={0} w="full" align="center">
      <Box 
        position="relative" 
        w="190px" 
        h="175px"
        transition="all 0.2s ease"
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {/* <stop offset="40%" stopColor={dynamicColor} /> */}
              <stop offset="100%" stopColor={darkerColor} />
            </linearGradient>
            <filter id={`shadow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          {/* Background circle with shadow */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="none"
            filter={`url(#shadow-${gradientId})`}
          />
          {/* Progress circle with enhanced thickness and shadow */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke={`url(#${gradientId})`}
            strokeWidth="5"
            fill="none"
            strokeDasharray={`${(value / 100) * 219.9}, 219.9`}
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
            // filter={`url(#shadow-${gradientId})`}
          />
        </svg>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <VStack gap={0}>
            <Text fontSize="sm" fontWeight="normal" color="gray.800" letterSpacing={0.5}>
              {value}%
            </Text>
            <Text fontSize="xs" color="gray.600" fontWeight="medium" letterSpacing={0.5}>
              {type === 'attrition_risk' ? 'Satisfactory' : 'Good'}
            </Text>
          </VStack>
        </Box>
      </Box>
      <Text 
        fontSize="sm" 
        fontWeight="normal" 
        color="gray.900" 
        textAlign="center"
        letterSpacing={0.5}
      >
        {label}
      </Text>
    </VStack>
  );
};

export const HealthMetrics: React.FC<HealthMetricsProps> = ({
  metrics = defaultMetrics
}) => {
  return (
    <Card.Root 
      bg="#ffffff" 
      shadow="sm" 
      borderRadius="3xl"
      border="1px solid" 
      // borderColor="gray.550"
      h="99%" 
      w="99%"
      maxW="280px"
      display="flex" 
      flexDirection="column"
      // transition="all 0.2s ease"
      py={4}
      pb={4}
    >
      <Card.Header px={4} py={2}>
        <VStack gap={1}>
        <Heading 
          size="md" 
          color="gray.900" 
          textAlign="center"
          fontWeight="normal"
        >
          Health Metrics
        </Heading>
        <Box 
          w="100%" 
          h="1.1px" 
          bg="linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)"
        />
        </VStack>
      </Card.Header>
      <Card.Body px={2} py={0} display="flex" flexDirection="column">
        <VStack gap={1} w="full" h="full" justify="center" align="center">
          {metrics.map((metric, index) => (
            <CircularProgress
              key={index}
              value={metric.value}
              color={metric.color}
              label={metric.label}
              type={metric.type}
            />
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
