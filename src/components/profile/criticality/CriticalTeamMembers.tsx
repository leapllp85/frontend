'use client';

import React from 'react';
import { 
  VStack, 
  HStack, 
  Text, 
  Box, 
  Heading,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';

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
  }
];

// Total members count for "view more" display
const totalMembersCount = 50;  

const CriticalTeamMember = ({ name, criticality, attritionRisk, avatarImage }: { name: string; criticality: string; attritionRisk: string; avatarImage: string }) => {
  return (
    <HStack py={1} w="full" minH="2px" gap={1.0}>
      <HStack gap={2} flex="1" minW="0">
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
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
                    background: #CBD5E0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
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

        <Text
          fontSize="xs" 
          color="gray.700" 
          fontWeight="medium"
          lineClamp={1}
          flex="1"
        >{name}</Text>
      </HStack>
      <Text
        fontSize="xs"
        fontWeight="medium"
        color={
          criticality === 'High' ? 'red.500' :
          criticality === 'Medium' ? 'yellow.500' :
          'green.500'
        }
      >
        {criticality}
      </Text>
    </HStack>
  );
};



export const CriticalTeamMembers: React.FC<CriticalityVsRiskProps> = () => {
  return (
    <Box 
     bg="#ffffff"
      shadow="xs" 
      borderRadius="3xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
      transition="all 0.2s ease"
      w="full"
      suppressHydrationWarning
    >
      <Box px={2} py={2}>
        <VStack gap={1}>
          <Heading 
            size="md"
            color="gray.900"
            textAlign="center"
            fontWeight="normal"
          >
            Top 5% Critical Members
          </Heading>
          <Box 
                          w="80%" 
                          h="0.9px" 
                          bg="linear-gradient(90deg, transparent 0%, red 50%, transparent 100%)"
                      />
        </VStack>
      </Box>
      <Box h="full" display="flex" flexDirection="column" w="full" px={10} py={2} position="center">
        <SimpleGrid columns={2} gap={2} w="95%" h="98%">
          {CriticalTeamMembersData.slice(0, 10).map((member, index) => (
            <Box key={index} w="98%">
              <CriticalTeamMember 
                name={member.name}
                criticality={member.criticality}
                attritionRisk={member.attritionRisk}
                avatarImage={member.avatarImage}
              />
            </Box>
          ))}
        </SimpleGrid>
        
        {/* View More Link */}
        <Box 
          mt={-1}
          display="flex"
          justifyContent="flex-end"
          w="full"
        >
          <Text 
            fontSize="xs" 
            color="teal.500" 
            cursor="pointer" 
            fontWeight="sm"
            _hover={{ color: "teal.600" }}
            // bg="white"
            px={0}
            py={0}
            // borderRadius="md"
            // shadow="sm"
          >
            +{totalMembersCount - CriticalTeamMembersData.length} more
          </Text>
        </Box>
      </Box>
    </Box>
  );
};