import React from "react";
import { Box, Text, HStack, VStack, Card, Heading } from "@chakra-ui/react";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info';
}

interface NotificationsPanelProps {
  notifications?: Notification[];
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'High Attrition Risk',
    description: '5 team members show high risk of attrition',
    timestamp: '10 min ago',
    type: 'error'
  },
  {
    id: '2',
    title: 'Project Deadline',
    description: 'Project Alpha milestone due in 3 days',
    timestamp: '2 hours ago',
    type: 'warning'
  },
  {
    id: '3',
    title: 'New Team Member',
    description: 'Alex Johnson has joined Project Beta',
    timestamp: '1 day ago',
    type: 'info'
  }
];

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'error': return 'red.500';
    case 'warning': return 'orange.500';
    case 'info': return 'blue.500';
    default: return 'gray.500';
  }
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications = defaultNotifications
}) => {
  return (
    <Card.Root bg="white" shadow="md" borderRadius="xl" h="full" display="flex" flexDirection="column">
      <Card.Header p={3} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between">
          <Heading size="md" color="gray.800">Notifications</Heading>
          <Text fontSize="sm" color="blue.500" cursor="pointer">View All</Text>
        </HStack>
      </Card.Header>
      <Card.Body p={3} flex="1" overflow="auto">
        <VStack gap={4} align="stretch">
          {notifications.map((notification) => (
            <HStack key={notification.id} gap={3}>
              <Box 
                w={2} 
                h={2} 
                bg={getNotificationColor(notification.type)} 
                borderRadius="full" 
                mt={2} 
              />
              <VStack align="start" gap={1} flex={1}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                  {notification.title}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {notification.description}
                </Text>
                <Text fontSize="xs" color="gray.400">{notification.timestamp}</Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
