'use client';

import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button,
  Heading,
  SimpleGrid,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { Card, Avatar } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { EmployeeDetailModal } from '@/components/team/EmployeeDetailModal';
import { TeamMember } from '@/types';

interface Employee {
  id: string;
  name: string;
  title: string;
  email: string;
  location: string;
  avatar?: string;
  reportees?: Employee[];
  portfolioHealth: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  level: number;
}

// Clean organization data structure with real images
const organizationData: Employee = {
  id: 'ceo',
  name: 'Mike Stevia',
  title: 'Chief Executive Officer',
  email: 'mike.stevia@company.com',
  location: 'New York',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  portfolioHealth: 'excellent',
  level: 0,
  reportees: [
    {
      id: 'cfo',
      name: 'Oliver Chelangat',
      title: 'Chief Financial Officer',
      email: 'oliver.chelangat@company.com',
      location: 'New York',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      portfolioHealth: 'good',
      level: 1,
      reportees: [
        {
          id: 'vp-marketing',
          name: 'Robert Clark',
          title: 'VP Marketing',
          email: 'robert.clark@company.com',
          location: 'California',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          portfolioHealth: 'average',
          level: 2,
          reportees: [
            {
              id: 'bd-rep',
              name: 'Rosa Bonnier',
              title: 'Business Development Rep',
              email: 'rosa.bonnier@company.com',
              location: 'California',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              portfolioHealth: 'good',
              level: 3
            },
            {
              id: 'designer',
              name: 'Jim Richter',
              title: 'Senior Designer',
              email: 'jim.richter@company.com',
              location: 'California',
              avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
              portfolioHealth: 'excellent',
              level: 3
            }
          ]
        }
      ]
    },
    {
      id: 'cto',
      name: 'Alejandro Gonzalez',
      title: 'Chief Technology Officer',
      email: 'alejandro.gonzalez@company.com',
      location: 'San Francisco',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      portfolioHealth: 'excellent',
      level: 1,
      reportees: [
        {
          id: 'eng-director',
          name: 'Jennifer Brent',
          title: 'Director of Engineering',
          email: 'jennifer.brent@company.com',
          location: 'San Francisco',
          avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
          portfolioHealth: 'excellent',
          level: 2,
          reportees: [
            {
              id: 'sw-engineer-1',
              name: 'Melika Cantu',
              title: 'Software Engineer',
              email: 'melika.cantu@company.com',
              location: 'San Francisco',
              avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
              portfolioHealth: 'good',
              level: 3
            },
            {
              id: 'sw-engineer-2',
              name: 'Geetham Ravichandran',
              title: 'Software Engineer',
              email: 'geetham.ravichandran@company.com',
              location: 'San Francisco',
              avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
              portfolioHealth: 'excellent',
              level: 3
            }
          ]
        }
      ]
    },
    {
      id: 'coo',
      name: 'Emily Tucker',
      title: 'Chief Operations Officer',
      email: 'emily.tucker@company.com',
      location: 'Chicago',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
      portfolioHealth: 'good',
      level: 1,
      reportees: [
        {
          id: 'hr-director',
          name: 'Jane Brown',
          title: 'Director of Human Resources',
          email: 'jane.brown@company.com',
          location: 'Chicago',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          portfolioHealth: 'excellent',
          level: 2,
          reportees: [
            {
              id: 'hr-specialist',
              name: 'Grant Leise',
              title: 'HR Specialist',
              email: 'grant.leise@company.com',
              location: 'Chicago',
              avatar: 'https://randomuser.me/api/portraits/men/61.jpg',
              portfolioHealth: 'average',
              level: 3
            }
          ]
        }
      ]
    }
  ]
};

// Portfolio health configuration
const getPortfolioHealthIcon = (health: string) => {
  switch (health) {
    case 'excellent':
      return { icon: CheckCircle, color: '#10b981', bgColor: '#d1fae5' };
    case 'good':
      return { icon: TrendingUp, color: '#059669', bgColor: '#a7f3d0' };
    case 'average':
      return { icon: Minus, color: '#f59e0b', bgColor: '#fef3c7' };
    case 'poor':
      return { icon: TrendingDown, color: '#ef4444', bgColor: '#fecaca' };
    case 'critical':
      return { icon: AlertTriangle, color: '#dc2626', bgColor: '#fee2e2' };
    default:
      return { icon: Activity, color: '#6b7280', bgColor: '#f3f4f6' };
  }
};

// Modern Employee Card Component with Better Design
const EmployeeCard: React.FC<{ 
  employee: Employee; 
  onEmployeeClick: (employee: Employee) => void;
  onViewDashboard?: (employee: Employee) => void;
}> = ({ employee, onEmployeeClick, onViewDashboard }) => {
  const router = useRouter();
  const healthConfig = getPortfolioHealthIcon(employee.portfolioHealth);
  const IconComponent = healthConfig.icon;

  const handleViewDashboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDashboard) {
      onViewDashboard(employee);
    } else {
      router.push(`/?employee=${employee.id}`);
    }
  };

  // Responsive card sizing
  const cardWidth = employee.level === 0 ? '320px' : employee.level === 1 ? '280px' : '260px';
  const isTopLevel = employee.level === 0;

  return (
    <Card.Root
      w={cardWidth}
      bg="white"
      shadow="md"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      cursor="pointer"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{ 
        shadow: "2xl", 
        transform: "translateY(-4px) scale(1.02)",
        borderColor: "#1a7a8a"
      }}
      onClick={() => onEmployeeClick(employee)}
      overflow="hidden"
    >
      {/* Colored Top Bar */}
      <Box 
        h="4px" 
        bg={`linear-gradient(90deg, ${healthConfig.color} 0%, ${healthConfig.bgColor} 100%)`}
      />
      
      <Card.Body p={4}>
        <VStack gap={3} align="stretch">
          {/* Profile Section */}
          <HStack gap={3} align="center">
            <Box position="relative">
              <Avatar.Root
                size={isTopLevel ? "lg" : "md"}
                bg="linear-gradient(135deg, #1a7a8a 0%, #226773 100%)"
                border="3px solid"
                borderColor={healthConfig.bgColor}
              >
                <Avatar.Image src={employee.avatar} />
                <Avatar.Fallback color="white" fontWeight="bold" fontSize={isTopLevel ? "lg" : "md"}>
                  {employee.name.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              {/* Health Badge */}
              <Box
                position="absolute"
                bottom="-2px"
                right="-2px"
                p={1.5}
                borderRadius="full"
                bg="white"
                border="2px solid white"
                shadow="md"
              >
                <IconComponent size={14} color={healthConfig.color} />
              </Box>
            </Box>
            
            <VStack align="start" gap={0.5} flex="1" minW="0">
              <Text 
                fontSize={isTopLevel ? "md" : "sm"} 
                fontWeight="bold" 
                color="gray.900" 
                lineClamp={1}
              >
                {employee.name}
              </Text>
              <Text 
                fontSize="2xs" 
                color="gray.500" 
                lineClamp={1}
                textTransform="uppercase"
                letterSpacing="wide"
                fontWeight="medium"
              >
                {employee.title}
              </Text>
            </VStack>
          </HStack>

          {/* Info Section */}
          <VStack align="stretch" gap={2} pt={2} borderTop="1px solid" borderColor="gray.100">
            <HStack gap={2}>
              <Box p={1} bg="blue.50" borderRadius="md">
                <Text fontSize="xs">📧</Text>
              </Box>
              <Text 
                fontSize="2xs" 
                color="gray.600" 
                lineClamp={1}
                flex="1"
              >
                {employee.email}
              </Text>
            </HStack>
            
            <HStack gap={2}>
              <Box p={1} bg="purple.50" borderRadius="md">
                <Text fontSize="xs">📍</Text>
              </Box>
              <Text fontSize="2xs" color="gray.600" fontWeight="medium">
                {employee.location}
              </Text>
            </HStack>

            {employee.reportees && employee.reportees.length > 0 && (
              <HStack gap={2} mt={1}>
                <Box p={1} bg="green.50" borderRadius="md">
                  <Text fontSize="xs">👥</Text>
                </Box>
                <Text fontSize="2xs" color="gray.600" fontWeight="medium">
                  {employee.reportees.length} Direct Report{employee.reportees.length !== 1 ? 's' : ''}
                </Text>
              </HStack>
            )}
          </VStack>

          {/* Action Button */}
          {employee.reportees && employee.reportees.length > 0 && (
            <Button
              size="sm"
              bg="linear-gradient(135deg, #1a7a8a 0%, #226773 100%)"
              color="white"
              _hover={{ 
                bg: "linear-gradient(135deg, #226773 0%, #2a8090 100%)",
                transform: "scale(1.02)"
              }}
              onClick={handleViewDashboard}
              borderRadius="lg"
              fontSize="xs"
              fontWeight="semibold"
              h="32px"
              shadow="sm"
              transition="all 0.2s"
            >
              📊 View Dashboard
            </Button>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

// Clean Employee Node with Profile Picture and Risk Indicator
const EmployeeNode: React.FC<{
  employee: Employee;
  onEmployeeClick: (employee: Employee) => void;
  level: number;
}> = ({ employee, onEmployeeClick, level }) => {
  // Map portfolio health to risk levels
  const getRiskLevel = (health: string) => {
    switch (health) {
      case 'excellent':
      case 'good':
        return { label: 'Low Risk', color: '#10b981', bgColor: '#d1fae5' };
      case 'average':
        return { label: 'Medium Risk', color: '#f59e0b', bgColor: '#fef3c7' };
      case 'poor':
      case 'critical':
        return { label: 'High Risk', color: '#ef4444', bgColor: '#fee2e2' };
      default:
        return { label: 'Low Risk', color: '#10b981', bgColor: '#d1fae5' };
    }
  };
  
  const risk = getRiskLevel(employee.portfolioHealth);
  const avatarSize = level === 0 ? 150 : level === 1 ? 145 : 100;

  return (
    <HStack
      gap={3}
      cursor="pointer"
      onClick={() => onEmployeeClick(employee)}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "scale(1.15)",
        zIndex: 10
      }}
      align="center"
    >
      {/* Profile Picture with Risk Border */}
      <Box position="relative">
        <Box
          w={`${avatarSize}px`}
          h={`${avatarSize}px`}
          borderRadius="full"
          border="2px solid"
          borderColor={risk.color}
          bg="white"
          shadow="lg"
          overflow="hidden"
          transition="all 0.3s ease"
          _hover={{
            shadow: "2xl",
            borderWidth: "5px"
          }}
        >
          <Avatar.Root
            size={level === 0 ? "2xl" : level === 1 ? "xl" : "lg"}
            w="100%"
            h="100%"
          >
            <Avatar.Image src={employee.avatar} />
            <Avatar.Fallback 
              bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              color="white" 
              fontWeight="bold"
              fontSize={level === 0 ? "3xl" : level === 1 ? "2xl" : "xl"}
            >
              {employee.name.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>
        </Box>
        
        {/* Risk Badge */}
        <Box
          position="absolute"
          bottom="-2px"
          right="-2px"
          px={1.5}
          py={0.5}
          bg={risk.bgColor}
          borderRadius="full"
          border="2px solid white"
          shadow="md"
          whiteSpace="nowrap"
        >
          <Text 
            fontSize="small" 
            fontWeight="" 
            color={risk.color}
            textTransform="uppercase"
            letterSpacing="tight"
          >
            {risk.label.replace(' RISK', '')}
          </Text>
        </Box>
      </Box>
      
      {/* Name and Designation - Next to Photo */}
      <VStack gap={0.5} align="start" maxW="180px">
        <Text 
          fontSize={level === 0 ? "md" : "sm"} 
          fontWeight="bold" 
          color="gray.900"
          lineClamp={1}
        >
          {employee.name}
        </Text>
        <Text 
          fontSize="2xs" 
          color="gray.600"
          lineClamp={2}
          lineHeight="1.3"
        >
          {employee.title}
        </Text>
      </VStack>
    </HStack>
  );
};

// Tree Organization Level Component
const TreeLevel: React.FC<{
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  level: number;
}> = ({ employees, onEmployeeClick, level }) => {
  if (!employees || employees.length === 0) return null;

  return (
    <VStack gap={6} w="full" align="center">
      <HStack gap={8} justify="center" flexWrap="wrap" align="start">
        {employees.map((employee) => (
          <VStack key={employee.id} gap={4} align="center">
            <EmployeeNode
              employee={employee}
              onEmployeeClick={onEmployeeClick}
              level={level}
            />
            
            {employee.reportees && employee.reportees.length > 0 && (
              <>
                {/* Vertical connector */}
                <Box w="1px" h="30px" bg="gray.200" />
                
                {/* Horizontal line for multiple children */}
                {employee.reportees.length > 1 && (
                  <Box
                    w={`${employee.reportees.length * 140}px`}
                    maxW="700px"
                    h="1px"
                    bg="gray.200"
                  />
                )}
                
                {/* Recursive children */}
                <TreeLevel
                  employees={employee.reportees}
                  onEmployeeClick={onEmployeeClick}
                  level={level + 1}
                />
              </>
            )}
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
};

// Helper function to convert Employee to TeamMember for modal
const convertToTeamMember = (employee: Employee): TeamMember => {
  // Map portfolio health to risk levels
  const getRiskFromHealth = (health: string): 'High' | 'Medium' | 'Low' => {
    switch (health) {
      case 'excellent':
      case 'good':
        return 'Low';
      case 'average':
        return 'Medium';
      case 'poor':
      case 'critical':
        return 'High';
      default:
        return 'Low';
    }
  };

  const risk = getRiskFromHealth(employee.portfolioHealth);

  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    age: 30, // Default age since not in Employee type
    mentalHealth: risk,
    motivationFactor: risk,
    careerOpportunities: risk,
    personalReason: risk,
    managerAssessmentRisk: risk,
    attritionRisk: risk,
    utilization: 75,
    projectCriticality: risk,
    primaryTrigger: 'MH'
  };
};

// Redesigned Main Organization Chart Component - Fit to Screen
export const OrganizationChart: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState<TeamMember | null>(null);
  const [zoom, setZoom] = useState(0.85);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleViewDashboard = (employee: Employee) => {
    const teamMember = convertToTeamMember(employee);
    setModalEmployee(teamMember);
    setIsModalOpen(true);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(0.85);

  return (
    <Box 
      w="full" 
      h="100vh" 
      bg="white" 
      position="relative"
      overflow="hidden"
    >
      {/* Compact Header with Controls */}
      <HStack 
        justify="space-between" 
        align="center" 
        px={6} 
        py={4} 
        bg="white" 
        borderBottom="2px solid" 
        borderColor="gray.100"
      >
        <HStack gap={3}>
          <Box p={2} bg="gray.50" borderRadius="lg">
            <Text fontSize="2xl">🏢</Text>
          </Box>
          <VStack align="start" gap={0}>
            <Heading size="md" color="gray.900" fontWeight="bold">
              Organization Structure
            </Heading>
            <Text color="gray.500" fontSize="xs">
              {selectedEmployee ? `Selected: ${selectedEmployee.name}` : 'Hover to zoom • Click to view details'}
            </Text>
          </VStack>
        </HStack>

        {/* Zoom Controls */}
        <HStack gap={2}>
          <Button 
            size="sm" 
            onClick={handleZoomOut}
            bg="gray.100"
            _hover={{ bg: "gray.200" }}
            fontSize="lg"
            px={3}
          >
            −
          </Button>
          <Text fontSize="xs" fontWeight="medium" color="gray.600" minW="50px" textAlign="center">
            {Math.round(zoom * 100)}%
          </Text>
          <Button 
            size="sm" 
            onClick={handleZoomIn}
            bg="gray.100"
            _hover={{ bg: "gray.200" }}
            fontSize="lg"
            px={3}
          >
            +
          </Button>
          <Button 
            size="sm" 
            onClick={handleResetZoom}
            bg="#1a7a8a"
            color="white"
            _hover={{ bg: "#226773" }}
            fontSize="xs"
            px={3}
          >
            Reset
          </Button>
        </HStack>
      </HStack>

      {/* Main Content Area - Split View */}
      <HStack align="stretch" gap={0} h="calc(100vh - 60px)">
        {/* Organization Chart - Scrollable with Hidden Scrollbar */}
        <Box 
          flex="1" 
          overflowY="auto"
          overflowX="hidden"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none'
          }}
        >
          <Box 
            transform={`scale(${zoom})`}
            transformOrigin="top center"
            transition="transform 0.2s ease"
            py={6}
            px={4}
          >
            <VStack gap={6} w="full" align="center">
              {/* CEO at top */}
              <EmployeeNode
                employee={organizationData}
                onEmployeeClick={handleEmployeeClick}
                level={0}
              />
              
              {/* Vertical connector */}
              {organizationData.reportees && organizationData.reportees.length > 0 && (
                <>
                  <Box w="1px" h="30px" bg="gray.200" />
                  
                  {/* Horizontal line for C-Level */}
                  {organizationData.reportees.length > 1 && (
                    <Box
                      w={`${organizationData.reportees.length * 150}px`}
                      maxW="800px"
                      h="1px"
                      bg="gray.200"
                    />
                  )}
                  
                  {/* C-Level and below */}
                  <TreeLevel
                    employees={organizationData.reportees}
                    onEmployeeClick={handleEmployeeClick}
                    level={1}
                  />
                </>
              )}
            </VStack>
          </Box>
        </Box>

        {/* Employee Details Sidebar */}
        {selectedEmployee && (
          <Box 
            w="350px" 
            bg="white" 
            borderLeft="1px solid" 
            borderColor="gray.200"
            overflowY="auto"
            shadow="lg"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#1a7a8a',
                borderRadius: '3px'
              }
            }}
          >
            <VStack align="stretch" gap={0}>
              {/* Header */}
              <Box bg="#1a7a8a" p={4} position="sticky" top={0} zIndex={10}>
                <HStack justify="space-between" align="center">
                  <Heading size="sm" color="white">
                    Employee Details
                  </Heading>
                  <Button 
                    size="xs" 
                    onClick={() => setSelectedEmployee(null)}
                    bg="whiteAlpha.300"
                    color="white"
                    _hover={{ bg: "whiteAlpha.400" }}
                  >
                    ✕
                  </Button>
                </HStack>
              </Box>

              {/* Content */}
              <VStack align="stretch" gap={4} p={4}>
                {/* Profile Section */}
                <HStack gap={3} p={3} bg="blue.50" borderRadius="lg">
                  <Avatar.Root size="lg" bg="#1a7a8a">
                    <Avatar.Image src={selectedEmployee.avatar} />
                    <Avatar.Fallback color="white" fontWeight="bold" fontSize="lg">
                      {selectedEmployee.name.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <VStack align="start" gap={1} flex="1">
                    <Text fontSize="md" fontWeight="bold" color="gray.900">
                      {selectedEmployee.name}
                    </Text>
                    <Text fontSize="xs" color="#1a7a8a" fontWeight="medium">
                      {selectedEmployee.title}
                    </Text>
                  </VStack>
                </HStack>

                {/* Info Grid */}
                <SimpleGrid columns={1} gap={3}>
                  <Box p={3} bg="gray.50" borderRadius="lg">
                    <Text fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>EMAIL</Text>
                    <Text fontSize="xs" color="#1a7a8a" fontWeight="medium">{selectedEmployee.email}</Text>
                  </Box>
                  
                  <Box p={3} bg="gray.50" borderRadius="lg">
                    <Text fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>LOCATION</Text>
                    <Text fontSize="xs" color="gray.700">📍 {selectedEmployee.location}</Text>
                  </Box>
                  
                  <SimpleGrid columns={2} gap={2}>
                    <Box p={3} bg="gray.50" borderRadius="lg">
                      <Text fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>LEVEL</Text>
                      <Text fontSize="sm" fontWeight="bold" color="gray.800">Level {selectedEmployee.level}</Text>
                    </Box>
                    
                    <Box p={3} bg="gray.50" borderRadius="lg">
                      <Text fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>HEALTH</Text>
                      <Text fontSize="sm" fontWeight="bold" color={getPortfolioHealthIcon(selectedEmployee.portfolioHealth).color} textTransform="capitalize">
                        {selectedEmployee.portfolioHealth}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {selectedEmployee.reportees && selectedEmployee.reportees.length > 0 && (
                    <Box p={3} bg="blue.50" borderRadius="lg">
                      <Text fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>DIRECT REPORTS</Text>
                      <Text fontSize="sm" fontWeight="bold" color="#1a7a8a">
                        {selectedEmployee.reportees.length} Team {selectedEmployee.reportees.length === 1 ? 'Member' : 'Members'}
                      </Text>
                    </Box>
                  )}
                </SimpleGrid>

                {/* Action Button */}
                {selectedEmployee.reportees && selectedEmployee.reportees.length > 0 && (
                  <Button
                    w="full"
                    bg="#1a7a8a"
                    color="white"
                    _hover={{ bg: "#226773" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDashboard(selectedEmployee);
                    }}
                    size="md"
                  >
                    📊 View Dashboard
                  </Button>
                )}
              </VStack>
            </VStack>
          </Box>
        )}
      </HStack>

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalEmployee(null);
        }}
        employee={modalEmployee}
      />
    </Box>
  );
};
