'use client';

import React from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { OrganizationChart } from '@/components/organization/OrganizationChart';

export default function OrganizationPage() {
  return (
    <AppLayout>
      <OrganizationChart />
    </AppLayout>
  );
}
