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
    data_field?: string;
    colors?: Record<string, string>;
    metrics?: Array<{
      label: string;
      field: string;
      filter?: string;
      aggregation: string;
    }>;
    columns?: Array<{
      field: string;
      label: string;
    }>;
    sortable?: boolean;
    searchable?: boolean;
    exportable?: boolean;
    sections?: string[];
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
  components?: AsyncComponent[];
  layout?: AsyncLayout;
  dataset?: Record<string, DatasetResult>;
  insights?: {
    key_findings?: string[];
    recommendations?: string[];
    next_steps?: string[];
    alerts?: string[];
  };
}

export interface Insights {
  key_findings?: string[];
  recommendations?: string[];
  next_steps?: string[];
  alerts?: string[];
}

export interface DatasetResult {
  description: string;
  columns: string[];
  data: Record<string, any>[];
  row_count: number;
  error?: string;
}

// Async response component types
export interface AsyncComponent {
  id: string;
  type: string;
  title: string;
  description?: string;
  properties: any;
}

export interface AsyncLayout {
  type: string;
  columns: number;
  rows: number;
  responsive: boolean;
  spacing: string;
  component_arrangement: Array<{
    component_id: string;
    position: {
      row: number;
      col: number;
      span_col: number;
      span_row: number;
    };
    size: string;
    span_col?: number;
    span_row?: number;
  }>;
}

export interface RAGApiResponse {
  success: boolean;
  error?: string;
  raw_response?: string;
  analysis?: Analysis;
  queries?: QueryInfo[];
  data_processing?: DataProcessing;
  insights?: Insights;
  dataset?: DatasetResult[] | Record<string, DatasetResult>;
  
  // New async response properties
  status?: string;
  task_id?: string;
  user_id?: number;
  completed_at?: string;
  conversation_id?: string;
  message_id?: string;
  layout?: AsyncLayout;
  components?: AsyncComponent[];
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