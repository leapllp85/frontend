'use client';

import React from 'react';
import { ManagerWellnessDashboard } from '@/components/common/ManagerWellnessDashboard';

export default function WellnessDashboardPage() {
  return (
    <ManagerWellnessDashboard
      isOpen={true}
      standalone={true}
      onClose={() => {
        // Close the popup window
        window.close();
      }}
    />
  );
}
