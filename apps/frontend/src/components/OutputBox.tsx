import { Box, Text } from '@chakra-ui/react';
import { useRemoteConsoleOutput } from '../hooks/useRemoteConsoleOutput';

interface OutputBoxProps {
  socket: WebSocket | null;
}

export function OutputBox({ socket }: OutputBoxProps) {
  const { consoleOutput, isWaitingForInput } = useRemoteConsoleOutput(socket);

  if (!socket) {
    return <Text fontSize='sm'>No socket connection.</Text>;
  }

  if (!consoleOutput) {
    return <Text fontSize='sm'>No console output yet. Run a command to get started.</Text>;
  }

  return <pre dangerouslySetInnerHTML={{ __html: consoleOutput }}></pre>;
}
