'use client';

import React from 'react';
import {
  Box,
  Card,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  Spinner
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { Pagination } from './Pagination';
import { Tooltip } from './Tooltip';
import { useScreenSize, useIsSmallScreen } from '@/hooks/useScreenSize';
import { getResponsiveFontSize, getResponsivePadding } from '@/utils/typography';
import { truncateText } from '@/utils/tableHelpers';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  truncate?: boolean;
  maxLength?: number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title: string;
  description?: string;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  
  // Search & Filters
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  filteredCount?: number;
  filterPanel?: React.ReactNode;
  
  // States
  loading?: boolean;
  emptyMessage?: string;
  
  // Optional
  onRowClick?: (row: T) => void;
  onRowHover?: (row: T | null) => void;
  rowHeight?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  description,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filteredCount,
  filterPanel,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  onRowHover,
  rowHeight = '60px'
}: DataTableProps<T>) {
  const screenSize = useScreenSize();
  const isSmallScreen = useIsSmallScreen();
  const padding = getResponsivePadding(screenSize);

  const getValue = (row: T, key: string): any => {
    if (key.includes('.')) {
      const keys = key.split('.');
      let value: any = row;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    }
    return row[key];
  };

  return (
    <Card.Root bg="white" shadow="md" borderRadius="xl">
      <Card.Header p={padding.py * 1.5}>
        <VStack align="stretch" gap={4}>
          <Box>
            <Heading
              size={isSmallScreen ? 'md' : 'lg'}
              color="gray.800"
              fontSize={getResponsiveFontSize(isSmallScreen ? 'xl' : '2xl', screenSize)}
            >
              {title}
            </Heading>
            {description && (
              <Text
                color="gray.600"
                fontSize={getResponsiveFontSize('sm', screenSize)}
                mt={1}
              >
                {description}
              </Text>
            )}
          </Box>

          {/* Filter Panel */}
          {filterPanel && <Box>{filterPanel}</Box>}

          {/* Search and Page Size */}
          <HStack gap={4} flexWrap="wrap">
            {onSearchChange && (
              <Box flex={1} minW="200px" position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  <Search size={16} />
                </Box>
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  size="sm"
                  pl={10}
                  fontSize={getResponsiveFontSize('sm', screenSize)}
                />
              </Box>
            )}
            
            <Box>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  onItemsPerPageChange(Number(e.target.value));
                  onPageChange(1);
                }}
                style={{
                  padding: isSmallScreen ? '4px 8px' : '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: getResponsiveFontSize('sm', screenSize),
                  backgroundColor: 'white',
                  color: '#4a5568',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '120px'
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </Box>
          </HStack>

          {/* Search Results Info */}
          {searchQuery && filteredCount !== undefined && (
            <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
              <Text fontSize={getResponsiveFontSize('sm', screenSize)} color="blue.700">
                <strong>{filteredCount}</strong> results found matching <strong>"{searchQuery}"</strong>
                {filteredCount !== totalItems && (
                  <span> (filtered from {totalItems} total)</span>
                )}
              </Text>
            </Box>
          )}
        </VStack>
      </Card.Header>

      <Card.Body p={0}>
        <Box
          overflowX="auto"
          overflowY={isSmallScreen ? 'auto' : 'visible'}
          maxH={isSmallScreen ? 'calc(100vh - 400px)' : 'none'}
        >
          {loading ? (
            <Box p={8} textAlign="center">
              <Spinner size="lg" color="teal.500" />
            </Box>
          ) : data.length === 0 ? (
            <Box p={8} textAlign="center">
              <Text color="gray.500" fontSize={getResponsiveFontSize('md', screenSize)}>
                {emptyMessage}
              </Text>
            </Box>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: isSmallScreen ? '12px' : '16px',
                        textAlign: column.align || 'left',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: getResponsiveFontSize('sm', screenSize),
                        width: column.width
                      }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb',
                      cursor: onRowClick ? 'pointer' : 'default',
                      height: rowHeight
                    }}
                    onClick={() => onRowClick?.(row)}
                    onMouseEnter={(e) => {
                      if (onRowClick || onRowHover) {
                        e.currentTarget.style.backgroundColor = '#f0fdfa';
                      }
                      onRowHover?.(row);
                    }}
                    onMouseLeave={(e) => {
                      if (onRowClick || onRowHover) {
                        e.currentTarget.style.backgroundColor = rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb';
                      }
                      onRowHover?.(null);
                    }}
                  >
                    {columns.map((column, colIdx) => {
                      const value = getValue(row, column.key as string);
                      const renderedValue = column.render ? column.render(value, row) : value;
                      const shouldTruncate = column.truncate && typeof renderedValue === 'string';
                      const truncatedValue = shouldTruncate
                        ? truncateText(renderedValue as string, column.maxLength || 50)
                        : renderedValue;

                      return (
                        <td
                          key={colIdx}
                          style={{
                            padding: isSmallScreen ? '12px' : '16px',
                            textAlign: column.align || 'left',
                            fontSize: getResponsiveFontSize('sm', screenSize)
                          }}
                        >
                          {shouldTruncate && truncatedValue !== renderedValue ? (
                            <Tooltip content={renderedValue as string}>
                              <span>{truncatedValue}</span>
                            </Tooltip>
                          ) : (
                            renderedValue
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Box>
      </Card.Body>

      <Card.Footer p={4} borderTop="1px solid" borderColor="gray.200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCount !== undefined ? filteredCount : totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          loading={loading}
          showFirstLast={true}
          showPageNumbers={true}
        />
      </Card.Footer>
    </Card.Root>
  );
}
