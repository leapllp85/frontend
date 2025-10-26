'use client';

import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Grid,
  GridItem,
  Button,
  Heading
} from '@chakra-ui/react';
import { Card, Avatar } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface Employee {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  reportees?: Employee[];
}

const organizationData: Employee = {
  id: 'ceo',
  name: 'Mike Stevia',
  title: 'Chief Executive Officer',
  email: 'mike.stevia@company.com',
  phone: '+1 (555) 123-4567',
  location: 'New York',
  avatar: '/avatars/mike.jpg',
  reportees: [
    {
      id: 'cfo',
      name: 'Oliver Chelangat',
      title: 'Chief Financial Officer',
      email: 'oliver.chelangat@company.com',
      phone: '+1 (555) 234-5678',
      location: 'New York',
      avatar: '/avatars/oliver.jpg',
      reportees: [
        {
          id: 'vp-marketing',
          name: 'Robert Clark',
          title: 'VP President of Marketing',
          email: 'robert.clark@company.com',
          phone: '+1 (555) 345-6789',
          location: 'California',
          reportees: [
            {
              id: 'bd-rep',
              name: 'Rosa Bonnier',
              title: 'Business Development Representative',
              email: 'rosa.bonnier@company.com',
              phone: '+1 (555) 456-7890',
              location: 'California'
            },
            {
              id: 'sr-designer',
              name: 'Jim Richter',
              title: 'Senior Product Designer',
              email: 'jim.richter@company.com',
              phone: '+1 (555) 567-8901',
              location: 'California'
            },
            {
              id: 'cmo',
              name: 'Janice Goodacre',
              title: 'Chief Marketing Officer',
              email: 'janice.goodacre@company.com',
              phone: '+1 (555) 678-9012',
              location: 'California'
            }
          ]
        },
        {
          id: 'vp-president',
          name: 'John Fosten',
          title: 'VP President of Marketing',
          email: 'john.fosten@company.com',
          phone: '+1 (555) 789-0123',
          location: 'New York',
          reportees: [
            {
              id: 'sales-rep',
              name: 'Dylan Becker',
              title: 'Inside Sales Representative',
              email: 'dylan.becker@company.com',
              phone: '+1 (555) 890-1234',
              location: 'New York'
            },
            {
              id: 'sales-rep-2',
              name: 'Katherine Jenkins',
              title: 'Inside Sales Representative',
              email: 'katherine.jenkins@company.com',
              phone: '+1 (555) 901-2345',
              location: 'New York'
            },
            {
              id: 'sales-rep-3',
              name: 'Hector Reed',
              title: 'Inside Sales Representative',
              email: 'hector.reed@company.com',
              phone: '+1 (555) 012-3456',
              location: 'New York'
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
      phone: '+1 (555) 123-4567',
      location: 'San Francisco',
      avatar: '/avatars/alejandro.jpg',
      reportees: [
        {
          id: 'vp-quality',
          name: 'Michael Simonetti',
          title: 'VP President of Quality Assurance',
          email: 'michael.simonetti@company.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco',
          reportees: [
            {
              id: 'qa-engineer',
              name: 'Mark Meyer',
              title: 'Quality Assurance Engineer',
              email: 'mark.meyer@company.com',
              phone: '+1 (555) 345-6789',
              location: 'San Francisco'
            },
            {
              id: 'qa-engineer-2',
              name: 'Mathew Arnold',
              title: 'Quality Assurance Engineer',
              email: 'mathew.arnold@company.com',
              phone: '+1 (555) 456-7890',
              location: 'San Francisco'
            }
          ]
        },
        {
          id: 'dir-engineering',
          name: 'Jennifer Brent',
          title: 'Director of Engineering',
          email: 'jennifer.brent@company.com',
          phone: '+1 (555) 567-8901',
          location: 'San Francisco',
          reportees: [
            {
              id: 'sw-engineer',
              name: 'Melika Cantu',
              title: 'Software Engineer',
              email: 'melika.cantu@company.com',
              phone: '+1 (555) 678-9012',
              location: 'San Francisco'
            },
            {
              id: 'sw-engineer-2',
              name: 'Geetham Ravichandran',
              title: 'Software Engineer',
              email: 'geetham.ravichandran@company.com',
              phone: '+1 (555) 789-0123',
              location: 'San Francisco'
            },
            {
              id: 'product-manager',
              name: 'Sam Friedman',
              title: 'Product Manager',
              email: 'sam.friedman@company.com',
              phone: '+1 (555) 890-1234',
              location: 'San Francisco'
            },
            {
              id: 'trader',
              name: 'Clinton Goodin',
              title: 'Trader - Analyst',
              email: 'clinton.goodin@company.com',
              phone: '+1 (555) 901-2345',
              location: 'San Francisco'
            }
          ]
        }
      ]
    },
    {
      id: 'cfo-2',
      name: 'Emily Tucker',
      title: 'Chief Financial Officer',
      email: 'emily.tucker@company.com',
      phone: '+1 (555) 012-3456',
      location: 'Chicago',
      avatar: '/avatars/emily.jpg',
      reportees: [
        {
          id: 'dir-operations',
          name: 'Timothy Bucket',
          title: 'Director of Operations',
          email: 'timothy.bucket@company.com',
          phone: '+1 (555) 123-4567',
          location: 'Chicago',
          reportees: [
            {
              id: 'accountant',
              name: 'Robert Griffin',
              title: 'Accountant',
              email: 'robert.griffin@company.com',
              phone: '+1 (555) 234-5678',
              location: 'Chicago'
            },
            {
              id: 'accountant-2',
              name: 'Calvin Jobbs',
              title: 'Financial Analyst',
              email: 'calvin.jobbs@company.com',
              phone: '+1 (555) 345-6789',
              location: 'Chicago'
            }
          ]
        },
        {
          id: 'vp-operations',
          name: 'Julie Adams',
          title: 'VP President of Operations',
          email: 'julie.adams@company.com',
          phone: '+1 (555) 456-7890',
          location: 'Chicago',
          reportees: [
            {
              id: 'hr-admin',
              name: 'Presley Sha',
              title: 'Human Resource Administrator',
              email: 'presley.sha@company.com',
              phone: '+1 (555) 567-8901',
              location: 'Chicago'
            },
            {
              id: 'hr-admin-2',
              name: 'Jane Brown',
              title: 'Director of Human Resources',
              email: 'jane.brown@company.com',
              phone: '+1 (555) 678-9012',
              location: 'Chicago'
            },
            {
              id: 'hr-specialist',
              name: 'Grant Leise',
              title: 'Human Resource Specialist',
              email: 'grant.leise@company.com',
              phone: '+1 (555) 789-0123',
              location: 'Chicago'
            },
            {
              id: 'coordinator',
              name: 'Taylor Jones',
              title: 'Training Coordinator',
              email: 'taylor.jones@company.com',
              phone: '+1 (555) 890-1234',
              location: 'Chicago'
            }
          ]
        }
      ]
    }
  ]
};

const EmployeeCard: React.FC<{ 
  employee: Employee; 
  level: number; 
  onEmployeeClick: (employee: Employee) => void;
}> = ({ employee, level, onEmployeeClick }) => {
  const router = useRouter();
  
  const handleClick = () => {
    onEmployeeClick(employee);
  };

  const handleViewDashboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to home page with employee context
    router.push(`/?employee=${employee.id}`);
  };

  const getCardSize = (level: number) => {
    switch (level) {
      case 0: return { width: '280px', height: '120px' }; // CEO
      case 1: return { width: '260px', height: '110px' }; // C-Level
      case 2: return { width: '240px', height: '100px' }; // VP/Director
      default: return { width: '220px', height: '90px' }; // Others
    }
  };

  const cardSize = getCardSize(level);

  return (
    <Card.Root
      w={cardSize.width}
      h={cardSize.height}
      bg="white"
      shadow="md"
      borderRadius="xl"
      border="2px solid"
      borderColor={level === 0 ? "blue.400" : level === 1 ? "green.400" : level === 2 ? "orange.400" : "gray.300"}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ 
        shadow: "lg", 
        transform: "translateY(-2px)",
        borderColor: level === 0 ? "blue.500" : level === 1 ? "green.500" : level === 2 ? "orange.500" : "gray.400"
      }}
      onClick={handleClick}
    >
      <Card.Body p={3}>
        <HStack gap={3} align="start">
          <Avatar.Root
            size="md"
            bg={level === 0 ? "blue.500" : level === 1 ? "green.500" : level === 2 ? "orange.500" : "gray.500"}
          >
            <Avatar.Image src={employee.avatar} />
            <Avatar.Fallback>{employee.name.charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar.Root>
          <VStack align="start" gap={0} flex="1" minW="0">
            <Text fontSize="sm" fontWeight="bold" color="gray.900" lineClamp={1}>
              {employee.name}
            </Text>
            <Text fontSize="xs" color="gray.600" lineClamp={2}>
              {employee.title}
            </Text>
            <Text fontSize="xs" color="blue.600">
              {employee.email}
            </Text>
            <Text fontSize="xs" color="gray.500">
              📍 {employee.location}
            </Text>
            {employee.reportees && employee.reportees.length > 0 && (
              <Button
                size="xs"
                colorScheme="blue"
                variant="outline"
                onClick={handleViewDashboard}
                mt={1}
              >
                View Dashboard
              </Button>
            )}
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

const OrganizationLevel: React.FC<{ 
  employees: Employee[]; 
  level: number; 
  onEmployeeClick: (employee: Employee) => void;
}> = ({ employees, level, onEmployeeClick }) => {
  return (
    <VStack gap={4} w="full">
      <HStack gap={6} justify="center" flexWrap="wrap">
        {employees.map((employee) => (
          <VStack key={employee.id} gap={2} align="center">
            <EmployeeCard 
              employee={employee} 
              level={level} 
              onEmployeeClick={onEmployeeClick}
            />
            {employee.reportees && employee.reportees.length > 0 && (
              <>
                {/* Connection Line */}
                <Box w="2px" h="20px" bg="gray.300" />
                <OrganizationLevel 
                  employees={employee.reportees} 
                  level={level + 1} 
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

export const OrganizationChart: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <Box w="full" h="100vh" bg="gray.50" overflow="auto" p={6}>
      <VStack gap={6} w="full">
        {/* Header */}
        <VStack gap={2}>
          <Heading size="lg" color="gray.800">
            Organization Structure
          </Heading>
          <Text color="gray.600">
            Click on any employee to view details, or click "View Dashboard" to see their team metrics
          </Text>
        </VStack>

        {/* CEO Level */}
        <VStack gap={4} w="full" align="center">
          <EmployeeCard 
            employee={organizationData} 
            level={0} 
            onEmployeeClick={handleEmployeeClick}
          />
          
          {/* Connection Line */}
          <Box w="2px" h="30px" bg="gray.400" />
          
          {/* Rest of Organization */}
          {organizationData.reportees && (
            <OrganizationLevel 
              employees={organizationData.reportees} 
              level={1} 
              onEmployeeClick={handleEmployeeClick}
            />
          )}
        </VStack>

        {/* Selected Employee Details */}
        {selectedEmployee && (
          <Card.Root w="full" maxW="500px" bg="white" shadow="lg" borderRadius="xl">
            <Card.Header>
              <Heading size="md">Employee Details</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap={3}>
                <HStack gap={4}>
                  <Avatar.Root size="lg">
                    <Avatar.Image src={selectedEmployee.avatar} />
                    <Avatar.Fallback>{selectedEmployee.name.charAt(0).toUpperCase()}</Avatar.Fallback>
                  </Avatar.Root>
                  <VStack align="start" gap={1}>
                    <Text fontSize="lg" fontWeight="bold">
                      {selectedEmployee.name}
                    </Text>
                    <Text color="gray.600">
                      {selectedEmployee.title}
                    </Text>
                  </VStack>
                </HStack>
                <VStack align="start" gap={2} w="full">
                  <Text><strong>Email:</strong> {selectedEmployee.email}</Text>
                  <Text><strong>Phone:</strong> {selectedEmployee.phone}</Text>
                  <Text><strong>Location:</strong> {selectedEmployee.location}</Text>
                  {selectedEmployee.reportees && (
                    <Text><strong>Direct Reports:</strong> {selectedEmployee.reportees.length}</Text>
                  )}
                </VStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        )}
      </VStack>
    </Box>
  );
};
