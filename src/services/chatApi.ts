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
    try {
      // Validate input
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      // Use apiService.postText to handle HTML response
      const htmlContent = await apiService.postText('/chat/', { prompt: prompt.trim() });
      
      // Validate response
      if (!htmlContent) {
        throw new Error('Empty response received from server');
      }

      return {
        response: htmlContent,
        message_id: Date.now() // Generate a temporary ID
      };
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Authentication')) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (error.message.includes('403')) {
          throw new Error('Access denied. You do not have permission to use the AI Assistant.');
        } else if (error.message.includes('500')) {
          throw new Error('Server error. Please try again later.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
      }
      
      throw error;
    }
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
