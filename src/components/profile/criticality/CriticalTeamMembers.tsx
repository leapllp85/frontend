'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  VStack, 
  HStack, 
  Text, 
  Box, 
  Heading,
  SimpleGrid,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { MOCK_EMPLOYEES } from '@/constants/mockData';

interface CriticalityVsRiskProps {
  userId?: string;
}

// Map mock employees to critical team members format and sort by priority
const CriticalTeamMembersData = MOCK_EMPLOYEES.map((employee, index) => ({
  name: employee.name || `${employee.first_name} ${employee.last_name}`,
  criticality: employee.project_criticality,
  attritionRisk: employee.manager_assessment_risk,
  avatarImage: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${(index % 50) + 1}.jpg`
})).sort((a, b) => {
  // Priority sorting: High criticality + High risk first
  const getPriority = (member: typeof CriticalTeamMembersData[0]) => {
    if (member.criticality === 'High' && member.attritionRisk === 'High') return 1;
    if (member.criticality === 'High' && member.attritionRisk === 'Medium') return 2;
    if (member.criticality === 'High' && member.attritionRisk === 'Low') return 3;
    if (member.criticality === 'Medium' && member.attritionRisk === 'High') return 4;
    if (member.criticality === 'Medium' && member.attritionRisk === 'Medium') return 5;
    if (member.criticality === 'Medium' && member.attritionRisk === 'Low') return 6;
    if (member.criticality === 'Low' && member.attritionRisk === 'High') return 7;
    if (member.criticality === 'Low' && member.attritionRisk === 'Medium') return 8;
    return 9;
  };
  return getPriority(a) - getPriority(b);
});  

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
      borderRadius="xl"
      border="1px solid"
      borderColor={isHovered ? colors.border : 'gray.200'}
      bg={isHovered ? colors.bg : 'white'}
      transition="all 0.2s ease"
      cursor="pointer"
      shadow="sm"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
        borderColor: colors.border
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HStack gap={3} align="center">
        {/* Avatar */}
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
          border="2px solid"
          borderColor={isHovered ? colors.border : 'gray.300'}
          transition="all 0.2s ease"
          shadow="sm"
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
        
        {/* Name and Info */}
        <VStack align="start" gap={1} flex="1" minW="0">
          <Text
            fontSize="sm"
            color="gray.900"
            fontWeight="600"
            lineClamp={1}
            letterSpacing="-0.01em"
          >
            {name}
          </Text>
          <HStack gap={2} w="full" flexWrap="wrap">
            <Badge
              colorScheme={criticality === 'High' ? 'red' : criticality === 'Medium' ? 'orange' : 'green'}
              fontSize="2xs"
              px={2}
              py={0.5}
              borderRadius="md"
              fontWeight="600"
              textTransform="uppercase"
            >
              {criticality}
            </Badge>
            <Badge
              colorScheme={attritionRisk === 'High' ? 'red' : attritionRisk === 'Medium' ? 'orange' : 'green'}
              fontSize="2xs"
              px={2}
              py={0.5}
              borderRadius="md"
              fontWeight="600"
              variant="outline"
            >
              {attritionRisk} Risk
            </Badge>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export const CriticalTeamMembers: React.FC<CriticalityVsRiskProps> = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewAllMembers = () => {
    setIsNavigating(true);
    router.push('/team');
  };

  return (
    <VStack h="full" align="stretch" gap={4}>
      {/* Header */}
      <HStack justify="space-between" align="start" pb={3} borderBottom="2px solid" borderColor="gray.200">
        <HStack gap={3} align="start">
          <Box p={2} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.100">
            <AlertCircle size={20} color="#EF4444" strokeWidth={2.5} />
          </Box>
          <VStack align="start" gap={0.5}>
            <Heading size="md" color="gray.900" fontWeight="700" letterSpacing="-0.02em">
              Top Critical Members
            </Heading>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              High priority team members requiring attention
            </Text>
          </VStack>
        </HStack>
        <Badge colorScheme="red" fontSize="xs" px={3} py={1} borderRadius="full" fontWeight="700">
          {CriticalTeamMembersData.length} Members
        </Badge>
      </HStack>

      {/* Grid of Members */}
      <SimpleGrid columns={3} gap={3} flex="1" alignItems="start">
        {CriticalTeamMembersData.slice(0, 6).map((member, index) => (
          <CriticalTeamMember 
            key={index}
            name={member.name}
            criticality={member.criticality}
            attritionRisk={member.attritionRisk}
            avatarImage={member.avatarImage}
          />
        ))}
      </SimpleGrid>
      
      {/* View More Footer */}
      <Box 
        pt={3}
        borderTop="1px solid"
        borderColor="gray.200"
        textAlign="center"
      >
        {isNavigating ? (
          <HStack justify="center" gap={2}>
            <Spinner size="sm" color="blue.600" />
            <Text fontSize="sm" color="blue.600" fontWeight="600">
              Loading...
            </Text>
          </HStack>
        ) : (
          <Text 
            fontSize="sm" 
            color="blue.600" 
            cursor="pointer" 
            fontWeight="600"
            _hover={{ color: "blue.700", textDecoration: "underline" }}
            transition="all 0.2s"
            letterSpacing="-0.01em"
            onClick={handleViewAllMembers}
          >
            View All {CriticalTeamMembersData.length} Members →
          </Text>
        )}
      </Box>
    </VStack>
  );
};