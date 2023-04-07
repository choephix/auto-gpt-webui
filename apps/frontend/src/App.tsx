import { Grid, GridItem, useColorMode } from '@chakra-ui/react';
import './App.css';
import { ActionBar } from './components/ActionBar';
import { TaskOutputArea } from './components/TaskOutputArea';
import { SidebarContent } from './components/SidebarContent';
import { UserInputBar } from './components/UserInputBar';
import { ServicesRunner } from './components/ServicesRunner';

function App() {
  // const { colorMode, setColorMode } = useColorMode();
  // useEffect(() => {
  //   setColorMode('light');
  // }, [colorMode, setColorMode]);

  console.log('App rendered.');

  return (
    <>
      <ServicesRunner />
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
          className='pretty-scrollbar main-area animatedbg'
          position='relative'
          key='main-area'
        >
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
