import { CheckIcon } from '@chakra-ui/icons';
import
  {
    Box,
    Button,
    ButtonGroup,
    Container,
    Spacer,
    Text
  } from '@chakra-ui/react';
import { useApiService } from '../hooks/useApiService';
import { OutputSegment, useContextStore } from '../store/useContextStore';

export function TaskOutputArea() {
  const { socket, outputSegments } = useContextStore();

  if (!socket) {
    return <Text fontSize='sm'>No socket connection.</Text>;
  }

  if (!outputSegments.length) {
    return <Text fontSize='sm'>No console output yet. Run a command to get started.</Text>;
  }

  function SegmentBox({ segment }: { segment: OutputSegment }) {
    const text = segment.lines.join('\n');

    if (!text) {
      return null;
    }

    return (
      <Box className='OutputSegmentBox'>
        <pre dangerouslySetInnerHTML={{ __html: text }}></pre>
        <InputBar segment={segment} />
      </Box>
    );
  }

  function InputBar({ segment }: { segment: OutputSegment }) {
    const { expectedUserInteraction } = segment;
    const apiService = useApiService();

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
      return <YesNoAndInputBar />;
    }

    if (expectedUserInteraction === 'text') {
      return <YesNoAndInputBar />;
    }

    return null;
  }

  return (
    <Container maxW='container.xl' display="relative">
      {/* <div className='stripe'>
        <div className='stripe_inner'>WARNING</div>
      </div> */}
      {outputSegments.map((segment, index) => {
        return <SegmentBox key={index} segment={segment} />;
      })}
    </Container>
  );
}
