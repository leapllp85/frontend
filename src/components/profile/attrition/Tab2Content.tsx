'use client';

import React from 'react';
import { HStack, VStack, SimpleGrid } from '@chakra-ui/react';
import { Target, Lightbulb } from 'lucide-react';
import { ActionItemCard } from './ActionItemCard';
import { SectionHeader } from './SectionHeader';
import { ACTION_ITEMS, STRATEGIC_RECOMMENDATIONS } from '@/constants';

export const Tab2Content: React.FC = () => {

  return (
    <HStack h="full" gap={4} align="stretch" overflow="hidden">
      {/* Left Column - Action Items */}
      <VStack
        flex={1}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        shadow="0 1px 4px rgba(0,0,0,0.04)"
        p={5}
        align="stretch"
        gap={4}
        overflow="auto"
      >
        <SectionHeader
          title="Action Items"
          subtitle="Immediate actions required"
          icon={Target}
          iconColor="#ef4444"
          iconBg="red.50"
        />

        <SimpleGrid columns={2} gap={3}>
          {ACTION_ITEMS.map((section, i) => (
            <ActionItemCard key={i} {...section} />
          ))}
        </SimpleGrid>

      </VStack>

      {/* Right Column - Strategic Recommendations */}
      <VStack
        flex={1}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        shadow="0 1px 4px rgba(0,0,0,0.04)"
        p={5}
        align="stretch"
        gap={4}
        overflow="auto"
      >
        <SectionHeader
          title="Recommendations"
          subtitle="Strategic improvements"
          icon={Lightbulb}
          iconColor="#f59e0b"
          iconBg="amber.50"
        />
        <SimpleGrid columns={2} gap={3}>
          {STRATEGIC_RECOMMENDATIONS.map((section, i) => (
            <ActionItemCard key={i} {...section} />
          ))}
        </SimpleGrid>
      </VStack>
    </HStack>
  );
};
