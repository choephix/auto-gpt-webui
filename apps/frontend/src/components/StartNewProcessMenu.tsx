import { Container, Heading } from '@chakra-ui/react';
import { ListOfAIProfiles } from './ListOfAIProfiles';

export function StartNewProcessMenu() {
  return (
    <>
      <Container
        className='withSlideDownAnimation'
        maxW='full'
        display='relative'
        p={0}
      >
        <Heading as='h3' size='lg' mt='16' mb='8'>
          Select a profile to start a new process.
        </Heading>
        <ListOfAIProfiles showAddButton />
      </Container>
    </>
  );
}
