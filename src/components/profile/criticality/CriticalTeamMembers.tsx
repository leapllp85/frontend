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
  Button,
  IconButton,
  Dialog,
} from '@chakra-ui/react';
import { AlertCircle, TrendingUp, Calendar, User, X, Shield, MapPin, Clock, MoreVertical, ChevronLeft, ChevronRight, Code, Cloud, Database, Server, Layout, Globe, Cpu, Layers, Terminal } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

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
    avatarImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    skillAtRisk: 'React Development',
    closeMatchForReplacement: 'Lisa Chen',
    backupAvatar: 'https://randomuser.me/api/portraits/women/14.jpg'
  },
  {
    name: 'David Martinez',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    skillAtRisk: 'Python Backend',
    closeMatchForReplacement: 'Tom Garcia',
    backupAvatar: 'https://randomuser.me/api/portraits/men/15.jpg'
  },
  {
    name: 'Maya Patel',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    skillAtRisk: 'UI/UX Design',
    closeMatchForReplacement: 'Emma Thompson',
    backupAvatar: 'https://randomuser.me/api/portraits/women/16.jpg'
  },
  {
    name: 'Marcus Thompson',
    criticality: 'High',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    skillAtRisk: 'DevOps Engineering',
    closeMatchForReplacement: 'Mike Wilson',
    backupAvatar: 'https://randomuser.me/api/portraits/men/16.jpg'
  },
  // High Criticality + Medium Attrition Risk (Priority 2)
  {
    name: 'Jane Smith',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/3.jpg',
    skillAtRisk: 'Project Management',
    closeMatchForReplacement: 'Rachel Green',
    backupAvatar: 'https://randomuser.me/api/portraits/women/17.jpg'
  },
  {
    name: 'Lisa Chen',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    skillAtRisk: 'Data Analysis',
    closeMatchForReplacement: 'Sophie Wilson',
    backupAvatar: 'https://randomuser.me/api/portraits/women/18.jpg'
  },
  // High Criticality + Low Attrition Risk (Priority 3)
  {
    name: 'Sarah Davis',
    criticality: 'High',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/5.jpg',
    skillAtRisk: 'QA Testing',
    closeMatchForReplacement: 'Amy Foster',
    backupAvatar: 'https://randomuser.me/api/portraits/women/19.jpg'
  },
  {
    name: 'Olivia Taylor',
    criticality: 'High',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/6.jpg',
    skillAtRisk: 'Cloud Architecture',
    closeMatchForReplacement: 'Daniel Park',
    backupAvatar: 'https://randomuser.me/api/portraits/men/17.jpg'
  },
  // Medium Criticality + High Attrition Risk (Priority 4)
  {
    name: 'John Doe',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    skillAtRisk: 'Mobile Development',
    closeMatchForReplacement: 'Ryan Adams',
    backupAvatar: 'https://randomuser.me/api/portraits/men/18.jpg'
  },
  {
    name: 'Tom Garcia',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    skillAtRisk: 'Database Design',
    closeMatchForReplacement: 'Alex Johnson',
    backupAvatar: 'https://randomuser.me/api/portraits/men/19.jpg'
  },
  // Medium Criticality + Medium Attrition Risk (Priority 5)
  {
    name: 'Mike Wilson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    skillAtRisk: 'Security Engineering',
    closeMatchForReplacement: 'Kevin White',
    backupAvatar: 'https://randomuser.me/api/portraits/men/20.jpg'
  },
  {
    name: 'Alex Johnson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/6.jpg',
    skillAtRisk: 'API Development',
    closeMatchForReplacement: 'Tyler Brooks',
    backupAvatar: 'https://randomuser.me/api/portraits/men/21.jpg'
  },
  // Medium Criticality + Low Attrition Risk (Priority 6)
  {
    name: 'Emma Thompson',
    criticality: 'Medium',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/7.jpg',
    skillAtRisk: 'Frontend Development',
    closeMatchForReplacement: 'Grace Lee',
    backupAvatar: 'https://randomuser.me/api/portraits/women/20.jpg'
  },
  {
    name: 'Amy Foster',
    criticality: 'Medium',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/women/8.jpg',
    skillAtRisk: 'Business Analysis',
    closeMatchForReplacement: 'Nina Williams',
    backupAvatar: 'https://randomuser.me/api/portraits/women/21.jpg'
  },
  {
    name: 'Tyler Brooks',
    criticality: 'Medium',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/men/7.jpg',
    skillAtRisk: 'System Administration',
    closeMatchForReplacement: 'Mark Taylor',
    backupAvatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  // Low Criticality + High Attrition Risk (Priority 7)
  {
    name: 'James Rodriguez',
    criticality: 'Low',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/8.jpg',
    skillAtRisk: 'Machine Learning',
    closeMatchForReplacement: 'Ian Mitchell',
    backupAvatar: 'https://randomuser.me/api/portraits/men/23.jpg'
  },
  {
    name: 'Ian Mitchell',
    criticality: 'Low',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/9.jpg',
    skillAtRisk: 'Data Engineering',
    closeMatchForReplacement: 'James Rodriguez',
    backupAvatar: 'https://randomuser.me/api/portraits/men/24.jpg'
  },
  {
    name: 'Kevin White',
    criticality: 'Low',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/10.jpg',
    skillAtRisk: 'Network Engineering',
    closeMatchForReplacement: 'Bob Johnson',
    backupAvatar: 'https://randomuser.me/api/portraits/men/25.jpg'
  },
  // Low Criticality + Medium Attrition Risk (Priority 8)
  {
    name: 'Nina Williams',
    criticality: 'Low',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/9.jpg',
    skillAtRisk: 'Content Strategy',
    closeMatchForReplacement: 'Amy Foster',
    backupAvatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    name: 'Bob Johnson',
    criticality: 'Low',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/men/11.jpg',
    skillAtRisk: 'Technical Writing',
    closeMatchForReplacement: 'Nina Williams',
    backupAvatar: 'https://randomuser.me/api/portraits/women/23.jpg'
  },
  {
    name: 'Rachel Green',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/10.jpg',
    skillAtRisk: 'Product Management',
    closeMatchForReplacement: 'Jane Smith',
    backupAvatar: 'https://randomuser.me/api/portraits/women/24.jpg'
  },
  {
    name: 'Daniel Park',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/men/12.jpg',
    skillAtRisk: 'Kubernetes',
    closeMatchForReplacement: 'Marcus Thompson',
    backupAvatar: 'https://randomuser.me/api/portraits/men/26.jpg'
  },
  {
    name: 'Lisa Chen',
    criticality: 'Medium',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/women/11.jpg',
    skillAtRisk: 'Business Intelligence',
    closeMatchForReplacement: 'Sophie Wilson',
    backupAvatar: 'https://randomuser.me/api/portraits/women/25.jpg'
  },
  {
    name: 'Mark Taylor',
    criticality: 'High',
    attritionRisk: 'Low',
    avatarImage: 'https://randomuser.me/api/portraits/men/13.jpg',
    skillAtRisk: 'Infrastructure as Code',
    closeMatchForReplacement: 'Daniel Park',
    backupAvatar: 'https://randomuser.me/api/portraits/men/27.jpg'
  },
  {
    name: 'Sophie Wilson',
    criticality: 'Medium',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/12.jpg',
    skillAtRisk: 'Data Visualization',
    closeMatchForReplacement: 'Lisa Chen',
    backupAvatar: 'https://randomuser.me/api/portraits/women/26.jpg'
  },
  {
    name: 'Ryan Adams',
    criticality: 'Low',
    attritionRisk: 'High',
    avatarImage: 'https://randomuser.me/api/portraits/men/14.jpg',
    skillAtRisk: 'iOS Development',
    closeMatchForReplacement: 'John Doe',
    backupAvatar: 'https://randomuser.me/api/portraits/men/28.jpg'
  },
  {
    name: 'Grace Lee',
    criticality: 'High',
    attritionRisk: 'Medium',
    avatarImage: 'https://randomuser.me/api/portraits/women/13.jpg',
    skillAtRisk: 'Angular Development',
    closeMatchForReplacement: 'Emma Thompson',
    backupAvatar: 'https://randomuser.me/api/portraits/women/27.jpg'
  }
];

// Total members count for "view more" display
const totalMembersCount = 50;  

const CriticalTeamMember = ({ name, criticality, attritionRisk, avatarImage }: { name: string; criticality: string; attritionRisk: string; avatarImage: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleScheduleMeeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Schedule meeting with ${name}`);
  };
  
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
      position="relative"
    >
      {/* Schedule Meeting Button - Top Right */}
      <Tooltip content="Schedule 1:1" showArrow>
        <IconButton
          aria-label="Schedule meeting"
          size="xs"
          variant="ghost"
          colorScheme="blue"
          position="absolute"
          top={2}
          right={2}
          onClick={handleScheduleMeeting}
          bg="transparent"
          _hover={{
            transform: 'scale(1.1)',
            bg: 'blue.50'
          }}
          transition="all 0.2s"
        >
          <Calendar size={14} />
        </IconButton>
      </Tooltip>
      
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
  const [isSkillRiskModalOpen, setIsSkillRiskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

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
        <HStack gap={2}>
          <Text
            fontSize="sm"
            color="blue.500"
            cursor="pointer"
            fontWeight="semibold"
            _hover={{ color: "blue.600", textDecoration: "underline" }}
            transition="all 0.2s"
            onClick={() => setIsSkillRiskModalOpen(true)}
          >
            View Skill Risk >>
          </Text>
        
        </HStack>
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

      {/* Skill Risk Modal */}
      <Dialog.Root open={isSkillRiskModalOpen} onOpenChange={(e) => setIsSkillRiskModalOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="1050px" maxH="85vh">
            <Dialog.Header bg="white" borderBottom="1px solid" borderColor="gray.200" p={6} h="80px">
              <HStack justify="space-between" w="full" h="full">
                <HStack gap={3} align="center">
                  <Box w="40px" h="40px" bg="purple.50" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                    <Shield size={20} color="#9333EA" />
                  </Box>
                  <VStack align="start" gap={0} spacing={0}>
                    <Dialog.Title fontSize="lg" fontWeight="semibold" color="gray.900">
                      Skill Risk Analysis
                    </Dialog.Title>
                    <Text fontSize="sm" color="gray.500" fontWeight="normal">
                      Critical skills at risk and potential replacement candidates
                    </Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    borderColor="gray.300"
                    color="gray.700"
                    _hover={{ bg: 'gray.50' }}
                  >
                    Close
                  </Button>
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body overflowY="auto" maxH="calc(85vh - 180px)" p={8}>
              {/* Helper functions */}
              {(() => {
                const getSkillIcon = (skill: string) => {
                  if (!skill) return Terminal;
                  const skillLower = skill.toLowerCase();
                  if (skillLower.includes('react') || skillLower.includes('angular') || skillLower.includes('frontend')) return Layout;
                  if (skillLower.includes('python') || skillLower.includes('backend') || skillLower.includes('api')) return Code;
                  if (skillLower.includes('cloud') || skillLower.includes('azure') || skillLower.includes('kubernetes')) return Cloud;
                  if (skillLower.includes('database') || skillLower.includes('sql')) return Database;
                  if (skillLower.includes('devops') || skillLower.includes('infrastructure')) return Server;
                  if (skillLower.includes('mobile') || skillLower.includes('ios')) return Globe;
                  if (skillLower.includes('security')) return Shield;
                  if (skillLower.includes('machine learning') || skillLower.includes('ml')) return Cpu;
                  if (skillLower.includes('data')) return Layers;
                  return Terminal;
                };

                const getSkillCategory = (skill: string) => {
                  if (!skill) return 'Other';
                  const skillLower = skill.toLowerCase();
                  if (skillLower.includes('react') || skillLower.includes('angular') || skillLower.includes('frontend')) return 'Frontend';
                  if (skillLower.includes('python') || skillLower.includes('backend') || skillLower.includes('api') || skillLower.includes('node')) return 'Backend';
                  if (skillLower.includes('cloud') || skillLower.includes('azure') || skillLower.includes('kubernetes') || skillLower.includes('devops')) return 'DevOps';
                  if (skillLower.includes('database') || skillLower.includes('sql')) return 'Database';
                  if (skillLower.includes('mobile') || skillLower.includes('ios')) return 'Mobile';
                  if (skillLower.includes('security')) return 'Security';
                  if (skillLower.includes('machine learning') || skillLower.includes('ml') || skillLower.includes('data')) return 'Data';
                  if (skillLower.includes('design') || skillLower.includes('ux')) return 'Design';
                  if (skillLower.includes('project') || skillLower.includes('product') || skillLower.includes('management')) return 'Management';
                  if (skillLower.includes('qa') || skillLower.includes('testing')) return 'QA';
                  return 'Other';
                };

                const getRiskColor = (level: string) => {
                  if (level === 'High') return { bg: '#FEF2F2', text: '#DC2626', dot: '#DC2626', border: '#FECACA' };
                  if (level === 'Medium') return { bg: '#FFFBEB', text: '#D97706', dot: '#D97706', border: '#FDE68A' };
                  return { bg: '#F0FDF4', text: '#059669', dot: '#059669', border: '#BBF7D0' };
                };

                const getMatchScore = (index: number) => {
                  const scores = ['92%', '88%', '85%', '82%', '78%', '75%', '72%', '68%', '65%', '62%'];
                  return scores[index % scores.length];
                };

                const getMatchColor = (score: string) => {
                  const num = parseInt(score);
                  if (num >= 85) return '#10B981';
                  if (num >= 70) return '#F59E0B';
                  return '#EF4444';
                };

                return null;
              })()}

              {/* Skills at Risk Summary Card */}
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
                p={5}
                mb={6}
              >
                <Text fontSize="15px" fontWeight="600" color="gray.900" mb={4}>
                  Skills at Risk
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {CriticalTeamMembersData.slice(0, 8).map((member, index) => {
                    const getRiskColor = (level: string) => {
                      if (level === 'High') return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
                      if (level === 'Medium') return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
                      return { bg: '#F0FDF4', text: '#059669', border: '#BBF7D0' };
                    };

                    const getSkillIcon = (skill: string) => {
                      if (!skill) return Terminal;
                      const skillLower = skill.toLowerCase();
                      if (skillLower.includes('react') || skillLower.includes('angular') || skillLower.includes('frontend')) return Layout;
                      if (skillLower.includes('python') || skillLower.includes('backend') || skillLower.includes('api')) return Code;
                      if (skillLower.includes('cloud') || skillLower.includes('azure') || skillLower.includes('kubernetes')) return Cloud;
                      if (skillLower.includes('database') || skillLower.includes('sql')) return Database;
                      if (skillLower.includes('devops') || skillLower.includes('infrastructure')) return Server;
                      if (skillLower.includes('mobile') || skillLower.includes('ios')) return Globe;
                      if (skillLower.includes('security')) return Shield;
                      if (skillLower.includes('machine learning') || skillLower.includes('ml')) return Cpu;
                      if (skillLower.includes('data')) return Layers;
                      return Terminal;
                    };

                    const riskColors = getRiskColor(member.attritionRisk);
                    const SkillIcon = getSkillIcon(member.skillAtRisk);

                    return (
                      <HStack
                        key={index}
                        bg="gray.50"
                        borderRadius="md"
                        px={3}
                        py={2}
                        border="1px solid"
                        borderColor="gray.200"
                        gap={2}
                      >
                        <Box w="24px" h="24px" bg="white" borderRadius="md" display="flex" alignItems="center" justifyContent="center" shadow="sm">
                          <SkillIcon size={12} color="#64748B" />
                        </Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700">
                          {member.skillAtRisk}
                        </Text>
                        <Badge
                          bg={riskColors.bg}
                          color={riskColors.text}
                          border="1px solid"
                          borderColor={riskColors.border}
                          fontSize="11px"
                          px={2}
                          py={0.5}
                          borderRadius="md"
                          fontWeight="600"
                        >
                          {member.attritionRisk}
                        </Badge>
                      </HStack>
                    );
                  })}
                  {CriticalTeamMembersData.length > 8 && (
                    <HStack
                      bg="gray.100"
                      borderRadius="md"
                      px={3}
                      py={2}
                      border="1px dashed"
                      borderColor="gray.300"
                      gap={2}
                    >
                      <Text fontSize="13px" fontWeight="500" color="gray.600">
                        +{CriticalTeamMembersData.length - 8} More
                      </Text>
                    </HStack>
                  )}
                </Flex>
              </Box>

              {/* Table Card */}
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
                overflow="hidden"
              >
                <Box as="table" w="full" css={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                  {/* Table Header */}
                  <Box as="thead">
                    <Box as="tr" bg="#F8FAFC" h="60px">
                      <Box as="th" py={0} px={6} textAlign="left" fontSize="13px" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="0.05em">
                        Critical Skill
                      </Box>
                      <Box as="th" py={0} px={6} textAlign="left" fontSize="13px" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="0.05em">
                        Current Expert
                      </Box>
                      <Box as="th" py={0} px={6} textAlign="center" fontSize="13px" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="0.05em">
                        Risk
                      </Box>
                      <Box as="th" py={0} px={6} textAlign="left" fontSize="13px" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="0.05em">
                        Best Backup
                      </Box>
                      <Box as="th" py={0} px={6} textAlign="center" fontSize="13px" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="0.05em">
                        Match
                      </Box>
                      <Box as="th" py={0} px={3} textAlign="center" w="40px">
                      </Box>
                    </Box>
                  </Box>

                  {/* Table Body */}
                  <Box as="tbody">
                    {CriticalTeamMembersData.map((member, index) => {
                      const getRiskColor = (level: string) => {
                        if (level === 'High') return { bg: '#FEF2F2', text: '#DC2626', dot: '#DC2626' };
                        if (level === 'Medium') return { bg: '#FFFBEB', text: '#D97706', dot: '#D97706' };
                        return { bg: '#F0FDF4', text: '#059669', dot: '#059669' };
                      };

                      const getMatchScore = () => {
                        const scores = ['92%', '88%', '85%', '82%', '78%', '75%', '72%', '68%', '65%', '62%'];
                        return scores[index % scores.length];
                      };

                      const getMatchColor = (score: string) => {
                        const num = parseInt(score);
                        if (num >= 85) return '#10B981';
                        if (num >= 70) return '#F59E0B';
                        return '#EF4444';
                      };

                      const getSkillIcon = (skill: string) => {
                        if (!skill) return Terminal;
                        const skillLower = skill.toLowerCase();
                        if (skillLower.includes('react') || skillLower.includes('angular') || skillLower.includes('frontend')) return Layout;
                        if (skillLower.includes('python') || skillLower.includes('backend') || skillLower.includes('api')) return Code;
                        if (skillLower.includes('cloud') || skillLower.includes('azure') || skillLower.includes('kubernetes')) return Cloud;
                        if (skillLower.includes('database') || skillLower.includes('sql')) return Database;
                        if (skillLower.includes('devops') || skillLower.includes('infrastructure')) return Server;
                        if (skillLower.includes('mobile') || skillLower.includes('ios')) return Globe;
                        if (skillLower.includes('security')) return Shield;
                        if (skillLower.includes('machine learning') || skillLower.includes('ml')) return Cpu;
                        if (skillLower.includes('data')) return Layers;
                        return Terminal;
                      };

                      const getSkillCategory = (skill: string) => {
                        if (!skill) return 'Other';
                        const skillLower = skill.toLowerCase();
                        if (skillLower.includes('react') || skillLower.includes('angular') || skillLower.includes('frontend')) return 'Frontend';
                        if (skillLower.includes('python') || skillLower.includes('backend') || skillLower.includes('api') || skillLower.includes('node')) return 'Backend';
                        if (skillLower.includes('cloud') || skillLower.includes('azure') || skillLower.includes('kubernetes') || skillLower.includes('devops')) return 'DevOps';
                        if (skillLower.includes('database') || skillLower.includes('sql')) return 'Database';
                        if (skillLower.includes('mobile') || skillLower.includes('ios')) return 'Mobile';
                        if (skillLower.includes('security')) return 'Security';
                        if (skillLower.includes('machine learning') || skillLower.includes('ml') || skillLower.includes('data')) return 'Data';
                        if (skillLower.includes('design') || skillLower.includes('ux')) return 'Design';
                        if (skillLower.includes('project') || skillLower.includes('product') || skillLower.includes('management')) return 'Management';
                        if (skillLower.includes('qa') || skillLower.includes('testing')) return 'QA';
                        return 'Other';
                      };

                      const matchScore = getMatchScore();
                      const matchColor = getMatchColor(matchScore);
                      const riskColors = getRiskColor(member.attritionRisk);
                      const SkillIcon = getSkillIcon(member.skillAtRisk);
                      const skillCategory = getSkillCategory(member.skillAtRisk);

                      return (
                        <Box
                          as="tr"
                          key={index}
                          bg="white"
                          h="96px"
                          borderBottom="1px solid"
                          borderColor="gray.100"
                          _hover={{ bg: '#FAFBFF' }}
                          transition="all 0.15s ease"
                        >
                          {/* Critical Skill */}
                          <Box as="td" py={4} px={6}>
                            <VStack align="start" gap={1} spacing={1}>
                              <HStack gap={2} align="center">
                                <Box w="32px" h="32px" bg="gray.50" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                                  <SkillIcon size={16} color="#64748B" />
                                </Box>
                                <Text fontSize="14px" fontWeight="600" color="gray.900">
                                  {member.skillAtRisk}
                                </Text>
                              </HStack>
                              <Badge
                                bg="gray.100"
                                color="gray.600"
                                fontSize="11px"
                                px={2}
                                py={0.5}
                                borderRadius="md"
                                fontWeight="500"
                              >
                                {skillCategory}
                              </Badge>
                            </VStack>
                          </Box>

                          {/* Current Expert */}
                          <Box as="td" py={4} px={6}>
                            <VStack align="start" gap={2} spacing={2}>
                              <HStack gap={3} align="center">
                                <Box
                                  w="40px"
                                  h="40px"
                                  borderRadius="full"
                                  overflow="hidden"
                                  flexShrink={0}
                                  border="2px solid"
                                  borderColor="gray.200"
                                  cursor="pointer"
                                  onClick={() => handleEmployeeClick(member)}
                                  _hover={{ borderColor: 'blue.300' }}
                                  transition="all 0.2s"
                                >
                                  <img
                                    src={member.avatarImage}
                                    alt={member.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </Box>
                                <VStack align="start" gap={0} spacing={0}>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="blue.600"
                                    cursor="pointer"
                                    _hover={{ color: 'blue.700', textDecoration: 'underline' }}
                                    onClick={() => handleEmployeeClick(member)}
                                  >
                                    {member.name}
                                  </Text>
                                  <Text fontSize="12px" color="gray.500">
                                    Senior Software Engineer
                                  </Text>
                                </VStack>
                              </HStack>
                              <HStack gap={3} align="center">
                                <HStack gap={1} align="center">
                                  <Clock size={12} color="#9CA3AF" />
                                  <Text fontSize="12px" color="gray.500">5+ Years</Text>
                                </HStack>
                                <HStack gap={1} align="center">
                                  <MapPin size={12} color="#9CA3AF" />
                                  <Text fontSize="12px" color="gray.500">Bengaluru</Text>
                                </HStack>
                              </HStack>
                            </VStack>
                          </Box>

                          {/* Risk */}
                          <Box as="td" py={4} px={6} textAlign="center">
                            <HStack gap={2} align="center" justify="center">
                              <Box w="8px" h="8px" borderRadius="full" bg={riskColors.dot} />
                              <Badge
                                bg={riskColors.bg}
                                color={riskColors.text}
                                fontSize="13px"
                                px={3}
                                py={1}
                                borderRadius="md"
                                fontWeight="600"
                                border="none"
                              >
                                {member.attritionRisk}
                              </Badge>
                            </HStack>
                          </Box>

                          {/* Best Backup */}
                          <Box as="td" py={4} px={6}>
                            <VStack align="start" gap={2} spacing={2}>
                              <HStack gap={3} align="center">
                                <Box
                                  w="40px"
                                  h="40px"
                                  borderRadius="full"
                                  overflow="hidden"
                                  flexShrink={0}
                                  border="2px solid"
                                  borderColor="gray.200"
                                  cursor="pointer"
                                  onClick={() => handleEmployeeClick({ ...member, name: member.closeMatchForReplacement })}
                                  _hover={{ borderColor: 'blue.300' }}
                                  transition="all 0.2s"
                                >
                                  <img
                                    src={member.backupAvatar || member.avatarImage}
                                    alt={member.closeMatchForReplacement}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </Box>
                                <VStack align="start" gap={0} spacing={0}>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="blue.600"
                                    cursor="pointer"
                                    _hover={{ color: 'blue.700', textDecoration: 'underline' }}
                                    onClick={() => handleEmployeeClick({ ...member, name: member.closeMatchForReplacement })}
                                  >
                                    {member.closeMatchForReplacement}
                                  </Text>
                                  <Text fontSize="12px" color="gray.500">
                                    Software Engineer
                                  </Text>
                                </VStack>
                              </HStack>
                              <HStack gap={3} align="center">
                                <HStack gap={1} align="center">
                                  <Clock size={12} color="#9CA3AF" />
                                  <Text fontSize="12px" color="gray.500">4+ Years</Text>
                                </HStack>
                                <HStack gap={1} align="center">
                                  <MapPin size={12} color="#9CA3AF" />
                                  <Text fontSize="12px" color="gray.500">Mumbai</Text>
                                </HStack>
                              </HStack>
                            </VStack>
                          </Box>

                          {/* Match */}
                          <Box as="td" py={4} px={6} textAlign="center">
                            <VStack align="center" gap={2} spacing={2}>
                              <Text fontSize="16px" fontWeight="700" color={matchColor}>
                                {matchScore}
                              </Text>
                              <Box w="120px" h="6px" bg="gray.100" borderRadius="full" overflow="hidden">
                                <Box
                                  h="full"
                                  bg={matchColor}
                                  borderRadius="full"
                                  style={{ width: matchScore }}
                                />
                              </Box>
                            </VStack>
                          </Box>

                          {/* Row Action */}
                          <Box as="td" py={4} px={3} textAlign="center">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              aria-label="More options"
                              color="gray.400"
                              _hover={{ bg: 'gray.100', color: 'gray.600' }}
                            >
                              <MoreVertical size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack justify="space-between" w="full" pt={2}>
                <Text fontSize="13px" color="gray.500">
                  Showing {CriticalTeamMembersData.length} critical skills at risk
                </Text>
                <HStack gap={1} align="center">
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Previous page"
                    color="gray.500"
                    _hover={{ bg: 'gray.100', color: 'gray.700' }}
                    isDisabled
                  >
                    <ChevronLeft size={16} />
                  </IconButton>
                  <Button
                    size="sm"
                    variant="solid"
                    bg="blue.600"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    minW="32px"
                    h="32px"
                    px={0}
                  >
                    1
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.600"
                    _hover={{ bg: 'gray.100', color: 'gray.700' }}
                    minW="32px"
                    h="32px"
                    px={0}
                  >
                    2
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.600"
                    _hover={{ bg: 'gray.100', color: 'gray.700' }}
                    minW="32px"
                    h="32px"
                    px={0}
                  >
                    3
                  </Button>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Next page"
                    color="gray.500"
                    _hover={{ bg: 'gray.100', color: 'gray.700' }}
                  >
                    <ChevronRight size={16} />
                  </IconButton>
                </HStack>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Employee Detail Modal */}
      <Dialog.Root open={isEmployeeModalOpen} onOpenChange={(e) => setIsEmployeeModalOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="500px">
            <Dialog.Header bg="linear-gradient(to right, #DBEAFE, #bdfbfaff)" borderBottom="3px solid" borderColor="#93C5FD" p={4}>
              <HStack justify="space-between" w="full">
                <HStack gap={2}>
                  <Box p={2} bg="white" borderRadius="lg" shadow="sm">
                    <User size={20} color="#3B82F6" />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Dialog.Title fontSize="xl" fontWeight="medium" color="gray.900">
                      Employee Details
                    </Dialog.Title>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </IconButton>
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p={6}>
              {selectedEmployee && (
                <VStack gap={4} align="stretch">
                  <HStack gap={4} align="center">
                    <Box
                      w="80px"
                      h="80px"
                      borderRadius="full"
                      overflow="hidden"
                      border="3px solid"
                      borderColor="blue.200"
                    >
                      <img
                        src={selectedEmployee.avatarImage}
                        alt={selectedEmployee.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                    <VStack align="start" gap={1}>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        {selectedEmployee.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Senior Software Engineer
                      </Text>
                      <HStack gap={2}>
                        <Badge colorScheme={selectedEmployee.criticality === 'High' ? 'red' : selectedEmployee.criticality === 'Medium' ? 'orange' : 'green'} fontSize="xs">
                          {selectedEmployee.criticality} Criticality
                        </Badge>
                        <Badge colorScheme={selectedEmployee.attritionRisk === 'High' ? 'red' : selectedEmployee.attritionRisk === 'Medium' ? 'orange' : 'green'} fontSize="xs">
                          {selectedEmployee.attritionRisk} Attrition Risk
                        </Badge>
                      </HStack>
                    </VStack>
                  </HStack>

                  <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
                    <VStack gap={3} align="stretch">
                      <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Skill at Risk:</Text>
                        <Text fontSize="sm" color="orange.600" fontWeight="semibold">{selectedEmployee.skillAtRisk}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Best Replacement:</Text>
                        <Text fontSize="sm" color="blue.600" fontWeight="semibold">{selectedEmployee.closeMatchForReplacement}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Department:</Text>
                        <Text fontSize="sm" color="gray.800">Engineering</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Experience:</Text>
                        <Text fontSize="sm" color="gray.800">5+ years</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Projects:</Text>
                        <Text fontSize="sm" color="gray.800">12 active</Text>
                      </Flex>
                    </VStack>
                  </Box>
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" size="sm" w="full">
                  Close
                </Button>
              </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </VStack>
  );
};