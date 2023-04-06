import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import { useRemoteConsoleOutput } from '../hooks/useRemoteConsoleOutput';
import { APIService } from '../services/APIService';
import { useContextStore } from '../store/useContextStore';

const apiService = new APIService();

export function UserInputBar() {
  const { socket } = useContextStore();
  const { isWaitingForInput } = useRemoteConsoleOutput(socket);

  function sendInput(input: string) {
    apiService.sendInput(input);
  }

  return (
    <>
      {isWaitingForInput ? (
        <ButtonGroup>
          <Button onClick={() => sendInput('y')}>Send "y"</Button>
          <Button onClick={() => sendInput('Jonkata')}>Send "Jonkata"</Button>
          <Button onClick={() => sendInput('Come up with a funny joke')}>Send "Joke"</Button>
          <Button onClick={() => sendInput('')}>Send "⏎"</Button>
        </ButtonGroup>
      ) : <>
        <Text>Not waiting for input</Text>
      </>}
    </>
  );
}
