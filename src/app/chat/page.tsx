'use client';

import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Flex,
  IconButton,
  Textarea,
  Spinner,
  Grid
} from '@chakra-ui/react';
import { Send, Bot, User, ArrowLeft, Trash2, Copy, X, Sparkles, MessageSquare, FileText, ArrowRight, AlertTriangle, ListTodo, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatContext } from '@/contexts/ChatContext';
import { toaster } from '@/components/ui/toaster';

export default function ChatPage() {
  const [inputMessage, setInputMessage] = React.useState('');
  const [selectedAssociate, setSelectedAssociate] = React.useState<any>(null);
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
  
  const { sendMessageAsync, isLoading, currentConversation, clearHistory, startNewConversation, conversations, loadConversation, deleteConversation } = useChatContext();

  // Detect if running in embedded mode (iframe)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const embedParam = urlParams.get('embed');
    const inIframe = window.self !== window.top;
    const embedded = embedParam === 'true' || inIframe;
    setIsEmbedded(embedded);
    
    // Remove body margins when embedded
    if (embedded) {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

  };

  const clearChat = () => {
    clearHistory();
    startNewConversation();
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
      bg={isEmbedded ? "white" : "gray.50"} 
      display="flex" 
      flexDirection="column" 
      m={0} 
      p={0}
      position={isEmbedded ? "fixed" : "relative"}
      top={isEmbedded ? 0 : undefined}
      left={isEmbedded ? 0 : undefined}
      right={isEmbedded ? 0 : undefined}
      bottom={isEmbedded ? 0 : undefined}
    >
      {/* Header */}
      {!isEmbedded && (
      <Box
        bg="linear-gradient(135deg, #0077b6 0%, #3b82f6 50%, #8b5cf6 100%)"
        color="white"
        px={6}
        py={4}
        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      >
        <HStack justify="space-between" align="center">
          <HStack gap={4}>
            <IconButton
              aria-label="Go back"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => router.push('/')}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <HStack gap={3}>
              <Box
                w="40px"
                h="40px"
                borderRadius="full"
                bg="linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 12px rgba(0,0,0,0.2)"
              >
                <Bot size={20} color="white" />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="lg" fontWeight="bold">
                  Clyra AI
                </Text>
                <Text fontSize="sm" opacity={0.8}>
                  Your Intelligent Assistant
                </Text>
              </VStack>
            </HStack>
          </HStack>
          
          <HStack gap={2}>
            <IconButton
              aria-label="Clear chat"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={clearChat}
            >
              <Trash2 size={18} />
            </IconButton>
            <IconButton
              aria-label="Close chat"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => router.push('/')}
            >
              <X size={18} />
            </IconButton>
          </HStack>
        </HStack>
      </Box>
      )}

      <Flex flex="1" overflow="hidden">
        {/* Chat History Sidebar (main app only) */}
        {!isEmbedded && (
          <Box
            w="320px"
            flexShrink={0}
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <HStack justify="space-between" align="center" px={5} py={4} borderBottom="1px solid" borderColor="gray.100">
              <Text fontSize="lg" fontWeight="700" color="gray.900">
                Chat History <Text as="span" color="gray.500" fontWeight="500">({String(conversations.length).padStart(2, '0')})</Text>
              </Text>
              <HStack gap={1}>
                <IconButton
                  aria-label="New chat"
                  size="sm"
                  variant="ghost"
                  color="gray.600"
                  _hover={{ bg: "purple.50", color: "purple.600" }}
                  onClick={() => { startNewConversation(); setHasStartedChat(false); }}
                  title="New chat"
                >
                  <Edit2 size={16} />
                </IconButton>
                <IconButton
                  aria-label="Clear history"
                  size="sm"
                  variant="ghost"
                  color="gray.600"
                  _hover={{ bg: "red.50", color: "red.600" }}
                  onClick={clearChat}
                  title="Clear all history"
                >
                  <Trash2 size={16} />
                </IconButton>
              </HStack>
            </HStack>

            <Box flex="1" overflowY="auto" px={3} py={3} css={{
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: '3px' },
            }}>
              {conversations.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={6}>
                  No conversations yet. Start a new chat below.
                </Text>
              ) : (
                <VStack align="stretch" gap={1}>
                  {conversations.map((conv) => {
                    const firstUserMsg = conv.messages.find(m => m.type === 'user');
                    const lastAssistant = [...conv.messages].reverse().find(m => m.type === 'assistant');
                    const title = conv.title || firstUserMsg?.content?.slice(0, 40) || 'New Conversation';
                    const description = lastAssistant?.content?.slice(0, 70) || firstUserMsg?.content?.slice(0, 70) || 'No messages yet';
                    const dateObj = new Date(conv.created_at);
                    const dateLabel = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                    const isActive = currentConversation?.id === conv.id;
                    return (
                      <Box
                        key={conv.id}
                        px={3}
                        py={3}
                        borderRadius="lg"
                        cursor="pointer"
                        bg={isActive ? "purple.50" : "transparent"}
                        borderLeft={isActive ? "3px solid #a855f7" : "3px solid transparent"}
                        transition="all 0.15s"
                        _hover={{ bg: isActive ? "purple.50" : "gray.50" }}
                        onClick={() => { loadConversation(conv.id); setHasStartedChat(true); }}
                        role="group"
                      >
                        <HStack justify="space-between" align="start" mb={1} gap={2}>
                          <Text fontSize="sm" fontWeight="600" color="gray.900" lineClamp={1} flex="1">
                            {title}
                          </Text>
                          <Text fontSize="xs" color="gray.500" flexShrink={0}>{dateLabel}</Text>
                        </HStack>
                        <HStack justify="space-between" align="center" gap={2}>
                          <Text fontSize="xs" color="gray.600" lineClamp={2} flex="1">
                            {description}
                          </Text>
                          <IconButton
                            aria-label="Delete conversation"
                            size="xs"
                            variant="ghost"
                            color="gray.400"
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            _hover={{ color: "red.500", bg: "red.50" }}
                            onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
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

      {/* Messages Container */}
      <Box
        flex="1"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box
          flex="1"
          overflowY="auto"
          px={isEmbedded ? 0 : 4}
          py={isEmbedded ? 0 : 6}
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          }}
        >
          <VStack gap={6} align="stretch" maxW={isEmbedded ? "78%" : "4xl"} mx="auto" px={isEmbedded ? 4 : 0} pt={isEmbedded ? "96px" : 0} pb={isEmbedded ? 4 : 0}>
            {isEmbedded && !hasStartedChat && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                minH="calc(100vh - 240px)"
                px={8}
                py={8}
              >
                {/* Logo */}
                <Box
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="linear-gradient(135deg, #d8b4fe 0%, #a855f7 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={5}
                  boxShadow="0 8px 24px rgba(168, 85, 247, 0.25)"
                >
                  <Bot size={36} color="white" />
                </Box>

                {/* Title */}
                
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  color="#7c3aed"
                  mb={3}
                  textAlign="center"
                >
                  Effortless Support, Anytime
                </Text>

                {/* Subtitle */}
                <Text
                  fontSize="md"
                  color="gray.600"
                  mb={12}
                  textAlign="center"
                  maxW="600px"
                >
                  Providing Seamless Assistance, Every Step of the Way
                </Text>

                {/* Action Cards */}
                <VStack gap={4} w="100%" maxW="500px">
                  <Box
                    w="100%"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    px={5}
                    py={4}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "#a855f7",
                      boxShadow: "0 4px 12px rgba(168, 85, 247, 0.1)",
                      transform: "translateY(-1px)"
                    }}
                    onClick={() => handleSendMessage("Show risk analysis")}
                  >
                    <HStack justify="space-between">
                      <HStack gap={4}>
                        <Box
                          w="40px"
                          h="40px"
                          borderRadius="lg"
                          bg="red.50"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <AlertTriangle size={20} color="#ef4444" />
                        </Box>
                        <Text fontSize="md" fontWeight="600" color="gray.800">
                          Risk Analysis
                        </Text>
                      </HStack>
                      <ArrowRight size={18} color="#9ca3af" />
                    </HStack>
                  </Box>

                  <Box
                    w="100%"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    px={5}
                    py={4}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "#a855f7",
                      boxShadow: "0 4px 12px rgba(168, 85, 247, 0.1)",
                      transform: "translateY(-1px)"
                    }}
                    onClick={() => handleSendMessage("Show pending actions")}
                  >
                    <HStack justify="space-between">
                      <HStack gap={4}>
                        <Box
                          w="40px"
                          h="40px"
                          borderRadius="lg"
                          bg="blue.50"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <ListTodo size={20} color="#3b82f6" />
                        </Box>
                        <Text fontSize="md" fontWeight="600" color="gray.800">
                          Pending Actions
                        </Text>
                      </HStack>
                      <ArrowRight size={18} color="#9ca3af" />
                    </HStack>
                  </Box>
                </VStack>
              </Flex>
            )}
            {!isEmbedded && (!currentConversation || currentConversation.messages.length === 0) && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                minH="calc(100vh - 280px)"
                px={8}
                py={8}
              >
                <Box
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={6}
                  boxShadow="0 8px 24px rgba(139, 92, 246, 0.25)"
                >
                  <Bot size={36} color="white" />
                </Box>
                <Text fontSize="3xl" fontWeight="700" color="gray.900" mb={3} textAlign="center">
                  Good to see you.
                </Text>
                <Text fontSize="md" color="gray.600" textAlign="center" maxW="620px" lineHeight="1.7">
                  Hello! I&apos;m <Text as="span" fontWeight="700" color="#7c3aed">Clyra AI</Text>, your intelligent assistant. I can help you with project insights, team analytics, action items, and much more. What would you like to know?
                </Text>
              </Flex>
            )}
            {(!isEmbedded || hasStartedChat) && currentConversation?.messages.map((message) => (
              <Flex
                key={message.id}
                justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
                align="flex-start"
                gap={3}
              >
                {message.type === 'assistant' && (
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg="linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <Bot size={16} color="white" />
                  </Box>
                )}
                
                <Box
                  maxW={isEmbedded ? "95%" : "70%"}
                  bg={message.type === 'user' ? 
                    'linear-gradient(135deg, #0077b6 0%, #3b82f6 100%)' : 
                    'white'
                  }
                  color={message.type === 'user' ? 'white' : 'gray.800'}
                  px={4}
                  py={3}
                  borderRadius="2xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                  position="relative"
                  _hover={{
                    '& .message-actions': {
                      opacity: 1
                    }
                  }}
                >
                  <Text fontSize="sm" lineHeight="1.5" whiteSpace="pre-wrap">
                    {message.content}
                  </Text>
                  
                  {/* Render structured response if available */}
                  {message.response && message.response.dataset && (
                    <Box mt={4}>
                      {Object.entries(message.response.dataset).map(([key, dataSet]: [string, any]) => (
                        <Box key={key} bg="white" borderRadius="xl" border="1px" borderColor="gray.200" shadow="sm" overflow="hidden">
                          {/* Header */}
                          <Box bg="linear-gradient(135deg, #0077b6 0%, #3b82f6 100%)" p={4}>
                            <Text fontWeight="bold" fontSize="md" color="white">{dataSet.description}</Text>
                          </Box>
                          
                          {/* Attrition Trend Graph */}
                          {dataSet.data && dataSet.data.some((row: any) => row.attrition_rate) && (
                            <Box p={5}>
                              <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={4}>
                                Attrition Rate Over Time
                              </Text>
                              <Box bg="gray.50" p={4} borderRadius="lg" mb={5}>
                                <Box h="200px" position="relative">
                                  <svg width="100%" height="100%" viewBox="0 0 600 200">
                                    <defs>
                                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                      </linearGradient>
                                    </defs>
                                    
                                    {/* Grid lines */}
                                    {[0, 25, 50, 75, 100].map((pct, idx) => (
                                      <line
                                        key={idx}
                                        x1="50"
                                        y1={30 + (pct / 100) * 140}
                                        x2="570"
                                        y2={30 + (pct / 100) * 140}
                                        stroke="#e5e7eb"
                                        strokeWidth="1"
                                      />
                                    ))}
                                    
                                    {/* Line */}
                                    <polyline
                                      fill="none"
                                      stroke="url(#lineGradient)"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      points={dataSet.data.map((row: any, idx: number) => {
                                        const rateValue = parseFloat(row.attrition_rate);
                                        const maxRate = Math.max(...dataSet.data.map((r: any) => parseFloat(r.attrition_rate)));
                                        const x = 70 + (idx / (dataSet.data.length - 1)) * 480;
                                        const y = 170 - ((rateValue / maxRate) * 140);
                                        return `${x},${y}`;
                                      }).join(' ')}
                                    />
                                    
                                    {/* Data points and labels */}
                                    {dataSet.data.map((row: any, idx: number) => {
                                      const rateValue = parseFloat(row.attrition_rate);
                                      const maxRate = Math.max(...dataSet.data.map((r: any) => parseFloat(r.attrition_rate)));
                                      const x = 70 + (idx / (dataSet.data.length - 1)) * 480;
                                      const y = 170 - ((rateValue / maxRate) * 140);
                                      return (
                                        <g key={idx}>
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="6"
                                            fill="#ef4444"
                                            stroke="white"
                                            strokeWidth="3"
                                          />
                                          <text
                                            x={x}
                                            y={y - 15}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fontWeight="bold"
                                            fill="#374151"
                                          >
                                            {row.attrition_rate}
                                          </text>
                                          <text
                                            x={x}
                                            y={190}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fill="#6b7280"
                                          >
                                            {row.month.split(' ')[0]}
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </svg>
                                </Box>
                              </Box>
                              
                              {/* Top Reasons */}
                              {message.response?.insights && (message.response.insights as any).key_findings && (
                                <Box>
                                  <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={3}>
                                    Top Reasons for Attrition
                                  </Text>
                                  <VStack align="stretch" gap={3}>
                                    {(message.response.insights as any).key_findings.map((finding: any, idx: number) => (
                                      <HStack key={idx} gap={4} align="center">
                                        <Box flex="1">
                                          <HStack justify="space-between" mb={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                              {finding.reason}
                                            </Text>
                                            <HStack gap={2}>
                                              <Text fontSize="sm" fontWeight="bold" color="orange.600">
                                                {finding.percentage}%
                                              </Text>
                                              <Box
                                                px={2}
                                                py={0.5}
                                                borderRadius="md"
                                                bg={
                                                  finding.trend === 'increasing' ? 'red.50' :
                                                  finding.trend === 'decreasing' ? 'green.50' : 'gray.50'
                                                }
                                              >
                                                <Text
                                                  fontSize="xs"
                                                  color={
                                                    finding.trend === 'increasing' ? 'red.600' :
                                                    finding.trend === 'decreasing' ? 'green.600' : 'gray.600'
                                                  }
                                                  fontWeight="medium"
                                                >
                                                  {finding.trend}
                                                </Text>
                                              </Box>
                                            </HStack>
                                          </HStack>
                                          <Box w="100%" bg="gray.200" h="2" borderRadius="full">
                                            <Box
                                              w={`${finding.percentage}%`}
                                              bg={
                                                finding.trend === 'increasing' ? 'linear-gradient(90deg, #f97316 0%, #ef4444 100%)' :
                                                finding.trend === 'decreasing' ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' : 'gray.400'
                                              }
                                              h="2"
                                              borderRadius="full"
                                            />
                                          </Box>
                                        </Box>
                                      </HStack>
                                    ))}
                                  </VStack>
                                </Box>
                              )}
                              
                              {/* Summary */}
                              {message.response?.insights && (message.response.insights as any).summary && (
                                <Box mt={5} bg="blue.50" p={4} borderRadius="lg">
                                  <HStack gap={3} mb={2}>
                                    <Box
                                      w="8"
                                      h="8"
                                      borderRadius="full"
                                      bg="blue.500"
                                      color="white"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      <Text fontSize="sm">📊</Text>
                                    </Box>
                                    <Text fontSize="sm" fontWeight="bold" color="blue.800">
                                      Summary
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm" color="blue.900" pl={11}>
                                    {(message.response.insights as any).summary}
                                  </Text>
                                </Box>
                              )}
                            </Box>
                          )}
                          
                          {/* Portfolio Health */}
                          {dataSet.data && dataSet.data.some((row: any) => row.health_status) && (
                            <Box p={5}>
                              <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={4}>
                                Project Health Status
                              </Text>
                              <VStack align="stretch" gap={3}>
                                {dataSet.data.map((row: any, idx: number) => (
                                  <Box
                                    key={idx}
                                    bg="white"
                                    p={4}
                                    borderRadius="lg"
                                    border="2px"
                                    borderColor={
                                      row.health_status === 'green' ? 'green.200' :
                                      row.health_status === 'amber' ? 'yellow.300' : 'red.300'
                                    }
                                    shadow="sm"
                                  >
                                    <HStack justify="space-between" align="start" mb={3}>
                                      <Box flex="1">
                                        <Text fontSize="md" fontWeight="bold" color="gray.900" mb={1}>
                                          {row.project_name}
                                        </Text>
                                        <HStack gap={2} flexWrap="wrap">
                                          <Text fontSize="xs" color="gray.500">Team: {row.team_size}</Text>
                                          <Text fontSize="xs" color="gray.500">•</Text>
                                          <Text fontSize="xs" color="gray.500">Budget: {row.budget_utilization}</Text>
                                          <Text fontSize="xs" color="gray.500">•</Text>
                                          <Text fontSize="xs" color="gray.500">Deadline: {row.deadline}</Text>
                                        </HStack>
                                      </Box>
                                      <Box
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        bg={
                                          row.health_status === 'green' ? 'green.100' :
                                          row.health_status === 'amber' ? 'yellow.100' : 'red.100'
                                        }
                                      >
                                        <Text
                                          fontSize="xs"
                                          fontWeight="bold"
                                          color={
                                            row.health_status === 'green' ? 'green.700' :
                                            row.health_status === 'amber' ? 'yellow.700' : 'red.700'
                                          }
                                        >
                                          {row.health_status.toUpperCase()}
                                        </Text>
                                      </Box>
                                    </HStack>
                                    
                                    {/* Progress Bar */}
                                    <Box mb={2}>
                                      <HStack justify="space-between" mb={1}>
                                        <Text fontSize="xs" color="gray.600">Progress</Text>
                                        <Text fontSize="xs" fontWeight="bold" color="gray.700">{row.completion_percentage}%</Text>
                                      </HStack>
                                      <Box w="100%" bg="gray.200" h="2" borderRadius="full">
                                        <Box
                                          w={`${row.completion_percentage}%`}
                                          bg={
                                            row.health_status === 'green' ? 'green.500' :
                                            row.health_status === 'amber' ? 'yellow.500' : 'red.500'
                                          }
                                          h="2"
                                          borderRadius="full"
                                        />
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                              </VStack>
                              
                              {/* Red Project Details */}
                              {message.response?.insights && (message.response.insights as any).red_project_details && (
                                <Box mt={5}>
                                  <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={3}>
                                    Critical Issues - Red Projects
                                  </Text>
                                  {(message.response.insights as any).red_project_details.map((project: any, pIdx: number) => (
                                    <Box key={pIdx} bg="red.50" p={4} borderRadius="lg" border="1px" borderColor="red.200">
                                      <Text fontSize="sm" fontWeight="bold" color="red.800" mb={3}>
                                        {project.project_name}
                                      </Text>
                                      
                                      <VStack align="stretch" gap={2} mb={4}>
                                        {project.reasons.map((reason: any, rIdx: number) => (
                                          <HStack key={rIdx} gap={3} align="start">
                                            <Box
                                              w="6"
                                              h="6"
                                              borderRadius="full"
                                              bg={reason.severity === 'critical' ? 'red.600' : 'orange.500'}
                                              color="white"
                                              display="flex"
                                              alignItems="center"
                                              justifyContent="center"
                                              flexShrink={0}
                                              mt="2px"
                                            >
                                              <Text fontSize="xs">!</Text>
                                            </Box>
                                            <Text fontSize="sm" color="red.900">
                                              {reason.reason}
                                            </Text>
                                          </HStack>
                                        ))}
                                      </VStack>
                                      
                                      {/* Associates at Risk */}
                                      {project.associates_at_risk && project.associates_at_risk.length > 0 && (
                                        <Box mb={4}>
                                          <Text fontSize="xs" fontWeight="bold" color="red.700" mb={3}>
                                            Associates at Risk ({project.associates_at_risk.length})
                                          </Text>
                                          <HStack gap={3} flexWrap="wrap">
                                            {project.associates_at_risk.map((associate: any, aIdx: number) => (
                                              <Box key={aIdx} bg="white" p={3} borderRadius="lg" border="1px" borderColor="red.200" minW="180px">
                                                <HStack gap={3} align="center" mb={2}>
                                                  <Box
                                                    w="10"
                                                    h="10"
                                                    borderRadius="full"
                                                    overflow="hidden"
                                                    border="2px"
                                                    borderColor="red.300"
                                                    flexShrink={0}
                                                  >
                                                    <img src={associate.photo} alt={associate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                  </Box>
                                                  <Text fontSize="sm" fontWeight="bold" color="gray.900">
                                                    {associate.name}
                                                  </Text>
                                                </HStack>
                                                <Text fontSize="xs" color="red.700">
                                                  {associate.risk_reason}
                                                </Text>
                                              </Box>
                                            ))}
                                          </HStack>
                                        </Box>
                                      )}
                                      
                                      <Box bg="white" p={3} borderRadius="md">
                                        <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>
                                          Recommended Actions:
                                        </Text>
                                        <VStack align="stretch" gap={1}>
                                          {project.recommended_actions.map((action: string, aIdx: number) => (
                                            <HStack key={aIdx} gap={2} align="start">
                                              <Text fontSize="xs" color="blue.600">•</Text>
                                              <Text fontSize="xs" color="gray.700">{action}</Text>
                                            </HStack>
                                          ))}
                                        </VStack>
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          )}
                          
                          {/* Risk Associates Grid */}
                          {dataSet.data && dataSet.data.some((row: any) => row.attrition_risk) && !selectedAssociate && (
                            <Box p={5}>
                              <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={4}>
                                Associates at Risk
                              </Text>
                              <Text fontSize="sm" color="gray.600" mb={4}>
                {(message.response?.insights as any)?.summary || 'Click on any associate to view their detailed retention plan.'}
                              </Text>
                              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                                {dataSet.data.map((row: any, idx: number) => (
                                  <Box
                                    key={idx}
                                    cursor="pointer"
                                    onClick={() => setSelectedAssociate(row)}
                                    bg="white"
                                    p={4}
                                    borderRadius="lg"
                                    border="2px"
                                    borderColor={
                                      row.attrition_risk === 'critical' ? 'red.300' :
                                      row.attrition_risk === 'high' ? 'orange.300' : 'yellow.300'
                                    }
                                    shadow="sm"
                                    _hover={{
                                      shadow: 'md',
                                      transform: 'translateY(-2px)',
                                      transition: 'all 0.2s ease'
                                    }}
                                    transition="all 0.2s ease"
                                  >
                                    <VStack align="center" gap={3}>
                                      <Box
                                        w="80px"
                                        h="80px"
                                        borderRadius="full"
                                        overflow="hidden"
                                        border="3px"
                                        borderColor={
                                          row.attrition_risk === 'critical' ? 'red.400' :
                                          row.attrition_risk === 'high' ? 'orange.400' : 'yellow.400'
                                        }
                                        shadow="md"
                                      >
                                        <img src={row.photo} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      </Box>
                                      <Text fontSize="sm" fontWeight="bold" color="gray.900" textAlign="center">
                                        {row.name}
                                      </Text>
                                      <Text fontSize="xs" color="gray.600" textAlign="center">
                                        {row.designation}
                                      </Text>
                                      <HStack gap={2}>
                                        <Box
                                          px={2}
                                          py={0.5}
                                          borderRadius="md"
                                          bg={
                                            row.attrition_risk === 'critical' ? 'red.100' :
                                            row.attrition_risk === 'high' ? 'orange.100' : 'yellow.100'
                                          }
                                        >
                                          <Text
                                            fontSize="xs"
                                            fontWeight="bold"
                                            color={
                                              row.attrition_risk === 'critical' ? 'red.700' :
                                              row.attrition_risk === 'high' ? 'orange.700' : 'yellow.700'
                                            }
                                          >
                                            {row.attrition_risk.toUpperCase()}
                                          </Text>
                                        </Box>
                                        <Text fontSize="xs" color="gray.500">
                                          {row.tenure}
                                        </Text>
                                      </HStack>
                                    </VStack>
                                  </Box>
                                ))}
                              </Grid>
                            </Box>
                          )}
                          
                          {/* Selected Associate Retention Plan */}
                          {selectedAssociate && (
                            <Box p={5}>
                              <HStack gap={3} mb={4}>
                                <Box
                                  cursor="pointer"
                                  onClick={() => setSelectedAssociate(null)}
                                  p={2}
                                  borderRadius="md"
                                  _hover={{ bg: 'gray.100' }}
                                  transition="all 0.2s"
                                >
                                  <ArrowLeft size={20} color="#6b7280" />
                                </Box>
                                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                                  Back to Associates
                                </Text>
                              </HStack>
                              
                              {/* Employee Profile */}
                              <HStack gap={4} align="start" mb={5}>
                                <Box
                                  w="80px"
                                  h="80px"
                                  borderRadius="full"
                                  overflow="hidden"
                                  border="3px"
                                  borderColor="blue.200"
                                  shadow="md"
                                  flexShrink={0}
                                >
                                  <img src={selectedAssociate.photo} alt={selectedAssociate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <Box flex="1">
                                  <Text fontSize="xl" fontWeight="bold" color="gray.900" mb={1}>
                                    {selectedAssociate.name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.600" mb={1}>
                                    {selectedAssociate.designation} • {selectedAssociate.department}
                                  </Text>
                                  <HStack gap={3} flexWrap="wrap">
                                    <Text fontSize="xs" color="gray.500">Tenure: {selectedAssociate.tenure}</Text>
                                    <Text fontSize="xs" color="gray.500">•</Text>
                                    <Text fontSize="xs" color="gray.500">Attrition Risk: {selectedAssociate.attrition_risk}</Text>
                                  </HStack>
                                </Box>
                              </HStack>
                              
                              {/* Mock concerns, impact, and remediation for selected associate */}
                              <Box mb={5}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={3}>
                                  Identified Concerns
                                </Text>
                                <VStack align="stretch" gap={3}>
                                  <Box
                                    bg="white"
                                    p={4}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor={selectedAssociate.attrition_risk === 'critical' ? 'red.300' : 'orange.300'}
                                    shadow="sm"
                                  >
                                    <HStack justify="space-between" mb={2}>
                                      <Text fontSize="sm" fontWeight="bold" color="gray.900">
                                        Career Growth
                                      </Text>
                                      <Box
                                        px={2}
                                        py={0.5}
                                        borderRadius="md"
                                        bg={selectedAssociate.attrition_risk === 'critical' ? 'red.100' : 'orange.100'}
                                      >
                                        <Text
                                          fontSize="xs"
                                          fontWeight="bold"
                                          color={selectedAssociate.attrition_risk === 'critical' ? 'red.700' : 'orange.700'}
                                        >
                                          {selectedAssociate.attrition_risk.toUpperCase()}
                                        </Text>
                                      </Box>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.700">
                                      {selectedAssociate.attrition_risk === 'critical' 
                                        ? 'Has received a competitive offer from a competitor with significant salary increase and senior role'
                                        : 'Lack of clear career progression and growth opportunities in current role'}
                                    </Text>
                                  </Box>
                                </VStack>
                              </Box>
                              
                              <Box mb={5}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={3}>
                                  Impact of Departure
                                </Text>
                                <Box bg="red.50" p={4} borderRadius="lg" border="1px" borderColor="red.200">
                                  <VStack align="stretch" gap={3}>
                                    <HStack gap={3} align="start">
                                      <Box
                                        w="6"
                                        h="6"
                                        borderRadius="full"
                                        bg="red.600"
                                        color="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                        mt="2px"
                                      >
                                        <Text fontSize="xs">!</Text>
                                      </Box>
                                      <Box>
                                        <Text fontSize="xs" fontWeight="bold" color="red.800" mb={1}>
                                          Immediate Impact
                                        </Text>
                                        <Text fontSize="sm" color="red.900">
                                          Loss of critical domain knowledge and project momentum
                                        </Text>
                                      </Box>
                                    </HStack>
                                    <HStack gap={3} align="start">
                                      <Box
                                        w="6"
                                        h="6"
                                        borderRadius="full"
                                        bg="orange.500"
                                        color="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                        mt="2px"
                                      >
                                        <Text fontSize="xs">!</Text>
                                      </Box>
                                      <Box>
                                        <Text fontSize="xs" fontWeight="bold" color="orange.800" mb={1}>
                                          Project Risk
                                        </Text>
                                        <Text fontSize="sm" color="orange.900">
                                          Current projects may face delays of 2-4 weeks requiring replacement hiring
                                        </Text>
                                      </Box>
                                    </HStack>
                                  </VStack>
                                </Box>
                              </Box>
                              
                              <Box>
                                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={3}>
                                  Remediation Plan
                                </Text>
                                <VStack align="stretch" gap={4}>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="bold" color="gray.900" mb={3}>
                                      Immediate (Within 1 week)
                                    </Text>
                                    <VStack align="stretch" gap={2}>
                                      <Box bg="white" p={3} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
                                        <HStack justify="space-between" align="start" mb={2}>
                                          <Text fontSize="sm" color="gray.800" flex="1">
                                            Schedule 1:1 meeting to discuss career aspirations and concerns
                                          </Text>
                                          <HStack gap={2}>
                                            <Box px={2} py={0.5} borderRadius="md" bg="blue.100">
                                              <Text fontSize="xs" fontWeight="bold" color="blue.700">Manager</Text>
                                            </Box>
                                            <Box px={2} py={0.5} borderRadius="md" bg="gray.100">
                                              <Text fontSize="xs" fontWeight="bold" color="gray.700">pending</Text>
                                            </Box>
                                          </HStack>
                                        </HStack>
                                      </Box>
                                      <Box bg="white" p={3} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
                                        <HStack justify="space-between" align="start" mb={2}>
                                          <Text fontSize="sm" color="gray.800" flex="1">
                                            Review compensation package and consider adjustment
                                          </Text>
                                          <HStack gap={2}>
                                            <Box px={2} py={0.5} borderRadius="md" bg="blue.100">
                                              <Text fontSize="xs" fontWeight="bold" color="blue.700">HR</Text>
                                            </Box>
                                            <Box px={2} py={0.5} borderRadius="md" bg="gray.100">
                                              <Text fontSize="xs" fontWeight="bold" color="gray.700">pending</Text>
                                            </Box>
                                          </HStack>
                                        </HStack>
                                      </Box>
                                    </VStack>
                                  </Box>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="bold" color="gray.900" mb={3}>
                                      Short-term (Within 1 month)
                                    </Text>
                                    <VStack align="stretch" gap={2}>
                                      <Box bg="white" p={3} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
                                        <HStack justify="space-between" align="start" mb={2}>
                                          <Text fontSize="sm" color="gray.800" flex="1">
                                            Provide clear career development plan with milestones
                                          </Text>
                                          <HStack gap={2}>
                                            <Box px={2} py={0.5} borderRadius="md" bg="blue.100">
                                              <Text fontSize="xs" fontWeight="bold" color="blue.700">Manager</Text>
                                            </Box>
                                            <Box px={2} py={0.5} borderRadius="md" bg="gray.100">
                                              <Text fontSize="xs" fontWeight="bold" color="gray.700">pending</Text>
                                            </Box>
                                          </HStack>
                                        </HStack>
                                      </Box>
                                    </VStack>
                                  </Box>
                                </VStack>
                              </Box>
                            </Box>
                          )}

                          {/* Risk Analysis Table */}
                          {dataSet.data && dataSet.data.some((row: any) => row.project_risk) && (
                            <Box p={5}>
                              <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={4}>
                                Projects At Risk &middot; Associate Attrition Risk &middot; Recommendations
                              </Text>
                              <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
                                <Box bg="linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" px={4} py={3}>
                                  <HStack gap={4}>
                                    <Box flex="1.4"><Text fontSize="xs" fontWeight="700" color="red.800" textTransform="uppercase">Project</Text></Box>
                                    <Box flex="0.8"><Text fontSize="xs" fontWeight="700" color="red.800" textTransform="uppercase">Risk</Text></Box>
                                    <Box flex="1.2"><Text fontSize="xs" fontWeight="700" color="red.800" textTransform="uppercase">At-Risk Associate</Text></Box>
                                    <Box flex="0.8"><Text fontSize="xs" fontWeight="700" color="red.800" textTransform="uppercase">Attrition</Text></Box>
                                    <Box flex="2"><Text fontSize="xs" fontWeight="700" color="red.800" textTransform="uppercase">Recommendation</Text></Box>
                                  </HStack>
                                </Box>
                                {dataSet.data.map((row: any, idx: number) => {
                                  const riskColor = row.project_risk === 'High' ? 'red' : row.project_risk === 'Medium' ? 'orange' : 'yellow';
                                  const attrColor = row.attrition_level === 'High' ? 'red' : row.attrition_level === 'Medium' ? 'orange' : 'yellow';
                                  return (
                                    <HStack key={idx} gap={4} px={4} py={3} borderTop="1px solid" borderColor="gray.100" align="start" _hover={{ bg: "gray.50" }}>
                                      <Box flex="1.4">
                                        <Text fontSize="sm" fontWeight="600" color="gray.900">{row.project}</Text>
                                        <Text fontSize="xs" color="gray.500">{row.client}</Text>
                                      </Box>
                                      <Box flex="0.8">
                                        <Box display="inline-block" px={2} py={0.5} borderRadius="md" bg={`${riskColor}.100`}>
                                          <Text fontSize="xs" fontWeight="700" color={`${riskColor}.700`}>{row.project_risk}</Text>
                                        </Box>
                                      </Box>
                                      <Box flex="1.2">
                                        <Text fontSize="sm" fontWeight="600" color="gray.900">{row.associate}</Text>
                                        <Text fontSize="xs" color="gray.500">{row.role}</Text>
                                      </Box>
                                      <Box flex="0.8">
                                        <Box display="inline-block" px={2} py={0.5} borderRadius="md" bg={`${attrColor}.100`}>
                                          <Text fontSize="xs" fontWeight="700" color={`${attrColor}.700`}>{row.attrition_level}</Text>
                                        </Box>
                                        <Text fontSize="xs" color="gray.500" mt={0.5}>{row.attrition_score}%</Text>
                                      </Box>
                                      <Box flex="2">
                                        <Text fontSize="sm" color="gray.800" lineHeight="1.4">{row.recommendation}</Text>
                                      </Box>
                                    </HStack>
                                  );
                                })}
                              </Box>
                            </Box>
                          )}

                          {/* Pending Actions Table */}
                          {dataSet.data && dataSet.data.some((row: any) => row.task_status) && (
                            <Box p={5}>
                              <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide" mb={4}>
                                Pending Tasks From Plan of Actions
                              </Text>
                              <VStack align="stretch" gap={2}>
                                {dataSet.data.map((row: any, idx: number) => {
                                  const priorityColor = row.priority === 'High' ? 'red' : row.priority === 'Medium' ? 'orange' : 'blue';
                                  const isOverdue = row.due_in && row.due_in.toLowerCase().includes('overdue');
                                  return (
                                    <Box key={idx} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" p={3} boxShadow="0 1px 3px rgba(0,0,0,0.04)" _hover={{ borderColor: "blue.300", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.1)" }} transition="all 0.2s">
                                      <HStack justify="space-between" align="start" gap={3}>
                                        <HStack gap={3} align="start" flex="1">
                                          <Box w="6" h="6" borderRadius="md" bg={`${priorityColor}.100`} display="flex" alignItems="center" justifyContent="center" flexShrink={0} mt="2px">
                                            <Text fontSize="xs" fontWeight="700" color={`${priorityColor}.700`}>{idx + 1}</Text>
                                          </Box>
                                          <Box flex="1">
                                            <Text fontSize="sm" fontWeight="600" color="gray.900" mb={1}>{row.task}</Text>
                                            <Text fontSize="xs" color="gray.500">For: <Text as="span" fontWeight="600" color="gray.700">{row.associate}</Text> &middot; {row.context}</Text>
                                          </Box>
                                        </HStack>
                                        <VStack gap={1} align="end" flexShrink={0}>
                                          <Box px={2} py={0.5} borderRadius="md" bg={`${priorityColor}.100`}>
                                            <Text fontSize="2xs" fontWeight="700" color={`${priorityColor}.700`} textTransform="uppercase">{row.priority}</Text>
                                          </Box>
                                          <Box px={2} py={0.5} borderRadius="md" bg="blue.50">
                                            <Text fontSize="2xs" fontWeight="700" color="blue.700">{row.owner}</Text>
                                          </Box>
                                          <Text fontSize="2xs" color={isOverdue ? "red.600" : "gray.500"} fontWeight={isOverdue ? "700" : "500"}>
                                            {row.due_in}
                                          </Text>
                                        </VStack>
                                      </HStack>
                                    </Box>
                                  );
                                })}
                              </VStack>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {/* Message Actions */}
                  <HStack
                    className="message-actions"
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    bg="white"
                    borderRadius="full"
                    boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                    p={1}
                    opacity={0}
                    transition="opacity 0.2s"
                    gap={1}
                  >
                    <IconButton
                      aria-label="Copy message"
                      size="xs"
                      variant="ghost"
                      onClick={() => copyMessage(message.content)}
                    >
                      <Copy size={12} />
                    </IconButton>
                  </HStack>
                  
                  <Text
                    fontSize="xs"
                    color={message.type === 'user' ? 'whiteAlpha.700' : 'gray.500'}
                    mt={2}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </Box>

                {message.type === 'user' && (
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg="gray.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <User size={16} color="gray.600" />
                  </Box>
                )}
              </Flex>
            ))}
            {isLoading && (
              <Flex justify="flex-start" align="flex-start" gap={3}>
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg="linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  mt={1}
                >
                  <Bot size={16} color="white" />
                </Box>
                <Box
                  bg="white"
                  px={4}
                  py={3}
                  borderRadius="2xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                >
                  <HStack gap={2}>
                    <Spinner size="sm" color="teal.500" />
                    <Text fontSize="sm" color="gray.500">
                      Clyra is thinking...
                    </Text>
                  </HStack>
                </Box>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Input Area */}
        <Box
          bg="white"
          borderTop={isEmbedded ? "none" : "1px solid"}
          borderColor="gray.200"
          px={isEmbedded ? 0 : 4}
          py={isEmbedded ? 4 : 4}
          boxShadow={isEmbedded ? "none" : "0 -2px 10px rgba(0,0,0,0.05)"}
        >
          <HStack gap={3} maxW={isEmbedded ? "85%" : "4xl"} mx="auto" px={isEmbedded ? 6 : 0}>
            <Box flex="1" position="relative">
              <Textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isEmbedded ? "Type message" : "Type your message here... (Press Enter to send, Shift+Enter for new line)"}
                bg={isEmbedded ? "#f5f3ff" : "gray.50"}
                border="1px solid"
                borderColor={isEmbedded ? "#ede9fe" : "gray.300"}
                borderRadius={isEmbedded ? "full" : "xl"}
                resize="none"
                minH={isEmbedded ? "48px" : "50px"}
                maxH="120px"
                py={isEmbedded ? "14px" : 3}
                pl={isEmbedded ? 6 : 4}
                pr={isEmbedded ? 14 : 4}
                color="black"
                _focus={{
                  borderColor: isEmbedded ? "#a855f7" : "teal.400",
                  boxShadow: isEmbedded ? "0 0 0 1px #a855f7" : "0 0 0 1px teal.400"
                }}
                _placeholder={{
                  color: "gray.500"
                }}
              />
              {isEmbedded && (
                <IconButton
                  aria-label="Send message"
                  position="absolute"
                  right="6px"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="transparent"
                  color={inputMessage.trim() ? "#a855f7" : "gray.400"}
                  size="sm"
                  borderRadius="full"
                  _hover={{
                    bg: "purple.50"
                  }}
                  transition="all 0.2s"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : <Send size={18} />}
                </IconButton>
              )}
            </Box>
            
            {!isEmbedded && (
              <IconButton
                aria-label="Send message"
                bg="linear-gradient(135deg, #0077b6 0%, #3b82f6 100%)"
                color="white"
                size="lg"
                borderRadius="xl"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
                }}
                _active={{
                  transform: "scale(0.95)"
                }}
                transition="all 0.2s"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                boxShadow="0 2px 8px rgba(0,0,0,0.15)"
              >
                {isLoading ? <Spinner size="sm" /> : <Send size={20} />}
              </IconButton>
            )}
          </HStack>
        </Box>
      </Box>
      </Flex>
    </Box>
  );
}
