'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage, ChatConversation, RAGApiResponse } from '../types/ragApi';
import { generateChat, generateChatWithAbort } from '../lib/apis/llm';
import { chatApi } from '../services/chatApi';

interface ChatContextType {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  isLoading: boolean;
  isTyping: boolean;
  progress: string | null;
  addMessage: (content: string, type: 'user' | 'assistant', response?: RAGApiResponse) => void;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  sendMessageAsync: (content: string, attachments?: File[]) => Promise<void>;
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

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }): JSX.Element => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateId = (): string => {
    // Generate a proper UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Load conversations from localStorage on mount (client-side only)
  useEffect(() => {
    setIsHydrated(true);
    
    if (typeof window === 'undefined') return;
    
    const savedConversations = localStorage.getItem('chat_conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          created_at: new Date(conv.created_at),
          updated_at: new Date(conv.updated_at),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
        
        // Set the most recent conversation as current if none exists
        if (conversationsWithDates.length > 0 && !currentConversation) {
          setCurrentConversation(conversationsWithDates[0]);
        }
      } catch (error) {
        console.error('Failed to parse saved conversations:', error);
      }
    } else {
      // Create initial conversation if none exists
      const initialConversation = {
        id: generateId(),
        messages: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      setCurrentConversation(initialConversation);
      setConversations([initialConversation]);
    }
  }, []);

  // Save conversations to localStorage whenever they change (client-side only)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    if (conversations.length > 0) {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    }
  }, [conversations, isHydrated]);

  const startNewConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: generateId(),
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    
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
      
      // Add the message to the new conversation
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

    // Check for duplicate messages (same content and type within last 5 seconds)
    const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
    if (lastMessage && 
        lastMessage.content === content && 
        lastMessage.type === type &&
        (new Date().getTime() - new Date(lastMessage.timestamp).getTime()) < 5000) {
      console.log('Duplicate message prevented:', content);
      return; // Skip duplicate message
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

  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() || isLoading) return;

    // Prevent duplicate requests for the same content
    if (pendingRequest === content) {
      console.log('Duplicate request prevented:', content);
      return;
    }
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      console.log('Aborting previous request');
      abortControllerRef.current.abort();
    }
    
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;
    setPendingRequest(content);
    
    console.log('Starting new API request:', content);

    // Ensure we have a conversation before adding message
    if (!currentConversation) {
      startNewConversation();
      // Wait for conversation to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Add user message
    addMessage(content, 'user');
    setIsLoading(true);

    try {
      // Call the API with abort signal and timeout
      const timeoutId = setTimeout(() => {
        newAbortController.abort();
        console.log('Request timed out after 30 seconds');
      }, 30000);
      
      const response = await generateChatWithAbort(content, newAbortController.signal);
      clearTimeout(timeoutId);
      
      // Check if request was aborted
      if (newAbortController.signal.aborted) {
        return;
      }
      
      // Handle different response types
      if (response.ok) {
        const data = await response.json();
        
        // Check if it's an error response
        if (data.success === false && data.error) {
          addMessage(`I apologize, but I encountered an error: ${data.error}`, 'assistant');
          return;
        }
        
        // Check if it's a structured RAG response
        if (data.success !== undefined && data.response) {
          // Use the nested response object for RAG responses
          const ragResponse = data.response;
          const messageText = ragResponse.insights?.key_findings?.[0] || ragResponse.analysis?.query_intent || 'Dashboard generated successfully';
          addMessage(messageText, 'assistant', ragResponse);
        } else if (data.success !== undefined) {
          addMessage(data.raw_response || 'Response received', 'assistant', data);
        } else {
          // Handle simple string response
          const responseText = typeof data === 'string' ? data : data.response || 'No response received';
          addMessage(responseText, 'assistant');
        }
      } else {
        // Handle HTTP error responses
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.error) {
          addMessage(`I encountered an error: ${errorData.error}`, 'assistant');
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }
      console.error('Failed to send message:', error);
      addMessage('Sorry, I encountered an error while processing your message. Please try again.', 'assistant');
    } finally {
      setIsLoading(false);
      setPendingRequest(null);
      abortControllerRef.current = null;
    }
  }, [addMessage, isLoading, pendingRequest, startNewConversation]);

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
        conv.id === conversationId 
          ? { ...conv, title, updated_at: new Date() }
          : conv
      )
    );
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev => prev ? { ...prev, title, updated_at: new Date() } : null);
    }
  }, [currentConversation]);

  const archiveConversation = useCallback((conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isArchived: true, updated_at: new Date() }
          : conv
      )
    );
  }, []);

  const clearHistory = useCallback(() => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear state
    setConversations([]);
    setCurrentConversation(null);
    setPendingRequest(null);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat_conversations');
    }
  }, []);
  
  // Cleanup on unmount
  useEffect((): (() => void) => {
    return (): void => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const setTyping = useCallback((typing: boolean) => {
    setIsTyping(typing);
  }, []);

  return (
    <ChatContext.Provider value={{
      currentConversation,
      conversations: isHydrated ? conversations : [],
      isLoading,
      isTyping,
      addMessage,
      sendMessage,
      startNewConversation,
      loadConversation,
      deleteConversation,
      renameConversation,
      archiveConversation,
      clearHistory,
      setTyping,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
