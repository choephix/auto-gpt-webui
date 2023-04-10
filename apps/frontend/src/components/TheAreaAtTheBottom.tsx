import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { useApiService } from '../hooks/useApiService';
import { useContextStore } from '../store/useContextStore';
import { AboutInfoModal } from './AboutInfoModal';
import { SettingsDrawer } from './SettingsDrawer';

export function TheAreaAtTheBottom() {
  const { socket, backendState, outputSegments } = useContextStore();
  const apiService = useApiService();

  if (!socket || !backendState) {
    return null;
  }

  function killProcess() {
    apiService.killProcess();
  }

  function clearOutput() {
    apiService.clearOutput();
  }

  async function sendInput() {
    const input = prompt('Enter input:');
    if (input !== null) {
      apiService.sendInput(input);
    }
  }

  return (
    <>
      <Flex
        direction='row'
        minWidth='max-content'
        w='full'
        // alignItems='end'
        alignItems='center'
        justifyContent='space-between'
        gap='2'
      >
        <AboutInfoModal />

        <Flex
          direction='column'
          minWidth='max-content'
          alignItems='center'
          justifyContent='center'
          gap='2'
        >
          <ButtonGroup
            size='lg'
            isAttached
            variant='solid'
            rounded='full'
            flexShrink='1'
          >
            {backendState?.activeProcessRunning ? (
              <>
                <Button colorScheme='teal' onClick={sendInput} rounded='full'>
                  Send Input
                </Button>
                <Button colorScheme='red' onClick={killProcess} rounded='full'>
                  Terminate
                </Button>
              </>
            ) : outputSegments?.length > 0 ? (
              <>
                <Button onClick={clearOutput} rounded='full'>
                  Clear output
                </Button>
              </>
            ) : (
              <Text>☝ Select an AI Profile to fire up Auto-GPT with. ☝</Text>
            )}
          </ButtonGroup>
        </Flex>

        <SettingsDrawer />
      </Flex>
    </>
  );
}
