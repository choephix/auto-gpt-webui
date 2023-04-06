import { Button, ButtonGroup, Container, Divider, Heading, VStack } from '@chakra-ui/react';
import { APIService } from '../services/APIService';
import { OutputBox } from './OutputBox';

const exeActions = ['ls -la', `pip install -r requirements.txt`, `python scripts/main.py`];

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

  async function updateEnvVariable(key: string) {
    const value = prompt(`Enter value for ${key}:`);
    if (value !== null) {
      return await apiService.setEnvVariable(key, value);
    }
  }

  return (
    <Container maxW='full'>
      <VStack spacing={6} w='full'>
        <Heading as='h2' size='lg'>
          Environment Variables
        </Heading>
        <ButtonGroup>
          <Button onClick={() => updateEnvVariable('OPENAI_API_KEY')}>Set OpenAI API Key</Button>
          <Button onClick={() => updateEnvVariable('GOOGLE_API_KEY')}>Set Google API Key</Button>
          <Button onClick={() => updateEnvVariable('CUSTOM_SEARCH_ENGINE_ID')}>
            Set Custom Search Engine ID
          </Button>
        </ButtonGroup>

        <Divider />

        <Heading as='h2' size='lg'>
          Actions
        </Heading>
        <ButtonGroup>
          {exeActions.map((action, index) => (
            <Button key={index} onClick={() => execc(action)}>
              exec: {action}
            </Button>
          ))}
        </ButtonGroup>

        <Divider />

        <Heading as='h2' size='lg'>
          Controls
        </Heading>
        <ButtonGroup>
          <Button onClick={() => killProcess()}>Kill</Button>
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
