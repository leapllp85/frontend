'use client';

import React from 'react';
import { Box, VStack, Text, Spinner } from '@chakra-ui/react';
import { Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      animation="fadeIn 0.3s ease-in"
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .shimmer-text {
            background: linear-gradient(90deg, 
              rgba(255,255,255,0.8) 0%, 
              rgba(255,255,255,1) 50%, 
              rgba(255,255,255,0.8) 100%);
            background-size: 1000px 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }
        `}
      </style>

      <VStack gap={8} align="center">
        {/* Animated Icon */}
        <Box
          position="relative"
          className="float-animation"
        >
          {/* Outer Glow Ring */}
          <Box
            position="absolute"
            top="-20px"
            left="-20px"
            w="140px"
            h="140px"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.1)"
            className="pulse-animation"
          />
          
          {/* Main Icon Container */}
          <Box
            w="100px"
            h="100px"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(10px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
            border="2px solid rgba(255, 255, 255, 0.3)"
          >
            <Sparkles 
              size={48} 
              color="white"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}
            />
          </Box>
        </Box>

        {/* Loading Text */}
        <VStack gap={3} align="center">
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="white"
            textAlign="center"
            className="shimmer-text"
            letterSpacing="wide"
          >
            Preparing Your Space
          </Text>
          
          <Text
            fontSize="md"
            color="whiteAlpha.800"
            textAlign="center"
            className="pulse-animation"
          >
            Setting up your personalized dashboard...
          </Text>
        </VStack>

        {/* Custom Spinner */}
        <Box position="relative" w="60px" h="60px">
          <Box
            position="absolute"
            top={0}
            left={0}
            w="60px"
            h="60px"
            border="4px solid rgba(255, 255, 255, 0.2)"
            borderTop="4px solid white"
            borderRadius="full"
            animation="rotate 1s linear infinite"
          />
          <Box
            position="absolute"
            top="10px"
            left="10px"
            w="40px"
            h="40px"
            border="4px solid rgba(255, 255, 255, 0.2)"
            borderTop="4px solid white"
            borderRadius="full"
            animation="rotate 1.5s linear infinite reverse"
          />
        </Box>

        {/* Progress Dots */}
        <Box display="flex" gap={2}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="10px"
              h="10px"
              borderRadius="full"
              bg="white"
              opacity={0.6}
              animation={`pulse 1.5s ease-in-out infinite`}
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </Box>
      </VStack>
    </Box>
  );
};
