'use client';

import React from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { Sidebar } from '@/components/common/Sidebar';
import { OrganizationChart } from '@/components/organization/OrganizationChart';

export default function OrganizationPage() {
  return (
    <Box w="100vw" h="100vh" bg="#f7fafc" display="flex" overflow="hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box flex="1" overflow="hidden">
        <OrganizationChart />
      </Box>
    </Box>
  );
}
