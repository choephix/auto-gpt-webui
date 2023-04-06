import { Box, Text } from '@chakra-ui/react';
import AnsiToHtml from 'ansi-to-html';
import { useEffect, useState } from 'react';

const ansiToHtml = new AnsiToHtml();

interface OutputBoxProps {
  socket: WebSocket | null;
}

export function OutputBox({ socket }: OutputBoxProps) {
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    if (!socket) {
      return;
    }
    
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

  if (!socket) {
    return <Text fontSize='sm'>No socket connection.</Text>;
  }

  if (!output) {
    return <Text fontSize='sm'>No output yet. Run a command to get started.</Text>;
  }

  return (
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
  );
}
