import React from "react";
import { Box, Text, VStack, Card, Heading, SimpleGrid } from "@chakra-ui/react";

interface MetricData {
  label: string;
  value: number;
  color: string;
  type?: 'mental_health' | 'attrition_risk' | 'project_health';
}

interface ProjectMetricsOverviewProps {
  metrics?: MetricData[];
}

const defaultMetrics: MetricData[] = [
  { label: 'Mental Health', value: 75, color: '#60a5fa', type: 'mental_health' },
  { label: 'Attrition Risk', value: 70, color: '#4ade80', type: 'attrition_risk' },
  { label: 'Project Health', value: 83, color: '#fb923c', type: 'project_health' }
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
    <VStack gap={0.5} h="full" justify="center">
      <Text fontSize="md" fontWeight="bold" color="gray.800" textAlign="center">{label}</Text>
      <Box position="relative" w="full" aspectRatio="2">
  <svg width="100%" height="100%" viewBox="0 0 100 50">
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={dynamicColor} />
        <stop offset="100%" stopColor={darkerColor} />
      </linearGradient>
    </defs>
    {/* Background semi-circle */}
    <path
      d="M 10 50 A 40 40 0 0 1 90 50"
      fill="none"
      stroke="#e2e8f0"
      strokeWidth="6"
    />
    {/* Foreground semi-circle (progress) */}
    <path
      d="M 10 50 A 40 40 0 0 1 90 50"
      fill="none"
      stroke={dynamicColor}
      strokeWidth="6"
      strokeDasharray={`${(value / 100) * 125.6}, 125.6`}
      strokeDashoffset="0"
      strokeLinecap="round"
    />
  </svg>
  <Box
    position="absolute"
    top="70%"
    left="50%"
    transform="translate(-50%, -50%)"
    fontSize="md"
    fontWeight="bold"
    color="gray.800"
    textAlign="center"
    w="full"
  >
    {value}%
  </Box>
</Box>
      <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">Good</Text>
    </VStack>
  );
};

export const ProjectMetricsOverview: React.FC<ProjectMetricsOverviewProps> = ({
  metrics = defaultMetrics
}) => {
  return (
    <Card.Root bg="white" shadow="md" borderRadius="xl" h="full" display="flex" flexDirection="column">
      <Card.Header p={3} borderBottom="1px solid" borderColor="gray.100">
        <Heading size="md" color="gray.800">Project Metrics Overview</Heading>
      </Card.Header>
      <Card.Body flex="1" display="flex" alignItems="center">
        <SimpleGrid columns={3} gap={1} w="full" h="full" alignItems="center">
          {metrics.map((metric, index) => (
            <CircularProgress
              key={index}
              value={metric.value}
              color={metric.color}
              label={metric.label}
              type={metric.type}
            />
          ))}
        </SimpleGrid>
      </Card.Body>
    </Card.Root>
  );
};
