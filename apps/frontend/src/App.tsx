import { TheAreaAtTheBottom } from './components/TheAreaAtTheBottom';
import { TheAreaAtTheTop } from './components/TheAreaAtTheTop';
import { TheAreaInTheMiddle } from './components/TheAreaInTheMiddle';
import { ServicesRunner } from './components/TheHiddenServiceRunner';

import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useContextStore } from './store/useContextStore';

import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function App() {
  const { socket } = useContextStore();

  return (
    <Box className='app-root animatedbg' overflow='hidden' h='100dvh'>
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
      justifyContent='center'
      alignItems='center'
      backgroundColor={useColorModeValue('#97ebcf', '#0007')}
      zIndex={10}
      px='4'
      className='TheFooter'
      pointerEvents='none'
      _before={{
        content: '""',
        position: 'absolute',
        top: '-100px',
        left: 0,
        right: 0,
        height: '100px',
        background: `linear-gradient(to bottom, #fff0 0%, #97ebcf 100%)`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'bottom',
        backgroundSize: '100% 100px',
      }}
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
    container.scrollTop = maxScrollTop;
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
            className='withPopInAnimation withShadow'
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
