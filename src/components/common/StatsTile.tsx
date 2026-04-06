'use client';

import React from 'react';
import { Box, Card, HStack, VStack, Text } from '@chakra-ui/react';
import { useScreenSize } from '@/hooks/useScreenSize';
import { getResponsiveFontSize } from '@/utils/typography';

export interface StatsTileProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  valueColor?: string;
  subtitle?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

export const StatsTile: React.FC<StatsTileProps> = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
  valueColor = 'gray.800',
  subtitle,
  onClick,
  loading = false
}) => {
  const screenSize = useScreenSize();
  const isSmallScreen = screenSize === '13inch' || screenSize === '14inch';

  return (
    <Card.Root
      bg="white"
      shadow="md"
      borderRadius="xl"
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { shadow: 'lg', transform: 'translateY(-2px)' } : {}}
      transition="all 0.3s"
      onClick={onClick}
    >
      <Card.Body p={isSmallScreen ? 4 : 6}>
        <VStack align="stretch" gap={isSmallScreen ? 2 : 3}>
          <HStack gap={isSmallScreen ? 2 : 3} mb={isSmallScreen ? 2 : 3}>
            <Box p={isSmallScreen ? 1.5 : 2} bg={iconBgColor} borderRadius="lg">
              <Icon size={isSmallScreen ? 18 : 20} color={iconColor} />
            </Box>
            <Text
              fontWeight="semibold"
              color="gray.700"
              fontSize={getResponsiveFontSize(isSmallScreen ? 'sm' : 'md', screenSize)}
            >
              {label}
            </Text>
          </HStack>
          
          {loading ? (
            <Box h={isSmallScreen ? '32px' : '40px'} bg="gray.200" borderRadius="md" />
          ) : (
            <>
              <Text
                fontSize={getResponsiveFontSize(isSmallScreen ? '2xl' : '3xl', screenSize)}
                fontWeight="bold"
                color={valueColor}
              >
                {value}
              </Text>
              
              {subtitle && (
                <Box mt={1}>
                  {subtitle}
                </Box>
              )}
            </>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
