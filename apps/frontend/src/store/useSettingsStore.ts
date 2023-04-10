import { AIProfile } from '../entities/AIProfile';
import { createSimpleZustandStore } from '../utils/createSimpleZustandStore';

export const useSettingsStore = createSimpleZustandStore({
  autoWithOnlyGPT3: false,
  autoContinuous: false,
  autoDebugMode: false,

  aiProfiles: [] as AIProfile[],
});

//// This is a hack to make the store available globally for easy peasy debugging ////
Object.assign(globalThis, {
  useSettingsStore,
  get settingsStore() {
    return useSettingsStore.singletonRef;
  },
});
