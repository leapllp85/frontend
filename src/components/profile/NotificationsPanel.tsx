'use client';

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
  // Show only the first 3 notifications
  const topNotifications = notifications.slice(0, 3);

  return (
    <Card.Root 
      bg="#e6fffa" 
      shadow="sm" 
      borderRadius="2xl" 
      h="full" 
      display="flex" 
      flexDirection="column" 
      border="1px solid" 
      borderColor="gray.200"
      maxH="280px"
      minH="240px"
    >
      <Card.Header p={3} pb={2} borderBottom="1px solid" borderColor="gray.100">
        <HStack justify="space-between" align="center">
          <Heading size="sm" color="gray.800" textAlign="center">Attrition Trends</Heading>
          <Text fontSize="xs" color="teal.500" cursor="pointer">view more →</Text>
        </HStack>
      </Card.Header>
     
    </Card.Root>
  );
};
