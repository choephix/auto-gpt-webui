import AnsiToHtml from 'ansi-to-html';
import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Container, Divider, Heading, VStack } from '@chakra-ui/react';
import { APIService } from '../services/APIService';

const ansiToHtml = new AnsiToHtml();

const exeActions = ['ls -la', `pip install -r requirements.txt`, `python scripts/main.py`];

const apiService = new APIService();

interface GUIProps {
  socket: WebSocket;
}

export function GUI({ socket }: GUIProps) {
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      console.log('WebSocket message received: ', event.data);
      const rawOutput = String(event.data)
        .replace(/.+Thinking\.\.\..*/gm, '')
        .replace(/^\s*$[\n\r]{1,}/gm, '🧠 -- Thinking --\n');
      const htmlOutput = ansiToHtml.toHtml(rawOutput);
      setOutput(htmlOutput);
    }

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket]);

  function execc(command: string) {
    apiService.execc(command);
  }

  function sendInput(input: string) {
    apiService.sendInput(input);
  }

  function killProcess() {
    apiService.killProcess();
  }

  async function setEnvVariable(key: string, value: string) {
    await apiService.setEnvVariable(key, value);
  }

  async updateEnvVariable(key: string) {
    const value = prompt(`Enter value for ${key}:`);
    if (value !== null) {
      await this.setEnvVariable(key, value);
    }
  }

  async function updateEnvVariable(key: string) {
    await updateEnvVariable(key);
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
              {action}
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
          {output && (
            <Box
              flex={1}
              w='full'
              h='60vh'
              overflowY='auto'
              className='output-box'
              bg='gray.50'
              p={4}
              mt={4}
            >
              <pre dangerouslySetInnerHTML={{ __html: output }}></pre>
            </Box>
          )}
        </Container>
      </VStack>
    </Container>
  );
}
