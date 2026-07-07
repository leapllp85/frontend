'use client';

import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { useScreenSize } from '@/hooks/useScreenSize';
import { getResponsiveSpacing } from '@/utils/typography';

export interface StatsGridProps {
  children: React.ReactNode;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  columns
}) => {
  const screenSize = useScreenSize();
  const spacing = getResponsiveSpacing(screenSize);

  // Default responsive columns for corporate laptops
  const defaultColumns = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  };

  const gridColumns = columns || defaultColumns;

  return (
    <SimpleGrid
      columns={gridColumns}
      gap={spacing}
    >
      {children}
    </SimpleGrid>
  );
};
