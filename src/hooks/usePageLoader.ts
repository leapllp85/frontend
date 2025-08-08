'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';

export const usePageLoader = () => {
  const { setLoading, setLoadingMessage } = useLoading();
  const router = useRouter();

  const navigateWithLoader = (href: string, message: string = 'Navigating...') => {
    setLoadingMessage(message);
    setLoading(true);
    router.push(href);
    
    // Auto-clear loading after navigation starts
    // The AppLoader will handle the visual loading state during transition
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const showLoader = (message: string = 'Loading...') => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  return {
    navigateWithLoader,
    showLoader,
    hideLoader,
    setLoadingMessage,
  };
};
