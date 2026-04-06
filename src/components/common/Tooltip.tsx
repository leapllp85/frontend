'use client';

import React, { useState } from 'react';
import { Box, Portal } from '@chakra-ui/react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        display="inline-block"
      >
        {children}
      </Box>
      
      {isVisible && (
        <Portal>
          <Box
            position="fixed"
            left={`${position.x}px`}
            top={`${position.y}px`}
            transform="translate(-50%, -100%)"
            bg="gray.800"
            color="white"
            px={3}
            py={2}
            borderRadius="md"
            fontSize="sm"
            maxW="300px"
            zIndex={9999}
            pointerEvents="none"
            boxShadow="lg"
          >
            {content}
            <Box
              position="absolute"
              bottom="-4px"
              left="50%"
              transform="translateX(-50%)"
              w={0}
              h={0}
              borderLeft="4px solid transparent"
              borderRight="4px solid transparent"
              borderTop="4px solid"
              borderTopColor="gray.800"
            />
          </Box>
        </Portal>
      )}
    </>
  );
};
