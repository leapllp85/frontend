import { TeamMember } from "@/types";
import { AlertTriangle, Brain, Activity, Star, Calendar } from 'lucide-react';

interface InsightsProps {
    teamAttritionRisk: () => number;
    teamMentalHealth: () => number;
    avgUtilization: () => number;
    topTalent: () => TeamMember[];
    averageAge: () => number;
}

export const insights = ({
    teamAttritionRisk,
    teamMentalHealth,
    avgUtilization,
    topTalent,
    averageAge
}: InsightsProps) => ([
    {
        title: "Team Attrition Risk",
        description: "Percentage of employees at risk of attrition",
        metric: "team_attrition_risk",
        color: "red",
        icon: AlertTriangle,
        bg:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        value: `${teamAttritionRisk()}%`,
        badge: teamAttritionRisk() > 30 ? 'HIGH RISK' : teamAttritionRisk() > 15 ? 'MEDIUM' : 'LOW RISK'
    },
    {
        title: "Team Mental Health",
        description: "Average mental health score of the team",
        metric: "team_mental_health",
        color: "blue",
        icon: Brain,
        bg:"linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        value: `${teamMentalHealth()}%`,
        badge: teamMentalHealth() > 80 ? 'EXCELLENT' : teamMentalHealth() > 60 ? 'GOOD' : 'NEEDS ATTENTION'
    },
    {
        title: "Average Utilization",
        description: "Average utilization of the team",
        metric: "avg_utilization",
        color: "green",
        icon: Activity,
        bg:"linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        value: `${avgUtilization()}%`,
        badge: avgUtilization() > 90 ? 'OVERLOADED' : avgUtilization() > 80 ? 'OPTIMAL' : 'UNDERUTILIZED'
    },
    {
        title: "Top Talent",
        description: "Top talent in the team",
        metric: "top_talent",
        color: "yellow",
        icon: Star,
        bg:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        value: topTalent().length,
        badge: "STARS"
    },
    {
        title: "Average Age",
        description: "Average age of the team",
        metric: "average_age",
        color: "orange",
        icon: Calendar,
        bg:"linear-gradient(135deg, #10b981 0%, #059669 100%)",
        value: averageAge(),
        badge: "YEARS"
    },
]);
