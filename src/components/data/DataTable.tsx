import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Heading,
  Table,
  Input,
  Button,
  Flex
} from '@chakra-ui/react';
import { Search, Download } from 'lucide-react';
import { ComponentConfig, DatasetResult } from '../../types/ragApi';

interface DataTableProps {
  config: ComponentConfig;
  dataset: DatasetResult[];
}

export const DataTable: React.FC<DataTableProps> = ({ config, dataset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const primaryData = dataset[0];

  console.log('DataTable - primaryData:', primaryData);
  console.log('DataTable - dataset:', dataset);
  console.log('DataTable - config.properties.columns:', config.properties.columns);
  
  if (!primaryData || !primaryData.data || primaryData.data.length === 0) {
    return (
      <Box w="full" h="full" p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg">
        <VStack gap={2} align="center" justify="center" minH="200px">
          <Text color="gray.500" fontSize="lg" fontWeight="medium">No data available</Text>
          <Text color="gray.400" fontSize="sm">
            {primaryData ? `Dataset has ${primaryData.data?.length || 0} rows` : 'No dataset provided'}
          </Text>
        </VStack>
      </Box>
    );
  }

  // Filter data based on search term
  const filteredData = primaryData.data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Get column configuration with better labels
  const getColumnConfig = () => {
    if (config.properties.columns && config.properties.columns.length > 0) {
      // Check if columns is an array of objects with field and label
      if (typeof config.properties.columns[0] === 'object' && 'field' in config.properties.columns[0]) {
        return config.properties.columns as Array<{field: string, label: string}>;
      }
      
      // Create proper column configuration based on the actual data structure
      // From the cached response, the columns should be in this order:
      const desiredColumns = [
        { field: 'employee_name', label: 'Employee Name' },
        { field: 'project_count', label: 'Projects Completed' },
        { field: 'manager_assessment_risk', label: 'Risk Level' },
        { field: 'primary_trigger', label: 'Primary Trigger' }
      ];
      
      // Filter to only include columns that exist in the data
      return desiredColumns.filter(col => 
        primaryData.columns.includes(col.field)
      );
    }
    
    // Fallback to primary data columns with improved formatting
    return primaryData.columns.map(col => ({
      field: col,
      label: col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  };

  const columnConfig = getColumnConfig();
  
  console.log('DataTable - columnConfig:', columnConfig);
  console.log('DataTable - sample row data:', primaryData.data[0]);

  const exportToCSV = () => {
    const headers = columnConfig.map(col => col.label).join(',');
    const rows = filteredData.map(row => 
      columnConfig.map(col => `"${row[col.field] || ''}"`).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box w="full" h="full">
      <VStack align="start" gap={3} w="full" h="full">
        <Box w="full" p={4} borderBottom="1px solid" borderColor="gray.200">
          <HStack justify="space-between" w="full">
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="gray.800">
                {config.title}
              </Text>
              {config.description && (
                <Text fontSize="xs" color="gray.600" mt={1}>
                  {config.description}
                </Text>
              )}
            </Box>
            <Badge colorScheme="green" variant="solid" px={3} py={1} borderRadius="full">
              DATA TABLE
            </Badge>
          </HStack>
          
          <HStack gap={4} w="full">
            <Box position="relative" flex="1" maxW="md">
              <Input
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                pl={10}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.500", bg: "white" }}
              />
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                <Search size={16} color="#9CA3AF" />
              </Box>
            </Box>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={exportToCSV}
              size="sm"
            >
              Export CSV
            </Button>
          </HStack>
        </Box>
        
        <Box overflowX="auto" w="full">
          <Table.Root size="sm">
            <Table.Header bg="gray.800">
              <Table.Row>
                {columnConfig.map((column, index) => (
                  <Table.ColumnHeader 
                    key={index} 
                    p={3} 
                    fontWeight="semibold" 
                    color="white" 
                    fontSize="xs" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                  >
                    {column.label}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedData.map((row, rowIndex) => (
                <Table.Row key={rowIndex} _hover={{ bg: "gray.25" }} bg="white">
                  {columnConfig.map((column, colIndex) => (
                    <Table.Cell key={colIndex} p={3} borderBottom="1px solid" borderColor="gray.100" bg="white">
                      <Text fontSize="xs" color="gray.800">
                        {String(row[column.field] || '-')}
                      </Text>
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="space-between" align="center" p={6} borderTop="1px solid" borderColor="gray.200">
            <Text fontSize="sm" color="gray.600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </Text>
            <HStack gap={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text fontSize="sm" color="gray.600">
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        )}

        <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.100" borderBottomRadius="xl">
          <Text fontSize="sm" color="gray.600">
            <strong>Total Records:</strong> {primaryData.row_count} | 
            <strong> Source:</strong> {primaryData.description}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
