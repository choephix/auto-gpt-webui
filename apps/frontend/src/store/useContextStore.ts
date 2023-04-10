import { BackendServiceState } from '../entities/BackendServiceState';
import { createSimpleZustandStore } from '../utils/createSimpleZustandStore';

export interface OutputSegment {
  lines: string[];
  expectedUserInteraction: 'yesno' | 'text' | null;
  isLastSegment: boolean;
}

export const useContextStore = createSimpleZustandStore({
  socket: null as WebSocket | null,

  outputSegments: [] as OutputSegment[],

  backendConfiguration: null as BackendServiceState['configuration'] | null,
  backendState: null as BackendServiceState['state'] | null,
});

//// This is a hack to make the store available globally for easy peasy debugging ////
Object.assign(globalThis, {
  useContextStore,
  get contextStore() {
    return useContextStore.singletonRef;
  },
});
