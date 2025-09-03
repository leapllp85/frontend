// Types for the new RAG API response structure

export interface ComponentConfig {
  type: string; // 'bar_chart', 'line_chart', 'data_table', etc.
  title: string;
  description: string;
  properties: {
    x_axis?: string;
    y_axis?: string;
    groupBy?: string;
    aggregation?: 'sum' | 'count' | 'avg' | 'max' | 'min';
    filters?: string[];
  };
}

export interface Analysis {
  query_intent: string;
  data_requirements: string[];
  recommended_component: 'chart' | 'table' | 'card' | 'list' | 'metric' | 'dashboard';
  component_config: ComponentConfig;
}

export interface QueryInfo {
  description: string;
  sql: string;
  orm: string;
  expected_fields: string[];
}

export interface DataProcessing {
  transformations: string[];
  calculations: string[];
  formatting: string[];
}

export interface Insights {
  key_findings: string[];
  recommendations: string[];
  next_steps: string[];
}

export interface DatasetResult {
  description: string;
  columns: string[];
  data: Record<string, any>[];
  row_count: number;
  error?: string;
}

export interface RAGApiResponse {
  success: boolean;
  error?: string;
  raw_response?: string;
  analysis?: Analysis;
  queries?: QueryInfo[];
  data_processing?: DataProcessing;
  insights?: Insights;
  dataset?: DatasetResult[];
}

// Chat conversation types
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  response?: RAGApiResponse; // For assistant messages with structured data
}

export interface ChatConversation {
  id: string;
  title?: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
  isArchived?: boolean;
  isStarred?: boolean;
}

export interface ChatRequest {
  prompt?: string;  // Legacy field for backward compatibility
  query?: string;   // New field for async chat
  conversation_id?: string;
}

export interface ChatResponse {
  response: string | RAGApiResponse;
  message_id?: number;
  conversation_id?: string;
}

export interface ChatInitiateResponse {
    task_id: string;
    status: "processing";
    message: string;
    success: boolean;
}