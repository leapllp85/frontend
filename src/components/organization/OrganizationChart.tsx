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

// Clean organization data structure
const organizationData: Employee = {
  id: 'ceo',
  name: 'Mike Stevia',
  title: 'Chief Executive Officer',
  email: 'mike.stevia@company.com',
  location: 'New York',
  portfolioHealth: 'excellent',
  level: 0,
  reportees: [
    {
      id: 'cfo',
      name: 'Oliver Chelangat',
      title: 'Chief Financial Officer',
      email: 'oliver.chelangat@company.com',
      location: 'New York',
      portfolioHealth: 'good',
      level: 1,
      reportees: [
        {
          id: 'vp-marketing',
          name: 'Robert Clark',
          title: 'VP Marketing',
          email: 'robert.clark@company.com',
          location: 'California',
          portfolioHealth: 'average',
          level: 2,
          reportees: [
            {
              id: 'bd-rep',
              name: 'Rosa Bonnier',
              title: 'Business Development Rep',
              email: 'rosa.bonnier@company.com',
              location: 'California',
              portfolioHealth: 'good',
              level: 3
            },
            {
              id: 'designer',
              name: 'Jim Richter',
              title: 'Senior Designer',
              email: 'jim.richter@company.com',
              location: 'California',
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
      portfolioHealth: 'excellent',
      level: 1,
      reportees: [
        {
          id: 'eng-director',
          name: 'Jennifer Brent',
          title: 'Director of Engineering',
          email: 'jennifer.brent@company.com',
          location: 'San Francisco',
          portfolioHealth: 'excellent',
          level: 2,
          reportees: [
            {
              id: 'sw-engineer-1',
              name: 'Melika Cantu',
              title: 'Software Engineer',
              email: 'melika.cantu@company.com',
              location: 'San Francisco',
              portfolioHealth: 'good',
              level: 3
            },
            {
              id: 'sw-engineer-2',
              name: 'Geetham Ravichandran',
              title: 'Software Engineer',
              email: 'geetham.ravichandran@company.com',
              location: 'San Francisco',
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
      portfolioHealth: 'good',
      level: 1,
      reportees: [
        {
          id: 'hr-director',
          name: 'Jane Brown',
          title: 'Director of Human Resources',
          email: 'jane.brown@company.com',
          location: 'Chicago',
          portfolioHealth: 'excellent',
          level: 2,
          reportees: [
            {
              id: 'hr-specialist',
              name: 'Grant Leise',
              title: 'HR Specialist',
              email: 'grant.leise@company.com',
              location: 'Chicago',
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

// Fixed Employee Card Component with Proper Text Fitting
const EmployeeCard: React.FC<{ 
  employee: Employee; 
  onEmployeeClick: (employee: Employee) => void;
}> = ({ employee, onEmployeeClick }) => {
  const router = useRouter();
  const healthConfig = getPortfolioHealthIcon(employee.portfolioHealth);
  const IconComponent = healthConfig.icon;

  const handleViewDashboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/?employee=${employee.id}`);
  };

  // Improved card sizing with better height for larger text
  const cardWidth = employee.level === 0 ? '340px' : employee.level === 1 ? '300px' : '280px';
  const cardHeight = employee.level === 0 ? '180px' : employee.level === 1 ? '160px' : '150px';

  return (
    <Card.Root
      w={cardWidth}
      h={cardHeight}
      bg="white"
      shadow="lg"
      borderRadius="xl"
      border="2px solid"
      borderColor="#1a7a8a"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{ 
        shadow: "xl", 
        transform: "translateY(-2px)",
        borderColor: "#226773"
      }}
      onClick={() => onEmployeeClick(employee)}
    >
      <Card.Body p={3} h="full">
        <VStack gap={2} align="start" h="full" justify="space-between">
          {/* Top section with avatar and name */}
          <HStack gap={3} align="start" w="full">
            <Avatar.Root
              size={employee.level === 0 ? "md" : "sm"}
              bg="#1a7a8a"
              flexShrink={0}
            >
              <Avatar.Image src={employee.avatar} />
              <Avatar.Fallback color="white" fontWeight="bold" fontSize={employee.level === 0 ? "md" : "sm"}>
                {employee.name.charAt(0)}
              </Avatar.Fallback>
            </Avatar.Root>
            
            <VStack align="start" gap={1} flex="1" minW="0">
              <HStack gap={2} align="center" w="full">
                <Text 
                  fontSize={employee.level === 0 ? "lg" : employee.level === 1 ? "md" : "sm"} 
                  fontWeight="bold" 
                  color="gray.900" 
                  flex="1"
                  lineClamp={1}
                  lineHeight="1.2"
                >
                  {employee.name}
                </Text>
                <Box
                  p={1}
                  borderRadius="full"
                  bg={healthConfig.bgColor}
                  title={`Portfolio Health: ${employee.portfolioHealth}`}
                  flexShrink={0}
                >
                  <IconComponent size={employee.level === 0 ? 14 : 12} color={healthConfig.color} />
                </Box>
              </HStack>
              
              <Text 
                fontSize={employee.level === 0 ? "sm" : employee.level === 1 ? "xs" : "2xs"} 
                color="gray.600" 
                lineClamp={2}
                lineHeight="1.3"
                w="full"
              >
                {employee.title}
              </Text>
            </VStack>
          </HStack>
          
          {/* Bottom section with contact info */}
          <VStack align="start" gap={1} w="full" spacing={0}>
            <Text 
              fontSize={employee.level === 0 ? "xs" : "2xs"} 
              color="#1a7a8a" 
              fontWeight="medium"
              lineClamp={1}
              w="full"
            >
              {employee.email}
            </Text>
            
            <Text fontSize={employee.level === 0 ? "xs" : "2xs"} color="gray.500" lineClamp={1}>
              📍 {employee.location}
            </Text>
            
            {employee.reportees && employee.reportees.length > 0 && (
              <Button
                size="sm"
                bg="#1a7a8a"
                color="white"
                _hover={{ bg: "#226773" }}
                onClick={handleViewDashboard}
                mt={2}
                borderRadius="md"
                fontSize={employee.level === 0 ? "sm" : "xs"}
                h="28px"
                px={3}
              >
                📊 Dashboard
              </Button>
            )}
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

// Fixed Organization Level Component with Proper Connecting Lines
const OrganizationLevel: React.FC<{ 
  employees: Employee[]; 
  onEmployeeClick: (employee: Employee) => void;
}> = ({ employees, onEmployeeClick }) => {
  if (!employees || employees.length === 0) return null;

  return (
    <VStack gap={4} w="full" align="center">
      {/* Simple horizontal line for multiple employees */}
      {employees.length > 1 && (
        <Box w="60%" h="2px" bg="#1a7a8a" borderRadius="full" shadow="sm" mb={2} />
      )}
      
      {/* Employee cards with proper spacing */}
      <HStack gap={6} justify="center" flexWrap="wrap" w="full">
        {employees.map((employee) => (
          <VStack key={employee.id} gap={2} align="center">
            <EmployeeCard 
              employee={employee} 
              onEmployeeClick={onEmployeeClick}
            />
            
            {/* Vertical line to children with proper connection */}
            {employee.reportees && employee.reportees.length > 0 && (
              <>
                <Box 
                  w="3px" 
                  h="24px" 
                  bg="#1a7a8a" 
                  borderRadius="full"
                  shadow="sm"
                />
                <OrganizationLevel 
                  employees={employee.reportees} 
                  onEmployeeClick={onEmployeeClick}
                />
              </>
            )}
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
};

// Fixed Main Organization Chart Component with Proper Scrolling
export const OrganizationChart: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <Box 
      w="full" 
      h="100vh" 
      bg="gray.50" 
      overflowX="auto"
      overflowY="auto"
      position="relative"
    >
      <Box 
        minW="1200px" 
        minH="full" 
        p={6}
        pb={20} // Extra padding at bottom to ensure scrolling works
      >
        <VStack gap={6} w="full" align="center">
          {/* Header */}
          <VStack gap={3} textAlign="center">
            <Heading size="xl" color="#1a7a8a" fontWeight="bold">
              🏢 Organization Structure
            </Heading>
            <Text color="gray.600" fontSize="md" maxW="600px" lineHeight="1.5">
              Click on any employee card to view details, or use "📊 Dashboard" to see team metrics.
            </Text>
          </VStack>

          {/* CEO Level with Proper Connection */}
          <VStack gap={3} w="full" align="center">
            <EmployeeCard 
              employee={organizationData} 
              onEmployeeClick={handleEmployeeClick}
            />
            
            {/* Simple connection line from CEO */}
            {organizationData.reportees && organizationData.reportees.length > 0 && (
              <Box w="3px" h="24px" bg="#1a7a8a" borderRadius="full" shadow="sm" />
            )}
            
            {/* C-Level Executives */}
            {organizationData.reportees && (
              <OrganizationLevel 
                employees={organizationData.reportees} 
                onEmployeeClick={handleEmployeeClick}
              />
            )}
          </VStack>

          {/* Selected Employee Details */}
          {selectedEmployee && (
            <Card.Root 
              w="full" 
              maxW="500px" 
              bg="white" 
              shadow="xl" 
              borderRadius="xl"
              border="2px solid"
              borderColor="#1a7a8a"
              mt={8}
            >
              <Card.Header bg="#1a7a8a" p={4}>
                <Heading size="md" color="white">
                  👤 Employee Details
                </Heading>
              </Card.Header>
              <Card.Body p={4}>
                <VStack align="start" gap={4}>
                  <HStack gap={4}>
                    <Avatar.Root size="lg" bg="#1a7a8a">
                      <Avatar.Image src={selectedEmployee.avatar} />
                      <Avatar.Fallback color="white" fontWeight="bold">
                        {selectedEmployee.name.charAt(0)}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <VStack align="start" gap={1}>
                      <Text fontSize="lg" fontWeight="bold">
                        {selectedEmployee.name}
                      </Text>
                      <Text color="#1a7a8a" fontWeight="medium">
                        {selectedEmployee.title}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <SimpleGrid columns={2} gap={4} w="full">
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700">📧 Email</Text>
                      <Text fontSize="sm" color="#1a7a8a">{selectedEmployee.email}</Text>
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700">📍 Location</Text>
                      <Text fontSize="sm" color="gray.600">{selectedEmployee.location}</Text>
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700">💼 Level</Text>
                      <Text fontSize="sm" color="gray.600">Level {selectedEmployee.level}</Text>
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700">📊 Health</Text>
                      <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                        {selectedEmployee.portfolioHealth}
                      </Text>
                    </VStack>
                    {selectedEmployee.reportees && (
                      <VStack align="start" gap={1}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">👥 Reports</Text>
                        <Text fontSize="sm" color="#1a7a8a" fontWeight="medium">
                          {selectedEmployee.reportees.length} team members
                        </Text>
                      </VStack>
                    )}
                  </SimpleGrid>
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
