'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage, ChatConversation, RAGApiResponse } from '../types/ragApi';
import { asyncChatApi, AsyncChatOptions } from '../services/asyncChatApi';

interface ChatContextType {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  isLoading: boolean;
  isTyping: boolean;
  progress: number | null;
  progressMessage: string | null;
  activeTasks: string[];
  addMessage: (content: string, type: 'user' | 'assistant', response?: RAGApiResponse) => void;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  sendMessageAsync: (content: string, attachments?: File[]) => Promise<void>;
  sendMessageStreaming: (content: string, attachments?: File[]) => Promise<void>;
  cancelActiveTask: (taskId?: string) => Promise<void>;
  cancelAllTasks: () => Promise<void>;
  startNewConversation: () => void;
  loadConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  renameConversation: (conversationId: string, title: string) => void;
  archiveConversation: (conversationId: string) => void;
  clearHistory: () => void;
  setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [activeTasks, setActiveTasks] = useState<string[]>([]);

  const generateId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Initialize with fresh conversation on mount (no persistence)
  useEffect(() => {
    setIsHydrated(true);
    
    // Always start with a fresh conversation
    const initialConversation = {
      id: generateId(),
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    setCurrentConversation(initialConversation);
    setConversations([initialConversation]);
  }, []);

  // No persistence - conversations are session-only

  const startNewConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: generateId(),
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    // Add to conversations instead of replacing
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  }, []);

  const addMessage = useCallback((content: string, type: 'user' | 'assistant', response?: RAGApiResponse) => {
    if (!currentConversation) {
      console.warn('No current conversation when adding message, creating new one');
      const newConv = {
        id: generateId(),
        messages: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      const newMessage: ChatMessage = {
        id: generateId(),
        type,
        content,
        timestamp: new Date(),
        response,
      };
      
      const updatedNewConv = {
        ...newConv,
        messages: [newMessage],
        updated_at: new Date(),
      };
      
      setCurrentConversation(updatedNewConv);
      setConversations(prev => [updatedNewConv, ...prev]);
      return;
    }

    // Check for duplicate messages
    const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
    if (lastMessage && 
        lastMessage.content === content && 
        lastMessage.type === type &&
        (new Date().getTime() - new Date(lastMessage.timestamp).getTime()) < 5000) {
      console.log('Duplicate message prevented:', content);
      return;
    }

    const newMessage: ChatMessage = {
      id: generateId(),
      type,
      content,
      timestamp: new Date(),
      response,
    };

    const updatedConversation: ChatConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      updated_at: new Date(),
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
  }, [currentConversation]);

  // Simplified sendMessage that uses async internally but appears synchronous
  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    return await sendMessageAsync(content, attachments);
  }, []);

  const sendMessageAsync = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() || isLoading) return;

    // Ensure we have a conversation
    if (!currentConversation) {
      startNewConversation();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Add user message
    addMessage(content, 'user');
    setIsLoading(true);
    setProgress(0);
    setProgressMessage('Processing your request...');

    let hasCompleted = false;
    
    try {
      const options: AsyncChatOptions = {
        onProgress: (progress, message) => {
          setProgress(progress);
          setProgressMessage(message || 'Processing...');
        },
        onComplete: (response) => {
          hasCompleted = true;
          console.log('onComplete response:', response);
          // Add the full structured response with meaningful content
          const messageContent = response?.insights?.key_findings?.[0] || 'Dashboard generated successfully';
          addMessage(messageContent, 'assistant', response);
        },
        onError: (error) => {
          hasCompleted = true;
          addMessage(`I apologize, but I encountered an error: ${error}`, 'assistant');
        }
      };

      await asyncChatApi.sendMessageAsync(content, currentConversation?.id, options);
    } catch (error) {
      console.error('Chat error:', error);
      if (!hasCompleted) {
        addMessage('I apologize, but I encountered an error processing your request.', 'assistant');
      }
    } finally {
      setIsLoading(false);
      setProgress(null);
      setProgressMessage(null);
    }
  }, [currentConversation, isLoading, addMessage, startNewConversation]);

  const sendMessageStreaming = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() || isLoading) return;

    if (!currentConversation) {
      startNewConversation();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    addMessage(content, 'user');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const options: AsyncChatOptions = {
        onProgress: (progress, message) => {
          setProgress(progress);
          setProgressMessage(message || 'Streaming...');
        },
        onPartialResponse: (partialData) => {
          // Handle partial responses for streaming
        },
        onComplete: (response) => {
          const messageText = response.insights?.key_findings?.[0] || 
                            response.analysis?.query_intent || 
                            'Response generated successfully';
          addMessage(messageText, 'assistant', response);
          setIsTyping(false);
        },
        onError: (error) => {
          addMessage(`I apologize, but I encountered an error: ${error}`, 'assistant');
          setIsTyping(false);
        }
      };

      await asyncChatApi.sendMessageStreaming(content, currentConversation?.id, options);
    } catch (error) {
      console.error('Streaming chat error:', error);
      addMessage('I apologize, but I encountered an error processing your request.', 'assistant');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
      setProgress(null);
      setProgressMessage(null);
    }
  }, [currentConversation, isLoading, addMessage, startNewConversation]);

  const cancelActiveTask = useCallback(async (taskId?: string) => {
    try {
      if (taskId) {
        await asyncChatApi.cancelTask(taskId);
        setActiveTasks(prev => prev.filter(id => id !== taskId));
      } else {
        // Cancel the most recent task
        const tasks = await asyncChatApi.getActiveTasks();
        if (tasks.length > 0) {
          await asyncChatApi.cancelTask(tasks[0].task_id);
        }
      }
      
      setIsLoading(false);
      setProgress(null);
      setProgressMessage(null);
    } catch (error) {
      console.error('Failed to cancel task:', error);
    }
  }, []);

  const cancelAllTasks = useCallback(async () => {
    try {
      await asyncChatApi.cancelAllTasks();
      setActiveTasks([]);
      setIsLoading(false);
      setProgress(null);
      setProgressMessage(null);
    } catch (error) {
      console.error('Failed to cancel all tasks:', error);
    }
  }, []);

  const loadConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  const renameConversation = useCallback((conversationId: string, title: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, title } : conv
      )
    );
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, archived: true } : conv
      )
    );
  }, []);

  const clearHistory = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat_conversations');
    }
  }, []);

  const contextValue: ChatContextType = {
    currentConversation,
    conversations,
    isLoading,
    isTyping,
    progress,
    progressMessage,
    activeTasks,
    addMessage,
    sendMessage,
    sendMessageAsync,
    sendMessageStreaming,
    cancelActiveTask,
    cancelAllTasks,
    startNewConversation,
    loadConversation,
    deleteConversation,
    renameConversation,
    archiveConversation,
    clearHistory,
    setTyping: setIsTyping,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
