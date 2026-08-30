'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import {
  ArrowLeft,
  Bot,
  Brain,
  Copy,
  Edit2,
  FileText,
  ListTodo,
  LogOut,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Paperclip,
  Send,
  Settings,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useChatContext } from '@/contexts/ChatContext';
import type { RAGApiResponse } from '@/types/ragApi';

const palette = {
  page: '#FAFBFD',
  surface: '#FFFFFF',
  primary: '#1D7FE3',
  primaryText: '#0B0C1C',
  secondaryText: '#3D4B68',
  mutedText: '#71809B',
  border: '#E6EAF0',
  lightBorder: '#EEF1F5',
  primarySoft: '#E7F0FC',
  danger: '#E2493A',
};

const promptChips = [
  { label: 'Risk Analysis', prompt: 'Show risk analysis', icon: Sparkles },
  { label: 'Pending Actions', prompt: 'Show pending actions', icon: ListTodo },
  { label: 'Portfolio Health', prompt: 'How is my portfolio?', icon: FileText },
  { label: 'Attrition Trend', prompt: 'Show attrition trend for the last 6 months', icon: MessageSquare },
] as const;

function getTextPreview(content?: string) {
  if (!content) return 'No messages yet';
  return content.length > 78 ? `${content.slice(0, 78)}...` : content;
}

function formatConversationDate(date: Date | string) {
  const dateObj = new Date(date);
  return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
}

function AssistantOrb({ compact = false }: { compact?: boolean }) {
  return (
    <Box
      position="relative"
      w={compact ? '170px' : { base: '210px', md: '310px' }}
      h={compact ? '170px' : { base: '210px', md: '310px' }}
    >
      <Box
        position="absolute"
        inset="7%"
        borderRadius="full"
        bg="radial-gradient(circle at 28% 22%, rgba(255,255,255,0.96) 0 12%, rgba(255,255,255,0) 22%), linear-gradient(145deg, rgba(255,146,208,0.88), rgba(95,210,232,0.86) 55%, rgba(29,127,227,0.62))"
        boxShadow="inset -22px -26px 42px rgba(11,12,28,0.18), inset 20px 20px 36px rgba(255,255,255,0.72), 0 32px 80px rgba(29,127,227,0.2), 0 12px 40px rgba(226,73,58,0.08)"
        border="1px solid rgba(255,255,255,0.78)"
      />
      <Box
        position="absolute"
        left="28%"
        bottom="18%"
        w="38%"
        h="12%"
        borderRadius="full"
        bg="rgba(255,255,255,0.72)"
        filter="blur(1px)"
        transform="rotate(-8deg)"
      />
      <Box
        position="absolute"
        left="19%"
        top="18%"
        w="32%"
        h="18%"
        borderRadius="full"
        bg="rgba(255,255,255,0.75)"
        filter="blur(1px)"
        transform="rotate(-22deg)"
      />
      <Box
        position="absolute"
        left="50%"
        bottom="-18%"
        transform="translateX(-50%)"
        w="72%"
        h="34%"
        borderRadius="50%"
        bg="linear-gradient(180deg, rgba(255,255,255,0.58), rgba(29,127,227,0.06))"
        filter="blur(3px)"
        opacity={0.8}
      />
      <Flex position="absolute" inset="0" align="center" justify="center" color="rgba(255,255,255,0.76)">
        <Mic size={compact ? 20 : 28} strokeWidth={1.8} />
      </Flex>
    </Box>
  );
}

function SidebarButton({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <IconButton
      aria-label={label}
      title={label}
      w="52px"
      h="52px"
      minW="52px"
      borderRadius="18px"
      bg={isActive ? 'linear-gradient(135deg, rgba(255,239,216,0.95), rgba(231,240,252,0.96))' : 'transparent'}
      color={isActive ? palette.primaryText : palette.secondaryText}
      border={isActive ? '1px solid rgba(255,255,255,0.9)' : '1px solid transparent'}
      boxShadow={isActive ? '0 12px 28px rgba(29, 127, 227, 0.12)' : 'none'}
      _hover={{ bg: palette.primarySoft, color: palette.primary }}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  );
}

function DataValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <Text color={palette.mutedText}>-</Text>;
  if (typeof value === 'object') {
    return (
      <Text color={palette.secondaryText} whiteSpace="pre-wrap">
        {JSON.stringify(value)}
      </Text>
    );
  }

  return (
    <Text color={palette.secondaryText} whiteSpace="pre-wrap">
      {String(value)}
    </Text>
  );
}

function StructuredResponse({ response }: { response: RAGApiResponse }) {
  const dataSets = response.dataset ? Object.entries(response.dataset as Record<string, any>) : [];
  const insights = response.insights as any;

  if (dataSets.length === 0 && !insights) return null;

  return (
    <VStack align="stretch" gap={4} mt={4}>
      {insights?.summary && (
        <Box bg={palette.primarySoft} border="1px solid" borderColor="#D5E5FA" borderRadius="16px" p={4}>
          <Text fontSize="13px" fontWeight="800" color={palette.primaryText} mb={2}>
            Summary
          </Text>
          <Text fontSize="13px" lineHeight="1.65" color={palette.secondaryText}>
            {insights.summary}
          </Text>
        </Box>
      )}

      {Array.isArray(insights?.key_findings) && insights.key_findings.length > 0 && (
        <Box bg={palette.surface} border="1px solid" borderColor={palette.border} borderRadius="16px" p={4}>
          <Text fontSize="13px" fontWeight="800" color={palette.primaryText} mb={3}>
            Key Findings
          </Text>
          <VStack align="stretch" gap={2}>
            {insights.key_findings.map((finding: any, index: number) => (
              <HStack key={`${finding.reason ?? finding.title ?? index}`} align="start" gap={3}>
                <Flex
                  w="24px"
                  h="24px"
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={palette.primarySoft}
                  color={palette.primary}
                  flexShrink={0}
                >
                  <Text fontSize="11px" fontWeight="800">
                    {index + 1}
                  </Text>
                </Flex>
                <Box flex="1">
                  <Text fontSize="13px" fontWeight="800" color={palette.primaryText}>
                    {finding.reason ?? finding.title ?? 'Finding'}
                  </Text>
                  <Text fontSize="12px" color={palette.mutedText}>
                    {finding.percentage ? `${finding.percentage}%` : finding.trend ?? finding.description ?? ''}
                  </Text>
                </Box>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      {dataSets.map(([key, dataSet]) => {
        const rows = Array.isArray(dataSet?.data) ? dataSet.data : [];
        const columns = Array.isArray(dataSet?.columns)
          ? dataSet.columns
          : rows[0]
            ? Object.keys(rows[0])
            : [];

        return (
          <Box key={key} bg={palette.surface} border="1px solid" borderColor={palette.border} borderRadius="18px" overflow="hidden">
            <Box px={4} py={3} bg="rgba(250, 251, 253, 0.84)" borderBottom="1px solid" borderColor={palette.lightBorder}>
              <Text fontSize="13px" fontWeight="800" color={palette.primaryText}>
                {dataSet?.description ?? key}
              </Text>
            </Box>
            {rows.length > 0 ? (
              <Box overflowX="auto">
                <Grid
                  minW="620px"
                  templateColumns={`repeat(${Math.max(columns.length, 1)}, minmax(120px, 1fr))`}
                  bg={palette.surface}
                >
                  {columns.map((column: string) => (
                    <Box key={column} px={4} py={3} borderBottom="1px solid" borderColor={palette.lightBorder}>
                      <Text fontSize="11px" fontWeight="800" color={palette.mutedText} textTransform="uppercase">
                        {column.replaceAll('_', ' ')}
                      </Text>
                    </Box>
                  ))}
                  {rows.slice(0, 8).flatMap((row: any, rowIndex: number) =>
                    columns.map((column: string) => (
                      <Box
                        key={`${rowIndex}-${column}`}
                        px={4}
                        py={3}
                        borderBottom="1px solid"
                        borderColor={palette.lightBorder}
                        fontSize="12px"
                        fontWeight="600"
                      >
                          <DataValue value={row[column]} />
                      </Box>
                    )),
                  )}
                </Grid>
              </Box>
            ) : (
              <Box p={4}>
                <Text fontSize="13px" color={palette.mutedText}>
                  No rows returned for this response.
                </Text>
              </Box>
            )}
          </Box>
        );
      })}
    </VStack>
  );
}

export default function ChatPage() {
  const [inputMessage, setInputMessage] = React.useState('');
  const [isEmbedded, setIsEmbedded] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    const embedParam = urlParams.get('embed');
    const inIframe = window.self !== window.top;
    return embedParam === 'true' || inIframe;
  });
  const [hasStartedChat, setHasStartedChat] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const {
    sendMessageAsync,
    isLoading,
    currentConversation,
    clearHistory,
    startNewConversation,
    conversations,
    loadConversation,
    deleteConversation,
  } = useChatContext();

  const currentMessages = currentConversation?.messages ?? [];
  const showWelcome = currentMessages.length === 0 || (!hasStartedChat && isEmbedded);

  const activeConversationTitle = useMemo(() => {
    const firstUserMessage = currentConversation?.messages.find((message) => message.type === 'user');
    return getTextPreview(currentConversation?.title ?? firstUserMessage?.content ?? 'New Conversation');
  }, [currentConversation]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const embedParam = urlParams.get('embed');
    const inIframe = window.self !== window.top;
    const embedded = embedParam === 'true' || inIframe;
    setIsEmbedded(embedded);

    if (embedded) {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  const handleSendMessage = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage ?? inputMessage.trim();
    if (!messageToSend || isLoading) return;

    setHasStartedChat(true);
    try {
      await sendMessageAsync(messageToSend);
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toaster.error({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        duration: 3000,
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    startNewConversation();
    setHasStartedChat(false);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    clearHistory();
    startNewConversation();
    setHasStartedChat(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toaster.success({
      title: 'Copied!',
      description: 'Message copied to clipboard',
      duration: 2000,
    });
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      bg={isEmbedded ? palette.surface : palette.page}
      display="flex"
      m={0}
      p={0}
      position={isEmbedded ? 'fixed' : 'relative'}
      inset={isEmbedded ? 0 : undefined}
      overflow="hidden"
      fontFamily="Arial, Helvetica, sans-serif"
    >
      {!isEmbedded && (
        <Flex
          as="aside"
          w={{ base: '72px', md: '96px' }}
          h="calc(100vh - 32px)"
          m={{ base: 2, md: 4 }}
          mr={0}
          px={{ base: 2, md: 3 }}
          py={4}
          direction="column"
          align="center"
          justify="space-between"
          bg="rgba(255,255,255,0.88)"
          border="1px solid rgba(230,234,240,0.9)"
          borderRadius="24px"
          boxShadow="0 20px 70px rgba(11, 12, 28, 0.07)"
          zIndex={2}
        >
          <VStack gap={8}>
            <Flex
              w="54px"
              h="54px"
              align="center"
              justify="center"
              borderRadius="18px"
              bg="linear-gradient(135deg, #FFFFFF 0%, #E7F0FC 100%)"
              border="1px solid"
              borderColor={palette.border}
              boxShadow="0 12px 28px rgba(29, 127, 227, 0.1)"
            >
              <Bot size={25} color={palette.primary} />
            </Flex>

            <VStack gap={3}>
              <SidebarButton label="Assistant" icon={<Sparkles size={20} />} isActive />
              <SidebarButton label="Conversations" icon={<MessageSquare size={20} />} />
              <SidebarButton label="Settings" icon={<Settings size={20} />} />
            </VStack>
          </VStack>

          <SidebarButton label="Back" icon={<LogOut size={19} />} onClick={() => router.push('/')} />
        </Flex>
      )}

      <Box flex="1" p={isEmbedded ? 0 : { base: 2, md: 4 }} minW={0}>
        <Flex
          h="100%"
          borderRadius={isEmbedded ? 0 : '28px'}
          overflow="hidden"
          position="relative"
          bg="linear-gradient(135deg, rgba(255,247,238,0.88) 0%, rgba(255,255,255,0.9) 43%, rgba(231,240,252,0.95) 100%)"
          border={isEmbedded ? 'none' : '1px solid rgba(230,234,240,0.95)'}
          boxShadow={isEmbedded ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 24px 70px rgba(11, 12, 28, 0.075)'}
        >
          <Box
            position="absolute"
            inset={0}
            opacity={0.32}
            bgImage="linear-gradient(rgba(113,128,155,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(113,128,155,0.09) 1px, transparent 1px)"
            bgSize="32px 32px"
            maskImage="radial-gradient(circle at 50% 42%, black 0%, transparent 46%)"
            pointerEvents="none"
          />

          {!isEmbedded && (
            <Box
              w={{ base: '0', lg: '300px' }}
              display={{ base: 'none', lg: 'flex' }}
              flexDirection="column"
              bg="rgba(255,255,255,0.68)"
              borderRight="1px solid rgba(230,234,240,0.76)"
              backdropFilter="blur(20px)"
              zIndex={1}
            >
              <HStack justify="space-between" px={5} py={5} borderBottom="1px solid" borderColor="rgba(230,234,240,0.76)">
                <Box>
                  <Text fontSize="15px" fontWeight="800" color={palette.primaryText}>
                    Chat History
                  </Text>
                  <Text fontSize="12px" fontWeight="700" color={palette.mutedText}>
                    {String(conversations.length).padStart(2, '0')} conversations
                  </Text>
                </Box>
                <HStack gap={1}>
                  <IconButton aria-label="New chat" size="sm" variant="ghost" onClick={handleNewChat} color={palette.secondaryText}>
                    <Edit2 size={16} />
                  </IconButton>
                  <IconButton aria-label="Clear history" size="sm" variant="ghost" onClick={handleClearChat} color={palette.secondaryText}>
                    <Trash2 size={16} />
                  </IconButton>
                </HStack>
              </HStack>

              <Box
                flex="1"
                overflowY="auto"
                px={3}
                py={3}
                css={{
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': { background: '#D8DEE9', borderRadius: '999px' },
                }}
              >
                {conversations.length === 0 ? (
                  <Text fontSize="13px" color={palette.mutedText} textAlign="center" mt={8}>
                    Start a new conversation below.
                  </Text>
                ) : (
                  <VStack align="stretch" gap={2}>
                    {conversations.map((conversation) => {
                      const firstUserMessage = conversation.messages.find((message) => message.type === 'user');
                      const lastAssistantMessage = [...conversation.messages].reverse().find((message) => message.type === 'assistant');
                      const title = conversation.title || firstUserMessage?.content || 'New Conversation';
                      const description = lastAssistantMessage?.content || firstUserMessage?.content || 'No messages yet';
                      const isActive = currentConversation?.id === conversation.id;

                      return (
                        <Box
                          key={conversation.id}
                          p={3}
                          borderRadius="16px"
                          cursor="pointer"
                          bg={isActive ? 'rgba(231,240,252,0.96)' : 'transparent'}
                          border="1px solid"
                          borderColor={isActive ? '#D5E5FA' : 'transparent'}
                          transition="all 0.15s ease"
                          _hover={{ bg: isActive ? 'rgba(231,240,252,0.96)' : 'rgba(255,255,255,0.72)', borderColor: palette.border }}
                          onClick={() => {
                            loadConversation(conversation.id);
                            setHasStartedChat(true);
                          }}
                          role="group"
                        >
                          <HStack justify="space-between" align="start" gap={2} mb={1}>
                            <Text fontSize="13px" fontWeight="800" color={palette.primaryText} lineClamp={1} flex="1">
                              {getTextPreview(title)}
                            </Text>
                            <Text fontSize="11px" fontWeight="700" color={palette.mutedText} flexShrink={0}>
                              {formatConversationDate(conversation.created_at)}
                            </Text>
                          </HStack>
                          <HStack justify="space-between" gap={2}>
                            <Text fontSize="12px" fontWeight="600" color={palette.secondaryText} lineClamp={2} flex="1">
                              {getTextPreview(description)}
                            </Text>
                            <IconButton
                              aria-label="Delete conversation"
                              size="xs"
                              variant="ghost"
                              color={palette.mutedText}
                              opacity={0}
                              _groupHover={{ opacity: 1 }}
                              _hover={{ color: palette.danger, bg: '#FDEDEA' }}
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteConversation(conversation.id);
                              }}
                            >
                              <Trash2 size={12} />
                            </IconButton>
                          </HStack>
                        </Box>
                      );
                    })}
                  </VStack>
                )}
              </Box>
            </Box>
          )}

          <Flex flex="1" direction="column" minW={0} position="relative" zIndex={1}>
            {!isEmbedded && (
              <HStack justify="space-between" align="center" px={{ base: 4, md: 7 }} py={5}>
                <HStack gap={3} minW={0}>
                  <IconButton
                    aria-label="Go back"
                    variant="ghost"
                    display={{ base: 'flex', md: 'none' }}
                    onClick={() => router.push('/')}
                  >
                    <ArrowLeft size={19} />
                  </IconButton>
                  <Box minW={0}>
                    <Text fontSize="13px" fontWeight="800" color={palette.mutedText}>
                      Clyra AI
                    </Text>
                    <Text fontSize={{ base: '16px', md: '18px' }} fontWeight="800" color={palette.primaryText} lineClamp={1}>
                      {activeConversationTitle}
                    </Text>
                  </Box>
                </HStack>
                <HStack gap={2}>
                  <Button
                    borderRadius="999px"
                    bg="rgba(255,255,255,0.82)"
                    border="1px solid"
                    borderColor={palette.border}
                    color={palette.primaryText}
                    fontSize="13px"
                    fontWeight="800"
                    px={4}
                    h="44px"
                    boxShadow="0 14px 32px rgba(11, 12, 28, 0.05)"
                    _hover={{ bg: palette.surface, borderColor: '#D5E5FA' }}
                    onClick={handleNewChat}
                  >
                    <Edit2 size={16} />
                    New Chat
                  </Button>
                  <IconButton aria-label="Close chat" variant="ghost" color={palette.secondaryText} onClick={() => router.push('/')}>
                    <X size={18} />
                  </IconButton>
                </HStack>
              </HStack>
            )}

            <Box
              flex="1"
              overflowY="auto"
              px={isEmbedded ? 4 : { base: 4, md: 8 }}
              py={isEmbedded ? 6 : 2}
              css={{
                '&::-webkit-scrollbar': { width: '7px' },
                '&::-webkit-scrollbar-thumb': { background: '#D8DEE9', borderRadius: '999px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
              }}
            >
              {showWelcome ? (
                <Flex
                  minH={isEmbedded ? 'calc(100vh - 150px)' : 'calc(100vh - 268px)'}
                  align="center"
                  justify="center"
                  direction="column"
                  textAlign="center"
                  px={{ base: 2, md: 6 }}
                  pt={{ base: 6, md: 0 }}
                >
                  <Text
                    maxW="760px"
                    fontSize={{ base: '30px', md: '46px' }}
                    lineHeight="1.08"
                    fontWeight="800"
                    color={palette.primaryText}
                    letterSpacing="0"
                    mb={{ base: 7, md: 10 }}
                  >
                    <Text as="span" color="rgba(11, 12, 28, 0.16)">
                      AI Powers
                    </Text>{' '}
                    Clyra Insights And Voice Access
                  </Text>

                  <AssistantOrb compact={isEmbedded} />

                  <HStack gap={2} mt={{ base: 10, md: 14 }} mb={5} flexWrap="wrap" justify="center" maxW="780px">
                    {promptChips.map((chip) => {
                      const Icon = chip.icon;
                      return (
                        <Button
                          key={chip.prompt}
                          h="36px"
                          borderRadius="999px"
                          bg="rgba(255,255,255,0.82)"
                          border="1px solid"
                          borderColor={palette.border}
                          color={palette.secondaryText}
                          fontSize="13px"
                          fontWeight="700"
                          px={4}
                          _hover={{ bg: palette.surface, color: palette.primary, borderColor: '#D5E5FA' }}
                          onClick={() => handleSendMessage(chip.prompt)}
                        >
                          <Icon size={15} />
                          {chip.label}
                        </Button>
                      );
                    })}
                    <IconButton
                      aria-label="More suggestions"
                      h="36px"
                      w="36px"
                      borderRadius="full"
                      bg="rgba(255,255,255,0.82)"
                      border="1px solid"
                      borderColor={palette.border}
                      color={palette.secondaryText}
                      _hover={{ bg: palette.surface, color: palette.primary }}
                    >
                      <MoreHorizontal size={16} />
                    </IconButton>
                  </HStack>
                </Flex>
              ) : (
                <VStack gap={5} align="stretch" maxW="980px" mx="auto" pb={8}>
                  {currentMessages.map((message) => (
                    <Flex key={message.id} justify={message.type === 'user' ? 'flex-end' : 'flex-start'} align="flex-start" gap={3}>
                      {message.type === 'assistant' && (
                        <Flex
                          w="36px"
                          h="36px"
                          borderRadius="14px"
                          bg="linear-gradient(135deg, #E7F0FC, #FFFFFF)"
                          border="1px solid"
                          borderColor={palette.border}
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Bot size={17} color={palette.primary} />
                        </Flex>
                      )}

                      <Box
                        maxW={{ base: '86%', md: message.type === 'assistant' ? '78%' : '66%' }}
                        bg={message.type === 'user' ? palette.primary : 'rgba(255,255,255,0.9)'}
                        color={message.type === 'user' ? 'white' : palette.primaryText}
                        px={4}
                        py={3}
                        borderRadius={message.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px'}
                        border="1px solid"
                        borderColor={message.type === 'user' ? 'rgba(29,127,227,0.1)' : palette.border}
                        boxShadow={message.type === 'user' ? '0 14px 32px rgba(29,127,227,0.2)' : '0 14px 34px rgba(11,12,28,0.055)'}
                        position="relative"
                        _hover={{ '& .message-actions': { opacity: 1 } }}
                      >
                        <Text fontSize="13px" lineHeight="1.65" whiteSpace="pre-wrap" fontWeight="600">
                          {message.content}
                        </Text>

                        {message.response && message.type === 'assistant' && <StructuredResponse response={message.response} />}

                        <HStack
                          className="message-actions"
                          position="absolute"
                          top="-12px"
                          right={message.type === 'user' ? '8px' : '-8px'}
                          bg={palette.surface}
                          borderRadius="full"
                          border="1px solid"
                          borderColor={palette.border}
                          boxShadow="0 10px 24px rgba(11,12,28,0.12)"
                          p={1}
                          opacity={0}
                          transition="opacity 0.2s"
                        >
                          <IconButton aria-label="Copy message" size="xs" variant="ghost" onClick={() => copyMessage(message.content)}>
                            <Copy size={12} />
                          </IconButton>
                        </HStack>

                        <Text
                          fontSize="11px"
                          color={message.type === 'user' ? 'rgba(255,255,255,0.72)' : palette.mutedText}
                          mt={2}
                          fontWeight="700"
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </Box>

                      {message.type === 'user' && (
                        <Flex
                          w="36px"
                          h="36px"
                          borderRadius="14px"
                          bg="rgba(255,255,255,0.86)"
                          border="1px solid"
                          borderColor={palette.border}
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <User size={17} color={palette.secondaryText} />
                        </Flex>
                      )}
                    </Flex>
                  ))}

                  {isLoading && (
                    <Flex justify="flex-start" align="flex-start" gap={3}>
                      <Flex
                        w="36px"
                        h="36px"
                        borderRadius="14px"
                        bg="linear-gradient(135deg, #E7F0FC, #FFFFFF)"
                        border="1px solid"
                        borderColor={palette.border}
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Bot size={17} color={palette.primary} />
                      </Flex>
                      <Box bg="rgba(255,255,255,0.92)" px={4} py={3} borderRadius="20px" border="1px solid" borderColor={palette.border}>
                        <HStack gap={2}>
                          <Spinner size="sm" color={palette.primary} />
                          <Text fontSize="13px" color={palette.secondaryText} fontWeight="700">
                            Clyra is thinking...
                          </Text>
                        </HStack>
                      </Box>
                    </Flex>
                  )}
                  <div ref={messagesEndRef} />
                </VStack>
              )}
            </Box>

            <Box px={isEmbedded ? 4 : { base: 4, md: 8 }} pb={isEmbedded ? 4 : 7} pt={2}>
              <Box
                maxW={showWelcome ? '680px' : '980px'}
                mx="auto"
                bg="linear-gradient(135deg, rgba(255,248,216,0.85), rgba(255,255,255,0.92) 35%, rgba(213,229,250,0.96))"
                border="1px solid rgba(230,234,240,0.95)"
                borderRadius="24px"
                p="8px"
                boxShadow="0 20px 54px rgba(29, 127, 227, 0.13), 0 12px 36px rgba(253,184,63,0.08)"
              >
                <Box bg="rgba(255,255,255,0.94)" borderRadius="19px" border="1px solid rgba(255,255,255,0.85)" p={3}>
                  <Textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(event) => setInputMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isEmbedded ? 'Type message' : 'Ask me anything...'}
                    bg="transparent"
                    border="none"
                    resize="none"
                    minH={isEmbedded ? '44px' : '58px'}
                    maxH="132px"
                    px={1}
                    py={1}
                    color={palette.primaryText}
                    fontSize="14px"
                    fontWeight="600"
                    _focus={{ boxShadow: 'none', outline: 'none' }}
                    _placeholder={{ color: palette.mutedText }}
                  />

                  <HStack justify="space-between" gap={3} mt={2} flexWrap="wrap">
                    <HStack gap={2}>
                      <Button
                        h="34px"
                        px={3}
                        borderRadius="999px"
                        bg="rgba(250,251,253,0.92)"
                        border="1px solid"
                        borderColor={palette.border}
                        color={palette.secondaryText}
                        fontSize="12px"
                        fontWeight="800"
                        disabled
                        title="Attachment upload is visual only for now"
                      >
                        <Paperclip size={14} />
                        Attach
                      </Button>
                      <Button
                        h="34px"
                        px={3}
                        borderRadius="999px"
                        bg="rgba(250,251,253,0.92)"
                        border="1px solid"
                        borderColor={palette.border}
                        color={palette.secondaryText}
                        fontSize="12px"
                        fontWeight="800"
                        disabled
                        title="Deep Think is visual only for now"
                      >
                        <Brain size={14} />
                        Deep Think
                      </Button>
                    </HStack>

                    <HStack gap={2}>
                      <Button
                        h="34px"
                        px={3}
                        borderRadius="999px"
                        bg="rgba(250,251,253,0.92)"
                        border="1px solid"
                        borderColor={palette.border}
                        color={palette.secondaryText}
                        fontSize="12px"
                        fontWeight="800"
                        disabled
                        title="Voice input is visual only for now"
                      >
                        <Mic size={14} />
                        Voice
                      </Button>
                      <Button
                        h="34px"
                        px={4}
                        borderRadius="999px"
                        bg={inputMessage.trim() ? palette.primary : '#E6EAF0'}
                        color={inputMessage.trim() ? 'white' : palette.mutedText}
                        fontSize="12px"
                        fontWeight="800"
                        _hover={{ bg: inputMessage.trim() ? '#176FC7' : '#E6EAF0' }}
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                      >
                        {isLoading ? <Spinner size="xs" /> : <Send size={14} />}
                        Send
                      </Button>
                    </HStack>
                  </HStack>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
