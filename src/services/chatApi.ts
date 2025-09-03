import { apiService } from './api';
import { RAGApiResponse, ChatMessage, ChatRequest, ChatResponse } from '../types/ragApi';

// Types for async chat
interface ChatInitiateResponse {
  task_id: string;
  status: string;
  message: string;
  success: boolean;
}

interface ChatTaskResponse {
  status: 'processing' | 'completed' | 'failed';
  conversation_id?: string;
  message_id?: string;
  response?: RAGApiResponse;
  error?: string;
  progress?: string;
  completed_at?: string;
  success: boolean;
}

export class ChatApiService {
  // New async chat flow - initiate chat
  async initiateChat(prompt: string, conversationId?: string): Promise<ChatInitiateResponse> {
    try {
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      const requestData: ChatRequest = {
        query: prompt.trim(),
        conversation_id: conversationId
      };
      
      return await apiService.post<ChatInitiateResponse>('/chat/initiate/', requestData);
    } catch (error) {
      console.error('Chat initiate error:', error);
      throw this.handleChatError(error);
    }
  }

  // Poll for chat response using task_id
  async getChatResponse(taskId: string): Promise<ChatTaskResponse> {
    try {
      return await apiService.get<ChatTaskResponse>(`/chat/response/${taskId}/`);
    } catch (error) {
      console.error('Chat response error:', error);
      throw this.handleChatError(error);
    }
  }

  // Complete async chat flow with polling
  async sendMessageAsync(prompt: string, conversationId?: string, onProgress?: (progress: string) => void): Promise<ChatResponse> {
    try {
      // Step 1: Initiate chat
      const initiateResponse = await this.initiateChat(prompt, conversationId);
      
      if (!initiateResponse.success) {
        throw new Error(initiateResponse.message || 'Failed to initiate chat');
      }

      const taskId = initiateResponse.task_id;
      
      // Step 2: Poll for response
      return await this.pollForResponse(taskId, onProgress);
    } catch (error) {
      console.error('Async chat error:', error);
      throw error;
    }
  }

  // Poll for response with exponential backoff
  private async pollForResponse(taskId: string, onProgress?: (progress: string) => void): Promise<ChatResponse> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;
    let delay = 2000; // Start with 2 seconds

    while (attempts < maxAttempts) {
      try {
        const response = await this.getChatResponse(taskId);
        
        // Update progress if callback provided
        if (onProgress && response.progress) {
          onProgress(response.progress);
        }

        if (response.status === 'completed' && response.success) {
          return {
            response: response.response!,
            message_id: response.message_id ? parseInt(response.message_id) : Date.now(),
            conversation_id: response.conversation_id
          };
        } else if (response.status === 'failed') {
          throw new Error(response.error || 'Chat processing failed');
        }

        // Still processing, wait and retry
        await this.sleep(delay);
        attempts++;
        
        // Exponential backoff with max delay of 10 seconds
        delay = Math.min(delay * 1.1, 10000);
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          throw new Error('Chat task not found or expired');
        }
        throw error;
      }
    }

    throw new Error('Chat processing timeout. Please try again.');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Legacy sync method for backward compatibility
  async sendMessage(prompt: string, conversationId?: string): Promise<ChatResponse> {
    try {
      // Validate input
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      // Use apiService.post to handle JSON response
      const requestData: ChatRequest = {
        prompt: prompt.trim(),
        conversation_id: conversationId
      };
      const ragResponse = await apiService.post<ChatInitiateResponse>('/chat/initiate/', requestData);
      
      // Validate response
      if (!ragResponse) {
        throw new Error('Empty response received from server');
      }

      return {
        response: ragResponse,
        message_id: Date.now(), // Generate a temporary ID
        conversation_id: conversationId
      };
    } catch (error) {
      console.error('Chat API error:', error);
      throw this.handleChatError(error);
    }
  }

  private handleChatError(error: any): Error {
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        return new Error('Authentication failed. Please log in again.');
      } else if (error.message.includes('403')) {
        return new Error('Access denied. You do not have permission to use the AI Assistant.');
      } else if (error.message.includes('500')) {
        return new Error('Server error. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return new Error('Network error. Please check your connection and try again.');
      }
    }
    
    return error;
  }

  // Legacy method for backward compatibility with HTML responses
  async sendMessageLegacy(prompt: string): Promise<{ response: string; message_id?: number }> {
    try {
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      const htmlContent = await apiService.postText('/chat/', { prompt: prompt.trim() });
      
      if (!htmlContent) {
        throw new Error('Empty response received from server');
      }

      return {
        response: htmlContent,
        message_id: Date.now()
      };
    } catch (error) {
      console.error('Legacy Chat API error:', error);
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
