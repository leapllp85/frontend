import React from 'react';
import { Box, Card, Text, VStack, HStack, Badge, Heading } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import { DataVisualization } from './DataVisualization';
import { DataTable } from './DataTable';
import { MetricCard } from './MetricCard';
import { ComponentConfig, DatasetResult } from '../../types/ragApi';

interface ComponentRendererProps {
  config: ComponentConfig;
  dataset: DatasetResult[];
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ config, dataset }) => {
  const renderComponent = () => {
    const { type } = config;

    // Chart components
    if (type.includes('chart') || type.includes('bar') || type.includes('line') || type.includes('pie')) {
      return <DataVisualization config={config} dataset={dataset} />;
    }

    // Table components
    if (type.includes('table') || type.includes('data_table')) {
      return <DataTable config={config} dataset={dataset} />;
    }

    // Metric/card components
    if (type.includes('metric') || type.includes('card') || type.includes('stat')) {
      return <MetricCard config={config} dataset={dataset} />;
    }

    // List component (render as simple list)
    if (type.includes('list')) {
      return (
        <Card.Root bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="xl" shadow="lg">
          <Card.Header p={6} pb={4}>
            <VStack align="start" gap={2}>
              <HStack justify="space-between" w="full">
                <Heading size="lg" color="gray.800">
                  {config.title}
                </Heading>
                <Badge colorScheme="orange" variant="solid" px={3} py={1} borderRadius="full">
                  LIST
                </Badge>
              </HStack>
              {config.description && (
                <Text color="gray.600" fontSize="sm">
                  {config.description}
                </Text>
              )}
            </VStack>
          </Card.Header>
          <Card.Body p={6} pt={0}>
            <VStack align="start" gap={3}>
              {dataset[0]?.data.slice(0, 10).map((item, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="lg" w="full">
                  <Text fontSize="sm" color="gray.800">
                    {Object.values(item).join(' - ')}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Card.Body>
        </Card.Root>
      );
    }

    // Default fallback
    return (
      <Card.Root bg="yellow.50" borderColor="yellow.200" borderWidth="1px" borderRadius="xl">
        <Card.Body p={6}>
          <HStack gap={3}>
            <AlertCircle size={20} color="#D97706" />
            <VStack align="start" gap={1}>
              <Text color="yellow.800" fontWeight="semibold">
                Unsupported Component Type
              </Text>
              <Text color="yellow.700" fontSize="sm">
                Component type "{type}" is not yet supported. Showing raw data instead.
              </Text>
            </VStack>
          </HStack>
          <Box mt={4} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="yellow.200">
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(dataset[0]?.data.slice(0, 5), null, 2)}
            </pre>
          </Box>
        </Card.Body>
      </Card.Root>
    );
  };

  return (
    <Box w="full">
      {renderComponent()}
    </Box>
  );
};
