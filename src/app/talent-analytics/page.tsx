'use client';

import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  SimpleGrid,
  Flex,
  IconButton,
  Table,
  Input,
  Button,
  Tabs,
  Dialog,
} from '@chakra-ui/react';
import { TrendingUp, Briefcase, Users, Award, AlertCircle, CheckCircle, Link as LinkIcon, Check, ChevronDown, Search, Filter, X, User, Calendar, Layers } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { AppLayout } from '@/components/layouts/AppLayout';

interface Project {
  id: number;
  name: string;
  criticality: 'High' | 'Medium' | 'Low';
  requiredSkills: string[];
  status: 'Active' | 'Planning' | 'On Hold';
}

type SkillValidation = 'High' | 'Medium' | 'Low' | 'Not Validated';

interface SkillWithValidation {
  name: string;
  validation: SkillValidation;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  skills: SkillWithValidation[];
  avatarImage: string;
  availability: 'Available' | 'Busy' | 'On Leave';
  experience?: string;
  primarySkills?: string[];
  secondarySkills?: string[];
  workedProjects?: string[];
}

interface ProjectMapping {
  id: number;
  employeeId: number;
  employeeName: string;
  projectId: number;
  projectName: string;
  allocation: number;
  startDate: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    name: 'Cloud Migration Initiative',
    criticality: 'High',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Python'],
    status: 'Active'
  },
  {
    id: 2,
    name: 'Mobile App Redesign',
    criticality: 'High',
    requiredSkills: ['React Native', 'UI/UX', 'TypeScript', 'Firebase'],
    status: 'Active'
  },
  {
    id: 3,
    name: 'Data Analytics Platform',
    criticality: 'Medium',
    requiredSkills: ['Python', 'SQL', 'Tableau', 'Machine Learning'],
    status: 'Active'
  },
  {
    id: 4,
    name: 'Security Audit System',
    criticality: 'High',
    requiredSkills: ['Cybersecurity', 'Penetration Testing', 'Network Security'],
    status: 'Planning'
  },
  {
    id: 5,
    name: 'Customer Portal Enhancement',
    criticality: 'Medium',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST API'],
    status: 'Active'
  },
  {
    id: 6,
    name: 'AI Chatbot Integration',
    criticality: 'Low',
    requiredSkills: ['NLP', 'Python', 'TensorFlow', 'API Integration'],
    status: 'Planning'
  }
];

const projectMappings: ProjectMapping[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Alice Brown',
    projectId: 1,
    projectName: 'Cloud Migration Initiative',
    allocation: 100,
    startDate: '2024-01-15'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'David Martinez',
    projectId: 2,
    projectName: 'Mobile App Redesign',
    allocation: 80,
    startDate: '2024-02-01'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'Maya Patel',
    projectId: 3,
    projectName: 'Data Analytics Platform',
    allocation: 100,
    startDate: '2024-01-20'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: 'Marcus Thompson',
    projectId: 4,
    projectName: 'Security Audit System',
    allocation: 75,
    startDate: '2024-02-10'
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: 'Jane Smith',
    projectId: 5,
    projectName: 'Customer Portal Enhancement',
    allocation: 100,
    startDate: '2024-01-25'
  },
  {
    id: 6,
    employeeId: 6,
    employeeName: 'Lisa Chen',
    projectId: 2,
    projectName: 'Mobile App Redesign',
    allocation: 50,
    startDate: '2024-02-05'
  },
  {
    id: 7,
    employeeId: 2,
    employeeName: 'David Martinez',
    projectId: 5,
    projectName: 'Customer Portal Enhancement',
    allocation: 20,
    startDate: '2024-02-15'
  },
  {
    id: 8,
    employeeId: 8,
    employeeName: 'Sarah Davis',
    projectId: 6,
    projectName: 'AI Chatbot Integration',
    allocation: 100,
    startDate: '2024-02-20'
  }
];

const employeesData: Employee[] = [
  {
    id: 1,
    name: 'Alice Brown',
    role: 'Senior Cloud Engineer',
    skills: [
      { name: 'AWS', validation: 'High' },
      { name: 'Docker', validation: 'High' },
      { name: 'Kubernetes', validation: 'Medium' },
      { name: 'Python', validation: 'High' },
      { name: 'Terraform', validation: 'Low' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    availability: 'Available',
    experience: '8 years',
    primarySkills: ['AWS', 'Docker', 'Kubernetes', 'Python'],
    secondarySkills: ['Terraform', 'Azure', 'CI/CD'],
    workedProjects: ['Cloud Migration Initiative', 'Infrastructure Modernization', 'Multi-Cloud Setup']
  },
  {
    id: 2,
    name: 'David Martinez',
    role: 'Mobile Developer',
    skills: [
      { name: 'React Native', validation: 'High' },
      { name: 'TypeScript', validation: 'Medium' },
      { name: 'iOS', validation: 'High' },
      { name: 'Android', validation: 'Medium' },
      { name: 'Firebase', validation: 'Low' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    availability: 'Busy',
    experience: '6 years',
    primarySkills: ['React Native', 'iOS', 'Android', 'TypeScript'],
    secondarySkills: ['Firebase', 'Redux', 'GraphQL'],
    workedProjects: ['Mobile App Redesign', 'E-commerce Mobile Platform', 'Customer Portal Enhancement']
  },
  {
    id: 3,
    name: 'Maya Patel',
    role: 'Data Scientist',
    skills: [
      { name: 'Python', validation: 'High' },
      { name: 'Machine Learning', validation: 'High' },
      { name: 'SQL', validation: 'Medium' },
      { name: 'Tableau', validation: 'Medium' },
      { name: 'R', validation: 'Low' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    availability: 'Available',
    experience: '5 years',
    primarySkills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    secondarySkills: ['R', 'TensorFlow', 'Data Visualization'],
    workedProjects: ['Data Analytics Platform', 'Predictive Analytics System', 'Customer Insights Dashboard']
  },
  {
    id: 4,
    name: 'Marcus Thompson',
    role: 'Security Specialist',
    skills: [
      { name: 'Cybersecurity', validation: 'High' },
      { name: 'Penetration Testing', validation: 'High' },
      { name: 'Network Security', validation: 'Medium' },
      { name: 'SIEM', validation: 'Not Validated' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    availability: 'Available',
    experience: '10 years',
    primarySkills: ['Cybersecurity', 'Penetration Testing', 'Network Security'],
    secondarySkills: ['SIEM', 'Threat Analysis', 'Compliance'],
    workedProjects: ['Security Audit System', 'Enterprise Security Framework', 'Vulnerability Assessment Platform']
  },
  {
    id: 5,
    name: 'Jane Smith',
    role: 'Full Stack Developer',
    skills: [
      { name: 'React', validation: 'High' },
      { name: 'Node.js', validation: 'High' },
      { name: 'MongoDB', validation: 'Medium' },
      { name: 'REST API', validation: 'High' },
      { name: 'GraphQL', validation: 'Low' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/women/3.jpg',
    availability: 'Busy',
    experience: '7 years',
    primarySkills: ['React', 'Node.js', 'REST API', 'MongoDB'],
    secondarySkills: ['GraphQL', 'TypeScript', 'Docker'],
    workedProjects: ['Customer Portal Enhancement', 'Internal Tools Platform', 'E-commerce Backend']
  },
  {
    id: 6,
    name: 'Lisa Chen',
    role: 'UI/UX Designer',
    skills: [
      { name: 'Figma', validation: 'High' },
      { name: 'Adobe XD', validation: 'Medium' },
      { name: 'UI/UX', validation: 'High' },
      { name: 'Prototyping', validation: 'Medium' },
      { name: 'User Research', validation: 'Low' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    availability: 'Available',
    experience: '4 years',
    primarySkills: ['Figma', 'UI/UX Design', 'Prototyping'],
    secondarySkills: ['Adobe XD', 'User Research', 'Wireframing'],
    workedProjects: ['Mobile App Redesign', 'Design System Creation', 'Customer Portal UX Overhaul']
  },
  {
    id: 7,
    name: 'Tom Garcia',
    role: 'DevOps Engineer',
    skills: [
      { name: 'Jenkins', validation: 'High' },
      { name: 'Docker', validation: 'High' },
      { name: 'Kubernetes', validation: 'Medium' },
      { name: 'CI/CD', validation: 'High' },
      { name: 'AWS', validation: 'Medium' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    availability: 'On Leave',
    experience: '9 years',
    primarySkills: ['Jenkins', 'Docker', 'Kubernetes', 'CI/CD'],
    secondarySkills: ['AWS', 'Terraform', 'Ansible'],
    workedProjects: ['DevOps Pipeline Automation', 'Container Orchestration Setup', 'Infrastructure as Code Implementation']
  },
  {
    id: 8,
    name: 'Sarah Davis',
    role: 'AI/ML Engineer',
    skills: [
      { name: 'Python', validation: 'High' },
      { name: 'TensorFlow', validation: 'High' },
      { name: 'NLP', validation: 'Medium' },
      { name: 'Deep Learning', validation: 'High' },
      { name: 'PyTorch', validation: 'Low' }
    ],
    avatarImage: 'https://randomuser.me/api/portraits/women/5.jpg',
    availability: 'Available',
    experience: '5 years',
    primarySkills: ['Python', 'TensorFlow', 'Deep Learning', 'NLP'],
    secondarySkills: ['PyTorch', 'Computer Vision', 'MLOps'],
    workedProjects: ['AI Chatbot Integration', 'Recommendation Engine', 'Sentiment Analysis System']
  }
];

const ProjectCard = ({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'High': return { bg: 'red.50', border: 'red.300', text: 'red.600', badge: 'red' };
      case 'Medium': return { bg: 'orange.50', border: 'orange.300', text: 'orange.600', badge: 'orange' };
      default: return { bg: 'green.50', border: 'green.300', text: 'green.600', badge: 'green' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Planning': return 'blue';
      default: return 'gray';
    }
  };

  const colors = getCriticalityColor(project.criticality);

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
      <VStack align="stretch" gap={2}>
        {/* Project Name and Badges Row */}
        <HStack justify="space-between" align="center">
          <HStack gap={2} flex={1} minW={0}>
            <Briefcase size={16} color="#3B82F6" style={{ flexShrink: 0 }} />
            <Text fontSize="sm" fontWeight="bold" color="gray.800" lineClamp={1}>
              {project.name}
            </Text>
          </HStack>
          <HStack gap={1.5} flexShrink={0}>
            <Badge
              colorPalette={colors.badge}
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="md"
              fontWeight="semibold"
              variant="subtle"
            >
              {project.criticality}
            </Badge>
            <Badge 
              colorPalette={getStatusColor(project.status)} 
              fontSize="xs" 
              px={2} 
              py={0.5}
              variant="subtle"
            >
              {project.status}
            </Badge>
          </HStack>
        </HStack>

        {/* Required Skills */}
        <Box>
          <HStack gap={1} mb={1.5}>
            <Award size={12} color="#6B7280" />
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Required Skills
            </Text>
          </HStack>
          <Flex wrap="wrap" gap={1.5}>
            {project.requiredSkills.map((skill, index) => (
              <Badge
                key={index}
                colorPalette="gray"
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="md"
                variant="subtle"
              >
                {skill}
              </Badge>
            ))}
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

const SkillBadge = ({ skill, employeeId, onValidationChange }: { 
  skill: SkillWithValidation; 
  employeeId: number;
  onValidationChange: (skillName: string, validation: SkillValidation) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getValidationConfig = (validation: SkillValidation) => {
    switch (validation) {
      case 'High':
        return { 
          color: '#3B82F6', 
          bgColor: '#EFF6FF', 
          label: 'Validated in projects',
          icon: Check 
        };
      case 'Medium':
        return { 
          color: '#F97316', 
          bgColor: '#FFF7ED', 
          label: 'Manager confirmed',
          icon: Check 
        };
      case 'Low':
        return { 
          color: '#9CA3AF', 
          bgColor: '#F9FAFB', 
          label: 'Self declared only',
          icon: Check 
        };
      default:
        return { 
          color: '#6B7280', 
          bgColor: '#F3F4F6', 
          label: 'Not validated',
          icon: null 
        };
    }
  };

  const config = getValidationConfig(skill.validation);
  const ValidationIcon = config.icon;

  const handleValidationSelect = (validation: SkillValidation) => {
    onValidationChange(skill.name, validation);
    setShowMenu(false);
  };

  return (
    <Box position="relative">
      <HStack
        gap={1}
        px={2}
        py={1}
        borderRadius="md"
        bg={config.bgColor}
        border="1px solid"
        borderColor={config.color}
        cursor="pointer"
        onClick={() => setShowMenu(!showMenu)}
        _hover={{ shadow: 'sm' }}
        transition="all 0.2s"
      >
        {ValidationIcon && (
          <ValidationIcon size={12} color={config.color} strokeWidth={3} />
        )}
        <Text fontSize="xs" color={config.color} fontWeight="medium">
          {skill.name}
        </Text>
        <ChevronDown size={10} color={config.color} />
      </HStack>

      {showMenu && (
        <VStack
          position="absolute"
          top="100%"
          left={0}
          mt={1}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          shadow="lg"
          zIndex={10}
          minW="200px"
          align="stretch"
          gap={0}
          overflow="hidden"
        >
          <Box
            px={3}
            py={2}
            _hover={{ bg: 'blue.50' }}
            cursor="pointer"
            onClick={() => handleValidationSelect('High')}
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <HStack gap={2}>
              <Check size={14} color="#3B82F6" strokeWidth={3} />
              <VStack align="start" gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="blue.600">
                  High
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Validated in projects
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box
            px={3}
            py={2}
            _hover={{ bg: 'orange.50' }}
            cursor="pointer"
            onClick={() => handleValidationSelect('Medium')}
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <HStack gap={2}>
              <Check size={14} color="#F97316" strokeWidth={3} />
              <VStack align="start" gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="orange.600">
                  Medium
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Manager confirmed
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box
            px={3}
            py={2}
            _hover={{ bg: 'gray.50' }}
            cursor="pointer"
            onClick={() => handleValidationSelect('Low')}
          >
            <HStack gap={2}>
              <Check size={14} color="#9CA3AF" strokeWidth={3} />
              <VStack align="start" gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="gray.600">
                  Low
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Self declared only
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [employeeSkills, setEmployeeSkills] = useState(employee.skills);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleValidationChange = (skillName: string, validation: SkillValidation) => {
    setEmployeeSkills(prevSkills =>
      prevSkills.map(skill =>
        skill.name === skillName ? { ...skill, validation } : skill
      )
    );
    console.log(`Updated ${employee.name}'s ${skillName} validation to ${validation}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return { color: 'green', icon: CheckCircle };
      case 'Busy': return { color: 'orange', icon: AlertCircle };
      default: return { color: 'gray', icon: AlertCircle };
    }
  };

  const getCriticalityColor = (level?: string) => {
    switch (level) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      default: return 'green';
    }
  };

  const getAllocationColor = (allocation: number) => {
    if (allocation >= 80) return 'red';
    if (allocation >= 50) return 'orange';
    return 'green';
  };

  const availability = getAvailabilityColor(employee.availability);
  const AvailabilityIcon = availability.icon;

  // Get projects assigned to this employee
  const employeeProjects = projectMappings.filter(m => m.employeeId === employee.id);

  return (
    <>
    <Box
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={isHovered ? 'blue.300' : 'gray.200'}
      bg={isHovered ? 'blue.50' : 'white'}
      transition="all 0.2s ease"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
        borderColor: 'blue.300',
        bg: 'blue.50'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VStack align="stretch" gap={3}>
        <HStack gap={3}>
          <Box
            w="50px"
            h="50px"
            borderRadius="full"
            overflow="hidden"
            flexShrink={0}
            border="2px solid"
            borderColor={isHovered ? 'blue.300' : 'gray.200'}
            transition="all 0.2s ease"
          >
            <img
              src={employee.avatarImage}
              alt={employee.name}
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
                      font-size: 16px;
                      font-weight: bold;
                      color: white;
                    ">
                      ${employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  `;
                }
              }}
            />
          </Box>

          <VStack align="start" gap={0} flex="1" minW="0">
            <Text fontSize="sm" fontWeight="bold" color="gray.800" lineClamp={1}>
              {employee.name}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {employee.role}
            </Text>
            <HStack gap={1} mt={1}>
              <AvailabilityIcon size={12} color={`var(--chakra-colors-${availability.color}-500)`} />
              <Text fontSize="xs" color={`${availability.color}.600`} fontWeight="medium">
                {employee.availability}
              </Text>
            </HStack>
          </VStack>

          <Tooltip content="View Profile" showArrow>
            <IconButton
              aria-label="View profile"
              size="sm"
              variant="ghost"
              colorPalette="blue"
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(true);
              }}
            >
              <User size={18} />
            </IconButton>
          </Tooltip>
        </HStack>

        {/* Project Assignments */}
        {employeeProjects.length > 0 && (
          <Box
            p={3}
            bg="green.50"
            borderRadius="md"
            border="1px solid"
            borderColor="green.200"
          >
            <HStack gap={1} mb={2}>
              <LinkIcon size={12} color="#10B981" />
              <Text fontSize="xs" color="gray.700" fontWeight="bold">
                Assigned Projects ({employeeProjects.length})
              </Text>
            </HStack>
            <VStack gap={2} align="stretch">
              {employeeProjects.map((mapping) => {
                const project = projectsData.find(p => p.id === mapping.projectId);
                return (
                  <HStack key={mapping.id} justify="space-between" align="center">
                    <VStack align="start" gap={0} flex={1} minW="0">
                      <Text fontSize="xs" fontWeight="medium" color="gray.800" lineClamp={1}>
                        {mapping.projectName}
                      </Text>
                      <HStack gap={1}>
                        <Badge
                          colorPalette={getAllocationColor(mapping.allocation)}
                          fontSize="xs"
                          px={1.5}
                          py={0.5}
                          variant="subtle"
                        >
                          {mapping.allocation}%
                        </Badge>
                        {project && (
                          <Badge
                            colorPalette={getCriticalityColor(project.criticality)}
                            fontSize="xs"
                            px={1.5}
                            py={0.5}
                            variant="subtle"
                          >
                            {project.criticality}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(mapping.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </Box>
        )}

        <Box>
          <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={2}>
            Skills (Click to validate):
          </Text>
          <Flex wrap="wrap" gap={2}>
            {employeeSkills.map((skill, index) => (
              <SkillBadge
                key={index}
                skill={skill}
                employeeId={employee.id}
                onValidationChange={handleValidationChange}
              />
            ))}
          </Flex>
        </Box>
      </VStack>
    </Box>

    {/* Profile Modal - Outside card to prevent hover interference */}
    <Dialog.Root 
      open={isProfileOpen} 
      onOpenChange={(e) => setIsProfileOpen(e.open)}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop 
        bg="blackAlpha.600" 
        backdropFilter="blur(10px)"
      />
      <Dialog.Positioner 
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={9999}
      >
        <Dialog.Content 
          maxW="600px"
          bg="white"
          borderRadius="xl"
          shadow="2xl"
          p={0}
          overflow="hidden"
          position="relative"
        >
            <Dialog.Header>
            <HStack gap={3}>
              <Box
                w="60px"
                h="60px"
                borderRadius="full"
                overflow="hidden"
                border="3px solid"
                borderColor="blue.400"
              >
                <img
                  src={employee.avatarImage}
                  alt={employee.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                          font-size: 20px;
                          font-weight: bold;
                          color: white;
                        ">
                          ${employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      `;
                    }
                  }}
                />
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="md" color="gray.800">{employee.name}</Heading>
                <Text fontSize="sm" color="gray.600">{employee.role}</Text>
                <Badge colorPalette={availability.color} variant="subtle" mt={1}>
                  {employee.availability}
                </Badge>
              </VStack>
            </HStack>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
            <VStack align="stretch" gap={4}>
              {/* Experience */}
              {employee.experience && (
                <Box>
                  <HStack gap={2} mb={2}>
                    <Calendar size={18} color="#3B82F6" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      Experience
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    {employee.experience}
                  </Text>
                </Box>
              )}

              {/* Primary Skills */}
              {employee.primarySkills && employee.primarySkills.length > 0 && (
                <Box>
                  <HStack gap={2} mb={2}>
                    <Award size={18} color="#10B981" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      Primary Skills
                    </Text>
                  </HStack>
                  <Flex wrap="wrap" gap={2} pl={7}>
                    {employee.primarySkills.map((skill, idx) => (
                      <Badge key={idx} colorPalette="green" variant="subtle" px={2} py={1}>
                        {skill}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Secondary Skills */}
              {employee.secondarySkills && employee.secondarySkills.length > 0 && (
                <Box>
                  <HStack gap={2} mb={2}>
                    <Layers size={18} color="#8B5CF6" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      Secondary Skills
                    </Text>
                  </HStack>
                  <Flex wrap="wrap" gap={2} pl={7}>
                    {employee.secondarySkills.map((skill, idx) => (
                      <Badge key={idx} colorPalette="purple" variant="subtle" px={2} py={1}>
                        {skill}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Worked Projects */}
              {employee.workedProjects && employee.workedProjects.length > 0 && (
                <Box>
                  <HStack gap={2} mb={2}>
                    <Briefcase size={18} color="#F59E0B" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      Worked Projects
                    </Text>
                  </HStack>
                  <VStack align="stretch" gap={1.5} pl={7}>
                    {employee.workedProjects.map((project, idx) => (
                      <HStack key={idx} gap={2}>
                        <Box w="4px" h="4px" borderRadius="full" bg="orange.400" />
                        <Text fontSize="sm" color="gray.700">
                          {project}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Current Assignments */}
              {employeeProjects.length > 0 && (
                <Box>
                  <HStack gap={2} mb={2}>
                    <LinkIcon size={18} color="#3B82F6" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      Current Assignments
                    </Text>
                  </HStack>
                  <VStack align="stretch" gap={2} pl={7}>
                    {employeeProjects.map((mapping) => (
                      <HStack key={mapping.id} justify="space-between" p={2} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm" color="gray.800" fontWeight="medium">
                          {mapping.projectName}
                        </Text>
                        <Badge colorPalette={getAllocationColor(mapping.allocation)} variant="subtle">
                          {mapping.allocation}%
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

const ProjectMappingCard = ({ mapping }: { mapping: ProjectMapping }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProjectById = (id: number) => projectsData.find(p => p.id === id);
  const project = getProjectById(mapping.projectId);

  const getCriticalityColor = (level?: string) => {
    switch (level) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      default: return 'green';
    }
  };

  const getAllocationColor = (allocation: number) => {
    if (allocation >= 80) return 'red';
    if (allocation >= 50) return 'orange';
    return 'green';
  };

  return (
    <Box
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={isHovered ? 'green.300' : 'gray.200'}
      bg={isHovered ? 'green.50' : 'white'}
      transition="all 0.2s ease"
      cursor="pointer"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1} flex={1}>
            <HStack gap={2}>
              <LinkIcon size={14} color="#10B981" />
              <Text fontSize="sm" fontWeight="bold" color="gray.800" lineClamp={1}>
                {mapping.employeeName}
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.600">
              → {mapping.projectName}
            </Text>
          </VStack>
          {project && (
            <Badge
              colorScheme={getCriticalityColor(project.criticality)}
              fontSize="xs"
              px={2}
              py={0.5}
            >
              {project.criticality}
            </Badge>
          )}
        </HStack>

        <HStack justify="space-between" align="center">
          <VStack align="start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Allocation
            </Text>
            <HStack gap={1}>
              <Badge
                colorScheme={getAllocationColor(mapping.allocation)}
                fontSize="xs"
                px={2}
                py={0.5}
                fontWeight="bold"
              >
                {mapping.allocation}%
              </Badge>
            </HStack>
          </VStack>
          <VStack align="end" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Start Date
            </Text>
            <Text fontSize="xs" color="gray.700" fontWeight="medium">
              {new Date(mapping.startDate).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

const TalentPoolTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedValidation, setSelectedValidation] = useState<string>('All');

  // Get all unique skills from employees
  const allSkills = Array.from(
    new Set(employeesData.flatMap(emp => emp.skills.map(s => s.name)))
  ).sort();

  // Filter employees based on search and filters
  const filteredEmployees = employeesData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAvailability = selectedAvailability === 'All' || employee.availability === selectedAvailability;
    
    const matchesSkill = selectedSkill === 'All' || 
                        employee.skills.some(s => s.name === selectedSkill);
    
    const matchesValidation = selectedValidation === 'All' ||
                             employee.skills.some(s => s.validation === selectedValidation);
    
    return matchesSearch && matchesAvailability && matchesSkill && matchesValidation;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAvailability('All');
    setSelectedSkill('All');
    setSelectedValidation('All');
  };

  const hasActiveFilters = searchQuery || selectedAvailability !== 'All' || 
                          selectedSkill !== 'All' || selectedValidation !== 'All';

  return (
    <Box h="calc(100vh - 140px)" overflow="hidden">
      <VStack h="full" align="stretch" gap={0}>
        {/* Modern Search Bar */}
        <Box
          px={6}
          py={5}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <VStack gap={4} align="stretch">
            {/* Main Search Bar with Multiple Fields */}
            <HStack
              gap={0}
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="full"
              overflow="hidden"
              shadow="sm"
              _hover={{ shadow: 'md', borderColor: 'blue.300' }}
              transition="all 0.2s"
            >
              {/* Skills/Role/Name Search */}
              <HStack flex={1} px={4} py={3} borderRight="1px solid" borderColor="gray.200">
                <Search size={20} color="#9CA3AF" style={{ flexShrink: 0 }} />
                <Input
                  placeholder="Enter skills / role / name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  border="none"
                  bg="transparent"
                  fontSize="sm"
                  color="gray.700"
                  _focus={{ outline: 'none', boxShadow: 'none' }}
                  _placeholder={{ color: 'gray.400' }}
                />
              </HStack>

              {/* Availability Filter */}
              <HStack flex="0 0 200px" px={4} py={3} borderRight="1px solid" borderColor="gray.200">
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: selectedAvailability !== 'All' ? '#1E40AF' : '#9CA3AF',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: selectedAvailability !== 'All' ? '500' : '400'
                  }}
                >
                  <option value="All">Select availability</option>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </HStack>

              {/* Skill Filter */}
              <HStack flex="0 0 200px" px={4} py={3} borderRight="1px solid" borderColor="gray.200">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: selectedSkill !== 'All' ? '#1E40AF' : '#9CA3AF',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: selectedSkill !== 'All' ? '500' : '400'
                  }}
                >
                  <option value="All">Filter by skill</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </HStack>

              {/* Validation Filter */}
              <HStack flex="0 0 220px" px={4} py={3} borderRight="1px solid" borderColor="gray.200">
                <select
                  value={selectedValidation}
                  onChange={(e) => setSelectedValidation(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: selectedValidation !== 'All' ? '#1E40AF' : '#9CA3AF',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: selectedValidation !== 'All' ? '500' : '400'
                  }}
                >
                  <option value="All">Validation level</option>
                  <option value="High">High - Validated</option>
                  <option value="Medium">Medium - Confirmed</option>
                  <option value="Low">Low - Self declared</option>
                  <option value="Not Validated">Not Validated</option>
                </select>
              </HStack>

              {/* Search Button */}
              <Button
                bg="linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)"
                color="white"
                px={8}
                py={6}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                _hover={{
                  bg: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)',
                  transform: 'scale(1.02)'
                }}
                _active={{
                  transform: 'scale(0.98)'
                }}
                transition="all 0.2s"
                onClick={() => {
                  // Search action - filters are already applied in real-time
                }}
              >
                Search
              </Button>
            </HStack>

            {/* Secondary Info Row */}
            <HStack gap={3} flexWrap="wrap" justify="space-between">
              <HStack gap={3}>
                {hasActiveFilters && (
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={clearFilters}
                    borderRadius="full"
                  >
                    <X size={14} />
                    Clear All Filters
                  </Button>
                )}
              </HStack>

              <Badge colorPalette="blue" variant="subtle" px={3} py={1.5} borderRadius="full" fontSize="xs">
                {filteredEmployees.length} of {employeesData.length} resources
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Resources Grid */}
        <Box
          flex={1}
          overflowY="auto"
          p={6}
          bg="gray.50"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
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
          {filteredEmployees.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500" fontWeight="medium">
                No resources found matching your criteria
              </Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Try adjusting your search or filters
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

const TalentAnalyticsTab = () => {
  return (
    <HStack h="calc(100vh - 140px)" align="stretch" gap={0} overflow="hidden">
          <Box
            flex={1}
            h="full"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            overflow="hidden"
          >
            <VStack h="full" align="stretch" gap={0}>
              <Box
                px={6}
                py={4}
                borderBottom="1px solid"
                borderColor="gray.200"
                bg="gray.50"
              >
                <HStack justify="space-between" align="center">
                  <HStack gap={2}>
                    <Briefcase size={20} color="#3B82F6" />
                    <Heading size="md" color="gray.800">
                      Current Projects
                    </Heading>
                  </HStack>
                  <Badge colorPalette="blue" fontSize="sm" px={3} py={1} variant="subtle">
                    {projectsData.length} Projects
                  </Badge>
                </HStack>
              </Box>

              <Box
                flex={1}
                overflowY="auto"
                p={6}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
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
                <VStack gap={4} align="stretch">
                  {projectsData.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box flex={1} h="full" bg="white" overflow="hidden">
            <VStack h="full" align="stretch" gap={0}>
              <Box
                px={6}
                py={4}
                borderBottom="1px solid"
                borderColor="gray.200"
                bg="gray.50"
              >
                <HStack justify="space-between" align="center">
                  <HStack gap={2}>
                    <Users size={20} color="#8B5CF6" />
                    <Heading size="md" color="gray.800">
                      Team Members & Assignments
                    </Heading>
                  </HStack>
                  <Badge colorPalette="purple" fontSize="sm" px={3} py={1} variant="subtle">
                    {employeesData.length} Employees
                  </Badge>
                </HStack>
              </Box>

              <Box
                flex={1}
                overflowY="auto"
                p={6}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
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
                <VStack gap={4} align="stretch">
                  {employeesData.map((employee) => (
                    <EmployeeCard key={employee.id} employee={employee} />
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
  );
};

export default function TalentAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <AppLayout>
      <Box w="full" h="100vh" bg="gray.50" overflow="hidden">
        <VStack h="full" align="stretch" gap={0}>
          {/* Enhanced Header with Gradient */}
          <Box
            bg="linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)"
            px={8}
            py={6}
            shadow="md"
            position="relative"
            _after={{
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              bg: 'linear-gradient(90deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%)',
            }}
          >
            <HStack gap={4} align="center">
              <Box 
                p={3} 
                bg="white" 
                borderRadius="xl"
                shadow="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <TrendingUp size={28} color="#3B82F6" strokeWidth={2.5} />
              </Box>
              <VStack align="start" gap={1}>
                <Heading size="xl" color="white" fontWeight="bold" letterSpacing="tight">
                  Talent Management
                </Heading>
                <Text fontSize="sm" color="blue.100" fontWeight="medium">
                  Manage projects, skills, and team resources efficiently
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Modern Tabs with Better Styling */}
          <Box
            bg="white"
            borderBottom="2px solid"
            borderColor="gray.100"
            px={8}
            shadow="sm"
          >
            <HStack gap={2}>
              <Box
                px={6}
                py={3.5}
                cursor="pointer"
                position="relative"
                borderRadius="md"
                borderTopRadius="md"
                borderBottomRadius={0}
                bg={activeTab === 'analytics' ? 'white' : 'transparent'}
                transition="all 0.3s ease"
                onClick={() => setActiveTab('analytics')}
                _hover={{ 
                  bg: activeTab === 'analytics' ? 'white' : 'gray.50',
                  transform: activeTab === 'analytics' ? 'none' : 'translateY(-2px)'
                }}
                _after={activeTab === 'analytics' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  bg: 'linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)',
                  borderRadius: 'full',
                } : {}}
              >
                <HStack gap={2.5}>
                  <Box
                    p={1.5}
                    bg={activeTab === 'analytics' ? 'blue.50' : 'gray.100'}
                    borderRadius="md"
                    transition="all 0.2s"
                  >
                    <TrendingUp 
                      size={18} 
                      color={activeTab === 'analytics' ? '#3B82F6' : '#6B7280'} 
                      strokeWidth={2.5}
                    />
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight={activeTab === 'analytics' ? 'bold' : 'semibold'}
                    color={activeTab === 'analytics' ? 'blue.600' : 'gray.600'}
                    letterSpacing="wide"
                  >
                    Talent Analytics
                  </Text>
                </HStack>
              </Box>
              
              <Box
                px={6}
                py={3.5}
                cursor="pointer"
                position="relative"
                borderRadius="md"
                borderTopRadius="md"
                borderBottomRadius={0}
                bg={activeTab === 'pool' ? 'white' : 'transparent'}
                transition="all 0.3s ease"
                onClick={() => setActiveTab('pool')}
                _hover={{ 
                  bg: activeTab === 'pool' ? 'white' : 'gray.50',
                  transform: activeTab === 'pool' ? 'none' : 'translateY(-2px)'
                }}
                _after={activeTab === 'pool' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  bg: 'linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)',
                  borderRadius: 'full',
                } : {}}
              >
                <HStack gap={2.5}>
                  <Box
                    p={1.5}
                    bg={activeTab === 'pool' ? 'blue.50' : 'gray.100'}
                    borderRadius="md"
                    transition="all 0.2s"
                  >
                    <Users 
                      size={18} 
                      color={activeTab === 'pool' ? '#3B82F6' : '#6B7280'} 
                      strokeWidth={2.5}
                    />
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight={activeTab === 'pool' ? 'bold' : 'semibold'}
                    color={activeTab === 'pool' ? 'blue.600' : 'gray.600'}
                    letterSpacing="wide"
                  >
                    Talent Pool
                  </Text>
                </HStack>
              </Box>
            </HStack>
          </Box>

          {/* Tab Content */}
          {activeTab === 'analytics' ? <TalentAnalyticsTab /> : <TalentPoolTab />}
        </VStack>
      </Box>
    </AppLayout>
  );
}
