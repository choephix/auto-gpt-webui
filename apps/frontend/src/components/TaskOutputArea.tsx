import { CheckIcon, CloseIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Container, IconButton, Spacer, Text } from '@chakra-ui/react';
import { useApiService } from '../hooks/useApiService';
import { OutputSegment, useContextStore } from '../store/useContextStore';
import { useState } from 'react';

export function TaskOutputArea() {
  const { socket, outputSegments } = useContextStore();

  if (!socket) {
    return <Text fontSize='sm'>No socket connection.</Text>;
  }

  if (!outputSegments.length) {
    return <Text fontSize='sm'>No console output yet. Run a command to get started.</Text>;
  }

  return (
    <Container maxW='container.xl' display='relative' key='TaskOutputArea'>
      {outputSegments.map((segment, index) => {
        return <SegmentBox key={index} segment={segment} />;
      })}
    </Container>
  );
}

function SegmentBox({ segment }: { segment: OutputSegment }) {
  const text = segment.lines.join('\n');

  if (!text) {
    return null;
  }

  function InputBar({ segment }: { segment: OutputSegment }) {
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
        <ButtonGroup w='full'>
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
          {/* <Input
            //
            size='sm'
            placeholder='...or enter some custom input here'
            rounded='md'
            variant='filled'
          /> */}
          <Button size='sm' px={6} colorScheme='purple' onClick={() => promptAndSendInput()}>
            Enter text to send
          </Button>
          <Spacer />
          <Button size='sm' px={6} colorScheme='blue' onClick={() => sendInput('')}>
            ⏎ Enter
          </Button>
        </ButtonGroup>
      );
    }

    if (expectedUserInteraction === 'yesno') {
      return <YesNoAndInputBar redNo />;
    }

    if (expectedUserInteraction === 'text') {
      return <YesNoAndInputBar />;
    }

    if (forceShowInputBar) {
      return (
        <>
          <Button size='sm' onClick={() => setForceShowInputBar(false)} variant='link' mb='2'>
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

  return (
    <Box className='OutputSegmentBox'>
      <pre dangerouslySetInnerHTML={{ __html: text }}></pre>
      {segment.isLastSegment && <InputBar segment={segment} />}
    </Box>
  );
}
