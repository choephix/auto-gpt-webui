import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const useUpdateLocalStorage = () => {
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const {
    autoContinuous,
    autoDebugMode,
    autoWithOnlyGPT3,
    setAutoContinuous,
    setAutoDebugMode,
    setAutoWithOnlyGPT3,
    aiProfiles,
    setAiProfiles,
  } = useSettingsStore();

  useEffect(() => {
    const settings = localStorage.getItem('settings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setAutoWithOnlyGPT3(!!parsedSettings.autoWithOnlyGPT3);
      setAutoContinuous(!!parsedSettings.autoContinuous);
      setAutoDebugMode(!!parsedSettings.autoDebugMode);

      if (parsedSettings.aiProfiles) {
        setAiProfiles(parsedSettings.aiProfiles);
      }

      setSettingsLoaded(true);
    }
  }, [setAutoWithOnlyGPT3, setAutoContinuous, setAutoDebugMode, setAiProfiles]);

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    localStorage.setItem(
      'settings',
      JSON.stringify({
        autoWithOnlyGPT3,
        autoContinuous,
        autoDebugMode,
        aiProfiles,
      }),
    );
  }, [
    settingsLoaded,
    autoWithOnlyGPT3,
    autoContinuous,
    autoDebugMode,
    aiProfiles,
  ]);
};
