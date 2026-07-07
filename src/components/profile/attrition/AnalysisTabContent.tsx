'use client';

import React from 'react';
import { HStack, VStack, Grid, Box } from '@chakra-ui/react';
import { RiskDistributionCard } from './RiskDistributionCard';
import { DistributionPieChart, DistributionDataItem } from './DistributionPieChart';
import { AnalysisDonutChart } from './AnalysisDonutChart';
import { SurveySentimentBar, SentimentItem } from './SurveySentimentBar';
import { EngagementMetrics, EngagementMetric } from './EngagementMetrics';
import { AttritionTrendsPanel } from '../AttritionTrendsPanel';

interface AnalysisTabContentProps {
  riskData: Record<string, Record<string, number>>;
  distributionData: DistributionDataItem[];
  analysisDonutData: any;
  surveySentimentData: SentimentItem[];
  engagementData: EngagementMetric[];
}

export const AnalysisTabContent: React.FC<AnalysisTabContentProps> = ({
  riskData,
  distributionData,
  analysisDonutData,
  surveySentimentData,
  engagementData
}) => {
  return (
    <HStack gap={2} h="full" align="stretch">
      {/* Left Column - Risk Distribution Cards */}
      <VStack flex="1" gap={2} align="stretch" minW="0">
        <Grid templateColumns="repeat(2, 1fr)" gap={2} flex="1">
          {Object.entries(riskData).map(([category, items]) => (
            <RiskDistributionCard
              key={category}
              category={category}
              items={Object.entries(items).map(([label, value]) => ({
                label,
                value
              }))}
            />
          ))}
        </Grid>
      </VStack>

      {/* Middle Column - Charts */}
      <VStack flex="0.6" gap={2} align="stretch" minW="0">
        {/* Distribution Pie Chart */}
        <Box
          flex="1"
          p={3}
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          shadow="sm"
        >
          <DistributionPieChart
            data={distributionData}
            title="Distribution"
          />
        </Box>

        {/* Analysis Donut Chart */}
        <Box
          flex="1"
          p={3}
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          shadow="sm"
        >
          <AnalysisDonutChart
            data={analysisDonutData}
            title="Analysis"
            centerText="145"
            centerSubtext="Total"
          />
        </Box>
      </VStack>

      {/* Right Column - Survey & Engagement */}
      <VStack flex="0.6" gap={2} align="stretch" minW="0">
        <Grid templateColumns="repeat(2, 1fr)" gap={2} flex={1}>
          <VStack gap={2} align="stretch">
            {/* Survey Sentiment */}
            <SurveySentimentBar items={surveySentimentData} />
          </VStack>

          <VStack gap={2} align="stretch">
            {/* Engagement Metrics */}
            <EngagementMetrics metrics={engagementData} />
          </VStack>
        </Grid>
      </VStack>

      {/* Attrition Trends Panel */}
      <VStack
        align="stretch"
        justify="flex-start"
        h="full"
        flex="1"
        minW="0"
        maxW="25%"
        gap={2}
        minH="0"
        px={2}
        py={2}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        shadow="lg"
        transition="all 0.3s ease"
        cursor="pointer"
        _hover={{
          shadow: "lg",
          transform: "scale(1.05)",
          borderColor: "orange.300",
          zIndex: 10
        }}
      >
        <AttritionTrendsPanel trends={undefined} />
      </VStack>
    </HStack>
  );
};
