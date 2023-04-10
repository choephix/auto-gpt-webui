export interface BackendServiceState {
  fullConsoleOutput?: string;
  latestChunk?: string;
  configuration?: {
    OPENAI_API_KEY?: string;
    PINECONE_API_KEY?: string;
    GOOGLE_API_KEY?: string;
    ELEVENLABS_API_KEY?: string;
    SMART_LLM_MODEL?: string;
    FAST_LLM_MODEL?: string;
    CUSTOM_SEARCH_ENGINE_ID?: string;
  };
  state?: {
    activeProcessRunning: boolean;
    activeCommandString: string;
  };
}
