import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  IconButton,
  Spacer,
  Link,
  Divider,
} from '@chakra-ui/react';

export function AboutInfoModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        aria-label='Open settings menu'
        colorScheme='blue'
        variant='ghost'
        rounded='full'
        size='lg'
        icon={<InfoOutlineIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About this project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb='3'>
              <b>Auto-GPT WebUI</b> is a frontend web application built to
              interact seamlessly with the{' '}
              <Link
                href='https://github.com/Torantulino/Auto-GPT'
                isExternal
                fontWeight='bold'
              >
                Auto-GPT
              </Link>{' '}
              in the backend.
            </Text>
            <Text mb='3'>
              🌟 This project wouldn't be possible without the amazing work of{' '}
              <Link
                href='https://github.com/Torantulino'
                isExternal
                fontWeight='bold'
              >
                Torantulino
              </Link>
              , the author of the{' '}
              <Link
                href='https://github.com/Torantulino/Auto-GPT'
                isExternal
                fontWeight='bold'
              >
                original project.
              </Link>{' '}
            </Text>
            <Text mb='3'>
              This project was built primarily for the developer's personal
              amusement, so availability to maintain and update the project may
              be limited. However, community involvement and contributions are
              always welcome and highly appreciated.
            </Text>

            <Divider />
            <Text mt='3' fontSize='xs'>
              <i>
                Thank you for using Auto-GPT WebUI, and I hope you find it
                helpful!
              </i>{' '}
              🤍
            </Text>
            <Spacer h='30px' />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
import React from 'react';
