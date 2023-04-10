import { Center, Text, useColorModeValue } from '@chakra-ui/react';
import { useAutoGPTStarter } from '../hooks/useAutoGPTStarter';
import { useContextStore } from '../store/useContextStore';

export function CommandStringBar() {
  const { backendState } = useContextStore();
  const { command: aiStarterCommand } = useAutoGPTStarter();

  const commandStringToDisplay = backendState?.activeCommandString ?? aiStarterCommand;
  const comandIsRunning = !!backendState?.activeProcessRunning;

  return (
    <Center
      bg={
        comandIsRunning
          ? 'linear-gradient(180deg, Tomato, Crimson)'
          : useColorModeValue('#bbcc', 'gray.700')
      }
      color={comandIsRunning ? 'white' : useColorModeValue('gray.700', 'gray.200')}
      border='1px solid #0005'
      boxSizing='border-box'
      h='15.em'
      w='full'
      fontWeight='bold'
      transition='background-color 0.2s ease-in-out'
      className={
        'CommandStip glass withSlideDownAnimation withSmallShadow ' +
        (comandIsRunning ? 'active' : 'inactive')
      }
    >
      <Text pointerEvents='all'>
        <code>{commandStringToDisplay}</code>
      </Text>
    </Center>
  );
}
