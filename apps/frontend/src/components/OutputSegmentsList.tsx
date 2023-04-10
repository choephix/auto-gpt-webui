import { CheckIcon } from '@chakra-ui/icons';
import { Box, Button, Progress, Tag, Wrap } from '@chakra-ui/react';
import { useState } from 'react';
import { useApiService } from '../hooks/useApiService';
import { OutputSegment, useContextStore } from '../store/useContextStore';

export function OutputSegmentsList() {
  const { socket, outputSegments, backendState } = useContextStore();

  if (!socket) {
    return null;
  }

  if (!outputSegments.length) {
    return null;
  }

  const lastSegment = outputSegments[outputSegments.length - 1];
  const shouldShowProgress =
    backendState?.activeProcessRunning && !lastSegment.expectedUserInteraction;

  return (
    <>
      {outputSegments.map((segment, index) => {
        if (segment.lines.length === 0) {
          return null;
        }

        const text = segment.lines.join('\n').trim();
        if (text.startsWith(`[[COMMAND]]`)) {
          const commandString = text.replace(`[[COMMAND]]`, '').trim();
          return <CommandHeadingBox key={index} content={commandString} />;
        } else {
          return <SegmentBox key={index} segment={segment} />;
        }
      })}
      {shouldShowProgress && (
        <Progress
          size='xs'
          isIndeterminate
          rounded='full'
          colorScheme='yellow'
          mt={6}
          mx={6}
        />
      )}
    </>
  );
}

function CommandHeadingBox({ content }: { content: string }) {
  return (
    <Tag
      size='sm'
      w='full'
      px='5'
      py='1.5'
      mt='8'
      borderRadius='full'
      className='OutputCommandHeadingBox glass withFadeInAnimation'
      fontWeight='bold'
      background='#ffd000'
      // color='#FFFD'
      color='#000C'
    >
      <code>{content}</code>
    </Tag>
  );
}

function SegmentBox({ segment }: { segment: OutputSegment }) {
  const { backendState } = useContextStore();

  const text = segment.lines.join('\n').trim();
  if (!text) {
    return null;
  }

  const showInputBar =
    segment.isLastSegment && backendState?.activeProcessRunning;

  return (
    <Box
      // className='OutputSegmentBox glass withPopInAnimation'
      className='OutputSegmentBox glass'
      transition={'box-shadow 0.2s ease-in-out'}
      boxShadow={
        'inset 0 0 32px rgba(0, 191, 255, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1)'
      }
      _hover={{
        boxShadow:
          'inset 0 0 256px rgba(0, 191, 255, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <pre dangerouslySetInnerHTML={{ __html: text }}></pre>
      {showInputBar && <SegmentBoxInputBar segment={segment} />}
    </Box>
  );
}

function SegmentBoxInputBar({ segment }: { segment: OutputSegment }) {
  const { expectedUserInteraction } = segment;
  const apiService = useApiService();

  const [forceShowInputBar, setForceShowInputBar] = useState(false);

  function sendInput(input: string) {
    apiService.sendInput(input);
  }

  function promptAndSendInput() {
    const value = prompt(`I'm listening for input. Enter a value:`);
    if (value !== null) {
      return apiService.sendInput(value);
    }
  }

  function YesNoAndInputBar(props: { redNo?: boolean }) {
    return (
      <Wrap w='full'>
        <Button
          size='sm'
          px={6}
          colorScheme='green'
          leftIcon={<CheckIcon />}
          onClick={() => sendInput('y')}
        >
          Yes
        </Button>
        <Button
          //
          size='sm'
          px={6}
          colorScheme={props.redNo ? 'red' : 'blue'}
          onClick={() => sendInput('n')}
        >
          No
        </Button>
        <Button
          size='sm'
          px={6}
          colorScheme='blue'
          onClick={() => sendInput('')}
        >
          ⏎ Enter
        </Button>
        {/* <Spacer /> */}
        <Button
          size='sm'
          px={6}
          colorScheme='pink'
          onClick={() => promptAndSendInput()}
        >
          Enter custom text to send
        </Button>
      </Wrap>
    );
  }

  if (
    expectedUserInteraction === 'yesno' ||
    expectedUserInteraction === 'text'
  ) {
    return <YesNoAndInputBar />;
  }

  if (forceShowInputBar) {
    return (
      <>
        <Button
          size='sm'
          onClick={() => setForceShowInputBar(false)}
          variant='link'
          mb='2'
        >
          [Hide input options]
        </Button>
        <YesNoAndInputBar />
      </>
    );
  }

  return (
    <Button size='sm' onClick={() => setForceShowInputBar(true)} variant='link'>
      [Show input options]
    </Button>
  );
}
