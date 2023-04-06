import { createStoreWrappedWithProxy } from '../utils/createStoreWrappedWithProxy';

export interface ContextStore {
	socket: WebSocket | null;
  setSocket: (socket: WebSocket | null) => void;

  
}

export const useContextStore = createStoreWrappedWithProxy<ContextStore>((set, get) => {

  const store: ContextStore = {
    socket: null,
    setSocket: (socket: WebSocket | null) => set(() => ({ socket })),
  };

  return store;
});
