import React from 'react';
import { 
  Box, 
  Card, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Heading,
  List,
  Icon
} from '@chakra-ui/react';
import { Lightbulb, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Insights } from '../../types/ragApi';

interface InsightsPanelProps {
  insights: Insights;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  const { key_findings, recommendations, next_steps } = insights;

  return (
    <VStack gap={6} w="full">
      {/* Key Findings */}
      {key_findings && key_findings.length > 0 && (
        <Card.Root bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="xl" w="full">
          <Card.Header p={6} pb={4}>
            <HStack gap={3}>
              <Box p={2} bg="blue.100" borderRadius="lg" color="blue.600">
                <Icon>
                  <TrendingUp size={20} />
                </Icon>
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="md" color="black">
                  Key Findings
                </Heading>
                <Text fontSize="sm" color="black">
                  Important insights from your data
                </Text>
              </VStack>
            </HStack>
          </Card.Header>
          <Card.Body p={6} pt={0}>
            <List.Root gap={3}>
              {key_findings.map((finding, index) => (
                <List.Item key={index}>
                  <HStack align="start" gap={3}>
                    <Box mt={1}>
                      <Badge colorScheme="blue" variant="solid" borderRadius="full" w={6} h={6} display="flex" alignItems="center" justifyContent="center" fontSize="xs">
                        {index + 1}
                      </Badge>
                    </Box>
                    <Text color="black" fontSize="sm" lineHeight="1.6">
                      {finding}
                    </Text>
                  </HStack>
                </List.Item>
              ))}
            </List.Root>
          </Card.Body>
        </Card.Root>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card.Root bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="xl" w="full">
          <Card.Header p={6} pb={4}>
            <HStack gap={3}>
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <Icon>
                  <Lightbulb size={20} />
                </Icon>
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="md" color="black">
                  Recommendations
                </Heading>
                <Text fontSize="sm" color="black">
                  AI-powered suggestions for improvement
                </Text>
              </VStack>
            </HStack>
          </Card.Header>
          <Card.Body p={6} pt={0}>
            <List.Root gap={3}>
              {recommendations.map((recommendation, index) => (
                <List.Item key={index}>
                  <HStack align="start" gap={3}>
                    <Box mt={1}>
                      <Icon color="green.600">
                        <Lightbulb size={16} />
                      </Icon>
                    </Box>
                    <Text color="black" fontSize="sm" lineHeight="1.6">
                      {recommendation}
                    </Text>
                  </HStack>
                </List.Item>
              ))}
            </List.Root>
          </Card.Body>
        </Card.Root>
      )}

      {/* Next Steps */}
      {next_steps && next_steps.length > 0 && (
        <Card.Root bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="xl" w="full">
          <Card.Header p={6} pb={4}>
            <HStack gap={3}>
              <Box p={2} bg="purple.100" borderRadius="lg" color="purple.600">
                <Icon>
                  <Target size={20} />
                </Icon>
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="md" color="black">
                  Next Steps
                </Heading>
                <Text fontSize="sm" color="black">
                  Actionable steps to move forward
                </Text>
              </VStack>
            </HStack>
          </Card.Header>
          <Card.Body p={6} pt={0}>
            <List.Root gap={3}>
              {next_steps.map((step, index) => (
                <List.Item key={index}>
                  <HStack align="start" gap={3}>
                    <Box mt={1}>
                      <Icon color="purple.600">
                        <CheckCircle size={16} />
                      </Icon>
                    </Box>
                    <Text color="black" fontSize="sm" lineHeight="1.6">
                      {step}
                    </Text>
                  </HStack>
                </List.Item>
              ))}
            </List.Root>
          </Card.Body>
        </Card.Root>
      )}
    </VStack>
  );
};
