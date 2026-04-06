'use client';

import React from 'react';
import { HStack, VStack, Box } from '@chakra-ui/react';
import { GraduationCap, HeartPulse, MessageSquare, BarChart3 } from 'lucide-react';
import { AlertCard } from './AlertCard';
import { StatCard } from './StatCard';
import { MetricBar } from './MetricBar';
import { SectionHeader } from './SectionHeader';
import {
  QUICK_STATS,
  SURVEY_SENTIMENT_METRICS,
  CONTENT_CONSUMPTION_METRICS,
  SKILL_GAP_DATA,
  MENTAL_HEALTH_DATA,
} from '@/constants';

export const Tab1Content: React.FC = () => {

  return (
    <HStack gap={4} h="full" align="stretch" w="full">
      {/* Left Column - Key Alerts */}
      <VStack flex={1} gap={2} align="stretch" minH="0">
        <AlertCard
          title="Skill Gap"
          icon={GraduationCap}
          iconColor="#3b82f6"
          iconBg="blue.50"
          stats={SKILL_GAP_DATA.stats}
          sectionTitle="Focus Areas"
          tags={SKILL_GAP_DATA.focusAreas}
        />

        <AlertCard
          title="Mental Health"
          icon={HeartPulse}
          iconColor="#ec4899"
          iconBg="pink.50"
          stats={MENTAL_HEALTH_DATA.stats}
          badge={{ text: 'Action Required', colorScheme: 'red' }}
          sectionTitle="Recommended"
          items={MENTAL_HEALTH_DATA.recommendedActions.slice(0,2)}
        />
      </VStack>

      {/* Middle Column - Quick Stats */}
      <VStack w="200px" flexShrink={0} gap={2} align="stretch" justify="flex-start">
        {QUICK_STATS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </VStack>

      {/* Right Column - Engagement Metrics */}
      <VStack flex={1} gap={2} align="stretch" minH="0">
        {/* Survey Sentiment */}
        <Box
          p={4}
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          shadow="0 1px 4px rgba(0,0,0,0.04)"
        >
          <SectionHeader
            title="Survey Sentiment"
            subtitle=""
            icon={MessageSquare}
            iconColor="#3b82f6"
            iconBg="blue.50"
          />
          <VStack align="stretch" gap={3} mt={4}>
            {SURVEY_SENTIMENT_METRICS.map((item, i) => (
              <MetricBar key={i} {...item} />
            ))}
          </VStack>
        </Box>

        {/* Content Consumption */}
        <Box
          p={4}
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          shadow="0 1px 4px rgba(0,0,0,0.04)"
        >
          <SectionHeader
            title="Content Consumption"
            subtitle=""
            icon={BarChart3}
            iconColor="#10b981"
            iconBg="green.50"
          />
          <VStack align="stretch" gap={2} mt={4}>
            {CONTENT_CONSUMPTION_METRICS.map((item, i) => (
              <MetricBar key={i} {...item} labelWidth="80px" />
            ))}
          </VStack>
        </Box>
      </VStack>
    </HStack>
  );
};
