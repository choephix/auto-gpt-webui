import AnsiToHtml from 'ansi-to-html';
import { useEffect, useState } from 'react';

const ansiToHtml = new AnsiToHtml();

type MessageData = {
  fullConsoleOutput: string;
};

export function useRemoteConsoleOutput(socket: WebSocket | null) {
  const [output, setOutput] = useState<string>('');
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function onMessage(event: MessageEvent) {
      console.log('WebSocket message received: ', event.data);
      const data = JSON.parse(String(event.data)) as MessageData;
      const { fullConsoleOutput } = data;
      let output = String(fullConsoleOutput);
      // output = output.replace(/.+Thinking\.\.\..*/gm, '')
      // output = output.replace(/^\s*$[\n\r]{1,}/gm, '🧠 -- Thinking --\n');
      const htmlOutput = ansiToHtml.toHtml(output);
      setOutput(htmlOutput);

      const lastLine = output.split('\n').pop();
      const waitingForInput = lastLine?.includes('Input:') || lastLine?.includes('(y/n)') || false;
      setWaitingForInput(waitingForInput);
    }

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket]);

  return {
    consoleOutput: output,
    isWaitingForInput: waitingForInput,
  };
}
