import { Box, Card, Heading, VStack, Text, HStack, Badge, Link } from "@chakra-ui/react";
import { formatDate } from "@/utils/date";

export const ActionItems = ({ actionItems }: { actionItems: any[] }) => {
  return (
    <Card.Root bg="white" shadow="md">
      <Card.Header p={4} borderBottom="1px solid" borderColor="gray.100">
        <Heading size="md" color="gray.800">Action Items</Heading>
      </Card.Header>
      <Card.Body p={4}>
        <VStack gap={3} align="stretch">
          {actionItems.length > 0 ? (
            actionItems.map((item, index) => (
              <Box key={index} p={3} bg="gray.50" borderRadius="md">
                <Link w="full" href={item.action}>
                  <HStack w="full" justify="space-between">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium" color="gray.800">{item.title}</Text>
                      <Text fontSize="sm" color="gray.600">Last Updated on {formatDate(item.updated_at)}</Text>
                    </VStack>
                    <Badge
                      colorPalette={item.status === 'Completed' ? 'green' : item.status === 'Pending' ? 'orange' : 'gray'}
                      variant="solid"
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </HStack>
                </Link>
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center" py={8}>
              No action items found
            </Text>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};