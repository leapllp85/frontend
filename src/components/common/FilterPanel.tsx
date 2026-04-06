'use client';

import React from 'react';
import { Box, HStack, VStack, Text, Input, Button } from '@chakra-ui/react';
import { useScreenSize } from '@/hooks/useScreenSize';
import { getResponsiveFontSize } from '@/utils/typography';
import { X } from 'lucide-react';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onChange,
  onReset
}) => {
  const screenSize = useScreenSize();
  const isSmallScreen = screenSize === '13inch' || screenSize === '14inch';

  const hasActiveFilters = Object.values(values).some(v => v !== '' && v !== null && v !== undefined);

  return (
    <Box
      bg="gray.50"
      borderRadius="lg"
      p={isSmallScreen ? 3 : 4}
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between">
          <Text
            fontWeight="600"
            color="gray.700"
            fontSize={getResponsiveFontSize('md', screenSize)}
          >
            Filters
          </Text>
          {hasActiveFilters && onReset && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              fontSize={getResponsiveFontSize('sm', screenSize)}
            >
              <X size={14} />
              Clear All
            </Button>
          )}
        </HStack>

        <HStack gap={3} flexWrap="wrap">
          {filters.map(filter => (
            <Box key={filter.key} minW={isSmallScreen ? '150px' : '200px'}>
              <Text
                fontSize={getResponsiveFontSize('sm', screenSize)}
                color="gray.600"
                mb={1}
                fontWeight="500"
              >
                {filter.label}
              </Text>
              
              {filter.type === 'text' && (
                <Input
                  size="sm"
                  placeholder={filter.placeholder}
                  value={values[filter.key] || ''}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  bg="white"
                  fontSize={getResponsiveFontSize('sm', screenSize)}
                />
              )}
              
              {filter.type === 'select' && (
                <select
                  value={values[filter.key] || ''}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  style={{
                    padding: isSmallScreen ? '4px 8px' : '6px 12px',
                    fontSize: getResponsiveFontSize('sm', screenSize),
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    width: '100%',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">{filter.placeholder || 'All'}</option>
                  {filter.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};
