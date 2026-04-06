'use client';

import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { Badge, BadgeColorScheme } from '@/components/ui/badge';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface AlertCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  stats: ReadonlyArray<{ readonly label: string; readonly value: string; readonly color: string }>;
  badge?: { text: string; colorScheme: BadgeColorScheme };
  sectionTitle?: string;
  items?: ReadonlyArray<string>;
  tags?: ReadonlyArray<string>;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  stats,
  badge,
  sectionTitle,
  items,
  tags,
}) => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      shadow="0 1px 4px rgba(0,0,0,0.04)"
    >
      <HStack gap={2.5} mb={3}>
        <Box p={1.5} bg={iconBg} borderRadius="lg">
          <Icon size={16} color={iconColor} />
        </Box>
        <Text fontSize="0.8125rem" fontWeight="600" color="gray.800">
          {title}
        </Text>
        {badge && (
          <Badge 
            fontSize="0.625rem" 
            px={2} 
            py={0.5} 
            borderRadius="md" 
            colorScheme={badge.colorScheme} 
            fontWeight="700"
          >
            {badge.text}
          </Badge>
        )}
      </HStack>

      <HStack gap={4} mb={2}>
        {stats.map((stat, i) => (
          <HStack key={i} gap={1.5}>
            <Box w="7px" h="7px" borderRadius="full" bg={stat.color} />
            <Text fontSize="0.75rem" color="gray.600">
              {stat.label}: <Text as="span" fontWeight="700" color="gray.800">{stat.value}</Text>
            </Text>
          </HStack>
        ))}
      </HStack>

      {sectionTitle && (
        <Text 
          fontSize="0.6875rem" 
          fontWeight="600" 
          color="gray.500" 
          textTransform="uppercase" 
          letterSpacing="0.04em" 
          mb={1.5}
        >
          {sectionTitle}
        </Text>
      )}

      {tags && (
        <HStack gap={2} flexWrap="wrap">
          {tags.map((tag, i) => (
            <Badge 
              key={i} 
              fontSize="0.6875rem" 
              px={2.5} 
              py={1} 
              borderRadius="md" 
              bg="blue.50" 
              color="blue.700" 
              fontWeight="600"
            >
              {tag}
            </Badge>
          ))}
        </HStack>
      )}

      {items && (
        <VStack align="stretch" gap={1}>
          {items.map((item, i) => (
            <HStack key={i} gap={2}>
              <ChevronRight size={12} color="#9CA3AF" />
              <Text fontSize="0.75rem" color="gray.600">{item}</Text>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};
