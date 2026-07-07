/**
 * useScreenSize Hook
 * Detects screen size for corporate laptop optimization (13-16 inch)
 */

import { useState, useEffect } from 'react';

export type ScreenSize = '13inch' | '14inch' | '15inch' | '16inch';

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('15inch');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Corporate laptop breakpoints
      if (width < 1600) {
        setScreenSize('13inch'); // 1366x768, 1440x900
      } else if (width < 1920) {
        setScreenSize('14inch'); // 1600x900, 1680x1050
      } else if (width < 2560) {
        setScreenSize('15inch'); // 1920x1080, 1920x1200
      } else {
        setScreenSize('16inch'); // 2560x1600+
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

/**
 * Check if screen is small (13-14 inch)
 */
export const useIsSmallScreen = (): boolean => {
  const screenSize = useScreenSize();
  return screenSize === '13inch' || screenSize === '14inch';
};
