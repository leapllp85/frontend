'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';
import PageLoader from './PageLoader';

export default function AppLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, loadingMessage } = useLoading();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Show loading when navigation starts
    setIsNavigating(true);

    // Hide loading after a short delay to allow page to render
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Only show loader if explicitly set via context OR during navigation
  return (
    <PageLoader 
      isLoading={isLoading || isNavigating} 
      message={isNavigating ? 'Loading page...' : loadingMessage} 
    />
  );
}
