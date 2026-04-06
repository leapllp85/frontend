'use client';

import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { UsersRound, FolderKanban, TrendingUp, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { TeamStats, ProjectStats, ProjectRisksResponse, ProjectMetrics } from '../../services';

interface ProfileMetricsGridProps {
  teamStats: TeamStats | null;
  projectStats: ProjectStats | null;
  projectRisks: ProjectRisksResponse | null;
  metrics: ProjectMetrics | null;
}

export const ProfileMetricsGrid: React.FC<ProfileMetricsGridProps> = ({
  teamStats,
  projectStats,
  projectRisks,
  metrics,
}) => {
  const metricsConfig = [
    {
      label: 'Team Members',
      value: teamStats?.team_members_count || 0,
      icon: UsersRound,
      iconColor: '#14b8a6',
      iconBgColor: 'teal.100',
      gradientFrom: '#ccfbf1',
      gradientTo: '#f0fdfa',
      valueColor: 'gray.800',
      shadowColor: 'rgba(20, 184, 166, 0.15)',
    },
    {
      label: 'Total Projects',
      value: projectStats?.total_projects || 0,
      icon: FolderKanban,
      iconColor: '#6366f1',
      iconBgColor: 'indigo.100',
      gradientFrom: '#e0e7ff',
      gradientTo: '#eef2ff',
      valueColor: 'gray.800',
      shadowColor: 'rgba(99, 102, 241, 0.15)',
    },
    {
      label: 'Attrition Risk',
      value: `${metrics?.data?.attrition_risk || 0}%`,
      icon: TrendingUp,
      iconColor: '#f59e0b',
      iconBgColor: 'amber.100',
      gradientFrom: '#fef3c7',
      gradientTo: '#fefce8',
      valueColor: 'orange.600',
      shadowColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      label: 'Projects at Risk',
      value: projectRisks?.projects?.filter(p => p.risk_level === 'high' || p.risk_level === 'critical').length || 0,
      icon: AlertTriangle,
      iconColor: '#f43f5e',
      iconBgColor: 'rose.100',
      gradientFrom: '#ffe4e6',
      gradientTo: '#fff1f2',
      valueColor: 'red.600',
      shadowColor: 'rgba(244, 63, 94, 0.15)',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 4, xl: 4 }} gap={{ base: 3, sm: 4, lg: 5 }} w="full">
      {metricsConfig.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </SimpleGrid>
  );
};
