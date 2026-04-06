/**
 * Attrition Analysis Modular Components
 * Barrel export file for all attrition-related components
 */

// Navigation & Layout Components
export { TabNavigation } from './TabNavigation';
export { SectionHeader } from './SectionHeader';

// Reusable UI Components
export { MetricBar } from './MetricBar';
export { StatCard } from './StatCard';
export { AlertCard } from './AlertCard';
export { ActionItemCard } from './ActionItemCard';
export { AnalysisCard } from './AnalysisCard';

// Chart Components
export { RiskDistributionCard } from './RiskDistributionCard';
export { DistributionPieChart } from './DistributionPieChart';
export type { DistributionDataItem } from './DistributionPieChart';
export { AnalysisDonutChart } from './AnalysisDonutChart';

// Legacy Components (for backward compatibility)
export { SurveySentimentBar } from './SurveySentimentBar';
export type { SentimentItem } from './SurveySentimentBar';
export { EngagementMetrics } from './EngagementMetrics';
export type { EngagementMetric } from './EngagementMetrics';
export { ActionableInsights } from './ActionableInsights';
export type { InsightCategory } from './ActionableInsights';
export { SkillGapSummary } from './SkillGapSummary';
export type { SkillGapData } from './SkillGapSummary';
export { MentalHealthSummary } from './MentalHealthSummary';
export type { MentalHealthData } from './MentalHealthSummary';
export { QuickStatCard } from './QuickStatCard';
export type { QuickStat } from './QuickStatCard';

// Tab Content Components
export { Tab1Content } from './Tab1Content';
export { Tab2Content } from './Tab2Content';
export { AttritionTabs } from './AttritionTabs';
export { AnalysisTabContent } from './AnalysisTabContent';
export { SummaryTabContent } from './SummaryTabContent';
export { RecommendationsTabContent } from './RecommendationsTabContent';
