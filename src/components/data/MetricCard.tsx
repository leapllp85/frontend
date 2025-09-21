import React from 'react';
import { 
  Box, 
  Card, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Heading,
  Stat,
  Icon
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Activity, Target } from 'lucide-react';
import { ComponentConfig, DatasetResult } from '../../types/ragApi';
import { toTitleCase } from '../../utils/formatter';

interface MetricCardProps {
  config: ComponentConfig;
  dataset: DatasetResult[];
}

export const MetricCard: React.FC<MetricCardProps> = ({ config, dataset }) => {
  const primaryData = dataset[0];

  if (!primaryData || !primaryData.data || primaryData.data.length === 0) {
    return (
      <Box w="full" h="full" p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="lg">
        <Text color="red.600">No data available for metric</Text>
      </Box>
    );
  }

  // For metric cards with multiple metrics, render each metric separately
  if (config.properties.metrics && config.properties.metrics.length > 0) {
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
              <Badge colorScheme="purple" variant="solid" px={3} py={1} borderRadius="full">
                METRICS
              </Badge>
            </HStack>
          </Box>
          <VStack gap={4} w="full">
            {config.properties.metrics.map((metric, index) => {
              // Handle both string metrics and object metrics
              const metricName = typeof metric === 'string' ? metric : metric.label;
              
              // Find corresponding data for this metric
              let metricData = primaryData.data.find(row => 
                row.label === metricName || 
                (row.field && typeof metric === 'object' && metric.field && row.field === metric.field)
              );
              
              // If no direct match, try to find by index for simple cases
              if (!metricData && index < primaryData.data.length) {
                metricData = primaryData.data[index];
              }
              
              let value = 0;
              let label = metricName;
              
              if (metricData) {
                if (typeof metricData.value === 'number') {
                  value = metricData.value;
                }
                if (metricData.label) {
                  label = metricData.label;
                }
              } else if (typeof metric === 'object' && metric.filter) {
                // Parse filter and calculate
                const filterMatch = metric.filter.match(/(\w+)='(\w+)'/);
                if (filterMatch) {
                  const [, field, filterValue] = filterMatch;
                  value = primaryData.data.filter(row => row[field] === filterValue).length;
                }
              }

              return (
                <Box key={index} w="full" p={4} bg="gray.50" borderRadius="lg">
                  <HStack justify="space-between" w="full">
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        {toTitleCase(label)}
                      </Text>
                      <Heading size="lg" color="gray.800">
                        {value.toLocaleString()}
                      </Heading>
                    </VStack>
                    <Box p={2} bg="blue.50" borderRadius="md" color="blue.600">
                      <Icon>
                        <TrendingUp size={20} />
                      </Icon>
                    </Box>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Calculate metric value based on configuration
  const calculateMetric = () => {
    // Check if we have metrics configuration (new format)
    if (config.properties.metrics && config.properties.metrics.length > 0) {
      // For metric cards with multiple metrics, use the data directly
      const metricData = primaryData.data.find(row => row.label || row.field);
      if (metricData && typeof metricData.value === 'number') {
        return metricData.value;
      }
      
      // If no direct value, calculate based on filter
      const metric = config.properties.metrics[0];
      if (metric.filter) {
        // Parse filter like "mental_health='High'"
        const filterMatch = metric.filter.match(/(\w+)='(\w+)'/);
        if (filterMatch) {
          const [, field, value] = filterMatch;
          const count = primaryData.data.filter(row => row[field] === value).length;
          return count;
        }
      }
      
      return primaryData.data.length;
    }

    // Fallback to original logic
    const { aggregation, y_axis } = config.properties;
    const field = y_axis || primaryData.columns[1];
    const values = primaryData.data.map(row => {
      const value = row[field];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    switch (aggregation) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      case 'count':
      default:
        return values.length;
    }
  };

  const metricValue = calculateMetric();
  const formattedValue = typeof metricValue === 'number' ? metricValue.toLocaleString() : metricValue;

  // Determine icon based on metric type or title
  const getIcon = () => {
    const title = config.title.toLowerCase();
    if (title.includes('user') || title.includes('employee') || title.includes('team')) {
      return Users;
    } else if (title.includes('revenue') || title.includes('cost') || title.includes('budget')) {
      return DollarSign;
    } else if (title.includes('activity') || title.includes('performance')) {
      return Activity;
    } else if (title.includes('target') || title.includes('goal')) {
      return Target;
    }
    return TrendingUp;
  };

  const IconComponent = getIcon();

  // Calculate trend if we have historical data
  const getTrend = () => {
    // For metric cards, don't show trend if we don't have meaningful historical data
    if (config.properties.metrics || primaryData.data.length < 2) return null;
    
    const values = primaryData.data.map(row => {
      const field = config.properties.y_axis || primaryData.columns[1];
      const value = row[field];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    
    if (previous === 0) return null; // Avoid division by zero
    
    const change = ((current - previous) / previous) * 100;

    return {
      value: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const trend = getTrend();

  return (
    <Card.Root 
      bg="white" 
      borderColor="gray.200" 
      borderWidth="1px" 
      borderRadius="xl" 
      shadow="sm"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
      transition="all 0.3s ease"
    >
      <Card.Body p={6}>
        <VStack align="start" gap={4}>
          <HStack justify="space-between" w="full">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="black" fontWeight="medium">
                {config.title}
              </Text>
              <Heading size="2xl" color="black" fontWeight="bold">
                {formattedValue}
              </Heading>
            </VStack>
            <Box 
              p={3} 
              bg="blue.50" 
              borderRadius="lg" 
              color="blue.600"
            >
              <Icon>
                <IconComponent size={24} />
              </Icon>
            </Box>
          </HStack>

          {config.description && (
            <Text fontSize="sm" color="black">
              {config.description}
            </Text>
          )}

          {trend && (
            <HStack gap={2}>
              <HStack gap={1}>
                <Icon color={trend.direction === 'up' ? 'green.500' : trend.direction === 'down' ? 'red.500' : 'gray.500'}>
                  {trend.direction === 'up' ? <TrendingUp size={16} /> : 
                   trend.direction === 'down' ? <TrendingDown size={16} /> : 
                   <Minus size={16} />}
                </Icon>
                <Text 
                  fontSize="sm" 
                  fontWeight="semibold"
                  color={trend.direction === 'up' ? 'green.600' : trend.direction === 'down' ? 'red.600' : 'gray.600'}
                >
                  {Math.abs(trend.value).toFixed(1)}%
                </Text>
              </HStack>
              <Text fontSize="sm" color="black">
                vs previous period
              </Text>
            </HStack>
          )}

          <Box w="full" pt={2} borderTop="1px solid" borderColor="gray.100">
            <HStack justify="space-between">
              <Badge colorScheme="purple" variant="solid" px={2} py={1} borderRadius="full" fontSize="xs">
                {config.properties.aggregation?.toUpperCase() || 'COUNT'}
              </Badge>
              <Text fontSize="xs" color="black">
                {primaryData.row_count} records
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
