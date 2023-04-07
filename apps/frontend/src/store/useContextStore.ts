import { createSimpleZustandStore } from '../utils/createSimpleZustandStore';

export interface OutputSegment {
  lines: string[];
  expectedUserInteraction: "yesno" | "text" | null;
  isLastSegment: boolean;
}

export const useContextStore = createSimpleZustandStore({
  socket: null as WebSocket | null,
  socketConnected: false,

  outputSegments: [] as OutputSegment[],
});
