import { TeamMember } from '@/types';

/**
 * Calculate suggested attrition risk based on multiple risk factors
 * @param member - Team member with risk factors
 * @returns Calculated risk level
 */
export const calculateSuggestedRisk = (member: {
  mentalHealth: 'High' | 'Medium' | 'Low';
  motivationFactor: 'High' | 'Medium' | 'Low';
  careerOpportunities: 'High' | 'Medium' | 'Low';
  personalReason: 'High' | 'Medium' | 'Low';
}): 'High' | 'Medium' | 'Low' => {
  const riskValues = {
    'High': 3,
    'Medium': 2,
    'Low': 1
  };
  
  const total = riskValues[member.mentalHealth] + 
               riskValues[member.motivationFactor] + 
               riskValues[member.careerOpportunities] + 
               riskValues[member.personalReason];
  
  const average = total / 4;
  
  if (average >= 2.5) return 'High';
  if (average >= 1.5) return 'Medium';
  return 'Low';
};

/**
 * Calculate team attrition risk percentage
 * @param members - Array of team members
 * @returns Percentage of team at high risk
 */
export const calculateTeamAttritionRisk = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const highRiskCount = members.filter(m => m.attritionRisk === 'High').length;
  return Math.round((highRiskCount / members.length) * 100);
};

/**
 * Calculate team mental health score
 * @param members - Array of team members
 * @returns Average mental health score (0-100)
 */
export const calculateTeamMentalHealth = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const scoreMap = { 'High': 100, 'Medium': 60, 'Low': 30 };
  const total = members.reduce((sum, m) => sum + (scoreMap[m.mentalHealth] || 60), 0);
  return Math.round(total / members.length);
};

/**
 * Calculate average team utilization
 * @param members - Array of team members
 * @returns Average utilization percentage
 */
export const calculateAverageUtilization = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const total = members.reduce((sum, m) => sum + (m.utilization || 0), 0);
  return Math.round(total / members.length);
};

/**
 * Calculate average team age
 * @param members - Array of team members
 * @returns Average age
 */
export const calculateAverageAge = (members: TeamMember[]): number => {
  if (members.length === 0) return 0;
  const total = members.reduce((sum, m) => sum + m.age, 0);
  return Math.round(total / members.length);
};
