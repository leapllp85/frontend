// Typography utilities for responsive font sizing

// Convert px to rem (base font size is 16px)
export const pxToRem = (px: number): string => {
  return `${px / 16}rem`;
};

// Responsive font sizes based on screen size
export const responsiveFontSizes = {
  // Headings
  h1: {
    base: pxToRem(24), // 1.5rem
    sm: pxToRem(28),   // 1.75rem
    md: pxToRem(32),   // 2rem
    lg: pxToRem(36),   // 2.25rem
    xl: pxToRem(40),   // 2.5rem
  },
  h2: {
    base: pxToRem(20), // 1.25rem
    sm: pxToRem(22),   // 1.375rem
    md: pxToRem(24),   // 1.5rem
    lg: pxToRem(28),   // 1.75rem
    xl: pxToRem(30),   // 1.875rem
  },
  h3: {
    base: pxToRem(18), // 1.125rem
    sm: pxToRem(20),   // 1.25rem
    md: pxToRem(22),   // 1.375rem
    lg: pxToRem(24),   // 1.5rem
    xl: pxToRem(26),   // 1.625rem
  },
  h4: {
    base: pxToRem(16), // 1rem
    sm: pxToRem(18),   // 1.125rem
    md: pxToRem(20),   // 1.25rem
    lg: pxToRem(22),   // 1.375rem
    xl: pxToRem(24),   // 1.5rem
  },
  
  // Body text
  body: {
    base: pxToRem(14), // 0.875rem
    sm: pxToRem(15),   // 0.9375rem
    md: pxToRem(16),   // 1rem
    lg: pxToRem(17),   // 1.0625rem
    xl: pxToRem(18),   // 1.125rem
  },
  bodyLarge: {
    base: pxToRem(16), // 1rem
    sm: pxToRem(17),   // 1.0625rem
    md: pxToRem(18),   // 1.125rem
    lg: pxToRem(19),   // 1.1875rem
    xl: pxToRem(20),   // 1.25rem
  },
  bodySmall: {
    base: pxToRem(12), // 0.75rem
    sm: pxToRem(13),   // 0.8125rem
    md: pxToRem(14),   // 0.875rem
    lg: pxToRem(15),   // 0.9375rem
    xl: pxToRem(16),   // 1rem
  },
  
  // UI elements
  button: {
    base: pxToRem(14), // 0.875rem
    sm: pxToRem(15),   // 0.9375rem
    md: pxToRem(16),   // 1rem
    lg: pxToRem(17),   // 1.0625rem
    xl: pxToRem(18),   // 1.125rem
  },
  caption: {
    base: pxToRem(11), // 0.6875rem
    sm: pxToRem(12),   // 0.75rem
    md: pxToRem(13),   // 0.8125rem
    lg: pxToRem(14),   // 0.875rem
    xl: pxToRem(15),   // 0.9375rem
  },
};

// Responsive spacing (converted to rem)
export const spacing = {
  xs: {
    base: pxToRem(4),   // 0.25rem
    sm: pxToRem(6),     // 0.375rem
    md: pxToRem(8),     // 0.5rem
    lg: pxToRem(10),    // 0.625rem
    xl: pxToRem(12),    // 0.75rem
  },
  sm: {
    base: pxToRem(8),   // 0.5rem
    sm: pxToRem(10),    // 0.625rem
    md: pxToRem(12),    // 0.75rem
    lg: pxToRem(14),    // 0.875rem
    xl: pxToRem(16),    // 1rem
  },
  md: {
    base: pxToRem(12),  // 0.75rem
    sm: pxToRem(14),    // 0.875rem
    md: pxToRem(16),    // 1rem
    lg: pxToRem(18),    // 1.125rem
    xl: pxToRem(20),    // 1.25rem
  },
  lg: {
    base: pxToRem(16),  // 1rem
    sm: pxToRem(18),    // 1.125rem
    md: pxToRem(20),    // 1.25rem
    lg: pxToRem(24),    // 1.5rem
    xl: pxToRem(28),    // 1.75rem
  },
  xl: {
    base: pxToRem(24),  // 1.5rem
    sm: pxToRem(28),    // 1.75rem
    md: pxToRem(32),    // 2rem
    lg: pxToRem(40),    // 2.5rem
    xl: pxToRem(48),    // 3rem
  },
};

// Icon sizes in rem
export const iconSizes = {
  xs: pxToRem(12),   // 0.75rem
  sm: pxToRem(16),   // 1rem
  md: pxToRem(20),   // 1.25rem
  lg: pxToRem(24),   // 1.5rem
  xl: pxToRem(32),   // 2rem
  '2xl': pxToRem(40), // 2.5rem
};

// Border radius in rem
export const borderRadius = {
  sm: pxToRem(4),    // 0.25rem
  md: pxToRem(8),    // 0.5rem
  lg: pxToRem(12),   // 0.75rem
  xl: pxToRem(16),   // 1rem
  '2xl': pxToRem(24), // 1.5rem
  full: '9999px',
};

// Corporate laptop responsive font sizes
export type ScreenSize = '13inch' | '14inch' | '15inch' | '16inch';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const corporateFontSizes = {
  '13inch': {
    xs: '10px',
    sm: '11px',
    md: '12px',
    lg: '13px',
    xl: '14px',
    '2xl': '16px',
    '3xl': '18px'
  },
  '14inch': {
    xs: '10px',
    sm: '11px',
    md: '12px',
    lg: '13px',
    xl: '14px',
    '2xl': '16px',
    '3xl': '18px'
  },
  '15inch': {
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
    '2xl': '18px',
    '3xl': '20px'
  },
  '16inch': {
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
    '2xl': '18px',
    '3xl': '20px'
  }
};

/**
 * Get responsive font size based on screen size
 */
export const getResponsiveFontSize = (
  size: FontSize,
  screenSize: ScreenSize
): string => {
  return corporateFontSizes[screenSize][size];
};

/**
 * Get responsive padding based on screen size
 */
export const getResponsivePadding = (screenSize: ScreenSize) => {
  const paddingMap = {
    '13inch': { px: 4, py: 3 },
    '14inch': { px: 5, py: 4 },
    '15inch': { px: 6, py: 5 },
    '16inch': { px: 8, py: 6 }
  };
  return paddingMap[screenSize];
};

/**
 * Get responsive spacing based on screen size
 */
export const getResponsiveSpacing = (screenSize: ScreenSize) => {
  const spacingMap = {
    '13inch': 3,
    '14inch': 4,
    '15inch': 5,
    '16inch': 6
  };
  return spacingMap[screenSize];
};
