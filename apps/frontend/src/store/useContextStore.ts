import { createSimpleZustandStore } from '../utils/createSimpleZustandStore';
import { createStoreWrappedWithProxy } from '../utils/createStoreWrappedWithProxy';

export const useContextStore = createSimpleZustandStore({
  socket: null as WebSocket | null,
  outputSegments: [] as string[],
});
