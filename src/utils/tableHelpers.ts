/**
 * Table Helper Utilities
 * Reusable functions for table operations
 */

import { TeamMember } from '@/types';

/**
 * Calculate suggested risk level based on multiple factors
 */
export const calculateSuggestedRisk = (member: TeamMember): 'High' | 'Medium' | 'Low' => {
  const riskValues = {
    'High': 3,
    'Medium': 2,
    'Low': 1
  };
  
  const total = riskValues[member.mentalHealth] + 
               riskValues[member.motivationFactor] + 
               riskValues[member.careerOpportunities] + 
               riskValues[member.personalReason];
  
  const average = total / 4;
  
  if (average >= 2.5) return 'High';
  if (average >= 1.5) return 'Medium';
  return 'Low';
};

/**
 * Filter table data based on filters
 */
export const filterTableData = <T extends Record<string, any>>(
  data: T[],
  filters: Record<string, any>
): T[] => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      const itemValue = item[key];
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      return itemValue === value;
    });
  });
};

/**
 * Sort table data
 */
export const sortTableData = <T extends Record<string, any>>(
  data: T[],
  sortKey: keyof T,
  sortOrder: 'asc' | 'desc'
): T[] => {
  return [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format table data with transformer
 */
export const formatTableData = <T, R>(
  data: T[],
  transformer: (item: T) => R
): R[] => {
  return data.map(transformer);
};
