import { Grid, GridItem } from '@chakra-ui/react';
import './App.css';
import { ActionBar } from './components/ActionBar';
import { OutputBox } from './components/OutputBox';
import { SidebarContent } from './components/SidebarContent';
import { UserInputBar } from './components/UserInputBar';
import useWebSocketConnection from './hooks/useWebSocketConnection';

function App() {
  const socket = useWebSocketConnection('ws://localhost:2200');

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
        <GridItem p='2' bg='orange.300' area={'header'}>
          <ActionBar />
        </GridItem>
        <GridItem p='2' bg='pink.300' area={'nav'}>
          <SidebarContent />
        </GridItem>
        <GridItem p='2' bg='green.300' area='main' overflow='auto'>
          <OutputBox socket={socket} />
        </GridItem>
        <GridItem p='2' bg='blue.300' area={'footer'}>
          <UserInputBar />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
