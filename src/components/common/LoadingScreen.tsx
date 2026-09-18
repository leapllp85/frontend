'use client';

import React from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { BarChart3, Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="#FAFBFD"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      animation="fadeIn 0.3s ease-in"
      fontFamily="Arial, Helvetica, sans-serif"
      overflow="hidden"
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.34; transform: scale(1); }
            50% { opacity: 0.12; transform: scale(1.18); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          @keyframes dash {
            0% { width: 18%; transform: translateX(-20%); }
            50% { width: 48%; transform: translateX(78%); }
            100% { width: 18%; transform: translateX(455%); }
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .shimmer-text {
            background: linear-gradient(90deg, 
              #0B0C1C 0%, 
              #1D7FE3 50%, 
              #0B0C1C 100%);
            background-size: 1000px 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }
        `}
      </style>

      <Box position="absolute" inset={0} bgImage="linear-gradient(rgba(113,128,155,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(113,128,155,0.08) 1px, transparent 1px)" bgSize="36px 36px" opacity={0.65} />
      <Box position="absolute" top="-180px" right="-120px" w="420px" h="420px" borderRadius="full" bg="#E7F0FC" opacity={0.82} />
      <Box position="absolute" bottom="-180px" left="-110px" w="360px" h="360px" borderRadius="full" bg="#E7F0FC" opacity={0.62} />

      <VStack
        gap={7}
        align="center"
        position="relative"
        zIndex={1}
        bg="rgba(255,255,255,0.9)"
        border="1px solid #E6EAF0"
        borderRadius="18px"
        boxShadow="0 24px 70px rgba(11, 12, 28, 0.08)"
        px={{ base: "28px", md: "44px" }}
        py={{ base: "34px", md: "42px" }}
        minW={{ base: "calc(100vw - 40px)", sm: "420px" }}
      >
        <Box position="relative" className="float-animation">
          <Box
            position="absolute"
            inset="-18px"
            borderRadius="full"
            border="1px solid #6EA0E6"
            className="pulse-animation"
          />
          
          <Box
            w="92px"
            h="92px"
            borderRadius="24px"
            bg="linear-gradient(135deg, #FFFFFF 0%, #E7F0FC 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 18px 42px rgba(29, 127, 227, 0.14)"
            border="1px solid #D5E5FA"
            position="relative"
          >
            <BarChart3 size={38} color="#1D7FE3" strokeWidth={2.15} />
            <Box position="absolute" right="-6px" top="-6px" w="30px" h="30px" borderRadius="10px" bg="#FFFFFF" border="1px solid #E6EAF0" color="#1D7FE3" display="flex" alignItems="center" justifyContent="center" boxShadow="0 10px 24px rgba(11,12,28,0.08)">
              <Sparkles size={15} strokeWidth={2.3} />
            </Box>
          </Box>
        </Box>

        <VStack gap={2.5} align="center">
          <Text
            fontSize={{ base: "24px", md: "28px" }}
            fontWeight="800"
            color="#0B0C1C"
            textAlign="center"
            className="shimmer-text"
            letterSpacing="0"
            lineHeight="1.1"
          >
            Preparing your dashboard
          </Text>
          
          <Text
            fontSize="13px"
            color="#3D4B68"
            fontWeight="700"
            textAlign="center"
            maxW="340px"
            lineHeight="1.5"
          >
            Loading your team insights, action signals, and latest workspace context.
          </Text>
        </VStack>

        <Box w="260px" maxW="100%" h="8px" borderRadius="full" bg="#EEF1F5" overflow="hidden" border="1px solid #E6EAF0">
          <Box
            h="full"
            borderRadius="full"
            bg="linear-gradient(90deg, #6EA0E6 0%, #1D7FE3 100%)"
            animation="dash 1.6s ease-in-out infinite"
          />
        </Box>

        <HStack gap={2}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="7px"
              h="7px"
              borderRadius="full"
              bg={i === 1 ? "#1D7FE3" : "#6EA0E6"}
              opacity={0.72}
              animation="pulse 1.7s ease-in-out infinite"
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};
