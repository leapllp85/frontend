'use client';

import React from 'react';
import { HStack, Button, Text, Box } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  loading?: boolean;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading = false,
  showFirstLast = true,
  showPageNumbers = true,
  maxPageNumbers = 5
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!showPageNumbers || totalPages <= 1) return [];
    
    const pages: number[] = [];
    const half = Math.floor(maxPageNumbers / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return (
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Text fontSize="sm" color="gray.600">
          {totalItems === 0 ? 'No items found' : `Showing ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        </Text>
        
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.600">Items per page:</Text>
          <select
            value={itemsPerPage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onItemsPerPageChange(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#4a5568',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '80px'
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </HStack>
      </HStack>
    );
  }

  return (
    <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
      {/* Items info */}
      <Text fontSize="sm" color="gray.600">
        Showing {startItem}-{endItem} of {totalItems} items
      </Text>

      {/* Pagination controls */}
      <HStack gap={1}>
        {/* First page button */}
        {showFirstLast && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </Button>
        )}

        {/* Previous page button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        {/* Page numbers */}
        {showPageNumbers && pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            size="sm"
            variant={pageNum === currentPage ? "solid" : "ghost"}
            colorPalette={pageNum === currentPage ? "purple" : "gray"}
            onClick={() => onPageChange(pageNum)}
            disabled={loading}
            minW="40px"
          >
            {pageNum}
          </Button>
        ))}

        {/* Next page button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>

        {/* Last page button */}
        {showFirstLast && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </Button>
        )}
      </HStack>

      {/* Items per page selector */}
      <HStack gap={2}>
        <Text fontSize="sm" color="gray.600">Items per page:</Text>
        <select
          value={itemsPerPage}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onItemsPerPageChange(Number(e.target.value))}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#4a5568',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '80px'
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </HStack>
    </HStack>
  );
};
