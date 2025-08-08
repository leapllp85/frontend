'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

interface NavigationLoaderProps {
  children: React.ReactNode;
}

export default function NavigationLoader({ children }: NavigationLoaderProps) {
  const { setLoading, setLoadingMessage } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Create a custom router push function that shows loading
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    // Override router methods to show loading
    router.push = (href: string, options?: any) => {
      setLoadingMessage('Navigating...');
      setLoading(true);
      return originalPush(href, options);
    };

    router.replace = (href: string, options?: any) => {
      setLoadingMessage('Navigating...');
      setLoading(true);
      return originalReplace(href, options);
    };

    router.back = () => {
      setLoadingMessage('Going back...');
      setLoading(true);
      return originalBack();
    };

    router.forward = () => {
      setLoadingMessage('Going forward...');
      setLoading(true);
      return originalForward();
    };

    // Hide loading when pathname changes (navigation complete)
    const handleRouteChange = () => {
      setLoading(false);
    };

    // Listen for pathname changes
    handleRouteChange();

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [pathname, router, setLoading, setLoadingMessage]);

  // Handle browser navigation events
  useEffect(() => {
    const handleStart = () => {
      setLoadingMessage('Loading page...');
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    // Listen for browser navigation events
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, [setLoading, setLoadingMessage]);

  return <>{children}</>;
}
