'use client';

import { useState, useEffect } from 'react';

interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  isSmallDesktop: boolean;
  isLargeDesktop: boolean;
  itemsToShow: number;
}

export const useResponsive = (mobileCount: number = 3, desktopCount: number = 5): ResponsiveConfig => {
  const [config, setConfig] = useState<ResponsiveConfig>({
    isMobile: false,
    isTablet: false,
    isSmallDesktop: false,
    isLargeDesktop: true,
    itemsToShow: desktopCount,
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      // 13-14 inch screens typically range from 1280px to 1440px width
      const isSmallDesktop = width >= 1024 && width <= 1440;
      const isLargeDesktop = width > 1440;

      // Mobile: mobileCount (3)
      // Tablet: mobileCount (3)
      // Small Desktop (13-14 inch): mobileCount (3)
      // Large Desktop (>14 inch): desktopCount (5)
      let itemsToShow = desktopCount;
      if (isMobile || isTablet || isSmallDesktop) {
        itemsToShow = mobileCount;
      }

      setConfig({
        isMobile,
        isTablet,
        isSmallDesktop,
        isLargeDesktop,
        itemsToShow,
      });
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, [mobileCount, desktopCount]);

  return config;
};

export default useResponsive;
