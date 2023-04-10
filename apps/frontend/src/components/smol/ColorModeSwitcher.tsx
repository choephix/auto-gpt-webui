import { IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  return (
    <IconButton
      aria-label='Toggle color mode'
      icon={isDarkMode ? <FaSun /> : <FaMoon />}
      onClick={toggleColorMode}
      size='md'
      variant='ghost'
    />
  );
};

export default ColorModeSwitcher;
