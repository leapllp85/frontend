'use client';

import React, { useState, useEffect } from 'react';
import { useClientOnly } from '../../hooks/useClientOnly';
import {
  Box,
  HStack,
  VStack,
  Flex,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChatInput } from './ChatInput';
import { ConversationView } from './ConversationView';
import { ConversationHistory } from './ConversationHistory';
import { TypingIndicator } from './TypingIndicator';
import { useChatContext } from '../../contexts/ChatContext';

interface EnhancedChatInterfaceProps {
  showHistory?: boolean;
  allowAttachments?: boolean;
  allowVoice?: boolean;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  showHistory = true,
  allowAttachments = true,
  allowVoice = false,
}) => {
  const {
    currentConversation,
    conversations,
    isLoading,
    isTyping,
    progress,
    sendMessage,
    sendMessageAsync,
    loadConversation,
    deleteConversation,
    renameConversation,
    archiveConversation,
    setTyping,
  } = useChatContext();

  const isClient = useClientOnly();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  useEffect(() => {
    if (isClient) {
      setShowHistoryPanel(!isMobile && showHistory);
    }
  }, [isMobile, showHistory, isClient]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleSendMessageAsync = async (content: string) => {
    if (sendMessageAsync) {
      await sendMessageAsync(content);
    }
  };

  const handleTyping = (typing: boolean) => {
    setTyping(typing);
  };

  if (!isClient) {
    return (
      <Flex h="full" w="full" align="center" justify="center">
        <Text>Loading chat...</Text>
      </Flex>
    );
  }

  return (
    <Flex h="full" w="full">
      {/* Conversation History Sidebar */}
      {showHistoryPanel && (
        <Box
          w={{ base: "300px", lg: "350px" }}
          borderRight="1px solid"
          borderColor="gray.200"
          bg="gray.50"
          flexShrink={0}
        >
          <ConversationHistory
            conversations={conversations}
            currentConversationId={currentConversation?.id}
            onSelectConversation={loadConversation}
            onDeleteConversation={deleteConversation}
            onRenameConversation={renameConversation}
            onArchiveConversation={archiveConversation}
          />
        </Box>
      )}

      {/* Main Chat Area */}
      <Flex direction="column" flex="1" h="full">
        {/* Messages Area */}
        <Box flex="1" overflowY="auto" p={4}>
          {currentConversation && currentConversation.messages.length > 0 ? (
            <VStack gap={4} align="stretch">
              <ConversationView messages={currentConversation.messages} />
              <TypingIndicator isVisible={isTyping} />
            </VStack>
          ) : (
            <Flex
              align="center"
              justify="center"
              h="full"
              direction="column"
              textAlign="center"
              color="gray.500"
            >
              <Box fontSize="lg" fontWeight="medium" mb={2}>
                {showHistoryPanel ? 'Select a conversation or start a new one' : 'Start a new conversation'}
              </Box>
              <Box fontSize="sm">
                Ask me anything about your projects, action items, or team insights!
              </Box>
            </Flex>
          )}
        </Box>

        {/* Chat Input */}
        <Box
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
          p={4}
        >
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendMessageAsync={handleSendMessageAsync}
            isLoading={isLoading}
            placeholder="Type your message..."
            onTyping={handleTyping}
            progress={progress}
            useAsyncChat={true}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
