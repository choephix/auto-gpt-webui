import AnsiToHtml from 'ansi-to-html';
import { useEffect } from 'react';
import { BackendServiceState } from '../entities/BackendServiceState';
import { OutputSegment, useContextStore } from '../store/useContextStore';

const ansiToHtml = new AnsiToHtml();

const SEGMENT_BREAKERS = [
  //
  'Welcome to Auto-GPT!',
  'NEXT ACTION: ',
  '\n\n',
];

export function useRemoteConsoleOutput(socket: WebSocket | null) {
  const { setOutputSegments, setBackendConfiguration, setBackendState } =
    useContextStore();

  useEffect(() => {
    if (!socket) {
      return;
    }

    function updateOutputSegmentWithIndex(fullConsoleOutput: string) {
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

      if (fullConsoleOutput) {
        const outputLines = fullConsoleOutput.split('\n');
        let segmentIndex = 0;

        for (const line of outputLines) {
          const isSegmentBreaker = SEGMENT_BREAKERS.some((str) =>
            line.includes(str),
          );
          if (isSegmentBreaker || line.includes('[[COMMAND]]')) {
            segmentIndex++;
          }

          addLineToSegmentWithIndex(line, segmentIndex);

          if (line.includes('[[COMMAND]]')) {
            segmentIndex++;
          }
        }

        segments[segments.length - 1].isLastSegment = true;

        const lastLine = outputLines[outputLines.length - 1];
        if (lastLine.includes('(y/n)')) {
          segments[segmentIndex].expectedUserInteraction = 'yesno';
        } else if (
          lastLine.includes('Input:') //
          // || lastLine.endsWith(': ')
          // || lastLine.endsWith(':')
        ) {
          segments[segmentIndex].expectedUserInteraction = 'text';
        }
      }

      setOutputSegments(segments);
    }

    function onMessage(event: MessageEvent) {
      const data = JSON.parse(String(event.data)) as BackendServiceState;

      if (data.fullConsoleOutput !== undefined) {
        updateOutputSegmentWithIndex(data.fullConsoleOutput);
      }

      if (data.configuration !== undefined) {
        setBackendConfiguration(data.configuration);
      }

      if (data.state !== undefined) {
        setBackendState(data.state);
      }
    }

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket]);
}
