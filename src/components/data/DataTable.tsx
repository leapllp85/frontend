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

  if (!primaryData || !primaryData.data || primaryData.data.length === 0) {
    return (
      <Card.Root bg="red.50" borderColor="red.200" borderWidth="1px">
        <Card.Body p={6}>
          <Text color="red.600">No data available for table</Text>
        </Card.Body>
      </Card.Root>
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

  const exportToCSV = () => {
    const headers = primaryData.columns.join(',');
    const rows = filteredData.map(row => 
      primaryData.columns.map(col => `"${row[col] || ''}"`).join(',')
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
    <Card.Root bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="xl" shadow="lg">
      <Card.Header p={6} pb={4}>
        <VStack align="start" gap={4}>
          <HStack justify="space-between" w="full">
            <VStack align="start" gap={2}>
              <Heading size="lg" color="gray.800">
                {config.title}
              </Heading>
              {config.description && (
                <Text color="gray.600" fontSize="sm">
                  {config.description}
                </Text>
              )}
            </VStack>
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
        </VStack>
      </Card.Header>

      <Card.Body p={0}>
        <Box overflowX="auto">
          <Table.Root size="sm">
            <Table.Header bg="white">
              <Table.Row>
                {primaryData.columns.map((column, index) => (
                  <Table.ColumnHeader key={index} p={4} fontWeight="semibold" color="gray.500">
                    {column.replace(/_/g, ' ').toUpperCase()}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedData.map((row, rowIndex) => (
                <Table.Row key={rowIndex} _hover={{ bg: "gray.25" }} bg="white">
                  {primaryData.columns.map((column, colIndex) => (
                    <Table.Cell key={colIndex} p={4} borderBottom="1px solid" borderColor="gray.100" bg="white">
                      <Text fontSize="sm" color="gray.800">
                        {String(row[column] || '-')}
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
      </Card.Body>
    </Card.Root>
  );
};
