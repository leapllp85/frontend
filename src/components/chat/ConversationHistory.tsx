'use client';

import React, { useState, useMemo } from 'react';
import { useClientOnly } from '../../hooks/useClientOnly';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Button,
  Card,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import {
  Search,
  MessageSquare,
  MoreVertical,
  Trash2,
  Edit3,
  Star,
  Archive,
  Calendar,
  Filter,
  Plus,
} from 'lucide-react';
import { ChatConversation } from '../../types/ragApi';
import { useChatContext } from '../../contexts/ChatContext';

interface ConversationHistoryProps {
  conversations: ChatConversation[];
  currentConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onRenameConversation?: (conversationId: string, newTitle: string) => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onArchiveConversation,
  onRenameConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'archived'>('all');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [newTitle, setNewTitle] = useState('');
  
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { startNewConversation } = useChatContext();

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const hasMatchingMessage = conv.messages.some(msg => 
          msg.content.toLowerCase().includes(query)
        );
        const hasMatchingTitle = conv.title?.toLowerCase().includes(query);
        if (!hasMatchingMessage && !hasMatchingTitle) return false;
      }
      
      // Type filter (placeholder for future starred/archived functionality)
      if (filterType === 'starred') {
        // return conv.isStarred;
      }
      if (filterType === 'archived') {
        // return conv.isArchived;
      }
      
      return true;
    }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [conversations, searchQuery, filterType]);

  const isClient = useClientOnly();
  
  const formatDate = (date: Date) => {
    if (!isClient) return '';
    
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationPreview = (conversation: ChatConversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return 'New conversation';
    
    const preview = lastMessage.content.length > 60 
      ? lastMessage.content.substring(0, 60) + '...'
      : lastMessage.content;
    
    return preview || 'No messages yet';
  };

  const getConversationTitle = (conversation: ChatConversation) => {
    if (conversation.title) return conversation.title;
    
    const firstUserMessage = conversation.messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 30
        ? firstUserMessage.content.substring(0, 30) + '...'
        : firstUserMessage.content;
    }
    
    return 'New Conversation';
  };

  const handleRename = () => {
    if (selectedConversation && newTitle.trim() && onRenameConversation) {
      onRenameConversation(selectedConversation.id, newTitle.trim());
    }
    setIsRenameOpen(false);
    setNewTitle('');
    setSelectedConversation(null);
  };

  const handleDelete = () => {
    if (selectedConversation && onDeleteConversation) {
      onDeleteConversation(selectedConversation.id);
    }
    setIsDeleteOpen(false);
    setSelectedConversation(null);
  };

  const openRenameModal = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setNewTitle(getConversationTitle(conversation));
    setIsRenameOpen(true);
  };

  const openDeleteModal = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setIsDeleteOpen(true);
  };

  return (
    <Box w="full" h="full" display="flex" flexDirection="column">
      {/* Header */}
      <VStack gap={3} p={4} borderBottom="1px solid" borderColor="gray.200">
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            Conversations
          </Text>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={startNewConversation}
          >
            <Plus size={14} />
            New Chat
          </Button>
        </HStack>

        {/* Search */}
        <Box position="relative" w="full">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            pr="40px"
            size="sm"
          />
          <Box position="absolute" right="2" top="50%" transform="translateY(-50%)">
            <Search size={16} color="#9CA3AF" />
          </Box>
        </Box>

        {/* Filters */}
        <HStack gap={2} w="full">
          {(['all', 'starred', 'archived'] as const).map((filter) => (
            <Button
              key={filter}
              size="xs"
              variant={filterType === filter ? 'solid' : 'ghost'}
              colorScheme={filterType === filter ? 'blue' : 'gray'}
              onClick={() => setFilterType(filter)}
              textTransform="capitalize"
            >
              {filter}
            </Button>
          ))}
        </HStack>
      </VStack>

      {/* Conversations List */}
      <VStack gap={2} p={4} flex="1" overflowY="auto" align="stretch">
        {filteredConversations.length === 0 ? (
          <Box textAlign="center" py={8}>
            <MessageSquare size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
            <Text color="gray.500" fontSize="sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </Text>
            <Text color="gray.400" fontSize="xs" mt={1}>
              {searchQuery ? 'Try a different search term' : 'Start a new conversation to get started'}
            </Text>
          </Box>
        ) : (
          filteredConversations.map((conversation) => (
            <Card.Root
              key={conversation.id}
              cursor="pointer"
              onClick={() => onSelectConversation(conversation.id)}
              bg={currentConversationId === conversation.id ? 'blue.50' : 'white'}
              borderColor={currentConversationId === conversation.id ? 'blue.200' : 'gray.200'}
              borderWidth="1px"
              _hover={{
                borderColor: 'blue.300',
                shadow: 'sm',
              }}
              transition="all 0.2s"
            >
              <Card.Body p={3}>
                <HStack justify="space-between" align="start" gap={2}>
                  <VStack align="start" gap={1} flex="1" minW="0">
                    <HStack gap={2} w="full">
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.800"
                        flex="1"
                        truncate
                      >
                        {getConversationTitle(conversation)}
                      </Text>
                      {conversation.messages.length > 0 && (
                        <Badge
                          size="sm"
                          colorScheme="gray"
                          variant="subtle"
                          fontSize="xs"
                        >
                          {conversation.messages.length}
                        </Badge>
                      )}
                    </HStack>
                    
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      lineHeight="1.3"
                      css={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {getConversationPreview(conversation)}
                    </Text>
                    
                    <HStack gap={2} mt={1}>
                      <HStack gap={1}>
                        <Calendar size={10} color="#9CA3AF" />
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(conversation.updated_at)}
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>

                  {/* Actions Menu */}
                  <VStack gap={1}>
                    <Tooltip label="Rename conversation">
                      <IconButton
                        size="xs"
                        variant="ghost"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          openRenameModal(conversation);
                        }}
                        aria-label="Rename conversation"
                      >
                        <Edit3 size={12} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip label="Delete conversation">
                      <IconButton
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          openDeleteModal(conversation);
                        }}
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={12} />
                      </IconButton>
                    </Tooltip>
                  </VStack>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))
        )}
      </VStack>

      {/* Simple Modal Replacements */}
      {isRenameOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="modal"
        >
          <Card.Root maxW="md" w="full" mx={4}>
            <Card.Header>
              <Text fontSize="lg" fontWeight="bold">Rename Conversation</Text>
            </Card.Header>
            <Card.Body>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title..."
                autoFocus
              />
            </Card.Body>
            <Card.Footer>
              <HStack gap={3}>
                <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleRename}>
                  Rename
                </Button>
              </HStack>
            </Card.Footer>
          </Card.Root>
        </Box>
      )}

      {isDeleteOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="modal"
        >
          <Card.Root maxW="md" w="full" mx={4}>
            <Card.Header>
              <Text fontSize="lg" fontWeight="bold">Delete Conversation</Text>
            </Card.Header>
            <Card.Body>
              <Text>
                Are you sure you want to delete this conversation? This action cannot be undone.
              </Text>
            </Card.Body>
            <Card.Footer>
              <HStack gap={3}>
                <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDelete}>
                  Delete
                </Button>
              </HStack>
            </Card.Footer>
          </Card.Root>
        </Box>
      )}
    </Box>
  );
};
