'use client';

import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Progress,
} from '@chakra-ui/react';
import { Zap, Briefcase, CheckCircle, Sparkles, Heart, Battery, ArrowRight } from 'lucide-react';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { energy: string; workload: string }) => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [energy, setEnergy] = useState<string | null>(null);
  const [workload, setWorkload] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (energy && workload) {
      setIsSubmitting(true);
      setTimeout(() => {
        onComplete({ energy, workload });
        // Don't call onClose() - let parent component handle closing
        // This prevents popup window from closing before trend is shown
      }, 800);
    }
  };

  const energyOptions = [
    {
      value: 'low',
      label: 'Low Energy',
      emojiGif: 'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif',
      icon: Battery,
      color: '#ef4444',
      bgColor: '#fee2e2',
      description: 'Feeling drained',
    },
    {
      value: 'medium',
      label: 'Medium Energy',
      emojiGif: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
      icon: Zap,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      description: 'Feeling okay',
    },
    {
      value: 'high',
      label: 'High Energy',
      emojiGif: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
      icon: Sparkles,
      color: '#10b981',
      bgColor: '#d1fae5',
      description: 'Feeling great!',
    },
  ];

  const workloadOptions = [
    {
      value: 'yes',
      label: 'Yes, Manageable',
      emojiGif: 'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif',
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#d1fae5',
      description: 'I can handle it',
    },
    {
      value: 'no',
      label: 'No, Overwhelming',
      emojiGif: 'https://media.giphy.com/media/55itGuoAJiZEEen9gg/giphy.gif',
      icon: Briefcase,
      color: '#ef4444',
      bgColor: '#fee2e2',
      description: 'Need support',
    },
  ];

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      backdropFilter="blur(8px)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Don't allow closing by clicking outside
        }
      }}
    >
      <Box
        bg="white"
        borderRadius="3xl"
        shadow="2xl"
        maxW="700px"
        w="90%"
        transform={isSubmitting ? 'scale(0.95)' : 'scale(1)'}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {/* Header */}
        <Box
          bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
          p={6}
          position="relative"
          overflow="hidden"
        >
          {/* Animated background elements */}
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="whiteAlpha.200"
            animation="float 6s ease-in-out infinite"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="100px"
            h="100px"
            borderRadius="full"
            bg="whiteAlpha.100"
            animation="float 4s ease-in-out infinite"
          />

          <VStack gap={2} position="relative" zIndex={1}>
            <Box p={3} bg="whiteAlpha.200" borderRadius="full">
              <Heart size={32} color="white" />
            </Box>
            <Heading size="lg" color="white" textAlign="center">
              Daily Check-In ✨
            </Heading>
            <Text color="whiteAlpha.900" fontSize="sm" textAlign="center">
              Help us understand how you're doing today
            </Text>
          </VStack>
        </Box>

        {/* Content - All Questions in One View */}
        <Box p={8}>
          <VStack gap={8} align="stretch">
            {/* Question 1: Energy Level */}
            <VStack gap={4} align="stretch">
              <VStack gap={1}>
                <Text fontSize="xl" fontWeight="bold" color="gray.900" textAlign="center">
                  ⚡ How's your energy today?
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Be honest - this helps us support you better
                </Text>
              </VStack>

              <HStack gap={3} justify="center" flexWrap="wrap">
                {energyOptions.map((option) => (
                  <Box
                    key={option.value}
                    as="button"
                    w="180px"
                    p={4}
                    borderRadius="2xl"
                    border="3px solid"
                    borderColor={energy === option.value ? option.color : 'gray.200'}
                    bg={energy === option.value ? option.bgColor : 'white'}
                    cursor="pointer"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      transform: 'translateY(-6px) scale(1.05)',
                      shadow: '2xl',
                      borderColor: option.color,
                    }}
                    onClick={() => setEnergy(option.value)}
                  >
                    <VStack gap={3}>
                      <Box
                        w="80px"
                        h="80px"
                        borderRadius="xl"
                        overflow="hidden"
                        border="2px solid"
                        borderColor={option.color}
                        bg={option.bgColor}
                      >
                        <img
                          src={option.emojiGif}
                          alt={option.label}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <VStack gap={0}>
                        <Text fontSize="md" fontWeight="bold" color="gray.900" textAlign="center">
                          {option.label}
                        </Text>
                        <Text fontSize="xs" color="gray.600" textAlign="center">
                          {option.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </HStack>
            </VStack>

            {/* Divider */}
            <Box h="1px" bg="gray.200" />

            {/* Question 2: Workload */}
            <VStack gap={4} align="stretch">
              <VStack gap={1}>
                <Text fontSize="xl" fontWeight="bold" color="gray.900" textAlign="center">
                  💼 Is your workload manageable?
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  We're here to help if you need it
                </Text>
              </VStack>

              <HStack gap={3} justify="center" flexWrap="wrap">
                {workloadOptions.map((option) => (
                  <Box
                    key={option.value}
                    as="button"
                    w="180px"
                    p={4}
                    borderRadius="2xl"
                    border="3px solid"
                    borderColor={workload === option.value ? option.color : 'gray.200'}
                    bg={workload === option.value ? option.bgColor : 'white'}
                    cursor="pointer"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      transform: 'translateY(-6px) scale(1.05)',
                      shadow: '2xl',
                      borderColor: option.color,
                    }}
                    onClick={() => setWorkload(option.value)}
                  >
                    <VStack gap={3}>
                      <Box
                        w="80px"
                        h="80px"
                        borderRadius="xl"
                        overflow="hidden"
                        border="2px solid"
                        borderColor={option.color}
                        bg={option.bgColor}
                      >
                        <img
                          src={option.emojiGif}
                          alt={option.label}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <VStack gap={0}>
                        <Text fontSize="md" fontWeight="bold" color="gray.900" textAlign="center">
                          {option.label}
                        </Text>
                        <Text fontSize="xs" color="gray.600" textAlign="center">
                          {option.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </HStack>
            </VStack>

            {/* Submit Button */}
            <Button
              size="lg"
              bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              color="white"
              borderRadius="xl"
              h="56px"
              fontSize="lg"
              fontWeight="bold"
              disabled={!energy || !workload || isSubmitting}
              loading={isSubmitting}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'xl',
              }}
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
                transform: 'none',
              }}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : energy && workload ? (
                <HStack gap={2}>
                  <Text>Submit Check-In</Text>
                  <ArrowRight size={20} />
                </HStack>
              ) : (
                'Please answer both questions'
              )}
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </Box>
  );
};
