import { Box, Button, ButtonGroup, Divider, Flex, Heading, VStack } from '@chakra-ui/react';
import { APIService } from '../services/APIService';
import { OutputBox } from './OutputBox';
import { useRemoteConsoleOutput } from '../hooks/useRemoteConsoleOutput';

const exeActions = [`pip install -r requirements.txt`, `python scripts/main.py`];

const apiService = new APIService();

interface GUIProps {
  socket: WebSocket | null;
}

export function GUI({ socket }: GUIProps) {
  const { isWaitingForInput } = useRemoteConsoleOutput(socket);

  function execc(command: string) {
    apiService.startCommand(command);
  }

  function sendInput(input: string) {
    apiService.sendInput(input);
  }

  function killProcess() {
    apiService.killProcess();
  }

  return (
    <Flex direction='column' w='full' h='100dvh'>
      <VStack spacing={6} w='full'>
        {/* 
        <Heading as='h2' size='lg'>
          Auto-GPT WebUI
        </Heading>
        */}

        <Divider />

        <ButtonGroup>
          {exeActions.map((action, index) => (
            <Button key={index} onClick={() => execc(action)}>
              exec: {action}
            </Button>
          ))}
          <Button onClick={() => killProcess()}>Kill</Button>
        </ButtonGroup>

        <Divider />

        {isWaitingForInput && (
          <ButtonGroup>
            <Button onClick={() => sendInput('y')}>Send "y"</Button>
            <Button onClick={() => sendInput('Jonkata')}>Send "Jonkata"</Button>
            <Button onClick={() => sendInput('Come up with a funny joke')}>Send "Joke"</Button>
            <Button onClick={() => sendInput('')}>Send "⏎"</Button>
          </ButtonGroup>
        )}
      </VStack>
    </Flex>
  );
}
