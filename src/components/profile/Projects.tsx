import { Box, Card, Heading, VStack, Text, HStack, Badge } from "@chakra-ui/react";
import { formatDate } from '@/utils/date';

export const Projects = ({ projects }: { projects: any[] }) => {
  return (
    <Card.Root bg="white" shadow="md">
      <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
        <Heading size="md" color="gray.800">Projects</Heading>
      </Card.Header>
      <Card.Body p={4}>
        <VStack gap={3} align="stretch">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <Box key={index} p={3} bg="gray.50" borderRadius="md">
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Text fontWeight="medium" color="gray.800">{project.title}</Text>
                    <Text fontSize="sm" color="gray.600">{project.description}</Text>
                  </VStack>
                  <VStack align="end" gap={1}>
                    <Badge
                      colorPalette={project.status === 'Active' ? 'green' : 'gray'}
                      variant="solid"
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {formatDate(project.go_live_date)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center" py={8}>
              No projects found
            </Text>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};