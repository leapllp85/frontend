import React from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { FileText, Users, BarChart3, AlertTriangle, UserPlus, TrendingUp, AlertCircle } from "lucide-react";

// Animation styles
const floatAnimation = {
  animation: "float 3s ease-in-out infinite",
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-5px)" },
    "100%": { transform: "translateY(0px)" }
  }
} as const;

const cardHoverStyle = {
  transform: 'translateY(-5px)',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const iconStyle = {
  padding: '12px',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

interface StatsRowProps {
  activeProjects: number;
  teamMembers?: number;
  avgUtilization?: string;
  highRiskProjects?: number;
}

const StatCard = ({ 
  icon, 
  title, 
  value, 
  color, 
  trend, 
  trendValue 
}: { 
  icon: React.ReactNode, 
  title: string, 
  value: string | number,
  color: string,
  trend?: 'up' | 'down',
  trendValue?: string
}) => (
  <Box 
    bg="white" 
    borderRadius="1rem" 
    p={5}
    position="relative"
    overflow="hidden"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
    }}
    _hover={cardHoverStyle}
    transition="all 0.3s ease"
  >
    <Box display="flex" flexDirection="column" gap={3} alignItems="flex-start">
      <Box display="flex" gap="12px" w="100%" justifyContent="space-between">
        <Box 
          {...iconStyle}
          bg={`${color}10`}
          color={color}
          sx={floatAnimation as any}
        >
          {icon}
        </Box>
        {trend && (
          <Box 
            display="flex" 
            alignItems="center" 
            px={2} 
            py={1} 
            bg={trend === 'up' ? 'green.50' : 'red.50'}
            borderRadius="full"
            color={trend === 'up' ? 'green.600' : 'red.600'}
            fontSize="xs"
            fontWeight="medium"
          >
            {trend === 'up' ? (
              <Box as={TrendingUp} boxSize="14px" mr={1} />
            ) : (
              <Box as={AlertCircle} boxSize="14px" mr={1} />
            )}
            {trendValue}
          </Box>
        )}
      </Box>
      
      <Box>
        <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
          {title}
        </Text>
        <Box display="flex" gap="8px" alignItems="flex-end">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {value}
          </Text>
          {title === 'Team Members' && (
            <Text fontSize="sm" color="green.500" display="flex" alignItems="center">
              <Box as={UserPlus} boxSize="14px" mr={1} />
              +5 this month
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  </Box>
);

export const StatsRow: React.FC<StatsRowProps> = ({
  activeProjects,
  teamMembers = 42,
  avgUtilization = "82%",
  highRiskProjects = 3
}) => {
  return (
    <SimpleGrid 
      columns={{ base: 1, sm: 2, lg: 4 }} 
      gap={{ base: 4, md: 6 }}
      w="100%"
    >
      <StatCard 
        icon={<FileText size={20} />}
        title="Active Projects"
        value={activeProjects}
        color="#3b82f6"
        trend="up"
        trendValue="+12%"
      />
      
      <StatCard 
        icon={<Users size={20} />}
        title="Team Members"
        value={teamMembers}
        color="#10b981"
      />
      
      <StatCard 
        icon={<BarChart3 size={20} />}
        title="Avg. Utilization"
        value={avgUtilization}
        color="#f59e0b"
        trend="up"
        trendValue="+5.2%"
      />
      
      <StatCard 
        icon={<AlertTriangle size={20} />}
        title="High Risk Projects"
        value={highRiskProjects}
        color="#ef4444"
        trend="down"
        trendValue="-2"
      />
    </SimpleGrid>
  );
};
