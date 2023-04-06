import { Grid, GridItem, useColorMode } from '@chakra-ui/react';
import './App.css';
import { ActionBar } from './components/ActionBar';
import { TaskOutputArea } from './components/TaskOutputArea';
import { SidebarContent } from './components/SidebarContent';
import { UserInputBar } from './components/UserInputBar';
import useWebSocketConnection from './hooks/useWebSocketConnection';
import { useEffect } from 'react';

function App() {
  useWebSocketConnection('ws://localhost:2200');

  const { colorMode, setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode('light');
  }, [colorMode, setColorMode]);

  return (
    <>
      <Grid
        templateAreas={`
          "nav header"
          "nav main"
          "nav footer"
        `}
        gridTemplateRows={'auto 1fr auto'}
        gridTemplateColumns={'280px 1fr'}
        gap='1'
        p={1}
        h='100dvh'
        w='100dvw'
        maxW={'100vw'}
        maxH={'100vh'}
        overflow='hidden'
        color='blackAlpha.700'
        fontWeight='bold'
      >
        <GridItem rounded='sm' p='2' bg='orange.300' area={'header'}>
          <ActionBar />
        </GridItem>
        <GridItem rounded='sm' p='2' bg='pink.300' area={'nav'}>
          <SidebarContent />
        </GridItem>
        <GridItem
          rounded='sm'
          p='2'
          // bg='green.300'
          area='main'
          overflow='auto'
          className='pretty-scrollbar main-area'
          position='relative'
        >
          <div className='bg'></div>
          <TaskOutputArea />
        </GridItem>
        <GridItem rounded='sm' p='2' bg='blue.300' area={'footer'}>
          <UserInputBar />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
