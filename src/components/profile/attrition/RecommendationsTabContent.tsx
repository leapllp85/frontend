'use client';

import React from 'react';
import { HStack } from '@chakra-ui/react';
import { ActionableInsights, InsightCategory } from './ActionableInsights';

interface RecommendationsTabContentProps {
  immediateActions: InsightCategory[];
  preventiveMeasures: InsightCategory[];
}

export const RecommendationsTabContent: React.FC<RecommendationsTabContentProps> = ({
  immediateActions,
  preventiveMeasures
}) => {
  return (
    <HStack gap={3} h="full" p={2} align="stretch">
      <ActionableInsights
        categories={immediateActions}
        title="Immediate Actions"
        emoji="🎯"
      />
      <ActionableInsights
        categories={preventiveMeasures}
        title="Preventive Measures"
        emoji="💡"
      />
    </HStack>
  );
};
