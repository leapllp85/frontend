import { fetchWithAuth } from "./auth";
import { ChatConversation, ChatMessage, ChatRequest, ChatResponse } from "../../types/ragApi";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BASE_URL;

export interface CreateConversationRequest {
  title?: string;
}

export interface UpdateConversationRequest {
  title?: string;
  isArchived?: boolean;
  isStarred?: boolean;
}

export interface SendMessageRequest {
  content: string;
  conversationId?: string;
  attachments?: File[];
}

// Conversation Management APIs
export async function createConversation(data: CreateConversationRequest = {}) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/conversations/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response;
}

export async function getConversations(limit = 50, offset = 0) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/conversations/?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
    }
  );
  return response;
}

export async function getConversation(conversationId: string) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/conversations/${conversationId}/`,
    {
      method: 'GET',
    }
  );
  return response;
}

export async function updateConversation(conversationId: string, data: UpdateConversationRequest) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/conversations/${conversationId}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response;
}

export async function deleteConversation(conversationId: string) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/conversations/${conversationId}/`,
    {
      method: 'DELETE',
    }
  );
  return response;
}

export async function archiveConversation(conversationId: string) {
  return updateConversation(conversationId, { isArchived: true });
}

export async function unarchiveConversation(conversationId: string) {
  return updateConversation(conversationId, { isArchived: false });
}

export async function starConversation(conversationId: string) {
  return updateConversation(conversationId, { isStarred: true });
}

export async function unstarConversation(conversationId: string) {
  return updateConversation(conversationId, { isStarred: false });
}

// Message Management APIs
export async function sendMessage(data: SendMessageRequest) {
  const formData = new FormData();
  formData.append('content', data.content);
  
  if (data.conversationId) {
    formData.append('conversation_id', data.conversationId);
  }
  
  // Handle file attachments
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });
  }

  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/messages/`,
    {
      method: 'POST',
      body: formData, // Don't set Content-Type header for FormData
    }
  );
  return response;
}

export async function getMessages(conversationId: string, limit = 50, offset = 0) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/conversations/${conversationId}/messages/?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
    }
  );
  return response;
}

export async function updateMessage(messageId: string, content: string) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/messages/${messageId}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    }
  );
  return response;
}

export async function deleteMessage(messageId: string) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/messages/${messageId}/`,
    {
      method: 'DELETE',
    }
  );
  return response;
}

// Search APIs
export async function searchConversations(query: string, filters?: {
  isArchived?: boolean;
  isStarred?: boolean;
  dateFrom?: string;
  dateTo?: string;
}) {
  const params = new URLSearchParams({
    q: query,
  });
  
  if (filters) {
    if (filters.isArchived !== undefined) {
      params.append('archived', filters.isArchived.toString());
    }
    if (filters.isStarred !== undefined) {
      params.append('starred', filters.isStarred.toString());
    }
    if (filters.dateFrom) {
      params.append('date_from', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('date_to', filters.dateTo);
    }
  }

  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/search/conversations/?${params.toString()}`,
    {
      method: 'GET',
    }
  );
  return response;
}

export async function searchMessages(query: string, conversationId?: string) {
  const params = new URLSearchParams({
    q: query,
  });
  
  if (conversationId) {
    params.append('conversation_id', conversationId);
  }

  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/search/messages/?${params.toString()}`,
    {
      method: 'GET',
    }
  );
  return response;
}

// Legacy support - keep the existing generateChat function
export async function generateChat(prompt: string) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    }
  );
  return response;
}

// Enhanced chat with conversation support
export async function generateChatWithConversation(data: ChatRequest) {
  const response = await fetchWithAuth(
    `${BASE_URL}/api/v1/chat/generate/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response;
}

// Utility functions for client-side conversation management
export const chatUtils = {
  // Convert API response to ChatConversation format
  formatConversation: (apiConversation: any): ChatConversation => ({
    id: apiConversation.id,
    title: apiConversation.title,
    messages: apiConversation.messages?.map((msg: any) => ({
      id: msg.id,
      type: msg.type,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      response: msg.response,
    })) || [],
    created_at: new Date(apiConversation.created_at),
    updated_at: new Date(apiConversation.updated_at),
    isArchived: apiConversation.is_archived,
    isStarred: apiConversation.is_starred,
  }),

  // Convert API response to ChatMessage format
  formatMessage: (apiMessage: any): ChatMessage => ({
    id: apiMessage.id,
    type: apiMessage.type,
    content: apiMessage.content,
    timestamp: new Date(apiMessage.timestamp),
    response: apiMessage.response,
  }),

  // Generate conversation title from first message
  generateTitle: (firstMessage: string, maxLength = 50): string => {
    if (!firstMessage) return 'New Conversation';
    
    const cleaned = firstMessage.trim();
    if (cleaned.length <= maxLength) return cleaned;
    
    return cleaned.substring(0, maxLength - 3) + '...';
  },
};
