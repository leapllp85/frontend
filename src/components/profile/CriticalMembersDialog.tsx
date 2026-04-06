'use client';

import React from 'react';
import { Box, HStack, VStack, Text, IconButton, Badge, Button, Dialog } from '@chakra-ui/react';
import { ArrowLeftRight, X } from 'lucide-react';

interface CriticalMember {
  name: string;
  attritionRisk: string;
}

interface AtRiskProject {
  projectName: string;
  riskLevel: string;
  progress: number;
  dueDate: string;
  criticalMembers: CriticalMember[];
}

interface CriticalMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: AtRiskProject[];
}

export const CriticalMembersDialog: React.FC<CriticalMembersDialogProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  const getRiskColor = (level: string) => {
    if (level === 'High Risk') return 'red';
    if (level === 'Medium Risk') return 'orange';
    return 'green';
  };

  const getAttritionColor = (level: string) => {
    if (level === 'High') return 'red';
    if (level === 'Medium') return 'orange';
    return 'green';
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="1400px" maxH="90vh" borderRadius="xl" overflow="hidden">
          <Dialog.Header
            bg="linear-gradient(to right, #DBEAFE, #bdfbfaff)"
            borderBottom="none"
            p={5}
          >
            <HStack justify="space-between" align="center" w="full">
              <HStack gap={2} align="center">
                <Box p={2} bg="white" borderRadius="lg" shadow="sm">
                  <ArrowLeftRight size={20} color="#3B82F6" />
                </Box>
                <VStack align="start" gap={0.5}>
                  <Dialog.Title fontSize="lg" fontWeight="600" color="gray.900">
                    Projects At Risk - Critical Members
                  </Dialog.Title>
                  <Text fontSize="sm" color="gray.600" fontWeight="normal">
                    At-risk projects with critical team members assigned
                  </Text>
                </VStack>
              </HStack>
              <Dialog.CloseTrigger asChild>
                <Button 
                  size="sm" 
                  bg="gray.800" 
                  color="white"
                  _hover={{ bg: "gray.700" }}
                  px={4}
                  py={2}
                  borderRadius="md"
                  fontWeight="500"
                  fontSize="sm"
                  shadow="sm"
                  flexShrink={0}
                >
                  Close
                </Button>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body 
            overflowY="auto" 
            maxH="calc(90vh - 180px)" 
            p={0}
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f5f9',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: '10px',
                border: '2px solid #f1f5f9',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#94a3b8',
              },
            }}
          >
            <Box overflowX="auto" overflow="hidden">
              <Box as="table" w="full" css={{ borderCollapse: 'collapse' }}>
                {/* Table Header */}
                <Box as="thead">
                  <Box
                    as="tr"
                    bg="white"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                  >
                    <Box as="th" py={3} px={4} textAlign="left" fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                      PROJECT NAME
                    </Box>
                    <Box as="th" py={3} px={4} textAlign="center" fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                      PROJECT RISK
                    </Box>
                    <Box as="th" py={3} px={4} textAlign="center" fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                      PROGRESS
                    </Box>
                    <Box as="th" py={3} px={4} textAlign="center" fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                      DELIVERY DATE
                    </Box>
                    <Box as="th" py={3} px={4} textAlign="left" fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                      CRITICAL MEMBER
                    </Box>
                    <Box as="th" py={3} px={4} textAlign="center" fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                      ATTRITION RISK
                    </Box>
                  </Box>
                </Box>

                {/* Table Body */}
                <Box as="tbody">
                  {projects.map((project, pIndex) => {
                    return project.criticalMembers.map((member, mIndex) => {
                      const isLastMemberOfProject = mIndex === project.criticalMembers.length - 1;

                      return (
                        <Box
                          as="tr"
                          key={`${pIndex}-${mIndex}`}
                          bg="white"
                          borderBottom="1px solid"
                          borderColor="gray.100"
                          _hover={{ bg: 'gray.50' }}
                          transition="all 0.2s"
                        >
                          {/* Project Name - only show for first member */}
                          {mIndex === 0 ? (
                            <Box
                              as="td"
                              py={4}
                              px={4}
                              {...({ rowSpan: project.criticalMembers.length } as any)}
                              borderRight="1px solid"
                              borderColor="gray.100"
                              verticalAlign="top"
                            >
                              <Text fontSize="sm" fontWeight="500" color="gray.900">
                                {project.projectName}
                              </Text>
                            </Box>
                          ) : null}

                          {/* Project Risk - only show for first member */}
                          {mIndex === 0 ? (
                            <Box
                              as="td"
                              py={4}
                              px={4}
                              {...({ rowSpan: project.criticalMembers.length } as any)}
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.100"
                              verticalAlign="top"
                              bg={
                                project.riskLevel === 'High Risk'
                                  ? 'red.50'
                                  : project.riskLevel === 'Medium Risk'
                                  ? 'orange.50'
                                  : 'green.50'
                              }
                            >
                              <Badge
                                colorScheme={getRiskColor(project.riskLevel)}
                                fontSize="xs"
                                px={3}
                                py={1}
                                fontWeight="600"
                                borderRadius="md"
                              >
                                {project.riskLevel}
                              </Badge>
                            </Box>
                          ) : null}

                          {/* Progress - only show for first member */}
                          {mIndex === 0 ? (
                            <Box
                              as="td"
                              py={4}
                              px={4}
                              {...({ rowSpan: project.criticalMembers.length } as any)}
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.100"
                              verticalAlign="top"
                            >
                              <Text fontSize="sm" fontWeight="600" color="gray.900">
                                {project.progress}%
                              </Text>
                            </Box>
                          ) : null}

                          {/* Delivery Date - only show for first member */}
                          {mIndex === 0 ? (
                            <Box
                              as="td"
                              py={4}
                              px={4}
                              {...({ rowSpan: project.criticalMembers.length } as any)}
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.100"
                              verticalAlign="top"
                            >
                              <Text fontSize="sm" fontWeight="500" color="gray.700">
                                {project.dueDate}
                              </Text>
                            </Box>
                          ) : null}

                          {/* Critical Member Name */}
                          <Box
                            as="td"
                            py={4}
                            px={4}
                            borderRight="1px solid"
                            borderColor="gray.100"
                          >
                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                              {member.name}
                            </Text>
                          </Box>

                          {/* Attrition Risk */}
                          <Box
                            as="td"
                            py={4}
                            px={4}
                            textAlign="center"
                          >
                            {member.attritionRisk === 'High' ? (
                              <Text fontSize="sm" fontWeight="600" color="red.600">
                                {member.attritionRisk}
                              </Text>
                            ) : (
                              <Badge
                                colorScheme={getAttritionColor(member.attritionRisk)}
                                fontSize="xs"
                                px={2}
                                py={0.5}
                                fontWeight="600"
                                borderRadius="md"
                              >
                                {member.attritionRisk}
                              </Badge>
                            )}
                          </Box>
                        </Box>
                      );
                    });
                  })}
                </Box>
              </Box>
            </Box>
          </Dialog.Body>

          <Dialog.Footer bg="gray.900" p={4}>
            <Text fontSize="sm" color="gray.300">
              Showing {projects.length} at-risk projects with critical members
            </Text>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
