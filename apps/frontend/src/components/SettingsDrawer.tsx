import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { SettingsDrawerContent } from './SettingsDrawerContent';

export function SettingsDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();

  return (
    <>
      <IconButton
        ref={btnRef}
        aria-label='Open settings menu'
        colorScheme='gray'
        variant='ghost'
        rounded='full'
        size='lg'
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement='right'
        size='md'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size='lg' m='3'>
              Auto-GPT WebUI
            </Heading>
          </DrawerHeader>

          <DrawerBody className='pretty-scrollbar'>
            <SettingsDrawerContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
