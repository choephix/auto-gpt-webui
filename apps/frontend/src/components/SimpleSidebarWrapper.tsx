import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

type SimpleSidebarProps = {
  sidebarContent?: ReactNode;
  children?: ReactNode;
};
export default function SimpleSidebarWrapper({
  children,
  sidebarContent = null,
}: SimpleSidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <SidebarContentWrapper
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        sidebarContent={sidebarContent}
        bg={useColorModeValue('gray.50', 'gray.900')}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContentWrapper
            onClose={onClose}
            sidebarContent={sidebarContent}
            bg={useColorModeValue('gray.50', 'gray.900')}
          />
        </DrawerContent>
      </Drawer>

      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />

      <Box ml={{ base: 0, md: 60 }} p='4' h='100%'>
        {children}
      </Box>
    </div>
  );
}

interface SidebarProps extends BoxProps {
  sidebarContent: ReactNode;
  onClose: () => void;
}

const SidebarContentWrapper = ({ onClose, sidebarContent, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {sidebarContent}
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height='20'
      alignItems='center'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent='flex-start'
      {...rest}
    >
      <IconButton
        variant='outline'
        onClick={onOpen}
        aria-label='open menu'
        icon={<HamburgerIcon />}
      />

      <Text fontSize='2xl' ml='8' fontFamily='monospace' fontWeight='bold'>
        Logo
      </Text>
    </Flex>
  );
};
