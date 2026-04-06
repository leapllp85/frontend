'use client';

import React from 'react';
import { VStack, Grid } from '@chakra-ui/react';
import { SkillGapSummary, SkillGapData } from './SkillGapSummary';
import { MentalHealthSummary, MentalHealthData } from './MentalHealthSummary';
import { QuickStatCard, QuickStat } from './QuickStatCard';

interface SummaryTabContentProps {
  skillGapData: SkillGapData;
  mentalHealthData: MentalHealthData;
  quickStats: QuickStat[];
}

export const SummaryTabContent: React.FC<SummaryTabContentProps> = ({
  skillGapData,
  mentalHealthData,
  quickStats
}) => {
  return (
    <VStack gap={2} h="full" p={2} align="stretch">
      {/* Top Row - Skill Gap, Mental Health, and Quick Stats */}
      <Grid templateColumns="1fr 1fr 0.8fr" gap={2}>
        <SkillGapSummary data={skillGapData} />
        <MentalHealthSummary data={mentalHealthData} />
        <QuickStatCard stats={quickStats} />
      </Grid>
    </VStack>
  );
};
