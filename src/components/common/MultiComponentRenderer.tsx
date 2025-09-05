'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Badge
} from '@chakra-ui/react';
import { ComponentRenderer } from '../data/ComponentRenderer';
import { RAGApiResponse, ComponentConfig, DatasetResult, AsyncComponent, AsyncLayout } from '@/types/ragApi';
import { BarChart3, PieChart, Table, TrendingUp, AlertTriangle } from 'lucide-react';

interface MultiComponentRendererProps {
  response: RAGApiResponse;
  showInsights?: boolean;
  showDataSources?: boolean;
  layout?: 'vertical' | 'grid' | 'horizontal';
}

export const MultiComponentRenderer: React.FC<MultiComponentRendererProps> = ({
  response,
  showInsights = true,
  showDataSources = true,
  layout = 'vertical'
}) => {
  if (!response.success) {
    return (
      <Box p={4} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
        <HStack gap={3}>
          <Box as={AlertTriangle} boxSize="20px" color="red.500" />
          <VStack align="start" gap={1}>
            <Text fontWeight="semibold" color="red.800">Response Error</Text>
            <Text fontSize="sm" color="red.700">{response.error || 'Unknown error occurred'}</Text>
          </VStack>
        </HStack>
      </Box>
    );
  }

  const renderComponents = () => {
    // Check if we have the new async response format with components and layout
    if (response.components && response.components.length > 0) {
      console.log('Rendering async dashboard with components:', response.components);
      console.log('Layout:', response.layout);
      console.log('Dataset:', response.dataset);
      
      // Use the layout configuration from the response
      const { layout: layoutConfig, components, dataset, insights } = response;
      
      return (
        <Box w="full" p={6}>
          <Grid 
            templateColumns={`repeat(${layoutConfig?.columns || 4}, 1fr)`}
            gap={6}
            w="full"
          >
            {(layoutConfig?.component_arrangement || components.map((comp, idx) => ({
              component_id: comp.id,
              position: { row: Math.floor(idx / 2) + 1, col: (idx % 2) + 1, span_col: 1, span_row: 1 },
              span_col: 1
            }))).map((arrangement) => {
              const component = components.find(c => c.id === arrangement.component_id);
              if (!component) return null;

              // Get dataset for this specific component
              let componentDataset: DatasetResult[] = [];
              if (dataset) {
                if (Array.isArray(dataset)) {
                  componentDataset = dataset;
                } else {
                  const componentData = dataset[arrangement.component_id];
                  componentDataset = componentData ? [componentData] : [];
                }
              }
              
              console.log(`Component ${arrangement.component_id} dataset:`, componentDataset);

                return (
                  <GridItem 
                    key={arrangement.component_id}
                    colSpan={arrangement.span_col || arrangement.position?.span_col || 1}
                  >
                    <Box 
                      w="full" 
                      h="full"
                      bg="white" 
                      borderRadius="lg" 
                      border="1px solid" 
                      borderColor="gray.200"
                      overflow="hidden"
                    >
                      <ComponentRenderer 
                        config={{
                          type: component.type,
                          title: component.title,
                          description: component.description || '',
                          properties: component.properties
                        }} 
                        dataset={componentDataset}
                        insights={insights}
                      />
                    </Box>
                  </GridItem>
                );
            })}
          </Grid>
        </Box>
      );
    }

    // Fallback to old logic for legacy responses
    if (!response.dataset || (Array.isArray(response.dataset) && response.dataset.length === 0)) {
      return null;
    }

    const components = Array.isArray(response.dataset) ? response.dataset.map((dataset, index) => {
      let config: ComponentConfig;
      
      if (response.analysis && index === 0) {
        config = response.analysis.component_config;
      } else {
        config = createSmartConfig(dataset, index);
      }

      return (
        <Box key={index} w="full">
          <ComponentRenderer config={config} dataset={[dataset]} />
        </Box>
      );
    }) : [];

    return (
      <Box w="full">
        <VStack gap={4} w="full">
          {components}
        </VStack>
      </Box>
    );
  };

  const createSmartConfig = (dataset: DatasetResult, index: number): ComponentConfig => {
    const columns = dataset.columns;
    const sampleData = dataset.data[0] || {};
    
    // Determine the best component type based on data structure
    let componentType = 'table';
    let title = `Dataset ${index + 1}`;
    
    if (columns.length >= 2) {
      const numericColumns = columns.filter(col => {
        const value = sampleData[col];
        return typeof value === 'number' || !isNaN(parseFloat(value));
      });
      
      if (numericColumns.length >= 1) {
        if (dataset.row_count <= 10) {
          componentType = 'bar_chart';
          title = `${dataset.description || title} - Chart View`;
        } else if (numericColumns.length === 1) {
          componentType = 'metric';
          title = `${dataset.description || title} - Metrics`;
        }
      }
    }

    return {
      type: componentType,
      title: title,
      description: dataset.description || `Analysis of ${dataset.row_count} records`,
      properties: {
        x_axis: columns[0],
        y_axis: columns.find(col => {
          const value = sampleData[col];
          return typeof value === 'number' || !isNaN(parseFloat(value));
        }) || columns[1],
        aggregation: 'sum'
      }
    };
  };

  const getComponentIcon = (type: string) => {
    if (type.includes('chart') || type.includes('bar') || type.includes('line')) {
      return BarChart3;
    } else if (type.includes('pie')) {
      return PieChart;
    } else if (type.includes('table')) {
      return Table;
    } else if (type.includes('metric')) {
      return TrendingUp;
    }
    return AlertTriangle;
  };

  return (
    <VStack align="start" gap={6} w="full">
      {/* Raw Response Text */}
      {response.raw_response && (
        <Box w="full" p={4} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text whiteSpace="pre-wrap" color="gray.800">
            {response.raw_response}
          </Text>
        </Box>
      )}

      {/* Analysis Summary */}
      {response.analysis && (
        <Box w="full" p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
          <HStack gap={3} mb={3}>
            <Box as={getComponentIcon(response.analysis.component_config.type)} boxSize="20px" color="purple.600" />
            <Text fontWeight="semibold" color="purple.800">Analysis Summary</Text>
          </HStack>
          <VStack align="start" gap={2}>
            <Text fontSize="sm" color="purple.700">
              <strong>Intent:</strong> {response.analysis.query_intent}
            </Text>
            <Text fontSize="sm" color="purple.700">
              <strong>Recommended View:</strong> {response.analysis.recommended_component}
            </Text>
            <HStack gap={2} flexWrap="wrap">
              {response.analysis.data_requirements.map((req, index) => (
                <Badge key={index} colorScheme="purple" variant="subtle" fontSize="xs">
                  {req}
                </Badge>
              ))}
            </HStack>
          </VStack>
        </Box>
      )}

      {/* Insights Section */}
      {showInsights && response.insights && (
        <Box w="full" p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
          <Text fontWeight="semibold" color="blue.800" mb={3}>Key Insights</Text>
          <VStack align="start" gap={3}>
            {response.insights.key_findings && response.insights.key_findings.length > 0 && (
              <Box>
                <Text fontWeight="medium" color="blue.700" mb={2} fontSize="sm">Findings</Text>
                <VStack align="start" gap={1}>
                  {response.insights.key_findings.map((finding, index) => (
                    <Text key={index} fontSize="sm" color="blue.600">• {finding}</Text>
                  ))}
                </VStack>
              </Box>
            )}
            
            {response.insights.recommendations && response.insights.recommendations.length > 0 && (
              <Box>
                <Text fontWeight="medium" color="blue.700" mb={2} fontSize="sm">Recommendations</Text>
                <VStack align="start" gap={1}>
                  {response.insights.recommendations.map((rec, index) => (
                    <Text key={index} fontSize="sm" color="blue.600">• {rec}</Text>
                  ))}
                </VStack>
              </Box>
            )}

            {response.insights.next_steps && response.insights.next_steps.length > 0 && (
              <Box>
                <Text fontWeight="medium" color="blue.700" mb={2} fontSize="sm">Next Steps</Text>
                <VStack align="start" gap={1}>
                  {response.insights.next_steps.map((step, index) => (
                    <Text key={index} fontSize="sm" color="blue.600">• {step}</Text>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      {/* Data Components */}
      {response.dataset && (
        <Box w="full">
          <Text fontWeight="semibold" color="gray.800" mb={4}>
            Data Visualization{Array.isArray(response.dataset) ? (response.dataset.length > 1 ? 's' : '') : 's'}
          </Text>
          {renderComponents()}
        </Box>
      )}

      {/* Data Processing Information */}
      {response.data_processing && (
        <Box w="full" p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
          <Text fontWeight="semibold" color="green.800" mb={3}>Data Processing</Text>
          <VStack align="start" gap={2}>
            {response.data_processing.transformations && response.data_processing.transformations.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="green.700">Transformations:</Text>
                <Text fontSize="sm" color="green.600">
                  {response.data_processing.transformations.join(', ')}
                </Text>
              </Box>
            )}
            {response.data_processing.calculations && response.data_processing.calculations.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="green.700">Calculations:</Text>
                <Text fontSize="sm" color="green.600">
                  {response.data_processing.calculations.join(', ')}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      {/* Query Information */}
      {showDataSources && response.queries && response.queries.length > 0 && (
        <Box w="full" p={4} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="semibold" color="gray.800" mb={3}>Data Sources</Text>
          <VStack align="start" gap={3}>
            {response.queries.map((query, index) => (
              <Box key={index} w="full" p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.100">
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  {query.description}
                </Text>
                <Text fontSize="xs" color="gray.600" mb={2}>
                  Fields: {query.expected_fields.join(', ')}
                </Text>
                {query.sql && (
                  <Box p={2} bg="gray.100" borderRadius="md" fontFamily="mono" fontSize="xs">
                    <Text color="gray.700">{query.sql}</Text>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default MultiComponentRenderer;
