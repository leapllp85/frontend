'use client';

import React from 'react';
import { Box, VStack, HStack, Card, Skeleton } from '@chakra-ui/react';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list' | 'metric' | 'project' | 'survey' | 'action-item';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  count = 3 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'metric':
        return (
          <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Card.Body p={5}>
              <HStack justify="space-between">
                <VStack align="start" gap={2}>
                  <Skeleton height="16px" width="100px" />
                  <Skeleton height="32px" width="60px" />
                </VStack>
                <Skeleton height="48px" width="48px" borderRadius="lg" />
              </HStack>
            </Card.Body>
          </Card.Root>
        );

      case 'project':
        return (
          <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Card.Body p={4}>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Skeleton height="20px" width="150px" />
                  <Skeleton height="24px" width="60px" borderRadius="full" />
                </HStack>
                <Skeleton height="40px" width="100%" />
                <HStack justify="space-between">
                  <Skeleton height="16px" width="80px" />
                  <Skeleton height="16px" width="100px" />
                </HStack>
                <HStack gap={2}>
                  <Skeleton height="24px" width="24px" borderRadius="full" />
                  <Skeleton height="24px" width="24px" borderRadius="full" />
                  <Skeleton height="24px" width="24px" borderRadius="full" />
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        );

      case 'survey':
        return (
          <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Card.Body p={4}>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Skeleton height="20px" width="200px" />
                  <Skeleton height="24px" width="70px" borderRadius="full" />
                </HStack>
                <Skeleton height="60px" width="100%" />
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Skeleton height="12px" width="60px" />
                    <Skeleton height="16px" width="80px" />
                  </VStack>
                  <VStack align="start" gap={1}>
                    <Skeleton height="12px" width="60px" />
                    <Skeleton height="16px" width="80px" />
                  </VStack>
                </HStack>
                <Skeleton height="36px" width="100%" borderRadius="md" />
              </VStack>
            </Card.Body>
          </Card.Root>
        );

      case 'action-item':
        return (
          <Box
            p={3}
            bg="white"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="space-between" align="start" gap={2}>
              <VStack align="start" gap={2} flex={1}>
                <Skeleton height="16px" width="70%" />
                <Skeleton height="14px" width="90%" />
                <Skeleton height="12px" width="100px" />
              </VStack>
              <Skeleton height="24px" width="70px" borderRadius="full" />
            </HStack>
          </Box>
        );

      case 'table':
        return (
          <Box>
            <Skeleton height="60px" width="100%" mb={2} />
            {Array.from({ length: count }).map((_, idx) => (
              <Skeleton key={idx} height="50px" width="100%" mb={1} />
            ))}
          </Box>
        );

      case 'list':
        return (
          <VStack gap={2} align="stretch">
            {Array.from({ length: count }).map((_, idx) => (
              <Card.Root key={idx} bg="white" borderRadius="md">
                <Card.Body p={3}>
                  <HStack justify="space-between">
                    <VStack align="start" gap={1} flex={1}>
                      <Skeleton height="16px" width="60%" />
                      <Skeleton height="14px" width="80%" />
                    </VStack>
                    <Skeleton height="24px" width="60px" borderRadius="full" />
                  </HStack>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        );

      default:
        return (
          <Card.Root bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Card.Body p={4}>
              <VStack align="stretch" gap={3}>
                <Skeleton height="20px" width="60%" />
                <Skeleton height="60px" width="100%" />
                <Skeleton height="16px" width="40%" />
              </VStack>
            </Card.Body>
          </Card.Root>
        );
    }
  };

  if (type === 'table' || type === 'list') {
    return <>{renderSkeleton()}</>;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
