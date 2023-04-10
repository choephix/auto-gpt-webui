export interface BackendServiceState {
  fullConsoleOutput?: string;
  latestChunk?: string;
  configuration?: {
    OPENAI_API_KEY?: string;
    PINECONE_API_KEY?: string;
    PINECONE_ENV?: string;
    GOOGLE_API_KEY?: string;
    ELEVENLABS_API_KEY?: string;
    SMART_LLM_MODEL?: string;
    FAST_LLM_MODEL?: string;
    CUSTOM_SEARCH_ENGINE_ID?: string;
    IMAGE_PROVIDER?: string;
    HUGGINGFACE_API_TOKEN?: string;
    MEMORY_BACKEND?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASSWORD?: string;
  };
  state?: {
    activeProcessRunning: boolean;
    activeCommandString: string;
  };
}
