import { Center, Text, useColorModeValue } from '@chakra-ui/react';
import { useAutoGPTStarter } from '../hooks/useAutoGPTStarter';
import { useContextStore } from '../store/useContextStore';
import { useSettingsStore } from '../store/useSettingsStore';

export function CommandStringBar() {
  const { backendState } = useContextStore();
  const { command: aiStarterCommand } = useAutoGPTStarter();
  const { autoContinuous } = useSettingsStore();

  const commandStringToDisplay =
    backendState?.activeCommandString ?? aiStarterCommand;
  const comandIsRunning = !!backendState?.activeProcessRunning;

  return (
    <Center
      key='CommandStringBar'
      boxSizing='border-box'
      h='15.em'
      w='full'
      className={
        'CommandStip glass withSlideDownAnimation withSmallShadow' +
        (comandIsRunning ? ' active' : ' inactive') +
        (autoContinuous ? ' continuous' : '')
      }
    >
      <Text pointerEvents='all'>
        <code>{commandStringToDisplay}</code>
      </Text>
    </Center>
  );
}
