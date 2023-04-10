import { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react';

import { TheAreaAtTheBottom } from './components/TheAreaAtTheBottom';
import { TheAreaAtTheTop } from './components/TheAreaAtTheTop';
import { TheAreaInTheMiddle } from './components/TheAreaInTheMiddle';
import { ServicesRunner } from './components/TheHiddenServiceRunner';
import { useContextStore } from './store/useContextStore';

import './App.css';
import './App.animations.css';

function App() {
  const { socket } = useContextStore();

  const { colorMode } = useColorMode();

  return (
    <Box
      className={`App AppBackground ${colorMode}-mode`}
      overflow='hidden'
      h='100dvh'
    >
      <ServicesRunner />
      <Modal isOpen={!socket} isCentered onClose={() => void null}>
        <ModalOverlay />
        <ModalContent alignItems='center' p='8'>
          <ModalBody textAlign='center'>
            <Spinner size='xl' />
            <Text mt='4' fontSize='sm'>
              Connecting to server...
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      {socket && (
        <>
          <TheHeader />
          <TheMiddle />
          <TheFooter />
        </>
      )}
    </Box>
  );
}

function TheHeader() {
  return (
    <Flex
      key='TheHeader'
      position='fixed'
      top={0}
      left={0}
      right={0}
      justifyContent='center'
      alignItems='center'
      // backgroundColor={useColorModeValue('gray.100', 'gray.900')}
      zIndex={10}
      className='TheHeader'
      pointerEvents='none'
    >
      <TheAreaAtTheTop />
    </Flex>
  );
}

function TheFooter() {
  return (
    <Flex
      position='fixed'
      bottom={0}
      left={0}
      right={0}
      height='64px'
      px='4'
      zIndex={10}
      justifyContent='center'
      alignItems='center'
      pointerEvents='none'
      className='TheFooter'
    >
      <TheAreaAtTheBottom />
    </Flex>
  );
}

function TheMiddle() {
  const consoleLogContainerRef = useRef<HTMLDivElement>(null);
  const { outputSegments } = useContextStore();
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  function scrollToBottom() {
    const container = consoleLogContainerRef.current;

    if (!container) {
      console.log('no container');
      return;
    }

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    container.scrollTo({ top: maxScrollTop, behavior: 'smooth' });

    setShowScrollButton(false);
  }

  function handleScroll() {
    const container = consoleLogContainerRef.current;

    if (!container) {
      console.log('no container');
      return;
    }

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    const delta = maxScrollTop - container.scrollTop;

    const maxDeltaForAutoScroll = container.clientHeight * 0.5;
    setShowScrollButton(delta > maxDeltaForAutoScroll);
  }

  useEffect(() => {
    const container = consoleLogContainerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const container = consoleLogContainerRef.current;

    if (!container) {
      console.log('no container');
      return;
    }

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    const delta = maxScrollTop - container.scrollTop;
    const shouldAutoScroll = delta < 10 || maxScrollTop <= 0;

    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [outputSegments]);

  return (
    <>
      {showScrollButton && (
        <Center
          position='absolute'
          bottom='10dvh'
          w='full'
          zIndex={99}
          pointerEvents='none'
        >
          <Button
            onClick={scrollToBottom}
            aria-label='Scroll to bottom'
            leftIcon={<ChevronDownIcon />}
            rightIcon={<ChevronDownIcon />}
            className='ScrollToBottomButton withPopInAnimation withShadow'
            pointerEvents='all'
            rounded='full'
            size='lg'
          >
            Scroll to bottom
          </Button>
        </Center>
      )}
      <Box
        ref={consoleLogContainerRef}
        key='main-area'
        py='64px'
        position='relative'
        h='full'
        className='TheMiddle pretty-scrollbar main-area'
        overflow='auto'
      >
        <TheAreaInTheMiddle />
      </Box>
    </>
  );
}

export default App;
