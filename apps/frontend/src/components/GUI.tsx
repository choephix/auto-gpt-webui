import { Button, ButtonGroup, Container, Divider, Heading, VStack } from '@chakra-ui/react';
import { APIService } from '../services/APIService';
import { OutputBox } from './OutputBox';

const exeActions = [`pip install -r requirements.txt`, `python scripts/main.py`];

const apiService = new APIService();

interface GUIProps {
  socket: WebSocket | null;
}

export function GUI({ socket }: GUIProps) {
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
    <Container maxW='full'>
      <VStack spacing={6} w='full'>
        <Heading as='h2' size='lg'>
          Auto-GPT WebUI
        </Heading>
        <ButtonGroup>
          {exeActions.map((action, index) => (
            <Button key={index} onClick={() => execc(action)}>
              exec: {action}
            </Button>
          ))}
          <Button onClick={() => killProcess()}>Kill</Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button onClick={() => sendInput('y')}>Send "y"</Button>
          <Button onClick={() => sendInput('Jonkata')}>Send "Jonkata"</Button>
          <Button onClick={() => sendInput('Come up with a funny joke')}>Send "Joke"</Button>
          <Button onClick={() => sendInput('')}>Send "⏎"</Button>
        </ButtonGroup>

        <Divider />

        <Container maxW='full'>
          <OutputBox socket={socket} />
        </Container>
      </VStack>
    </Container>
  );
}
