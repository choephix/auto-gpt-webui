import AnsiToHtml from 'ansi-to-html';
import { useEffect, useState } from 'react';

const ansiToHtml = new AnsiToHtml();

export function useRemoteConsoleOutput(socket: WebSocket | null) {
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

  return {
    consoleOutput: output,
    isWaitingForInput: output.endsWith('Input:'),
  }
}
