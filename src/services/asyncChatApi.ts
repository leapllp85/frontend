import { RAGApiResponse, ChatMessage, ChatRequest, ChatResponse } from '../types/ragApi';
import { apiService } from './api';

// Enhanced types for async chat operations
export interface AsyncChatInitiateResponse {
  task_id: string;
  status: 'processing' | 'queued' | 'completed';
  message: string;
  success: boolean;
  estimated_time?: number; // in seconds
  cached?: boolean;
  // Cached response fields
  layout?: any;
  components?: any[];
  dataset?: any;
  insights?: any;
  conversation_id?: string;
  message_id?: string;
}

export interface AsyncChatStatusResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number; // 0-100
  progress_message?: string;
  conversation_id?: string;
  message_id?: string;
  response?: RAGApiResponse;
  error?: string;
  completed_at?: string;
  success: boolean;
}

export interface StreamingChatResponse {
  type: 'progress' | 'partial' | 'complete' | 'error';
  task_id: string;
  data?: any;
  progress?: number;
  message?: string;
  error?: string;
}

export interface AsyncChatOptions {
  onProgress?: (progress: number, message?: string) => void;
  onPartialResponse?: (partialData: any) => void;
  onComplete?: (response: RAGApiResponse) => void;
  onError?: (error: string) => void;
  timeout?: number; // in milliseconds, default 300000 (5 minutes)
  pollInterval?: number; // in milliseconds, default 2000
}

export class AsyncChatApiService {
  private activeTasks: Map<string, AbortController> = new Map();

  /**
   * Initiate an async chat request
   */
  async initiateChat(
    prompt: string, 
    conversationId?: string,
    options: { priority?: 'low' | 'normal' | 'high' } = {}
  ): Promise<AsyncChatInitiateResponse> {
    try {
      if (!prompt?.trim()) {
        throw new Error('Message cannot be empty');
      }

      const requestData: ChatRequest & { priority?: string } = {
        query: prompt.trim(),
        conversation_id: conversationId,
        priority: options.priority || 'normal'
      };

      return await apiService.post<AsyncChatInitiateResponse>('/chat/initiate/', requestData);
    } catch (error) {
      console.error('Async chat initiate error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get status of an async chat task
   */
  async getTaskStatus(taskId: string): Promise<AsyncChatStatusResponse> {
    try {
      return await apiService.get<AsyncChatStatusResponse>(`/chat/response/${taskId}/`);
    } catch (error) {
      console.error('Task status error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel an async chat task
   */
  async cancelTask(taskId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Cancel local polling if active
      const controller = this.activeTasks.get(taskId);
      if (controller) {
        controller.abort();
        this.activeTasks.delete(taskId);
      }

      return await apiService.post<{ success: boolean; message: string }>(`/chat/cancel/${taskId}/`, {});
    } catch (error) {
      console.error('Task cancellation error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send message with full async flow and callbacks
   */
  async sendMessageAsync(
    prompt: string,
    conversationId?: string,
    options: AsyncChatOptions = {}
  ): Promise<ChatResponse> {
    const {
      onProgress,
      onPartialResponse,
      onComplete,
      onError,
      timeout = 300000, // 5 minutes
      pollInterval = 2000 // 2 seconds
    } = options;

    try {
      // Step 1: Initiate the chat
      const initiateResponse = await this.initiateChat(prompt, conversationId);
      
      if (!initiateResponse.success) {
        throw new Error(initiateResponse.message || 'Failed to initiate chat');
      }

      // Check if response is cached - return immediately
      if (initiateResponse.cached && initiateResponse.status === 'completed') {
        const cachedResponse: ChatResponse = {
          response: {
            layout: initiateResponse.layout,
            components: initiateResponse.components,
            dataset: initiateResponse.dataset,
            insights: initiateResponse.insights
          } as RAGApiResponse,
          message_id: initiateResponse.message_id ? parseInt(initiateResponse.message_id) : Date.now(),
          conversation_id: initiateResponse.conversation_id
        };

        // Trigger completion callback with cached data
        onComplete?.(initiateResponse as any);
        return cachedResponse;
      }

      const taskId = initiateResponse.task_id;
      
      // Step 2: Poll for completion with callbacks (for non-cached responses)
      return await this.pollTaskWithCallbacks(taskId, {
        onProgress,
        onPartialResponse,
        onComplete,
        onError,
        timeout,
        pollInterval
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onError?.(errorMessage);
      throw error;
    }
  }

  /**
   * Poll task status with progress callbacks
   */
  private async pollTaskWithCallbacks(
    taskId: string,
    options: AsyncChatOptions
  ): Promise<ChatResponse> {
    const {
      onProgress,
      onPartialResponse,
      onComplete,
      onError,
      timeout = 300000,
      pollInterval = 2000
    } = options;

    const controller = new AbortController();
    this.activeTasks.set(taskId, controller);

    const startTime = Date.now();
    let lastProgress = 0;

    try {
      while (Date.now() - startTime < timeout) {
        // Check if cancelled
        if (controller.signal.aborted) {
          throw new Error('Task was cancelled');
        }

        try {
          const status = await this.getTaskStatus(taskId);

          // Update progress if changed
          if (status.progress !== undefined && status.progress !== lastProgress) {
            lastProgress = status.progress;
            onProgress?.(status.progress, status.progress_message);
          }

          // Handle completion
          if (status.status === 'completed' && status.success) {
            const response: ChatResponse = {
              response: status.response!,
              message_id: status.message_id ? parseInt(status.message_id) : Date.now(),
              conversation_id: status.conversation_id
            };

            // Pass the entire status object which contains insights, layout, components, etc.
            onComplete?.(status as any);
            this.activeTasks.delete(taskId);
            return response;
          }

          // Handle failure
          if (status.status === 'failed') {
            const error = status.error || 'Chat processing failed';
            onError?.(error);
            throw new Error(error);
          }

          // Handle cancellation
          if (status.status === 'cancelled') {
            throw new Error('Task was cancelled');
          }

          // Continue polling if still processing
          await this.sleep(pollInterval);

        } catch (statusError) {
          if (statusError instanceof Error && statusError.message.includes('Task not found')) {
            throw new Error('Chat task expired or was removed');
          }
          throw statusError;
        }
      }

      // Timeout reached
      await this.cancelTask(taskId);
      throw new Error('Chat processing timeout. Please try again.');

    } finally {
      this.activeTasks.delete(taskId);
    }
  }

  /**
   * Streaming chat with Server-Sent Events (if supported by backend)
   */
  async sendMessageStreaming(
    prompt: string,
    conversationId?: string,
    options: AsyncChatOptions = {}
  ): Promise<void> {
    const { onProgress, onPartialResponse, onComplete, onError } = options;

    try {
      const requestData: ChatRequest = {
        query: prompt.trim(),
        conversation_id: conversationId
      };

      // Note: Streaming requires custom fetch for SSE, but we'll use apiService base URL
      const response = await fetch(`${apiService.getBaseUrl()}/chat/stream/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getAuthToken()}`,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming not supported');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamingChatResponse = JSON.parse(line.slice(6));
                
                switch (data.type) {
                  case 'progress':
                    onProgress?.(data.progress || 0, data.message);
                    break;
                  case 'partial':
                    onPartialResponse?.(data.data);
                    break;
                  case 'complete':
                    onComplete?.(data.data);
                    return;
                  case 'error':
                    onError?.(data.error || 'Streaming error');
                    return;
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Streaming error occurred';
      onError?.(errorMessage);
      throw error;
    }
  }

  /**
   * Get all active tasks for the current user
   */
  async getActiveTasks(): Promise<AsyncChatStatusResponse[]> {
    try {
      return await apiService.get<AsyncChatStatusResponse[]>('/chat/tasks/');
    } catch (error) {
      console.error('Get active tasks error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel all active tasks
   */
  async cancelAllTasks(): Promise<{ cancelled_count: number; message: string }> {
    try {
      // Cancel local polling
      for (const [taskId, controller] of this.activeTasks) {
        controller.abort();
      }
      this.activeTasks.clear();

      return await apiService.post<{ cancelled_count: number; message: string }>('/chat/cancel-all/', {});
    } catch (error) {
      console.error('Cancel all tasks error:', error);
      throw this.handleError(error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  private handleError(error: any): Error {
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        return new Error('Authentication failed. Please log in again.');
      } else if (error.message.includes('403')) {
        return new Error('Access denied. You do not have permission to use the AI Assistant.');
      } else if (error.message.includes('429')) {
        return new Error('Rate limit exceeded. Please wait before sending another message.');
      } else if (error.message.includes('500')) {
        return new Error('Server error. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return new Error('Network error. Please check your connection and try again.');
      }
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

// Export singleton instance
export const asyncChatApi = new AsyncChatApiService();
