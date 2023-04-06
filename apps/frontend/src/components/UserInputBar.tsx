import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import { useApiService } from '../hooks/useApiService';
import { useRemoteConsoleOutput } from '../hooks/useRemoteConsoleOutput';
import { useContextStore } from '../store/useContextStore';

export function UserInputBar() {
  const apiService = useApiService();

  function sendInput(input: string) {
    apiService.sendInput(input);
  }

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => sendInput('y')}>Send "y"</Button>
        <Button onClick={() => sendInput('Jonkata')}>Send "Jonkata"</Button>
        <Button onClick={() => sendInput('Come up with a funny joke')}>Send "Joke"</Button>
        <Button onClick={() => sendInput('')}>Send "⏎"</Button>
      </ButtonGroup>
    </>
  );
}
