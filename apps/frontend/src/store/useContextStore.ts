import { createSimpleZustandStore } from '../utils/createSimpleZustandStore';
import { createStoreWrappedWithProxy } from '../utils/createStoreWrappedWithProxy';

export interface OutputSegment {
  lines: string[];
  expectedUserInteraction: "yesno" | "text" | null;
  isLastSegment: boolean;
}

export const useContextStore = createSimpleZustandStore({
  socket: null as WebSocket | null,
  outputSegments: [] as OutputSegment[],
});
