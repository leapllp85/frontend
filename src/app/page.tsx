'use client';

import React, { useState, useEffect } from 'react';
import { Profile } from '@/components/common/Profile';
import { AppLayout } from '@/components/layouts/AppLayout';

export default function Home() {
  const [currentUser, setCurrentUser] = useState('employee1');

  // Get current user from localStorage or authentication context
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('username');
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (err) {
      console.warn('Failed to get current user from localStorage:', err);
    }
  }, []);

  return (
    <AppLayout>
        <Profile width="full" />
    </AppLayout>
  );
}
