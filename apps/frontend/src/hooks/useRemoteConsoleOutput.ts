import AnsiToHtml from 'ansi-to-html';
import { useEffect, useState } from 'react';
import { OutputSegment, useContextStore } from '../store/useContextStore';

const ansiToHtml = new AnsiToHtml();

type MessageData = {
  fullConsoleOutput: string;
};

const SEGMENT_BREAKERS = ['NEXT ACTION: ', 'Welcome to Auto-GPT!'];

export function useRemoteConsoleOutput(socket: WebSocket | null) {
  const { setOutputSegments } = useContextStore();

  useEffect(() => {
    if (!socket) {
      return;
    }

    function onMessage(event: MessageEvent) {
      console.log('WebSocket message received: ', event.data);
      const data = JSON.parse(String(event.data)) as MessageData;
      const { fullConsoleOutput } = data;

      const segments = [] as OutputSegment[];
      function addLineToSegmentWithIndex(line: string, index: number) {
        if (!segments[index]) {
          segments[index] = {
            lines: [],
            expectedUserInteraction: null,
            isLastSegment: false,
          };
        }

        const formattedLine = ansiToHtml.toHtml(line);
        segments[index].lines.push(formattedLine);
      }

      const outputLines = fullConsoleOutput.split('\n');
      let segmentIndex = 0;
      for (const line of outputLines) {
        if (SEGMENT_BREAKERS.some(str => line.includes(str))) {
          segmentIndex++;
        }

        addLineToSegmentWithIndex(line, segmentIndex);
      }

      segments[segments.length - 1].isLastSegment = true;

      const lastLine = outputLines[outputLines.length - 1];
      if (lastLine.includes('(y/n)')) {
        segments[segmentIndex].expectedUserInteraction = 'yesno';
      } else if (lastLine.includes('Input:') || lastLine.endsWith(': ') || lastLine.endsWith(':')) {
        segments[segmentIndex].expectedUserInteraction = 'text';
      }

      console.log('lastLine: ', lastLine);

      setOutputSegments(segments);
    }

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket]);
}
