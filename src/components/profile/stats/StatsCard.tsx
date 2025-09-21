import { Card, VStack, HStack, Box, Text } from "@chakra-ui/react";

export const StatsCard = ({ title, count, icon }: { title: string; count: number; icon: { bgColor: string; node: React.ReactNode } }) => {
    return (
        <Card.Root bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
            <Card.Body p={4}>
                <VStack align="start" gap={2}>
                <HStack gap={2}>
                    <Box p={{ base: 1.5, md: 2 }} bg={icon.bgColor} borderRadius="md">
                        {icon.node}
                    </Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">{title}</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">{count}</Text>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};