import { apiService } from './api';

// Chat API Types
export interface ChatMessage {
  id: number;
  message: string;
  response: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRequest {
  prompt: string;
}

export interface ChatResponse {
  response: string;
  message_id?: number;
}

export class ChatApiService {
  // Send chat message and get AI response
  async sendMessage(prompt: string): Promise<ChatResponse> {
    return await apiService.post<ChatResponse>('/chat/', { prompt });
  }

  // Get chat history
  async getChatHistory(): Promise<ChatMessage[]> {
    return await apiService.get<ChatMessage[]>('/chat/history/');
  }

  // Get specific chat message
  async getChatMessage(id: number): Promise<ChatMessage> {
    return await apiService.get<ChatMessage>(`/chat/${id}/`);
  }

  // Delete chat message
  async deleteChatMessage(id: number): Promise<void> {
    return await apiService.delete<void>(`/chat/${id}/`);
  }

  // Clear all chat history
  async clearChatHistory(): Promise<void> {
    return await apiService.delete<void>('/chat/clear/');
  }
}

export const chatApi = new ChatApiService();
