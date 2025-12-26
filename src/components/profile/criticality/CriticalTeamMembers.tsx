'use client';

import React, { useState } from 'react';
import { 
  VStack, 
  HStack, 
  Text, 
  Box, 
  Heading,
  Badge,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { AlertCircle, TrendingUp } from 'lucide-react';

interface CriticalityVsRiskProps {
  userId?: string;
}

// Removed getAvatarColor function - colors are now directly assigned in data

// Pre-sorted data by priority with reliable avatar images
const CriticalTeamMembersData = [
  // High Criticality + High Attrition Risk (Priority 1)
  {
    name: 'Alice Brown',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'David Martinez',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    name: 'Maya Patel',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    name: 'Marcus Thompson',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  // High Criticality + Medium Attrition Risk (Priority 2)
  {
    name: 'Jane Smith',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    name: 'Lisa Chen',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  // High Criticality + Low Attrition Risk (Priority 3)
  {
    name: 'Sarah Davis',
    criticality: 'High',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    name: 'Olivia Taylor',
    criticality: 'High',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  // Medium Criticality + High Attrition Risk (Priority 4)
  {
    name: 'John Doe',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    name: 'Tom Garcia',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  // Medium Criticality + Medium Attrition Risk (Priority 5)
  {
    name: 'Mike Wilson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    name: 'Alex Johnson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  // Medium Criticality + Low Attrition Risk (Priority 6)
  {
    name: 'Emma Thompson',
    criticality: 'Medium',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/7.jpg'
  },
  {
    name: 'Amy Foster',
    criticality: 'Medium',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    name: 'Tyler Brooks',
    criticality: 'Medium',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  // Low Criticality + High Attrition Risk (Priority 7)
  {
    name: 'James Rodriguez',
    criticality: 'Low',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    name: 'Ian Mitchell',
    criticality: 'Low',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/9.jpg'
  },
  {
    name: 'Kevin White',
    criticality: 'Low',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/10.jpg'
  },
  // Low Criticality + Medium Attrition Risk (Priority 8)
  {
    name: 'Nina Williams',
    criticality: 'Low',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/9.jpg'
  },
  {
    name: 'Bob Johnson',
    criticality: 'Low',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    name: 'Rachel Green',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/10.jpg'
  },
  {
    name: 'Daniel Park',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/12.jpg'
  },
  {
    name: 'Lisa Chen',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/11.jpg'
  },
  {
    name: 'Mark Taylor',
    criticality: 'High',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/men/13.jpg'
  },
  {
    name: 'Sophie Wilson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    name: 'Ryan Adams',
    criticality: 'Low',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/14.jpg'
  },
  {
    name: 'Grace Lee',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/13.jpg'
  }
];

// Total members count for "view more" display
const totalMembersCount = 50;  

const CriticalTeamMember = ({ name, criticality, attritionRisk, avatarImage }: { name: string; criticality: string; attritionRisk: string; avatarImage: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCriticalityColor = (level: string) => {
    switch(level) {
      case 'High': return { bg: 'red.50', border: 'red.300', text: 'red.600', icon: '#EF4444' };
      case 'Medium': return { bg: 'orange.50', border: 'orange.300', text: 'orange.600', icon: '#F97316' };
      default: return { bg: 'green.50', border: 'green.300', text: 'green.600', icon: '#10B981' };
    }
  };
  
  const colors = getCriticalityColor(criticality);
  
  return (
    <Box
      p={3}
      borderRadius="lg"
      border="1px solid"
      borderColor={isHovered ? colors.border : 'gray.200'}
      bg={isHovered ? colors.bg : 'white'}
      transition="all 0.2s ease"
      cursor="pointer"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VStack gap={2} align="stretch">
        {/* Avatar and Name */}
        <HStack gap={3}>
          <Box
            w="48px"
            h="48px"
            borderRadius="full"
            overflow="hidden"
            flexShrink={0}
            border="2px solid"
            borderColor={isHovered ? colors.border : 'gray.200'}
            transition="all 0.2s ease"
          >
            <img
              src={avatarImage}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div style="
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 14px;
                      font-weight: bold;
                      color: white;
                    ">
                      ${name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  `;
                }
              }}
            />
          </Box>
          
          <VStack align="start" gap={0} flex="1" minW="0">
            <Text
              fontSize="sm"
              color="gray.800"
              fontWeight="semibold"
              lineClamp={1}
            >
              {name}
            </Text>
            <HStack gap={1}>
              <TrendingUp size={12} color="#9CA3AF" />
              <Text fontSize="xs" color="gray.500">
                {attritionRisk} Risk
              </Text>
            </HStack>
          </VStack>
        </HStack>
        
        {/* Criticality Badge */}
        <Flex justify="space-between" align="center">
          <HStack gap={1}>
            <AlertCircle size={14} color={colors.icon} />
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Criticality:
            </Text>
          </HStack>
          <Badge
            colorScheme={criticality === 'High' ? 'red' : criticality === 'Medium' ? 'orange' : 'green'}
            fontSize="xs"
            px={2}
            py={0.5}
            borderRadius="md"
            fontWeight="semibold"
          >
            {criticality}
          </Badge>
        </Flex>
      </VStack>
    </Box>
  );
};

export const CriticalTeamMembers: React.FC<CriticalityVsRiskProps> = () => {
  return (
    <VStack h="full" align="stretch" gap={3}>
      {/* Header */}
      <HStack justify="space-between" align="center" pb={2} borderBottom="2px solid" borderColor="gray.200">
        <HStack gap={2}>
          <Box p={2} bg="red.50" borderRadius="lg">
            <AlertCircle size={20} color="#EF4444" />
          </Box>
          <VStack align="start" gap={0}>
            <Heading size="sm" color="gray.800" fontWeight="bold">
              Top Critical Members
            </Heading>
            <Text fontSize="xs" color="gray.500">
              High priority team members requiring attention
            </Text>
          </VStack>
        </HStack>
        <Badge colorScheme="red" fontSize="xs" px={2} py={1} borderRadius="md">
          {CriticalTeamMembersData.length} Members
        </Badge>
      </HStack>

      {/* Grid of Members */}
      <Box flex="1" overflowY="auto" pr={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#A0AEC0',
          },
        }}
      >
        <SimpleGrid columns={2} gap={3}>
          {CriticalTeamMembersData.slice(0, 12).map((member, index) => (
            <CriticalTeamMember 
              key={index}
              name={member.name}
              criticality={member.criticality}
              attritionRisk={member.attritionRisk}
              avatarImage={member.avatarImage}
            />
          ))}
        </SimpleGrid>
      </Box>
      
      {/* View More Footer */}
      <Box 
        pt={2}
        borderTop="1px solid"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text 
          fontSize="sm" 
          color="blue.500" 
          cursor="pointer" 
          fontWeight="semibold"
          _hover={{ color: "blue.600", textDecoration: "underline" }}
          transition="all 0.2s"
        >
          View All {CriticalTeamMembersData.length} Members →
        </Text>
      </Box>
    </VStack>
  );
};