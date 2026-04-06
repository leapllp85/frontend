'use client';

import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type BadgeColorScheme = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink' | 'gray' | 'indigo';

interface BadgeProps extends Omit<ChakraBadgeProps, 'colorScheme'> {
  colorScheme?: BadgeColorScheme;
  variant?: 'solid' | 'subtle' | 'outline';
}

const colorSchemeStyles = {
  red: {
    solid: { bg: 'red.500', color: 'white' },
    subtle: { bg: 'red.50', color: 'red.700', borderColor: 'red.200' },
    outline: { borderColor: 'red.500', color: 'red.500' },
  },
  orange: {
    solid: { bg: 'orange.500', color: 'white' },
    subtle: { bg: 'orange.50', color: 'orange.700', borderColor: 'orange.200' },
    outline: { borderColor: 'orange.500', color: 'orange.500' },
  },
  yellow: {
    solid: { bg: 'yellow.500', color: 'gray.800' },
    subtle: { bg: 'yellow.50', color: 'yellow.700', borderColor: 'yellow.200' },
    outline: { borderColor: 'yellow.500', color: 'yellow.500' },
  },
  green: {
    solid: { bg: 'green.500', color: 'white' },
    subtle: { bg: 'green.50', color: 'green.700', borderColor: 'green.200' },
    outline: { borderColor: 'green.500', color: 'green.500' },
  },
  teal: {
    solid: { bg: 'teal.500', color: 'white' },
    subtle: { bg: 'teal.50', color: 'teal.700', borderColor: 'teal.200' },
    outline: { borderColor: 'teal.500', color: 'teal.500' },
  },
  blue: {
    solid: { bg: 'blue.500', color: 'white' },
    subtle: { bg: 'blue.50', color: 'blue.700', borderColor: 'blue.200' },
    outline: { borderColor: 'blue.500', color: 'blue.500' },
  },
  cyan: {
    solid: { bg: 'cyan.500', color: 'white' },
    subtle: { bg: 'cyan.50', color: 'cyan.700', borderColor: 'cyan.200' },
    outline: { borderColor: 'cyan.500', color: 'cyan.500' },
  },
  purple: {
    solid: { bg: 'purple.500', color: 'white' },
    subtle: { bg: 'purple.50', color: 'purple.700', borderColor: 'purple.200' },
    outline: { borderColor: 'purple.500', color: 'purple.500' },
  },
  pink: {
    solid: { bg: 'pink.500', color: 'white' },
    subtle: { bg: 'pink.50', color: 'pink.700', borderColor: 'pink.200' },
    outline: { borderColor: 'pink.500', color: 'pink.500' },
  },
  gray: {
    solid: { bg: 'gray.500', color: 'white' },
    subtle: { bg: 'gray.50', color: 'gray.700', borderColor: 'gray.200' },
    outline: { borderColor: 'gray.500', color: 'gray.500' },
  },
  indigo: {
    solid: { bg: 'indigo.500', color: 'white' },
    subtle: { bg: 'indigo.50', color: 'indigo.700', borderColor: 'indigo.200' },
    outline: { borderColor: 'indigo.500', color: 'indigo.500' },
  },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ colorScheme = 'gray', variant = 'subtle', children, ...props }, ref) => {
    const styles = colorScheme && colorSchemeStyles[colorScheme]?.[variant];

    return (
      <ChakraBadge
        ref={ref}
        {...styles}
        border={variant === 'outline' ? '1px solid' : undefined}
        {...props}
      >
        {children}
      </ChakraBadge>
    );
  }
);

Badge.displayName = 'Badge';
