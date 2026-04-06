'use client';

import React from 'react';
import { Box, VStack, Flex, Text, Badge, Popover, IconButton } from '@chakra-ui/react';
import { Info } from 'lucide-react';
import { getRiskColor } from '@/utils/riskColors';

interface RiskFactorPopoverProps {
  mentalHealth: 'High' | 'Medium' | 'Low';
  motivationFactor: 'High' | 'Medium' | 'Low';
  careerOpportunities: 'High' | 'Medium' | 'Low';
  personalReason: 'High' | 'Medium' | 'Low';
}

export const RiskFactorPopover: React.FC<RiskFactorPopoverProps> = ({
  mentalHealth,
  motivationFactor,
  careerOpportunities,
  personalReason
}) => {
  return (
    <Popover.Root positioning={{ placement: 'right' }}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label="View risk factors"
          size="xs"
          variant="ghost"
          color="gray.400"
          _hover={{ 
            color: "blue.500",
            bg: "blue.50"
          }}
          css={{
            minWidth: '20px',
            height: '20px',
            padding: '2px'
          }}
        >
          <Info size={14} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content 
        width="280px" 
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        shadow="lg"
        _focus={{ outline: "none" }}
      >
        <Popover.Arrow bg="white" borderColor="gray.200" />
        <Box p={3}>
          <VStack align="stretch" gap={2}>
            <Text 
              fontSize="0.8125rem" 
              fontWeight="700" 
              color="gray.800" 
              letterSpacing="0.01em"
              mb={0.5}
            >
              Risk Factors
            </Text>
            <Flex 
              align="center" 
              justify="space-between"
              py={1.5}
              px={2}
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontSize="0.75rem" fontWeight="500" color="gray.700">
                Mental Health
              </Text>
              <Badge
                colorScheme={getRiskColor(mentalHealth)}
                fontSize="0.6875rem"
                px={2}
                py={0.5}
              >
                {mentalHealth}
              </Badge>
            </Flex>
            <Flex 
              align="center" 
              justify="space-between"
              py={1.5}
              px={2}
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontSize="0.75rem" fontWeight="500" color="gray.700">
                Motivation
              </Text>
              <Badge
                colorScheme={getRiskColor(motivationFactor)}
                fontSize="0.6875rem"
                px={2}
                py={0.5}
              >
                {motivationFactor}
              </Badge>
            </Flex>
            <Flex 
              align="center" 
              justify="space-between"
              py={1.5}
              px={2}
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontSize="0.75rem" fontWeight="500" color="gray.700">
                Career
              </Text>
              <Badge
                colorScheme={getRiskColor(careerOpportunities)}
                fontSize="0.6875rem"
                px={2}
                py={0.5}
              >
                {careerOpportunities}
              </Badge>
            </Flex>
            <Flex 
              align="center" 
              justify="space-between"
              py={1.5}
              px={2}
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontSize="0.75rem" fontWeight="500" color="gray.700">
                Personal
              </Text>
              <Badge
                colorScheme={getRiskColor(personalReason)}
                fontSize="0.6875rem"
                px={2}
                py={0.5}
              >
                {personalReason}
              </Badge>
            </Flex>
          </VStack>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
};
