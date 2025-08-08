import React from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  HStack,
  Heading,
  Card,
  Flex,
} from '@chakra-ui/react';

interface AIResponseProps {
  aiResponse: string;
  isLoading: boolean;
  error: string | null;
}

export const AIResponse: React.FC<AIResponseProps> = ({
  aiResponse,
  isLoading,
  error,
}) => {
  return (
    <Box w="full" h="full" p={6} overflowY="auto">
      <VStack align="start" gap={6} h="full">
        {/* Header */}
        <Heading size="lg" color="gray.800">
          AI Assistant
        </Heading>

        {/* Error Display */}
        {error && (
          <Card.Root w="full" bg="red.50" borderColor="red.200" borderWidth="1px">
            <Card.Body>
              <Text color="red.600" fontSize="sm">
                {error}
              </Text>
            </Card.Body>
          </Card.Root>
        )}

        {/* Loading Display */}
        {isLoading && (
          <Card.Root w="full" bg="blue.50" borderColor="blue.200" borderWidth="1px">
            <Card.Body>
              <HStack>
                <Spinner size="sm" color="blue.500" />
                <Text color="blue.600" fontSize="sm">
                  Processing your request...
                </Text>
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        {/* AI Response Display */}
        {aiResponse ? (
          <Card.Root 
            w="full" 
            bg="#a5479f" 
            borderColor="whiteAlpha.300" 
            borderWidth="1px"
            borderRadius="xl"
            shadow="lg"
            _hover={{ shadow: "xl" }}
            transition="all 0.3s ease"
          >
            <Card.Body>
              <VStack align="start" gap={4}>
                <Text fontWeight="semibold" color="white" fontSize="lg">
                  AI Assistant Response:
                </Text>
                <Box 
                  p={4} 
                  bg="whiteAlpha.200" 
                  borderRadius="md" 
                  border="1px" 
                  borderColor="whiteAlpha.300"
                  w="full"
                >
                  <Text 
                    fontSize="sm" 
                    lineHeight="1.6" 
                    whiteSpace="pre-wrap"
                    color="white"
                  >
                    {aiResponse}
                  </Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        ) : (
          !isLoading && !error && (
            <Card.Root w="full" bg="gray.50" borderColor="gray.200" borderWidth="1px">
              <Card.Body>
                <Flex align="center" justify="center" minH="200px">
                  <VStack gap={3}>
                    <Text color="gray.500" fontSize="lg" fontWeight="medium">
                      Welcome to AI Assistant
                    </Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      Start a conversation in the chat sidebar to see AI responses here.
                    </Text>
                  </VStack>
                </Flex>
              </Card.Body>
            </Card.Root>
          )
        )}
      </VStack>
    </Box>
  );
};

export default AIResponse;
