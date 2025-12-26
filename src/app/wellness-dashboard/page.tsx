'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { ManagerWellnessDashboard } from '@/components/common/ManagerWellnessDashboard';

export default function WellnessDashboardPage() {
  return (
    <Box w="100vw" h="100vh" bg="rgba(0, 0, 0, 0.4)">
      <ManagerWellnessDashboard
        isOpen={true}
        onClose={() => {
          // Close the popup window
          window.close();
        }}
      />
    </Box>
  );
}
