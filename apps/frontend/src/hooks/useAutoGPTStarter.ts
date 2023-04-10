import { AIProfile } from '../entities/AIProfile';
import { useSettingsStore } from '../store/useSettingsStore';
import { useApiService } from './useApiService';

export function useAutoGPTStarter() {
  const apiService = useApiService();
  const { autoWithOnlyGPT3, autoContinuous, autoDebugMode } =
    useSettingsStore();

  const autoGptAdditionalCommandArgs = [
    autoWithOnlyGPT3 ? '--gpt3only' : '',
    autoContinuous ? '--continuous' : '',
    autoDebugMode ? '--debug' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const command = `python scripts/main.py ` + autoGptAdditionalCommandArgs;

  function sendStartCommandWithProfile(aiProfile: AIProfile) {
    if (!aiProfile) {
      throw new Error('No AI profile selected');
    }

    apiService.applyAiProfile({
      ai_name: aiProfile.name,
      ai_role: aiProfile.role,
      ai_goals: aiProfile.goals,
    });

    apiService.startCommand(command, ['y']);
  }

  return { command, sendStartCommandWithProfile };
}
