// API Types
export interface GenerateRequest {
  prompt: string;
}

export interface StreamEvent {
  type: 'code_delta' | 'done' | 'error';
  content?: string;
  code?: string;
  message?: string;
}

// Component State
export interface GeneratorState {
  prompt: string;
  code: string;
  isLoading: boolean;
  error: string | null;
}
