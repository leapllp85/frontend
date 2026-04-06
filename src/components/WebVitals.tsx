'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { performanceMonitor } from '@/utils/performance';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log in development
    performanceMonitor.logWebVitals(metric);
    
    // Report to analytics in production
    if (process.env.NODE_ENV === 'production') {
      performanceMonitor.reportToAnalytics(metric);
    }
  });

  useEffect(() => {
    // Log initial page load time
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      if (loadTime > 0) {
        console.log(`📈 Page Load Time: ${loadTime}ms`);
      }
    }
  }, []);

  return null;
}
